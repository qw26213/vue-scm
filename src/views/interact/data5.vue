<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input size="small" v-model="listQuery.deviceId" placeholder="商户名" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.storeId" placeholder="门店号" style="width: 200px;" class="filter-item" />
      <el-select size="small" v-model="listQuery.bd" placeholder="审核状态" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" @sort-change="sortChange">
      <el-table-column label="设备号" width="200" align="center">
        <template slot-scope="{row}">
          <span>{{row.deviceId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前状态" min-width="240">
        <template slot-scope="{row}">
          <span>{{row.storeId}}</span>
        </template>
      </el-table-column>
      <el-table-column label="在网时长" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{row.storeName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="在线时长" width="80px">
        <template slot-scope="{row}">
          <span>{{row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column label="活跃时长" align="center" width="95">
        <template slot-scope="{row}">
          <span>{{row.deviceCount}}</span>
        </template>
      </el-table-column>
      <el-table-column label="核销笔数" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{row.bd}}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :close-on-click-modal="false" :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="Type" prop="type">
          <el-select v-model="temp.type" class="filter-item" placeholder="Please select">
            <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Date" prop="timestamp">
          <el-date-picker editable="false" v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />
        </el-form-item>
        <el-form-item label="商家名称" prop="title">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="Status">
          <el-select v-model="temp.status" class="filter-item" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Imp">
          <el-rate v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max="3" style="margin-top:8px;" />
        </el-form-item>
        <el-form-item label="Remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="createData">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getDevices } from '@/api/user'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  name: 'merchantList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: true,
      listQuery: {
        deviceId:'',
        page: 1,
        merchantId: '',
        merchantName: ''
      },
      importanceOptions: [1, 2, 3],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        deviceId: '',
        storeId: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getDevices(this.listQuery).then(response => {
        this.listLoading = false
        console.log(response.data.data.list);
        this.tableData = response.data.data.list
        this.total = response.data.data.pageResponse.totalCount
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
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464

        }
      })
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
  }
}
</script>
