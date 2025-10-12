<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Form Request para validar la actualización de una playlist
 * Similar a StorePlaylistRequest pero ignora la URL actual al validar unicidad
 */
class UpdatePlaylistRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        // Verifica que el usuario autenticado sea el propietario de la playlist
        $playlist = $this->route('playlist');

        return auth()->check() && $playlist && auth()->id() === $playlist->user_id;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $playlist = $this->route('playlist');

        return [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'url' => [
                'required',
                'string',
                'url',
                // Ignora la URL actual al validar unicidad
                Rule::unique('playlists', 'url')->ignore($playlist->id),
                'regex:/^https?:\/\/(www\.)?youtube\.com\/.*[?&]list=([^&]+)/',
            ],
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:playlist_categories,id',
        ];
    }

    /**
     * Get custom error messages for validator errors.
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
