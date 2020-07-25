<template>
  <div class="app-container">
    <div style="margin-bottom:15px;float:right;">
      <el-button type="primary" size="small" @click="addGood">新增商品</el-button>
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
          <div class="itemUrl":style="{'background-image': 'url('+row.photoUrl+')'}"></div>
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
          <el-button type="primary" size="mini" @click="toModify(row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getGoodsData, delGoodsById } from '@/api/mall'
export default {
  name: 'merchantList',
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: false,
      listQuery: {
        page: 1,
        pageSize:100
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getGoodsData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    addGood() {
      this.$router.push('/mall/addgood')
    },
    handleDelete(id) {
        this.$confirm("确认删除吗？", '提示', {
            confirmButtonText: '确定',
            closeOnClickModal: false,
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            delGoodsById({ id: row.id }).then(res => {
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
