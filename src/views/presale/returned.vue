<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <span class="zhi">至</span>
      <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
      <custList @selectChange="selectChange"></custList>
      <staffList @selectChange="selectChange" ctrType="list"></staffList>
      <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="mini">
        <el-option label="全部" value="null"></el-option>
        <el-option label="未审核" value="0"></el-option>
        <el-option label="已审核" value="1"></el-option>
      </el-select>
      <el-select v-model="listQuery.queryParam.isJeHeader" placeholder="凭证状态" size="mini">
        <el-option label="全部" value="null"></el-option>
        <el-option label="未生成凭证" value="0"></el-option>
        <el-option label="已生成凭证" value="1"></el-option>
      </el-select>
      <el-button size="mini" type="primary" @click="getList">查询</el-button>
      <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
      <el-table-column label="序号" type="index" width="50" align="center">
      </el-table-column>
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
      <el-table-column label="有效日期" align="center">
        <template slot-scope="{row}">
          <span>{{row.expirationDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="金额" align="right">
        <template slot-scope="{row}">
          <span>{{row.beginBalance|Fixed}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{row.status==1?'已审核':row.status==2?'已生成':'待审核'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="{row}">
          <span>{{row.remarks}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <template slot-scope="{row}">
          <span class="ctrl" @click="handleScan(row.id,1)">查看</span>
          <span class="ctrl" v-if="row.status==0" @click="handleDel(row.id)">删除</span>
          <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
          <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId)">{{row.isJeHeader==1?'查看':'生成'}}预收退款凭证</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    <el-dialog :close-on-click-modal="false" title="请选择凭证日期" :visible.sync="dialogFormVisible" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" label="1">预收单日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
          <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="createVouter">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getPresaleReturned,delPresaleReturned,auditPresaleReturned,buildPresaleReturnedVoucher} from '@/api/store'
import Pagination from '@/components/Pagination' 
import staffList from '@/components/selects/staffList';
import supplierList from '@/components/selects/supplierList';
import custList from '@/components/selects/custList';
import { getNowDate } from '@/utils/auth'
export default {
  name: 'presaleReturnedData',
  components: { Pagination, staffList, custList, supplierList },
  data() {
    return {
      tableKey: 0,
      tableData: [],
      total: 0,
      isBillDate:'0',
      dialogFormVisible:false,
      listLoading: true,
      curBillId:'',
      listQuery: {
        pageIndex: 1,
        pageNum: 20,
        queryParam: {
          billDate1: getNowDate(),
          billDate2: getNowDate(),
          billNo:"",
          staffId:'',
          custId:'',
          status:'',
          isJeHeader:''
        }
      }
    }
  },
  filters: {
      Fixed: function(num) {
          if (!num) { return '0.00' }
          return parseFloat(num).toFixed(2);
      }
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true
      getPresaleReturned(this.listQuery).then(res => {
        this.listLoading = false
        this.tableData = res.data.data
        this.total = res.data.totalNum
      }).catch(err=>{
        this.listLoading = false
      })
    },
    selectChange(obj) {
        for (var key in obj) {
            this.listQuery.queryParam[key] = obj[key];
        }
    },
    changeVal(){
      
    },
    handleCheck(id){
      this.$confirm('确定审核通过吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.checkItem(id)
      }).catch(()=>{
                console.log('取消')
            });
    },
    checkItem(id){
      auditPresaleReturned(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.$message.success('审核成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    },
    handleCreateVouter(status,id1,id2){
      if(status==1){
        alert('查看预收退款凭证')
      }else{
        this.curBillId = id1
        this.dialogFormVisible = true
      }
    },
    createVouter(){
      var obj = {isBillDate:this.isBillDate,id:this.curBillId}
      buildPresaleReturnedVoucher(obj).then(res => {
        if(res.data.errorCode==0){
          this.dialogFormVisible = false;
          this.getList();
          this.$message.success('生成预收退款凭证成功！')
        }else{
          this.$message.error(res.data.msg)
        }
      });
    },
    handleAdd(obj) {
      this.$store.dispatch('tagsView/delView', this.$route);
      this.$router.push('/presale/returnedAdd')
    },
    handleScan(id) {
      this.$router.push('/presale/returnedDetail?id='+id)
    },
    handleDel(id){
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      });
    },
    delItem(id) {
      delPresaleReturned(id).then(res => {
        if(res.data.errorCode==0){
          this.getList();
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        }else{
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
