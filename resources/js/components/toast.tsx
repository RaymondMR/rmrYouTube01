import { Alert, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { CheckCircle2, XCircle, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

type ToastVariant = 'success' | 'error';

interface ToastProps {
    /** Mensaje a mostrar en la notificación */
    message?: string;
    /** Tipo de alerta para definir colores e iconos */
    variant?: ToastVariant;
    /** Duración en milisegundos antes de ocultarse automáticamente */
    duration?: number;
    /** Callback opcional cuando la notificación se cierra */
    onClose?: () => void;
}

/**
 * Muestra mensajes flash como toast flotantes.
 * Pensado para reutilizarlo en todas las páginas del gestor.
 */
export function Toast({
    message,
    variant = 'success',
    duration = 4000,
    onClose,
}: ToastProps) {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (!message) {
            setVisible(false);
            return;
        }

        setVisible(true);
        const timeout = window.setTimeout(() => {
            setVisible(false);
            onClose?.();
        }, duration);

        return () => window.clearTimeout(timeout);
    }, [message, duration, onClose]);

    const icon = useMemo(() => {
        if (variant === 'error') {
            return <XCircle className="size-5 text-red-500" aria-hidden />;
        }

        return <CheckCircle2 className="size-5 text-emerald-500" aria-hidden />;
    }, [variant]);

    if (!message || !visible) {
        return null;
    }

    return (
        <div className="fixed inset-x-0 top-6 z-[60] flex justify-center px-4">
            <Alert
                className={cn(
                    'relative flex w-full max-w-lg items-start gap-3 rounded-lg border bg-white/95 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur',
                    variant === 'error'
                        ? 'border-red-200 text-red-700'
                        : 'border-emerald-200 text-emerald-700',
                )}
            >
                {icon}
                <AlertDescription className="pr-8 text-sm font-medium">
                    {message}
                </AlertDescription>

                <button
                    type="button"
                    onClick={() => {
                        setVisible(false);
                        onClose?.();
                    }}
                    className="absolute right-2 top-2 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                    aria-label="Cerrar notificación"
                >
                    <X className="size-4" aria-hidden />
                </button>
            </Alert>
        </div>
    );
}
