<template>
    <div class="app-container">
        <div class="filterDiv" style="text-align:right">
            <el-button size="small" class="filter-item" type="primary" @click="addVoucher">新增凭证模板</el-button>
            <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleSync">同步模板数据</el-button>
        </div>
        <div class="contentDiv">
        <el-table :key="tableKey" :data="tableData" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="模板名称">
                <template slot-scope="{row}">
                    <span>{{ row.templetName }}{{ row.isSystem == 1 ? '(系统)' : '' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="模板类型" align="center">
                <template slot-scope="{row}">
                    <span v-for="item in templetTypeList" v-if="item.id==row.templetType" :key="item.id">{{item.templetTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建/修改时间" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.updateDate | parseTime }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button v-if="row.isSystem!=1" type="text" size="small" @click="toModify(row)">编辑</el-button>
                    <el-button type="text" size="small" @click="toModal(row)">查看</el-button>
                    <el-button type="text" size="small" @click="delModal(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getData" />
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getTempletHeader, synVoucherData, delTempletHeader } from '@/api/voucher'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
    name: 'userList',
    components: { Pagination },
    data() {
        return {
            listQuery: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {}
            },
            tableKey: 0,
            tableData: [],
            total: 0
        }
    },
    computed: {
        ...mapGetters([
            'templetTypeList'
        ])
    },
    created() {
        this.$store.dispatch('voucher/getTempletType')
        this.getData()
    },
    methods: {
        delModal(id) {
            this.$confirm('如果是系统模板，在删除后可以“基础数据同步=>执行同步”来恢复系统模板。确定要删除这个模板吗?', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTempletHeader(id).then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('删除模板成功')
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        handleSync() {
            this.$confirm('确定要同步数据吗?', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var data = { bookId: sessionStorage.bookId, coahierarchyId: sessionStorage.coahierarchyId }
                synVoucherData(data).then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('同步凭证模板数据完成')
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        getData() {
            getTempletHeader(this.listQuery).then(res => {
                this.tableData = res.data.data
                this.total = res.data.totalNum
            })
        },
        addVoucher() {
            this.$router.push('/voucher/add')
        }
    }
}
</script>
</div>