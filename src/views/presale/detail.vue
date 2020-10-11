<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:">
                    <span>{{temp.billDate}}</span>
                </el-form-item>
                <el-form-item label="单据号:">
                    <span>{{temp.billNo}}</span>
                </el-form-item>
                <el-form-item label="业务类型:">
                    <span>{{temp.bizTypeName}}</span>
                </el-form-item>
                <el-form-item label="客户:">
                    <span>{{temp.custName}}</span>
                </el-form-item>
                <el-form-item label="业务员:">
                    <span>{{temp.staffName}}</span>
                </el-form-item>
                <el-form-item label="预收类型:">
                    <span>{{temp.presaleType}}</span>
                </el-form-item>
                <el-form-item label="有效日期:">
                    <span>{{temp.expirationDate}}</span>
                </el-form-item>
                <el-form-item label="预收合计:">
                    <span>{{temp.amount}}</span>
                </el-form-item>
                <el-form-item label="现结金额:">
                    <span>{{temp.beginBalance}}</span>
                </el-form-item>
                <el-form-item label="余额:" v-if="status==1">
                    <span>{{temp.balance}}</span>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell" max-height="600">
                <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
                <el-table-column label="商品" width="300" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.itemCode + ' ' + row.itemName }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.norms}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单位" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.uom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助单位" v-if="temp.presaleType=='1'">
                    <template slot-scope="{row}">
                        <span>{{row.subUom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品类代码" v-if="temp.presaleType=='2'" key="1" width="150">
                    <template slot-scope="{row}">
                        <span>{{row.invCatgCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品类名称" v-if="temp.presaleType=='2'" key="2" width="160">
                    <template slot-scope="{row}">
                        <span>{{row.invCatgName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="计量单位" v-if="temp.presaleType=='2'" key='3' width="150">
                    <template slot-scope="{row}">
                        <span>{{row.measName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助单位" v-if="temp.presaleType=='2'" key='4' width="150">
                    <template slot-scope="{row}">
                        <span>{{row.subMeasName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="换算率" v-if="temp.presaleType=='2'||temp.presaleType=='1'" key="5" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.exchangeRate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价">
                    <template slot-scope="{row}">
                        <span>{{row.price}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="{row}">
                        <span>{{row.beginBalance}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="余量">
                    <template slot-scope="{row}">
                        <span>{{row.balanceQty}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="余额">
                    <template slot-scope="{row}">
                        <span>{{row.balance}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="dataTable" style="margin-top: 10px">
                <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="备 注:">
                        <span>{{temp.remarks}}</span>
                    </el-form-item>
                </el-form>
                <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="制单日期:">
                        <span>{{temp.recordDate | parseDate}}</span>
                    </el-form-item>
                    <el-form-item label="制单人:">
                        <span>{{temp.recorderName}}</span>
                    </el-form-item>
                    <el-form-item label="审核日期:">
                        <span>{{temp.auditDate | parseDate}}</span>
                    </el-form-item>
                    <el-form-item label="审核人:">
                        <span>{{temp.auditorName}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {savePresale,getPresaleById} from '@/api/store';
import { getMeas,getInvCatg } from '@/api/basedata';
import {deleteEmptyProp,addNullObj,addNullObj2} from '@/utils';
import { getName,getNowDate } from '@/utils/auth';
export default {
    name: 'presaleDetail',
    data() {
        return {
            id:'',
            isDisabled:false,
            status:this.$route.query.status,
            tableData: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
            keys:['invCatgName','invCatgid',"itemId","itemCode","itemName","norms","uom","subUom","exchangeRate","beginBalanceQty","price","taxRate","taxAmount","vatAmount","remarks","salesTypeCode",'measId'],
            invCatgList:[],
            measList:[],
            temp: {
                billNo:'',
                remarks:'',
                amount:'',
                expirationDate:'',
                billDate:getNowDate(),
                custName:'',
                presaleType:'1',
                staffId:'',
                custId:'',
                bizTypeId:'',
                beginBalance:'',
                auditDate:"",
                auditor:"",
                balance:0,
                recordDate:getNowDate() + " 00:00:00",
                recorder:getName()
            },
            dialogFormVisible:false,
            settleData:[{},{},{},{},{}]
        }
    },
    computed: {
        ...mapGetters([
          'settleTypeArr',
          'truckList'
        ])
    },
    created() {
        this.$store.dispatch('basedata/getPresaleSettleType')
        getMeas().then(res => {
            this.measList = res.data.data
        })
        getInvCatg().then(res => {
            this.invCatgList = res.data.data
        })
        if(this.$route.query.id){
            this.id = this.$route.query.id;
            getPresaleById(this.id).then(res=>{
                for(var key in this.temp){
                    this.temp[key] = res.data.data[key]
                    if(key=='presaleType'){
                        this.temp[key] = String(res.data.data[key])
                    }
                }
                this.tableData = addNullObj(res.data.data.presaleLine);
                this.settleData = addNullObj2(res.data.data.settleTypeDetail)
                this.calculateTotal()
            })
        }
    },
    methods: {
        initTable(val){
            this.tableData = [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}];
        },
        showSettleType() {
            this.dialogFormVisible = true
        },
        settleTypeChange(obj){
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key];
            }
        },
        changeVal1(obj){
            for(var key in obj){
                this.tableData[obj.index][key]=obj[key];
            }
        },
        calculate(index){
            var qty = this.tableData[index].beginBalanceQty;
            var price = this.tableData[index].price;
            if(qty&&price){
                var beginBalance = parseFloat(Number(qty)*Number(price)).toFixed(2);
                this.$set(this.tableData[index],'beginBalance',beginBalance)
                this.calculateTotal();
            }
        },
        calculate1(){
            var amount = 0;
            for (var i = 0; i < this.settleData.length; i++) {
                if (this.settleData[i] && this.settleData[i].amount) {
                    amount += Number(this.settleData[i].amount);
                }
            }
            this.temp.beginBalance = parseFloat(amount).toFixed(2);
        },
        calculateTotal(){
            var amount = 0;
            for(var i=0;i<this.tableData.length;i++){
                if(this.tableData[i]&&this.tableData[i].beginBalance){
                    amount+=Number(this.tableData[i].beginBalance);
                }
            }
            this.temp.amount = parseFloat(amount).toFixed(2);
        },
        selectChange(obj){
            for(var key in obj){
                this.temp[key]=obj[key];
            }
        },
        changeVal(obj){
            for(var key in obj){
                this.tableData[obj.index][key]=obj[key];
            }
            if(obj.index+1==this.tableData.length){
                this.tableData.push({});
            }
        },
        save() {
            this.temp.id = this.id;
            this.temp.presaleLine = deleteEmptyProp(this.tableData);
            this.temp.settleTypeDetail = this.settleData;
            savePresale(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.temp.id==""?'新增成功':'修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/presale/data');
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(()=>{
                this.$message.error('保存失败，请稍后重试！')
            })
        }
    }
}
</script>