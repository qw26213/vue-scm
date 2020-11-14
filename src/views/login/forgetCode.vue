<template>
  <div class="container">
    <el-form ref="reqFrom" :model="reqFrom" :rules="rules" class="login-form" autocomplete="on" label-position="right" label-width="93px">
      <div class="title-container" style="margin-bottom:50px">
        <h3 class="title">找回企业代码</h3>
      </div>
      <el-form-item label="找回方式" class="getType">
        <el-radio v-model="isMobile" :label="1">手机号</el-radio>
        <el-radio v-model="isMobile" :label="0">邮箱</el-radio>
      </el-form-item>
      <el-form-item v-if="isMobile==1" label="注册手机号" prop="mobile">
        <el-input v-model="reqFrom.mobile" placeholder="注册手机号" />
      </el-form-item>
      <el-form-item v-if="isMobile==0" label="注册邮箱" prop="mail">
        <el-input v-model="reqFrom.mail" placeholder="注册邮箱" />
      </el-form-item>
      <el-form-item label="验证码" prop="inputStr">
        <el-input v-model="reqFrom.inputStr" placeholder="验证码">
          <img slot="append" :src="imgUrl" style="width:112px" @click="getNewCode()">
        </el-input>
      </el-form-item>
      <el-form-item label="用户账号" prop="userAccount">
        <el-input v-model="reqFrom.userAccount" placeholder="用户账号" />
      </el-form-item>
      <div class="bot clearfix">
        <span class="fr" @click="$router.push('/login')">返回登录</span>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto 10px;" @click="handleSave">确 认</el-button>
    </el-form>
  </div>
</template>
<script>
import { forgotSentVerifyCode, forgotOrgCode9, getVerifyImg } from '@/api/login'
export default {
  name: 'Register',
  data() {
    return {
      isMobile: 1,
      count: 120,
      isShowTime: false,
      imgUrl: getVerifyImg() + '?v=' + Math.random(),
      reqFrom: {
        mobile: '',
        mail: '',
        userAccount: '',
        inputStr: ''
      },
      rules: {
        mobile: [{ required: true, message: '注册手机号不能为空', trigger: 'change' }],
        mail: [{ required: true, message: '注册邮箱不能为空', trigger: 'change' }],
        inputStr: [{ required: true, message: '验证码不能为空', trigger: 'change' }]
      },
      loading: false
    }
  },
  watch: {
    isMobile() {
      this.$nextTick(() => {
        this.$refs['reqFrom'].clearValidate()
        this.reqFrom.mobile = ''
        this.reqFrom.mail = ''
      })
    }
  },
  created() {
  },
  methods: {
    getNewCode() {
      this.imgUrl = getVerifyImg() + '?v=' + Math.random()
    },
    getCode() {
      var obj = {
        userAccount: this.reqFrom.userAccount,
        mobile: this.reqFrom.mobile,
        mail: this.reqFrom.mail,
        type: 9
      }
      forgotSentVerifyCode(obj).then((res) => {
        if (res.data.errorCode === '0') {
          this.$message.success(res.data.msg)
          this.timeChange()
        } else {
          this.$message.error(res.data.msg)
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
    toPath(path) {
      this.$router.push({ path: path })
    },
    handleSave() {
      this.$refs.reqFrom.validate(valid => {
        if (valid) {
          this.loading = true
          forgotOrgCode9(this.reqFrom).then((res) => {
            if (res.data.errorCode === 0) {
              this.$message.success(res.data.msg)
              this.$router.go(-1)
            } else {
              this.$message.warning(res.data.msg)
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
<style scoped>
>>>.el-form-item {
    margin-bottom: 18px;
}
>>>.getType.el-form-item {
    margin-bottom: 5px;
}
</style>