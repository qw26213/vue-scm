<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <el-input v-model="listQuery.billNo" size="small" placeholder="单据号" style="width: 120px;" />
      <custList ctr-type="list" @selectChange="selectChange" />
      <staffList ctr-type="list" :select-id="listQuery.queryParam.staffId" @selectChange="selectChange" />
      <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未审核" value="0" />
        <el-option label="已审核" value="1" />
      </el-select>
      <el-select v-model="listQuery.queryParam.statusDelivery" placeholder="配送状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未配送" :value="0" />
        <el-option label="配送中" :value="1" />
        <el-option label="已完成" :value="9" />
        <el-option label="订单作废" :value="-9" />
      </el-select>
      <el-select v-model="listQuery.queryParam.statusPayment" placeholder="支付状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未支付" :value="0" />
        <el-option label="预付定金" :value="1" />
        <el-option label="已支付" :value="9" />
        <el-option label="订单作废" :value="-9" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" border fit highlight-current-row>
        <el-table-column label="单据日期" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.billDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售单号" min-width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送单号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.deliveryNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="联系人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.contact }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收货地址" min-width="120" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.addr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="合计金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.itemAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="费用金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.expensesAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用预收" align="right">
          <template slot-scope="{row}">
            <span>{{ row.advPayAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现结金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.currPayAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="应收金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.receivableAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="箱数" align="right">
          <template slot-scope="{row}">
            <span>{{ row.numPackage }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'已审核':row.status==2?'已生成':'待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="配送状态" align="center">
          <template slot-scope="{row}">
            <span v-if="row.statusDelivery == 0">未配送</span>
            <span v-if="row.statusDelivery == 1">配送中</span>
            <span v-if="row.statusDelivery == 9">已完成</span>
            <span v-if="row.statusDelivery == -9">订单作废</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" align="center">
          <template slot-scope="{row}">
            <span v-if="row.statusPayment == 0">未支付</span>
            <span v-if="row.statusPayment == 1">预付定金</span>
            <span v-if="row.statusPayment == 9">已支付</span>
            <span v-if="row.statusPayment == -9">订单作废</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="{row}">
            <span v-if="row.status<=0" class="ctrl" @click="handleCompile(row)">编辑</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status>=1" class="ctrl" @click="handleScan(row)">查看</span>
            <span v-if="row.status<=0" class="ctrl" @click="handleCheck(row.id, row.billDate)">审核</span>
            <span v-if="row.status==0" class="ctrl del" @click="handleDel(row.id, row.billDate)">删除</span>
            <span v-if="row.status==1 && row.salesHeaderId" class="ctrl" @click="handleCreateBill(row.salesHeaderId)">查看销售订单</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" title="请选择出库单日期" :visible.sync="dialogFormVisible1" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" label="1">销售单日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible1 = false">取消</el-button>
        <el-button type="primary" @click="createBill">确定</el-button>
      </div>
    </el-dialog>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
  </div>
</template>
<script>
import { getDelivery, delDelivery, auditDelivery, buildDelivery, getAuditInfoByHeaderId, printByHeaderId } from '@/api/sale'
import staffList from '@/components/selects/staffList'
import Auditconfirm from '@/components/Auditconfirm/index'
import custList from '@/components/selects/custList'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
  name: 'Delivery',
  components: { staffList, custList, Pagination, Auditconfirm },
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
      total: 0,
      listLoading: true,
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      auditModalVisible: false,
      auditType: 'create',
      remarklist: [],
      curBillId: '',
      isBillDate: '0',
      curBillDate: '',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          billNo: '',
          status: '',
          custId: '',
          staffId: '',
          statusDelivery: '',
          statusPayment: ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId('/so/delivery', row.id, row.billDate).then(res => {
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
    getList() {
      this.listLoading = true
      getDelivery(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCheck(id, billDate) {
      this.auditType = 'create'
      this.auditModalVisible = true
      this.curBillId = id
      this.curBillDate = billDate
    },
    checkItem(obj) {
      const data = obj
      data.id = this.curBillId
      data.billDate = this.curBillDate
      auditDelivery(data).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.auditModalVisible = false
          this.$message.success('审核成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    selectChange(obj) {
      for (var key in obj) {
        this.listQuery.queryParam[key] = obj[key]
      }
    },
    handleCreateBill(id) {
      this.$router.push('/sale/orderDetail?id=' + id)
    },
    createBill() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId, billDate: this.curBillDate }
      buildDelivery(obj).then(res => {
        if (res.data.errorCode === '0') {
          this.dialogFormVisible1 = false
          this.getList()
          this.$message.success('生成出库单成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('生成失败，请稍后重试！')
      })
    },
    handleAdd() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/deliveryAdd')
    },
    handleCompile(row) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/deliveryModify?id=' + row.id + '&billDate=' + row.billDate)
    },
    handleScan(row) {
      this.$router.push('/sale/deliveryDetail?id=' + row.id + '&billDate=' + row.billDate)
    },
    handleDel(id, date) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id, date)
      })
    },
    delItem(id, date) {
      delDelivery(id, date).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.dialogFormVisible1 = false
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
