<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input v-model="listQuery.labelName" size="small" placeholder="业务标签代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="业务标签代码" align="center">
          <template slot-scope="{row}">
            <span>{{ row.labelCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务标签名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.labelName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否可用" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isDisable==0?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="190">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
            <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==0?'禁用':'解禁' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增业务标签':'修改业务标签'" :visible.sync="dialogFormVisible" width="460px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
        <el-form-item label="业务标签代码" prop="labelCode">
          <el-input v-model="temp.labelCode" placeholder="业务标签代码" />
        </el-form-item>
        <el-form-item label="业务标签名称" prop="labelName">
          <el-input v-model="temp.labelName" placeholder="业务标签名称" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" placeholder="备注" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable">
          <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { getLabel, saveLabel, delLabel, updateLabelDisabled } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'Baselabel',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        labelName: ''
      },
      temp: {
        id: '',
        labelName: '',
        labelCode: '',
        remarks: '',
        isDisable: 0
      },
      resetTemp: {
        id: '',
        labelName: '',
        labelCode: '',
        remarks: '',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        labelName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        labelCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        isDisable: [{ required: false }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getLabel(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleAdd() {
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
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    updateStatus(data) {
      this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data)
      })
    },
    changeAvaiable(data) {
      var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
      updateLabelDisabled(obj).then(res => {
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
          saveLabel(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
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
          savelabel(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
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
      saveLabel(id).then(res => {
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
