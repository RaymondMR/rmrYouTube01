<?php

namespace App\Http\Controllers;

use App\Models\PlaylistCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para gestionar las categorías de playlists
 * Resource Controller - maneja CRUD completo
 */
class PlaylistCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Muestra todas las categorías de playlists con contador
     */
    public function index(Request $request)
    {
        // Obtiene el término de búsqueda si existe
        $search = $request->input('search');

        // Query builder para categorías
        $query = PlaylistCategory::withCount('playlists');

        // Aplica filtro de búsqueda si existe
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Ordena por nombre y obtiene resultados
        $categories = $query->orderBy('name')->get();

        return Inertia::render('PlaylistCategories/Index', [
            'categories' => $categories,
            'search' => $search,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Crea una nueva categoría de playlist
     */
    public function store(Request $request)
    {
        // Valida los datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:playlist_categories,name',
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Esta categoría ya existe.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        ]);

        // Crea la categoría
        PlaylistCategory::create($validated);

        // Redirige con mensaje de éxito
        return redirect()->route('playlist-categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     * Actualiza una categoría existente
     */
    public function update(Request $request, PlaylistCategory $playlistCategory)
    {
        // Valida los datos, ignorando el nombre actual
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:playlist_categories,name,'.$playlistCategory->id,
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Esta categoría ya existe.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        ]);

        // Actualiza la categoría
        $playlistCategory->update($validated);

        // Redirige con mensaje de éxito
        return redirect()->route('playlist-categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     * Elimina una categoría
     */
    public function destroy(PlaylistCategory $playlistCategory)
    {
        // Elimina la categoría (CASCADE eliminará las relaciones)
        $playlistCategory->delete();

        // Redirige con mensaje de éxito
        return redirect()->route('playlist-categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }
}
