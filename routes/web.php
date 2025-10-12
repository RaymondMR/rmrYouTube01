<?php

use App\Http\Controllers\ChannelCategoryController;
use App\Http\Controllers\ChannelController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\PlaylistCategoryController;
use App\Http\Controllers\PlaylistController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('welcome');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard (original)
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Home - Landing page para YouTube Content Manager
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    // Rutas para Categorías de Playlists
    Route::resource('playlist-categories', PlaylistCategoryController::class)
        ->except(['show', 'create', 'edit']);

    // Rutas para Playlists (dentro de una categoría)
    Route::get('playlist-categories/{category}/playlists', [PlaylistController::class, 'index'])
        ->name('playlists.index');
    Route::post('playlists', [PlaylistController::class, 'store'])
        ->name('playlists.store');
    Route::put('playlists/{playlist}', [PlaylistController::class, 'update'])
        ->name('playlists.update');
    Route::delete('playlists/{playlist}', [PlaylistController::class, 'destroy'])
        ->name('playlists.destroy');

    // Rutas para Categorías de Canales
    Route::resource('channel-categories', ChannelCategoryController::class)
        ->except(['show', 'create', 'edit']);

    // Rutas para Canales (dentro de una categoría)
    Route::get('channel-categories/{category}/channels', [ChannelController::class, 'index'])
        ->name('channels.index');
    Route::post('channels', [ChannelController::class, 'store'])
        ->name('channels.store');
    Route::put('channels/{channel}', [ChannelController::class, 'update'])
        ->name('channels.update');
    Route::delete('channels/{channel}', [ChannelController::class, 'destroy'])
        ->name('channels.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
