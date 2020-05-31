<template>
    <div class="app-container">
        <div class="filter-container">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.uploadDate1" type="date" placeholder="开始日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.uploadDate2" type="date" placeholder="结束日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <custList @selectChange="selectChange" ctrType="list"></custList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.queryParam.staffId"></staffList>
            <el-button size="mini" type="primary" @click="getList">查询</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
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
            <el-table-column label="标签" align="center">
                <template slot-scope="{row}">
                    <span>{{row.label}}</span>
                </template>
            </el-table-column>
            <el-table-column label="文件大小" align="center">
                <template slot-scope="{row}">
                    <span>{{row.fileSizeCategory}}</span>
                </template>
            </el-table-column>
            <el-table-column label="上传时间" align="center">
                <template slot-scope="{row}">
                    <span>{{row.updateDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="180">
                <template slot-scope="{row}">
                    <el-button class="ctrl" type="primary" size="mini" @click="showImg(row)">查看图片</el-button>
                    <el-button class="ctrl" type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" title="查看图片" :visible.sync="dialogFormVisible" width="720px">
            <div class="imgWrap" :style="{backgroundImage:'url('+imgUrl+')'}">
            </div>
        </el-dialog>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
    </div>
</template>
<script>
import { getCrmFileInfo } from '@/api/visit'
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
            imgUrl: '',
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    uploadDate1: '2020-01-01',
                    uploadDate2: '2020-06-01',
                    headerId: this.$route.query.id,
                    sign: 1
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
            getCrmFileInfo(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        showImg(obj) {
            this.dialogFormVisible = true
            this.imgUrl = obj.baseUrl + obj.fileUrl
        },
        handleDel() {

        }
    }
}
</script>
<style scoped>
    .imgWrap{width:100%;height:400px;background-color: rgba(0,0,0,0.36);background-position: center center; background-size: contain;background-repeat: no-repeat;}
</style>