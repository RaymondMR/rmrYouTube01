import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Antenna, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { type MouseEventHandler } from 'react';

interface ChannelCardProps {
    /** Nombre visible del canal */
    name: string;
    /** Descripción breve proporcionada por el usuario */
    description?: string | null;
    /** URL oficial del canal en YouTube */
    url: string;
    /** Handle del canal (extraído desde el backend) */
    handle?: string | null;
    /** Categorías asociadas */
    categories: Array<{ id: number; name: string }>;
    /** Fecha de creación */
    createdAt: string;
    /** Acción para abrir el modal de edición */
    onEdit: MouseEventHandler<HTMLButtonElement>;
    /** Acción para confirmar la eliminación */
    onDelete: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Tarjeta para mostrar información de un canal de YouTube.
 */
export function ChannelCard({
    name,
    description,
    url,
    handle,
    categories,
    createdAt,
    onEdit,
    onDelete,
}: ChannelCardProps) {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(createdAt));

    return (
        <Card className="flex h-full flex-col justify-between border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <CardHeader className="space-y-3 px-6 py-4">
                <CardTitle className="flex items-start gap-2 text-lg">
                    <Antenna className="mt-1 size-5 text-blue-500" aria-hidden />
                    <span className="leading-tight">{name}</span>
                </CardTitle>
                {handle && (
                    <p className="text-sm font-medium text-blue-600">
                        @{handle}
                    </p>
                )}
                {description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                        {description}
                    </p>
                )}
            </CardHeader>

            <CardContent className="flex flex-1 flex-col justify-between px-6 pb-4">
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
                    Registrado el {formattedDate}
                </p>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3">
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
                        <ExternalLink className="size-4" aria-hidden />
                        Ver canal
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
