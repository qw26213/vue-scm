import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { MessageBox, message } from 'element-ui'
// axios 配置
axios.defaults.timeout = 60000;
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;

// http request 拦截器
axios.interceptors.request.use(
  config => {
    config.headers['token'] = getToken();
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    let res = response.data;
    return response;
  },
  error => {
    console.log('error')
    if (error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.error('请登录!'); break;
        default:
          MessageBox.error(error || "error")
      }
    }
    // return Promise.reject(error.data);
  });

export default axios;

