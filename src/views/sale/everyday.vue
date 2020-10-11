<template>
  <div class="app-container">
    <div class="filterDiv">
      <span class="label">截止日期</span>
      <el-date-picker v-model="listQuery.queryParam.billDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.billDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <staffList ctr-type="list" @selectChange="selectChange" />
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
        <el-table-column label="单据日期" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.billDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据号" width="100">
          <template slot-scope="{row}">
            <span>{{ row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销售单数" align="center">
          <template slot-scope="{row}">
            <span>{{ row.soBillNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.beginDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.endDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始余额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.beginBalance|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="交款金额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.settleCurrAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="余额" align="right">
          <template slot-scope="{row}">
            <span>{{ row.balance|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="现金合计" align="right">
          <template slot-scope="{row}">
            <span>{{ row.sumCurrAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.status==1?'已审核':row.status==2?'已生成':'待审核' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200">
          <template slot-scope="{row}">
            <span v-if="row.status<=0" class="ctrl" @click="handleCompile(row.id)">编辑</span>
            <span v-if="row.status==-1" class="ctrl" @click="showAuditInfo(row.id)">查看审核意见</span>
            <span v-if="row.status==-2" class="ctrl" @click="showConfirmInfo(row.id)">查看确认意见</span>
            <span v-if="row.status==1" class="ctrl" @click="handleScan(row.id)">查看</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row.id)">审核</span>
            <span v-if="row.status==1" class="ctrl" @click="handleConfirm(row.id)">确认</span>
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
import { getEverydayTotal, delEverydayTotal, auditEverydayTotal, confirmEverydayTotal, getAuditInfoByHeaderId, getConfirmInfoByHeaderId, printByHeaderId } from '@/api/sale'
import Pagination from '@/components/Pagination'
import staffList from '@/components/selects/staffList'
import Auditconfirm from '@/components/Auditconfirm/index'
import Confirmconfirm from '@/components/Confirmconfirm/index'
import { getNowDate } from '@/utils/auth'
export default {
  name: 'EverydayTotalData',
  components: { Pagination, staffList, Auditconfirm, Confirmconfirm },
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
      isBillDate: '0',
      dialogFormVisible: false,
      auditModalVisible: false,
      listLoading: true,
      auditType: '',
      remarklist: [],
      confirmModalVisible: false,
      confirmType: '',
      remarklist1: [],
      curBillId: '',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          billNo: '',
          staffId: '',
          custId: '',
          status: '',
          isJeHeader: '',
          nonZeroBalance: 0
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId('/so/everydayTotal', row.id, row.billDate).then(res => {
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
    showConfirmInfo(id) {
      this.confirmType = 'record'
      getConfirmInfoByHeaderId(id).then(res => {
        if (res.data.errorCode === '0') {
          this.confirmModalVisible = true
          this.remarklist1 = res.data.data || []
        }
      })
    },
    getList() {
      this.listLoading = true
      getEverydayTotal(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(() => {
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
      auditEverydayTotal(data).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.auditModalVisible = false
          this.$message.success('审核成功')
        } else {
          this.$message.warning(res.data.msg)
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
      confirmEverydayTotal(data).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.confirmModalVisible = false
          this.$message.success('确认成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleAdd(obj) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/everydayAdd')
    },
    handleCompile(id) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/sale/everydayModify?id=' + id)
    },
    handleDel(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      })
    },
    delItem(id) {
      delEverydayTotal(id).then(res => {
        if (res.data.errorCode === '0') {
          this.getList()
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    }
  }
}
</script>
