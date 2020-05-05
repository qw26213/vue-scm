<template>
    <div class="main">
        <div class="billList">
            <div class="item">
                <p>结转成本</p>
                <el-button type="primary" size="mini" @click="inputVoucher(0)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>结转待摊费用</p>
                <el-button type="primary" size="mini" @click="inputVoucher(1)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>结转未缴增值税</p>
                <el-button type="primary" size="mini" @click="inputVoucher(2)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>计提附加税</p>
                <el-button type="primary" size="mini" @click="inputVoucher(3)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>计提折旧</p>
                <el-button type="primary" size="mini" @click="inputVoucher(4)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>计提工资</p>
                <el-button type="primary" size="mini" @click="inputVoucher(5)">生成凭证</el-button>
            </div>
            <div class="item" v-if="curMonth == '03' || curMonth == '06' || curMonth == '09' || curMonth == '12'">
                <p>计提所得税</p>
                <el-button type="primary" size="mini" @click="inputVoucher(6)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>结转收入</p>
                <el-button type="primary" size="mini" @click="inputVoucher(7)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>结转费用</p>
                <el-button type="primary" size="mini" @click="inputVoucher(8)">生成凭证</el-button>
            </div>
            <div class="item">
                <p>结转损益(合并)</p>
                <el-button type="primary" size="mini" @click="inputVoucher(9)">生成凭证</el-button>
            </div>
            <div class="item" v-if="curMonth == '12'">
                <p>结转未分配利润</p>
                <el-button type="primary" size="mini" @click="inputVoucher(10)">生成凭证</el-button>
            </div>`
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getNowDate, deleteEmptyProp, addNullObj, addNullObj2, convertCurrency, validateVal } from '@/utils'
import { backPeriodClose, getPeriodState } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
export default {
    name: 'closePeriod',
    components: { coaList, summaryList, Pagination },
    data() {
        return {
            selectCatogery: '',
            catogeryList: [],
            total1: 0,
            total2: 0,
            numberArr: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'],
            totalZh: '',
            list: [],
            temp: {
                catogeryNumber: 1,
                billDate: getNowDate(),
                voucherAttachmentNum: 0,
            },
            tableData: [{}, {}, {}, {}],
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            templetData: [],
            totalMoney1: 0,
            totalMoney2: 0,
            listQuery1: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {}
            },
            curMonth: 1,
            searchPeriodId: '',
            searchPeriodYear:'',
            searchPeriodNum: 0,
            searchPeriodName: '',
            searchPeriodCode: '',
            voucherNumber: 0,
            adjustmentPeriodFlag: ''
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
        this.getCurVoucherStatus()
    },
    methods: {
        getCurVoucherStatus() {
            var curPeriod = '2020-04'
            this.curMonth = curPeriod.split('-')[1];
            this.initBillStatus(curPeriod);
        },
        initBillStatus(str) {
            getPeriodState(str).then(res => {
                this.searchPeriodId = res.data.data.glPeriod.id
                this.searchPeriodYear = res.data.data.glPeriod.periodYear
                this.searchPeriodNum = res.data.data.glPeriod.periodNum
                this.searchPeriodName = res.data.data.glPeriod.periodName
                this.searchPeriodCode = res.data.data.glPeriod.periodCode
                this.voucherNumber = res.data.data.jeHeaderCount
                this.adjustmentPeriodFlag = res.data.data.glPeriod.adjustmentPeriodFlag
            })
        },
        getBackPeriodClose() {
            var data = {
                periodId: this.searchPeriodId,
                periodYear: this.searchPeriodYear,
                periodNum: this.searchPeriodNum,
                periodName: this.searchPeriodName,
                periodCode: this.searchPeriodCode
            }
            backPeriodClose(data).then(res => {
                if (res.data.success) {
                    this.$message.success(backBillObj.periodCode + "及其之后期间反结转完成!")
                    this.initBillStatus(backBillObj.periodCode)
                } else {
                    if (res.data.errorCode == "101") {
                        this.$message.warning("期间" + backBillObj.periodCode + "没有找到!")
                    }
                    if (res.data.errorCode == "102") {
                        this.$message.warning("无法反结转，期间" + backBillObj.periodCode + "没有结转!")
                    }
                }
            })
        },
    }
}
</script>
<style lang="scss" scoped>
@import './voucher.scss';
</style>
<style scoped>
.main{min-width: 1200px}
.billList {
    margin-top: 20px;
    display: flex;
}

.billList .item {
    margin-left: 15px;
    width: 120px;
    height: 100px;
    border: 1px #ddd solid;
    text-align: center;
    border-radius: 2px;
    font-size: 13px;
    padding-top: 8px;
}
</style>