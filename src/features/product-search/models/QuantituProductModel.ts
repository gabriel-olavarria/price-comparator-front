import type {
    CanonicalGroupResponse,
    CanonicalProductTotal,
    StoreProductTotal,
} from "./MetricResponse";

export interface QuantityProductModel {
    topCanonicalGroups: CanonicalGroupResponse[];
    totalProductsByCanonicalKey: CanonicalProductTotal[];
    totalProductsByStore: StoreProductTotal[];
}