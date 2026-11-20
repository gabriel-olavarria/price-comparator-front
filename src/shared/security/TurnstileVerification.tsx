import { forwardRef } from "react";

import {
    Turnstile,
    type TurnstileInstance,
} from "@marsidev/react-turnstile";

import {
    TURNSTILE_SITE_KEY,
    getTurnstileOptions,
} from "./turnstile.config";

interface TurnstileVerificationProps {
    action: string;
    onVerified: (token: string) => void;
    onExpired: () => void;
    onError: () => void;
}

export const TurnstileVerification = forwardRef<
    TurnstileInstance,
    TurnstileVerificationProps
>(function TurnstileVerification(
    {
        action,
        onVerified,
        onExpired,
        onError,
    },
    ref
) {
    return (
        <Turnstile
            ref={ref}
            siteKey={TURNSTILE_SITE_KEY}
            options={getTurnstileOptions(action)}
            onSuccess={onVerified}
            onExpire={onExpired}
            onError={onError}
        />
    );
});