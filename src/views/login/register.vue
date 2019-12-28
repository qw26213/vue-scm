<template>
    <div class="else-container">
        <el-form ref="requsetFrom" :model="requsetFrom" :rules="loginRules" class="login-form" autocomplete="on" label-position="left" label-width="110px" style="width:400px;margin: 100px auto 0">
            <div class="title-container">
                <h3 class="title">注册新用户</h3>
            </div>
            <el-form-item label="企业全称" prop="orgName">
                <el-input v-model="requsetFrom.orgName" placeholder="商品代码" />
            </el-form-item>
            <el-form-item label="企业联系人" prop="contactName">
                <el-input v-model="requsetFrom.contactName" placeholder="企业联系人" />
            </el-form-item>
            <el-form-item label="企业所在地" prop="areaId">
                <el-select v-model="requsetFrom.areaId" style="width:290px" class="filter-item">
                    <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="纳税类型" prop="taxFilingCategory">
                <el-select v-model="requsetFrom.taxFilingCategory" style="width:290px" class="filter-item">
                    <el-option v-for="item in taxList" :key="item.id" :label="item.taxFilingCategoryName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="taxRegistrationCertificateNo">
                <el-input v-model="requsetFrom.taxRegistrationCertificateNo" placeholder="纳税人识别号" />
            </el-form-item>
            <el-form-item label="审核人签名" prop="sign2">
                <el-input v-model="requsetFrom.sign2" placeholder="审核人签名" />
            </el-form-item>
            <el-form-item label="用户账号" prop="userAccount">
                <el-input v-model="requsetFrom.userAccount" placeholder="用户账号" />
            </el-form-item>
            <el-form-item label="用户姓名" prop="userName">
                <el-input v-model="requsetFrom.userName" placeholder="用户姓名" />
            </el-form-item>
            <el-form-item label="注册手机号" prop="mobile">
                <el-input v-model="requsetFrom.mobile" placeholder="注册手机号" />
            </el-form-item>
            <el-form-item label="注册邮箱" prop="mail">
                <el-input v-model="requsetFrom.mail" placeholder="注册手机号" />
            </el-form-item>
            <el-form-item label="详细地址" prop="invoiceAddr">
                <el-input v-model="requsetFrom.invoiceAddr" placeholder="详细地址" />
            </el-form-item>
            <el-form-item label="登录密码" prop="password">
                <el-input v-model="requsetFrom.password" placeholder="登录密码" />
            </el-form-item>
            <el-form-item label="确认密码" prop="againPassword">
                <el-input v-model="requsetFrom.againPassword" placeholder="确认密码" />
            </el-form-item>
            <div class="bot clearfix">
              <span class="fr" @click="toPath('/login')">返回用户登录</span>
            </div>
            <el-button :loading="loading" type="primary" style="width:100%;margin:30px auto;" @click="handleRegister">确认注册</el-button>
        </el-form>
    </div>
</template>
<script>
import { registerLoadTaxfilingcategory,registerLoadArea, register } from '@/api/login'
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
                orgName: '',
                userAccount: '',
                password: '',
                againPassword:'',
                taxRegistrationCertificateNo:'',
                invoiceAddr:'',
                taxFilingCategory:'',
                sign2:'',
                mail:'',
                mobile:'',
                contactName:'',
                userName:'',
                areaId:"",
            },
            isRemember:true,
            loginRules: {
                orgCode: [{ required: true, trigger: 'blur', validator: validateOrcode }],
                userAccount: [{ required: true,message:'账号不能为空', trigger: 'blur'}],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }],
                againPassword: [{ required: true, trigger: 'blur', validator: validatePassword }],
                orgName: [{ required: true, trigger: 'blur', message:'企业名称不能为空' }],
                userName: [{ required: true, trigger: 'blur', message:'用户姓名不能为空' }],
                area: [{ required: true, trigger: 'blur', message:'企业所在地不能为空' }],
                mobile: [{ required: true, trigger: 'blur', message:'注册手机号不能为空' }],
                mail: [{ required: true, trigger: 'blur', message:'注册邮箱不能为空' }],
                contactName: [{ required: true, trigger: 'blur', message:'企业联系人不能为空' }],
                taxFilingCategory: [{ required: true, trigger: 'blur', message:'纳税类型不能为空' }],
                taxRegistrationCertificateNo: [{ required: true, trigger: 'blur', message:'纳税人识别号不能为空' }]
            },
            loading: false,
            redirect: this.$route.query.redirect
        }
    },
    created(){
      this.getData();
    },
    methods: {
      toPath(path){
        this.$router.push({ path: path})
      },
      getData(){
        registerLoadTaxfilingcategory().then(res=>{
          this.taxList = res.data;
        })
        registerLoadArea().then(res=>{
          this.areaList = res.data;
        })
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
