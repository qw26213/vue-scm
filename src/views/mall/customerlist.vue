<template>
  <div class="app-container">
    <div class="contentDiv">
      <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="序号" type="index" width="50" align="center" />
        <el-table-column label="客户" min-width="120">
          <template slot-scope="{row}">
            <img class="itemUrl" :src="row.avatarUrl">
            <span>{{ row.nickName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center">
          <template slot-scope="{row}">
            <span>{{ row.gender==1?'男':row.gener==2?'女':'未知' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="注册地" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.province }}{{ row.city }}{{ row.district }}</span>
          </template>
        </el-table-column>
        <el-table-column label="我的分享码" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.myShareCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="分享者码" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.shareCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="showDetail(row.id)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" title="客户详情" :visible.sync="dialogFormVisible" width="600px">
      <div ref="dataForm" style="width:100%;">
        <div>客户信息</div>
        <div class="info" style="width:100%">
          <label style="margin-right:10px">客户名称:</label>{{ customerInfo.nickName }}</div>
        <div class="info" style="width:100%">
          <label style="margin-right:10px">联系电话:</label>{{ customerInfo.tel }}</div>
        <div style="margin-top:20px">地址信息</div>
        <div v-for="(item,index) in customerInfo.addrLine" :key="index">
          <div class="info">
            <label>收货人：</label><span>{{ item.contact }}</span><span>({{ item.tel }})</span><span v-if="item.isDefault == 1" style="margin-left:15px">(默认)</span></div>
          <div class="info">
            <label>地址：</label>{{ item.province }}{{ item.city }}{{ item.district }}{{ item.addr }}</div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCustomerData, getCustomerById } from '@/api/mall'
export default {
  name: 'MerchantList',
  data() {
    return {
      tableKey: 0,
      tableData: null,
      total: 0,
      listLoading: false,
      customerInfo: {},
      dialogFormVisible: false,
      listQuery: {
        page: 1,
        pageSize: 100
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getCustomerData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    showDetail(id) {
      this.dialogFormVisible = true
      getCustomerById({ id: id }).then(res => {
        this.customerInfo = res.data.data || {}
      })
    },
    handleCreate() {
      this.$router.push('/merchantAdd')
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
    width: 48px;
    height: 48px;
    border: 1px #e5e5e5 solid;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
    border-radius: 50%
}

.info {
    line-height: 28px
}
</style>
