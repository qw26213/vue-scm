import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'

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
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.log('response.status: 401');
      }
    }
    //判断超时原因 路由跳转页面
    return Promise.reject(error.data);
  });

export default axios;

