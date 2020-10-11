<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-input v-model="listQuery.referCoaName" size="small" placeholder="科目对照代码/名称" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="序号" type="index" width="100" align="center" />
        <el-table-column label="科目对照代码">
          <template slot-scope="{row}">
            <span>{{ row.referCoaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目对照名称">
          <template slot-scope="{row}">
            <span>{{ row.referCoaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目代码">
          <template slot-scope="{row}">
            <span>{{ row.coaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目名称">
          <template slot-scope="{row}">
            <span>{{ row.coaName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" title="修改科目对照" :visible.sync="dialogFormVisible" width="460px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
        <el-form-item label="科目对照代码" prop="referCoaCode">
          <el-input v-model="temp.referCoaCode" disabled placeholder="科目对照代码" />
        </el-form-item>
        <el-form-item label="科目对照名称" prop="referCoaName">
          <el-input v-model="temp.referCoaName" disabled placeholder="科目对照名称" />
        </el-form-item>
        <el-form-item label="科目代码" prop="coaCode">
          <el-input v-model="temp.coaCode" placeholder="科目代码" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="handleModify()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getReferCoa, saveReferCoa } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
  name: 'BasereferCoa',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      listLoading: true,
      listQuery: {
        page: 1,
        referCoaName: ''
      },
      temp: {
        id: '',
        referCoaName: '',
        referCoaCode: '',
        coaCode: ''
      },
      resetTemp: {
        id: '',
        referCoaName: '',
        referCoaCode: '',
        coaCode: ''
      },
      dialogFormVisible: false,
      rules: {
        referCoaName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
        referCoaCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
        priceRatio: [{ required: true, message: '价格比不能为空', trigger: 'change' }],
        coaCode: [{ required: true, message: '对应科目代码不能为空', trigger: 'change' }],
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
      getReferCoa(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
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
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          saveReferCoa(this.temp).then(res => {
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
    }
  }
}
</script>
