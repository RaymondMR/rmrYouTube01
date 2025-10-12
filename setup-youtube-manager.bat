@echo off
echo ================================================
echo YouTube Content Manager - Setup Script
echo ================================================
echo.

echo [1/3] Ejecutando migraciones...
php artisan migrate
if %errorlevel% neq 0 (
    echo ERROR: Las migraciones fallaron
    pause
    exit /b 1
)
echo ✓ Migraciones completadas
echo.

echo [2/3] Poblando base de datos con datos de prueba...
php artisan db:seed --class=DemoDataSeeder
if %errorlevel% neq 0 (
    echo ERROR: El seeder falló
    pause
    exit /b 1
)
echo ✓ Datos de prueba creados
echo.

echo [3/3] Limpiando cache...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
echo ✓ Cache limpiado
echo.

echo ================================================
echo ¡Setup completado exitosamente!
echo ================================================
echo.
echo Credenciales de prueba:
echo   Email: demo@youtube-manager.com
echo   Password: password
echo.
echo Próximos pasos:
echo   1. Ejecuta: php artisan serve
echo   2. En otra terminal: npm run dev
echo   3. Abre http://localhost:8000
echo   4. Login y navega a /home
echo.
echo Para resetear todo: php artisan migrate:fresh --seed
echo.
pause
