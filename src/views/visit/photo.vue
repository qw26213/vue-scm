<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-date-picker v-model="listQuery.queryParam.uploadDate1" :editable="false" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <span class="zhi">至</span>
      <el-date-picker v-model="listQuery.queryParam.uploadDate2" :editable="false" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
      <el-select v-model="listQuery.queryParam.labelName" style="width:145px" placeholder="业务标签" size="small">
          <el-option v-for="item in labellist" :label="item.labelName" :value="item.id" :key="item.id" />
      </el-select>
      <custList ctr-type="list" @selectChange="selectChange" />
      <staffList ctr-type="list" :select-id="listQuery.queryParam.staffId" @selectChange="selectChange" />
      <el-button size="small" type="primary" @click="getList">查询</el-button>
      <el-button v-if="total>1" size="small" type="danger" @click="delAnyItems">批量删除</el-button>
    </div>
    <div class="contentDiv">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="tableData"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        size="small"
        :default-sort="{prop: 'updateDate', order: this.listQuery.queryParam.desc==1 ?'descending': 'ascending'}"
        @selection-change="selectionChange"
        @sort-change="sortChange"
      >
        <el-table-column v-if="total>1" type="selection" width="55" align="center" />
        <el-table-column label="拜访日期" align="center">
          <template slot-scope="{row}">
            <span>{{ row.visitDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务员">
          <template slot-scope="{row}">
            <span>{{ row.staffName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户">
          <template slot-scope="{row}">
            <span>{{ row.custName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="业务标签" align="center">
          <template slot-scope="{row}">
            <span>{{ row.label }}</span>
          </template>
        </el-table-column>
        <el-table-column label="文件大小(KB)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.fileSizeCategory }}</span>
          </template>
        </el-table-column>
        <el-table-column label="上传时间" sortable="custom" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template slot-scope="{row}">
            <el-button class="ctrl" type="primary" size="small" @click="showImg(row)">查看图片</el-button>
            <el-button class="ctrl del" type="danger" size="small" @click="handleDel(row.id, row.visitDate )">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" width="720px" top="5%">
      <div class="imgWrap" :style="{backgroundImage:'url('+imgUrl+')'}" />
    </el-dialog>
  </div>
</template>
<script>
import { getCrmFileInfo, deleteFileById, deleteFileByIds } from '@/api/visit'
import { getLabel } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import { getNowDate } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
export default {
  name: 'visitPhoto',
  components: { Pagination, custList, staffList },
  filters: {
    Fixed: function(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    const end = getNowDate()
    const start = parseTime(new Date().getTime() - 86400000 * 7)
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      isBillDate: '0',
      dialogFormVisible: false,
      listLoading: true,
      imgUrl: '',
      visitIdArr: [],
      labellist: [],
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          uploadDate1: start,
          uploadDate2: end,
          labelName: '',
          headerId: this.$route.query.id,
          sign: 1,
          desc: 1
        }
      }
    }
  },
  created() {
    this.getList()
    getLabel().then(res => {
      this.labellist = res.data.data
    })
  },
  methods: {
    selectionChange(val) {
      const arr = []
      for (let i = 0; i < val.length; i++) {
        arr.push(val[i].id)
      }
      this.visitIdArr = arr
    },
    sortChange({ prop, order }) {
      var desc = order === 'descending' ? 1 : 0
      this.$set(this.listQuery.queryParam, 'desc', desc)
      this.getList()
    },
    getList() {
      this.listLoading = true
      getCrmFileInfo(this.listQuery).then(res => {
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
    showImg(obj) {
      this.dialogFormVisible = true
      this.imgUrl = obj.baseUrl + obj.fileUrl
    },
    handleDel(id, date) {
      this.$confirm('确定要删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFileById({ id: id, visitDate: date }).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功')
            this.getList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    },
    delAnyItems() {
      if (this.visitIdArr.length === 0) {
        this.$message.warning('请选择图片！')
        return
      }
      this.$confirm('确定要批量删除吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteFileByIds({ ids: this.visitIdArr.join(',') }).then(res => {
          if (res.data.success) {
            this.$message.success('删除成功')
            this.listQuery.pageIndex = 1
            this.getList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
<style scoped>
.imgWrap {
    width: 100%;
    height: 480px;
    background-color: rgba(0, 0, 0, 0.36);
    background-position: center center;
    background-size: contain;
    background-repeat: no-repeat;
}
</style>
