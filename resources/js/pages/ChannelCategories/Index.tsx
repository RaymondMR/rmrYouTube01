import { Modal } from '@/components/modal';
import InputError from '@/components/input-error';
import { CategoryCard } from '@/components/category-card';
import { SearchBar } from '@/components/search-bar';
import { Toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import channelCategoriesRoutes from '@/routes/channel-categories';
import channelsRoutes from '@/routes/channels';
import { home } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, router, useForm, usePage } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface ChannelCategory {
    id: number;
    name: string;
    channels_count: number;
    created_at: string;
}

interface PageProps {
    categories: ChannelCategory[];
    search?: string;
    flash?: {
        success?: string;
        error?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inicio', href: home().url },
    { title: 'Categorías de Canales', href: channelCategoriesRoutes.index().url },
];

/**
 * Listado de categorías de canales con búsqueda y acciones CRUD.
 */
export default function ChannelCategoriesIndex({
    categories,
    search: initialSearch = '',
}: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<ChannelCategory | null>(null);

    const form = useForm({
        name: '',
    });

    const deleteForm = useForm({});

    const openCreateModal = () => {
        setEditingCategory(null);
        form.reset();
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (category: ChannelCategory) => {
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
            form.put(channelCategoriesRoutes.update(editingCategory.id).url, {
                preserveScroll: true,
                onSuccess: closeModal,
                onFinish: () => form.reset('name'),
            });
            return;
        }

        form.post(channelCategoriesRoutes.store().url, {
            preserveScroll: true,
            onSuccess: closeModal,
            onFinish: () => form.reset('name'),
        });
    };

    const handleDelete = (category: ChannelCategory) => {
        if (
            confirm(
                `¿Seguro que deseas eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`,
            )
        ) {
            deleteForm.delete(channelCategoriesRoutes.destroy(category.id).url, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = () => {
        router.get(
            channelCategoriesRoutes.index().url,
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
            channelCategoriesRoutes.index().url,
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
        <AppLayout
            breadcrumbs={breadcrumbs}
            contentClassName="bg-[linear-gradient(135deg,_#667eea_0%,_#764ba2_100%)]"
        >
            <Head title="Categorías de Canales" />

            <Toast message={flashMessage} variant={flash?.error ? 'error' : 'success'} />

            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold text-white">
                            Categorías de canales
                        </h1>
                        <p className="text-sm text-white/80">
                            Organiza tus canales favoritos por temática o propósito.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="h-10 gap-2 self-start sm:self-auto">
                        <Plus className="size-4" aria-hidden />
                        Nueva categoría
                    </Button>
                </div>

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={handleSearch}
                    onReset={initialSearch ? resetFilters : undefined}
                    loading={form.processing || deleteForm.processing}
                    placeholder="Buscar categorías por nombre"
                />

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-gray-700">
                            No se encontraron categorías.
                        </p>
                        <p className="mt-2 max-w-lg text-sm text-gray-500">
                            Crea una nueva categoría para comenzar a clasificar tus canales de YouTube.
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
                                totalItems={category.channels_count}
                                createdAt={category.created_at}
                                href={channelsRoutes.index(category.id).url}
                                onEdit={() => openEditModal(category)}
                                onDelete={() => handleDelete(category)}
                                itemLabel="canal"
                                itemsLabel="canales"
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
                title={editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                description="Los nombres claros facilitan encontrar tus canales rápidamente."
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
                            form="channel-category-form"
                            className="min-w-[120px]"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Guardando…' : 'Guardar'}
                        </Button>
                    </div>
                }
            >
                <form
                    id="channel-category-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <label
                            htmlFor="channel-category-name"
                            className="text-sm font-medium text-gray-700"
                        >
                            Nombre de la categoría
                        </label>
                        <Input
                            id="channel-category-name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            placeholder="Ej. Educación, Entretenimiento, Inspiración…"
                            autoFocus
                        />
                        <InputError message={form.errors.name} />
                    </div>
                </form>
            </Modal>
        </AppLayout>
    );
}
