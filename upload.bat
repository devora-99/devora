@echo off
chcp 65001 >nul

"C:\Program Files (x86)\WinSCP\WinSCP.com" ^
  /command ^
    "open sftp://ubuntu@168.107.11.48 -privatekey=""C:\Users\wnghk\Desktop\project\devora\devora.ppk""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\index.html""  ""/var/www/html/index.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\admin.html""  ""/var/www/html/admin.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\status.html"" ""/var/www/html/status.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\portfolio.html"" ""/var/www/html/portfolio.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\reviews.html"" ""/var/www/html/reviews.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\store.html"" ""/var/www/html/store.html""" ^
    "put ""C:\Users\wnghk\Desktop\project\devora\views-analytics.js"" ""/var/www/html/views-analytics.js""" ^
    "exit"

if %errorlevel% equ 0 (
    echo Upload complete!
    echo   http://168.107.11.48
    echo   http://168.107.11.48/admin.html
    echo   http://168.107.11.48/status.html
) else (
    echo Trying alternate WinSCP path...
    "C:\Program Files\WinSCP\WinSCP.com" ^
      /command ^
        "open sftp://ubuntu@168.107.11.48 -privatekey=""C:\Users\wnghk\Desktop\project\devora\devora.ppk""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\index.html""  ""/var/www/html/index.html""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\admin.html""  ""/var/www/html/admin.html""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\status.html"" ""/var/www/html/status.html""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\portfolio.html"" ""/var/www/html/portfolio.html""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\reviews.html"" ""/var/www/html/reviews.html""" ^
	"put ""C:\Users\wnghk\Desktop\project\devora\store.html"" ""/var/www/html/store.html""" ^
        "put ""C:\Users\wnghk\Desktop\project\devora\views-analytics.js"" ""/var/www/html/views-analytics.js""" ^
        "exit"
)
pause
