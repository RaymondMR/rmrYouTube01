<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Crea la tabla pivote para la relación muchos a muchos entre playlists y categorías
     */
    public function up(): void
    {
        Schema::create('playlist_category', function (Blueprint $table) {
            // Claves foráneas
            $table->foreignId('playlist_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('playlist_categories')->onDelete('cascade');

            // Clave primaria compuesta
            $table->primary(['playlist_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('playlist_category');
    }
};
