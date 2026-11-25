$path = "c:\Users\T14\Desktop\my_advc\My-Tawjihe-fixed\My-Tawjihe\frontend\src\translations\en.ts"
$content = Get-Content $path -Raw

$newContent = $content -replace '(?s)showPassword: ''Show password''\s+hidePassword: ''Hide password''\s+}\s+exercices: \{\s+answerNote: "Your answer — the AI will auto-correct"\s+showPassword: ''Show password''\s+hidePassword: ''Hide password''\s+exercices: \{\s+}\s+exercices: \{\s+answerNote: "Your answer — the AI will auto-correct"\s+}\s+exercices: \{\s+}','showPassword: ''Show password''
        hidePassword: ''Hide password''
      }'

Set-Content $path -Value $newContent -NoNewline
Write-Host "Fixed!"
