<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class ChannelCategory extends Model
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
     * Relación Muchos a Muchos con Channels
     * Una categoría puede tener muchos canales
     */
    public function channels(): BelongsToMany
    {
        return $this->belongsToMany(Channel::class, 'channel_category', 'category_id', 'channel_id');
    }
}
