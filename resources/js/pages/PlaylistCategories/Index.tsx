import { Modal } from '@/components/modal';
import InputError from '@/components/input-error';
import { CategoryCard } from '@/components/category-card';
import { SearchBar } from '@/components/search-bar';
import { Toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    playlists_count: number;
    created_at: string;
}

interface PageProps {
    categories: PlaylistCategory[];
    search?: string;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: home().url },
    { title: 'Categorías de Playlists', href: playlistCategoriesRoutes.index().url },
];

/**
 * Listado de categorías de playlists con búsqueda y CRUD.
 */
export default function PlaylistCategoriesIndex({
    categories,
    search: initialSearch = '',
}: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<PlaylistCategory | null>(null);

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
            deleteForm.delete(playlistCategoriesRoutes.destroy(category.id).url, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = () => {
        router.get(
            playlistCategoriesRoutes.index().url,
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

    return (
        <AppLayout
            breadcrumbs={breadcrumbs}
            contentClassName="bg-[linear-gradient(180deg,_rgb(180,172,141)_0%,_rgb(226,223,206)_55%,_rgb(224,220,220)_100%)]"
        >
            <Head title="Categorías de Playlists" />

            <Toast message={flashMessage} variant={flash?.error ? 'error' : 'success'} />

            <div className="flex flex-col gap-8 p-6 text-neutral-900">
                {/* Cabecera con título y CTA */}
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold text-neutral-900">
                            Categorías de playlists
                        </h1>
                        <p className="text-sm text-neutral-700">
                            Agrupa tus listas de reproducción favoritas para encontrarlas rápidamente.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="h-10 gap-2 self-start sm:self-auto">
                        <Plus className="size-4" aria-hidden />
                        Nueva categoría
                    </Button>
                </div>

                {/* Barra de búsqueda */}
                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={handleSearch}
                    onReset={initialSearch ? resetFilters : undefined}
                    loading={form.processing || deleteForm.processing}
                    placeholder="Buscar categorías por nombre"
                />

                {/* Grid de categorías */}
                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-gray-700">
                            Aún no tienes categorías registradas.
                        </p>
                        <p className="mt-2 max-w-lg text-sm text-gray-500">
                            Crea tu primera categoría para comenzar a organizar tus playlists de YouTube.
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
                            onChange={(event) => form.setData('name', event.target.value)}
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
