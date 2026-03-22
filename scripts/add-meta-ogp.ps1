# Add Meta Description + OGP tags to all HTML files
# Uses English descriptions for all languages (standard for multilingual SEO)

$baseDir = Split-Path $PSScriptRoot -Parent
$domain = "https://secaihub.com"

$descriptions = @{}
$descriptions["index.html"] = "Comprehensive OWASP Top 10 reference for AI, web, cloud, and DevOps security. 8 categories, 80+ risks covered."
$descriptions["owasp-top10.html"] = "OWASP API Security Top 10 - Critical API vulnerabilities with code examples and mitigations."
$descriptions["owasp-llm-top10.html"] = "OWASP Top 10 for LLM Applications - Security risks for large language models with Python examples."
$descriptions["owasp-agentic-top10.html"] = "OWASP Agentic Security Top 10 - Security risks for AI agent systems with Python examples."
$descriptions["owasp-ml-top10.html"] = "OWASP ML Security Top 10 - Machine learning model security risks with Python examples."
$descriptions["owasp-webapp-top10.html"] = "OWASP Web Application Top 10 2025 - Critical web security risks with code examples."
$descriptions["owasp-cloud-top10.html"] = "OWASP Cloud-Native Top 10 - Cloud-native application security risks with Kubernetes and Terraform examples."
$descriptions["owasp-cicd-top10.html"] = "OWASP CI/CD Security Top 10 - Pipeline security risks with GitHub Actions and Jenkins examples."
$descriptions["owasp-k8s-top10.html"] = "OWASP Kubernetes Top 10 - Container orchestration security risks with YAML and Helm examples."
$descriptions["auth.html"] = "Authentication and Authorization best practices - OAuth 2.0, JWT, API keys for secure API development."
$descriptions["rate-limiting.html"] = "Rate Limiting and Input Validation - API protection techniques including CORS and request throttling."
$descriptions["tools.html"] = "Security Testing Tools - Burp Suite, OWASP ZAP, Semgrep and more for API and web security."
$descriptions["guidelines.html"] = "Security Guidelines and Checklists for development teams - review criteria and best practices."
$descriptions["news.html"] = "Latest AI and API Security News - CVE, vulnerabilities, industry trends and updates."
$descriptions["vendor-blogs.html"] = "Security Vendor Blog Aggregator - latest insights from industry security vendors."

$langs = @("en", "ja", "es", "pt", "fr")
$count = 0

foreach ($lang in $langs) {
    $langDir = Join-Path $baseDir $lang
    if (-not (Test-Path $langDir)) { continue }

    $htmlFiles = Get-ChildItem -Path $langDir -Filter "*.html"

    foreach ($file in $htmlFiles) {
        $fileName = $file.Name
        $desc = $descriptions[$fileName]
        if (-not $desc) { continue }

        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

        if ($content -match 'og:title') {
            Write-Host "SKIP: $lang/$fileName"
            continue
        }

        $ogUrl = "$domain/$lang/$fileName"

        $titleMatch = [regex]::Match($content, '<title[^>]*>([^<]+)</title>')
        $pageTitle = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "AI Security Hub" }

        $nl = "`n"
        $metaTags = "  <meta name=`"description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:title`" content=`"$pageTitle`">$nl"
        $metaTags += "  <meta property=`"og:description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:type`" content=`"website`">$nl"
        $metaTags += "  <meta property=`"og:url`" content=`"$ogUrl`">$nl"
        $metaTags += "  <meta property=`"og:site_name`" content=`"AI Security Hub`">$nl"
        $metaTags += "  <meta name=`"twitter:card`" content=`"summary`">"

        $content = $content -replace '(<link rel="stylesheet" href="[^"]+">)', "`$1`n$metaTags"

        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
        $count++
        Write-Host "OK: $lang/$fileName"
    }
}

# Handle templates
$templatesDir = Join-Path $baseDir "templates"
if (Test-Path $templatesDir) {
    $htmlFiles = Get-ChildItem -Path $templatesDir -Filter "*.html"
    foreach ($file in $htmlFiles) {
        $fileName = $file.Name
        $desc = $descriptions[$fileName]
        if (-not $desc) { continue }

        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)

        if ($content -match 'og:title') {
            Write-Host "SKIP: templates/$fileName"
            continue
        }

        $ogUrl = "$domain/en/$fileName"
        $titleMatch = [regex]::Match($content, '<title[^>]*>([^<]+)</title>')
        $pageTitle = if ($titleMatch.Success) { $titleMatch.Groups[1].Value } else { "AI Security Hub" }

        $nl = "`n"
        $metaTags = "  <meta name=`"description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:title`" content=`"$pageTitle`">$nl"
        $metaTags += "  <meta property=`"og:description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:type`" content=`"website`">$nl"
        $metaTags += "  <meta property=`"og:url`" content=`"$ogUrl`">$nl"
        $metaTags += "  <meta property=`"og:site_name`" content=`"AI Security Hub`">$nl"
        $metaTags += "  <meta name=`"twitter:card`" content=`"summary`">"

        $content = $content -replace '(<link rel="stylesheet" href="[^"]+">)', "`$1`n$metaTags"

        [System.IO.File]::WriteAllText($file.FullName, $content, (New-Object System.Text.UTF8Encoding $false))
        $count++
        Write-Host "OK: templates/$fileName"
    }
}

# Handle root index.html
$rootIndex = Join-Path $baseDir "index.html"
if (Test-Path $rootIndex) {
    $content = [System.IO.File]::ReadAllText($rootIndex, [System.Text.Encoding]::UTF8)
    if ($content -notmatch 'og:title') {
        $desc = "AI Security Hub - Comprehensive OWASP Top 10 reference for AI, web, cloud, and DevOps security."
        $nl = "`n"
        $metaTags = "$nl  <meta name=`"description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:title`" content=`"AI Security Hub`">$nl"
        $metaTags += "  <meta property=`"og:description`" content=`"$desc`">$nl"
        $metaTags += "  <meta property=`"og:type`" content=`"website`">$nl"
        $metaTags += "  <meta property=`"og:url`" content=`"$domain/`">$nl"
        $metaTags += "  <meta property=`"og:site_name`" content=`"AI Security Hub`">$nl"
        $metaTags += "  <meta name=`"twitter:card`" content=`"summary`">"

        $content = $content -replace '(<title>AI Security Hub</title>)', "`$1$metaTags"

        [System.IO.File]::WriteAllText($rootIndex, $content, (New-Object System.Text.UTF8Encoding $false))
        $count++
        Write-Host "OK: index.html (root)"
    }
}

Write-Host ""
Write-Host "Done! Processed $count files."
