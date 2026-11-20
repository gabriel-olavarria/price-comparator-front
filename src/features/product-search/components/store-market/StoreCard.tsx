interface StoreCardProps {
    name: string;
    logoUrl: string;
}

export function StoreCard({name, logoUrl,}: StoreCardProps) {
    return (
 
    <a className="store-card">
        <img
            className="store-logo store-card__image"
            src={logoUrl}
            alt={name}
            />
        </a>
    );
}