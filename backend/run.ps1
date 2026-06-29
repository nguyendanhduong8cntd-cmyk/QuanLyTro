# Script chay nhanh backend tren Windows (PowerShell)
# Cach dung:  .\run.ps1            -> chay ung dung
#             .\run.ps1 build      -> build JAR
#             .\run.ps1 clean      -> clean

$ErrorActionPreference = 'Stop'

# Tu dong tim JAVA_HOME neu chua set (uu tien JDK moi nhat trong C:\Program Files\Java)
if (-not $env:JAVA_HOME -or -not (Test-Path (Join-Path $env:JAVA_HOME 'bin\javac.exe'))) {
    $jdk = Get-ChildItem 'C:\Program Files\Java' -Directory -ErrorAction SilentlyContinue |
           Where-Object { Test-Path (Join-Path $_.FullName 'bin\javac.exe') } |
           Sort-Object Name -Descending | Select-Object -First 1
    if ($jdk) {
        $env:JAVA_HOME = $jdk.FullName
        Write-Host "JAVA_HOME = $($env:JAVA_HOME)" -ForegroundColor Cyan
    } else {
        Write-Warning "Khong tim thay JDK trong C:\Program Files\Java. Vui long set JAVA_HOME thu cong."
    }
}

# Uu tien Maven Wrapper; neu khong co thi dung Maven da cai o C:\Users\ADMIN\tools
$mvnw = Join-Path $PSScriptRoot 'mvnw.cmd'
$mvnGlobal = 'C:\Users\ADMIN\tools\apache-maven-3.9.9\bin\mvn.cmd'
if (Test-Path $mvnw)      { $mvn = $mvnw }
elseif (Test-Path $mvnGlobal) { $mvn = $mvnGlobal }
else { throw "Khong tim thay Maven (mvnw.cmd hoac mvn.cmd)" }

$cmd = if ($args.Count -gt 0) { $args[0] } else { 'run' }

switch ($cmd) {
    'build' { & $mvn -f (Join-Path $PSScriptRoot 'pom.xml') -DskipTests package }
    'clean' { & $mvn -f (Join-Path $PSScriptRoot 'pom.xml') clean }
    default { & $mvn -f (Join-Path $PSScriptRoot 'pom.xml') spring-boot:run }
}
