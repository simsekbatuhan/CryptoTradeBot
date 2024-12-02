@echo off
title Crypto Trade Bot
:start
node index.js

if %errorlevel% neq 0 (
    echo Proje hata verdi!
	goto start
)


echo Proje başarıyla tamamlandı.
