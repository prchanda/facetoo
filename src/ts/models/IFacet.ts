import { IFacetMeta } from "./IFacetMeta";
import { IFacetRange } from "./IFacetRange";
import { IFacetValue } from "./IFacetValue";

export interface IFacet {
    facetMeta: IFacetMeta;
    facetValues: IFacetValue[];
    facetRange: IFacetRange;
}