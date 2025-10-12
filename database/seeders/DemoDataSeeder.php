<?php

namespace Database\Seeders;

use App\Models\Channel;
use App\Models\ChannelCategory;
use App\Models\Playlist;
use App\Models\PlaylistCategory;
use App\Models\User;
use Illuminate\Database\Seeder;

/**
 * Seeder con datos de demostración para testing
 * Crea categorías y contenido de ejemplo
 */
class DemoDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtiene el primer usuario o crea uno de prueba
        $user = User::first();

        if (! $user) {
            $user = User::create([
                'name' => 'Usuario Demo',
                'email' => 'demo@youtube-manager.com',
                'password' => bcrypt('password'),
            ]);
        }

        // Crear Categorías de Playlists
        $playlistCategories = [
            'Programación',
            'Música',
            'Tutoriales',
            'Entretenimiento',
            'Educación',
            'Laravel',
            'JavaScript',
            'Desarrollo Web',
        ];

        $createdPlaylistCategories = collect();
        foreach ($playlistCategories as $name) {
            $createdPlaylistCategories->push(
                PlaylistCategory::firstOrCreate(['name' => $name])
            );
        }

        // Crear Playlists de ejemplo
        $playlists = [
            [
                'title' => 'Laravel desde Cero',
                'url' => 'https://www.youtube.com/playlist?list=PLZ2ovOgdI-kWWS9aq8mfUDkJRfYib-SvF',
                'description' => 'Curso completo de Laravel para principiantes',
                'categories' => ['Programación', 'Tutoriales', 'Educación', 'Laravel'],
            ],
            [
                'title' => 'JavaScript Moderno',
                'url' => 'https://www.youtube.com/playlist?list=PLvq-jIkSeTUZ6QgYYO3MwG9EMqC-KoLXA',
                'description' => 'Aprende JavaScript ES6+ desde cero',
                'categories' => ['Programación', 'JavaScript', 'Tutoriales'],
            ],
            [
                'title' => 'Música para Programar',
                'url' => 'https://www.youtube.com/playlist?list=PLkAl7BZlnB0B3YyS4n5n9MpnJx9kHKLUY',
                'description' => 'La mejor música para concentrarse',
                'categories' => ['Música', 'Entretenimiento'],
            ],
            [
                'title' => 'React JS Tutorial',
                'url' => 'https://www.youtube.com/playlist?list=PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3',
                'description' => 'Curso completo de React JS',
                'categories' => ['Programación', 'JavaScript', 'Desarrollo Web'],
            ],
            [
                'title' => 'Tailwind CSS',
                'url' => 'https://www.youtube.com/playlist?list=PL4cUxeGkcC9gpXORlEHjc5bgnIi5HEGhw',
                'description' => 'Aprende Tailwind CSS desde cero',
                'categories' => ['Desarrollo Web', 'Tutoriales', 'Educación'],
            ],
        ];

        foreach ($playlists as $playlistData) {
            $playlist = Playlist::firstOrCreate(
                ['url' => $playlistData['url']],
                [
                    'user_id' => $user->id,
                    'title' => $playlistData['title'],
                    'description' => $playlistData['description'],
                ]
            );

            // Sincroniza categorías
            $categoryIds = PlaylistCategory::whereIn('name', $playlistData['categories'])->pluck('id');
            $playlist->categories()->sync($categoryIds);
        }

        // Crear Categorías de Canales
        $channelCategories = [
            'Tech Reviews',
            'Educativo',
            'Entretenimiento',
            'Noticias',
            'Gaming',
            'Desarrollo',
            'Diseño',
            'Ciencia',
        ];

        $createdChannelCategories = collect();
        foreach ($channelCategories as $name) {
            $createdChannelCategories->push(
                ChannelCategory::firstOrCreate(['name' => $name])
            );
        }

        // Crear Canales de ejemplo
        $channels = [
            [
                'name' => 'Traversy Media',
                'url' => 'https://www.youtube.com/@TraversyMedia',
                'description' => 'Canal de desarrollo web y programación',
                'categories' => ['Desarrollo', 'Educativo', 'Tech Reviews'],
            ],
            [
                'name' => 'Fireship',
                'url' => 'https://www.youtube.com/@Fireship',
                'description' => 'Tutoriales rápidos sobre desarrollo web',
                'categories' => ['Desarrollo', 'Educativo'],
            ],
            [
                'name' => 'The Net Ninja',
                'url' => 'https://www.youtube.com/@NetNinja',
                'description' => 'Tutoriales de programación y desarrollo web',
                'categories' => ['Desarrollo', 'Educativo'],
            ],
            [
                'name' => 'FaztCode',
                'url' => 'https://www.youtube.com/@FaztCode',
                'description' => 'Tutoriales de programación en español',
                'categories' => ['Desarrollo', 'Educativo'],
            ],
            [
                'name' => 'DesignCourse',
                'url' => 'https://www.youtube.com/@DesignCourse',
                'description' => 'Diseño UI/UX y desarrollo frontend',
                'categories' => ['Diseño', 'Desarrollo', 'Educativo'],
            ],
            [
                'name' => 'Veritasium',
                'url' => 'https://www.youtube.com/@veritasium',
                'description' => 'Canal de ciencia y educación',
                'categories' => ['Ciencia', 'Educativo', 'Entretenimiento'],
            ],
        ];

        foreach ($channels as $channelData) {
            $channel = Channel::firstOrCreate(
                ['url' => $channelData['url']],
                [
                    'user_id' => $user->id,
                    'name' => $channelData['name'],
                    'description' => $channelData['description'],
                ]
            );

            // Sincroniza categorías
            $categoryIds = ChannelCategory::whereIn('name', $channelData['categories'])->pluck('id');
            $channel->categories()->sync($categoryIds);
        }

        $this->command->info('✅ Datos de demostración creados exitosamente!');
        $this->command->info('📧 Email: '.$user->email);
        $this->command->info('🔑 Password: password');
    }
}
