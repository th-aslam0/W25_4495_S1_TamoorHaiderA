import { createAxiosWrapper } from '../lib/axiosWrapper';
import { apiUrlPathPrefix } from '../lib/constant';

export const postOAuthToken = async () => createAxiosWrapper().post(`${apiUrlPathPrefix}/apps`);

export const postRefreshToken = async () => createAxiosWrapper().post(`${apiUrlPathPrefix}/apps`);