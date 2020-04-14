<template>
    <div class="container">
        <el-form ref="reqFrom" :model="reqFrom" :rules="rules" class="login-form" autocomplete="on" label-position="left" label-width="78px" style="width:400px;margin: 100px auto 0">
            <div class="title-container" style="margin-bottom:50px">
                <h3 class="title">找回企业代码</h3>
            </div>
            <el-form-item label="注册邮箱" prop="email">
                <el-input v-model="reqFrom.email" placeholder="注册邮箱" />
            </el-form-item>
            <el-form-item label="用户账号" prop="userAccount">
                <el-input v-model="reqFrom.userAccount" placeholder="用户账号" />
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleSave">确 认</el-button>
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
            loginUrl:'',
            taxList:[],
            areaList:[],
            reqFrom: {
                email: '',
                userAccount: ''
            },
            isRemember:true,
            rules: {
                email: [{ required: true, message:'邮箱不能为空', trigger: 'blur'}],
                userAccount: [{ required: true,message:'账号不能为空', trigger: 'blur'}]
            },
            loading: false
        }
    },
    methods: {
      toPath(path){
        this.$router.push({ path: path})
      },
      getCode(){
        var obj = {
            email:this.reqFrom.email,
            userAccount:this.reqFrom.userAccount
        }
        forgotSentVerifyCode(obj).then((res) => {
          if(res.data.errorCode==0)
            this.$message.success('验证码已发送至邮箱！');
          else
            this.$message.error(res.data.msg);
        })
      },
      handleSave() {
        this.$refs.reqFrom.validate(valid => {
          if (valid) {
            this.loading = true
            forgotPSWSave(this.reqFrom).then((res) => {
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
