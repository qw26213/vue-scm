<template>
  <div class="container">
    <el-form ref="reqForm" :model="reqForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="right" label-width="93px" style="margin: 60px auto 0">
      <div class="title-container">
        <h3 class="title">找回密码</h3>
      </div>
      <el-form-item label="找回方式">
        <el-radio v-model="isMobile" :label="1">手机号</el-radio>
        <el-radio v-model="isMobile" :label="0">邮箱</el-radio>
      </el-form-item>
      <el-form-item label="企业代码" prop="orgCode">
        <el-input v-model="reqForm.orgCode" placeholder="企业代码" />
      </el-form-item>
      <el-form-item label="用户账号" prop="userAccount">
        <el-input v-model="reqForm.userAccount" placeholder="用户账号" />
      </el-form-item>
      <el-form-item v-if="isMobile === 1" label="手机号码" prop="mobile">
        <el-input v-model="reqForm.mobile" placeholder="手机号码" />
      </el-form-item>
      <el-form-item label="验证码" prop="verifyCode">
        <el-input v-model="reqForm.verifyCode" placeholder="验证码">
          <el-button v-if="!isShowTime" slot="append" style="width:112px" @click="getCode">发送验证码</el-button>
          <el-button v-if="isShowTime" slot="append" style="width:112px" @click="getCode">{{ count }}秒</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input v-model="reqForm.password" type="password" placeholder="新密码" />
      </el-form-item>
      <el-form-item label="确认新密码" prop="againPassword">
        <el-input v-model="reqForm.againPassword" type="password" placeholder="确认新密码" />
      </el-form-item>
      <div class="bot clearfix">
        <span class="fr" @click="toPath('/login')">返回登录</span>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin:10px auto;" @click="handleSave">提 交</el-button>
    </el-form>
  </div>
</template>
<script>
import { forgotSentVerifyCode, forgotPSWSave } from '@/api/login'
export default {
  name: 'Register',
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
    const validateMobile = (rule, value, callback) => {
      const rep = new RegExp('(^1[3|4|5|8]\\d{9}$)')
      if (value === '') {
        callback(new Error('请输入手机号!'))
      } else if (!rep.test(value)) {
        callback(new Error('手机号格式不正确！'))
      } else {
        callback()
      }
    }
    return {
      isMobile: 1,
      isShowTime: false,
      count: 120,
      taxList: [],
      areaList: [],
      reqForm: {
        orgCode: '',
        userAccount: '',
        mobile: '',
        password: '',
        againPassword: '',
        verifyCode: ''
      },
      isRemember: true,
      loginRules: {
        orgCode: [{ required: true, trigger: 'change', validator: validateOrcode }],
        mobile: [{ required: true, trigger: 'change', validator: validateMobile }],
        userAccount: [{ required: true, message: '账号不能为空', trigger: 'change' }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        againPassword: [{ required: true, trigger: 'change', validator: validatePassword }],
        verifyCode: [{ required: true, trigger: 'change', message: '邮箱验证码不能为空' }]
      },
      loading: false,
      redirect: this.$route.query.redirect
    }
  },
  watch: {
    isMobile(val) {
      if (!val) {
        this.reqForm.mobile = ''
      }
    }
  },
  methods: {
    toPath(path) {
      this.$router.push({ path: path })
    },
    getCode() {
      var obj = {
        orgCode: this.reqForm.orgCode,
        userAccount: this.reqForm.userAccount,
        mobile: this.reqForm.mobile,
        type: 0
      }
      forgotSentVerifyCode(obj).then((res) => {
        if (res.data.errorCode === '0') {
          this.$message.success(res.data.msg)
          this.timeChange()
        }
      })
    },
    timeChange() {
      if (this.count <= 1) {
        this.isShowTime = false
        this.count = 120
      } else {
        this.isShowTime = true
        setTimeout(() => {
          this.count = this.count - 1
          this.timeChange()
        }, 1000)
      }
    },
    handleSave() {
      this.$refs.reqForm.validate(valid => {
        if (valid) {
          this.loading = true
          forgotPSWSave(this.reqForm).then((res) => {
            if (res.data.errorCode === '0') {
              this.$message.success('密码设置成功！')
              this.$router.push('/login')
            }
            this.loading = false
          }).catch(() => {
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
