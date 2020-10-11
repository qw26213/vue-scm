<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <el-input v-model="listQuery.queryParam.billNo" size="small" placeholder="单据号" />
      <warehouseList key-type="outWarehouseId" place-txt="移出仓库" ctr-type="list" :select-id="listQuery.queryParam.outWarehouseId" @selectChange="selectChange" />
      <truckList key-type="outTruckId" place-txt="移出车辆" ctr-type="list" :select-id="listQuery.queryParam.outTruckId" @selectChange="selectChange" />
      <warehouseList key-type="inWarehouseId" place-txt="移入仓库" ctr-type="list" :select-id="listQuery.queryParam.inWarehouseId" @selectChange="selectChange" />
      <truckList key-type="inTruckId" place-txt="移入车辆" ctr-type="list" :select-id="listQuery.queryParam.inTruckId" @selectChange="selectChange" />
      <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
        <el-option label="已确认" :value="2" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
        <el-table-column label="单据日期" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.billDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据号">
          <template slot-scope="{row}">
            <span>{{ row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务类型">
          <template slot-scope="{row}">
            <span>{{ row.bizTypeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="移出仓库">
          <template slot-scope="{row}">
            <span>{{ row.outWarehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="移出车辆">
          <template slot-scope="{row}">
            <span>{{ row.outTruckName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="移入仓库">
          <template slot-scope="{row}">
            <span>{{ row.inWarehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="移入车辆">
          <template slot-scope="{row}">
            <span>{{ row.inTruckName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员">
          <template slot-scope="{row}">
            <span>{{ row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'已审核':row.status==2?'已确认':'待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="{row}">
            <span class="ctrl" @click="handleCompile(row.id,row.status)">{{ row.status<=0?'编辑':'查看' }}</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status==-2" class="ctrl" @click="showConfirmInfo(row.id)">查看确认意见</span>
            <span v-if="row.status==1" class="ctrl" @click="confirmBill(row.id)">确认</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row.id)">审核</span>
            <span v-if="row.status<=0" class="ctrl del" @click="handleDel(row.id)">删除</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
    <Confirmconfirm :dialogvisible.sync="confirmModalVisible" :type="confirmType" :remarklist="remarklist1" @confirmBill="confirmItem" />
  </div>
</template>
<script>
import { getMovement, delMovement, auditMovement, confirmMovement, getAuditInfoByHeaderId, getConfirmInfoByHeaderId, printByHeaderId } from '@/api/store'
import Pagination from '@/components/Pagination'
import warehouseList from '@/components/selects/warehouseList'
import truckList from '@/components/selects/truckList'
import Auditconfirm from '@/components/Auditconfirm/index'
import Confirmconfirm from '@/components/Confirmconfirm/index'
import { getNowDate } from '@/utils/auth'
export default {
  name: 'Movement',
  components: { Pagination, warehouseList, truckList, Auditconfirm, Confirmconfirm },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      listLoading: true,
      auditModalVisible: false,
      auditType: '',
      remarklist: [],
      confirmModalVisible: false,
      confirmType: '',
      remarklist1: [],
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          outWarehouseId: '',
          inWarehouseId: '',
          outTruckId: '',
          inTruckId: '',
          billNo: '',
          status: ''
        }
      }
    }
  },
  created() {
    this.getList()
    this.dateTime = [this.listQuery.date1, this.listQuery.date2]
  },
  methods: {
    printBill(row) {
      printByHeaderId('/ic/movement', row.id).then(res => {
        if (res.data.errorCode == 0) {
          window.open('http://' + window.location.host + res.data.data)
        } else {
          this.$messae.warning('文件生成失败')
        }
      })
    },
    showConfirmInfo(id) {
      this.confirmType = 'record'
      getConfirmInfoByHeaderId(id).then(res => {
        if (res.data.errorCode == 0) {
          this.confirmModalVisible = true
          this.remarklist1 = res.data.data || []
        }
      })
    },
    showAuditInfo(id) {
      this.auditType = 'record'
      getAuditInfoByHeaderId(id).then(res => {
        if (res.data.errorCode == 0) {
          this.auditModalVisible = true
          this.remarklist = res.data.data || []
        }
      })
    },
    handleConfirm(id) {
      this.confirmType = 'create'
      this.confirmModalVisible = true
      this.curBillId = id
    },
    confirmItem(obj) {
      const data = obj
      data.id = this.curBillId
      confirmMovement(data).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.confirmModalVisible = false
          this.$message.success('确认成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    getList() {
      this.listLoading = true
      getMovement(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(err => {
        this.listLoading = false
      })
    },
    selectChange(obj) {
      for (var key in obj) {
        this.listQuery.queryParam[key] = obj[key]
      }
    },
    handleCheck(id) {
      this.auditType = 'create'
      this.auditModalVisible = true
      this.curBillId = id
    },
    checkItem(obj) {
      const data = obj
      data.id = this.curBillId
      auditMovement(data).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.auditModalVisible = false
          this.$message.success('审核成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleAdd(obj) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/movementAdd')
    },
    handleCompile(id, status) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/movementModify?id=' + id + '&status=' + status)
    },
    handleDel(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delMovement(id).then(res => {
          if (res.data.errorCode == 0) {
            this.getList()
            this.dialogFormVisible = false
            this.$message.success('删除成功')
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    }
  }
}
</script>
