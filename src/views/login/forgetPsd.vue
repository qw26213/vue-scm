<template>
    <div class="container">
        <el-form ref="repForm" :model="repForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="100px" style="width:400px;margin: 100px auto 0">
            <div class="title-container">
                <h3 class="title">找回密码</h3>
            </div>
            <el-form-item label="企业代码" prop="orgCode">
                <el-input v-model="repForm.orgCode" placeholder="企业代码" />
            </el-form-item>
            <el-form-item label="用户账号" prop="userAccount">
                <el-input v-model="repForm.userAccount" placeholder="用户账号" />
            </el-form-item>
            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="repForm.mobile" placeholder="手机号码" />
            </el-form-item>
            <el-form-item label="邮箱验证码" prop="verifyCode">
                <el-input v-model="repForm.verifyCode" placeholder="邮箱验证码">
                    <el-button v-if="!isShowTime" slot="append" style="width:112px" @click="getCode">发送验证码</el-button>
                    <el-button v-if="isShowTime" slot="append" style="width:112px" @click="getCode">{{count}}秒</el-button>
                </el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input type="password" v-model="repForm.password" placeholder="新密码" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="againPassword">
                <el-input type="password" v-model="repForm.againPassword" placeholder="确认新密码" />
            </el-form-item>
            <div class="bot clearfix">
              <span class="fr" @click="toPath('/login')">返回登录</span>
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleSave">保 存</el-button>
        </el-form>
    </div>
</template>
<script>
import { forgotSentVerifyCode,forgotPSWSave } from '@/api/login'
export default {
    name: 'register',
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
            isShowTime:false,
            count: 120,
            taxList:[],
            areaList:[],
            repForm: {
                orgCode: '',
                userAccount: '',
                mobile: '',
                password: '',
                againPassword:'',
                verifyCode:''
            },
            isRemember:true,
            loginRules: {
                orgCode: [{ required: true, trigger: 'blur', validator: validateOrcode }],
                userAccount: [{ required: true,message:'账号不能为空', trigger: 'blur'}],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                againPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
                verifyCode: [{ required: true, trigger: 'blur', message:'邮箱验证码不能为空' }]
            },
            loading: false,
            redirect: this.$route.query.redirect
        }
    },
    methods: {
      toPath(path){
        this.$router.push({ path: path})
      },
      getCode(){
        var obj = {
            orgCode:this.repForm.orgCode,
            userAccount:this.repForm.userAccount,
            mobile:this.repForm.mobile
        }
        forgotSentVerifyCode(obj).then((res) => {
          if(res.data.errorCode==0) {
            this.$message.success('验证码已发送至邮箱！');
            this.timeChange()
          } else {
            this.$message.error(res.data.msg);
          }
        })
      },
      timeChange(){
        if(this.count<=1){
            this.isShowTime = false
            this.count = 120
        }else{
            this.isShowTime = true
            setTimeout(()=>{
                this.count = this.count - 1
                this.timeChange()
            },1000)
        }
      },
      handleSave() {
        this.$refs.repForm.validate(valid => {
          if (valid) {
            this.loading = true
            forgotPSWSave(this.repForm).then((res) => {
              if(res.data.errorCode==0){
                this.$message.success('密码设置成功！');
                this.$router.push('/login')
              } else{
                this.$message.error(res.data.msg);
              }
              this.loading = false
            }).catch(err => {
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
.container {
  min-height: 100%;
  overflow: hidden;
}
.title{text-align: center;margin-bottom: 20px}
.bot{margin: 10px 0}
.bot span{display: inline-block;font-size: 14px;color: #666;cursor:pointer;}
.bot span:hover{color:#333;}
</style>
