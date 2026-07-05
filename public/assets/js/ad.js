(function() {
  var AD_TAGS = {
    sidebar_top_income_tax: '<ins style="width:300px;height:250px" data-width="300" data-height="250" class="ic4c1ef42c4" data-domain="//data527.click" data-affquery="/a0699d3fbee38a6e7d3e/c4c1ef42c4/?placementName=sidebar_top_income_tax"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    in_content_income_tax: '<ins style="width:728px;height:90px" data-width="728" data-height="90" class="k167215d9e9" data-domain="//data527.click" data-affquery="/3cd431ceb2117805f8a8/167215d9e9/?placementName=in_content_income_tax"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    sidebar_top_stamp_duty: '<ins style="width:300px;height:250px" data-width="300" data-height="250" class="a5b24fbeab2" data-domain="//data527.click" data-affquery="/a0699d3fbee38a6e7d3e/5b24fbeab2/?placementName=sidebar_top_stamp_duty"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    in_content_stamp_duty: '<ins style="width:728px;height:90px" data-width="728" data-height="90" class="naf2187c044" data-domain="//data527.click" data-affquery="/3cd431ceb2117805f8a8/af2187c044/?placementName=in_content_stamp_duty"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    sidebar_top_rto_tax: '<ins style="width:300px;height:250px" data-width="300" data-height="250" class="v9e1ddb597f" data-domain="//data527.click" data-affquery="/a0699d3fbee38a6e7d3e/9e1ddb597f/?placementName=sidebar_top_rto_tax"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    in_content_rto_tax: '<ins style="width:728px;height:90px" data-width="728" data-height="90" class="m325bd96716" data-domain="//data527.click" data-affquery="/3cd431ceb2117805f8a8/325bd96716/?placementName=in_content_rto_tax"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    in_content_home: '<ins style="width:728px;height:90px" data-width="728" data-height="90" class="y6e7256b01f" data-domain="//data527.click" data-affquery="/3cd431ceb2117805f8a8/6e7256b01f/?placementName=in_content_home"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>',
    footer_main: '<ins style="width:728px;height:90px" data-width="728" data-height="90" class="h894273e566" data-domain="//data527.click" data-affquery="/3cd431ceb2117805f8a8/894273e566/?placementName=footer_main"><script src="//data527.click/js/responsive.js" async><\/script><\/ins>'
  };

  var PAGE_SLOTS = {
    'income-tax': ['sidebar_top_income_tax', 'in_content_income_tax'],
    'stamp-duty': ['sidebar_top_stamp_duty', 'in_content_stamp_duty'],
    'rto-tax': ['sidebar_top_rto_tax', 'in_content_rto_tax'],
    'index': ['in_content_home']
  };

  function getPageKey() {
    var path = window.location.pathname;
    if (path.indexOf('income-tax') > -1) return 'income-tax';
    if (path.indexOf('stamp-duty') > -1) return 'stamp-duty';
    if (path.indexOf('rto-tax') > -1) return 'rto-tax';
    return 'index';
  }

  function injectAds() {
    var pageKey = getPageKey();
    var slots = PAGE_SLOTS[pageKey] || [];
    slots.push('footer_main');
    slots.forEach(function(tagKey) {
      var els = document.querySelectorAll('[data-ad-slot="' + tagKey + '"]');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (!el.querySelector('ins')) {
          el.insertAdjacentHTML('beforeend', AD_TAGS[tagKey]);
        }
      }
    });
  }

  if ('requestIdleCallback' in window) {
    requestIdleCallback(injectAds, { timeout: 2000 });
  } else {
    setTimeout(injectAds, 1000);
  }
})();
