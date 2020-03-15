<template>
    <div class="homeMain">
        <el-row :gutter="40" class="panel-group">
            <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">账套信息</span>
                        <el-button v-if="managementInfo.coahierarchyId" type="primary" style="float: right;margin-right:10px" size="mini" @click="handleCompile">编辑</el-button>
                        <el-button v-if="managementInfo.coahierarchyId" type="danger" style="float: right;margin-right:20px" size="mini" @click="resetAcc">重置</el-button>
                        <el-button v-if="!managementInfo.coahierarchyId" type="primary" style="float: right;margin-right:10px" size="mini" @click="handleAdd">建账</el-button>
                    </div>
                    <div class="listItem"><label>企业代码:</label>{{managementInfo.orgCode}}</div>
                    <div class="listItem"><label>企业名称:</label>{{managementInfo.orgName}}</div>
                    <div class="listItem"><label>所属行业:</label>{{managementInfo.industryName}}</div>
                    <div class="listItem"><label>所属区域:</label>{{managementInfo.areaName}}</div>
                    <div class="listItem">
                        <label>纳税类型:</label>{{managementInfo.taxFilingCategoryName}}
                        <el-button type="default" style="margin-left:20px" size="mini" @click="handleCompile">设置</el-button>
                    </div>
                    <div class="listItem"><label>业务有效期:</label>{{managementInfo.bizExpirationDate}}</div>
                    <div class="listItem"><label>账簿名称:</label>{{managementInfo.bookName}}</div>
                    <div class="listItem"><label>审核级次:</label>{{managementInfo.auditLevel}}</div>
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新建':'修改' + '账套'" :visible.sync="dialogFormVisible" width="670px">
            <el-form ref="dataForm" :rules="rules1" inline :model="temp" label-position="left" label-width="100px" style="width: 620px; margin-left:20px;">
                <el-form-item label="账套名称" prop="bookName">
                    <el-input v-model="temp.bookName" placeholder="账套名称" />
                </el-form-item>
                <el-form-item label="科目体系" prop="coahierarchyId">
                    <el-select v-model="temp.coahierarchyId" style="width:185px">
                        <el-option v-for="item in coaHierarchyList" :key="item.id" :label="item.coaHierarchyName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="本位币" prop="baseCurrencyCode">
                    <el-select v-model="temp.baseCurrencyCode" style="width:185px">
                        <el-option v-for="item in currencyList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用期间" prop="enablePeriodYear">
                    <el-input v-model="temp.enablePeriodYear" placeholder="启用期间" />
                </el-form-item>
                <el-form-item label="科目级次" prop="coaLevel">
                    <el-select v-model="temp.coaLevel" style="width:185px">
                        <el-option v-for="item in [4,5,6,7,8]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科目编码规则" prop="invoiceAddr">
                    <span class="spanItem1">4</span>
                    <span>-</span>
                    <span class="spanItem1">2</span>
                    <span>-</span>
                    <span class="spanItem1">2</span>
                    <span>-</span>
                    <select class="inputItem">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                    <span>-</span>
                    <select class="inputItem">
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </el-form-item>
                <el-form-item label="增值税率" prop="defaultTaxRateStr">
                    <el-input v-model="temp.defaultTaxRateStr" placeholder="增值税率" />
                </el-form-item>
                <el-form-item label="计提附加税" prop="isAutoJtfjs">
                    <el-radio-group v-model="temp.isAutoJtfjs">
                        <el-radio label="0" style="margin-right:10px">不计提</el-radio>
                        <el-radio label="1" style="margin-right:10px">按月</el-radio>
                        <el-radio label="3">按季</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <label for="">城市建设维护税</label>                    
                    <span class="spanItem2">{{temp.isAutoJtfjs7}}</span>
                    <label for="">教育附加</label>                    
                    <span class="spanItem2">{{temp.isAutoJtfjs3}}</span>
                    <label for="">地方教育附加</label>                    
                    <span class="spanItem2">{{temp.isAutoJtfjs2}}</span>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="temp.isQuantity" false-label="0" true-label="1" style="margin-right:10px">启用数量核算</el-checkbox>
                    <el-checkbox v-model="temp.isCurrency" false-label="0" true-label="1" style="margin-right:10px">启用币种核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxSupplier" false-label="0" true-label="1" style="margin-right:10px">启用供应商核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxCust" false-label="0" true-label="1" style="margin-right:10px">启用客户核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxDept" false-label="0" true-label="1" style="margin-right:10px">启用部门核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxStaff" false-label="0" true-label="1" style="margin-right:10px">启用职员核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxItem" false-label="0" true-label="1" style="margin-right:10px">启用存货核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxProj" false-label="0" true-label="1" style="margin-right:10px">启用项目核算</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="temp.isAutoAuditWhenAutoSave" false-label="0" true-label="1" style="margin-right:10px">自动凭证在保存时自动审核</el-checkbox>
                    <el-checkbox v-model="temp.autoAuditFlag" false-label="0" true-label="1" style="margin-right:10px">结账时自动审核凭证</el-checkbox>
                    <el-checkbox v-model="temp.isAutoTransfer" false-label="0" true-label="1" style="margin-right:10px">期末自动结转、结账</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJzcb" false-label="0" true-label="1" style="margin-right:10px">自动结转成本</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJzdtfy" false-label="0" true-label="1" style="margin-right:10px">自动结转待摊费用</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJtfjs" false-label="0" true-label="1" style="margin-right:10px">自动计提附加税</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJtzj" false-label="0" true-label="1" style="margin-right:10px">自动计提折旧</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJtgz" false-label="0" true-label="1" style="margin-right:10px">自动计提工资</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJtsds" false-label="0" true-label="1" style="margin-right:10px">自动计提所得税(季末结转)</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJzsy" false-label="0" true-label="1" style="margin-right:10px">自动结转损益(期末结转)</el-checkbox>
                    <el-checkbox v-model="temp.isAutoJzwfplr" false-label="0" true-label="1" style="margin-right:10px">自动结转未分配利润(年末结转)</el-checkbox>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveManageInfo()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getmanagementInfo, getMapById, registerLoadTaxfilingcategory, addBook, saveBook, resetAccount, getCurrencyList, getCoaHierarchy } from '@/api/user'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: 'create',
            managementInfo: {},
            userInfo: {},
            temp: {
                bookName: '',
                coahierarchyId: '',
                baseCurrencyCode: '',
                enablePeriodYear: '',
                coaLevel: '5',
                isAutoJtfjs7: 0,
                isAutoJtfjs3: 0,
                isAutoJtfjs2: 0
            },
            rules1: {
                orgName: [{ required: true, message: '企业全称不能为空', trigger: 'change' }],
                areaId: [{ required: true, message: '请选择企业所在地', trigger: 'change' }],
                industryId: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
                taxFilingCategoryId: [{ required: true, message: '请选择纳税类型', trigger: 'change' }]
            },
            userList: {},
            currencyList: [],
            coaHierarchyList: [],
            taxfillingcategoryList: []
        }
    },
    mounted() {
        this.getData()
        registerLoadTaxfilingcategory().then(res => {
            this.taxfillingcategoryList = res.data
        })
        getCurrencyList().then(res => {
            this.currencyList = res.data.data
        })
        getCoaHierarchy().then(res => {
            this.coaHierarchyList = res.data.data
        })
    },
    methods: {
        resetAcc() {
            this.$confirm('账套的所有初始数据,包括科目,科目余额表等将全部被重置,确定要重置这个账套吗?', '警告', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                resetAccount().then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('注销企业成功')
                        this.$router.replace('/login')
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        saveManageInfo() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    saveBook(this.temp).then(res => {
                        this.$message.success("修改账套成功")
                        this.dialogFormVisible1 = false
                    })
                }
            })
        },
        handleCompile() {
            for (var key in this.temp) {
                this.temp[key] = this.managementInfo[key]
            }
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
        },
        handleAdd() {
            for (var key in this.temp) {
                this.temp[key] = ''
            }
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
        },
        saveUser() {
            this.$refs.dataForm1.validate(valid => {
                if (valid) {
                    if (this.temp.password != this.temp.againPassword) {
                        this.$message.warning('请确保两次密码输入一致');
                        return
                    }
                    saveUser(this.temp).then(res => {
                        this.$message.success((this.dialogStatus == 'create' ? '新增' : '修改') + '操作人成功')
                        this.getData3()
                        this.dialogFormVisible2 = false
                    })
                }
            })
        },
        getData() {
            getmanagementInfo().then(res => {
                if (res.data.errorCode == 0) {
                    this.managementInfo = res.data.data[0] || {}
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.homeMain {
    padding: 30px 30px 0;
    background-color: rgb(240, 242, 245);
    position: relative;
}

.panel-group {
    .card-panel-col {
        margin-bottom: 32px;
    }
}

/deep/.el-card__header {
    padding: 10px 15px
}

/deep/.el-card__body {
    padding: 10px 20px 15px;
}
</style>
<style scoped>
.listItem {
    height: 42px;
    line-height: 42px;
    border-bottom: 1px #eee solid;
    font-size: 14px;
    color: #333
}
.spanItem1{width: 20px;line-height: 28px;display: inline-block;text-align: center;}
.spanItem2{width: 60px;line-height: 28px;display: inline-block;text-align: center;}
.inputItem{width: 36px;line-height: 28px;text-align: center;border:1px solid #DCDFE6;border-radius: 4px;}
.listItem:last-child {
    border-bottom: none
}

.listItem label {
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
    width: 80px;
}
</style>