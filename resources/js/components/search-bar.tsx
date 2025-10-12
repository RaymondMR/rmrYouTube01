import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { type FormEvent } from 'react';
import { X } from 'lucide-react';

interface SearchBarProps {
    /** Valor actual del campo de búsqueda */
    value: string;
    /** Callback al cambiar el texto */
    onChange: (value: string) => void;
    /** Acción al enviar el formulario */
    onSubmit: () => void;
    /** Acción opcional para limpiar el filtro */
    onReset?: () => void;
    /** Texto de placeholder */
    placeholder?: string;
    /** Aplica estilos adicionales */
    className?: string;
    /** Indica si el formulario está procesando */
    loading?: boolean;
}

/**
 * Barra de búsqueda reutilizable con botón de limpiar.
 * Se usa en cada listado para filtrar por nombre o título.
 */
export function SearchBar({
    value,
    onChange,
    onSubmit,
    onReset,
    placeholder = 'Buscar…',
    className,
    loading = false,
}: SearchBarProps) {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSubmit();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn('flex w-full flex-col gap-2 md:flex-row', className)}
        >
            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={placeholder}
                className="h-10"
                aria-label="Buscar"
            />

            <div className="flex gap-2">
                <Button type="submit" className="h-10 px-5" disabled={loading}>
                    Buscar
                </Button>
                {onReset && (
                    <Button
                        type="button"
                        variant="ghost"
                        className="h-10 px-3"
                        onClick={onReset}
                    >
                        <X className="size-4" />
                        Limpiar
                    </Button>
                )}
            </div>
        </form>
    );
}
