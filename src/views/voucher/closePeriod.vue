<template>
    <div class="main">
        <div class="filter-container" style="margin-bottom:15px">
            <label class="label">会计期间：</label>
            <el-select v-model="periodCode" size="small" placeholder="会计期间">
                <el-option v-for="item in periodArr" :key="item.id" :label="item.text" :value="item.id"></el-option>
            </el-select>
            <span style="font-size:14px;margin:0 20px">本期凭证数：10条</span>
            <el-button v-if="adjustmentPeriodFlag == 1" size="small" type="primary" style="width:100px" @click="executePeriodClose">结账</el-button>
            <el-button v-else size="small" type="primary" style="width:100px" @click="execuBackPeriodClose">反结账</el-button>
            <el-button size="small" type="default" style="width:100px" @click="getList">日志</el-button>
        </div>
        <el-row :gutter="30">
            <el-col :span="6" v-for="(item, index) in dataList" :key="index" style="margin-bottom: 20px">
                <el-card class="box-card" style="text-align:center;height:150px">
                    <div class="itemTit">{{item}}</div>
                    <el-button type="primary" :disabled="(curMonth == '03' || curMonth == '06' || curMonth == '09' || curMonth == '12')&&index==4" @click="createVoucher(index)" plain>生成凭证</el-button>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :close-on-click-modal="false" :title="设置附加税率" :visible.sync="dialogFormVisible" width="500px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 300px; margin-left:50px;">
                <el-form-item label="计提方式" prop="month">
                    <el-radio v-model="temp.month" :label="1">按月</el-radio>
                    <el-radio v-model="temp.month" :label="3">按季</el-radio>
                </el-form-item>
                <el-form-item label="结转百分比：" prop="routeCode">
                    <el-input v-model="temp.routeCode" placeholder="结转百分比" /> <span>%</span>
                </el-form-item>
                <el-form-item label="教育费附加：" prop="percent1">
                    <el-input v-model="temp.percent1" placeholder="教育费附加" />
                </el-form-item>
                <el-form-item label="地方教育费附加：" prop="percent2">
                    <el-input v-model="temp.percent2" placeholder="地方教育费附加" />
                </el-form-item>
                <p class="f12" style="margin-left:40px">注：请输入0-100的数</p>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getNowDate } from '@/utils'
import { backPeriodClose, getPeriodState, periodClose } from '@/api/voucher'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
export default {
    name: 'closePeriod',
    components: { coaList, summaryList, Pagination },
    data() {
        return {
            dataList: ['结转成本', '结转待摊费用', '结转未缴增值税', '计提附加税', '计提折旧', '计提工资', '计提所得税', '结转收入', '结转费用', '结转损益(合并)', '结转未分配利润'],
            periodCode: '',
            curMonth: 1,
            searchPeriodId: '',
            searchPeriodYear: '',
            searchPeriodNum: 0,
            searchPeriodName: '',
            searchPeriodCode: '',
            voucherNumber: 0,
            curIndex: 0,
            adjustmentPeriodFlag: -1,
            dialogFormVisible: false,
            temp: {},
            rules: {}
        }
    },
    computed: {
        ...mapGetters([
            'periodArr',
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
        this.$store.dispatch('voucher/getPeriod')
        this.getCurVoucherStatus()
    },
    watch: {
        periodArr(val) {
            if (val.length > 0) {
                this.periodCode = val[0].id
            }
        }
    },
    methods: {
        getList() {

        },
        createVoucher(index) {
            this.curIndex = index
            if (index == 3 || index == 6) {
                this.dialogFormVisible = true
            }
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
        execuBackPeriodClose() {
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
        executePeriodClose() {
            var data = {
                periodId: this.searchPeriodId,
                periodYear: this.searchPeriodYear,
                periodNum: this.searchPeriodNum,
                periodName: this.searchPeriodName,
                periodCode: this.searchPeriodCode
            }
            backPeriodClose(data).then(res => {
                if (res.data.errorCode == "0") {
                    this.$message.success(data.periodYear + "年第" + data.periodNum + "期结账完成!");
                } else {
                    if (res.data.errorCode == "-100") {
                        this.$message.warning(res.data.msg)
                    } else if (res.data.errorCode == "-102") {
                        this.$message.warning(res.data.msg)
                    } else if (res.data.errorCode == "-101") {
                        this.$message.warning(res.data.msg)
                    } else if (res.data.errorCode == "-103") {
                        this.$message.warning(res.data.msg)
                    } else if (res.data.errorCode == "-8") {
                        this.$message.warning(res.data.msg)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import './voucher.scss';
</style>
<style scoped>
.main {
    min-width: 1200px;
    padding: 20px 24px;
}

.itemTit {
    color: #333;
    font-size: 16px;
    margin-bottom: 25px;
}
</style>