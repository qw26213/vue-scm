<template>
  <div class="app-container">
    <div style="margin-bottom:15px;float:right;">
      <el-button type="primary" size="small" @click="handAdd">新增明细</el-button>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="商品名称" min-width="160">
        <template slot-scope="{row}">
          <span>{{ row.itemName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" min-width="200" align="center">
        <template slot-scope="{row}">
          <div class="itemUrl":style="{'background-image': 'url(' + row.fileUrl + ')'}"></div>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center">
        <template slot-scope="{row}">
          <span>{{ row.norms }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单价(元)" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.price1 }}</span>
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
          <el-button type="default" size="mini" @click="toModify(row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :close-on-click-modal="false" title="选择商品" :visible.sync="dialogFormVisible" width="540px">
        <el-table :data="itemData" border fit highlight-current-row style="width: 100%;margin-bottom:10px" size="mini" cell-class-name="trCell">
            <el-table-column label="商品名称" width="150" align="center">
                <template slot-scope="{row}">
                    <span>{{row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品代码" width="120" align="center">
                <template slot-scope="{row}">
                    <span>{{row.itemCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="规格" width="140" align="center">
                <template slot-scope="{row}">
                    <span>{{row.norms}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button class="filter-item" type="primary" size="mini" @click="selectGood(row.id)">选择</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>10" :total="total" :page.sync="itemQuery.pageIndex" layout="prev, pager, next" :limit.sync="itemQuery.pageNum" @pagination="getItemData" />
    </el-dialog>
  </div>
</template>
<script>
import { getGoodsDetailData, delGoodsDetailById } from '@/api/mall'
import { getItem } from '@/api/basedata'
import Pagination from '@/components/Pagination'
export default {
  name: 'merchantList',
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      itemData: [],
      tableData: null,
      total: 0,
      listLoading: false,
      dialogFormVisible: false,
      listQuery: {
        headerId: this.$route.query.id
      },
      itemQuery: {
          headId: this.$route.query.id
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
      getGoodsDetailData(this.listQuery).then(response => {
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
    toDeline(id) {
      this.$router.push('/mall/deline?id='+id)
    },
    handAdd() {
      this.dialogFormVisible = true
    },
    selectGood(id) {
      this.$router.push('/mall/addgood?item_id='+id)
    },
    handleDelete(id) {
        this.$confirm("确认删除吗？", '提示', {
            confirmButtonText: '确定',
            closeOnClickModal: false,
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            delGoodsDetailById({ id: row.id }).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success('商品删除成功')
                    this.getTabsData()
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        })
    },
    toModify(id) {
      this.$router.push('/mall/addgood?id=' + id)
    }
  }
}
</script>
<style scoped>
  .pointer{cursor: pointer;text-decoration: underline;}
  .itemUrl{width:180px; height:120px; background-color: #f1f1f1; border-radius: 4px; border:1px #e5e5e5 solid;background-repeat: no-repeat; background-size: cover; background-position: center; display: inline-block;}
</style>
