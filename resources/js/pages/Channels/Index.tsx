import { Modal } from '@/components/modal';
import InputError from '@/components/input-error';
import { ChannelCard } from '@/components/channel-card';
import { SearchBar } from '@/components/search-bar';
import { Toast } from '@/components/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
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
}

interface Channel {
    id: number;
    name: string;
    description?: string | null;
    url: string;
    youtube_channel_handle?: string | null;
    categories: ChannelCategory[];
    created_at: string;
}

interface PageProps {
    category: ChannelCategory;
    channels: Channel[];
    allCategories: ChannelCategory[];
    search?: string;
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

const breadcrumbBase: BreadcrumbItem[] = [
    { title: 'Inicio', href: home().url },
    { title: 'Categorías de Canales', href: channelCategoriesRoutes.index().url },
];

/**
 * Listado de canales de YouTube filtrados por categoría con CRUD completo.
 */
export default function ChannelsIndex({
    category,
    channels,
    allCategories,
    search: initialSearch = '',
}: PageProps) {
    const { flash } = usePage<PageProps>().props;
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingChannel, setEditingChannel] = useState<Channel | null>(null);

    const form = useForm({
        name: '',
        description: '',
        url: '',
        categories: [] as number[],
    });

    const deleteForm = useForm({});

    const breadcrumbs: BreadcrumbItem[] = [
        ...breadcrumbBase,
        { title: category.name, href: channelsRoutes.index(category.id).url },
    ];

    const openCreateModal = () => {
        setEditingChannel(null);
        form.setData({
            name: '',
            description: '',
            url: '',
            categories: [category.id],
        });
        form.clearErrors();
        setIsModalOpen(true);
    };

    const openEditModal = (channel: Channel) => {
        setEditingChannel(channel);
        form.setData({
            name: channel.name,
            description: channel.description ?? '',
            url: channel.url,
            categories: channel.categories.map((item) => item.id),
        });
        form.clearErrors();
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingChannel(null);
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
        if (editingChannel) {
            form.put(channelsRoutes.update(editingChannel.id).url, {
                preserveScroll: true,
                onSuccess: closeModal,
            });
            return;
        }

        form.post(channelsRoutes.store().url, {
            preserveScroll: true,
            onSuccess: closeModal,
        });
    };

    const handleDelete = (channel: Channel) => {
        if (
            confirm(
                `¿Seguro que deseas eliminar el canal "${channel.name}"?`,
            )
        ) {
            deleteForm.delete(channelsRoutes.destroy(channel.id).url, {
                preserveScroll: true,
            });
        }
    };

    const handleSearch = () => {
        router.get(
            channelsRoutes.index(category.id).url,
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
            channelsRoutes.index(category.id).url,
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
        <AppLayout breadcrumbs={breadcrumbs}
        contentClassName="bg-[linear-gradient(180deg,_rgb(180,172,141)_0%,_rgb(226,223,206)_55%,_rgb(224,220,220)_100%)]"
        >
            <Head title={`Canales de ${category.name}`} />

            <Toast message={flashMessage} variant={flash?.error ? 'error' : 'success'} />

            <div className="flex flex-col gap-8 p-6">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1.5">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Canales de {category.name}
                        </h1>
                        <p className="text-sm text-gray-600">
                            Mantén organizados tus canales favoritos dentro de esta categoría.
                        </p>
                    </div>

                    <Button onClick={openCreateModal} className="h-10 gap-2 self-start sm:self-auto">
                        <Plus className="size-4" aria-hidden />
                        Nuevo canal
                    </Button>
                </div>

                <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    onSubmit={handleSearch}
                    onReset={initialSearch ? resetFilters : undefined}
                    loading={form.processing || deleteForm.processing}
                    placeholder="Buscar canales por nombre o descripción"
                />

                {channels.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white/60 p-12 text-center shadow-sm">
                        <p className="text-lg font-medium text-gray-700">
                            No se encontraron canales en {category.name}.
                        </p>
                        <p className="mt-2 max-w-lg text-sm text-gray-500">
                            Registra tus canales favoritos para tenerlos siempre a mano.
                        </p>
                        <Button onClick={openCreateModal} className="mt-6">
                            Registrar canal
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        {channels.map((channel) => (
                            <ChannelCard
                                key={channel.id}
                                name={channel.name}
                                description={channel.description}
                                url={channel.url}
                                handle={channel.youtube_channel_handle ?? undefined}
                                categories={channel.categories}
                                createdAt={channel.created_at}
                                onEdit={() => openEditModal(channel)}
                                onDelete={() => handleDelete(channel)}
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
                title={editingChannel ? 'Editar canal' : 'Nuevo canal'}
                description="Completa los datos del canal y selecciona las categorías donde quieres verlo."
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
                            form="channel-form"
                            className="min-w-[140px]"
                            disabled={form.processing}
                        >
                            {form.processing ? 'Guardando…' : 'Guardar'}
                        </Button>
                    </div>
                }
            >
                <form
                    id="channel-form"
                    onSubmit={(event) => {
                        event.preventDefault();
                        handleSubmit();
                    }}
                    className="space-y-5"
                >
                    <div className="space-y-2">
                        <label htmlFor="channel-name" className="text-sm font-medium text-gray-700">
                            Nombre del canal
                        </label>
                        <Input
                            id="channel-name"
                            value={form.data.name}
                            onChange={(event) => form.setData('name', event.target.value)}
                            placeholder="Ej. Traversy Media"
                            required
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="channel-url" className="text-sm font-medium text-gray-700">
                            URL del canal
                        </label>
                        <Input
                            id="channel-url"
                            type="url"
                            value={form.data.url}
                            onChange={(event) => form.setData('url', event.target.value)}
                            placeholder="https://www.youtube.com/@MiCanal"
                            required
                        />
                        <InputError message={form.errors.url} />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="channel-description" className="text-sm font-medium text-gray-700">
                            Descripción (opcional)
                        </label>
                        <Textarea
                            id="channel-description"
                            value={form.data.description}
                            onChange={(event) => form.setData('description', event.target.value)}
                            placeholder="Cuenta de qué trata este canal y por qué lo agregas."
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
