<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <el-input v-model="listQuery.queryParam.billNo" size="small" placeholder="单据号" style="width: 120px;" />
      <custList ctr-type="list" @selectChange="selectChange" />
      <staffList ctr-type="list" @selectChange="selectChange" />
      <warehouseList ctr-type="list" @selectChange="selectChange" />
      <truckList ctr-type="list" @selectChange="selectChange" />
      <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未审核" value="0" />
        <el-option label="已审核" value="1" />
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
        <el-table-column label="客户">
          <template slot-scope="{row}">
            <span>{{ row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库">
          <template slot-scope="{row}">
            <span>{{ row.warehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆">
          <template slot-scope="{row}">
            <span>{{ row.truckName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'已审核':row.status==2?'已生成':'待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="{row}">
            <span v-if="row.status<=0" class="ctrl" @click="handleCompile(row, 1)">编辑</span>
            <span v-if="row.status>=1" class="ctrl" @click="handleScan(row)">查看</span>
            <span v-if="row.status==0" class="ctrl" @click="handleSplit(row, 3)">拆分</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row)">审核</span>
            <span v-if="row.status<=0" class="ctrl del" @click="handleDel(row)">删除</span>
            <span v-if="row.status==1" class="ctrl" @click="handleCreateBill(row.isSales, row.id, row.salesHeaderId, 1, row.billDate)">{{ row.isSales==0?'生成':'查看' }}销售单</span>
            <span v-if="row.status==1" class="ctrl" @click="handleCreateBill(row.isDelivery, row.id, row.deliveryHeaderId, 2, row.billDate)">{{ row.isDelivery==0?'生成':'查看' }}配送单</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :title="type==1?'选择销售单日期':'选择配送单日期'" :visible.sync="dialogFormVisible" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" label="1">出库单日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="type==1 ? createBill() : createBill1()">确定</el-button>
      </div>
    </el-dialog>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
    <modalTable :modal-table-visible="modalTableVisible" :header-id="outboundOrderHeaderId" type="o" />
  </div>
</template>
<script>
import { getOutboundOrder, delOutboundOrder, auditOutboundOrder, buildOutboundOrder, buildDeliveryByHeaderId, getAuditInfoByHeaderId, printByHeaderId } from '@/api/store'
import { getNowDate } from '@/utils/auth'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import warehouseList from '@/components/selects/warehouseList'
import truckList from '@/components/selects/truckList'
import Auditconfirm from '@/components/Auditconfirm/index'
import Pagination from '@/components/Pagination'
export default {
  name: 'OutboundOrder',
  components: { Pagination, staffList, custList, warehouseList, truckList, Auditconfirm },
  filters: {
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      type: 1,
      dialogFormVisible: false,
      auditModalVisible: false,
      auditType: '',
      remarklist: [],
      billDate: '',
      total: 0,
      listLoading: true,
      curBillId: '',
      isBillDate: '0',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          supplierId: '',
          custId: '',
          staffId: '',
          truckId: '',
          status: '',
          warehouseId: '',
          billNo: ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId('/ic/outboundOrder', { id: row.id, billDate: row.billDate }).then(res => {
        if (res.data.errorCode === '0') {
          window.open('http://' + window.location.host + res.data.data)
        } else {
          this.$messae.warning('文件生成失败')
        }
      })
    },
    showAuditInfo(id) {
      this.auditType = 'record'
      getAuditInfoByHeaderId(id).then(res => {
        if (res.data.errorCode === '0') {
          this.auditModalVisible = true
          this.remarklist = res.data.data || []
        }
      })
    },
    selectChange(obj) {
      for (var key in obj) {
        this.listQuery.queryParam[key] = obj[key]
      }
    },
    getList() {
      this.listLoading = true
      getOutboundOrder(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCheck(row) {
      this.auditType = 'create'
      this.auditModalVisible = true
      this.curBillId = row.id
      this.curBillDate = row.billDate
    },
    checkItem(obj) {
      const data = obj
      data.id = this.curBillId
      data.billDate = this.curBillDate
      auditOutboundOrder(data).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.auditModalVisible = false
          this.$message.success('审核成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleCreateBill(status, id1, id2, type, date) {
      if (status !== 0) {
        if (type === 1) {
          this.$router.push('/sale/detail?id=' + id2 + '&status=' + status)
        } else {
          this.$router.push('/sale/deliveryDetail?id=' + id2 + '&status=' + status)
        }
      } else {
        this.type = type
        this.billDate = date
        this.curBillId = id1
        this.dialogFormVisible = true
      }
    },
    createBill() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId }
      buildOutboundOrder(obj).then(res => {
        if (res.data.errorCode === '0') {
          this.dialogFormVisible = false
          this.getList()
          this.$message.success('生成销售单成功')
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('生成失败，请稍后重试！')
      })
    },
    createBill1() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId, billDate: this.billDate }
      buildDeliveryByHeaderId(obj).then(res => {
        if (res.data.errorCode === '0') {
          this.dialogFormVisible = false
          this.getList()
          this.$message.success('生成配送单成功')
        } else {
          this.$message.error(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('生成失败，请稍后重试！')
      })
    },
    handleAdd() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/outboundOrderAdd')
    },
    handleCompile(row, status) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/outboundOrderModify?id=' + row.id + '&status=' + status + '&billDate=' + row.billDate)
    },
    handleSplit(row, status) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/outboundOrderSplit?id=' + row.id + '&status=' + status + '&billDate=' + row.billDate)
    },
    handleScan(row) {
      this.$router.push('/store/outboundOrderDetail?id=' + row.id + '&billDate=' + row.billDate)
    },
    handleDel(row) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        const billDate = row.billDate
        delOutboundOrder({ id, billDate }).then(res => {
          if (res.data.errorCode === '0') {
            this.getList()
            this.dialogFormVisible = false
            this.$message.success('删除成功')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    }
  }
}
</script>
