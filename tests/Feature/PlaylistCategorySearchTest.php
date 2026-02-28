<?php

use App\Models\Playlist;
use App\Models\PlaylistCategory;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    // nothing for now
});

it('returns playlists filtered by title when searching from the categories page', function () {
    $user = User::factory()->create();

    // categories used for association; the actual filtering does not care about the
    // category name, but the results should include the category that belongs to
    $category = PlaylistCategory::create(['name' => 'Test Category']);
    $otherCategory = PlaylistCategory::create(['name' => 'Other']);

    // playlists belonging to this user
    $matching = Playlist::create([
        'user_id' => $user->id,
        'title' => 'Hello World Playlist',
        'description' => 'nothing special',
        'url' => 'https://example.com/1',
    ]);
    $nonMatching = Playlist::create([
        'user_id' => $user->id,
        'title' => 'Something Else',
        'description' => 'contains hello in the description',
        'url' => 'https://example.com/2',
    ]);

    $matching->categories()->attach($category->id);
    $nonMatching->categories()->attach($otherCategory->id);

    // another user's playlist should never appear
    $otherUser = User::factory()->create();
    $foreign = Playlist::create([
        'user_id' => $otherUser->id,
        'title' => 'Hello World Playlist',
        'description' => 'bad data',
        'url' => 'https://example.com/3',
    ]);
    $foreign->categories()->attach($category->id);

    $this->actingAs($user)
        ->get(route('playlist-categories.index', [
            'playlist_search' => 'Hello',
            'playlist_field' => 'title',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('PlaylistCategories/Index')
            ->where('playlistSearch', 'Hello')
            ->where('playlistField', 'title')
            ->where('foundPlaylists.0.title', 'Hello World Playlist')
            ->where('foundPlaylists.0.categories.0.name', $category->name)
        );
});

it('returns playlists filtered by description when searching from the categories page', function () {
    $user = User::factory()->create();

    $category = PlaylistCategory::create(['name' => 'Desc Cat']);

    $matching = Playlist::create([
        'user_id' => $user->id,
        'title' => 'Irrelevant',
        'description' => 'This is the special description',
        'url' => 'https://example.com/4',
    ]);

    $matching->categories()->attach($category->id);

    $this->actingAs($user)
        ->get(route('playlist-categories.index', [
            'playlist_search' => 'special',
            'playlist_field' => 'description',
        ]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('PlaylistCategories/Index')
            ->where('playlistSearch', 'special')
            ->where('playlistField', 'description')
            ->where('foundPlaylists.0.description', 'This is the special description')
        );
});

// When no playlist_search parameter is sent we should not receive the prop
it('does not return playlist results when no search term is provided', function () {
    $user = User::factory()->create();
    PlaylistCategory::create(['name' => 'Foo']);

    $this->actingAs($user)
        ->get(route('playlist-categories.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('PlaylistCategories/Index')
            ->where('playlistSearch', '')
            ->where('playlistField', 'title')
        );
});
