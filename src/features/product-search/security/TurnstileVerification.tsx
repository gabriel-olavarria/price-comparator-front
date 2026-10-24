import { forwardRef } from "react";
import {
    Turnstile,
    type TurnstileInstance,
} from "@marsidev/react-turnstile";

interface TurnstileVerificationProps {
    onVerified: (token: string) => void;
    onExpired: () => void;
    onError: () => void;
}

const turnstileOptions = {
    theme: "auto" as const,
    action: "product_search",
    execution: "execute" as const,
    appearance: "execute" as const,
};

export const TurnstileVerification = forwardRef<
    TurnstileInstance,
    TurnstileVerificationProps
>(function TurnstileVerification(
    { onVerified, onExpired, onError },
    ref
) {
    return (
        <Turnstile
            ref={ref}
            siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
            options={turnstileOptions}
            onSuccess={onVerified}
            onExpire={onExpired}
            onError={() => onError()}
        />
    );
});