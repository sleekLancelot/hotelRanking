export const parseOptions = (brands: Array<any>) => brands?.map( brandName => ({
    ...brandName,
    label: brandName,
    value: brandName,
}))