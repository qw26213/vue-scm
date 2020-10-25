<template>
  <div class="app-container" style="min-width:1216px">
    <div class="filterDiv">
      <el-select v-model="listQuery.queryParam.date1" placeholder="开始期间" size="small">
        <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
      <span class="zhi">至</span>
      <el-select v-model="listQuery.queryParam.date2" placeholder="结束期间" size="small">
        <el-option v-for="item in periodList" :key="item.id" :label="item.text" :value="item.id" />
      </el-select>
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
      <el-button size="small" type="primary" @click="muchVoucherCheck">批量审核</el-button>
      <el-button size="small" type="primary" @click="voucherBackCheck">批量反审核</el-button>
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
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell" style="width:max-content;min-width:100%">{{ item.longName }}</p>
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
            <span v-if="row.jeStatus == 0" class="ctrl" @click="handleCheck(row.id)">审核</span>
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
    <el-dialog :close-on-click-modal="false" title="请输入审核意见" :visible.sync="dialogFormVisible" width="420px">
      <el-form ref="dataForm" :rules="rules" :model="auditForm" label-position="top" label-width="100px" style="width: 380px; margin-left:10px;">
        <el-form-item label="审核意见" prop="content">
          <el-input v-model="auditForm.content" type="textarea" row="2" size="small" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible = false">取消审核</el-button>
        <el-button type="primary" @click="checkAccessItem(1)">审核通过</el-button>
        <el-button type="danger" @click="checkAccessItem(-1)">审核退回</el-button>
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
import { getPeriodList } from '@/api/user'
import { getVoucherAuditList, voucherAduit, unAudit, auditList } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'voucherAudit',
  components: { Pagination },
  filters: {
    jeStatusFor: function(status) {
      return status == 0 ? '制单完成' : status == -1 ? '退回' : status == 5 ? '审核通过' : status == 1 ? '一审通过' : status == 2 ? '二审通过' : status == 3 ? '三审通过' : '无'
    },
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    },
    catogeryNumberFor: function(num) {
      return num < 10 ? '00' + num : num < 100 ? '0' + num : num
    }
  },
  data() {
    return {
      periodList: [],
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
        content: ''
      },
      rules: {
        content: [{ required: true, message: '审核意见不能为空', trigger: 'change' }]
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
    this.$store.dispatch('voucher/getCoaList')
    getPeriodList().then(res => {
      this.periodList = res.data.data
    })
    this.getList()
  },
  methods: {
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
    handleCheck(id) {
      this.dialogFormVisible = true
      this.jeHeaderId = id
      this.initAudit()
    },
    checkAccessItem(status) {
      this.$refs.dataForm.validate((valid) => {
        if (valid) {
          var obj = { jeAuditRemark: this.auditForm.content, jeAuditStatus: status, jeHeaderId: this.jeHeaderId }
          this.checkItem(obj)
        } else {
          return false
        }
      })
    },
    checkItem(obj) {
      voucherAduit(obj).then(res => {
        this.dialogFormVisible = false
        if (res.data.success) {
          this.$message.success(res.data.msg)
        } else {
          this.$message.error(res.data.msg)
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
        } else {
          this.$message.error(res.data.msg)
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
        this.$refs['dataForm'].clearValidate()
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
<style scoped>
p.pCell {
    margin: 0;
    line-height: 32px;
}
</style>
