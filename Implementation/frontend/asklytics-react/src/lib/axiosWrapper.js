import axios from 'axios';

export function createAxiosWrapper({ config = {}, headers = {} } = {}) {
  return axios.create({
    ...config,
    headers: {
      Accept: 'application/json',
      ...headers,
    },
  });
}