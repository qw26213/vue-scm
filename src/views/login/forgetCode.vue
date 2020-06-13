<template>
    <div class="container">
        <el-form ref="reqFrom" :model="reqFrom" :rules="rules" class="login-form" autocomplete="on" label-position="right" label-width="96px" style="width:400px;margin: 100px auto 0">
            <div class="title-container" style="margin-bottom:50px">
                <h3 class="title">找回企业代码</h3>
            </div>
            <el-form-item label="用户账号" prop="userAccount">
                <el-input v-model="reqFrom.userAccount" placeholder="用户账号" />
            </el-form-item>
            <el-form-item label="找回方式">
                <el-radio v-model="isMobile" :label="1">手机号</el-radio>
                <el-radio v-model="isMobile" :label="0">邮箱</el-radio>
            </el-form-item>
            <el-form-item v-if="isMobile==1" label="注册手机号" prop="mobile">
                <el-input v-model="reqFrom.mobile" placeholder="注册手机号" />
            </el-form-item>
            <el-form-item v-if="isMobile==0" label="注册邮箱" prop="mail">
                <el-input v-model="reqFrom.mail" placeholder="注册邮箱" />
            </el-form-item>
            <el-form-item label="验证码" prop="verifyCode">
                <el-input v-model="reqFrom.verifyCode" placeholder="验证码">
                    <el-button v-if="!isShowTime" slot="append" style="width:112px" @click="getCode">发送验证码</el-button>
                    <el-button v-if="isShowTime" slot="append" style="width:112px" @click="getCode">{{count}}秒</el-button>
                </el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleSave">确 认</el-button>
        </el-form>
    </div>
</template>
<script>
import { forgotSentVerifyCode, forgotPSWSave, forgotOrgCode9 } from '@/api/login'
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
            isMobile: 1,
            isShowTime: false,
            reqFrom: {
                mobile: '',
                mail: '',
                userAccount: '',
                verifyCode: ''
            },
            rules: {
                mobile: [{ required: true, message: '注册手机号不能为空', trigger: 'change' }],
                mail: [{ required: true, message: '注册邮箱不能为空', trigger: 'change' }],
                verifyCode: [{ required: true, message: '验证码不能为空', trigger: 'change' }]
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
    methods: {
      getCode(){
        var obj = {
            userAccount:this.reqFrom.userAccount,
            mobile:this.reqFrom.mobile,
            mail: this.reqFrom.mail,
            type: 9
        }
        forgotSentVerifyCode(obj).then((res) => {
          if(res.data.errorCode==0) {
            this.$message.success('验证码已发送至'+this.isMobile==1?'手机':'邮箱！')
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

.title {
    text-align: center;
    margin-bottom: 20px
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