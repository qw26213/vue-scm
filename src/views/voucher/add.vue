<template>
    <div class="app-container">
        <div class="voucherHeader">
            <el-form :inline="true" label-position="right" label-width="80px" style="width: 100%; margin-top:0px;padding-left:15px">
                <el-form-item label="凭证字号:" prop="billNo">
                    <el-select v-model="list" size="mini" placeholder="" style="width:50px">
                        <el-option label="钱" value="0"></el-option>
                        <el-option label="品" value="1"></el-option>
                        <el-option label="类" value="2"></el-option>
                    </el-select>
                    <el-select v-model="list" size="mini" placeholder="" style="width:50px">
                        <el-option label="钱" value="0"></el-option>
                        <el-option label="品" value="1"></el-option>
                        <el-option label="类" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期:" prop="billDate">
                    <el-date-picker v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" value-format="yyyy-MM-dd" style="width:120px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附单据:" prop="expirationDate">
                    <el-input size="mini" v-model="temp.amount" style="width:40px"/>
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
                        <div class="money_unit"><i v-for="it in numberArr" :key="it">{{it}}</i></div>
                    </th>
                    <th width="220" class="p0">
                        <b class="money_tit">贷方金额</b>
                        <div class="money_unit"><i v-for="it in numberArr" :key="it">{{it}}</i></div>
                    </th> 
                </tr>
            </thead>
            <tbody class="voucher_tbody">
                <tr v-for="(item,index) in tableData">
                    <td class="p0 tablectrl">
                        <a title="增加分录" class="glyicon_plus" onclick="addRow(this);"></a>
                        <a title="删除分录" class="glyicon_remove" onclick="delRow(this);"></a>
                    </td>
                    <td class="p0 urel">
                        <summaryList :dataList="summaryArr" :selectId="item.itemId" :index="index" @changeVal="changeVal"></summaryList>
                    </td>
                    <td class="p0 urel">
                        <coaList :dataList="coaArr" :selectId="item.itemId" :index="index" @changeVal="changeVal"></coaList>
                    </td>
                    <td class="p0 urel">
                        <div class="number f12 ptb05">
                        </div>
                    </td>
                    <td class="p0 urel">
                        <div class="currency f12 ptb05"></div>
                    </td>
                    <td class="urel p0">
                        <div class="money_bg"><i>1</i><i>0</i><i>0</i></div>
                        <input type="text" autocomplete="off" class="input_bg creditMoney" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)">
                    </td>
                    <td class="urel p0">
                        <div class="money_bg"><i>1</i><i>0</i><i>0</i></div>
                        <input type="text" autocomplete="off" class="input_bg creditMoney" onblur="showNumber(this)" oninput="inputChange(this)" onfocus="inputUp(this)">
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="foot h42">
                    <td class="p0"></td>
                    <td colspan="4" class="thstyle tx-l totalNumber">合计:{{totalZh}}</td>
                    <td class="col_debite p0 urel ovh"><div class="money_bg lh42 h42" id="totalMoney1"><i>4</i><i>0</i><i>0</i></div></td>
                    <td class="col_credit p0 urel ovh"><div class="money_bg lh42 h42" id="totalMoney2"><i>4</i><i>0</i><i>0</i></div></td>
                </tr>
            </tfoot>
        </table>
        <div class="tx-c w1200" style="margin-top:15px">
            <el-button class="filter-item" type="primary" @click="save">保存并新增凭证</el-button>
            <el-button class="filter-item" type="default" @click="save">保存并新增凭证</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="结算方式" :visible.sync="dialogFormVisible" width="392px">
            <el-table :data="settleData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
                <el-table-column label="名称" width="146">
                </el-table-column>
                <el-table-column label="预付应付标志" width="120">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l">
                    </template>
                </el-table-column>
                <el-table-column label="金额">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l">
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
import { mapGetters } from 'vuex';
import { savePresale, getPresaleById } from '@/api/store';
import { getMeas, getInvCatg } from '@/api/basedata';
import { deleteEmptyProp, addNullObj, addNullObj2,convertCurrency } from '@/utils';
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
export default {
    name: 'voucherAdd',
    components: {coaList,summaryList},
    data() {
        return {
            numberArr:['亿','千','百','十','万','千','百','十','元','角','分'],
            totalZh:'',
            list:[],
            temp:{},
            tableData:[{},{},{},{}],
            dialogFormVisible:false,
            settleData:[{},{},{},{}]
        }
    },
    computed: {
        ...mapGetters([
          'coaArr',
          'summaryArr',
          'auxiliaryArr'
        ])
    },
    mounted() {
        this.$store.dispatch('voucher/getCoaList')
        this.$store.dispatch('voucher/getSummaryList')
        this.$store.dispatch('voucher/getAuxiliaryTypeList')
        this.totalZh = convertCurrency(400)
    },
    methods: {
        save(){

        },
        changeVal(){

        }
    }
}
</script>
<style lang="scss" scoped>
    @import './add.scss';
</style>