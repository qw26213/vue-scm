<template>
    <div class="app-container">
        <div class="filter-container">
            <label class="label">仓库:</label>
            <warehouseList @selectChange="selectChange" ctrType="list" />
            <label class="label ml10">商品:</label>
            <itemList @changeVal="selectChange" />
            <label class="label ml10">库存:</label>
            <el-select v-model="listQuery.qtyType" placeholder="库存" size="mini">
                <el-option v-for="item in qtyList" :label="item.label" :value="item.val" :key="item.val"></el-option>
            </el-select>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="仓库名称" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.warehouseName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" align="left">
                <template slot-scope="{row}">
                    <span>{{ row.itemName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="商品规格" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.norms }}</span>
                </template>
            </el-table-column>
            <el-table-column label="口味/特性" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.def1 }}</span>
                </template>
            </el-table-column>
            <el-table-column label="批次号" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.batchNo }}</span>
                </template>
            </el-table-column>
            <el-table-column label="单位" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.uom }}</span>
                </template>
            </el-table-column>
            <el-table-column label="库存" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.qty }}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getWarehousetable } from '@/api/table'
import { getNowMonth } from '@/utils/index'
import warehouseList from '@/components/selects/warehouseList';
import itemList from '@/components/selects/goodList';
import Pagination from '@/components/Pagination'
export default {
    name: 'reportFlow',
    components: { Pagination, warehouseList, itemList },
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
                qtyType: null
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery[key] = obj[key]
            }
        },
        getList() {
            this.listLoading = true
            getWarehousetable(this.listQuery).then(res => {
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
    padding: 0 5px;
}
</style>