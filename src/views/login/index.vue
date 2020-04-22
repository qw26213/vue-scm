<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <div class="title-container">
                <h3 class="title">财务分销管理系统</h3>
            </div>
            <el-form-item prop="orgCode">
                <span class="svg-container">
                    <svg-icon icon-class="chart" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.orgCode" placeholder="企业代码" type="text" maxlength='6' />
            </el-form-item>
            <el-form-item prop="userAccount">
                <span class="svg-container">
                    <svg-icon icon-class="user" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.userAccount" placeholder="账号" type="text" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container">
                    <svg-icon icon-class="password" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.password" placeholder="密码" type="password" />
            </el-form-item>
            <div class="bot clearfix">
                <span class="fl" @click="toPath('/register')">注册新用户</span>
                <span class="fr" @click="toPath('/forgetPsd')">忘记密码?</span>
            </div>
            <div class="bot clearfix">
                <el-checkbox v-model="isRemember" style="float:left;margin-right:5px"></el-checkbox>
                <span style="float:left;">记住企业代码</span>
                <span class="fr" @click="toPath('/forgetCode')">忘记企业代码?</span>
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin:10px auto;" @click="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>
<script>
import { loginCheck, getIndexInfo } from '@/api/user'
export default {
    name: 'login',
    data() {
        const validateOrcode = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('企业代码至少6位'))
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码至少6位'))
            } else {
                callback()
            }
        }
        return {
            loginUrl: '',
            loginForm: {
                orgCode: '',
                userAccount: '',
                password: ''
            },
            isRemember: true,
            loginRules: {
                orgCode: [{ required: true, trigger: 'blur', validator: validateOrcode }],
                userAccount: [{ required: true, message: '账号不能为空', trigger: 'blur' }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            redirect: this.$route.query.redirect
        }
    },
    created() {
        if (localStorage.orgCode) {
            this.loginForm.orgCode = localStorage.orgCode
            this.loginForm.userAccount = localStorage.userAccount
        } else {
            this.loginForm.orgCode = "";
            this.loginForm.userAccount = "";
        }
    },
    methods: {
        toPath(path) {
            this.$router.push({ path: path })
        },
        handleLogin() {
            if (this.isRemember) {
                localStorage.orgCode = this.loginForm.orgCode
                localStorage.userAccount = this.loginForm.userAccount
            } else {
                localStorage.removeItem('orgCode');
                localStorage.removeItem('userAccount');
            }
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true
                    this.$store.dispatch('user/login', this.loginForm).then(() => {
                        this.$router.push({ path: this.redirect || '/' })
                        this.loading = false
                    }).catch(err => {
                        this.$message.error(err)
                        this.loading = false
                    })
                } else {
                    return false
                }
            })
        }
    },
    mounted() {
        document.onkeydown = () => {
            if (window.event.keyCode == 13 && document.getElementsByClassName('login-container').length > 0) {
                this.handleLogin()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
$bg:#f5f5f5;
$light_gray:#333333;

.login-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
        position: relative;
        width: 420px;
        max-width: 100%;
        padding: 120px 35px 0;
        margin: 0 auto;
        overflow: hidden;
    }

    .tips {
        font-size: 14px;
        color: #333333;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }

    .svg-container {
        padding: 6px 5px 6px 15px;
        color: #333;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }

    .title-container {
        position: relative;

        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0px auto 40px auto;
            text-align: center;
            font-weight: bold;
        }
    }
}

.bot {
    margin: 10px 0
}

.bot span {
    display: inline-block;
    font-size: 14px;
    color: #666;
    cursor: pointer;
}

.bot span:hover {
    color: #333;
}
</style>