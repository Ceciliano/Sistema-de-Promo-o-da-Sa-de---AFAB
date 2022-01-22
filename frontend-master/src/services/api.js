import axios from 'axios';

const api = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://apigp.mourabraz.com'
      : 'http://127.0.0.1:3333',
});

/*
 * add delay for all requests, only for development purposes
 */
if (process.env.NODE_ENV !== 'production') {
  api.interceptors.request.use(
    config => new Promise(resolve => setTimeout(_ => resolve(config), 1500))
  );
}

export default api;
