<?php

use App\Models\Channel;
use App\Models\ChannelCategory;
use App\Models\Playlist;
use App\Models\PlaylistCategory;
use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

it('imports data from the legacy sqlite database dump', function () {
    $user = User::factory()->create();

    // Seed existing data to confirm the command clears it.
    Playlist::create([
        'user_id' => $user->id,
        'title' => 'Existing playlist',
        'description' => null,
        'url' => 'https://www.youtube.com/playlist?list=existing',
    ]);
    Channel::create([
        'user_id' => $user->id,
        'name' => 'Existing channel',
        'description' => null,
        'url' => 'https://www.youtube.com/@existing',
    ]);
    PlaylistCategory::create(['name' => 'Existing']);
    ChannelCategory::create(['name' => 'Existing']);

    $legacyPath = storage_path('framework/testing/legacy_youtube_import.sqlite');
    File::ensureDirectoryExists(dirname($legacyPath));
    if (File::exists($legacyPath)) {
        File::delete($legacyPath);
    }

    $pdo = new PDO('sqlite:'.$legacyPath);

    $pdo->exec('CREATE TABLE YouTube_Playlist (Id INTEGER PRIMARY KEY, Title TEXT NOT NULL, url TEXT NOT NULL);');
    $pdo->exec('CREATE TABLE Channels_Categories (Category_Id INTEGER PRIMARY KEY, CategoryName TEXT NOT NULL);');
    $pdo->exec('CREATE TABLE YouTube_Channels (Channel_Id INTEGER PRIMARY KEY, ChannelCategory INTEGER NOT NULL, ChannelName TEXT NOT NULL, url TEXT NOT NULL);');

    $pdo->exec("INSERT INTO YouTube_Playlist (Id, Title, url) VALUES (1, 'Legacy Playlist', '/playlist?list=PL123456');");
    $pdo->exec("INSERT INTO Channels_Categories (Category_Id, CategoryName) VALUES (1, 'Legacy Category');");
    $pdo->exec("INSERT INTO YouTube_Channels (Channel_Id, ChannelCategory, ChannelName, url) VALUES (1, 1, 'Legacy Channel', ' https://www.youtube.com/@legacy ');");
    $pdo->exec("INSERT INTO YouTube_Channels (Channel_Id, ChannelCategory, ChannelName, url) VALUES (2, 1, 'Legacy Channel Duplicate', 'https://www.youtube.com/@legacy');");

    $pdo = null;

    Artisan::call('legacy:import-youtube', ['--path' => $legacyPath]);

    File::delete($legacyPath);

    $playlist = Playlist::first();
    $channel = Channel::first();
    $generalCategory = PlaylistCategory::where('name', 'General')->first();
    $channelCategory = ChannelCategory::where('name', 'Legacy Category')->first();

    expect($playlist)->not->toBeNull()
        ->and($playlist->title)->toBe('Legacy Playlist')
        ->and($playlist->url)->toBe('https://www.youtube.com/playlist?list=PL123456')
        ->and($playlist->categories()->pluck('name')->all())->toContain('General');

    expect($generalCategory)->not->toBeNull();

    expect($channel)->not->toBeNull()
        ->and($channel->name)->toBe('Legacy Channel')
        ->and($channel->url)->toBe('https://www.youtube.com/@legacy')
        ->and($channel->categories()->pluck('name')->all())->toContain('Legacy Category');

    expect($channelCategory)->not->toBeNull();

    expect(Playlist::count())->toBe(1);
    expect(Channel::count())->toBe(1);
    expect(PlaylistCategory::count())->toBe(1);
    expect(ChannelCategory::count())->toBe(1);
});
