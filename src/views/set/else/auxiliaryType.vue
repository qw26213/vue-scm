<template>
    <div class="app-container">
        <div class="filter-container1" style="margin-bottom:20px">
            <label class="label">辅助核算类型</label>
            <el-select v-model="listQuery.auxiliaryTypeCode" style="min-width:200px;width:200px" size="mini">
                <el-option v-for="item in auxiliaryArr" :key="item.id" :label="item.auxiliaryTypeName" :value="item.auxiliaryTypeCode"></el-option>
            </el-select>
            <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleAdd1">新增辅助核算类型</el-button>
            <el-button size="mini" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleAdd2">新增辅助核算项</el-button>
        </div>
        <el-table :key="tableKey" :data="tableData" border fit highlight-current-row style="width: 100%;">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="代码">
                <template slot-scope="{row}">
                    <span>{{ row.templetName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="名称" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.templetName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可用" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.updateDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="外部ID" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.updateDate }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button type="default" size="mini" @click="toModify(row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="delModal(row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getData" />
    </div>
</template>
<script>
import { getAuxiliaryType, synVoucherData, delTempletHeader } from '@/api/voucher'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
    name: 'userList',
    components: { Pagination },
    data() {
        return {
            listQuery: {
                auxiliaryTypeCode: "",
                pageNum: 10,
                queryParam: {}
            },
            auxiliaryArr: [],
            tableKey: 0,
            tableData: [],
            total: 0
        }
    },
    created() {
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
            getAuxiliaryType().then(res => {
                this.auxiliaryArr = res.data.data
                this.total = res.data.totalNum
            })
        },
        handleAdd1() {

        },
        handleAdd2() {

        }
    }
}
</script>
<style scoped>
.label {
    font-size: 14px;
    margin-right: 5px;
    color: #333;
    margin-left: 10px
}

.label:first-child {
    margin-left: 0
}
</style>