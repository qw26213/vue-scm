<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input size="small" v-model="listQuery.priceGroupName" placeholder="价格组名称" style="width: 200px;" class="filter-item" />
            <el-input size="small" v-model="listQuery.priceGroupCode" placeholder="价格组代码" style="width: 200px;" class="filter-item" />
            <el-button size="small" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
            <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="序号" type="index" width="100" align="center">
            </el-table-column>
            <el-table-column label="价格组代码">
                <template slot-scope="{row}">
                    <span>{{row.priceGroupCode}}</span>
                </template>
            </el-table-column>
            <el-table-column label="价格组名称">
                <template slot-scope="{row}">
                    <span>{{row.priceGroupName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否可用" align="center">
                <template slot-scope="{row}">
                    <span>{{row.isDisable==0?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注">
                <template slot-scope="{row}">
                    <span>{{row.remarks}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="260">
                <template slot-scope="{row}">
                    <el-button type="primary" size="small" @click="handleAssign(row)">分配客户</el-button>
                    <el-button type="default" size="small" @click="handleCompile(row)">编辑</el-button>
                    <el-button type="danger" size="small" @click="handleDel(row.id)">删除</el-button>
                    <el-button type="warning" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增价格组':'修改价格组'" :visible.sync="dialogFormVisible" width="440px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 360px; margin-left:20px;">
                <el-form-item label="价格组代码" prop="priceGroupCode">
                    <el-input v-model="temp.priceGroupCode" placeholder="价格组代码" />
                </el-form-item>
                <el-form-item label="价格组名称" prop="priceGroupName">
                    <el-input v-model="temp.priceGroupName" placeholder="价格组名称" />
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input v-model="temp.remarks" placeholder="备注" />
                </el-form-item>
                <el-form-item label="是否可用" prop="isDisable">
                    <el-radio v-model="temp.isDisable" label="0">是</el-radio>
                    <el-radio v-model="temp.isDisable" label="1">否</el-radio>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
            </div>
        </el-dialog>
        <assignCust ref="custTable" :tit="handleObj.priceGroupName + handleObj.priceGroupCode" type="group" :showModal.sync="showModal" :handleObj="handleObj" @handleAssign="handleAssignCust"></assignCust>
    </div>
</template>
<script>
import { getPriceGroup, savePriceGroup, delPriceGroup, updatePriceGroupDisabled, updatePriceGroupIdByCustIdList } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import assignCust from '@/components/assignCust'
import { getStrByData, deepClone } from '@/utils'
export default {
    components: { Pagination, assignCust },
    name: 'priceGroup',
    data() {
        return {
            tableKey: 0,
            tableData: [],
            custList: [],
            handleObj: {},
            selectIdArr: [], // 初始化时被选的数组
            total: 0,
            listLoading: true,
            listQuery: {
                page: 1,
                priceGroupCode: '',
                priceGroupName: ''
            },
            temp: {
                priceGroupName: '',
                priceGroupCode: '',
                remarks: '',
                isDisable: "0"
            },
            dialogFormVisible: false,
            showModal: false,
            dialogStatus: '',
            rules: {
                priceGroupName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
                priceGroupCode: [{ required: true, message: '代码不能为空', trigger: 'change' }],
                isDisable: [{ required: false }]
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        handleAssign(row) {
            this.handleObj = row
            this.showModal = true
        },
        handleAssignCust(arr) {
            var obj = {
                priceGroupId: this.handleObj.id,
                custIdList: arr
            }
            updatePriceGroupIdByCustIdList(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.$refs.custTable.closeModal()
                    this.getList()
                    this.$message.success('分配客户成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getList() {
            this.listLoading = true
            getPriceGroup(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            })
        },
        handleAdd(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            this.temp.id = ''
            this.temp.priceGroupName = ''
            this.temp.priceGroupCode = ''
            this.temp.isDisable = '0'
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            this.temp.id = obj.id
            this.temp.priceGroupName = obj.priceGroupName
            this.temp.priceGroupCode = obj.priceGroupCode
            this.temp.isDisable = String(obj.isDisable)
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
            updatePriceGroupDisabled(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success(data.isDisable == 1 ? '解禁？' : '禁用？' + '成功')
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
            this.$confirm('确认要删除吗?', '提示', {
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
                    savePriceGroup(this.temp).then(res => {
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
                    savePriceGroup(this.temp).then(res => {
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
            delPriceGroup(id).then(res => {
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
<style scoped>
.curTit {
    font-size: 14px;
    margin-bottom: 10px
}
</style>