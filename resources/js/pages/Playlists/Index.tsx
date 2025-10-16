import { Modal } from '@/components/modal';
import InputError from '@/components/input-error';
import { PlaylistCard } from '@/components/playlist-card';
import { SearchBar } from '@/components/search-bar';
import { Toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import playlistCategoriesRoutes from '@/routes/playlist-categories';
import playlistsRoutes from '@/routes/playlists';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface PlaylistCategory {
    id: number;
    name: string;
}

interface Playlist {
    id: number;
    title: string;
    description?: string | null;
    url: string;
    thumbnail_url?: string | null;
    categories: PlaylistCategory[];
    created_at: string;
}

interface PageProps {
    category: PlaylistCategory;
    playlists: Playlist[];
    allCategories: PlaylistCategory[];
    search?: string;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbBase: BreadcrumbItem[] = [
    { title: 'Inicio', href: home().url },
    { title: 'Categorías de Playlists', href: playlistCategoriesRoutes.index().url },
];

/**
 * Listado de playlists para una categoría específica con CRUD completo.
 */
export default function PlaylistsIndex({
    category,
    playlists,
    allCategories,
    search: initialSearch = '',
}: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPlaylist, setEditingPlaylist] = useState<Playlist | null>(null);

    const form = useForm({
        title: '',
        description: '',
        url: '',
        categories: [] as number[],
    });

    const deleteForm = useForm({});

    const breadcrumbs: BreadcrumbItem[] = [
        ...breadcrumbBase,
        { title: category.name, href: playlistsRoutes.index(category.id).url },
    ];

    const openCreateModal = () => {
        setEditingPlaylist(null);
        form.setData({
            title: '',
            description: '',
            url: '',
            categories: [category.id],
        });
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (playlist: Playlist) => {
        setEditingPlaylist(playlist);
        form.setData({
            title: playlist.title,
            description: playlist.description ?? '',
            url: playlist.url,
            categories: playlist.categories.map((item) => item.id),
        });
        form.clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPlaylist(null);
        form.reset();
        form.clearErrors();
    };

    const toggleCategory = (categoryId: number) => {
        form.setData(
            'categories',
            form.data.categories.includes(categoryId)
                ? form.data.categories.filter((id) => id !== categoryId)
                : [...form.data.categories, categoryId],
        );
    };

    const handleSubmit = () => {
        if (editingPlaylist) {
            form.put(playlistsRoutes.update(editingPlaylist.id).url, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
            return;
        }

        form.post(playlistsRoutes.store().url, {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const handleDelete = (playlist: Playlist) => {
        if (
            confirm(
                `¿Seguro que deseas eliminar la playlist "${playlist.title}"?`,
            )
        ) {
            deleteForm.delete(playlistsRoutes.destroy(playlist.id).url, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = () => {
        router.get(
            playlistsRoutes.index(category.id).url,
            { search: searchTerm || undefined },
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    const resetFilters = () => {
        setSearchTerm('');
        router.get(
            playlistsRoutes.index(category.id).url,
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
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Playlists de ${category.name}`} />

            <Toast message={flashMessage} variant={flash?.error ? 'error' : 'success'} />

            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Playlists de {category.name}
                        </h1>
                        <p className="text-sm text-gray-600">
                            Gestiona tus listas de reproducción guardadas dentro de esta categoría.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="h-10 gap-2 self-start sm:self-auto">
                        <Plus className="size-4" aria-hidden />
                        Nueva playlist
                    </Button>
                </div>

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={handleSearch}
                    onReset={initialSearch ? resetFilters : undefined}
                    loading={form.processing || deleteForm.processing}
                    placeholder="Buscar playlists por título o descripción"
                />

                {playlists.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-gray-700">
                            Aún no tienes playlists registradas en {category.name}.
                        </p>
                        <p className="mt-2 max-w-lg text-sm text-gray-500">
                            Crea una playlist para mantener tus videos favoritos organizados en esta temática.
                        </p>
                        <Button onClick={openCreateModal} className="mt-6">
                            Crear playlist
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {playlists.map((playlist) => (
                            <PlaylistCard
                                key={playlist.id}
                                title={playlist.title}
                                description={playlist.description}
                                url={playlist.url}
                                thumbnailUrl={playlist.thumbnail_url}
                                categories={playlist.categories}
                                createdAt={playlist.created_at}
                                onEdit={() => openEditModal(playlist)}
                                onDelete={() => handleDelete(playlist)}
                            />
                        ))}
                    </div>
                )}
            </div>

            <Modal
                open={isModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        closeModal();
                    } else {
                        setIsModalOpen(true);
                    }
                }}
                title={editingPlaylist ? 'Editar playlist' : 'Nueva playlist'}
                description="Completa los datos de la playlist y selecciona al menos una categoría."
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
                            form="playlist-form"
                            className="min-w-[140px]"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Guardando…' : 'Guardar'}
                        </Button>
                    </div>
                }
            >
                <form
                    id="playlist-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <label htmlFor="playlist-title" className="text-sm font-medium text-gray-700">
                            Título de la playlist
                        </label>
                        <Input
                            id="playlist-title"
                            value={form.data.title}
                            onChange={(event) => form.setData('title', event.target.value)}
                            placeholder="Ej. Cursos de Laravel 12"
                            required
                        />
                        <InputError message={form.errors.title} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="playlist-url" className="text-sm font-medium text-gray-700">
                            URL de la playlist
                        </label>
                        <Input
                            id="playlist-url"
                            type="url"
                            value={form.data.url}
                            onChange={(event) => form.setData('url', event.target.value)}
                            placeholder="https://www.youtube.com/playlist?list=..."
                            required
                        />
                        <InputError message={form.errors.url} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="playlist-description" className="text-sm font-medium text-gray-700">
                            Descripción (opcional)
                        </label>
                        <Textarea
                            id="playlist-description"
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            placeholder="Descripción breve para recordar el contenido de la playlist."
                            rows={4}
                        />
                        <InputError message={form.errors.description} />
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-medium text-gray-700">
                            Categorías asignadas
                        </p>
                        <div className="grid gap-2 rounded-lg border border-gray-200 bg-white p-4">
                            {allCategories.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex items-center gap-3 text-sm text-gray-700"
                                >
                                    <Checkbox
                                        checked={form.data.categories.includes(item.id)}
                                        onCheckedChange={() => toggleCategory(item.id)}
                                    />
                                    <span>{item.name}</span>
                                </label>
                            ))}
                        </div>
                        <InputError message={form.errors.categories as string} />
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
