<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增用户</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column label="企业代码">
        <template slot-scope="{row}">
          <span>{{ row.orgCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户账号">
        <template slot-scope="{row}">
          <span>{{ row.userAccount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="员工">
        <template slot-scope="{row}">
          <span>{{ row.staffName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理员" align="center">
        <template slot-scope="{row}">
          <span>{{ row.isAdmin==1?'是':'否' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据查询权限" align="center">
        <template slot-scope="{row}">
          <span>{{ row.queryType==1?'自己':'全部' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status==0?"正常":(row.status==5?'受限':'其它') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="160">
        <template slot-scope="{row}">
          <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
          <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增用户':'修改用户'" :visible.sync="dialogFormVisible" width="650px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="100px" style="width: 610px; margin-left:10px;">
        <el-form-item label="用户账号" prop="userAccount">
          <el-input v-model="temp.userAccount" placeholder="用户账号" />
        </el-form-item>
        <el-form-item label="用户姓名" prop="userName">
          <el-input v-model="temp.userName" placeholder="用户姓名" />
        </el-form-item>
        <el-form-item label="审核人签名" prop="sign2">
          <el-input v-model="temp.sign2" placeholder="审核人签名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="temp.mail" placeholder="邮箱" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="temp.status" style="width:185px">
            <el-option :value="0" label="正常" />
            <el-option :value="5" label="受限" />
            <el-option :value="9" label="禁用" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="密码" prop="password">
          <el-input v-model="temp.password" type="password" placeholder="密码" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="确认密码" prop="againPassword">
          <el-input v-model="temp.againPassword" type="password" placeholder="确认密码" />
        </el-form-item>
        <!-- <el-form-item label="角色" prop="roleId">
                    <el-select v-model="temp.roleId" style="width:185px" class="filter-item">
                        <el-option label="审核会计" value="888888"></el-option>
                        <el-option label="制单会计" value="888887"></el-option>
                        <el-option label="企业出纳" value="888889"></el-option>
                        <el-option label="企业老板" value="888890"></el-option>
                    </el-select>
                </el-form-item> -->
        <el-form-item label="员工" prop="staffId">
          <el-select v-model="temp.staffId" style="width:185px">
            <el-option v-for="item in staffList" :key="item.id" :value="item.id" :label="item.staffName" />
          </el-select>
        </el-form-item>
        <el-form-item label="单据查询权限" prop="queryType">
          <el-radio v-model="temp.queryType" :label="0">自己</el-radio>
          <el-radio v-model="temp.queryType" :label="1">全部</el-radio>
        </el-form-item>
        <el-form-item label="是否管理员" prop="isAdmin">
          <el-radio v-model="temp.isAdmin" :label="1">是</el-radio>
          <el-radio v-model="temp.isAdmin" :label="0">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getUserList, saveUser, delUser } from '@/api/user'
import { getStaff } from '@/api/basedata'
export default {
  name: 'UserList',
  data() {
    return {
      tableKey: 0,
      tableData: [],
      staffList: [],
      dialogTit: '',
      dialogType: '',
      dataList: [],
      assignType: 0,
      handleObj: {},
      selectIdArr: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        UserName: '',
        UserCode: ''
      },
      temp: {
        againPassword: '',
        auditLevel1: '',
        auditLevel2: '',
        id: '',
        mail: '',
        mobile: '',
        orgType: '',
        password: '',
        roleId: '888888',
        queryType: 0,
        staffId: '',
        sign2: '',
        status: 0,
        userAccount: '',
        userName: '',
        isAdmin: 0
      },
      resetTemp: {
        againPassword: '',
        auditLevel1: '',
        auditLevel2: '',
        id: '',
        mail: '',
        mobile: '',
        orgType: '',
        password: '',
        roleId: '888888',
        queryType: 0,
        staffId: '',
        sign2: '',
        status: 0,
        userAccount: '',
        userName: '',
        isAdmin: 0
      },
      dialogFormVisible: false,
      dialogFormVisible1: false,
      dialogStatus: '',
      rules: {
        userName: [{ required: true, message: '用户姓名不能为空', trigger: 'change' }],
        password: [{ required: true, message: '密码不能为空', trigger: 'change' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        mail: [{ required: true, message: '邮箱不能为空', trigger: 'change' }],
        userAccount: [{ required: true, message: '用户账号不能为空', trigger: 'change' }],
        againPassword: [{ required: true, message: '确认密码不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getList()
    getStaff().then(res => {
      this.staffList = res.data.data
    })
  },
  methods: {
    getList() {
      this.listLoading = true
      getUserList().then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      })
    },
    handleAdd(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      for (var key in this.temp) {
        this.temp[key] = this.resetTemp[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (var key in this.temp) {
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    save() {
      this.temp.auditLevel1 = '1'
      this.temp.auditLevel2 = '1'
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveUser(this.temp).then(res => {
            if (res.data.errorCode === '0') {
              this.getList()
              this.dialogFormVisible = false
              this.$message.success(this.dialogStatus === 'create' ? '新增成功' : '修改成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleDel(id) {
      this.$confirm('确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delUser({ id: id }).then(res => {
          if (res.data.errorCode === '0') {
            this.getList()
            this.$message.success('删除用户成功！')
          } else {
            this.$message.warning(res.data.message)
          }
        })
      })
    }
  }
}
</script>
