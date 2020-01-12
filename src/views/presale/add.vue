<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker :editable="false" v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="mini" v-model="temp.billNo" placeholder="单据号" disabled />
                </el-form-item>
                <el-form-item label="业务类型:" prop="bizTypeId">
                    <bizTypeList @selectChange="selectChange" :selectId="temp.bizTypeId"></bizTypeList>
                </el-form-item>
                <el-form-item label="客户:" prop="custId">
                    <custList @selectChange="selectChange" keyType="custId" :selectId="temp.custId" :selectName="temp.custName"></custList>
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
                <el-form-item label="预收类型:" prop="presaleType">
                    <el-select v-model="temp.presaleType" placeholder="预收类型" size="mini" @change="initTable">
                      <el-option label="按钱" value="0"></el-option>
                      <el-option label="按商品" value="1"></el-option>
                      <el-option label="按品类" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="有效日期:" prop="expirationDate">
                    <el-date-picker :editable="false" v-model="temp.expirationDate" :disabled="temp.presaleType==0" type="date" placeholder="有效日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合计金额:" prop="amount">
                    <el-input size="mini" v-model="temp.amount" placeholder="合计金额" disabled/>
                </el-form-item>
                <el-form-item label="现结金额:" prop="beginBalance">
                    <el-input size="mini" v-model="temp.beginBalance" placeholder="现结金额" style="width:72px" disabled />
                    <el-button size="mini" style="width:44px;padding:6px" @click="showSettleType">选择</el-button>
                </el-form-item>
                <el-form-item label="余额:" prop="balance" v-if="status==1">
                    <el-input size="mini" v-model="temp.balance" placeholder="余额" />
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell" max-height="600">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码" width="160" v-if="temp.presaleType=='1'">
                <template slot-scope="scope">
                    <itemList :selectCode="scope.row.itemCode" :selectId="scope.row.itemId" :index="scope.$index" @changeVal="changeVal"></itemList>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="160" v-if="temp.presaleType=='1'">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemName" disabled>
                </template>
            </el-table-column>
            <el-table-column label="规格" v-if="temp.presaleType=='1'">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.norms" disabled>
                </template>
            </el-table-column>
            <el-table-column label="单位" v-if="temp.presaleType=='1'">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="辅助单位" v-if="temp.presaleType=='1'">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.subUom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="品类代码" v-if="temp.presaleType=='2'" key="1" width="150">
                <template slot-scope="scope">
                    <invCatgList :resdata="invCatgList" :selectId="scope.row.invCatgId" :index="scope.$index" @changeVal="changeVal1"></invCatgList>
                </template>
            </el-table-column>
            <el-table-column label="品类名称" v-if="temp.presaleType=='2'" key="2" width="160">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.invCatgName" disabled>
                </template>
            </el-table-column>
            <el-table-column label="计量单位" v-if="temp.presaleType=='2'" key='3' width="150">
                <template slot-scope="scope">
                    <measList :resdata="measList" :selectId="scope.row.measId" keyType="meas" :index="scope.$index" @changeVal="changeVal1"></measList>
                </template>
            </el-table-column>
            <el-table-column label="辅助单位" v-if="temp.presaleType=='2'" key='4' width="150">
                <template slot-scope="scope">
                    <measList :resdata="measList" :selectId="scope.row.subMeasId" keyType="subMeas" :index="scope.$index" @changeVal="changeVal1"></measList>
                </template>
            </el-table-column>
            <el-table-column label="换算率" v-if="temp.presaleType=='2'||temp.presaleType=='1'" key="5" width="100">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.exchangeRate" :disabled="temp.presaleType=='1'">
                </template>
            </el-table-column>
            <el-table-column label="单价">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.price" @change="calculate(scope.$index)" :disabled="temp.presaleType==0">
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.beginBalanceQty" @change="calculate(scope.$index)" :disabled="temp.presaleType==0">
                </template>
            </el-table-column>
            <el-table-column label="金额">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.beginBalance" disabled>
                </template>
            </el-table-column>
            <el-table-column label="余量">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.balanceQty" v-if="temp.presaleType=='2'||temp.presaleType=='1'&&status==1">
                </template>
            </el-table-column>
            <el-table-column label="余额">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.balance" v-if="temp.presaleType=='2'||temp.presaleType=='1'&&status==1">
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.remarks" :disabled="temp.presaleType==0">
                </template>
            </el-table-column>
        </el-table>
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单人:" prop="recorderId">
                    <el-input size="mini" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="mini" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人:" prop="auditorId">
                    <el-input size="mini" v-model="temp.auditor" placeholder="审核人" />
                </el-form-item>
            </el-form>
        </div>
        <div class="tx-c" style="margin-top:15px" v-if="status!=1&&status!=2">
          <el-button class="filter-item" type="primary" @click="save">保存</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="392px">
            <el-table :data="settleData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
                <el-table-column label="名称" width="146">
                    <template slot-scope="scope">
                        <settleTypeList :selectCode="scope.row.settleTypeCode" :selectArap="scope.row.arAp" :selectName="scope.row.settleTypeName" :index="scope.$index" @settleTypeChange="settleTypeChange">
                        </settleTypeList>
                    </template>
                </el-table-column>
                <el-table-column label="预付应付标志" width="120">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l" v-model="row.arAp" disabled>
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l" v-model="row.amount" @change="calculate1()">
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="dialogFormVisible = false">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {savePresale,getPresaleById} from '@/api/store';
import { getMeas,getInvCatg } from '@/api/basedata';
import {deleteEmptyProp,addNullObj,addNullObj2} from '@/utils';
import staffList from '@/components/selects/staffList';
import custList from '@/components/selects/custList';
import itemList from '@/components/selects/itemList';
import bizTypeList from '@/components/selects/bizTypeList';
import invCatgList from '@/components/selects/invCatgList';
import settleTypeList from '@/components/selects/settleTypeList';
import measList from '@/components/selects/measList';
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'presaleAdd',
    components:{
        staffList,custList,bizTypeList,itemList,invCatgList,settleTypeList,measList
    },
    data() {
        return {
            id:'',
            isDisabled:false,
            status:this.$route.query.status,
            tableData: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
            keys:['invCatgName','invCatgid',"itemId","itemCode","itemName","norms","uom","subUom","exchangeRate","beginBalanceQty","price","taxRate","taxAmount","vatAmount","remarks","isGift",'measId'],
            invCatgList:[],
            measList:[],
            temp: {
                billNo:'',
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
                recordDate:getNowDate()+" 00:00:00",
                recorder:getName()
            },
            dialogFormVisible:false,
            settleData:[{},{},{},{},{}]
        }
    },
    created() {
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
                    this.temp[key] = res.data.body[key]
                    if(key=='presaleType'){
                        this.temp[key] = String(res.data.body[key])
                    }
                }
                this.tableData = addNullObj(res.data.body.presaleLine);
                this.settleData = addNullObj2(res.data.body.settleTypeDetail)
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