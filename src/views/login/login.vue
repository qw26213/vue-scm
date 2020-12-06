<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <div class="title-container">
        <h3 class="title">丰扬快销管理系统</h3>
      </div>
      <el-form-item prop="orgCode">
        <span class="svg-container">
          <svg-icon icon-class="chart" />
        </span>
        <el-input v-model.trim="loginForm.orgCode" clearable autocomplete="off" placeholder="企业代码" type="text" maxlength="6" />
      </el-form-item>
      <el-form-item prop="userAccount">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input v-model.trim="loginForm.userAccount" clearable autocomplete="off" placeholder="用户账号" type="text" />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input v-model.trim="loginForm.password" clearable autocomplete="off" placeholder="密码" type="password" />
      </el-form-item>
      <el-form-item prop="verifyCode" style="position:realtive;">
        <span class="svg-container">
          <svg-icon icon-class="verify" />
        </span>
        <el-input v-model.trim="loginForm.verifyCode" placeholder="图片验证码" />
        <img :src="imgUrl" class="vertify" @click="getNewCode()">
      </el-form-item>
      <div class="bot clearfix">
        <span v-if="isRegister" class="fl" @click="toPath('/register')">企业注册</span>
        <span class="fr" @click="toPath('/forgetPsd')">忘记密码?</span>
      </div>
      <div class="bot clearfix">
        <el-checkbox v-model="isRemember" style="float:left;margin-right:5px" />
        <span style="float:left;">记住企业代码</span>
        <span class="fr" @click="toPath('/forgetCode')">忘记企业代码?</span>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin:auto;" @click="loginFun">登录</el-button>
    </el-form>
    <div class="botomTxt">Copyright@2019 北京丰扬信息技术有限公司(<a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=11010802033370" target="_blank"><img src="../../assets/gongan.png" class="gongan">京公网安备11010802033370号</a><a href="https://beian.miit.gov.cn/" target="_blank" style="margin-left:12px">京ICP备2020041435号</a>)</div>
  </div>
</template>
<script>
import { getVerifyPhoto, getRegisterStatus } from '@/api/login'
import { removeToken, removeName } from '@/utils/auth'
import { debounce } from '@/utils/index'
export default {
  name: 'Login',
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
      isRegister: false,
      imgUrl: '',
      loginFun: debounce(this.handleLogin, 1000, true),
      loginForm: {
        orgCode: '',
        userAccount: '',
        password: '',
        verifyCode: ''
      },
      isRemember: true,
      loginRules: {
        orgCode: [{ required: true, trigger: 'change', validator: validateOrcode }],
        userAccount: [{ required: true, trigger: 'change', message: '账号不能为空' }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'change', message: '图片验证码不能为空' }]
      },
      loading: false,
      redirect: '/home' // this.$route.query.redirect
    }
  },
  created() {
    getRegisterStatus().then(res => {
      if (res.data.errorCode == 0) {
        this.isRegister = true
      }
    })
    sessionStorage.removeItem('modalShow')
    this.getNewCode()
    if (localStorage.orgCode) {
      this.loginForm.orgCode = localStorage.orgCode
      this.loginForm.userAccount = localStorage.userAccount
    } else {
      this.loginForm.orgCode = ''
      this.loginForm.userAccount = ''
    }
  },
  mounted() {
    removeToken()
    removeName()
    document.onkeydown = () => {
      if (window.event.keyCode === 13 && document.getElementsByClassName('login-container').length > 0) {
        this.loginFun()
      }
    }
  },
  methods: {
    toPath(path) {
      this.$router.push({ path: path })
    },
    getNewCode() {
      this.imgUrl = getVerifyPhoto() + '?v=' + Math.random()
    },
    handleLogin() {
      if (this.isRemember) {
        localStorage.orgCode = this.loginForm.orgCode
        localStorage.userAccount = this.loginForm.userAccount
      } else {
        localStorage.removeItem('orgCode')
        localStorage.removeItem('userAccount')
      }
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(err => {
            this.getNewCode()
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login-form {
  >>>.el-input {
    width:305px;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 5px 5px 5px 15px;
      color: #333;
      height: 30px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color:#333 !important;
      }
    }
  }
  >>>.el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #333;
    height: 40px;
  }
}
>>>.el-form-item__content {
    line-height: 36px;
    position: relative;
    font-size: 14px;
}
.svg-container {
    padding: 3px 5px 6px 15px;
    color: #333;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
}
.botomTxt{font-size: 12px;color: #666;position: fixed;bottom: 5px;line-height: 24px;text-align: center; width: 100%;left: 0;}
.gongan{display:inline-block;width:16px;height:16px;vertical-align:middle;}
</style>
