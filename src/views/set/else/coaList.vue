<template>
    <div class="app-container">
        <div class="filter-container1" style="margin-bottom:20px">
            <el-radio-group v-model="coaClassCode" @change="getData">
                <el-radio-button v-for="(item,index) in coaClassList" :key="index" :label="item.coaClassCode">{{item.coaClassName}}</el-radio-button>
            </el-radio-group>
            <el-button type="primary" style="float:right" @click="updateDispNameByUuid()">校正名称</el-button>
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
            <el-table-column label="操作" width="260" align="center">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleAdd(row)">新增下级</el-button>
                    <el-button type="default" size="mini" @click="handleCompile(row)">修改</el-button>
                    <el-button type="danger" size="mini" @click="handleDel(row)">删除</el-button>
                    <el-button type="warning" size="mini" @click="handleDisable(row)">{{row.isDisable == 1?'解禁':'禁用'}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增下级科目':'修改科目'" :visible.sync="dialogFormVisible" width="600px">
            <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="78px" style="width: 580px; margin-left:10px;">
                <el-form-item label="科目类别" prop="coaClassId">
                    <el-input v-model="temp.coaClassId" placeholder="简称" />
                </el-form-item>
                <el-form-item label="科目代码" prop="coaCode">
                    <el-input v-model="temp.coaCode" placeholder="科目代码" />
                </el-form-item>
                <el-form-item label="科目名称" prop="coaName" min-width="220">
                    <el-input v-model="temp.coaName" placeholder="科目名称" />
                </el-form-item>
                <el-form-item label="上级科目" prop="parentId">
                    <el-input v-model="temp.parentId" placeholder="上级科目" disabled />
                </el-form-item>
                <el-form-item label="借贷方向" prop="crDr" style="width:265px">
                    <el-radio v-model="temp.crDr" :label="1">借</el-radio>
                    <el-radio v-model="temp.crDr" :label="-1">贷</el-radio>
                </el-form-item>
                <el-form-item label="是否现金" prop="cashFlowFlag" style="width:265px">
                    <el-radio v-model="temp.cashFlowFlag" label="0">是</el-radio>
                    <el-radio v-model="temp.cashFlowFlag" label="1">否</el-radio>
                </el-form-item>
                <el-form-item label="" style="width:600px">
                    <el-checkbox v-model="temp.isCurrency" :false-label="0" :true-label="1">币种核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxiliary" :false-label="0" :true-label="1">辅助核算(至多选6项)</el-checkbox>
                    <el-checkbox v-model="temp.isQuantity" :false-label="0" :true-label="1">数量核算</el-checkbox>
                    <el-input v-if="temp.isQuantity==1" v-model="temp.uom" placeholder="计量单位" style="width:120px" />
                </el-form-item>
                <el-form-item v-if="temp.isAuxiliary==1" style="width:600px">
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(0)==1" v-model="temp.auxiliaryName_0" :false-label="0" :true-label="1">供应商</el-checkbox>
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(1)==1" v-model="temp.auxiliaryName_1" :false-label="0" :true-label="1">客户</el-checkbox>
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(2)==1" v-model="temp.auxiliaryName_2" :false-label="0" :true-label="1">部门</el-checkbox>
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(3)==1" v-model="temp.auxiliaryName_3" :false-label="0" :true-label="1">职员</el-checkbox>
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(4)==1" v-model="temp.auxiliaryName_4" :false-label="0" :true-label="1">存货</el-checkbox>
                    <el-checkbox :checked="temp.auxiliary&&temp.auxiliary.charAt(5)==1" v-model="temp.auxiliaryName_5" :false-label="0" :true-label="1">项目</el-checkbox>
                </el-form-item>
                <el-form-item label="" style="width:610px">
                    <el-checkbox v-model="temp.isDisable" :false-label="0" :true-label="1">是否禁用</el-checkbox>
                    <el-checkbox v-model="temp.isDisableChildren" :false-label="0" :true-label="1">同时修改子科目</el-checkbox>
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
import { getCoaDatatables, coaClassification, delCoa, updateDisabledCoa, saveCoa, updateDispName } from '@/api/user'
export default {
    data() {
        return {
            temp: {
                id: '',
                coaClassId: '',
                coaCode: '',
                coaName: '',
                parentId: '',
                crDr: 1,
                isCurrency: 0,
                isDisable: 0,
                isAuxiliary: 0,
                isQuantity: 0,
                isDisableChildren: 0,
                cashFlowFlag: 0,
                crDr: 1,
                auxiliary: ''
            },
            rules: {
                coaName: [{ required: true, message: '不能为空', trigger: 'change' }],
                coaCode: [{ required: true, message: '不能为空', trigger: 'change' }]
            },
            dialogStatus: 'update',
            dialogFormVisible: false,
            coaClassCode: '',
            coaClassList: [],
            tableData: [],
        }
    },
    mounted() {
        this.getCoaClass()
    },
    methods: {
        handleCompile(row) {
            this.dialogStatus = 'update'
            this.dialogFormVisible = true
            for (var key in this.temp) {
                this.temp[key] = row[key]
            }
            console.log(this.temp)
        },
        handleAdd() {
            this.dialogStatus = 'create'
            this.dialogFormVisible = true
        },
        handleModify() {
            this.temp.id = ''
            this.save()
        },
        handleCreate() {
            this.save()
        },
        updateDispNameByUuid() {
            var id = sessionStorage.bookId
            updateDispName(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getData();
                    this.$message.success('科目表校正完成！')
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        getCoaClass() {
            coaClassification({ coaClassLevel: 1 }).then(res => {
                this.coaClassList = res.data.data
                this.coaClassCode = res.data.data[0].coaClassCode
                this.getData()
            })
        },
        getData() {
            getCoaDatatables({ coaClassCode: this.coaClassCode }).then(res => {
                if (res.data.errorCode == 0) {
                    this.tableData = res.data.data
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        save() {
            var obj = this.temp
            saveCoa(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getData();
                    this.$message.success(this.dialogStatus == 'create' ? '新增下级科目成功' : '修改科目成功')
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        handleDisable(row) {
            var isDisable = row.isDisable
            var coaCode = row.coaCode;
            var coaName = row.coaName;
            var info = ""
            if (isDisable != 1) {
                isDisable = "1";
                info = "确定要禁用【" + coaCode + " " + coaName + "】及子科目吗？"
            } else {
                isDisable = "0";
                info = "确定要解除禁用【" + coaCode + " " + coaName + "】及父科目(禁用的子科目并不会同时解除禁用)吗？"
            }
            this.$confirm(info, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                var obj = {
                    id: row.id,
                    coaCode: row.coaCode,
                    isDisable: isDisable
                }
                updateDisabledCoa(obj).then(res => {
                    if (res.data.errorCode == 0) {
                        this.getData();
                        this.$message.success('修改科目禁用标志完成！')
                    } else {
                        this.$message.error(res.data.msg)
                    }
                })
            })
        },
        handleDel(row) {
            getCoaCodeUsedByIdNoSysTemplet(row.id).then(res => {
                if (res.data.body == 1) {
                    getChildrenCountByParentId(row.parentId).then(resp => {
                        if (resp.data.body > 1) {
                            this.$message.warning('此科目在余额表/凭证/模板中使用，不可删除！', { icon: 5 });
                        } else {
                            this.$confirm('此科目在余额表/凭证/模板中使用，删除后，数据将自动回滚至上级科目，是否继续？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.delCourse(row.id);
                            }).catch(err => {
                                console.log(err)
                            })
                        }
                    })
                } else {
                    getCoaCodeUsedById(row.id).then(resp => {
                        if (resp.data.body == 1) {
                            getChildCountById(row.parentId).then(rep => {
                                if (res.body > 1) {
                                    layer.msg('此科目在余额表/凭证/模板中使用，不可删除！', { icon: 5 });
                                } else {
                                    layer.confirm('此科目在余额表/凭证/模板中使用，删除后，数据将自动回滚至上级科目，是否继续？', '提示', {
                                        confirmButtonText: '确定',
                                        cancelButtonText: '取消',
                                        type: 'warning'
                                    }).then(() => {
                                        this.delCourse(row.id);
                                    }).catch(err => {
                                        console.log(err)
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },
        delCourse(id) {
            delCoa(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getData();
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