<template>
    <div class="app-container">
        <div class="filterDiv clearfix">
            <label class="label">仓库:</label>
            <warehouseList @selectChange="selectChange" ctrType="list" />
            <label class="label ml10">商品:</label>
            <itemList @changeVal="selectChange" />
            <label class="label ml10">库存数:</label>
            <el-select v-model="listQuery.qtyType" placeholder="库存" size="small">
                <el-option v-for="item in qtyList" :label="item.label" :value="item.val" :key="item.val"></el-option>
            </el-select>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button style="float:right;margin-top:5px" size="small" type="default" @click="exportBook">导出</el-button>
            <el-button style="float:right;margin-top:5px" size="small" type="default" @click="printBook">打印</el-button>
        </div>
        <div class="contentDiv">
            <el-table :key="tableKey" v-loading="listLoading" :data="pageData" fit highlight-current-row style="width: 100%;" size="small">
                <el-table-column label="仓库名称" align="left">
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
            <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getDataByPage" />
        </div>
    </div>
</template>
<script>
import { getWarehousetable, exportWarehouseBook, printWarehouseBook } from '@/api/table'
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
            pageData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                warehouseId: '',
                itemId: '',
                qtyType: null,
                pageIndex: 1,
                pageNum: 20
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
        exportBook() {
            exportWarehouseBook(this.listQuery)
        },
        printBook() {
            printWarehouseBook(this.listQuery).then(res => {
                window.open("http://"+window.location.host+res.data.data)
            }).catch(err => {
                this.listLoading = false
            })
        },
        getDataByPage() {
            var pageIndex = this.listQuery.pageIndex
            var arr = []
            var min = pageIndex * 20 - 20
            var max = pageIndex * 20 <= this.total ? pageIndex * 20 : this.total
            for (var i = min; i < max; i++) {
                arr.push(this.tableData[i])
            }
            this.pageData = arr
        },
        getList() {
            this.listLoading = true
            getWarehousetable(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = this.tableData.length
                this.getDataByPage()
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