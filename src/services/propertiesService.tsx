import { getRequest } from "../utils/requests";

export function getProperties (page: number) {
  const route = '/real-estate-properties?page=' + page;
  return getRequest(route);
}
