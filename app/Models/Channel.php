<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Channel extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Previene Mass Assignment vulnerabilities
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'description',
        'url',
    ];

    /**
     * Relación con el usuario propietario
     * Un canal pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación Muchos a Muchos con Categorías
     * Un canal puede pertenecer a muchas categorías
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(ChannelCategory::class, 'channel_category', 'channel_id', 'category_id');
    }

    /**
     * Extrae el handle/username del canal de YouTube de la URL
     * Ejemplo: https://www.youtube.com/@TraversyMedia
     * Retorna: TraversyMedia
     */
    public function getYoutubeChannelHandleAttribute(): ?string
    {
        if (preg_match('/@([^\/\?]+)/', $this->url, $matches)) {
            return $matches[1];
        }

        return null;
    }
}
