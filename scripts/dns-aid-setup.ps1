param(
  [Parameter(Mandatory = $true)] [string] $ZoneName = "desicalc.in",
  [Parameter(Mandatory = $true)] [string] $ApiToken
)

$BASE = "https://api.cloudflare.com/client/v4"
$HEADERS = @{ "Authorization" = "Bearer $ApiToken"; "Content-Type" = "application/json" }

# Resolve zone ID
$zoneResp = Invoke-RestMethod -Uri "$BASE/zones?name=$ZoneName" -Headers $HEADERS
if (-not $zoneResp.success -or $zoneResp.result.Count -eq 0) {
  Write-Error "Zone $ZoneName not found or API error"; exit 1
}
$zoneId = $zoneResp.result[0].id
Write-Host "Zone ID: $zoneId"

# Resolve A/AAAA records for TargetName
$targetName = "desicalc.in"
$ipv4 = (Resolve-DnsName $targetName -Type A | Select-Object -First 1 -ExpandProperty IPAddress)
$ipv6 = (Resolve-DnsName $targetName -Type AAAA | Select-Object -First 1 -ExpandProperty IPAddress)
Write-Host "IPv4: $ipv4  IPv6: $ipv6"

function Add-HttpsRecord {
  param(
    [string] $Name,
    [int] $Priority = 1,
    [string] $Target,
    [string] $Value,
    [int] $Ttl = 3600
  )
  $body = @{
    type = "HTTPS"
    name = $Name
    data = @{
      priority = $Priority
      target   = $Target
      value    = $Value
    }
    ttl  = $Ttl
  } | ConvertTo-Json

  Write-Host "  -> POST $Name HTTPS : $Value"
  try {
    $resp = Invoke-RestMethod -Uri "$BASE/zones/$zoneId/dns_records" -Headers $HEADERS -Method Post -Body $body
    if ($resp.success) { Write-Host "  OK  $Name" }
    else { Write-Host "  FAIL $Name : $($resp.errors[0].message)" }
  } catch {
    $err = $_.Exception.Response
    if ($err.StatusCode -eq 409) {
      Write-Host "  EXISTS $Name"
    } else {
      $reader = New-Object System.IO.StreamReader($err.GetResponseStream())
      $errBody = $reader.ReadToEnd() | ConvertFrom-Json
      $msg = if ($errBody.errors) { $errBody.errors[0].message } else { $_.Exception.Message }
      Write-Host "  FAIL $Name : $msg"
    }
  }
}

Write-Host "`nPublishing DNS-AID records for $ZoneName ...`n"

# Each record: priority target svcparams
# svcparams format: key=value or key="quoted value" as per RFC 9460

# Core DNS-AID records (required per draft-mozleywilliams-dnsop-dnsaid)
# _index._agents.<domain>  — organization-level agent index entry point
# _a2a._agents.<domain>    — A2A protocol discovery endpoint

Add-HttpsRecord -Name "_index._agents.$ZoneName" -Target $targetName -Value "alpn=`"h2,h3`" port=443 ipv4hint=$ipv4 ipv6hint=$ipv6"

Add-HttpsRecord -Name "_a2a._agents.$ZoneName" -Target $targetName -Value "alpn=`"a2a,h2,h3`" port=443 mandatory=alpn,port ipv4hint=$ipv4 ipv6hint=$ipv6"

# Optional: individual agent leaf records under _agents.<domain>
# Cloudflare's HTTPS record validator accepts only registered RFC 9460 SvcParamKeys.
# For experimental DNS-AID params (like well-known, cap), use numeric keyNNNNN format
# in the Private Use range 65280-65534, e.g. key65280="/.well-known/agent-card.json"

Write-Host "`nDone! Enable DNSSEC in Cloudflare Dashboard -> DNS -> Settings -> DNSSEC."
