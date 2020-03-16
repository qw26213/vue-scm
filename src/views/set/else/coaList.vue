<template>
    <div class="app-container">
        <div class="filter-container1" style="margin-bottom:20px">
            <el-radio-group v-model="coaClassCode" @change="getData">
                <el-radio-button v-for="(item,index) in coaClassList" :key="index" :label="item.coaClassCode">{{item.coaClassName}}</el-radio-button>
            </el-radio-group>
            <el-button type="primary" style="float:right" @click="getData('0')">校正名称</el-button>
        </div>
        <el-table :data="tableData" border fit resize empty-text="无同步数据" style="width: 100%;" size="mini">
            <el-table-column label="科目编码">
                <template slot-scope="{row}">
                    <span>{{row.coaCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="科目名称" min-width="100">
                <template slot-scope="{row}">
                    <span v-html="row.pageCoaName"></span>
                </template>
            </el-table-column>
            <el-table-column label="科目分类" min-width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.coaClassName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="方向" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.crDr == 1?'借':'贷'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="辅助核算" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isAuxiliary == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="币种核算" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isCurrency == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="数量核算" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isQuantity == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="禁用" min-width="80" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDisable == 1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini">新增下级</el-button>
                    <el-button type="default" size="mini">修改</el-button>
                    <el-button type="danger" size="mini">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { getCoaDatatables, coaClassification } from '@/api/user'
export default {
    data() {
        return {
            coaClassCode: '',
            coaClassList: [],
            tableData: [],
        }
    },
    mounted() {
        this.getCoaClass()
        
    },
    methods: {
        getCoaClass() {
            coaClassification({ coaClassLevel: 1 }).then(res => {
                this.coaClassList = res.data.data
                this.coaClassCode = res.data.data[0].coaClassCode
                this.getData()
            })
        },
        getData() {
            getCoaDatatables({coaClassCode: this.coaClassCode}).then(res => {
                if (res.data.errorCode == 0) {
                    this.tableData = res.data.data
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