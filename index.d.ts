// Generated by dts-bundle v0.7.3

export class Facet {
    constructor(options: IFacetOptions);
    bind: (facets: IFacet[]) => void;
}

export class Filter {
    constructor(options: IFilterOptions);
    bind: (filters: IFacet[]) => void;
}

export interface IFacet {
    id: string;
    name: string;
    type: DataType;
    facetValues: IFacetValue[];
    facetRange: IFacetRange;
}

export interface IFacetOptions {
    containerElement: HTMLElement | null;
    onFilterChange: IFilterActionDelegate;
}

export interface IFilterOptions {
    containerElement: HTMLElement | null;
    onFilterChange: IFilterActionDelegate;
    onAllFilterRemove: IAllFilterRemoveDelegate;
}

export enum DataType {
    String = "String",
    Date = "Date",
    Number = "Number",
    Boolean = "Boolean",
    Collection = "Collection",
}

export interface IFacetRange {
    min: string;
    max: string;
    minIncluded: boolean;
    maxIncluded: boolean;
}

export interface IFacetValue {
    label: string;
    count: number;
    selected: boolean;
}

export type IFilterActionDelegate = (key: string, value: string, action: FilterActionType) => void;

export type IAllFilterRemoveDelegate = () => void;

export enum FilterActionType {
    Add = "Add",
    Minus = "Minus",
}

