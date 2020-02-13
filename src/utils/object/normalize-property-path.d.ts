import { PropertyPath } from "./property-path";

declare function normalizePropertyPath(
    args : any[],
) : PropertyPath;

declare function normalizePropertyPath(
    path : string,
    getterArgs? : any[]
) : PropertyPath;

export {
    normalizePropertyPath,
};
