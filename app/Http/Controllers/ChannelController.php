<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChannelRequest;
use App\Http\Requests\UpdateChannelRequest;
use App\Models\Channel;
use App\Models\ChannelCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controlador para gestionar los canales de YouTube
 * Resource Controller - maneja CRUD completo
 */
class ChannelController extends Controller
{
    /**
     * Display a listing of channels for a specific category.
     * Muestra todos los canales de una categoría específica
     */
    public function index(Request $request, ChannelCategory $category)
    {
        // Obtiene el término de búsqueda si existe
        $search = $request->input('search');

        // Query builder para canales de la categoría
        $query = $category->channels()
            ->with('categories') // Eager loading de las relaciones
            ->where('user_id', auth()->id()); // Solo canales del usuario actual

        // Aplica filtro de búsqueda si existe
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Ordena por fecha de creación (más recientes primero) y obtiene resultados
        $channels = $query->orderBy('created_at', 'desc')->get();

        // Obtiene todas las categorías para el modal
        $allCategories = ChannelCategory::orderBy('name')->get();

        return Inertia::render('Channels/Index', [
            'category' => $category,
            'channels' => $channels,
            'search' => $search,
            'allCategories' => $allCategories,
        ]);
    }

    /**
     * Store a newly created channel in storage.
     * Crea un nuevo canal
     */
    public function store(StoreChannelRequest $request)
    {
        // Los datos ya están validados por el Form Request
        $validated = $request->validated();

        // Crea el canal asociado al usuario autenticado
        $channel = auth()->user()->channels()->create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'url' => $validated['url'],
        ]);

        // Sincroniza las categorías (relación muchos a muchos)
        $channel->categories()->sync($validated['categories']);

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Canal creado exitosamente.');
    }

    /**
     * Update the specified channel in storage.
     * Actualiza un canal existente
     */
    public function update(UpdateChannelRequest $request, Channel $channel)
    {
        // Los datos ya están validados por el Form Request
        // El Form Request también verifica que el usuario sea el propietario
        $validated = $request->validated();

        // Actualiza el canal
        $channel->update([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'url' => $validated['url'],
        ]);

        // Sincroniza las categorías
        $channel->categories()->sync($validated['categories']);

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Canal actualizado exitosamente.');
    }

    /**
     * Remove the specified channel from storage.
     * Elimina un canal
     */
    public function destroy(Channel $channel)
    {
        // Verifica que el usuario sea el propietario
        if ($channel->user_id !== auth()->id()) {
            abort(403, 'No tienes permiso para eliminar este canal.');
        }

        // Elimina el canal (CASCADE eliminará las relaciones)
        $channel->delete();

        // Redirige con mensaje de éxito
        return redirect()->back()
            ->with('success', 'Canal eliminado exitosamente.');
    }
}
