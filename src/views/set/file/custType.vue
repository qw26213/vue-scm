<template>
    <div class="main">
        <div class="leftTree">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all :expand-on-click-node="false" accordion></el-tree>
        </div>
        <div class="app-container">
            <div class="filter-container">
                <el-button size="small" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" row-key="id">
                <el-table-column label="序号" type="index" width="100" align="center"></el-table-column>
                <el-table-column label="客户类别代码">
                    <template slot-scope="{row}">
                        <span>{{row.custTypeCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="客户类别名称">
                    <template slot-scope="{row}">
                        <span>{{row.custTypeName}}</span>
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
                <el-table-column label="操作" align="center" width="250">
                    <template slot-scope="{row}">
                        <el-button type="text" size="small" @click="handleCompile(row)">编辑</el-button>
                        <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
                        <el-button type="text" size="small" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
                        <el-button type="text" size="small" v-if="row.leaf==1" @click="handleAssign(row)">分配客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增客户类别':'修改客户类别'" :visible.sync="dialogFormVisible" width="460px">
              <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="110px" style="width: 400px; margin-left:10px;">
                <el-form-item label="客户类别代码" prop="custTypeCode">
                  <el-input v-model="temp.custTypeCode" placeholder="客户类别代码" />
                </el-form-item>
                <el-form-item label="客户类别名称" prop="custTypeName">
                  <el-input v-model="temp.custTypeName" placeholder="客户类别名称" />
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
            <assignCust ref="custTable" :tit="handleObj.custTypeName + handleObj.custTypeCode" :showModal.sync="showModal" type="custType" :handleObj="handleObj" @handleAssign="handleAssignCust"></assignCust>
        </div>
    </div>
</template>
<script>
import { getCustType, saveCustType, delCustType, getCustTypeTree, updateCustTypeDisabled, getCustTypeTreeDataByParentId, updateCustTypeIdByCustIdList } from '@/api/basedata'
import { getStrByData } from '@/utils'
import assignCust from '@/components/assignCust'
export default {
    name: 'baseCustType',
    components: { assignCust },
    data() {
        return {
            tableKey: 0,
            tableData: [],
            custList: [],
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'custTypeName'
            },
            handleObj: {},
            selectIdArr: [],
            total: 0,
            listLoading: true,
            showModal: false,
            parentId: '',
            temp: {
                id: '',
                custTypeName: '',
                custTypeCode: '',
                remarks: '',
                isDisable: 0,
                parentId: ""
            },
            resetTemp: {
                id: '',
                custTypeName: '',
                custTypeCode: '',
                remarks: '',
                isDisable: 0,
                parentId: ""
            },
            dialogFormVisible: false,
            showModal: false,
            dialogStatus: '',
            rules: {
                custTypeName: [{ required: true, message: '名称不能为空', trigger: 'change' }],
                custTypeCode: [{ required: true, message: '代码不能为空', trigger: 'change' }]
            }
        }
    },
    created() {
        this.getList();
        this.getLeftTree();
    },
    methods: {
        getLeftTree() {
            getCustTypeTree({ parentId: '', includeRoot: 1 }).then(res => {
                this.treeData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleNodeClick(e) {
            this.parentId = e.id;
            this.temp.parentId = e.id;
            this.getList();
        },
        handleAssign(row) {
            this.showModal = true
            this.handleObj = row
        },
        handleAssignCust(arr) {
            var obj = {
                custTypeId: this.handleObj.id,
                custIdList: arr
            }
            updateCustTypeIdByCustIdList(obj).then(res => {
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
            getCustTypeTreeDataByParentId({ parentId: this.parentId, includeRoot: 0 }).then(res => {
                this.listLoading = false
                res.data.data.map(item => {
                    if (!item.id) {
                        item.id = '1111111'
                    }
                })
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleAdd() {
            if (this.parentId == '') {
                this.$message.error('请先选择一个上级客户类别');
                return
            }
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            for (var key in this.temp) {
                this.temp[key] = this.resetTemp[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            for (var key in this.temp) {
                this.temp[key] = obj[key]
            }
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleFilter() {
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
            updateCustTypeDisabled(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList()
                    this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleModify() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveCustType(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.getLeftTree();
                            this.dialogFormVisible = false
                            this.$message.success('修改成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch((err) => {
                        this.$message.error("系统错误");
                    })
                }
            })
        },
        handleCreate() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveCustType(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.getLeftTree();
                            this.dialogFormVisible = false
                            this.$message.success('新增成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    }).catch((err) => {
                        this.$message.error("系统错误");
                    })
                }
            })
        },
        delItem(id) {
            delCustType(id).then(res => {
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

.main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    padding-left: 180px;
}

.leftTree {
    width: 160px;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    border: 1px #eee solid;
}

.tableDiv {
    width: 100%;
}
</style>