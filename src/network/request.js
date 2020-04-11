import axios from 'axios';

export function request(config) {
  return new Promise((resolve, reject) => {
    const instance = axios.create({
      baseURL: 'http://123.207.32.32:8000',
      timeout: '5000'
    })
    axios.interceptors.request.use(config => {
      return config
    }, err => {
      return err;
    })
    axios.interceptors.response.use(res => {
      return res;
    }, err => {
      return err
    })
    instance(config)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}