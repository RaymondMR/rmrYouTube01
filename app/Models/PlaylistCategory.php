<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PlaylistCategory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     * Previene Mass Assignment vulnerabilities
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
    ];

    /**
     * Relación Muchos a Muchos con Playlists
     * Una categoría puede tener muchas playlists
     */
    public function playlists(): BelongsToMany
    {
        return $this->belongsToMany(Playlist::class, 'playlist_category', 'category_id', 'playlist_id');
    }
}
