<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.visitDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.visitDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <custList @selectChange="selectChange" ctrType="list"></custList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.queryParam.staffId"></staffList>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="日期" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.visitDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务员">
                <template slot-scope="{row}">
                    <span>{{row.staffName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户">
                <template slot-scope="{row}">
                    <span>{{row.custName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="签到时间" width="150">
                <template slot-scope="{row}">
                    <span>{{row.checkInTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="偏差(米)" width="100" right="right">
                <template slot-scope="{row}">
                    <span>{{row.distanceM}}</span>
                </template>
            </el-table-column>
            <el-table-column label="签退时间" width="150">
                <template slot-scope="{row}">
                    <span>{{row.checkOutTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="偏差(米)" width="100" right="right">
                <template slot-scope="{row}">
                    <span>{{row.distanceOutM}}</span>
                </template>
            </el-table-column>
            <el-table-column label="停留时间" show-overflow-tooltip>
                <template slot-scope="{row}">
                    <span>{{row.staySecondsStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用Gps" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.isGps==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否跳过" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.isSkip==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="跳过原因" show-overflow-tooitip>
                <template slot-scope="{row}">
                    <span>{{row.skipReason}}</span>
                </template>
            </el-table-column>
            <el-table-column label="关联图片" align="center">
                <template slot-scope="{row}">
                    <el-button size="mini" type="primary" @click="handleLink(row.id)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { getVisitData } from '@/api/visit'
import Pagination from '@/components/Pagination'
import { getNowDate } from '@/utils/auth'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
export default {
    name: 'presaleData',
    components: { Pagination,custList,staffList },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            isBillDate: '0',
            dialogFormVisible: false,
            listLoading: true,
            curBillId: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    visitDate1: '2020-01-01',
                    visitDate2: '2020-06-01',
                    staffId: '',
                    custId: ''
                }
            }
        }
    },
    filters: {
        Fixed: function (num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    created() {
        this.getList();
    },
    methods: {
        getList() {
            this.listLoading = true
            getVisitData(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleLink(id) {
            this.$router.push('/visit/table?id='+id)
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        },
        handleDel() {

        }
    }
}
</script>