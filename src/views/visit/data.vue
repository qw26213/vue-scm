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
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="拜访日期" align="center">
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
            <el-table-column label="标签">
                <template slot-scope="{row}">
                    <span>{{row.label}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文件大小">
                <template slot-scope="{row}">
                    <span>{{row.fileSizeCategory}}</span>
                </template>
            </el-table-column>
            <el-table-column label="上传时间">
                <template slot-scope="{row}">
                    <span>{{row.udateDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="80">
                <template slot-scope="{row}">
                    <span class="ctrl" v-if="row.status==0" @click="handleDel(row.id)">删除</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
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
            }).catch(err => {
                this.listLoading = false
            })
        },
        selectChange() {

        },
        handleDel() {

        }
    }
}
</script>