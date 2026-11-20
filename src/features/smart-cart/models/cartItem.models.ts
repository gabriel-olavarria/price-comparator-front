
export interface CartItem {
    offerId: string;
    canonicalKey: string;
    name: string;
    quantity: number;

    imageUrl?: string;

    referenceOffer: {
        store: string;
        unitPrice: number;
    };
}
