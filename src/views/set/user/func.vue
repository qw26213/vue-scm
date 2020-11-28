<template>
    <div class="app-container">
        <!-- <div class="filter-container">
      <el-button size="small" class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-plus" @click="handleAdd">新增权限</el-button>
    </div> -->
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" size="small" empty-text="暂无权限" border fit highlight-current-row row-key="id" :indent="30" style="width: 100%;">
            <el-table-column label="序号" type="index" width="100" align="center" />
            <el-table-column label="权限代码">
                <template slot-scope="{row}">
                    <span>{{ row.funcCode }}</span>
                </template>
            </el-table-column>
            <el-table-column label="权限名称">
                <template slot-scope="{row}">
                    <span>{{ row.funcName }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" @click="showDetail(row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getFuncsTree } from '@/api/user'
export default {
    name: 'UserFunc',
    data() {
        return {
            tableKey: 0,
            tableData: [],
            list: [],
            listLoading: false,
            defaultProps: {
                children: 'children',
                label: 'label'
            }
        }
    },
    created() {
        sessionStorage.removeItem('roleInfo')
        this.getData()
    },
    methods: {
        showDetail(obj) {
            sessionStorage.roleInfo = JSON.stringify(obj)
            this.$message.warning('暂无开发')
        },
        getCheckedNodes() {
            var permission = []
            var roles = this.$refs.tree.getCheckedNodes()
            for (var i = 0; i < roles.length; i++) {
                permission.push(roles[i].id)
            }
            return permission
        },
        async getData() {
            this.listLoading = true
            const { data } = await getFuncsTree()
            this.tableData = data.data
            this.listLoading = false
        }
    }
}
</script>
<style scoped>
.edit-input {
    padding-right: 100px;
}

.cancel-btn {
    position: absolute;
    right: 15px;
    top: 10px;
}
</style>