<template>
    <div class="app-container">
        <div class="w1200 voucherHeader">
            <el-button type="primary" size="mini" @click="dialogFormVisible1 = true">从模板生成凭证</el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible2 = true">常用摘要</el-button>
            <div class="voucherTit">记账凭证<span class="Period">2019年第10期</span></div>
            <el-form :inline="true" label-position="right" label-width="80px" style="width: 100%; margin-top:0px;">
                <el-form-item label="凭证字号" prop="billNo" style="margin-bottom:10px">
                    <select class="catogeryName uds">
                        <option value="0" v-for="item in catogeryList" :ke="item.id">{{item.catogeryName}}</option>
                    </select>
                    <span class="catogeryNumber uds">{{billHeader.jeSeq | numberFormat}}</span>
                    <span class="btn-wrap uds">
                        <a class="btn-up" @click="catogeryNumberAdd(1)"></a>
                        <a class="btn-down" @click="catogeryNumberAdd(-1)"></a>
                    </span>
                </el-form-item>
                <el-form-item label="日期" prop="billDate" style="margin-bottom:10px;">
                    <el-date-picker v-model="billHeader.billDate" type="date" placeholder="日期" size="mini" value-format="yyyy-MM-dd" style="width:120px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附单据" prop="expirationDate" style="float:right;margin-bottom:10px">
                    <input type="text" class="catogeryNumber" v-model="billHeader.voucherAttachmentNum" style="width:40px;margin-right:6px" />
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
                        <coaList :dataList="coaArr" :selectId="row.itemId" :index="index" @changeVal="changeVal" :val="row.coaId"></coaList>
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
                            <i v-if="row.accountedCr>0" v-for="(item,index) in String(row.accountedCr)" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedCr" maxlength="12" @input="inputChange($event)">
                    </td>
                    <td class="urel p0">
                        <div class="money_bg">
                            <i v-if="row.accountedDr>0" v-for="(item,index) in String(row.accountedDr)" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedDr" maxlength="12" @input="inputChange($event)">
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
                            <i class="lh42" v-for="(item,index) in String(totalMoney1)" v-if="totalMoney1>0" :key="index">{{item}}</i>
                        </div>
                    </td>
                    <td class="col_credit p0 urel ovh">
                        <input type="hidden" v-model="totalMoney2" />
                        <div class="money_bg h42">
                            <i class="lh42" v-for="(item,index) in String(totalMoney2)" v-if="totalMoney2>0" :key="index">{{item}}</i>
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
            <div class="filter-container" style="padding-bottom:0;margin-top:-10px">
              <el-input size="small" v-model="temp2.mnemonicCode" placeholder="助记码" style="width: 135px;" class="filter-item" />
              <el-input size="small" v-model="temp2.summary" placeholder="名称" style="width: 135px;" class="filter-item" />
              <el-button size="mini" class="filter-item" type="primary" @click="handleSummaryAdd">创建摘要</el-button>
            </div>
            <el-table :data="summaryPageData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="trCell">
                <el-table-column label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{listQuery2.pageIndex*10 - 10 + scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="助记码" prop="mnemonicCode" align="center"></el-table-column>
                <el-table-column label="名称" prop="summary" align="center"></el-table-column>
                <el-table-column label="操作" prop="summary" align="center" width="100">
                    <template slot-scope="{row}">
                        <el-button class="filter-item" type="danger" size="mini" @click="handDelSummary(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total2>10" :total="total2" :page.sync="listQuery2.pageIndex" :limit.sync="listQuery2.pageNum" @pagination="getSummaryByPage" />
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGlPeriodByCenterDate, getGlPeriodByPeriodCode, getMaxVoucherSeq, getVoucherById, voucherSave, getCatogery } from '@/api/voucher'
import { getTempletHeader, getTempletTypeList, getTempletById, templetSave } from '@/api/voucher'
import { getAllUnion, addSummary, delSummary } from '@/api/voucher'
import { getNowDate, deleteEmptyObj, addNullObj, addNullObj2, convertCurrency, validateVal } from '@/utils'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
export default {
    name: 'voucherAdd',
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
            billHeader: {
                catogeryNumber: 1,
                billDate:getNowDate(),
                voucherAttachmentNum:0,
            },
            temp2: {
                summary:'',
                mnemonicCode:''
            },
            tableData: [{}, {}, {}, {}],
            voucherTable: [],
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            templetData: [],
            summaryTable: [],
            summaryPageData: [],
            totalMoney1:0,
            totalMoney2:0,
            listQuery1: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {}
            },
            listQuery2: {
                pageIndex: 1,
                pageNum: 10
            }
        }
    },
    filters: {
        numberFormat: function (num) {
            return num < 10 ? '00' + num : num < 100 ? '0' + num : num;
        }
    },
    computed: {
        ...mapGetters([
            'auxiliaryArr',
            'templetTypeList',
            'summaryArr',
            'coaArr'
        ])
    },
    watch:{
        summaryArr() {
            this.summaryTable = this.summaryArr
            this.listQuery2.pageIndex = 1
            this.total2 = this.summaryTable.length
            this.getSummaryByPage()
        }
    },
    created() {
        this.$store.dispatch('voucher/getCoaList')
        this.$store.dispatch('voucher/getTempletType')
        this.$store.dispatch('voucher/getAuxiliaryTypeList')
        this.getTempletList()
        getCatogery().then(res=>{
            this.catogeryList = res.data
        })
        if(this.$route.query.id){
            getVoucherById({id:this.$route.query.id}).then(res => {
                this.$store.dispatch('voucher/getSummaryList')
                this.billHeader = res.data.data.header
                this.tableData = res.data.data.lineList
                var totalMoney = 0
                for(var i=0;i<this.tableData.length;i++){
                    totalMoney += Number(this.tableData[i].accountedDr);
                }
                this.totalMoney1 = totalMoney
                this.totalMoney2 = totalMoney
                this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
            })
        } else {
            this.$store.dispatch('voucher/getSummaryList')
        }
    },
    methods: {
        handDelSummary(id) {
            this.$confirm('你确认要删除该摘要吗?', '提示', {
                confirmButtonText: '确定',closeOnClickModal:false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delSummary(id).then(res => {
                    if(res.data.success){
                        this.$message.success("摘要删除成功")
                        this.$store.dispatch('voucher/getSummaryList')
                    }else{
                        this.$message.warning(res.data.msg)
                    }
                }).catch(err =>{
                    this.$message.error("系统错误")
                })
            }).catch(err=>{
                console.log(err)
            });
        },
        handleSummaryAdd() {
            var obj = {
                mnemonicCode: this.temp2.mnemonicCode,
                summary: this.temp2.summary,
                bookId: sessionStorage.bookId
            }
            if (this.temp2.mnemonicCode == "" || this.temp2.summary == "") {
                this.$message.warning('摘要编码和名称都不能为空！')
                return
            }
            addSummary(obj).then(res => {
                if(res.data.success){
                    this.$message.success("摘要创建成功")
                    this.temp2.mnemonicCode = ""
                    this.temp2.summary = ""
                    this.$store.dispatch('voucher/getSummaryList')
                }else{
                    this.$message.warning(res.data.msg)
                }
            }).catch(err =>{
                this.$message.error("系统错误")
            })
        },
        getSummaryByPage(){
            var pageIndex = this.listQuery2.pageIndex
            var arr = []
            var min =  pageIndex*10 - 10
            var max = pageIndex*10 <= this.total2 ? pageIndex*10 : this.total2
            for(var i=min;i<max;i++){
                arr.push(this.summaryTable[i])
            }
            this.summaryPageData = arr
        },
        addRow(){
            this.tableData.push({})
        },
        getSummaryData() {
            getAllUnion().then(res => {

            })
        },
        delRow(index){
            if(this.tableData.length<=2){
                this.$message.warning('至少要保留两条分录！');return
            }
            this.tableData.splice(index,1)
        },
        saveVoucher(){
            this.voucherTable = deleteEmptyObj(this.tableData)
            if(this.voucherTable.length<=2){
                this.$message.warning('凭证至少要两条分录！');return
            }
            const curPeriodValue = ''
            const obj = {
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
                voucherTable: this.voucherTable
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
            const obj = {

            }
            templetSave(obj).then(res=>{
                if(res.data.success){
                    this.$message.success("凭证模板保存成功")
                }else{
                    this.$message.error(res.data.msg)
                }
            })
        },
        foucsInput(event){
            console.log(event.currentTarget.value)
            event.currentTarget.value = event.currentTarget.value == 0 ? '' : ''
        },
        inputChange(event){
            this.clearNoNum(event.currentTarget)
            this.totalMoney1 = this.calculate1()
            this.totalMoney2 = this.calculate2()
            this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
        },
        clearNoNum(obj) {
            // if (obj.value != '' && obj.value.substr(0, 1) == '=') {
            //     obj.value = 0
            //     valueBalance(obj)
            //     return
            // }
            validateVal(obj)
        },
        calculate1(){
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedCr) {
                    amount += Number(this.tableData[i].accountedCr);
                }
            }
            return String(amount)
        },
        calculate2(){
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedDr) {
                    amount += Number(this.tableData[i].accountedDr)
                }
            }
            return String(amount)
        },
        selectTemplet(id) {
            this.dialogFormVisible1 = false
            getTempletById(id).then(res => {
                this.tableData = res.data.data.lineList
            }).catch(err => {
                this.$message.error("系统错误")
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
                this.$message.error("系统错误")
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