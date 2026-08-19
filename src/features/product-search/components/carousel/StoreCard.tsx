interface StoreCardProps {
    name: string;
    logoUrl: string;
}

export function StoreCard({
                              name,
                              logoUrl,
                          }: StoreCardProps) {
    return (
        <article className="store-card">
            <img
                className="store-card__image"
                src={logoUrl}
                alt={name}
            />
        </article>
    );
}