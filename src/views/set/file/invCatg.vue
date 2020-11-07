<template>
  <div class="main">
    <div class="leftTree">
      <el-tree :data="treeData" :props="defaultProps" default-expand-all :expand-on-click-node="false" accordion @node-click="handleNodeClick" />
    </div>
    <div class="app-container">
      <div class="filterDiv">
        <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
      </div>
      <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" row-key="id">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="商品分类代码">
            <template slot-scope="{row}">
              <span>{{ row.invCatgCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="商品分类名称">
            <template slot-scope="{row}">
              <span>{{ row.invCatgName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否末级" align="center">
            <template slot-scope="{row}">
              <span>{{ row.leaf==1?'是':'否' }}</span>
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
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
      </div>
      <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增商品分类':'修改商品分类'" :visible.sync="dialogFormVisible" width="500px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 300px; margin-left:50px;">
          <el-form-item label="商品分类代码" prop="invCatgCode">
            <el-input v-model="temp.invCatgCode" placeholder="商品分类代码" />
          </el-form-item>
          <el-form-item label="商品分类名称" prop="invCatgName">
            <el-input v-model="temp.invCatgName" placeholder="商品分类名称" />
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
import { getInvCatg, saveInvCatg, delInvCatg, updateInvCatgDisabled, getItemTree, getInvcatgChildrenByParentId } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseInvCatg',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      treeData: [],
      parentId: '',
      defaultProps: {
        children: 'children',
        label: 'invCatgName'
      },
      total: 0,
      listLoading: true,
      listQuery: {
        parentId: ''
      },
      temp: {
        invCatgName: '',
        invCatgCode: '',
        invLevel: '',
        remarks: '',
        isDisable: '0'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        invCatgName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        invCatgCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        invLevel: [{ required: true, message: '代码级次不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getList()
    this.getLeftTree()
  },
  methods: {
    handleNodeClick(e) {
      this.listQuery.parentId = e.id
      this.parentId = e.id
      this.getList()
    },
    getLeftTree() {
      getItemTree({ parentId: '', includeRoot: 1 }).then(res => {
        this.treeData = res.data.data
      })
    },
    getList() {
      this.listLoading = true
      getItemTree(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleAdd(obj) {
      if (this.parentId == '') {
        this.$message.error('请先选择一个上级商品分类')
        return
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
      this.temp.id = ''
      this.temp.parentId = this.parentId
      this.temp.invCatgName = ''
      this.temp.invCatgCode = ''
      this.temp.isDisable = '0'
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      this.temp.id = obj.id
      this.temp.parentId = obj.parentId
      this.temp.invCatgName = obj.invCatgName
      this.temp.invCatgCode = obj.invCatgCode
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
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data)
      })
    },
    changeAvaiable(data) {
      var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
      updateInvCatgDisabled(obj).then(res => {
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
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveInvCatg(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.getLeftTree()
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleCreate() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveInvCatg(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.getLeftTree()
              this.dialogFormVisible = false
              this.$message.success('新增成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    delItem(id) {
      delInvCatg(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    padding-left: 180px;
}

.leftTree {
    width: 160px;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    border: 1px #eee solid;
    overflow-y: auto;
}

.tableDiv {
    width: 100%;
}
</style>
