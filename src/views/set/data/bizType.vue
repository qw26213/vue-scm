<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input v-model="listQuery.bizTypeName" size="small" placeholder="业务类型代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="业务类型代码">
          <template slot-scope="{row}">
            <span>{{ row.bizTypeCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型名称">
          <template slot-scope="{row}">
            <span>{{ row.bizTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码总长度" align="center">
          <template slot-scope="{row}">
            <span>{{ row.len }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码日期类型" align="center">
          <template slot-scope="{row}">
            <span>{{ row.dateType == 1 ? '年月日' : row.dateType == 2 ? '年月' : row.dateType ===3 ? '年' : '无日期' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="编码前缀" align="center">
          <template slot-scope="{row}">
            <span>{{ row.preCode }}</span>
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
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
            <!-- <el-button type="danger" size="small" @click="handleDel(row.id)">删除</el-button> -->
            <!-- <el-button type="warning" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增业务类型':'修改业务类型'" :visible.sync="dialogFormVisible" width="500px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 456px;">
        <el-form-item label="业务类型代码" prop="bizTypeCode">
          <el-input v-model="temp.bizTypeCode" disabled placeholder="业务类型代码" />
        </el-form-item>
        <el-form-item label="业务类型名称" prop="bizTypeName">
          <el-input v-model="temp.bizTypeName" disabled placeholder="业务类型名称" />
        </el-form-item>
        <el-form-item label="编码总长度" prop="len">
          <el-input-number v-model="temp.len" :min="6" :max="19" placeholder="编码总长度" />
        </el-form-item>
        <el-form-item label="编码日期类型" prop="dateType">
          <el-select v-model="temp.dateType" style="width:100%" class="filter-item">
            <el-option label="无日期" :value="0" />
            <el-option label="年月日" :value="1" />
            <el-option label="年月" :value="2" />
            <el-option label="年" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item label="编码前缀" prop="preCode">
          <el-input-number v-model="temp.preCode" :min="10" :max="99" placeholder="单位编码前缀" />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="temp.remarks" disabled placeholder="备注" />
        </el-form-item>
        <el-form-item label="是否可用" prop="isDisable">
          <el-radio v-model="temp.isDisable" disabled :label="0">是</el-radio>
          <el-radio v-model="temp.isDisable" disabled :label="1">否</el-radio>
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
import { getBizType, saveBizType, delBizType, updateBizTypeDisabled } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'baseBizType',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        bizTypeName: ''
      },
      temp: {
        id: '',
        bizTypeName: '',
        bizTypeCode: '',
        len: '',
        dateType: '',
        preCode: '',
        remarks: '',
        isDisable: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      rules: {
        bizTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        bizTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
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
      getBizType(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      this.dialogStatus = 'update'
      for (const key in this.temp) {
        this.temp[key] = obj[key]
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
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
      updateBizTypeDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
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
          saveBizType(this.temp).then(res => {
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
          saveBizType(this.temp).then(res => {
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
      delBizType(id).then(res => {
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
