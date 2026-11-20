
import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import type {
    TurnstileInstance,
} from "@marsidev/react-turnstile";

interface PendingVerification {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
}

const VERIFICATION_TIMEOUT = 30000;

export function useTurnstile() {
    const turnstileRef = useRef<TurnstileInstance>(null);

    const pendingRef = useRef<PendingVerification | null>(null);
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationError, setVerificationError] =
        useState<string | null>(null);

    const clearVerificationTimeout = useCallback(() => {
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const rejectPending = useCallback(
        (message: string) => {
            const pending = pendingRef.current;

            if (!pending) return;

            pendingRef.current = null;
            clearVerificationTimeout();

            setIsVerifying(false);
            setVerificationError(message);

            pending.reject(new Error(message));
        },
        [clearVerificationTimeout]
    );

    const execute = useCallback((): Promise<string> => {
        if (pendingRef.current) {
            return Promise.reject(
                new Error("Ya existe una verificación en curso.")
            );
        }

        const widget = turnstileRef.current;

        if (!widget) {
            const message =
                "La verificación de seguridad todavía no está disponible.";

            setVerificationError(message);

            return Promise.reject(new Error(message));
        }

        setVerificationError(null);
        setIsVerifying(true);

        return new Promise<string>((resolve, reject) => {
            pendingRef.current = { resolve, reject };

            timeoutRef.current = setTimeout(() => {
                rejectPending(
                    "La verificación tardó demasiado. Inténtalo nuevamente."
                );

                turnstileRef.current?.reset();
            }, VERIFICATION_TIMEOUT);

            try {
                widget.execute();
            } catch (error) {
                console.error(
                    "Error al ejecutar Cloudflare Turnstile:",
                    error
                );

                rejectPending(
                    "No se pudo iniciar la verificación de seguridad."
                );
            }
        });
    }, [rejectPending]);

    const onVerified = useCallback(
        (token: string) => {
            const pending = pendingRef.current;

            if (!pending) return;

            pendingRef.current = null;
            clearVerificationTimeout();

            setIsVerifying(false);
            setVerificationError(null);

            pending.resolve(token);
        },
        [clearVerificationTimeout]
    );

    const onExpired = useCallback(() => {
        rejectPending(
            "La verificación de seguridad expiró. Inténtalo nuevamente."
        );
    }, [rejectPending]);

    const onError = useCallback(() => {
        rejectPending(
            "No se pudo completar la verificación de seguridad."
        );
    }, [rejectPending]);

    const reset = useCallback(() => {
        rejectPending("La verificación fue cancelada.");
        clearVerificationTimeout();

        turnstileRef.current?.reset();
    }, [rejectPending, clearVerificationTimeout]);

    useEffect(() => {
        return () => {
            clearVerificationTimeout();

            const pending = pendingRef.current;
            pendingRef.current = null;

            pending?.reject(
                new Error("La verificación fue cancelada.")
            );
        };
    }, [clearVerificationTimeout]);

    return {
        turnstileRef,
        execute,
        reset,
        isVerifying,
        verificationError,
        onVerified,
        onExpired,
        onError,
    };
}
