import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { Calendar, Edit, Trash2 } from 'lucide-react';

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
        <Card className="h-full overflow-hidden border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <Link href={href} className="block">
                <CardContent className="space-y-3 px-6 py-5">
                    <h3 className="text-xl font-semibold text-gray-900">
                        {name}
                    </h3>
                    <p className="text-sm text-gray-600">
                        {totalItems}{' '}
                        {totalItems === 1
                            ? itemLabel
                            : itemsLabel ?? `${itemLabel}s`}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="size-4" aria-hidden />
                        Creada el {formattedDate}
                    </div>
                </CardContent>
            </Link>

            <CardFooter className="border-t border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex w-full items-center justify-end gap-2">
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
            </CardFooter>
        </Card>
    );
}
