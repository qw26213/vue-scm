<template>
    <div class="app-container">
        <div class="filterDiv">
            <label class="label">截止日期</label>
            <el-date-picker v-model="rep.billDate2" :editable="false" type="date" placeholder="截止日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
            <el-button size="small" type="primary" @click="createvoucher">生成凭证</el-button>
            <el-button size="small" type="primary" @click="queryLog">查看日志</el-button>
        </div>
        <div class="contentDiv clearfix">
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isPurchase" /><span class="label-item">进货单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isPurchaseReturned" /><span class="label-item">采购退货单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isSales" /><span class="label-item">销售单/销售订单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isSalesReturned" /><span class="label-item">销售退货单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isPresale" /><span class="label-item">预收单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isPresaleReturned" /><span class="label-item">预收退款单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isReceive" /><span class="label-item">收款单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isPayment" /><span class="label-item">付款单</span>
            <el-checkbox :false-label="0" :true-label="1" style="float:left;margin-right:5px" v-model="rep.isInventory" /><span class="label-item">盘点单</span>
        </div>
    </div>
</template>
<script>
import { buildVoucherByBill, voucherLogList } from '@/api/voucher.js'
import { getNowDate } from '@/utils/auth'
export default {
    data() {
        return {
          rep:{
            billDate2: getNowDate(),
            isPurchase: 1,
            isPurchaseReturned: 1,
            isSales: 1,
            isSalesReturned: 1,
            isPresale: 1,
            isPresaleReturned: 1,
            isReceive: 1,
            isPayment: 1,
            isInventory: 1
          }
        }
    },
    mounted() {

    },
    methods: {
        createvoucher() {
            buildVoucherByBill(this.rep).then(res => {
                if (res.data.errorCode === '0') {
                    this.$message.success('生成日志成功')
                }
            })
        },
        queryLog() {
          voucherLogList().then(res => {
            console.log(res.data.data)
          })
        }
    }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}
.label-item{margin-right:  15px; float: left;}
</style>