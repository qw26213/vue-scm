<template>
  <div>
    <el-dialog :close-on-click-modal="false" title="请选择预收单" :visible.sync="modalTableVisible" width="720px">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
          <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
          <el-table-column label="单据日期" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{row.billDate}}</span>
            </template>
          </el-table-column>
          <el-table-column label="单据号" width="100">
            <template slot-scope="{row}">
              <span>{{row.billNo}}</span>
            </template>
          </el-table-column>
          <el-table-column label="客户">
            <template slot-scope="{row}">
              <span>{{row.custName}}</span>
            </template>
          </el-table-column>
          <el-table-column label="预收类型" align="center">
            <template slot-scope="{row}">
              <span>{{row.presaleType==0?'按钱':row.presaleType==1?'按商品':'按品类'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" align="right">
            <template slot-scope="{row}">
              <span>{{row.beginBalance|Fixed}}</span>
            </template>
          </el-table-column>
          <el-table-column label="余额" align="right">
            <template slot-scope="{row}">
              <span>{{row.balance|Fixed}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleSelect(row.id)">选择</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </el-dialog>
  </div>
</template>

<script>
import { getPresale} from '@/api/store'
import Pagination from '@/components/Pagination' 
export default {
  components: { Pagination },
  props: ['modalTableVisible'],
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      isBillDate:'0',
      listLoading: true,
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          date1: '2019-01-01',
          date2: '2020-03-01',
          billNo:"",
          staffId:'',
          custId:'',
          status:'',
          isJeHeader:'',
          nonZeroBalance:0
        }
      }
    }
  },
  watch:{
    'modalTableVisible'(val){
      if(val){
        this.getList();
      }
    }
  },
  filters: {
      Fixed: function(num) {
          if (!num) { return '0.00' }
          return parseFloat(num).toFixed(2);
      }
  },
  methods: {
    getList() {
      this.listLoading = true
      getPresale(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
      }).catch(err=>{
        this.listLoading = false
      })
    },
    handleSelect(id){
      this.$parent.modalTableVisible = false
      console.log(id)
      this.$parent.initTableData(id)
    },
    buildReturnedItem(id){
      buildReturnedBill(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('生成退款单成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
  
</style>