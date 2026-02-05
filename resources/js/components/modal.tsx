import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface ModalProps {
    /** Estado para mostrar u ocultar el modal */
    open: boolean;
    /** Callback cuando el modal cambia de estado */
    onOpenChange: (open: boolean) => void;
    /** Título visible en el encabezado */
    title: string;
    /** Descripción opcional debajo del título */
    description?: string;
    /** Contenido principal del modal */
    children: ReactNode;
    /** Contenido del pie del modal (botones de acción) */
    footer?: ReactNode;
    /** Clases adicionales para personalizar el contenedor */
    className?: string;
}

/**
 * Modal reutilizable basado en Radix Dialog.
 * Se usa para formularios de creación y edición dentro del Content Manager.
 */
export function Modal({
    open,
    onOpenChange,
    title,
    description,
    children,
    footer,
    className,
}: ModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn('max-h-[90vh] overflow-y-auto', className)}
            >
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && (
                        <DialogDescription>{description}</DialogDescription>
                    )}
                </DialogHeader>

                <div className="space-y-4">{children}</div>

                {footer && <DialogFooter>{footer}</DialogFooter>}
            </DialogContent>
        </Dialog>
    );
}

/**
 * Exporta el trigger para mantener la API consistente con Radix.
 */
export const ModalTrigger = DialogTrigger;

/**
 * Exporta el botón de cierre para reutilizarlo en acciones internas.
 */
export const ModalClose = DialogClose;
