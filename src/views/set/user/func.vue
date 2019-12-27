<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增权限</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="100" align="center">
      </el-table-column>
      <el-table-column label="权限组">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属用户数">
        <template slot-scope="{row}">
          <span>{{ row.userCount==null?0:row.userCount }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toModify(row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>
<script>
import { getPermiss,getRoles,addRole,updateRole } from '@/api/user'
export default {
  name: 'rightSet',
  data() {
    return {
      tableKey: 0,
      tableData:[],
      list: [],
      listLoading:false,
      defaultProps: {
          children: 'children',
          label: 'label'
      }
    }
  },
  created() {
    sessionStorage.removeItem('roleInfo')
    this.getData()
  },
  methods: {
    toModify(obj){
      sessionStorage.roleInfo = JSON.stringify(obj);
      this.$router.push('/roleModify');
    },
    getCheckedNodes(){
      var permission = []
      var roles = this.$refs.tree.getCheckedNodes()
      for(var i=0;i<roles.length;i++){
        permission.push(roles[i].id)
      }
      return permission
    },
    createData(){
      var obj = {
        userCount:10,
        name:this.roleName,
        permissionIdList:this.getCheckedNodes()
      }
      addRole(obj).then(res => {
        this.dialogFormVisible = false
      }).catch(error => {

      })
    },
    updateData() {
      let obj = {
        userCount:10,
        name:this.roleName,
        permissionIdList:this.getCheckedNodes()
      };
      obj.id = this.curItemId;
      updateRole(obj).then(() => {
        this.dialogFormVisible = false;
        this.$message({
          message: '修改成功',
          type: 'success'
        })
      })
    },
    handleCreate() {
      this.$router.push('/roleAdd')
    },
    async getData(){
      this.listLoading = true
      const { data } = await getRoles();
      this.tableData = data.data
      this.listLoading = false
    }
  }
}

</script>
<style scoped>
.edit-input {
  padding-right: 100px;
}

.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
