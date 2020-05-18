<template>
    <div class="main">
        <el-row :gutter="30">
            <el-col :span="6" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 20px">
                <el-card class="box-card" style="text-align:center;height:150px">
                    <div class="itemTit">{{item}}</div>
                    <el-button type="primary" :disabled="(curMonth == '03' || curMonth == '06' || curMonth == '09' || curMonth == '12')&&index==4" @click="createVoucher(index)">生成凭证</el-button>
                </el-card>
            </el-col>
        </el-row>
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
            dataList: ['结转成本', '结转待摊费用', '结转未缴增值税', '计提附加税', '计提折旧', '计提工资', '计提所得税', '结转收入', '结转费用', '结转损益(合并)', '结转未分配利润'],
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
            searchPeriodYear: '',
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
        createVoucher(index) {
            console.log(index)
        },
        getCurVoucherStatus() {
            var curPeriod = '2020-05'
            this.curMonth = curPeriod.split('-')[1]
            this.initBillStatus(curPeriod)
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
.main {
    min-width: 1200px;
    padding: 30px 24px;
}

.itemTit {
    color:#333;font-size:16px;margin-bottom: 25px;
}

</style>