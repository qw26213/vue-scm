<template>
  <div class="homeMain">
    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="display:inline-block;line-height:28px">企业信息</span>
            <el-button v-if="userInfo.isAdmin == 1" type="primary" style="float: right;" size="mini" @click="showCompile">编辑</el-button>
            <el-button v-if="userInfo.isAdmin == 1 && isCloseAccount" type="danger" style="float: right;margin-right:10px" size="mini" @click="closeCurAccount">注销企业</el-button>
          </div>
          <div class="listItem">
            <label>企业代码:</label>{{ managementInfo.orgCode }}</div>
          <div class="listItem">
            <label>企业名称:</label>{{ managementInfo.orgName }}</div>
          <div class="listItem">
            <label>所属行业:</label>{{ managementInfo.industryName }}</div>
          <div class="listItem">
            <label>企业所在地:</label>{{ managementInfo.areaName }}</div>
          <div class="listItem">
            <label>详细地址:</label>{{ managementInfo.invoiceAddr }}</div>
          <div class="listItem">
            <label>纳税类型:</label>{{ managementInfo.taxFilingCategoryName }}(纳税识别号:{{ managementInfo.taxRegistrationCertificateNo }})</div>
          <div class="listItem">
            <label>资源容量:</label>
            <el-tooltip class="item" effect="dark" content="图片存储额度及使用量（每日更新一次使用量）" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            {{ managementInfo.cosResSize | Fixed }}GB (已使用{{ managementInfo.cosResUsedSize | Fixed }}GB)
          </div>
          <!-- <div class="listItem"><label>业务有效期:</label>{{managementInfo.bizExpirationDate}}</div> -->
          <!-- <div class="listItem"><label>账套名称:</label>{{managementInfo.bookName}}</div> -->
          <div class="listItem" style="color:#F56C6C">
            <label>试用期:</label>
            <el-tooltip class="item" effect="dark" content="注册后面试用期限" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            {{ managementInfo.bizExpirationDate }}</div>
          <div class="listItem" style="color:#F56C6C">
            <label>账号月数:</label>
            <el-tooltip class="item" effect="dark" content="您还能使用的月数" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            {{ managementInfo.lisenseNum+managementInfo.lisenseNum1 }}(购买{{ managementInfo.lisenseNum }}，赠送{{ managementInfo.lisenseNum1 }})
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="12" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="display:inline-block;line-height:28px">用户信息</span>
            <el-button v-if="userInfo.isAdmin == 1 && isCleanBook" type="danger" style="float: right;" size="mini" @click="resetBookInfo">清除账套</el-button>
          </div>
          <div class="listItem">
            <label>企业代码:</label>{{ userInfo.orgCode }}</div>
          <div class="listItem">
            <label>用户账号:</label>{{ userInfo.userAccount }}</div>
          <div class="listItem">
            <label>用户姓名:</label>{{ userInfo.userName }}</div>
          <div class="listItem">
            <label>审核人签名:</label>{{ userInfo.sign2 }}
            <el-tooltip class="item" effect="dark" content="您还能使用的月数" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            </div>
          <div class="listItem">
            <label>手机号:</label>{{ userInfo.mobile }}</div>
          <div class="listItem">
            <label>邮箱:</label>{{ userInfo.mail }}</div>
          <div class="listItem">
            <label>管理员:</label>{{ userInfo.isAdmin == 1?'是':'否' }}</div>
          <div class="listItem">
            <label style="width:100px">单据查询权限:</label>{{ userInfo.queryType == 0?'自己':'部门' }}</div>
          <div class="listItem">
            <label>角色:</label>{{ userInfo.roleName }}</div>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="display:inline-block;line-height:28px">用户列表</span>
            <el-button v-if="userInfo.isAdmin == 1" type="primary" style="float: right;" size="mini" @click="handleAdd">新增用户</el-button>
          </div>
          <el-table :data="tableData" border fit resize>
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="企业代码" min-width="60" align="center">
              <template slot-scope="{row}">
                <span>{{ row.orgCode }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户账号" min-width="60" align="center">
              <template slot-scope="{row}">
                <span>{{ row.userAccount }}</span>
              </template>
            </el-table-column>
            <el-table-column label="用户姓名" min-width="60" align="center">
              <template slot-scope="{row}">
                <span>{{ row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column label="管理员" min-width="60" align="center">
              <template slot-scope="{row}">
                <span>{{ row.isAdmin == 1 ? '是' : '否' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" min-width="60" align="center">
              <template slot-scope="{row}">
                <span>{{ row.status == 0 ? '正常' : row.status == 5 ? '受限':'禁用' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="80" align="center">
              <template slot-scope="{row}">
                <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
                <el-button v-if="userInfo.isAdmin == 1 && userInfo.id != row.id" type="text" size="small" @click="resetPsw(row)">重置密码</el-button>
                <el-button v-if="userInfo.isAdmin == 1 && userInfo.id != row.id" type="text" size="small" @click="killUser(row.id)">强制下线</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog :close-on-click-modal="false" title="修改企业信息" :visible.sync="dialogFormVisible1" width="440px">
      <el-form ref="dataForm" :rules="rules1" :model="temp1" label-position="left" label-width="100px" style="width: 360px; margin-left:20px;">
        <el-form-item label="企业代码" prop="orgCode">
          <el-input v-model="temp1.orgCode" placeholder="企业代码" />
        </el-form-item>
        <el-form-item label="企业名称" prop="orgName">
          <el-input v-model="temp1.orgName" placeholder="企业名称" />
        </el-form-item>
        <el-form-item label="企业所在地" prop="areaId">
          <el-select v-model="temp1.areaId" style="width:260px">
            <el-option v-for="item in areaList" :key="item.areaCode" :label="item.areaName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="invoiceAddr">
          <el-input v-model="temp1.invoiceAddr" placeholder="详细地址" />
        </el-form-item>
        <el-form-item label="行业类别" prop="industryId">
          <el-select v-model="temp1.industryId" style="width:260px">
            <el-option v-for="item in industryList" :key="item.id" :label="item.industryName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="纳税类型" prop="taxFilingCategoryId">
          <el-select v-model="temp1.taxFilingCategoryId" style="width:260px">
            <el-option v-for="item in taxfillingcategoryList" :key="item.id" :label="item.taxFilingCategoryName" :value="item.taxFilingCategoryCode" />
          </el-select>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="taxRegistrationCertificateNo">
          <el-input v-model="temp1.taxRegistrationCertificateNo" placeholder="纳税人识别号" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="saveManageInfo()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增用户':'编辑用户'" :visible.sync="dialogFormVisible2" width="660px">
      <el-form ref="dataForm1" :rules="rules2" inline :model="temp2" label-position="right" label-width="85px" style="width: 620px; margin-left:20px;">
        <el-form-item label="用户账号" prop="userAccount" style="margin-right:20px">
          <el-input v-model="temp2.userAccount" placeholder="用户账号" />
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="temp2.userName" placeholder="用户姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile" style="margin-right:20px">
          <el-input v-model="temp2.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="temp2.mail" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="审核人签名" prop="sign2" style="margin-right:20px">
          <el-input v-model="temp2.sign2" placeholder="用户姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp2.roleId" style="width:185px" :disabled="userInfo.isAdmin == 0">
            <el-option v-for="v in rolelist" :key="v.id" :label="v.roleName" :value="v.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp2.status" style="width:185px" :disabled="userInfo.isAdmin == 0">
            <el-option :value="0" label="正常" />
            <el-option :value="5" label="受限" />
            <el-option :value="9" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="密码" prop="password" style="margin-right:20px">
          <el-input v-model="temp2.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="确认密码" prop="againPassword">
          <el-input v-model="temp2.againPassword" type="password" placeholder="确认密码" />
        </el-form-item>
        <el-form-item label="员工" prop="staffId" style="margin-right:20px">
          <el-select v-model="temp2.staffId" style="width:185px" :disabled="userInfo.isAdmin == 0">
            <el-option v-for="item in staffList" :key="item.id" :value="item.id" :label="item.staffName" />
          </el-select>
        </el-form-item>
        <el-form-item label="单据查询权限" prop="queryType" label-width="100px" style="margin-right:60px">
          <el-radio v-model="temp2.queryType" :label="0" :disabled="userInfo.isAdmin == 0">自己</el-radio>
          <el-radio v-model="temp2.queryType" :label="1" :disabled="userInfo.isAdmin == 0">部门</el-radio>
        </el-form-item>
        <el-form-item label="是否管理员" prop="isAdmin">
          <el-radio v-model="temp2.isAdmin" :label="1" :disabled="userInfo.isAdmin == 0">是</el-radio>
          <el-radio v-model="temp2.isAdmin" :label="0" :disabled="userInfo.isAdmin == 0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="handleSave()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="重置密码" :visible.sync="dialogFormVisible3" width="400px">
      <el-form ref="dataForm3" :rules="rules3" :model="pswForm" label-position="left" label-width="96px">
        <!-- <el-form-item label="原密码" prop="oldPsw">
                    <el-input type="password" v-model="pswForm.oldPsw" placeholder="原密码" />
                </el-form-item> -->
        <el-form-item label="新密码" prop="password">
          <el-input v-model="pswForm.password" type="password" placeholder="新密码" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="againPassword">
          <el-input v-model="pswForm.againPassword" type="password" placeholder="确认新密码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible3 = false">取消</el-button>
        <el-button type="primary" @click="savePsw">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import CountTo from 'vue-count-to'
import { getmanagementInfo, getMapById, getUserList, registerLoadArea, registerLoadIndustry, registerLoadTaxfilingcategory, getCloseAccountStatus, getCleanBookStatus } from '@/api/user'
import { updateInfo, closeAccount, resetBook, saveUser, updatePSW, getRole } from '@/api/user'
import { getStaff } from '@/api/basedata'
export default {
  name: 'accountInfo',
  filters: {
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      dialogStatus: 'create',
      managementInfo: {},
      staffList: [],
      rolelist: [],
      userInfo: {},
      temp1: {},
      rules1: {
        orgName: [{ required: true, message: '企业全称不能为空', trigger: 'change' }],
        areaId: [{ required: true, message: '请选择企业所在地', trigger: 'change' }],
        industryId: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
        taxFilingCategoryId: [{ required: true, message: '请选择纳税类型', trigger: 'change' }]
      },
      rules2: {
        password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
        againPassword: [{ required: true, message: '确认密码不能为空', trigger: 'change' }],
        userAccount: [{ required: true, message: '用户账号不能为空', trigger: 'change' }],
        userName: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        mail: [{ required: true, message: '邮箱不能为空', trigger: 'change' }]
      },
      pswForm: {
        id: '',
        oldPsw: '',
        password: '',
        againPassword: ''
      },
      rules3: {
        oldPsw: [{ required: true, message: '原密码不能为空', trigger: 'change' }],
        password: [{ required: true, message: '新密码不能为空', trigger: 'change' }],
        againPassword: [{ required: true, message: ' 确认新密码不能为空', trigger: 'change' }]
      },
      temp2: {
        id: '',
        userAccount: '',
        userName: '',
        sign2: '',
        mobile: '',
        mail: '',
        roleId: '',
        password: '',
        againPassword: '',
        isAdmin: 0,
        queryType: 0,
        staffId: '',
        status: 0
      },
      resetTemp2: {
        id: '',
        userAccount: '',
        userName: '',
        sign2: '',
        mobile: '',
        mail: '',
        roleId: '',
        password: '',
        againPassword: '',
        isAdmin: 0,
        queryType: 0,
        staffId: '',
        status: 0
      },
      userList: {},
      tableData: [],
      industryList: [],
      taxfillingcategoryList: [],
      areaList: [],
      isCloseAccount: false,
      isCleanBook: false
    }
  },
  mounted() {
    getCloseAccountStatus().then(res => {
      if (res.data.errorCode == 0) {
        this.isCloseAccount = true
      }
    })
    getCleanBookStatus().then(res => {
      if (res.data.errorCode == 0) {
        this.isCleanBook = true
      }
    })
    this.getData1()
    this.getData2()
    this.getData3()
    registerLoadArea().then(res => {
      this.areaList = res.data.data
    })
    registerLoadIndustry().then(res => {
      this.industryList = res.data.data
    })
    registerLoadTaxfilingcategory().then(res => {
      this.taxfillingcategoryList = res.data.data
    })
    getStaff().then(res => {
      this.staffList = res.data.data
    })
    getRole({ page: 1 }).then(res => {
      this.rolelist = res.data.data
    })
  },
  methods: {
    closeCurAccount() {
      this.$confirm('该操作将清除所有的企业数据，请确认！', '警告', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('该操作将清除所有的企业数据，请再确认一次！', '警告', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          closeAccount().then(res => {
            if (res.data.errorCode === '0') {
              this.$message.success(res.data.msg)
              this.$store.dispatch('user/logout').then(() => {
                this.$router.replace('/login')
              })
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        })
      })
    },
    resetBookInfo() {
      this.$confirm('该操作将清除所有的账套数据，请确认！', '警告', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$confirm('该操作将清除所有的账套数据，请再确认一次！', '警告', {
          confirmButtonText: '确定',
          closeOnClickModal: false,
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          resetBook({}).then(res => {
            if (res.data.errorCode === '0') {
              this.$message.success(res.data.msg)
              this.$store.dispatch('user/logout').then(() => {
                this.$router.replace('/login')
              })
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        })
      })
    },
    killUser(id) {
      this.$confirm('该用户将被踢下线(如果该用户没被禁用,还可重新登录)!', '警告', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resetBook({ id }).then(res => {
          if (res.data.errorCode === '0') {
            this.$message.success(res.data.msg)
            this.$router.replace('/login')
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    saveManageInfo() {
      this.$refs.dataForm.validate(valid => {
        if (valid) {
          updateInfo(this.temp1).then(res => {
            this.$message.success(res.data.msg)
            this.getData1()
            this.dialogFormVisible1 = false
          })
        }
      })
    },
    showCompile() {
      this.dialogFormVisible1 = true
      this.temp1 = this.managementInfo
    },
    handleCompile(row) {
      for (var key in this.temp2) {
        this.temp2[key] = row[key]
      }

      this.dialogFormVisible2 = true
      this.dialogStatus = 'update'
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    handleAdd() {
      for (var key in this.temp2) {
        this.temp2[key] = this.resetTemp2[key]
      }
      this.dialogFormVisible2 = true
      this.dialogStatus = 'create'
      this.$nextTick(() => {
        this.$refs['dataForm1'].clearValidate()
      })
    },
    resetPsw(row) {
      this.dialogFormVisible3 = true
      for (var key in this.pswForm) {
        this.pswForm[key] = ''
      }
      this.pswForm.id = row.id
    },
    savePsw() {
      this.$refs['dataForm3'].validate((valid) => {
        if (valid) {
          // if (this.pswForm.password != this.pswForm.againPassword) {
          //     this.$message.warning('新密码两次输入不一致')
          //     return
          // }
          updatePSW(this.pswForm).then(res => {
            if (res.data.errorCode === '0') {
              this.dialogFormVisible = false
              this.$message.success('密码重置成功')
            } else { this.$message.error(res.data.msg) }
          })
        }
      })
    },
    handleSave() {
      this.$refs.dataForm1.validate(valid => {
        if (valid) {
          if (this.dialogStatus === 'create' && this.temp2.password != this.temp2.againPassword) {
            this.$message.warning('请确保两次密码输入一致')
            return
          }
          saveUser(this.temp2).then(res => {
            this.$message.success((this.dialogStatus === 'create' ? '新增' : '修改') + '成功')
            this.getData3()
            this.dialogFormVisible2 = false
          })
        }
      })
    },
    getData1() {
      getmanagementInfo().then(res => {
        if (res.data.errorCode === '0') {
          this.managementInfo = res.data.data[0] || {}
        }
      })
    },
    getData2() {
      var obj = {
        id: null
      }
      getMapById(obj).then(res => {
        if (res.data.errorCode === '0') {
          this.userInfo = res.data.data[0] || {}
        }
      })
    },
    getData3() {
      getUserList().then(res => {
        this.tableData = res.data.data || []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.homeMain {
    padding: 30px 30px 0;
    background-color: rgb(240, 242, 245);
    position: relative;
}

.panel-group {
    .card-panel-col {
        margin-bottom: 32px;
    }
}

/deep/.el-card__header {
    padding: 10px 15px
}

/deep/.el-card__body {
    padding: 10px 20px 15px;
}
</style>
<style scoped>
.listItem {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px #eee solid;
    font-size: 14px;
    color: #333
}

.listItem:last-child {
    border-bottom: none
}

.listItem label {
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
    width: 80px;
}
</style>
