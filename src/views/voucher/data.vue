<template>
  <div class="app-container" style="min-width:1100px">
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
        <el-option label="制单完成" value="0" />
        <el-option label="审核通过" value="5" />
        <el-option label="退回" value="-1" />
      </el-select>
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button size="small" type="primary" @click="resetVoucherSeq">整理凭证号</el-button>
      <el-button size="small" type="primary" icon="el-icon-printer" title="打印" @click="printVoucher" />
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit style="width: 100%;" size="small" cell-class-name="tpCell"
        :default-sort="{prop: 'jeSeq', order: this.listQuery.queryParam.desc==1 ?'descending': 'ascending'}"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="日期" align="center" width="100">
          <template slot-scope="{row}"> <span>{{ row.jeDate }}</span></template>
        </el-table-column>
        <el-table-column label="凭证字号" align="center" sortable="custom" prop="jeSeq" width="110">
          <template slot-scope="{row}"> <a href="javascript:" @click="handleCompile(row.id)">{{ row.jeCatogeryName }} - {{ row.jeSeq | jeSeqFormat }}</a></template>
        </el-table-column>
        <el-table-column label="摘要" min-width="120">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.summary }}</p>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="240">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell" style="width:max-content;min-width:100%">
              <el-tooltip placement="bottom">
                <p slot="content" style="margin:0;line-height:30px;height:30px">{{ item.longName }}</p>
                <span>{{ item.longName | preaddix }}</span>
              </el-tooltip>
            </p>
          </template>
        </el-table-column>
        <el-table-column label="借方金额" align="right">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.accountedDr | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="贷方金额" align="right">
          <template slot-scope="{row}">
            <p v-for="(item,index) in row.lineList" :key="index" clss="pCell">{{ item.accountedCr | Fixed }}</p>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="{row}"> <span>{{ row.jeStatus | jeStatusFor }}</span></template>
        </el-table-column>
        <el-table-column label="制单人" align="center">
          <template slot-scope="{row}"> <span>{{ row.sign1 }}</span></template>
        </el-table-column>
        <el-table-column label="审核人" align="center">
          <template slot-scope="{row}"> <span>{{ row.sign2 }}</span></template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="{row}">
            <span class="ctrl" @click="insertVoucher(row)">插入</span>
            <span class="ctrl" @click="handleCompile(row.id)">编辑</span>
            <span v-if="row.jeStatus==0" class="ctrl" @click="handleDel(row)">删除</span>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getVoucher, getVoucherById, delVoucher, printList, trimJeSeqByMap, getYearsById } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import { getNowMonth } from '@/utils/index'
export default {
  name: 'voucherData',
  components: { Pagination },
  filters: {
    preaddix: function(str) {
      return str && str.length > 30 ? str.substr(0, 30) + '...' : str
    },
    jeStatusFor: function(status) {
      return status === 0 ? '制单完成' : status === -1 ? '退回' : status === 5 ? '审核通过' : status === 1 ? '一审通过' : status === 2 ? '二审通过' : status === 3 ? '三审通过' : '无'
    },
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    },
    jeSeqFormat: function(num) {
      return num < 10 ? '00' + num : num < 100 ? '0' + num : num
    }
  },
  data() {
    return {
      startDateOptions: null,
      endDateOptions: null,
      periodList: [],
      tableKey: 0,
      tableData: [],
      voucherIdArr: [],
      total: 0,
      isBillDate: '0',
      dialogFormVisible: false,
      listLoading: true,
      curBillId: '',
      listQuery: {
        pageIndex: 1,
        pageNum: 10,
        queryParam: {
          date1: getNowMonth(),
          date2: getNowMonth(),
          startCoa: '',
          endCoa: '',
          jeStatus: '',
          voucherSeq: '',
          summary: '',
          desc: 1
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
    getYearsById().then(res => {
      const list = res.data.data
      const s = new Date(list[0]+'-01-01 00:00:00').getTime()
      const e = new Date(list[list.length - 1] + '-12-31 00:00:00').getTime()
      this.startDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
      this.endDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
    })
    this.getList()
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
    selectionChange(val) {
      const arr = []
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].id)
      }
      this.voucherIdArr = arr
    },
    sortChange({ prop, order }) {
      var desc = order === 'descending' ? 1 : 0
      this.$set(this.listQuery.queryParam, 'desc', desc)
      this.getList()
    },
    getList() {
      this.listLoading = true
      getVoucher(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum || 0
      }).catch(() => {
        this.listLoading = false
      })
    },
    insertVoucher(row) {
      sessionStorage.voucherId = row.id
      sessionStorage.voucherSeq = row.jeSeq
      sessionStorage.jeDate = row.jeDate
      sessionStorage.periodId = row.periodId
      sessionStorage.periodCode = row.periodCode
      sessionStorage.periodName = row.periodName
      sessionStorage.jeCatogeryId = row.jeCatogeryId
      sessionStorage.voucherFlag = 3 // 凭证插入标记符
      this.$router.push('/voucher/insert?id=' + row.id + '&type=2')
    },
    resetVoucherSeq() {
      const date1 = this.listQuery.queryParam.date1
      const date2 = this.listQuery.queryParam.date2
      this.$confirm('确定要整理凭证号吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        trimJeSeqByMap({ periodCode1: date1, periodCode2: date2 }).then(res => {
          if (res.data.success) {
            this.$message.success('整理凭证号成功')
            this.getList()
          }
        }).catch(() => {
          this.$message.success('请重新登录')
        })
      })
    },
    printVoucher() {
      if (this.voucherIdArr.length === 0) {
        this.$message.warning('请先选择凭证！')
        return
      }
      printList({ data: this.voucherIdArr }).then(res => {
        if (res.data.success) {
          window.open('http://' + window.location.host + res.data.data)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleCompile(id) {
      this.$store.dispatch('tagsView/delView', this.$route)
      const arr = this.tableData.map(it => {
        return it.id
      })
      this.$router.push('/voucher/modify?id=' + id + '&arr=' + arr.join(','))
    },
    handleDel(row) {
      let info = '确定要删除这个凭证吗？'
      const id = row.id
      const joinJeHeaderId = row.joinJeHeaderId
      if (joinJeHeaderId != null && joinJeHeaderId !== '') {
        getVoucherById({ id: joinJeHeaderId }).then(res => {
          if (res.success) {
            if (res.data.data !== null) {
              var header = res.data.data.header
              if (joinJeHeaderId !== null) {
                info = '该凭证存在关联成本凭证:<b>' + header.jeDate + ' ' + header.jeCatogery + '-' + (header.jeSeq, 4) + '</b>号凭证,确定要删除这个凭证吗(关联凭证一并删除)？'
              }
            }
            this.$confirm(info, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.delItem(id)
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      } else {
        this.$confirm(info, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delItem(id)
        })
      }
    },
    delItem(id) {
      delVoucher({ id: id }).then(res => {
        if (res.data.success) {
          this.$message.success('删除凭证成功')
          this.getList()
        } else {
          this.$message.error(res.data.msg)
        }
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
