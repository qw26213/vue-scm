<template>
    <div class="app-container">
        <div class="w1200 voucherHeader">
            <el-button type="primary" size="mini" @click="dialogFormVisible1 = true">从模板生成凭证</el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible2 = true">选择摘要</el-button>
            <div class="voucherTit">记账凭证<span class="Period">2019年第10期</span></div>
            <el-form :inline="true" label-position="right" label-width="80px" style="width: 100%; margin-top:0px;">
                <el-form-item label="凭证字号" prop="billNo" style="margin-bottom:10px">
                    <select class="catogeryName uds">
                        <option value="0" v-for="item in catogeryList" :ke="item.id">{{item.catogeryName}}</option>
                    </select>
                    <span class="catogeryNumber uds">{{temp.catogeryNumber|catogeryNumberFor}}</span>
                    <span class="btn-wrap uds">
                        <a class="btn-up" @click="catogeryNumberAdd(1)"></a>
                        <a class="btn-down" @click="catogeryNumberAdd(-1)"></a>
                    </span>
                </el-form-item>
                <el-form-item label="日期" prop="billDate" style="margin-bottom:10px;">
                    <el-date-picker v-model="temp.billDate" type="date" placeholder="日期" size="mini" value-format="yyyy-MM-dd" style="width:120px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附单据" prop="expirationDate" style="float:right;margin-bottom:10px">
                    <input type="text" class="catogeryNumber" v-model="temp.voucherAttachmentNum" style="width:40px;margin-right:6px" />
                    <span>张</span>
                </el-form-item>
            </el-form>
        </div>
        <table class="voucher table table-condensed w1200" style="border-left:none;">
            <thead>
                <tr>
                    <th width="18" class="tablectrl thstyle"></th>
                    <th class="thstyle">摘要</th>
                    <th class="thstyle">会计科目</th>
                    <th width="109" class="thstyle">数量</th>
                    <th width="122" class="thstyle">币别</th>
                    <th width="220" class="p0">
                        <b class="money_tit">借方金额</b>
                        <div class="money_unit"><i v-for="(it,index) in numberArr" :key="index">{{it}}</i></div>
                    </th>
                    <th width="220" class="p0">
                        <b class="money_tit">贷方金额</b>
                        <div class="money_unit"><i v-for="(it,index) in numberArr" :key="index">{{it}}</i></div>
                    </th>
                </tr>
            </thead>
            <tbody class="voucher_tbody">
                <tr v-for="(row,index) in tableData">
                    <td class="p0 tablectrl">
                        <a title="增加分录" class="glyicon_plus" @click="addRow()"></a>
                        <a title="删除分录" class="glyicon_remove" @click="delRow(index)"></a>
                    </td>
                    <td class="p0 urel">
                        <summaryList :dataList="summaryArr" :index="index" @changeVal="changeVal" :val="row.summary"></summaryList>
                    </td>
                    <td class="p0 urel">
                        <coaList :dataList="coaArr" :selectId="row.itemId" :index="index" @changeVal="changeVal" :val="row.coaCode + row.dispName"></coaList>
                    </td>
                    <td class="p0 urel">
                        <div class="number f12 ptb05">
                        </div>
                    </td>
                    <td class="p0 urel">
                        <div class="currency f12 ptb05">
                        </div>
                    </td>
                    <td class="urel p0">
                        <div class="money_bg">
                            <i v-for="(item,index) in row.creditMoney" v-if="row.creditMoney>0" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.creditMoney" maxlength="12" @input="inputChange($event)">
                    </td>
                    <td class="urel p0">
                        <div class="money_bg">
                            <i v-for="(item,index) in row.debiteMoney" v-if="row.debiteMoney>0" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.debiteMoney" maxlength="12" @input="inputChange($event)">
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="foot h42">
                    <td class="p0"></td>
                    <td colspan="4" class="thstyle tx-l totalNumber">合计:{{totalZh}}</td>
                    <td class="col_debite p0 urel ovh">
                        <input type="hidden" v-model="totalMoney1" />
                        <div class="money_bg h42">
                            <i class="lh42" v-for="(item,index) in totalMoney1" v-if="totalMoney1>0" :key="index">{{item}}</i>
                        </div>
                    </td>
                    <td class="col_credit p0 urel ovh">
                        <input type="hidden" v-model="totalMoney2" />
                        <div class="money_bg h42">
                            <i class="lh42" v-for="(item,index) in totalMoney2" v-if="totalMoney2>0" :key="index">{{item}}</i>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div class="tx-c w1200" style="margin-top:15px">
            <el-button class="filter-item" type="primary" @click="saveTemplet">保存为凭证模板</el-button>
            <el-button class="filter-item" type="default" @click="saveVoucher">保存并新增凭证</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="选择凭证模板" :visible.sync="dialogFormVisible1" width="540px">
            <el-table :data="templetData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="trCell">
                <el-table-column label="模板类型" width="140" align="center">
                    <template slot-scope="{row}">
                        <span v-for="item in templetTypeList" v-if="item.id==row.templetType" :key="item.id">{{item.templetTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模板名称" width="150" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.templetName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模板编码" width="120" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.templetCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button class="filter-item" type="primary" size="mini" @click="selectTemplet(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total1>10" :total="total1" :page.sync="listQuery1.pageIndex" :limit.sync="listQuery1.pageNum" @pagination="getTempletList" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="常用摘要" :visible.sync="dialogFormVisible2" width="410px">
            <el-table :data="summaryArr" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="trCell">
                <el-table-column label="助记码" width="120" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.mnemonicCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="名称" width="150" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.summary}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button class="filter-item" type="primary" size="mini" @click="save(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGlPeriodByCenterDate, getTempletHeader, getGlPeriodByPeriodCode, getMaxVoucherSeq, getTempletTypeList,getTempletById,getVoucherById, voucherSave, templetSave, getCatogery } from '@/api/voucher'
import { getNowDate, deleteEmptyProp, addNullObj, addNullObj2, convertCurrency, validateVal } from '@/utils'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
export default {
    name: 'closePeriod',
    components: { coaList, summaryList, Pagination },
    data() {
        return {
            selectCatogery:'',
            catogeryList:[],
            total1:0,
            total2:0,
            numberArr: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'],
            totalZh: '',
            list: [],
            temp: {
                catogeryNumber: 1,
                billDate:getNowDate(),
                voucherAttachmentNum:0,
            },
            tableData: [{}, {}, {}, {}],
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            templetData: [],
            totalMoney1:0,
            totalMoney2:0,
            listQuery1: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {}
            }
        }
    },
    filters: {
        catogeryNumberFor: function (num) {
            return num < 10 ? '00' + num : num < 100 ? '0' + num : num;
        }
    },
    computed: {
        ...mapGetters([
            'coaArr',
            'summaryArr',
            'auxiliaryArr',
            'templetTypeList'
        ])
    },
    created() {
        this.$store.dispatch('voucher/getCoaList')
        this.$store.dispatch('voucher/getSummaryList')
        this.$store.dispatch('voucher/getTempletType')
        this.$store.dispatch('voucher/getAuxiliaryTypeList')
        this.getTempletList()
        getCatogery().then(res=>{
            this.catogeryList = res.data
        })
    },
    methods: {
        addRow(){
            this.tableData.push({})
        },
        delRow(index){
            if(this.tableData.length<=2){
                this.$message.warning('至少要保留两条分录！');return
            }
            this.tableData.splice(index,1)
        },
        saveVoucher(){
            if(this.tableData.length<=2){
                this.$message.warning('至少两条分录！');return
            }
            let obj = {
                bookId: sessionStorage.bookId,
                catogeryId: this.selectCatogery,
                catogeryName: '记',
                catogeryTitle: "记账凭证",
                // jzCode: jzCode,
                // joinJeHeaderId:joinJeHeaderId,
                periodCode: this.temp.billDate,
                periodId: curPeriodValue,
                periodName: '2020年02期',
                saveType: saveTypeValue,
                totalCreditMoney: this.total1,
                totalDebiteMoney: this.total2,
                voucherAttachmentNum: this.temp.voucherAttachmentNum,
                voucherDate: this.temp.billDate,
                voucherSeq: this.temp.catogeryNumber,
                // voucherId: voucherId,
                // jeHeaderId: voucherId,
                voucherTable: this.tableData
            }
            voucherSave(obj).then(res=>{
                if(res.data.success){
                    this.$message.success("凭证模板保存成功")
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        saveTemplet(){
            let obj = {

            }
            templetSave(obj).then(res=>{
                if(res.data.success){
                    this.$message.success("凭证模板保存成功")
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        inputChange(event){
            this.clearNoNum(event.currentTarget);
            this.totalMoney1 = this.calculate1();
            this.totalMoney2 = this.calculate2();
            this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
        },
        clearNoNum(obj) {
            // if (obj.value != '' && obj.value.substr(0, 1) == '=') {
            //     obj.value = 0
            //     valueBalance(obj);return;
            // }
            validateVal(obj)
        },
        calculate1(){
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].creditMoney) {
                    amount += Number(this.tableData[i].creditMoney);
                }
            }
            return String(amount)
        },
        calculate2(){
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].debiteMoney) {
                    amount += Number(this.tableData[i].debiteMoney);
                }
            }
            return String(amount)
        },
        selectTemplet(id){
            this.dialogFormVisible1 = false
            getTempletById(id).then(res => {
                this.tableData = res.data.data.lineList

            })
        },
        catogeryNumberAdd(num) {
            this.catogeryNumber = this.catogeryNumber + num == 0 ? this.catogeryNumber : this.catogeryNumber + num
        },
        getTempletList() {
            getTempletHeader(this.listQuery1).then(res => {
                this.templetData = res.data.data
                this.total1 = res.data.totalNum
            }).catch(err => {

            })
        },
        saveCoa() {
            
        },
        saveSummary(){

        },
        changeVal() {

        }
    }
}
</script>
<style lang="scss" scoped>
@import './voucher.scss';
</style>