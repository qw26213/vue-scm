<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="选择配送单" :visible.sync="visible" width="800px" @close="$parent.modalTableVisible = false">
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="单据日期" align="center" width="120">
                  <template slot-scope="{row}">
                    <span>{{ row.billDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="销售单号" min-width="120" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.billNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="配送单号" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.deliveryNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="联系人" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.contact }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="电话" min-width="100" align="center">
                  <template slot-scope="{row}">
                    <span>{{ row.tel }}</span>
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
        'modalTableVisible'(val) {
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