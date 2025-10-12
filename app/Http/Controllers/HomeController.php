<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

/**
 * Controlador para la página de inicio (Landing Page)
 */
class HomeController extends Controller
{
    /**
     * Muestra la landing page con las dos opciones principales
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Home');
    }
}
