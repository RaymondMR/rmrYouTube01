<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Playlist extends Model
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
        'title',
        'description',
        'url',
    ];

    /**
     * Relación con el usuario propietario
     * Una playlist pertenece a un usuario
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relación Muchos a Muchos con Categorías
     * Una playlist puede pertenecer a muchas categorías
     */
    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(PlaylistCategory::class, 'playlist_category', 'playlist_id', 'category_id');
    }

    /**
     * Extrae el ID de la playlist de YouTube de la URL
     * Ejemplo: https://www.youtube.com/playlist?list=PLZ2ovOgdI-kWWS9aq8mfUDkJRfYib-SvF
     * Retorna: PLZ2ovOgdI-kWWS9aq8mfUDkJRfYib-SvF
     */
    public function getYoutubePlaylistIdAttribute(): ?string
    {
        if (preg_match('/[?&]list=([^&]+)/', $this->url, $matches)) {
            return $matches[1];
        }

        return null;
    }

    /**
     * Genera la URL del thumbnail de YouTube
     */
    public function getThumbnailUrlAttribute(): ?string
    {
        $playlistId = $this->youtube_playlist_id;
        if ($playlistId) {
            return "https://i.ytimg.com/vi/{$playlistId}/hqdefault.jpg";
        }

        return null;
    }
}
