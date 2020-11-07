<template>
  <div class="app-container">
    <div class="filterDiv clearfix">
      <el-button type="primary" size="small" style="float:right;" @click="handAdd">新增商品</el-button>
    </div>
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="商品名称" min-width="160">
          <template slot-scope="{row}">
            <span>{{ row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" min-width="200" align="center">
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
        <el-table-column label="特性(口味)" align="center">
          <template slot-scope="{row}">
            <span>{{ row.def1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单价(元)" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.price1 | Fixed }}~{{ row.price2 | Fixed }}</span>
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
        <el-table-column label="操作" align="center" width="230">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="toModify(row.id)">编辑</el-button>
            <el-button type="text" size="small" @click="toDeline(row)">明细管理</el-button>
            <el-button type="text" size="small" @click="handleDelete(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total>10" :total="total" :page.sync="itemQuery.pageIndex" layout="prev, pager, next" :limit.sync="itemQuery.pageNum" @pagination="getItemData" />
    </div>
    <el-dialog :close-on-click-modal="false" title="选择商品" :visible.sync="dialogFormVisible" width="640px">
      <el-table :data="itemData" border fit highlight-current-row style="width: 100%;margin-bottom:10px" size="small" cell-class-name="trCell">
        <el-table-column label="商品名称" min-width="150" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span>{{ row.itemName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="商品代码" width="120" align="center">
          <template slot-scope="{row}">
            <span>{{ row.itemCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="140" align="center">
          <template slot-scope="{row}">
            <span>{{ row.norms }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <el-button class="filter-item" type="primary" size="small" @click="selectGood(row.id)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsData, delGoodsById } from '@/api/mall'
import { getItem } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import nullImg from '@/assets/null.png'
export default {
  name: 'goodlist',
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
      itemData: [],
      tableData: null,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 100
      },
      itemQuery: {
        pageIndex: 1,
        pageNum: 10,
        queryParam: { itemCode: '', itemName: '' }
      }
    }
  },
  created() {
    this.getList()
    this.getItemData()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGoodsData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    getItemData() {
      getItem(this.itemQuery).then(res => {
        this.itemData = res.data.data || []
        this.total = res.data.totalNum
      })
    },
    toDeline(row) {
      this.$router.push('/mall/deline?id=' + row.id + '&item_id=' + row.itemId)
    },
    handAdd() {
      this.dialogFormVisible = true
    },
    selectGood(id) {
      this.dialogFormVisible = false
      this.$router.push('/mall/addgood?item_id=' + id)
    },
    handleDelete(id) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delGoodsById({ id }).then(res => {
          if (res.data.errorCode == 0) {
            this.$message.success('商品删除成功')
            this.getList()
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    toModify(id) {
      this.$router.push('/mall/modifygood?id=' + id)
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
