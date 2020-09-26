<template>
    <div class="app-container">
        <div class="filterDiv">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.billDate2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <el-input size="small" v-model="listQuery.billNo" placeholder="单据号" style="width: 120px;" />
            <custList @selectChange="selectChange" ctrType="list"></custList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.queryParam.staffId"></staffList>
            <el-select v-model="listQuery.queryParam.status" placeholder="单据状态" size="small">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="未审核" :value="0"></el-option>
                <el-option label="已审核" :value="1"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" border fit highlight-current-row>
            <el-table-column label="单据日期" align="center" width="100">
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
            <el-table-column label="付款方式" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="付款到期日" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentDueDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用预付" align="right">
                <template slot-scope="{row}">
                    <span>{{row.advPayAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="现结金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.currPayAmount|Fixed}}</span>
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
            <el-table-column label="操作" align="left" width="260">
                <template slot-scope="{row}">
                    <span class="ctrl" v-if="row.status<=0" @click="handleCompile(row.id)">编辑</span>
                    <span class="ctrl" v-if="row.status==-1" @click="showAuditInfo(row.id)">查看审核意见</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleScan(row.id)">查看</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id)">审核</span>
                    <span class="ctrl del" v-if="row.status<=0" @click="handleDel(row.id)">删除</span>
                    <span class="ctrl" v-if="row.status==1&&(row.returnedType==0||row.returnedType==1)" @click="handleCreateBill(row.isOutboundOrderReturned,row.id,row.outboundOrderReturnedHeaderId)">{{row.isOutboundOrderReturned==0?'生成':'查看'}}退货入库单</span>
                    <span class="ctrl" v-if="row.status==1&&(row.returnedType==2)" @click="handleCreateBill1(row.isInventory,row.id,row.inventoryId)">{{row.isInventory==0?'生成':'查看'}}报损单</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId)">{{row.isJeHeader==0?'生成':'查看'}}销售退货凭证</span>
                    <span class="ctrl" @click="printBill(row.id)">打印</span>
                </template>
            </el-table-column>
        </el-table>
        </div>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" title="选择销售退货单日期" :visible.sync="dialogFormVisible1" width="400px">
            <el-form style="margin-top:30px;text-align:center;">
                <el-form-item label="" prop="isBillDate">
                    <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
                    <el-radio v-model="isBillDate" label="1">预收单日期</el-radio>
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
        <el-dialog :close-on-click-modal="false" title="请选择报损单日期" :visible.sync="dialogFormVisible3" width="400px">
          <el-form style="margin-top:30px;text-align:center;">
            <el-form-item label="" prop="isBillDate">
              <el-radio v-model="isBillDate" label="0" style="margin-right:10px">当前日期</el-radio>
              <el-radio v-model="isBillDate" label="1">退货单日期</el-radio>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer" align="center">
              <el-button type="default" @click="dialogFormVisible3 = false">取消</el-button>
              <el-button type="primary" @click="createBill1">确定</el-button>
          </div>
        </el-dialog>
        <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
    </div>
</template>
<script>
import { getSalesReturned, delSalesReturned, auditSalesReturned, buildSalesReturned, getItemPrice, buildSaleReturnedVoucherByHeaderId, buildInventoryByHeaderId, getAuditInfoByHeaderId, printByHeaderId } from '@/api/sale'
import { parseTime } from '@/utils'
import staffList from '@/components/selects/staffList';
import Auditconfirm from '@/components/Auditconfirm/index';
import custList from '@/components/selects/custList';
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination';
export default {
    name: 'saleData',
    components: { staffList, custList, Pagination, Auditconfirm },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            auditType: '',
            remarklist: [],
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            auditModalVisible: false,
            curBillId: '',
            isBillDate: '0',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    billDate1: getNowDate(),
                    billDate2: getNowDate(),
                    billNo: '',
                    status: '',
                    custId: '',
                    staffId: ''
                }
            }
        }
    },
    filters: {
        Fixed: function (num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    created() {
        this.getList()
    },
    methods: {
        printBill(id) {
            printByHeaderId('/so/salesReturned', id).then(res => {
                if (res.data.errorCode == 0) {
                    window.open("http://" + window.location.host + res.data.data)
                } else {
                    this.$messae.warning('文件生成失败')
                }
            })
        },
        showAuditInfo(id){
            this.auditType = 'record'
            getAuditInfoByHeaderId(id).then(res => {
                if(res.data.errorCode == 0) {
                    this.auditModalVisible = true
                    this.remarklist = res.data.data || []
                }
            })
        },
        getList() {
            this.listLoading = true
            getSalesReturned(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleCheck(id) {
            this.auditType = 'create'
            this.curBillId = id
            this.auditModalVisible = true
        },
        checkItem(obj) {
            let data = obj
            data.id = this.curBillId
            auditSalesReturned(data).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.auditModalVisible = false
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
        handleCreateBill(status, id1, id2) {
            if (status !== 0) {
                this.$router.push('/store/outboundOrderReturnedModify?id=' + id2 + '&status=' + status)
            } else {
                this.curBillId = id1
                this.dialogFormVisible1 = true
            }
        },
        createBill() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId }
            buildSalesReturned(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible1 = false
                    this.getList()
                    this.$message.success('生成退货入库单成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCreateBill1(status, id1, id2){
            if (status !== 0) {
                this.$router.push('/store/inventoryModify?id=' + id2 + '&status=' + status)
            } else {
                this.curBillId = id1
                this.dialogFormVisible3 = true
            }
        },
        createBill1() {
            var obj = { isBillDate: this.isBillDate, id: this.curBillId }
            buildInventoryByHeaderId(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.dialogFormVisible3 = false
                    this.getList()
                    this.$message.success('生成报损单成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleCreateVouter(status,id1,id2){
          if (status !== 0) {
            this.$router.push('/voucher/add?id=' + id2)
          }else{
            this.curBillId = id1;
            this.dialogFormVisible2 = true;
          }
        },
        createVouter(){
          var obj = {isBillDate:this.isBillDate,id:this.curBillId}
          buildSaleReturnedVoucherByHeaderId(obj).then(res => {
            if(res.data.errorCode==0){
              this.dialogFormVisible2 = false
              this.getList()
              this.$message.success('生成销售退货凭证成功！')
            }else{
              this.$message.error(res.data.msg)
            }
          })
        },
        handleAdd() {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/sale/returnedAdd')
        },
        handleCompile(id) {
            this.$store.dispatch('tagsView/delView', this.$route)
            this.$router.push('/sale/returnedModify?id=' + id)
        },
        handleScan(id) {
            this.$router.push('/sale/returnedDetail?id=' + id)
        },
        handleDel(id) {
            this.$confirm('确认要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id)
            })
        },
        delItem(id) {
            delSalesReturned(id).then(res => {
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