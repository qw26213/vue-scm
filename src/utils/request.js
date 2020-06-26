import axios from 'axios'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { MessageBox, Message } from 'element-ui'
import router from '@/router'
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
    }
)

function redictLogin() {
    if (!sessionStorage.modalShow) {
        sessionStorage.modalShow = 1
        Message.warning('登录已失效，清重新登录')
        store.dispatch("user/logout").then(() => {
            router.push({ path: "/login" })
        })
    }
}

// http response 拦截器
axios.interceptors.response.use(
    response => {
        let res = response.data
        if (res && !res.errorCode) {
            return response
        }
        if (res.errorCode == 0) {
            return response
        } else if (res.errorCode == 401) {
            redictLogin()
        } else {
            Message.warning(res.msg)
            return response
        }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    redictLogin()
                    break;
                default:
                    Message.error(error.message || "error")
            }
        }
        // return Promise.reject(error.data);
    }
)

export default axios;