<?php

namespace App\Http\Controllers;

use App\Models\ChannelCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para gestionar las categorías de canales
 * Resource Controller - maneja CRUD completo
 */
class ChannelCategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     * Muestra todas las categorías de canales con contador
     */
    public function index(Request $request)
    {
        // Obtiene el término de búsqueda si existe
        $search = $request->input('search');

        // Query builder para categorías
        $query = ChannelCategory::withCount('channels');

        // Aplica filtro de búsqueda si existe
        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        // Ordena por nombre y obtiene resultados
        $categories = $query->orderBy('name')->get();

        return Inertia::render('ChannelCategories/Index', [
            'categories' => $categories,
            'search' => $search,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     * Crea una nueva categoría de canal
     */
    public function store(Request $request)
    {
        // Valida los datos de entrada
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:channel_categories,name',
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Esta categoría ya existe.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        ]);

        // Crea la categoría
        ChannelCategory::create($validated);

        // Redirige con mensaje de éxito
        return redirect()->route('channel-categories.index')
            ->with('success', 'Categoría creada exitosamente.');
    }

    /**
     * Update the specified resource in storage.
     * Actualiza una categoría existente
     */
    public function update(Request $request, ChannelCategory $channelCategory)
    {
        // Valida los datos, ignorando el nombre actual
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:channel_categories,name,'.$channelCategory->id,
        ], [
            'name.required' => 'El nombre de la categoría es obligatorio.',
            'name.unique' => 'Esta categoría ya existe.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
        ]);

        // Actualiza la categoría
        $channelCategory->update($validated);

        // Redirige con mensaje de éxito
        return redirect()->route('channel-categories.index')
            ->with('success', 'Categoría actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     * Elimina una categoría
     */
    public function destroy(ChannelCategory $channelCategory)
    {
        // Elimina la categoría (CASCADE eliminará las relaciones)
        $channelCategory->delete();

        // Redirige con mensaje de éxito
        return redirect()->route('channel-categories.index')
            ->with('success', 'Categoría eliminada exitosamente.');
    }
}
