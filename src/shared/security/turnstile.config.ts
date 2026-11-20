import type { TurnstileProps } from "@marsidev/react-turnstile";

export const TURNSTILE_SITE_KEY =
    import.meta.env.VITE_TURNSTILE_SITE_KEY;

export function getTurnstileOptions(
    action: string
): TurnstileProps["options"] {
    return {
        theme: "auto",
        action,
        execution: "execute",
        appearance: "execute",
    };
}