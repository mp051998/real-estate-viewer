import { getRequest } from "../utils/requests";

export function getConfigByID (configID: string) {
  const route = `/configs/${configID}`;
  return getRequest(route);
}
