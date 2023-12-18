import axios from 'axios';
import { toast } from 'react-toastify';

const backendURL = process.env.REACT_APP_BACKEND_URL;

export function getRequest(route: string) {
  const url = backendURL + route;
  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      console.error(error);
      toast.error(error.message);
    });
}
