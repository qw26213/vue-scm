<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.invoiceDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.invoiceDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <el-input v-model="listQuery.invoiceNo" size="small" placeholder="发票号" style="width: 120px;" />
      <custList ctr-type="list" @selectChange="selectChange" />
      <el-select v-model="listQuery.queryParam.status" placeholder="发票状态" size="small">
        <el-option label="全部" :value="null" />
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
        <el-option label="已完成" :value="9" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" border fit highlight-current-row>
        <el-table-column label="发票日期" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.invoiceDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票号" min-width="120">
          <template slot-scope="{row}">
            <span>{{ row.invoiceNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户">
          <template slot-scope="{row}">
            <span>{{ row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="纳税人识别号" min-width="120">
          <template slot-scope="{row}">
            <span>{{ row.taxRegistrationCertificateNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开户行" width="100">
          <template slot-scope="{row}">
            <span>{{ row.bankName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账户">
          <template slot-scope="{row}">
            <span>{{ row.bankAccount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品金额">
          <template slot-scope="{row}">
            <span>{{ row.itemAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="税额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.taxAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价税合计" align="right">
          <template slot-scope="{row}">
            <span>{{ row.vatAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发票状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==0?'未审核':row.status==1?'已审核':row.status==9?'已完成':row.status==-1?'审核不通过':'已开发票作废' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="未开票余额" align="center">
          <template slot-scope="{row}">
            <span>{{ row.salesVatBalance }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" align="center" width="150">
          <template slot-scope="{row}">
            <span v-if="row.status<=0" class="ctrl" @click="handleCompile(row)">编辑</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status>=1" class="ctrl" @click="handleScan(row)">查看</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row.id, row.invoiceDate)">审核</span>
            <span v-if="row.status<=0" class="ctrl del" @click="handleDel(row.id, row.invoiceDate)">删除</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
  </div>
</template>
<script>
import { getInvoice, delInvoice, auditInvoice, printByHeaderId, getAuditInfoByHeaderId } from '@/api/sale'
import custList from '@/components/selects/custList'
import Auditconfirm from '@/components/Auditconfirm/index'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
  name: 'SaleData',
  components: { custList, Pagination, Auditconfirm },
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
      auditType: '',
      remarklist: [],
      curBillId: '',
      isinvoiceDate: '0',
      curInvoiceDate: '',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          invoiceDate1: getNowDate(),
          invoiceDate2: getNowDate(),
          invoiceNo: '',
          status: '',
          custId: ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId('/so/invoice', row.id, row.invoiceDate).then(res => {
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
      getInvoice(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleCheck(id, invoiceDate) {
      this.auditType = 'create'
      this.auditModalVisible = true
      this.curBillId = id
      this.curInvoiceDate = invoiceDate
    },
    checkItem(obj) {
      const data = obj
      data.id = this.curBillId
      data.invoiceDate = this.curInvoiceDate
      auditInvoice(data).then(res => {
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
    handleAdd() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/invoiceAdd')
    },
    handleCompile(row) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/invoiceModify?id=' + row.id + '&invoiceDate=' + row.invoiceDate)
    },
    handleScan(row) {
      this.$router.push('/sale/invoiceDetail?id=' + row.id + '&invoiceDate=' + row.invoiceDate)
    },
    handleCreateVouter(status, id1, id2, invoiceDate) {
      if (status !== 0) {
        this.$router.push('/voucher/add?id=' + id2)
      } else {
        this.curBillId = id1
        this.curInvoiceDate = invoiceDate
        this.dialogFormVisible2 = true
      }
    },
    handleDel(id, invoiceDate) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delInvoice(id, invoiceDate).then(res => {
          if (res.data.errorCode === '0') {
            this.getList()
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
