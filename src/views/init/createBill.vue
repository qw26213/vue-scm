<template>
    <div class="app-container">
        <el-row :gutter="40" class="panel-group">
            <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="display:inline-block;line-height:28px">账套信息</span>
                        <el-button v-if="!!userInfo.glBookEntity" type="primary" style="float: right;margin-right:10px" size="small" @click="handleCompile">编辑</el-button>
                        <el-button v-if="!!userInfo.glBookEntity" type="danger" style="float: right;margin-right:20px" size="small" @click="resetAcc">重置</el-button>
                        <el-button v-if="!!!userInfo.glBookEntity" type="primary" style="float: right;margin-right:10px" size="small" @click="handleAdd">建账</el-button>
                    </div>
                    <div class="listItem"><label>企业代码:</label>{{managementInfo.orgCode}}</div>
                    <div class="listItem"><label>企业名称:</label>{{managementInfo.orgName}}</div>
                    <div class="listItem"><label>所属行业:</label>{{managementInfo.industryName}}</div>
                    <div class="listItem"><label>所属区域:</label>{{managementInfo.areaName}}</div>
                    <div class="listItem">
                        <label>纳税类型:</label>{{managementInfo.taxFilingCategoryName}}
                        <el-button v-if="managementInfo.taxFilingCategoryId==0" type="default" style="margin-left:20px" size="small" @click="handleTransfer">转为一般纳税人</el-button>
                        <el-button v-if="managementInfo.taxFilingCategoryId==1" type="default" style="margin-left:20px" size="small" @click="handleTransfer">转为小规模纳税人</el-button>
                    </div>
                    <div class="listItem"><label>试用期:</label>{{managementInfo.bizExpirationDate}}</div>
                    <div class="listItem"><label>账簿名称:</label>{{managementInfo.bookName}}</div>
                    <!-- <div class="listItem"><label>审核级次:</label>{{managementInfo.auditLevel}}</div> -->
                    </ul>
                </el-card>
            </el-col>
        </el-row>
        <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新建账套':'修改账套'" :visible.sync="dialogFormVisible" width="832px">
            <el-form ref="dataForm" :rules="rules1" inline :model="temp" label-position="left" label-width="70px" style="width: 780px; margin-left:10px;">
                <el-form-item label="账套名称" prop="bookName">
                    <el-input v-model="temp.bookName" placeholder="账套名称" />
                </el-form-item>
                <el-form-item label="科目体系" prop="coahierarchyId">
                    <el-select v-model="temp.coahierarchyId" style="width:185px" :disabled="!!userInfo.glBookEntity">
                        <el-option v-for="item in coaHierarchyList" :key="item.id" :label="item.coaHierarchyName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="本位币" prop="baseCurrencyCode" label-width="56px">
                    <el-select v-model="temp.baseCurrencyCode" style="width:185px" :disabled="!!userInfo.glBookEntity">
                        <el-option v-for="item in currencyList" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="启用期间" prop="enablePeriodYear">
                    <el-select size="small" v-model="temp.enablePeriodYear" style="width: 72px" :disabled="!!userInfo.glBookEntity">
                        <el-option v-for="item in [2018,2019,2020,2021,2022]" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                    <label>年</label>
                    <el-select size="small" v-model="temp.enablePeriodNum" style="width: 56px" :disabled="!!userInfo.glBookEntity">
                        <el-option v-for="item in [1,2,3,4,5,6,7,8,9,10,11,12]" :key="item" :value="item" :label="item"></el-option>
                    </el-select>
                    <label>月</label>
                </el-form-item>
                <el-form-item label="科目级次" prop="coaLevel">
                    <el-select v-model="temp.coaLevel" size="small" style="width:56px" :disabled="!!userInfo.glBookEntity">
                        <el-option v-for="item in [4,5,6,7,8]" :key="item" :label="item" :value="item"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="科目编码规则" label-width="100px" prop="codingRule">
                    <span class="">4 - 2 - 2 -</span>
                    <select class="inputItem" v-model="codingRuleArr[3]" :disabled="!!userInfo.glBookEntity">
                        <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
                    </select>
                    <span v-if="temp.coaLevel>4">-</span>
                    <select v-if="temp.coaLevel>4" class="inputItem" v-model="codingRuleArr[4]" :disabled="!!userInfo.glBookEntity">
                        <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
                    </select>
                    <span v-if="temp.coaLevel>5">-</span>
                    <select v-if="temp.coaLevel>5" class="inputItem" v-model="codingRuleArr[5]" :disabled="!!userInfo.glBookEntity">
                        <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
                    </select>
                    <span v-if="temp.coaLevel>6">-</span>
                    <select v-if="temp.coaLevel>6" class="inputItem" v-model="codingRuleArr[6]" :disabled="!!userInfo.glBookEntity">
                        <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
                    </select>
                    <span v-if="temp.coaLevel>7">-</span>
                    <select v-if="temp.coaLevel>7" class="inputItem" v-model="codingRuleArr[7]" :disabled="!!userInfo.glBookEntity">
                        <option v-for="item in [2,3,4]" :key="item" :value="item">{{ item }}</option>
                    </select>
                </el-form-item>
                <el-form-item>
                    <span>自定义增值税率</span>
                    <el-input v-model="temp.defaultTaxRateStr" placeholder="" size="small" style="width:60px;margin-right:5px" />%
                    <span style="font-size:12px;margin-right:10px">(小规模纳税人为3%，一般纳税人为13%)</span>
                    <el-checkbox v-model="temp.isDispName" :false-label="0" :true-label="1" style="margin-right:10px">科目名称显示路径</el-checkbox>
                    <el-checkbox v-model="temp.isCoaCobinationCode" :false-label="0" :true-label="1" style="margin-right:10px">凭证中显示辅助项编码组合</el-checkbox>
                    <span>新增凭证时默认凭证日期</span>
                    <el-radio-group v-model="temp.isVoucherMaxDate">
                        <el-radio :label="0" style="margin-right:10px">当前日期</el-radio>
                        <el-radio :label="1">最大凭证日期</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="temp.isQuantity" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用数量核算</el-checkbox>
                    <el-checkbox v-model="temp.isCurrency" :false-label="0" :true-label="1" style="margin-right:500px" disabled>启用币种核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxSupplier" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用供应商核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxCust" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用客户核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxDept" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用部门核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxStaff" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用职员核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxItem" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用存货核算</el-checkbox>
                    <el-checkbox v-model="temp.isAuxProj" :false-label="0" :true-label="1" :disabled="!!userInfo.glBookEntity" style="margin-right:10px">启用项目核算</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <span>自动凭证类型</span>
                    <el-select v-model="temp.autoVoucherType" style="width:160px" size="mini">
                        <el-option label="全部单据每天自动生成" :value="0" />
                        <el-option label="仅销售单据每天自动生成" :value="1" />
                        <el-option label="全部单据手动生成" :value="2" />
                    </el-select>
                    <el-checkbox v-model="temp.isAutoAuditWhenAutoSave" :false-label="0" :true-label="1" style="margin-right:10px">自动凭证在保存时自动审核</el-checkbox>
                    <el-checkbox v-model="temp.autoAuditFlag" :false-label="0" :true-label="1" style="margin-right:10px" :disabled="temp.isAutoTransfer==1">结账时自动审核凭证</el-checkbox>
                    <el-checkbox v-model="temp.isAutoTransfer" :false-label="0" :true-label="1" style="margin-right:10px" @change="autoTransferChange">期末自动结转、结账</el-checkbox>
                    <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJzdtfy" :false-label="0" :true-label="1" style="margin-right:10px">自动结转待摊费用</el-checkbox>
                    <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJtzj" :false-label="0" :true-label="1" style="margin-right:10px">自动计提折旧</el-checkbox>
                    <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJtgz" :false-label="0" :true-label="1" style="margin-right:10px">自动计提工资</el-checkbox>
                    <el-checkbox v-if="temp.isAutoTransfer==1" v-model="temp.isAutoJzwfplr" :false-label="0" :true-label="1" style="margin-right:10px">自动结转未分配利润(年末结转)</el-checkbox>
                </el-form-item>
                <el-form-item v-if="temp.isAutoTransfer==1" label="自动计提附加税" prop="isAutoJtfjs" label-width="120px" style="margin-right:20px">
                    <el-radio-group v-model="temp.isAutoJtfjs">
                        <el-radio :label="0" style="margin-right:10px">不计提</el-radio>
                        <el-radio :label="1" style="margin-right:10px">按月</el-radio>
                        <el-radio :label="3">按季</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="temp.isAutoTransfer==1" label="自动结转损益(期末结转)" prop="isAutoJzsy" label-width="170px" style="margin-left:10px">
                    <el-radio-group v-model="temp.isAutoJzsy">
                        <el-radio :label="0" style="margin-right:10px">不结转</el-radio>
                        <el-radio :label="1" style="margin-right:10px">合并结转</el-radio>
                        <el-radio :label="2">分开结转</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="temp.isAutoTransfer==1">
                    <span>城市建设维护税</span>
                    <el-input v-model="temp.isAutoJtfjs7" style="width:45px" size="small" />%
                    <span style="margin-left:5px">教育附加</span>
                    <el-input v-model="temp.isAutoJtfjs3" style="width:45px" size="small" />%
                    <span style="margin-left:5px">地方教育附加</span>
                    <el-input v-model="temp.isAutoJtfjs2" style="width:45px" size="small" />%
                    <span style="margin-left:5px">自动结转成本</span>
                    <el-input v-model="temp.isAutoJzcb" style="width:45px" size="small" disabled />%
                    <span style="margin-left:5px">自动计提所得税</span>
                    <el-input v-model="temp.isAutoJtsds" style="width:45px" size="small" />%
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveManageInfo()">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getmanagementInfo, getMapById, registerLoadTaxfilingcategory, addBook, saveBook, resetAccount, getCurrencyList, getCoaHierarchy, updateTaxFilingCategory, getAccount } from '@/api/user'
import { getNowDate } from '@/utils/index'
export default {
    data() {
        return {
            dialogFormVisible: false,
            dialogStatus: 'create',
            managementInfo: {},
            accountInfo: {},
            userInfo: {},
            codingRuleArr: [4, 2, 2, 2, 2, 2, 2, 2],
            temp: {
                bookName: '',
                baseCurrencyCode: 'CNY',
                enablePeriodYear: new Date().getFullYear(),
                enablePeriodNum: new Date().getMonth() + 1,
                coahierarchyId: '2',
                defaultTaxRateStr: '',
                isAutoAuditWhenAutoSave: 1,
                coaLevel: 5,
                codingRule: '4-2-2-2-2',
                isAutoJtfjs: 0,
                isCoaCobinationCode: 0,
                autoVoucherType: 0,
                isVoucherMaxDate: 0,
                isDispName: 0,
                isAutoJtfjs2: 0,
                isAutoJtfjs3: 0,
                isAutoJtfjs7: 0,
                isAutoJtgz: 0,
                autoAuditFlag: 0,
                isAutoJtsds: 0,
                isAutoJtzj: 0,
                isAutoJzcb: 100,
                isAutoJzdtfy: 0,
                isAutoJzsy: 0,
                isAutoJzwfplr: 0,
                isAutoTransfer: 0,
                isAuxCust: 0,
                isAuxDept: 0,
                isAuxItem: 0,
                isAuxProj: 0,
                isAuxStaff: 0,
                isAuxSupplier: 0,
                isQuantity: 0
            },
            rules1: {
                orgName: [{ required: true, message: '企业全称不能为空', trigger: 'change' }],
                areaId: [{ required: true, message: '请选择企业所在地', trigger: 'change' }],
                industryId: [{ required: true, message: '请选择行业类别', trigger: 'change' }],
                taxFilingCategoryId: [{ required: true, message: '请选择纳税类型', trigger: 'change' }]
            },
            userInfo: JSON.parse(sessionStorage.userInfo),
            userList: {},
            currencyList: [],
            coaHierarchyList: [],
            taxfillingcategoryList: []
        }
    },
    mounted() {
        this.getData()
        registerLoadTaxfilingcategory().then(res => {
            this.taxfillingcategoryList = res.data.data
        })
        getCurrencyList().then(res => {
            this.currencyList = res.data.data
        })
        getCoaHierarchy().then(res => {
            this.coaHierarchyList = res.data.data
        })
    },
    methods: {
        autoTransferChange(val) {
            if (val) {
                this.temp.autoAuditFlag = 1
            }
        },
        handleTransfer() {
            const obj = {
                categoryId: this.managementInfo.taxFilingCategoryId == 0 ? '1' : '0'
            }
            updateTaxFilingCategory(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success("修改纳税类型成功")
                    this.getData()
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        resetAcc() {
            this.$confirm('账套的所有初始数据,包括科目,科目余额表等将全部被重置,确定要重置这个账套吗?', '警告', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                resetAccount().then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('账套已被删除！')
                        this.$store.dispatch('user/logout').then(() => {
                            this.$router.push({ path: '/login' })
                        })
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        saveManageInfo() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    var str = '4'
                    for (let i = 0; i < this.temp.coaLevel; i++) {
                        str += this.codingRuleArr[i]
                    }
                    this.temp.codingRule = str
                    saveBook(this.temp).then(res => {
                        if (this.userInfo.glBookEntity) {
                            this.$message.success('修改账套成功')
                            this.dialogFormVisible = false
                            this.getData()
                        } else {
                            this.$alert(res.data.msg, '提示', {
                                confirmButtonText: '确定',
                                callback: () => {
                                    this.$store.dispatch('user/logout').then(() => {
                                        this.$router.push({ path: '/login' })
                                    })
                                }
                            })
                        }
                    })
                }
            })
        },
        handleCompile() {
            for (var key in this.temp) {
                this.temp[key] = this.accountInfo[key]
            }
            this.temp.isAutoJzcb = 100
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
        },
        handleAdd() {
            var txt = '科目体系、本位币、启用期间、科目编码规则在建账后不可再更改；科目如果已被使用,则该科目的数量核算和辅助核算选择不可再更改。'
            this.$confirm(txt, '提示', {
                dangerouslyUseHTMLString: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                callback: () => {
                    this.dialogFormVisible = true
                    this.codingRuleArr = [4, 2, 2, 2, 2, 2, 2, 2]
                    this.temp.bookName = this.managementInfo.orgName
                    this.dialogStatus = 'create'
                }
            })
        },
        formatNum(num){
            if(!num) { return 0 }
            if(String(num).indexOf('.') < 0){
                return num.toFixed(0)
            } else {
                return num.toFixed(2)
            }
        },
        getData() {
            getmanagementInfo().then(res => {
                if (res.data.errorCode == 0) {
                    this.managementInfo = res.data.data[0] || {}
                }
            })
            getAccount().then(res => {
                if (res.data.errorCode == 0) {
                    this.accountInfo = res.data.data[0] || {}
                    if (this.accountInfo != {}) {
                        this.accountInfo.defaultTaxRateStr = this.formatNum(this.accountInfo.defaultTaxRate * 100)
                        this.accountInfo.isAutoJtfjs7 = this.formatNum(this.accountInfo.isAutoJtfjs7 * 100)
                        this.accountInfo.isAutoJtfjs2 = this.formatNum(this.accountInfo.isAutoJtfjs2 * 100)
                        this.accountInfo.isAutoJtfjs3 = this.formatNum(this.accountInfo.isAutoJtfjs3 * 100)
                        this.accountInfo.isAutoJzcb = this.formatNum(this.accountInfo.isAutoJzcb * 100)
                        this.accountInfo.isAutoJtsds = this.formatNum(this.accountInfo.isAutoJtsds * 100)
                    }
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
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
/deep/ .el-input__inner{
    padding: 0 5px;
}
/deep/.el-form-item {
    margin-bottom: 16px;
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

.spanItem1 {
    width: 20px;
    line-height: 28px;
    display: inline-block;
    text-align: center;
}

.spanItem2 {
    width: 60px;
    line-height: 28px;
    display: inline-block;
    text-align: center;
}

.inputItem {
    width: 32px;
    line-height: 28px;
    text-align: center;
    border: 1px solid #DCDFE6;
    border-radius: 4px;
}

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