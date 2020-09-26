<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input size="small" v-model="listQuery.paymentTypeName" placeholder="付款方式代码/名称" style="width: 200px;" class="filter-item" />
            <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="付款方式代码" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentTypeCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="付款方式名称" align="center">
                <template slot-scope="{row}">
                    <span>{{row.paymentTypeName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="月数" align="center">
                <template slot-scope="{row}">
                    <span>{{row.month}}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="{row}">
                    <span>{{row.remarks}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可用" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDisable==0?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230">
                <template slot-scope="{row}">
                    <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
                    <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
                    <el-button type="text" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增付款方式':'修改付款方式'" :visible.sync="dialogFormVisible" width="460px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
                <el-form-item label="付款方式代码" prop="paymentTypeCode">
                    <el-input v-model="temp.paymentTypeCode" placeholder="付款方式代码" />
                </el-form-item>
                <el-form-item label="付款方式名称" prop="paymentTypeName">
                    <el-input v-model="temp.paymentTypeName" placeholder="付款方式名称" />
                </el-form-item>
                <el-form-item label="月数" prop="month">
                    <el-input-number v-model="temp.month" :min="0" :max="100" label="月数" />
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="temp.remarks" placeholder="备注" />
                </el-form-item>
                <el-form-item label="是否可用" prop="isDisable">
                    <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
                    <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getPaymentType, savePaymentType, delPaymentType, updatePaymentTypeDisabled } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
    name: 'basePaymentType',
    components: { Pagination },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                paymentTypeName: ''
            },
            temp: {
                id: '',
                paymentTypeName: '',
                paymentTypeCode: '',
                month: 0,
                remarks: '',
                isDisable: 0
            },
            resetTemp: {
                id: '',
                paymentTypeName: '',
                paymentTypeCode: '',
                month: 0,
                remarks: '',
                isDisable: 0
            },
            dialogFormVisible: false,
            dialogStatus: '',
            rules: {
                paymentTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
                paymentTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
                isDisable: [{ required: true }]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            this.listLoading = true
            getPaymentType(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleAdd() {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            for (var key in this.temp) {
                this.temp[key] = this.resetTemp[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(row) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            for (var key in this.temp) {
                this.temp[key] = row[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        updateStatus(data) {
            this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.changeAvaiable(data);
            });
        },
        changeAvaiable(data) {
            var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
            updatePaymentTypeDisabled(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleFilter() {
            this.listQuery.page = 1
            this.getList()
        },
        handleDel(id) {
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id)
            });
        },
        handleModify() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    savePaymentType(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('修改成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        handleCreate() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    savePaymentType(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('新增成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        delItem(id) {
            delPaymentType(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.dialogFormVisible = false
                    this.$message.success('删除成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        }
    }
}
</script>