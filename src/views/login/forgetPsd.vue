<template>
    <div class="else-container">
        <el-form ref="requsetFrom" :model="requsetFrom" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="110px" style="width:400px;margin: 100px auto 0">
            <div class="title-container">
                <h3 class="title">找回密码</h3>
            </div>
            <el-form-item label="企业代码" prop="orgCode">
                <el-input v-model="requsetFrom.orgCode" placeholder="企业代码" />
            </el-form-item>
            <el-form-item label="用户账号" prop="userAccount">
                <el-input v-model="requsetFrom.userAccount" placeholder="用户账号" />
            </el-form-item>
            <el-form-item label="注册邮箱" prop="mail">
                <el-input v-model="requsetFrom.mail" placeholder="注册邮箱" />
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="requsetFrom.password" placeholder="新密码" />
            </el-form-item>
            <el-form-item label="确认新密码" prop="againPassword">
                <el-input v-model="requsetFrom.againPassword" placeholder="确认新密码" />
            </el-form-item>
            <div class="bot clearfix">
              <span class="fr" @click="toPath('/login')">返回登录</span>
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleRegister">保 存</el-button>
        </el-form>
    </div>
</template>
<script>
import { register } from '@/api/login'
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
            loginUrl:'',
            taxList:[],
            areaList:[],
            requsetFrom: {
                orgCode: '',
                userAccount: '',
                password: '',
                againPassword:'',
                mail:''
            },
            isRemember:true,
            loginRules: {
                orgCode: [{ required: true, trigger: 'blur', validator: validateOrcode }],
                userAccount: [{ required: true,message:'账号不能为空', trigger: 'blur'}],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                againPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
                mail: [{ required: true, trigger: 'blur', message:'注册邮箱不能为空' }]
            },
            loading: false,
            redirect: this.$route.query.redirect
        }
    },
    methods: {
      toPath(path){
        this.$router.push({ path: path})
      },
      handleRegister() {
        this.$refs.requsetFrom.validate(valid => {
          if (valid) {
            this.loading = true
            register(this.requsetFrom).then((res) => {
              if(res.data.errorCode==0)
                this.$message.success('注册成功！');
              else
                this.$message.error(res.data.msg);
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
.title{text-align: center;margin-bottom: 20px}
.bot{margin: 10px 0}
.bot span{display: inline-block;font-size: 14px;color: #666;cursor:pointer;}
.bot span:hover{color:#333;}
</style>
