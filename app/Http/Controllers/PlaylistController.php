<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePlaylistRequest;
use App\Http\Requests\UpdatePlaylistRequest;
use App\Models\Playlist;
use App\Models\PlaylistCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para gestionar las playlists de YouTube
 * Resource Controller - maneja CRUD completo
 */
class PlaylistController extends Controller
{
    /**
     * Display a listing of playlists for a specific category.
     * Muestra todas las playlists de una categoría específica
     */
    public function index(Request $request, PlaylistCategory $category)
    {
        // Obtiene el término de búsqueda si existe
        $search = $request->input('search');

        // Query builder para playlists de la categoría
        $query = $category->playlists()
            ->with('categories') // Eager loading de las relaciones
            ->where('user_id', auth()->id()); // Solo playlists del usuario actual

        // Aplica filtro de búsqueda si existe
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Ordena por fecha de creación (más recientes primero) y obtiene resultados
        $playlists = $query->orderBy('created_at', 'desc')->get();

        // Obtiene todas las categorías para el modal
        $allCategories = PlaylistCategory::orderBy('name')->get();

        return Inertia::render('Playlists/Index', [
            'category' => $category,
            'playlists' => $playlists,
            'search' => $search,
            'allCategories' => $allCategories,
        ]);
    }

    /**
     * Store a newly created playlist in storage.
     * Crea una nueva playlist
     */
    public function store(StorePlaylistRequest $request)
    {
        // Los datos ya están validados por el Form Request
        $validated = $request->validated();

        // Crea la playlist asociada al usuario autenticado
        $playlist = auth()->user()->playlists()->create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'],
        ]);

        // Sincroniza las categorías (relación muchos a muchos)
        $playlist->categories()->sync($validated['categories']);

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Playlist creada exitosamente.');
    }

    /**
     * Update the specified playlist in storage.
     * Actualiza una playlist existente
     */
    public function update(UpdatePlaylistRequest $request, Playlist $playlist)
    {
        // Los datos ya están validados por el Form Request
        // El Form Request también verifica que el usuario sea el propietario
        $validated = $request->validated();

        // Actualiza la playlist
        $playlist->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'url' => $validated['url'],
        ]);

        // Sincroniza las categorías
        $playlist->categories()->sync($validated['categories']);

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Playlist actualizada exitosamente.');
    }

    /**
     * Remove the specified playlist from storage.
     * Elimina una playlist
     */
    public function destroy(Playlist $playlist)
    {
        // Verifica que el usuario sea el propietario
        if ($playlist->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para eliminar esta playlist.');
        }

        // Elimina la playlist (CASCADE eliminará las relaciones)
        $playlist->delete();

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Playlist eliminada exitosamente.');
    }
}
