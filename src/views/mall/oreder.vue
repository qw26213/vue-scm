<template>
  <div class="app-container">
    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
      <el-table-column label="商品名称" min-width="160">
        <template slot-scope="{row}">
          <span>{{row.custName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" min-width="200" align="center">
        <template slot-scope="{row}">
          <div class="itemUrl":style="{'background-image': 'url('+row.photoUrl+')'}"></div>
        </template>
      </el-table-column>
      <el-table-column label="规格" align="center">
        <template slot-scope="{row}">
          <span>{{row.custName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格(元)" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{row.custName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单位" align="center">
        <template slot-scope="{row}">
          <span>{{row.custName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="销量" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.custName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" min-width="100" align="center">
        <template slot-scope="{row}">
          <span>{{ row.custName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="toModify(row.id)">编辑</el-button>
          <el-button type="danger" size="mini" @click="toModify(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getOrderData } from '@/api/mall'
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
      getOrderData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    toDevice(id){
      this.$router.push('/deviceList?merchantId='+id);
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    toStore(id){
      this.$router.push('/merchantStores?id='+id+'&redirect='+this.$route.fullPath);
    },
    toModify(id){
      this.$router.push('/merchantModify?id='+id);
    },
    handleCreate() {
      this.$router.push('/merchantAdd');
    }
  }
}
</script>
<style scoped>
  .pointer{cursor: pointer;text-decoration: underline;}
  .itemUrl{width:180px; height:120px; background-color: #f1f1f1; border-radius: 4px; border:1px #e5e5e5 solid;background-repeat: no-repeat; background-size: cover; background-position: center; display: inline-block;}
</style>
