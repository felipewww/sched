export interface ISaleRaw {
    id: number;
    title: string;
    status: string;
    icon: string;
    updated_at?: string;
}

export interface ISaleConfigRaw {
    id?: number;
    cashback: number;
    discount: number;
    buyx_takey_x: number;
    buyx_takey_y: number;
    discount_on_units_discount: number;
    discount_on_units_units: number;
    discount_from_units_discount: number;
    discount_from_units_units: number;
    sale_id: number;
}
