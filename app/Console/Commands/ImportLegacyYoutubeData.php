<?php

namespace App\Console\Commands;

use App\Models\Channel;
use App\Models\ChannelCategory;
use App\Models\Playlist;
use App\Models\PlaylistCategory;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;

class ImportLegacyYoutubeData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'legacy:import-youtube {--path=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import channels, playlists, and categories from the legacy YouTube Windows Forms application.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $legacyPath = $this->option('path') ?? base_path('YouTube_Playlist.db');
        if (! file_exists($legacyPath)) {
            $this->error("Legacy database not found at path: {$legacyPath}");

            return self::FAILURE;
        }

        /** @var User|null $user */
        $user = User::query()->first();
        if ($user === null) {
            $this->error('No users found. At least one user is required to own the imported records.');

            return self::FAILURE;
        }

        $this->info('Configuring legacy SQLite connection…');
        $this->bootstrapLegacyConnection($legacyPath);
        $legacyConnection = DB::connection('legacy_youtube');

        $this->info('Reading legacy data…');
        $legacyPlaylists = $legacyConnection->table('YouTube_Playlist')->orderBy('Id')->get();
        $legacyChannels = $legacyConnection->table('YouTube_Channels')->orderBy('Channel_Id')->get();
        $legacyChannelCategories = $legacyConnection->table('Channels_Categories')->orderBy('Category_Id')->get();

        DB::connection()->transaction(function () use (
            $legacyPlaylists,
            $legacyChannels,
            $legacyChannelCategories,
            $user
        ) {
            $this->info('Clearing existing YouTube data…');

            DB::table('playlist_category')->delete();
            DB::table('channel_category')->delete();
            Playlist::query()->delete();
            Channel::query()->delete();
            PlaylistCategory::query()->delete();
            ChannelCategory::query()->delete();

            DB::statement("DELETE FROM sqlite_sequence WHERE name IN ('playlists', 'playlist_categories', 'channels', 'channel_categories')");

            $this->importPlaylists($legacyPlaylists, $user);
            $categoryMap = $this->importChannelCategories($legacyChannelCategories);
            $this->importChannels($legacyChannels, $user, $categoryMap);
        });

        $this->components->info('Legacy data imported successfully.');

        return self::SUCCESS;
    }

    private function bootstrapLegacyConnection(string $legacyPath): void
    {
        Config::set('database.connections.legacy_youtube', [
            'driver' => 'sqlite',
            'database' => $legacyPath,
            'prefix' => '',
            'foreign_key_constraints' => false,
        ]);
    }

    private function importPlaylists(Collection $legacyPlaylists, User $user): void
    {
        $this->info('Importing playlists…');

        $generalCategory = PlaylistCategory::create([
            'name' => 'General',
        ]);

        foreach ($legacyPlaylists as $legacyPlaylist) {
            /** @var Playlist $playlist */
            $playlist = Playlist::create([
                'user_id' => $user->id,
                'title' => trim((string) $legacyPlaylist->Title),
                'description' => null,
                'url' => $this->normalizePlaylistUrl((string) $legacyPlaylist->url),
            ]);

            $playlist->categories()->attach($generalCategory->id);
        }

        $this->components->info("Imported {$legacyPlaylists->count()} playlists.");
    }

    /**
     * @return array<int, int>
     */
    private function importChannelCategories(Collection $legacyChannelCategories): array
    {
        $this->info('Importing channel categories…');

        $categoryMap = [];

        foreach ($legacyChannelCategories as $legacyCategory) {
            $category = ChannelCategory::create([
                'name' => trim((string) $legacyCategory->CategoryName),
            ]);
            $categoryMap[(int) $legacyCategory->Category_Id] = $category->id;
        }

        $this->components->info("Imported {$legacyChannelCategories->count()} channel categories.");

        return $categoryMap;
    }

    private function importChannels(Collection $legacyChannels, User $user, array $categoryMap): void
    {
        $this->info('Importing channels…');

        $importedUrls = [];
        $insertedCount = 0;
        $skippedDuplicates = 0;

        foreach ($legacyChannels as $legacyChannel) {
            $normalizedUrl = $this->normalizeChannelUrl((string) $legacyChannel->url);

            if ($normalizedUrl === '') {
                continue;
            }

            if (isset($importedUrls[$normalizedUrl])) {
                $this->warn("Skipping duplicate channel URL: {$normalizedUrl}");
                $skippedDuplicates++;

                continue;
            }

            /** @var Channel $channel */
            $channel = Channel::create([
                'user_id' => $user->id,
                'name' => trim((string) $legacyChannel->ChannelName),
                'description' => null,
                'url' => $normalizedUrl,
            ]);

            $importedUrls[$normalizedUrl] = true;
            $insertedCount++;

            $categoryId = $categoryMap[(int) $legacyChannel->ChannelCategory] ?? null;

            if ($categoryId === null) {
                continue;
            }

            $channel->categories()->attach($categoryId);
        }

        $this->components->info("Imported {$insertedCount} channels.".($skippedDuplicates > 0 ? " Skipped {$skippedDuplicates} duplicates." : ''));
    }

    private function normalizePlaylistUrl(string $url): string
    {
        $trimmed = trim($url);

        if ($trimmed === '') {
            return $trimmed;
        }

        if (str_starts_with($trimmed, 'http')) {
            return $trimmed;
        }

        $normalizedPath = str_starts_with($trimmed, '/')
            ? $trimmed
            : '/'.ltrim($trimmed, '/');

        return 'https://www.youtube.com'.$normalizedPath;
    }

    private function normalizeChannelUrl(string $url): string
    {
        return trim($url);
    }
}
