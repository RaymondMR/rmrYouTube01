<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form Request para validar la creación de un canal
 */
class StoreChannelRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'url' => [
                'required',
                'string',
                'url',
                'unique:channels,url',
                // Acepta formatos: @handle, /c/channel, /channel/ID, /user/username
                'regex:/^https?:\/\/(www\.)?youtube\.com\/((@[^\/\?]+)|(c\/[^\/\?]+)|(channel\/[^\/\?]+)|(user\/[^\/\?]+))/',
            ],
            'categories' => 'required|array|min:1',
            'categories.*' => 'exists:channel_categories,id',
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
            'name.required' => 'El nombre del canal es obligatorio.',
            'name.max' => 'El nombre no puede tener más de 255 caracteres.',
            'url.required' => 'La URL de YouTube es obligatoria.',
            'url.url' => 'La URL no es válida.',
            'url.unique' => 'Este canal ya está registrado.',
            'url.regex' => 'La URL debe ser de un canal de YouTube válido (formatos: @handle, /c/channel, /channel/ID, /user/username).',
            'categories.required' => 'Debe seleccionar al menos una categoría.',
            'categories.min' => 'Debe seleccionar al menos una categoría.',
            'categories.*.exists' => 'Una o más categorías seleccionadas no son válidas.',
        ];
    }
}
