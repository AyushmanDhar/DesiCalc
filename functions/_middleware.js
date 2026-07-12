export async function onRequest(context) {
  const { request, next } = context;
  const accept = request.headers.get('Accept') || '';

  const url = new URL(request.url);
  if (url.pathname.startsWith('/mcp')) {
    return next();
  }

  if (!accept.includes('text/markdown')) {
    return next();
  }

  const path = url.pathname;

  const skipExts = new Set([
    '.css', '.js', '.json', '.xml', '.png', '.jpg', '.jpeg',
    '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf',
    '.eot', '.pdf', '.zip', '.webmanifest', '.map',
  ]);
  const dot = path.lastIndexOf('.');
  const ext = dot > 0 ? path.slice(dot).toLowerCase() : '';
  if (skipExts.has(ext) || path.includes('/assets/')) {
    return next();
  }

  const original = await next();
  const ct = original.headers.get('Content-Type') || '';

  if (!ct.includes('text/html')) {
    return original;
  }

  const html = await original.text();
  const markdown = convert(html, url);

  const tokens = Math.ceil(markdown.length / 4);
  const origTokens = Math.ceil(html.length / 4);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'x-markdown-tokens': String(tokens),
      'x-original-tokens': String(origTokens),
      'Vary': 'Accept',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

function convert(html, baseUrl) {
  const frontmatter = {};
  const jsonld = [];

  let s = html;

  const titleMatch = s.match(/<title[^>]*>([^<]*)<\/title>/i);
  if (titleMatch) frontmatter.title = titleMatch[1].trim();

  const descMatch = s.match(
    /<meta\s+[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i,
  );
  if (descMatch) frontmatter.description = descMatch[1].trim();

  const jl = s.matchAll(
    /<script[\s\S]*?type=["']application\/ld\+json["'][\s\S]*?>([\s\S]*?)<\/script>/gi,
  );
  for (const m of jl) {
    try {
      JSON.parse(m[1]);
      jsonld.push(m[1].trim());
    } catch {
    }
  }

  s = s.replace(/<!DOCTYPE[^>]*>/gi, '');
  while (s !== (s = s.replace(/<!--[\s\S]*?-->/gi, ''))) {}
  s = s.replace(/<head[\s\S]*?<\/head>/gi, '');
  while (s !== (s = s.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ''))) {}
  s = s.replace(/<(header|footer|nav|aside)[\s\S]*?<\/\1>/gi, '');
  s = s.replace(
    /<section[\s\S]*?data-ad-slot[\s\S]*?>[\s\S]*?<\/section>/gi,
    '',
  );
  s = s.replace(
    /<(div|span|button)[\s\S]*?class="[^"]*(?:toast|sr-only|back-to-top|faq-icon)[^"]*"[\s\S]*?>[\s\S]*?<\/\1>/gi,
    '',
  );
  while (s !== (s = s.replace(/[\s]on\w+\s*=\s*"[^"]*"/gi, ''))) {}
  while (s !== (s = s.replace(/[\s]on\w+\s*=\s*'[^']*'/gi, ''))) {}
  while (s !== (s = s.replace(/[\s]on\w+\s*=\s*\S+/gi, ''))) {}
  s = s.replace(/<link[^>]*>/gi, '');
  s = s.replace(/<meta[^>]*>/gi, '');

  const main = s.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  const body = s.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  let content = main ? main[1] : body ? body[1] : s;

  while (content !== (content = content.replace(
    /<script[\s\S]*?type=["']application\/ld\+json["'][\s\S]*?>[\s\S]*?<\/script>/gi,
    '',
  ))) {}

  let md = '';

  if (frontmatter.title || frontmatter.description) {
    md += '---\n';
    if (frontmatter.title) md += `title: ${frontmatter.title}\n`;
    if (frontmatter.description)
      md += `description: ${frontmatter.description}\n`;
    md += '---\n\n';
  }

  content = convertTables(content);
  content = convertLists(content);
  content = convertFaqs(content);
  content = convertPre(content);
  md += convertInline(content, baseUrl);

  if (jsonld.length) {
    md += '\n```json\n' + jsonld.join('\n\n') + '\n```\n';
  }

  md = md.replace(/\n{4,}/g, '\n\n\n');
  md = md.trim();

  return md;
}

function convertTables(html) {
  return html.replace(
    /<table[^>]*>([\s\S]*?)<\/table>/gi,
    (_, inner) => {
      const rows = [];
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let trMatch;
      while ((trMatch = trRegex.exec(inner)) !== null) {
        const cells = [];
        const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        let cellMatch;
        while ((cellMatch = cellRegex.exec(trMatch[1])) !== null) {
          let cellText = cellMatch[1];
          cellText = stripTags(cellText);
          cellText = cellText.replace(/\s+/g, ' ').trim();
          cells.push(cellText);
        }
        rows.push(cells);
      }

      if (rows.length < 1) return '';

      let table = '';
      const header = rows[0];
      table += '| ' + header.join(' | ') + ' |\n';
      table += '| ' + header.map(() => '---') .join(' | ') + ' |\n';
      for (let i = 1; i < rows.length; i++) {
        table += '| ' + rows[i].join(' | ') + ' |\n';
      }
      return '\n' + table.trim() + '\n';
    },
  );
}

function convertLists(html) {
  html = html.replace(
    /<ul[^>]*>([\s\S]*?)<\/ul>/gi,
    (_, inner) => {
      let result = '\n';
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let m;
      while ((m = liRegex.exec(inner)) !== null) {
        let text = m[1];
        text = stripTags(text);
        text = text.replace(/\s+/g, ' ').trim();
        if (text) result += '- ' + text + '\n';
      }
      return result;
    },
  );

  html = html.replace(
    /<ol[^>]*>([\s\S]*?)<\/ol>/gi,
    (_, inner) => {
      let result = '\n';
      let idx = 1;
      const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
      let m;
      while ((m = liRegex.exec(inner)) !== null) {
        let text = m[1];
        text = stripTags(text);
        text = text.replace(/\s+/g, ' ').trim();
        if (text) result += idx + '. ' + text + '\n';
        idx++;
      }
      return result;
    },
  );

  return html;
}

function convertFaqs(html) {
  return html.replace(
    /<div[^>]*class="[^"]*faq-item[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi,
    (_, inner) => {
      const qMatch = inner.match(
        /<button[^>]*>[\s\S]*?<span>([\s\S]*?)<\/span>/i,
      );
      const aMatch = inner.match(
        /<div[^>]*class="[^"]*faq-answer[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
      );
      let result = '\n';
      if (qMatch) {
        let qText = qMatch[1];
        qText = stripTags(qText);
        qText = qText.replace(/\s+/g, ' ').trim();
        result += '**' + qText + '**\n\n';
      }
      if (aMatch) {
        let aText = aMatch[1];
        aText = stripTags(aText);
        aText = aText.replace(/\s+/g, ' ').trim();
        result += aText + '\n';
      }
      return result;
    },
  );
}

function convertPre(html) {
  return html.replace(
    /<pre[^>]*>([\s\S]*?)<\/pre>/gi,
    (_, inner) => {
      const code = inner
        .replace(/<code[^>]*>/gi, '')
        .replace(/<\/code>/gi, '')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c));
      return '\n```\n' + code.trim() + '\n```\n';
    },
  );
}

function convertInline(html, baseUrl) {
  let s = html;

  s = s.replace(/<br\s*\/?>/gi, '\n');

  s = s.replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, (_, t) => {
    return '\n# ' + stripTags(t) + '\n';
  });
  s = s.replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, (_, t) => {
    return '\n## ' + stripTags(t) + '\n';
  });
  s = s.replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, (_, t) => {
    return '\n### ' + stripTags(t) + '\n';
  });
  s = s.replace(/<h4[^>]*>([\s\S]*?)<\/h4>/gi, (_, t) => {
    return '\n#### ' + stripTags(t) + '\n';
  });
  s = s.replace(/<h5[^>]*>([\s\S]*?)<\/h5>/gi, (_, t) => {
    return '\n##### ' + stripTags(t) + '\n';
  });
  s = s.replace(/<h6[^>]*>([\s\S]*?)<\/h6>/gi, (_, t) => {
    return '\n###### ' + stripTags(t) + '\n';
  });

  s = s.replace(/<hr\s*\/?>/gi, '\n---\n');

  s = s.replace(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi, (_, t) => {
    const inner = stripTags(t).trim();
    return (
      '\n> ' +
      inner.replace(/\n/g, '\n> ') +
      '\n'
    );
  });

  s = s.replace(/<img[^>]*src=["']([^"']*)["'][^>]*alt=["']([^"']*)["'][^>]*\/?>/gi, '![$2]($1)');
  s = s.replace(/<img[^>]*src=["']([^"']*)["'][^>]*\/?>/gi, '![]($1)');

  s = s.replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**');
  s = s.replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**');
  s = s.replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, '*$1*');
  s = s.replace(/<i[^>]*>([\s\S]*?)<\/i>/gi, '*$1*');
  s = s.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, '`$1`');

  s = s.replace(
    /<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi,
    (_, href, text) => {
      text = stripTags(text).trim();
      if (!text) return '';
      const resolved = href.startsWith('/') || href.startsWith('http')
        ? href
        : new URL(href, baseUrl).href;
      return '[' + text + '](' + resolved + ')';
    },
  );

  s = s.replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, (_, t) => {
    return '\n' + stripTags(t).trim() + '\n';
  });

  s = s.replace(/<div[^>]*>([\s\S]*?)<\/div>/gi, (_, t) => {
    return '\n' + stripTags(t).trim() + '\n';
  });

  s = s.replace(/<span[^>]*>([\s\S]*?)<\/span>/gi, (_, t) => t);

  s = s.replace(/<section[^>]*>([\s\S]*?)<\/section>/gi, (_, t) => {
    return '\n' + stripTags(t).trim() + '\n';
  });

  s = s.replace(/<(?:label|button|input|select|textarea|form)[^>]*>[\s\S]*?<\/\1>/gi, '');
  s = s.replace(/<(?:label|button|input|select|textarea|form|img|br|hr)[^>]*\/?>/gi, '');

  s = stripTags(s);

  s = s.replace(/&lt;/g, '<');
  s = s.replace(/&gt;/g, '>');
  s = s.replace(/&quot;/g, '"');
  s = s.replace(/&#39;/g, "'");
  s = s.replace(/&nbsp;/g, ' ');
  s = s.replace(/&#(\d+);/g, (_, c) => String.fromCharCode(c));
  s = s.replace(/&amp;/g, '&');

  s = s.replace(/[ \t]+/g, ' ');
  s = s.replace(/\n{3,}/g, '\n\n');
  s = s.replace(/^\n+/, '');
  s = s.replace(/\n+$/, '');

  return s;
}

function stripTags(s) {
  while (true) { let r = s; s = s.replace(/<[^>]*>/gi, ''); if (s === r) break; }
  return s;
}

