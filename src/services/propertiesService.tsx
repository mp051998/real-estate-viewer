import { getRequest } from "../utils/requests";

export function getProperties (states: string[], propertyType: string, page: number, size: number) {
  const route = `/real-estate-properties?states=${states.join(',')}&propertyType=${propertyType}&page=${page}&size=${size}`;
  return getRequest(route);
}

export function getPropertyByID (propertyID: number) {
  const route = `/real-estate-properties/${propertyID}`;
  return getRequest(route);
}
