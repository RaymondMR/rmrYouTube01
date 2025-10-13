import { Head, Link, usePage } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import channelCategoriesRoutes from '@/routes/channel-categories';
import { login, logout, register } from '@/routes';
import playlistCategoriesRoutes from '@/routes/playlist-categories';
import profileRoutes from '@/routes/profile';
import type { SharedData } from '@/types';
import { Youtube } from 'lucide-react';

/**
 * Landing Page del YouTube Content Manager
 * Presenta un hero con información principal y acciones según el estado de autenticación.
 */
export default function Home() {
    const { auth } = usePage<SharedData>().props;
    const user = auth?.user;
    const isAuthenticated = Boolean(user);
    const playlistCategoriesHref = isAuthenticated
        ? playlistCategoriesRoutes.index().url
        : login().url;
    const channelCategoriesHref = isAuthenticated
        ? channelCategoriesRoutes.index().url
        : login().url;
    const heroBackgroundImage =
        "linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url('https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=2000&q=80')";

    return (
        <AppShell>
            <Head title="YouTube Content Manager" />

            <section className="relative flex min-h-screen flex-col overflow-hidden">
                <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: heroBackgroundImage }}
                />
                <div className="relative z-10 flex flex-1 flex-col">
                    <header className="flex justify-end px-6 pt-6 sm:px-10">
                        <div className="ml-auto flex flex-wrap items-center gap-3">
                            {user ? (
                                <>
                                    <Button asChild variant="secondary">
                                        <Link href={profileRoutes.edit().url}>
                                            {user.name}
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline">
                                        <Link href={logout().url} method="post">
                                            Cerrar sesión
                                        </Link>
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button asChild variant="outline">
                                        <Link href={login().url}>
                                            Iniciar sesión
                                        </Link>
                                    </Button>
                                    <Button asChild>
                                        <Link href={register().url}>
                                            Crear cuenta
                                        </Link>
                                    </Button>
                                </>
                            )}
                        </div>
                    </header>

                    <div className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center text-white sm:px-10">
                        <div className="flex flex-col items-center gap-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <span className="flex size-16 items-center justify-center rounded-full bg-white/90 text-red-600 shadow-lg">
                                        <Youtube className="size-8" aria-hidden />
                                    </span>
                                    <h1 className="text-4xl font-bold sm:text-5xl">
                                        YouTube Content Manager
                                    </h1>
                                </div>
                                <p className="max-w-2xl text-lg text-white/80 sm:text-xl">
                                    Organize your favorite YouTube playlists and channels.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
           <div className="mx-auto flex max-w-5xl flex-col gap-12 px-6 sm:px-10">
                    

                    <div className="grid gap-20 md:grid-cols-2 mb-20">
                        <Link
                            href={playlistCategoriesHref}
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="p-8">
                                <div className="flex size-16 items-center justify-center rounded-full bg-red-100 text-red-600 transition-colors group-hover:bg-red-200">
                                    <Youtube className="size-8" aria-hidden />
                                </div>
                                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                                    Categorías de playlists
                                </h3>
                                <p className="mt-3 text-gray-600">
                                    Agrupa y administra tus listas de reproducción por temas para encontrarlas al instante.
                                </p>
                                <div className="mt-6 flex items-center text-red-600 font-medium transition-transform group-hover:translate-x-2">
                                    <span>Ver categorías</span>
                                    <svg
                                        className="ml-2 size-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>

                        <Link
                            href={channelCategoriesHref}
                            className="group relative overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="p-8">
                                <div className="flex size-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 transition-colors group-hover:bg-blue-200">
                                    <Youtube className="size-8" aria-hidden />
                                </div>
                                <h3 className="mt-6 text-2xl font-semibold text-gray-900">
                                    Categorías de canales
                                </h3>
                                <p className="mt-3 text-gray-600">
                                    Clasifica tus canales favoritos y mantén a la vista los contenidos que más te inspiran.
                                </p>
                                <div className="mt-6 flex items-center text-blue-600 font-medium transition-transform group-hover:translate-x-2">
                                    <span>Ver categorías</span>
                                    <svg
                                        className="ml-2 size-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        </Link>
                    </div>
                </div>
           
           
            </section>

            
        </AppShell>
    );
}
