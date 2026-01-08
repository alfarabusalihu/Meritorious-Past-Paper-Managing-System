export interface FilterOption {
    label: string;
    value: string;
}

export interface Filter {
    key: string;
    label: string;
    type: 'dropdown';
    options: string[] | FilterOption[];
    dynamic?: boolean;
}
