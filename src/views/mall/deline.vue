<template>
  <div class="app-container">
    <div class="filterDiv clearfix">
      <el-button type="primary" size="small" style="float:right;" @click="handAdd">新增商品明细</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="商品明细名称" min-width="160">
          <template slot-scope="{row}">
            <span>{{ row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品明细图片" min-width="200" align="center">
          <template slot-scope="{row}">
            <div v-if="row.fileUrl" class="itemUrl" :style="{'background-image': 'url(' + row.fileUrl + ')'}" />
            <div v-else class="itemUrl" :style="{'background-image': 'url(' + nullImg + ')'}" />
          </template>
        </el-table-column>
        <el-table-column label="规格" align="center">
          <template slot-scope="{row}">
            <span>{{ row.norms }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.price | Fixed }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单位" align="center">
          <template slot-scope="{row}">
            <span>{{ row.uom }}</span>
          </template>
        </el-table-column>
        <el-table-column label="销量" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.soldQty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.remainingQty }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="160">
          <template slot-scope="{row}">
            <el-button type="text" @click="toModify(row.id)">编辑</el-button>
            <el-button type="text" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getGoodsDetailData, delGoodsDetailById } from '@/api/mall'
import { getItem } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import nullImg from '@/assets/null.png'
export default {
  name: 'goodDeline',
  components: { Pagination },
  filters: {
    Fixed(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      nullImg: nullImg,
      tableKey: 0,
      tableData: null,
      listLoading: false,
      listQuery: {
        headerId: this.$route.query.id
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGoodsDetailData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    handAdd() {
      this.$router.push('/mall/addgoodline?item_id=' + this.$route.query.item_id + '&header_id=' + this.listQuery.headerId)
    },
    handleDelete(id) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsDetailById({ id: row.id }).then(res => {
          if (res.data.errorCode === '0') {
            this.$message.success('商品明细删除成功')
            this.getList()
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    toModify(id) {
      this.$router.push('/mall/addgoodline?item_id=' + this.$route.query.item_id + '&id=' + id + '&header_id=' + this.listQuery.headerId)
    }
  }
}
</script>
<style scoped>
.pointer {
    cursor: pointer;
    text-decoration: underline;
}

.itemUrl {
    width: 180px;
    height: 120px;
    background-color: #f1f1f1;
    border-radius: 4px;
    border: 1px #e5e5e5 solid;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: inline-block;
}
</style>
