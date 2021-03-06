<template>

  <div class="main">
    <div class="leftTree">
      <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
    </div>

    <div class="app-container tableDiv">
      <div class="filterDiv">
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" row-key="id">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="部门代码">
            <template slot-scope="{row}">
              <span>{{ row.deptCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="部门名称">
            <template slot-scope="{row}">
              <span>{{ row.deptName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="负责人">
            <template slot-scope="{row}">
              <span>{{ row.leader }}</span>
            </template>
          </el-table-column>
          <el-table-column label="备注">
            <template slot-scope="{row}">
              <span>{{ row.remarks }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否可用" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isDisable==0?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="230">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增部门':'修改部门'" :visible.sync="dialogFormVisible" width="460px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:10px;">
          <el-form-item label="部门代码" prop="deptCode">
            <el-input v-model="temp.deptCode" placeholder="部门代码" />
          </el-form-item>
          <el-form-item label="部门名称" prop="deptName">
            <el-input v-model="temp.deptName" placeholder="部门名称" />
          </el-form-item>
          <el-form-item label="负责人" prop="leader">
            <el-input v-model="temp.leader" placeholder="负责人" />
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="temp.remarks" placeholder="备注" />
          </el-form-item>
          <el-form-item label="是否可用" prop="isDisable">
            <el-radio v-model="temp.isDisable" label="0">是</el-radio>
            <el-radio v-model="temp.isDisable" label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import { getDept, saveDept, delDept, getDeptTree, updateDeptDisabled } from '@/api/basedata'
import { parseTime } from '@/utils'
export default {
  name: 'baseDept',
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'deptName'
      },
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        parentId: '',
        deptCode: '',
        deptName: ''
      },
      temp: {
        deptName: '',
        deptCode: '',
        parentId: '',
        leader: '',
        remarks: '',
        isDisable: '0'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        deptName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        deptCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        leader: [{ required: false, message: '负责人不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getList()
    this.getLeftTree()
  },
  methods: {
    getList() {
      this.getTable()
    },
    getLeftTree() {
      getDeptTree({ parentId: '', includeRoot: 1 }).then(res => {
        this.treeData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    getTable() {
      this.listLoading = true
      getDeptTree(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      })
    },
    handleNodeClick(e) {
      this.listQuery.parentId = e.id
      this.temp.parentId = e.parentId
      this.getTable()
    },
    handleAdd(obj) {
      if (this.listQuery.parentId == '') {
        this.$message.error('请先选择一个上级部门'); return
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.deptName = ''
      this.temp.deptCode = ''
      this.temp.leader = ''
      this.temp.remarks = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.deptName = obj.deptName
      this.temp.deptCode = obj.deptCode
      this.temp.leader = obj.leader
      this.temp.remarks = obj.remarks
      this.temp.isDisable = String(obj.isDisable)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data) {
      this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
        confirmButtonText: '确定', closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data)
      })
    },
    changeAvaiable(data) {
      var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
      updateDeptDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleDel(id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定', closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDept(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.getLeftTree()
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            }
          })
        }
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveDept(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.getLeftTree()
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            }
          })
        }
      })
    },
    delItem(id) {
      delDept(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.getLeftTree()
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        }
      })
    }
  }
}
</script>
<style scoped>
.main {position: relative;width: 100%;height: 100%;padding: 0 10px;padding-left: 180px;}
.leftTree {width: 160px;height: 100%;background-color: #fff;position: absolute;top: 20px;left: 20px;border:1px #eee solid;}
.tableDiv {width: 100%;}
</style>
