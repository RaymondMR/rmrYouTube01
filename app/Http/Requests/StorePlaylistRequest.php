<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para validar la creación de una playlist
 * Separa la lógica de validación del controlador (mejor práctica de Laravel)
 */
class StorePlaylistRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * Por ahora, cualquier usuario autenticado puede crear playlists
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     * Define todas las reglas de validación para crear una playlist
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'url' => [
                'required',
                'string',
                'url',
                'unique:playlists,url',
                'regex:/^https?:\/\/(www\.)?youtube\.com\/.*[?&]list=([^&]+)/',
            ],
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:playlist_categories,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
     * Personaliza los mensajes de error para que sean más amigables
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'El título de la playlist es obligatorio.',
            'title.max' => 'El título no puede tener más de 255 caracteres.',
            'url.required' => 'La URL de YouTube es obligatoria.',
            'url.url' => 'La URL no es válida.',
            'url.unique' => 'Esta playlist ya está registrada.',
            'url.regex' => 'La URL debe ser de una playlist de YouTube válida (debe contener el parámetro "list").',
            'categories.required' => 'Debe seleccionar al menos una categoría.',
            'categories.min' => 'Debe seleccionar al menos una categoría.',
            'categories.*.exists' => 'Una o más categorías seleccionadas no son válidas.',
        ];
    }
}
