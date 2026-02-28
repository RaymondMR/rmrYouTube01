import { CategoryCard } from '@/components/category-card';
import { PlaylistCard } from '@/components/playlist-card';
import InputError from '@/components/input-error';
import { Modal } from '@/components/modal';
import { SearchBar } from '@/components/search-bar';
import { Toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { home } from '@/routes';
import playlistCategoriesRoutes from '@/routes/playlist-categories';
import playlistsRoutes from '@/routes/playlists';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PlaylistCategory {
    id: number;
    name: string;
    playlists_count: number;
    created_at: string;
}

interface PageProps {
    categories: PlaylistCategory[];
    search?: string;
    // resultados de búsqueda de playlists si se solicitó
    foundPlaylists?: Array<{
        id: number;
        title: string;
        description?: string | null;
        url: string;
        thumbnail_url?: string | null;
        categories: Array<{ id: number; name: string }>;
        created_at: string;
    }>;
    playlistSearch?: string;
    playlistField?: 'title' | 'description';
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: home().url },
    {
        title: 'Categorías de Playlists',
        href: playlistCategoriesRoutes.index().url,
    },
];

/**
 * Listado de categorías de playlists con búsqueda y CRUD.
 */
export default function PlaylistCategoriesIndex({
    categories,
    search: initialSearch = '',
    foundPlaylists,
    playlistSearch = '',
    playlistField = 'title',
}: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [playlistSearchTerm, setPlaylistSearchTerm] =
        useState<string>(playlistSearch ?? '');
    const [playlistSearchField, setPlaylistSearchField] =
        useState<'title' | 'description'>(playlistField ?? 'title');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] =
        useState<PlaylistCategory | null>(null);

    // Formulario para crear/editar una categoría
    const form = useForm({
        name: '',
    });

    // Formulario para eliminar una categoría
    const deleteForm = useForm({});

    // Muestra el modal y resetea datos según corresponda
    const openCreateModal = () => {
        setEditingCategory(null);
        form.reset();
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category: PlaylistCategory) => {
        setEditingCategory(category);
        form.setData('name', category.name);
        form.clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        form.reset();
        form.clearErrors();
    };

    const handleSubmit = () => {
        if (editingCategory) {
            form.put(playlistCategoriesRoutes.update(editingCategory.id).url, {
                preserveScroll: true,
                onSuccess: closeModal,
                onFinish: () => form.reset('name'),
            });
            return;
        }

        form.post(playlistCategoriesRoutes.store().url, {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: () => form.reset('name'),
        });
    };

    const handleDelete = (category: PlaylistCategory) => {
        if (
            confirm(
                `¿Seguro que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
            )
        ) {
            deleteForm.delete(
                playlistCategoriesRoutes.destroy(category.id).url,
                {
                    preserveScroll: true,
                },
            );
        }
    };

    const buildParams = () => {
        const params: Record<string, any> = {};
        if (searchTerm) {
            params.search = searchTerm;
        }
        if (playlistSearchTerm) {
            params.playlist_search = playlistSearchTerm;
            params.playlist_field = playlistSearchField;
        }
        return params;
    };

    const handleSearch = () => {
        router.get(
            playlistCategoriesRoutes.index().url,
            buildParams(),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const handlePlaylistSearch = () => {
        router.get(
            playlistCategoriesRoutes.index().url,
            buildParams(),
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearchTerm('');
        setPlaylistSearchTerm('');
        setPlaylistSearchField('title');
        router.get(
            playlistCategoriesRoutes.index().url,
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const flashMessage = useMemo(
        () => flash?.success || flash?.error,
        [flash?.success, flash?.error],
    );

    useEffect(() => {
        // Actualiza el valor cuando cambia la búsqueda desde el backend
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        // sincroniza los valores de búsqueda de playlists
        setPlaylistSearchTerm(playlistSearch ?? '');
        setPlaylistSearchField(playlistField ?? 'title');
    }, [playlistSearch, playlistField]);

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            contentClassName="bg-[linear-gradient(180deg,_rgb(180,172,141)_0%,_rgb(226,223,206)_55%,_rgb(224,220,220)_100%)]"
        >
            <Head title="Categorías de Playlists" />

            <Toast
                message={flashMessage}
                variant={flash?.error ? 'error' : 'success'}
            />

            <div className="flex flex-col gap-8 p-6 text-neutral-900">
                {/* Cabecera con título y CTA */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold text-neutral-900">
                            Categorías de playlists
                        </h1>
                        <p className="text-sm text-neutral-700">
                            Agrupa tus listas de reproducción favoritas para
                            encontrarlas rápidamente.
                        </p>
                    </div>

                    <Button
                        onClick={openCreateModal}
                        className="h-10 gap-2 self-start sm:self-auto"
                    >
                        <Plus className="size-4" aria-hidden />
                        Nueva categoría
                    </Button>
                </div>

                {/* Barras de búsqueda: categorías y playlists */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                        onSubmit={handleSearch}
                        onReset={initialSearch || playlistSearch ? resetFilters : undefined}
                        loading={form.processing || deleteForm.processing}
                        placeholder="Buscar categorías por nombre"
                        className="flex-1"
                    />

                    <div className="flex items-center gap-2">
                        <Input
                            value={playlistSearchTerm}
                            onChange={(e) => setPlaylistSearchTerm(e.target.value)}
                            placeholder="Buscar playlists"
                            className="w-full max-w-xs"
                        />
                        <select
                            className="rounded-md border-gray-300 bg-white px-2 py-1 text-sm"
                            value={playlistSearchField}
                            onChange={(e) =>
                                setPlaylistSearchField(
                                    e.target.value as 'title' | 'description',
                                )
                            }
                        >
                            <option value="title">Título</option>
                            <option value="description">Descripción</option>
                        </select>
                        <Button
                            type="button"
                            onClick={handlePlaylistSearch}
                            disabled={form.processing || deleteForm.processing}
                        >
                            Buscar
                        </Button>
                    </div>
                </div>

                {/* resultados de búsqueda de playlists (si se hizo una) */}
                {foundPlaylists !== undefined && (
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold text-gray-900">
                            Resultados de playlists
                        </h2>
                        {foundPlaylists && foundPlaylists.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                                {foundPlaylists.map((pl) => (
                                    <PlaylistCard
                                        key={pl.id}
                                        title={pl.title}
                                        description={pl.description}
                                        url={pl.url}
                                        thumbnailUrl={pl.thumbnail_url ?? undefined}
                                        categories={pl.categories}
                                        createdAt={pl.created_at}
                                        onEdit={() => {
                                            /* no hay edición desde este listado */
                                        }}
                                        onDelete={() => {
                                            /* no hay borrado desde este listado */
                                        }}
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-600">
                                No se encontraron playlists que coincidan con la
                                búsqueda.
                            </p>
                        )}
                    </div>
                )}

                {/* Grid de categorías */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-gray-700">
                            Aún no tienes categorías registradas.
                        </p>
                        <p className="mt-2 max-w-lg text-sm text-gray-500">
                            Crea tu primera categoría para comenzar a organizar
                            tus playlists de YouTube.
                        </p>
                        <Button onClick={openCreateModal} className="mt-6">
                            Crear categoría
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category.id}
                                name={category.name}
                                totalItems={category.playlists_count}
                                createdAt={category.created_at}
                                href={playlistsRoutes.index(category.id).url}
                                onEdit={() => openEditModal(category)}
                                onDelete={() => handleDelete(category)}
                                itemLabel="playlist"
                                itemsLabel="playlists"
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Modal para crear o editar categorías */}
            <Modal
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    } else {
                        setIsModalOpen(true);
                    }
                }}
                title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                description="Agrega un nombre descriptivo para organizar tus listas de reproducción."
                footer={
                    <div className="flex w-full justify-end gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={closeModal}
                            disabled={form.processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            form="playlist-category-form"
                            className="min-w-[120px]"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Guardando…' : 'Guardar'}
                        </Button>
                    </div>
                }
            >
                <form
                    id="playlist-category-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="category-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Nombre de la categoría
                        </label>
                        <Input
                            id="category-name"
                            value={form.data.name}
                            onChange={(event) =>
                                form.setData('name', event.target.value)
                            }
                            placeholder="Ej. Programación, Música, Diseño…"
                            autoFocus
                        />
                        <InputError message={form.errors.name} />
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
