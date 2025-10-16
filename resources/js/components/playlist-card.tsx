import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlayCircle, ImageOff, Edit, Trash2, ExternalLink } from 'lucide-react';
import { type MouseEventHandler } from 'react';

interface PlaylistCardProps {
    /** Título de la playlist */
    title: string;
    /** Descripción opcional */
    description?: string | null;
    /** URL original de YouTube */
    url: string;
    /** URL del thumbnail proporcionada por el backend */
    thumbnailUrl?: string | null;
    /** Categorías asociadas */
    categories: Array<{ id: number; name: string }>;
    /** Fecha de creación */
    createdAt: string;
    /** Acción para editar */
    onEdit: MouseEventHandler<HTMLButtonElement>;
    /** Acción para eliminar */
    onDelete: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Tarjeta para mostrar playlists con miniatura, categorías y acciones rápidas.
 */
export function PlaylistCard({
    title,
    description,
    url,
    thumbnailUrl,
    categories,
    createdAt,
    onEdit,
    onDelete,
}: PlaylistCardProps) {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(createdAt));

    return (
        <Card className="flex h-full flex-col overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            {/* <div className="aspect-video w-full bg-gray-100">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={`Thumbnail de ${title}`}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-gray-500">
                        <ImageOff className="size-10" aria-hidden />
                        <span className="text-sm">Sin thumbnail disponible</span>
                    </div>
                )}
            </div> */}

            <CardHeader className="space-y-3 px-6 py-4">
                <CardTitle className="flex items-start gap-2 text-lg">
                    <PlayCircle className="mt-1 size-5 text-red-500" aria-hidden />
                    <span className="leading-tight text-blue-600">{title}</span>
                </CardTitle>
                {description && (
                    <p className="line-clamp-3 text-sm text-gray-600">
                        {description}
                    </p>
                )}
            </CardHeader>

            {/* <CardContent className="flex flex-1 flex-col justify-between px-6 pb-4">
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <Badge key={category.id} variant="secondary">
                            {category.name}
                        </Badge>
                    ))}
                    {categories.length === 0 && (
                        <span className="text-xs text-gray-400">
                            Sin categorías asignadas
                        </span>
                    )}
                </div>
                <p className="mt-4 text-xs uppercase tracking-wide text-gray-400">
                    Registrada el {formattedDate}
                </p>
            </CardContent> */}

            <CardFooter className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-4 ">
                <Button
                    asChild
                    variant="outline"
                    className="h-9 px-4 text-sm"
                >
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                    >
                        <svg
                            className="size-4"
                            viewBox="0 0 24 24"
                            aria-hidden
                        >
                            <path 
                                fill="#FF0000" 
                                d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814" 
                            />
                            <path 
                                fill="#FFFFFF" 
                                d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" 
                            />
                        </svg>
                        Ver en YouTube
                    </a>
                </Button>
                <div className="flex items-center gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-9 px-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                        onClick={onEdit}
                    >
                        <Edit className="size-4" aria-hidden />
                        Editar
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-9 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={onDelete}
                    >
                        <Trash2 className="size-4" aria-hidden />
                        Eliminar
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
