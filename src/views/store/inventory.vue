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
        <el-option label="未审核" :value="0" />
        <el-option label="已审核" :value="1" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" border fit highlight-current-row>
        <el-table-column label="单据日期" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.billDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单据号">
          <template slot-scope="{row}">
            <span>{{ row.billNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员">
          <template slot-scope="{row}">
            <span>{{ row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="仓库">
          <template slot-scope="{row}">
            <span>{{ row.warehouseName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成本金额" align="center">
          <template slot-scope="{row}">
            <span>{{ row.wmapAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品金额" width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.itemAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="运费" align="right">
          <template slot-scope="{row}">
            <span>{{ row.freightAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="金额合计" align="right">
          <template slot-scope="{row}">
            <span>{{ row.sumAmount|Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="价税合计" align="right">
          <template slot-scope="{row}">
            <span>{{ row.itemAmount|Fixed }}</span>
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
            <span v-if="row.status>=1" class="ctrl" @click="handleScan(row.id)">查看</span>
            <span v-if="row.status==0" class="ctrl" @click="handleCheck(row.id)">审核</span>
            <span v-if="row.status<=0" class="ctrl del" @click="handleDel(row.id)">删除</span>
            <span v-if="row.status==1" class="ctrl" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId)">{{ !row.isJeHeader?'生成':'查看' }}盘点凭证</span>
            <span class="ctrl" @click="printBill(row)">打印</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" title="请选择凭证日期" :visible.sync="dialogFormVisible2" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" label="1">进货单日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="createVouter">确定</el-button>
      </div>
    </el-dialog>
    <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
  </div>
</template>
<script>
import { getInventory, delInventory, auditInventory, buildInventoryVoucher, getAuditInfoByHeaderId, printByHeaderId } from '@/api/sale'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import Auditconfirm from '@/components/Auditconfirm/index'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
  name: 'Inventory',
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
      auditType: '',
      remarklist: [],
      curBillId: '',
      isBillDate: '0',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          billNo: '',
          status: '',
          custId: '',
          staffId: ''
        }
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    printBill(row) {
      printByHeaderId('/ic/inventory', row.id).then(res => {
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
      getInventory(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(() => {
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
      auditInventory(data).then(res => {
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
    handleCreateVouter(status, id1, id2) {
      if (status === 1) {
        this.$router.push('/voucher/add?id=' + id2)
      } else {
        this.curBillId = id1
        this.dialogFormVisible2 = true
      }
    },
    createVouter() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId }
      buildInventoryVoucher(obj).then(res => {
        if (res.data.errorCode === '0') {
          this.dialogFormVisible2 = false
          this.getList()
          this.$message.success('生成盘点凭证成功！')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleAdd() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/inventoryAdd')
    },
    handleCompile(id) {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push('/store/inventoryModify?id=' + id)
    },
    handleScan(id) {
      this.$router.push('/store/inventoryDetail?id=' + id)
    },
    handleDel(id) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      })
    },
    delItem(id) {
      delInventory(id).then(res => {
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
