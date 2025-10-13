<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('guests can view the home page via the root path', function () {
    $response = $this->get('/');

    $response->assertOk();

    $response->assertInertia(fn (Assert $page) => $page
        ->component('Home')
    );
});

test('guests can visit the named home route', function () {
    $this->get(route('home'))->assertOk();
});

test('successful login without an intended url redirects to home', function () {
    $user = User::factory()
        ->withoutTwoFactor()
        ->create();

    $response = $this->post(route('login'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertRedirect(route('home'));
});
