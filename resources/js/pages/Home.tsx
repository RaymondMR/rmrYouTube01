import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import playlistCategoriesRoutes from '@/routes/playlist-categories';
import channelCategoriesRoutes from '@/routes/channel-categories';

/**
 * Landing Page del YouTube Content Manager
 * Muestra dos opciones principales: Playlists y Canales
 */
export default function Home() {
    return (
        <AppLayout>
            <Head title="YouTube Content Manager" />

            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            YouTube Content Manager
                        </h1>
                        <p className="text-lg text-gray-600">
                            Organiza tus listas de reproducción y canales favoritos de YouTube
                        </p>
                    </div>

                    {/* Tarjetas principales */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Tarjeta: Categorías de Listas de Reproducción */}
                        <Link
                            href={playlistCategoriesRoutes.index().url}
                            className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-8">
                                {/* Icono */}
                                <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6 group-hover:bg-red-200 transition-colors">
                                    <svg
                                        className="w-8 h-8 text-red-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>

                                {/* Contenido */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Listas de Reproducción
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Organiza y gestiona tus playlists de YouTube por categorías.
                                    Guarda tus listas favoritas y accede a ellas fácilmente.
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center text-red-600 font-semibold group-hover:translate-x-2 transition-transform">
                                    <span>Ver categorías</span>
                                    <svg
                                        className="w-5 h-5 ml-2"
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

                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </Link>

                        {/* Tarjeta: Categorías de Canales */}
                        <Link
                            href={channelCategoriesRoutes.index().url}
                            className="group relative bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-8">
                                {/* Icono */}
                                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                                    <svg
                                        className="w-8 h-8 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>

                                {/* Contenido */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                    Canales de YouTube
                                </h2>
                                <p className="text-gray-600 mb-4">
                                    Organiza y gestiona tus canales favoritos de YouTube.
                                    Clasifícalos por categorías para encontrarlos rápidamente.
                                </p>

                                {/* Arrow */}
                                <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                                    <span>Ver categorías</span>
                                    <svg
                                        className="w-5 h-5 ml-2"
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

                            {/* Gradient overlay on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                        </Link>
                    </div>

                    {/* Footer info */}
                    <div className="mt-12 text-center">
                        <p className="text-sm text-gray-500">
                            Gestiona tu contenido de YouTube de manera organizada y eficiente
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
