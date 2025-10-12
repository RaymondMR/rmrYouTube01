/**
 * EJEMPLO COMPLETO DE COMPONENTE REACT PARA PLAYLIST CATEGORIES
 * 
 * Este archivo es un ejemplo de cómo crear la página de categorías.
 * Copia este contenido a: resources/js/pages/PlaylistCategories/Index.tsx
 * 
 * IMPORTANTE: Primero debes crear la carpeta PlaylistCategories dentro de pages/
 */

import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { FormEventHandler, useState } from 'react';

/**
 * Tipo de datos para una categoría de playlist
 */
interface PlaylistCategory {
    id: number;
    name: string;
    playlists_count: number;
    created_at: string;
}

/**
 * Props que recibe el componente desde el controlador
 */
interface Props {
    categories: PlaylistCategory[];
    search?: string;
}

/**
 * Página de Categorías de Playlists
 * Muestra grid de categorías con búsqueda y CRUD completo
 */
export default function Index({ categories, search: initialSearch }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PlaylistCategory | null>(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch || '');

    // Form para crear/editar categoría
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
    });

    // Form para eliminar categoría
    const { delete: destroy } = useForm();

    /**
     * Abre modal para crear nueva categoría
     */
    const openCreateModal = () => {
        reset();
        setEditingCategory(null);
        setShowModal(true);
    };

    /**
     * Abre modal para editar categoría existente
     */
    const openEditModal = (category: PlaylistCategory) => {
        setData('name', category.name);
        setEditingCategory(category);
        setShowModal(true);
    };

    /**
     * Cierra modal y resetea formulario
     */
    const closeModal = () => {
        setShowModal(false);
        reset();
        setEditingCategory(null);
    };

    /**
     * Envía formulario para crear o actualizar categoría
     */
    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (editingCategory) {
            // Actualizar categoría existente
            put(`/playlist-categories/${editingCategory.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            // Crear nueva categoría
            post('/playlist-categories', {
                onSuccess: () => closeModal(),
            });
        }
    };

    /**
     * Elimina una categoría con confirmación
     */
    const handleDelete = (category: PlaylistCategory) => {
        if (confirm(`¿Estás seguro de eliminar la categoría "${category.name}"?`)) {
            destroy(`/playlist-categories/${category.id}`);
        }
    };

    /**
     * Maneja la búsqueda
     */
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = searchTerm ? `?search=${searchTerm}` : '';
        window.location.href = `/playlist-categories${params}`;
    };

    return (
        <AppLayout>
            <Head title="Categorías de Playlists" />

            <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Breadcrumbs */}
                    <nav className="mb-6 text-sm text-gray-600">
                        <Link href="/home" className="hover:text-gray-900">Home</Link>
                        <span className="mx-2">/</span>
                        <span className="text-gray-900">Categorías de Listas de Reproducción</span>
                    </nav>

                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                Categorías de Playlists
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {categories.length} categoría{categories.length !== 1 ? 's' : ''} encontrada{categories.length !== 1 ? 's' : ''}
                            </p>
                        </div>
                        <button
                            onClick={openCreateModal}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Nueva Categoría
                        </button>
                    </div>

                    {/* Barra de búsqueda */}
                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Buscar categoría por nombre..."
                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </form>

                    {/* Grid de categorías */}
                    {categories.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p className="mt-4 text-gray-600">No se encontraron categorías</p>
                            <button
                                onClick={openCreateModal}
                                className="mt-4 text-red-600 hover:text-red-700 font-medium"
                            >
                                Crear la primera categoría
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div
                                    key={category.id}
                                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Contenido de la tarjeta - clickeable */}
                                    <Link
                                        href={`/playlist-categories/${category.id}/playlists`}
                                        className="block p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {category.name}
                                        </h3>
                                        <p className="text-gray-600 mb-4">
                                            {category.playlists_count} playlist{category.playlists_count !== 1 ? 's' : ''}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Creada el {new Date(category.created_at).toLocaleDateString('es-ES')}
                                        </p>
                                    </Link>

                                    {/* Botones de acción */}
                                    <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex gap-2">
                                        <button
                                            onClick={() => openEditModal(category)}
                                            className="flex-1 text-sm text-blue-600 hover:text-blue-800 font-medium py-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category)}
                                            className="flex-1 text-sm text-red-600 hover:text-red-800 font-medium py-2"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal para crear/editar categoría */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold mb-4">
                            {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                        </h2>

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la categoría
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Ej: Programación, Música, etc."
                                    autoFocus
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>

                            <div className="flex gap-3 justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium"
                                    disabled={processing}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}

/**
 * INSTRUCCIONES PARA USAR ESTE COMPONENTE:
 * 
 * 1. Crea la carpeta: resources/js/pages/PlaylistCategories/
 * 2. Copia este archivo como: resources/js/pages/PlaylistCategories/Index.tsx
 * 3. Elimina este comentario de instrucciones
 * 4. El componente ya está listo para usar
 * 
 * SIGUIENTE PASO:
 * Crea componentes similares para:
 * - ChannelCategories/Index.tsx (muy similar, solo cambia los nombres)
 * - Playlists/Index.tsx (más complejo, incluye formulario para URLs y categorías múltiples)
 * - Channels/Index.tsx (similar a Playlists)
 * 
 * PATRÓN PARA SEGUIR:
 * 1. Define las interfaces de TypeScript para los datos
 * 2. Usa useForm de Inertia para manejar formularios
 * 3. Implementa CRUD con post, put, delete
 * 4. Usa estados locales (useState) para manejar modales
 * 5. Aplica estilos con Tailwind CSS
 * 6. Usa AppLayout como layout principal
 */
