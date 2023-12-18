import { getRequest } from "../utils/requests";

export function getProperties (page: number, size: number) {
  const route = `/real-estate-properties?page=${page}&size=${size}`;
  return getRequest(route);
}

export function getPropertyByID (propertyID: number) {
  const route = `/real-estate-properties/${propertyID}`;
  return getRequest(route);
}
