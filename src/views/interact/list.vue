<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select size="small" v-model="listQuery.bd" placeholder="所属BD" clearable style="width: 130px" class="filter-item">
        <el-option v-for="item in [0,1,2]" :key="item" :label="item" :value="item" />
      </el-select>
      <el-input size="small" v-model="listQuery.merchantName" placeholder="商户名称" style="width: 200px;" class="filter-item" />
      <el-input size="small" v-model="listQuery.bizLicenseNo" placeholder="商户编号" style="width: 200px;" class="filter-item" />
      <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleCreate">新增</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="创建时间">
        <template slot-scope="{row}">
          <span>{{row.dateCreated}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名称">
        <template slot-scope="{row}">
          <span>{{row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户编号">
        <template slot-scope="{row}">
          <span>{{row.id}}</span>
        </template>
      </el-table-column>
      <el-table-column label="门店数">
        <template slot-scope="{row}">
          <span>{{row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="设备数">
        <template slot-scope="{row}">
          <span>{{row.count}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属BD">
        <template slot-scope="{row}">
          <span>{{row.bd}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toModify(row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="toStore(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getData" />
  </div>
</template>

<script>
import { getList } from '@/api/data'

import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' 
export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: false,
      listQuery: {
        bd:'',
        page: 1,
        merchantId: '',
        merchantName: ''
      },
      showReviewer: false,
      temp: {
        bd: '',
        page: 1,
        merchantId: '',
        merchantName: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      downloadLoading: false
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.tableData = getList()
      this.total = 100
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getData()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    toStore(id){
      this.$router.push('/merchantStores?id='+id);
    },
    toModify(id){
      this.$router.push('/merchantModify?id='+id);
    },
    handleCreate() {
      this.$router.push('/merchantAdd');
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
