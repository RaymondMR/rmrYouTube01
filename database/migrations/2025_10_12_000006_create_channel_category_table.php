<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Crea la tabla pivote para la relación muchos a muchos entre canales y categorías
     */
    public function up(): void
    {
        Schema::create('channel_category', function (Blueprint $table) {
            // Claves foráneas
            $table->foreignId('channel_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->constrained('channel_categories')->onDelete('cascade');

            // Clave primaria compuesta
            $table->primary(['channel_id', 'category_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('channel_category');
    }
};
