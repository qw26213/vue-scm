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
                <el-option label="未审核" value="0"></el-option>
                <el-option label="已审核" value="1"></el-option>
            </el-select>
            <el-select v-model="listQuery.queryParam.statusPayment" placeholder="支付状态" size="small">
                <el-option label="全部" :value="null" />
                <el-option label="未支付" :value="0" />
                <el-option label="预付定金" :value="1" />
                <el-option label="已支付" :value="9" />
                <el-option label="订单作废" :value="-9" />
            </el-select>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button size="small" type="primary" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" border fit highlight-current-row>
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
            <el-table-column label="收款到期日" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentDueDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价税合计" align="right">
                <template slot-scope="{row}">
                    <span>{{row.itemAmount|Fixed}}</span>
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
            <el-table-column label="应收金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.receivableAmount|Fixed}}</span>
                </template>
            </el-table-column>
            <el-table-column label="发票状态" align="center">
                <template slot-scope="{row}">
                    <span>{{row.statusInvoice==0?'无发票':row.statusInvoice==1?'待开':row.statusInvoice==9?'完成':'订单作废'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="240">
                <template slot-scope="{row}">
                    <span class="ctrl" v-if="row.status<=0" @click="handleCompile(row)">编辑</span>
                    <span class="ctrl" v-if="row.status==-1" @click="showAuditInfo(row.id)">查看审核意见</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleScan(row)">查看</span>
                    <span class="ctrl" v-if="row.status==0" @click="handleCheck(row.id, row.billDate)">审核</span>
                    <span class="ctrl del" v-if="row.status<=0" @click="handleDel(row.id, row.billDate)">删除</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateBill(row.isOutboundOrder,row.id,row.outboundOrderHeaderId,row.billDate)">{{ row.isOutboundOrder==0 ? '生成' : '查看' }}出库单</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isDelivery,row.id,row.jeHeaderId,row.billDate)">{{row.isDelivery==0?'生成':'查看'}}发票</span>
                    <span class="ctrl" v-if="row.status==1" @click="handleCreateVouter(row.isJeHeader,row.id,row.jeHeaderId,row.billDate)">{{row.isJeHeader==0?'生成':'查看'}}销售凭证</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
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
        <Auditconfirm :dialogvisible.sync="auditModalVisible" :type="auditType" :remarklist="remarklist" @auditBill="checkItem" />
    </div>
</template>
<script>
import { getSales, delSales, auditSales, buildSales, buildSaleVoucherByHeaderId, buildInvoice, getAuditInfoByHeaderId } from '@/api/sale'
import { parseTime } from '@/utils'
import staffList from '@/components/selects/staffList'
import Auditconfirm from '@/components/Auditconfirm/index'
import custList from '@/components/selects/custList'
import { getNowDate } from '@/utils/auth'
import Pagination from '@/components/Pagination'
export default {
    name: 'saleData',
    components: { staffList, custList, Pagination, Auditconfirm },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            auditModalVisible: false,
            auditType: 'create',
            remarklist: [],
            curBillId: '',
            isBillDate: '0',
            curBillDate: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    billDate1: getNowDate(),
                    billDate2: getNowDate(),
                    billNo: "",
                    status: '',
                    custId: '',
                    staffId: '',
                    statusPayment: ''
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
            getSales(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleCheck(id, billDate) {
            this.auditType = 'create'
            this.curBillId = id
            this.curBillDate = billDate
            this.auditModalVisible = true
        },
        checkItem(obj) {
            let data = obj
            data.id = this.curBillId
            data.billDate = this.curBillDate
            auditSales(data).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList()
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
        handleCreateBill(status, id1, id2, billDate) {
            if (status !== 0) {
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
            this.$router.push('/sale/add')
        },
        handleCompile(row) {
            this.$store.dispatch('tagsView/delView', this.$route);
            this.$router.push('/sale/modify?id=' + row.id+'&billDate='+row.billDate)
        },
        handleScan(row) {
            this.$router.push('/sale/detail?id=' + row.id+'&billDate='+row.billDate)
        },
        handleCreateVouter(status,id1,id2,billDate){
        if (status !== 0) {
            this.$router.push('/voucher/add?id=' + id2)
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
          })
        },
        handleDel(id, date) {
            this.$confirm('确定删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id,date)
            })
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