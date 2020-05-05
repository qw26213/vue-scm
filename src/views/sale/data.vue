<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.date2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input size="mini" v-model="listQuery.billNo" placeholder="单据号" style="width: 120px;" />
            <custList @selectChange="selectChange" ctrType="list"></custList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.queryParam.staffId"></staffList>
            <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="mini">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未审核" value="0"></el-option>
                <el-option label="已审核" value="1"></el-option>
                <el-option label="已生成" value="2"></el-option>
            </el-select>
            <el-select v-model="listQuery.queryParam.isOutboundOrder" placeholder="出库单状态" size="mini">
                <el-option label="全部" value="null"></el-option>
                <el-option label="未生成出库单" value="0"></el-option>
                <el-option label="已生成出库单" value="1"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
            <el-button size="mini" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="单据日期" align="center" width="120">
                <template slot-scope="{row}">
                    <span>{{row.billDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="单据号">
                <template slot-scope="{row}">
                    <span>{{row.billNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户">
                <template slot-scope="{row}">
                    <span>{{row.custName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="车辆">
                <template slot-scope="{row}">
                    <span>{{row.truckName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款方式" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="收款到期日" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentDueDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用预收" align="right">
                <template slot-scope="{row}">
                    <span>{{row.advPayAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="现结金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.currPayAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售费用" align="right">
                <template slot-scope="{row}">
                    <span>{{row.expensesAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价税合计" align="right">
                <template slot-scope="{row}">
                    <span>{{row.itemAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="返利金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.rebateAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.status==1?'已审核':row.status==2?'已生成':'待审核'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
                <template slot-scope="{row}">
                    <span class="ctrl" v-if="row.status==0" @click="handleCompile(row)">编辑</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleScan(row)">查看</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleDel(row.id, row.billDate)">删除</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id,crow.billDate)">审核</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateBill(row.isOutboundOrder,row.id,row.outboundOrderHeaderId,row.billDate)">{{row.isOutboundOrder==1?'查看':'生成'}}出库单</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId,row.billDate)">{{row.isJeHeader==1?'查看':'生成'}}销售凭证</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" title="请选择出库单日期" :visible.sync="dialogFormVisible1" width="400px">
            <el-form style="margin-top:30px;text-align:center;">
                <el-form-item label="" prop="isBillDate">
                    <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
                    <el-radio v-model="isBillDate" label="1">销售单日期</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="default" @click="dialogFormVisible1 = false">取消</el-button>
                <el-button type="primary" @click="createBill">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="请选择凭证日期" :visible.sync="dialogFormVisible2" width="400px">
          <el-form style="margin-top:30px;text-align:center;">
            <el-form-item label="" prop="isBillDate">
              <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
              <el-radio v-model="isBillDate" label="1">进货单日期</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
              <el-button type="default" @click="dialogFormVisible2 = false">取消</el-button>
              <el-button type="primary" @click="createVouter">确定</el-button>
          </div>
        </el-dialog>
    </div>
</template>
<script>
import { getSales, delSales, auditSales, buildSales, getItemPrice,buildSaleVoucherByHeaderId } from '@/api/store'
import { parseTime } from '@/utils'
import staffList from '@/components/selects/staffList';
import custList from '@/components/selects/custList';
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination';
export default {
    name: 'saleData',
    components: { staffList, custList, Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            curBillId: '',
            isBillDate: '0',
            curBillDate: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    date1: getNowDate(),
                    date2: getNowDate(),
                    billNo: "",
                    status: '',
                    custId: '',
                    isOutboundOrder: '',
                    staffId: ''
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
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getSales(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleCheck(id, billDate) {
            this.$confirm('你确认要审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.checkItem(id, billDate)
            }).catch(()=>{
                console.log('取消')
            })
        },
        checkItem(id, billDate) {
            auditSales(id, billDate).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success('审核成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        },
        handleCreateBill(status, id1, id2, billDate) {
            if (status == 1) {
                this.$router.push('/store/outboundOrderModify?id=' + id2 + '&status=' + status)
            } else {
                this.curBillId = id1;
                this.curBillDate = billDate
                this.dialogFormVisible1 = true;
            }
        },
        createBill() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId, billDate: this.curBillDate }
            buildSales(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible1 = false;
                    this.getList();
                    this.$message.success('生成出库单成功')
                } else {
                    this.$message.warning(res.data.msg)
                }
            }).catch(() => {
                this.$message.error('生成失败，请稍后重试！')
            });
        },
        handleAdd() {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.replace('/sale/add')
        },
        handleCompile(row) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/sale/modify?id=' + row.id+'&billDate='+row.billDate)
        },
        handleScan(row) {
            this.$router.push('/sale/detail?id=' + row.id+'&billDate='+row.billDate)
        },
        handleCreateVouter(status,id1,id2,billDate){
          if(status==1){
            alert('查看销售凭证')
          }else{
            this.curBillId = id1;
            this.curBillDate = billDate
            this.dialogFormVisible2 = true;
          }
        },
        createVouter(){
          var obj = {isBillDate:this.isBillDate,id:this.curBillId,billDate: this.curBillDate}
          buildSaleVoucherByHeaderId(obj).then(res => {
            if(res.data.errorCode==0){
              this.dialogFormVisible2 = false;
              this.getList();
              this.$message.success('生成销售凭证成功！')
            }else{
              this.$message.error(res.data.msg)
            }
          });
        },
        handleDel(id, date) {
            this.$confirm('你确认要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id,date)
            });
        },
        delItem(id, date) {
            delSales(id, date).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.dialogFormVisible1 = false
                    this.$message.success('删除成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>