<template>
  <div class="app-container" style="min-width:1216px">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.date1" size="small" :picker-options="startDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="开始月份" @change="pickerChange" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.date2" size="small" :picker-options="endDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="结束月份" />
      <el-select v-model="listQuery.queryParam.startCoa" placeholder="开始科目" size="small">
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.queryParam.endCoa" placeholder="结束科目" size="small">
        <el-option v-for="item in coaArr" :key="item.id" :label="item.name" :value="item.coaCode" />
      </el-select>
      <el-input v-model="listQuery.queryParam.voucherSeq" size="small" placeholder="凭证号" style="width: 120px;" />
      <el-input v-model="listQuery.queryParam.summary" size="small" placeholder="摘要" style="width: 120px;" />
      <el-select v-model="listQuery.queryParam.jeStatus" placeholder="状态" size="small">
        <el-option label="全部状态" value="" />
        <el-option label="制单完成" :value="0" />
        <el-option label="审核通过" :value="5" />
        <el-option label="退回" :value="-1" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="muchVoucherCheck">审核</el-button>
      <el-button size="small" type="primary" @click="voucherBackCheck">反审核</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit style="width: 100%;" size="small" cell-class-name="tpCell" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日期" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.jeDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="凭证字号" align="center">
          <template slot-scope="{row}">
            <a href="javascript:" @click="handleCompile(row.id)">{{ row.jeCatogeryName }}-{{ row.jeSeq | jeSeqFormat }}</a>
          </template>
        </el-table-column>
        <el-table-column label="摘要" min-width="120">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.summary }}</p>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="200">
          <template slot-scope="{row}">
            <div v-for="(item,index) in row.lineList" :key="index" clss="pCell" style="width:max-content;min-width:100%">
              <el-tooltip placement="bottom">
                <div slot="content">{{ item.longName }}</div>
                <span>{{ item.longName | preaddix }}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="借方金额" align="right">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.accountedDr|Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" align="right">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.accountedCr|Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}">
            <span>{{ row.jeStatus | jeStatusFor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="制单人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sign1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核人" align="center">
          <template slot-scope="{row}">
            <span>{{ row.sign2 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <span v-if="row.jeStatus == 0" class="ctrl" @click="handleAudit(row.id)">审核</span>
            <span v-if="row.jeStatus == -1">已退回</span>
            <span v-if="row.jeStatus == 5" class="ctrl" @click="handleUnCheck(row.id)">反审核</span>
          </template>
        </el-table-column>
        <el-table-column label="审核记录" align="center" width="100">
          <template slot-scope="{row}">
            <span class="ctrl" @click="showAudit(row.id)">查看</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" title="审核凭证" :visible.sync="dialogFormVisible" width="460px">
      <el-form ref="auditform" class="auditform" :rules="rules" :model="auditForm" label-position="right" label-width="80px" style="width: 400px; margin-left:10px;">
        <el-form-item label="审核结果" prop="status">
          <el-radio v-model="auditForm.status" :label="1">通过</el-radio>
          <el-radio v-model="auditForm.status" :label="-1">退回</el-radio>
        </el-form-item>
        <el-form-item label="审核意见" prop="content" :rules="auditForm.status == -1 ? [{ required: true, message: '不能为空', trigger: 'change' }] : [{ required: false }]">
          <el-input v-model="auditForm.content" type="textarea" row="3" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="auditItem()">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="审核记录" empty-text="暂无审核记录" :visible.sync="dialogFormVisible1" width="600px" style="overflow:auto">
      <el-table :key="tableKey" :data="tableData1" border fit style="width: 100%;" size="small">
        <el-table-column label="审核人" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.jeAuditorName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" align="center" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.jeAuditRemark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核日期" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.jeAuditDate }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getVoucherAuditList, voucherAduit, unAudit, auditList, getYearsById } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'voucherAudit',
  components: { Pagination },
  filters: {
    preaddix: function(str) {
      return str && str.length > 30 ? str.substr(0, 30) + '...' : str
    },
    jeStatusFor: function(status) {
      return status == 0 ? '制单完成' : status == -1 ? '退回' : status == 5 ? '审核通过' : status == 1 ? '一审通过' : status == 2 ? '二审通过' : status == 3 ? '三审通过' : '无'
    },
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    },
    catogeryNumberFor: function(num) {
      return num < 10 ? '00' + num : num < 100 ? '0' + num : num
    },
    jeSeqFormat: function(num) {
      return num < 10 ? '00' + num : num < 100 ? '0' + num : num
    }
  },
  data() {
    return {
      startDateOptions: null,
      endDateOptions: null,
      jeHeaderId: '',
      tableKey: 0,
      tableData: [],
      voucherIdArr: [],
      total: 0,
      isBillDate: '0',
      dialogFormVisible: false,
      dialogFormVisible1: false,
      tableData1: [],
      listLoading: true,
      auditForm: {
        status: 1,
        content: ''
      },
      rules: {
        content: [{ required: false, message: '审核意见不能为空', trigger: 'change' }]
      },
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          date1: getNowMonth(),
          date2: getNowMonth(),
          startCoa: '',
          endCoa: '',
          jeStatus: '',
          voucherSeq: '',
          summary: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'coaArr'
    ])
  },
  created() {
    this.$store.dispatch('voucher/getCoaList', 0)
    this.getList()
    getYearsById().then(res => {
      const list = res.data.data
      const s = new Date(list[0]+'-01-01 00:00:00').getTime()
      const e = new Date(list[list.length - 1] + '-12-31 00:00:00').getTime()
      this.startDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
      this.endDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
    })
  },
  methods: {
    pickerChange() {
      const startDate = this.listQuery.queryParam.date1 + '-01 00:00:00'
      const endDate = startDate.substr(0, 4) + '-12-31 00:00:00'
      this.endDateOptions = { disabledDate: (time) => time.getTime() < new Date(startDate) || time.getTime() > new Date(endDate) }
      const dateTime2 = new Date(this.listQuery.queryParam.date2+'-01 00:00:00').getTime()
      if (dateTime2 <= new Date(startDate).getTime() || dateTime2 >= new Date(endDate).getTime()) {
          this.$set(this.listQuery.queryParam, 'date2', startDate.substr(0, 4) + '-12')
      } 
    },
    handleCompile(id) {
      this.$store.dispatch('tagsView/delView', this.$route)
      const arr = this.tableData.map(it => {
        return it.id
      })
      this.$router.push('/voucher/modify?id=' + id + '&arr=' + arr.join(','))
    },
    handleSelectionChange(val) {
      const arr = []
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].id)
      }
      this.voucherIdArr = arr
    },
    getList() {
      this.listLoading = true
      getVoucherAuditList(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(() => {
        this.listLoading = false
      })
    },
    handleAudit(id) {
      this.dialogFormVisible = true
      this.auditForm.status = 1
      this.jeHeaderId = id
      this.initAudit()
    },
    auditItem() {
      this.$refs.auditform.validate((valid) => {
        if (valid) {
          var obj = { jeAuditRemark: this.auditForm.content, jeAuditStatus: this.auditForm.status, jeHeaderId: this.jeHeaderId }
          voucherAduit(obj).then(res => {
            this.dialogFormVisible = false
            if (res.data.success) {
              this.$message.success(res.data.msg)
            }
          })
        } else {
          return false
        }
      })
    },
    handleUnCheck(id) {
      this.$confirm('确定反审核通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.unCheckItems([id])
      })
    },
    unCheckItems(arr) {
      unAudit({ ids: arr }).then(res => {
        if (res.data.success) {
          this.$message.success('反审核成功')
        }
      })
    },
    voucherBackCheck() {
      if (this.voucherIdArr.length == 0) {
        this.$message.warning('请先选择凭证！')
        return
      }
      this.unCheckItems(this.voucherIdArr)
    },
    muchVoucherCheck() {
      if (this.voucherIdArr.length === 0) {
        this.$message.warning('请先选择凭证！')
        return
      }
      this.initAudit()
      this.jeHeaderId = this.voucherIdArr.join(',')
      this.dialogFormVisible = true
    },
    initAudit() {
      this.auditForm.content = ''
      this.$nextTick(() => {
        this.$refs['auditform'].clearValidate()
      })
    },
    showAudit(id) {
      auditList({ jeHeaderId: id }).then(res => {
        this.dialogFormVisible1 = true
        this.tableData1 = res.data.data || []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
p.pCell {
    margin: 0;
    line-height: 32px;
}
</style>
