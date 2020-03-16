<template>
    <div class="app-container">
        <div class="filter-container1" style="margin-bottom:20px">
            <el-checkbox v-model="listQuery.period" false-label="0" true-label="1" style="margin-right:10px">会计期间</el-checkbox>
            <el-checkbox v-model="listQuery.coa" false-label="0" true-label="1" style="margin-right:10px">同步系统新增科目</el-checkbox>
            <el-checkbox v-model="listQuery.coaN" false-label="0" true-label="1" style="margin-right:10px">同步系统科目名称</el-checkbox>
            <el-checkbox v-model="listQuery.coaCrdr" false-label="0" true-label="1" style="margin-right:10px">同步系统科目方向</el-checkbox>
            <el-checkbox v-model="listQuery.templet" false-label="0" true-label="1" style="margin-right:10px">同步凭证模板(系统)</el-checkbox>
            <el-button size="mini" type="primary" @click="getData('0')">检查</el-button>
            <el-button size="mini" type="primary" @click="getData('1')">执行同步</el-button>
        </div>
        <el-table :data="tableData" border fit resize empty-text="无同步数据" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.coaName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="方向" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.crDrStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作类型" min-width="80">
                <template slot-scope="{row}">
                    <span>{{row.unchageableFlag == 1 ? '新增' : '编辑'}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { synbasedata } from '@/api/user'
export default {
    data() {
        return {
            listQuery: {
                coahierarchyId: '',
                period: '1',
                coa: '1',
                coaN: '1',
                coaCrdr: '1',
                templet: '1'
            },
            tableData: [],
        }
    },
    mounted() {
        // this.getData('0')
    },
    methods: {
        getData(type) {
            this.listQuery.isAutoCommit = type
            synbasedata(this.listQuery).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success('同步数据完成！')
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
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