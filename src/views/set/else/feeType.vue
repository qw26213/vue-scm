<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select size="small" v-model="listQuery.opRoleId" placeholder="权限组" clearable style="width: 200px" class="filter-item">
        <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-input size="small" v-model="listQuery.opUserName" placeholder="用户名" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限组">
        <template slot-scope="{row}">
          <span>{{ row.opRoleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toModify(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='update'?'修改用户':'添加用户'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="temp.name" placeholder="用户名" />
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="temp.mobile" placeholder="手机号" />
        </el-form-item>
        <el-form-item label="权限组" prop="opRoleId">
          <el-select v-model="temp.opRoleId" class="filter-item" placeholder="权限组">
            <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUser,addUser,getRoles,updateUser} from '@/api/user'
export default {
  name: 'userList',
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      curItemId:'',
      roleList:[],
      listQuery: {
        page: 1,
        opRoleId: '',
        opUserName: ''
      },
      temp: {
        name: "",
        mobile: '',
        opRoleId: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      dialogPvVisible: false,
      rules: {
        name: [{ required: true, message: '用户名不能为空', trigger: 'change' }],
        mobile: [{ required: true, message: '手机号不能为空', trigger: 'change' }],
        opRoleId: [{ required: true, message: '请选择权限', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getRoleList()
  },
  methods: {
    getRoleList(){
      getRoles().then(response =>{
        this.roleList = response.data.data
      });
    },
    toModify(obj){
      this.dialogFormVisible = true;
      console.log(obj.id)
      this.curItemId = obj.id
      this.dialogStatus = 'update'
      this.temp = {
        name: obj.name,
        mobile: obj.mobile,
        opRoleId: obj.opRoleId
      }
    },
    getList() {
      this.listLoading = true
      getUser(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data.content
        this.total = response.data.data.totalElements
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    resetTemp() {
      this.temp = {
        name: '',
        mobile:'' 
      }
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addUser(this.temp).then((res) => {
            if(res.data.error==0){
              this.dialogFormVisible = false;
              this.getList();
              this.$message.success('添加成功')
            }else{
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let obj = this.temp;
          obj.id = this.curItemId;
          updateUser(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.getList();
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}`
        ? 'ascending'
        : sort === `-${key}`
          ? 'descending'
          : ''
    }
  }
}
</script>
