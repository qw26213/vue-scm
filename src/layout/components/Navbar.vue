<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />
        <qq class="right-menu-item" />
        <screenfull id="screenfull" class="right-menu-item hover-effect" />
      </template>
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="user-name">{{name}}</span>
          <i style="vertical-align: middle;" class="el-icon-arrow-down" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <span @click="handlePwd">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item divided>
            <span style="display:block;" @click="logout">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px">
        <el-form-item label="原密码" prop="oldpassword">
          <el-input type="password" v-model="temp.oldpassword" placeholder="原密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input type="password" v-model="temp.password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="repassword">
          <el-input type="password" v-model="temp.repassword" placeholder="确认新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { updatePassword } from '@/api/user'
import userImg from '@/assets/user.png'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import qq from '@/components/qq'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import { setToken,getToken } from '@/utils/auth'

export default {
  data(){
    return {
      avatar:userImg,
      temp: {
        oldpassword: "",
        password: '',
        repassword: ''
      },
      dialogFormVisible: false,
      rules: {
        oldpassword: [{ required: true, message: '原密码不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
        repassword: [{ required: true, message: ' 密码不能为空', trigger: 'change' }]
      },
    }
  },
  components: {
    Breadcrumb,
    Hamburger,qq,
    Screenfull,
    SizeSelect,
    Search
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'name'
    ])
  },
  methods: {
    save(){
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.password!=this.temp.repassword){
              this.$message.error('新密码两次输入不一致')
              return
          }
          var obj = {
            oldPassword:this.temp.oldpassword,
            newPassword:this.temp.password
          }
          updatePassword(obj).then(res => {
            if(res.data.error==0){
              this.dialogFormVisible = false
              this.$store.commit('SET_TOKEN', res.data.data)
              setToken(res.data.data)
              this.$message.success('密码修改成功')
            }else
              this.$message.error(res.data.message)
          })
        }
      });
    },
    handlePwd(){
      this.dialogFormVisible = true
      this.temp.oldpassword = "";
      this.temp.password = "";
      this.temp.repassword = "";
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      cursor:pointer;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 15px;
          vertical-align:middle
        }
        .user-name{font-size:14px}

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
