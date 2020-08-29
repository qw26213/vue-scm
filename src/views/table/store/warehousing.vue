<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">仓库:</label>
            <el-input v-model="listQuery.warehouseId" placeholder="仓库" size="mini" @change="getList" />
            <label class="label">商品:</label>
            <el-input v-model="listQuery.itemId" placeholder="商品" size="mini" @change="getList" />
            <label class="label">库存:</label>
            <el-select v-model="listQuery.qtyType" placeholder="库存" size="mini" @change="getList">
                <el-option v-for="item in qtyList" :label="item.text" :value="item.id" :key="item.id"></el-option>
            </el-select>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="项目" align="left">
                <template slot-scope="{row}">
                    <span>{{row.itemName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="行次" align="center">
                <template slot-scope="{row}">
                    <span>{{row.seqNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="本次金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.val1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="本次累计金额" align="right">
                <template slot-scope="{row}">
                    <span>{{row.val2}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getWarehousingtable } from '@/api/table'
import { getNowMonth } from '@/utils/index'
import Pagination from '@/components/Pagination'
export default {
    name: 'reportFlow',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            qtyList: [{ label: '全部', val: '' }, { label: '库存大于0', val: '1' }, { label: '库存不为0', val: '2' }, { label: '库存小于0', val: '-1' }, { label: '库存等于0', val: '0' }],
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                warehouseId: '',
                itemId: '',
                qtyType: '',
                includeZero: 1
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getWarehousingtable(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        }
    }
}
</script>
<style scoped>
.label {
    text-align: right;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
}
</style>