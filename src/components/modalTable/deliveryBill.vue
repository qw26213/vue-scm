<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="选择配送单" :visible.sync="visible" width="800px">
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="单据日期" align="center" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.billDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单据号" width="100">
                    <template slot-scope="{row}">
                        <span>{{row.billNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户">
                    <template slot-scope="{row}">
                        <span>{{row.custName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="使用预收" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.advPayAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="现结金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.currPayAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="价税合计" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.itemAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="返利金额" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.rebateAmount | Fixed}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="small" @click="handleSelect(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { getDeliveryBySalesHeaderId, getDeliveryByOutboundOrderHeaderId } from '@/api/sale'
export default {
    props: ['modalTableVisible', 'headerId', 'type'],
    data() {
        return {
            tableKey: 0,
            visible: false,
            tableData: [],
            listLoading: true
        }
    },
    watch: {
        'modalTableVisible' (val) {
            this.visible = val
            if (val) {
                this.type === 's' ? this.getList1() : this.getList2()
            }
        }
    },
    filters: {
        Fixed: function(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    methods: {
        getList1() {
            const obj = { salesHeaderId: this.headerId }
            getDeliveryBySalesHeaderId(obj).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(() => {
                this.listLoading = false
            })
        },
        getList2() {
            const obj = { OutboundOrderHeaderId: this.headerId }
            getDeliveryByOutboundOrderHeaderId(obj).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(() => {
                this.listLoading = false
            })
        },
        handleSelect(id) {
            this.$parent.modalTableVisible = false
            this.$router.push('/sale/deliveryDetail?id=' + id)
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog .el-dialog__body {
    min-height: 240px;
    max-height: 480px;
    padding-top: 10px !important;
    overflow: auto
}
</style>