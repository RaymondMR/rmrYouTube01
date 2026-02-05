import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';

interface CategoryCardProps {
    /** Nombre de la categoría */
    name: string;
    /** Número de elementos asociados (playlists o canales) */
    totalItems: number;
    /** Fecha de creación en formato ISO */
    createdAt: string;
    /** Ruta a la que se navega al hacer clic en la tarjeta */
    href: string;
    /** Acción para abrir el modal de edición */
    onEdit: () => void;
    /** Acción para confirmar la eliminación */
    onDelete: () => void;
    /** Etiqueta en singular para mostrar el contador */
    itemLabel: string;
    /** Etiqueta en plural para el contador (por ejemplo, "canales") */
    itemsLabel?: string;
}

/**
 * Tarjeta reutilizable para mostrar categorías de playlists o canales.
 */
export function CategoryCard({
    name,
    totalItems,
    createdAt,
    href,
    onEdit,
    onDelete,
    itemLabel,
    itemsLabel,
}: CategoryCardProps) {
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(new Date(createdAt));

    return (
        <Card className="h-full overflow-hidden border-t-[10px] border-b-[10px] border-yellow-300 bg-white shadow-sm transition hover:-translate-y-1 hover:bg-gray-400 hover:shadow-md">
            <Link href={href} className="block">
                <div className="flex w-full items-start justify-between">
                    <CardContent className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {name}
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">
                            {totalItems}{' '}
                            {totalItems === 1
                                ? itemLabel
                                : (itemsLabel ?? `${itemLabel}s`)}
                        </p>
                        {/* <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="size-4" aria-hidden />
                            Creada el {formattedDate}
                        </div> */}
                    </CardContent>

                    <div className="flex items-start gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-3 text-sm text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            onClick={onEdit}
                        >
                            <Edit className="size-4" aria-hidden />
                            Editar
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-3 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={onDelete}
                        >
                            <Trash2 className="size-4" aria-hidden />
                            Eliminar
                        </Button>
                    </div>
                </div>
            </Link>
        </Card>
    );
}
