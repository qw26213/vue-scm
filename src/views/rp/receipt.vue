<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:130px" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" style="width:130px" />
      <el-input v-model="listQuery.queryParam.billNo" size="small" placeholder="单据号" />
      <custList ctr-type="list" @selectChange="selectChange" />
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
        <el-table-column label="序号" type="index" width="50" align="center" />
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
        <el-table-column label="收款金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.amount | fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'已审核':row.status==2?'已生成':'待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="核销状态" align="center">
          <template slot-scope="{row}">
            <span v-if="row.statusVerification === 0">无需核销</span>
            <span v-if="row.statusVerification === 1">待核销</span>
            <span v-if="row.statusVerification === 2">部分核销</span>
            <span v-if="row.statusVerification === 9">已核销</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <span class="ctrl" @click="handleCompile(row.id,row.status)">{{ row.status<=0?'编辑':'查看' }}</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row.id)">审核</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status<=0" class="ctrl del" @click="handleDel(row.id)">删除</span>
            <span v-if="row.status==1" class="ctrl" @click="handleCreateVouter(row.isJeHeader, row.id, row.jeHeaderId)">{{ row.isJeHeader==1?'查看':'生成' }}凭证</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" title="请选择凭证日期" :visible.sync="dialogFormVisible" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" label="1">收款日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="createVouter">确定</el-button>
      </div>
    </el-dialog>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
  </div>
</template>
<script>
import { getReceiptPayment, delReceiptPayment, auditReceiptPayment, buildReceiptPayment, getAuditInfoByHeaderId, printByHeaderId } from '@/api/rp'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
import custList from '@/components/selects/custList'
import { getNowDate } from '@/utils/auth'
import Auditconfirm from '@/components/Auditconfirm/index'
export default {
  name: 'ReceiptPayment',
  components: { custList, Pagination, Auditconfirm },
  filters: {
    fixed(val) {
      return !val ? 0 : Number(val).toFixed(2)
    }
  },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      dialogFormVisible: false,
      auditModalVisible: false,
      curBillId: '',
      isBillDate: '0',
      auditType: '',
      remarklist: [],
      total: 0,
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: '2020-01-01',
          billDate2: getNowDate(),
          billNo: '',
          crDr: '1',
          custId: '',
          supplierId: '',
          status: ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId(row.id).then(res => {
        if (res.data.errorCode == 0) {
          window.open('http://' + window.location.host + res.data.data)
        } else {
          this.$messae.warning('文件生成失败')
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
    selectChange(obj) {
      for (var key in obj) {
        this.listQuery.queryParam[key] = obj[key]
      }
    },
    getList() {
      this.listLoading = true
      getReceiptPayment(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(err => {
        this.listLoading = false
      })
    },
    handleCheck(id) {
      this.auditType = 'create'
      this.auditModalVisible = true
      this.curBillId = id
    },
    checkItem(obj) {
      const data = obj
      data.id = this.curBillId
      auditReceiptPayment(data).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.auditModalVisible = false
          this.$message.success('审核成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleCreateVouter(status, id1, id2) {
      if (status == 1) {
        this.$router.push('/voucher/add?id=' + id2)
      } else {
        this.curBillId = id1
        this.dialogFormVisible = true
      }
    },
    createVouter() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId }
      buildReceiptPayment(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.dialogFormVisible = false
          this.getList()
          this.$message.success('生成收款凭证成功！')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleAdd() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/rp/receiptAdd')
    },
    handleCompile(id, status) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.replace('/rp/receiptModify?id=' + id + '&status=' + status)
    },
    handleDel(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delReceiptPayment(id).then(res => {
          if (res.data.errorCode == 0) {
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
