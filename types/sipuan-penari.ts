export type CommodityProps = {
  id: string | number,
  name: string,
  [key: string]: any;
}

export type ResponseVaccination = {
  id: number,
  label: number,
  infected: number,
  vaccination: number
  [key: string]: any,
}
export type ResponseStatistic = {
  commodity: { id: string | number, name: string, unit_production: null | string },
  label: string,
  values: number[] | ResponseVaccination[],
  total: number,
  [key: string]: any,
}
export type ResponsePer = {
  per_comodity: ResponseStatistic[],
  per_district: ResponseStatistic[],
  [key: string]: any
}
export interface ResponseDataStatistic {
  // data_commodities: CommodityProps[],
  [key: string]: ResponsePer,
}