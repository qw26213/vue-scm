<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="出库单" :visible.sync="visible" width="800px" @close="$parent.modalTableVisible1 = false; visible = false">
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="单据日期" align="center" width="120">
                  <template slot-scope="{row}">
                    <span>{{ row.billDate }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="单据号">
                  <template slot-scope="{row}">
                    <span>{{ row.billNo }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="客户">
                  <template slot-scope="{row}">
                    <span>{{ row.custName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="仓库">
                  <template slot-scope="{row}">
                    <span>{{ row.warehouseName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="车辆">
                  <template slot-scope="{row}">
                    <span>{{ row.truckName }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="small" @click="handleSelect(row.id)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import { getOutboundOrderBySalesHeaderId } from '@/api/sale'
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
                this.tableData = []
                this.getList()
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
        getList() {
            const obj = { salesHeaderId: this.headerId }
            getOutboundOrderBySalesHeaderId(obj).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(() => {
                this.listLoading = false
            })
        },
        handleSelect(id) {
            this.$parent.modalTableVisible1 = false
            this.visible = false
            this.$router.push('/store/outboundOrderDetail?id=' + id)
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