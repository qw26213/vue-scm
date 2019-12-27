<template>
    <div class="login-container">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
            <div class="title-container">
                <h3 class="title">登录经销存管理系统</h3>
            </div>
            <el-form-item prop="orgCode">
                <span class="svg-container"><svg-icon icon-class="chart" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.orgCode" placeholder="企业代码" type="text" maxlength='6' />
            </el-form-item>
            <el-form-item prop="userAccount">
                <span class="svg-container"><svg-icon icon-class="user" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.userAccount" placeholder="账号" type="text" />
            </el-form-item>
            <el-form-item prop="password">
                <span class="svg-container"><svg-icon icon-class="password" /></span>
                <el-input clearable autocomplete="off" v-model="loginForm.password" placeholder="密码" type="password" />
            </el-form-item>
            <div class="bot clearfix">
              <span class="fl" @click="toPath('/forgetPsd')">忘记密码？</span>
              <span class="fr" @click="toPath('/register')">注册新用户</span>
            </div>
            <el-checkbox v-model="isRemember">记住企业代码</el-checkbox>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleLogin">登录</el-button>
        </el-form>
    </div>
</template>
<script>
import {loginCheck,getIndexInfo} from '@/api/user'
export default {
    name: 'login',
    data() {
        const validateOrcode = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('企业代码至少6位'));
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码至少6位'));
            } else {
                callback()
            }
        }
        return {
            loginUrl:'',
            loginForm: {
                orgCode: '',
                userAccount: '',
                password: ''
            },
            isRemember:true,
            loginRules: {
                orgCode: [{ required: true, trigger: 'blur', validator: validateOrcode }],
                userAccount: [{ required: true,message:'账号不能为空', trigger: 'blur'}],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
            },
            loading: false,
            redirect: this.$route.query.redirect
        }
    },
    created(){
      if(localStorage.orgCode){
        this.loginForm.orgCode = localStorage.orgCode
        this.loginForm.userAccount = localStorage.userAccount
      }else{
        this.loginForm.orgCode = "";
        this.loginForm.userAccount = "";
      }
    },
    methods: {
      toPath(path){
        this.$router.push({ path: path})
      },
      handleLogin() {
        if(this.isRemember){
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
              this.$router.push({ path: this.redirect || '/'})
              this.loading = false
            }).catch(err => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      }
    },
    mounted(){
      console.log(this.isRemember)
      document.onkeydown=() => {
        if (window.event.keyCode == 13) {
          this.handleLogin();
        }
      }
    }
}
</script>
<style lang="scss">
$bg:#333;
$light_gray:#fff;
$cursor: #333;
@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 310px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #333;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #333;
  }
}
.bot{margin: 10px 0}
.bot span{display: inline-block;font-size: 14px;color: #666;cursor:pointer;}
.bot span:hover{color:#333;}
</style>

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
    padding: 160px 35px 0;
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
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }
  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>