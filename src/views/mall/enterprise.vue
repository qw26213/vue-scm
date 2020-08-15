<template>
    <div class="homeMain">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="display:inline-block;line-height:28px">企业信息</span>
                <el-button type="primary" style="float: right;" size="mini" @click="showCompile">编辑</el-button>
            </div>
            <div class="clearfix">
                <div style="width: 50%; float:left">
                    <div class="listItem">
                        <label>企业名称:</label>{{enterpriseInfo.name}}(代码:{{enterpriseInfo.orgCode}})
                    </div>
                    <div class="listItem">
                        <label>联系电话:</label>{{enterpriseInfo.tel}}
                    </div>
                    <div class="listItem">
                        <label>企业识别码:</label>{{enterpriseInfo.taxRegistrationCertificateNo}}
                    </div>
                    <div class="listItem">
                        <label>默认税率:</label>{{enterpriseInfo.defaultTaxRate * 100}}%
                    </div>
                    <div class="listItem">
                        <label>申请日期:</label>{{enterpriseInfo.applicationDate}}
                    </div>
                    <div class="listItem">
                        <label>正式上线日期:</label>{{enterpriseInfo.onlineDate}}
                    </div>
                    <div class="listItem">
                        <label>仓库:</label>{{enterpriseInfo.warehouseName}}
                    </div>
                    <div class="listItem">
                        <label>管理员:</label>{{enterpriseInfo.staffName}}
                    </div>
                    <div class="listItem">
                        <label>虚拟客户:</label>{{enterpriseInfo.custName}}
                    </div>
                </div>
                <div style="width: 50%; float:left">
                    <div class="listItem">
                        <label>小程序名称:</label>{{enterpriseInfo.appName}}
                    </div>
                    <div class="listItem">
                        <label>小程序缩写:</label>{{enterpriseInfo.appAbbr}}
                    </div>
                    <div class="listItem">
                        <label style="width:80px">一级类目:</label>{{enterpriseInfo.serviceType1}}
                    </div>
                    <div class="listItem">
                        <label style="width:80px">二级类目:</label>{{enterpriseInfo.serviceType2}}
                    </div>
                    <div class="listItem">
                        <label style="width:80px">正式密码:</label>{{enterpriseInfo.appSecret}}
                    </div>
                    <div class="listItem">
                        <label style="width:80px">开发密码:</label>{{enterpriseInfo.devSecret}}
                    </div>
                    <div class="listItem">
                        <label>小程序介绍:</label>{{enterpriseInfo.intro}}
                    </div>
                </div>
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top:15px">
            <div slot="header" class="clearfix">
                <span style="display:inline-block;line-height:28px">小程序页签</span>
                <el-button style="float:right" type="primary" size="mini" @click="showAdd">添加页签</el-button>
            </div>
            <el-table :data="tabs" size="small" border fit highlight-current-row>
                <el-table-column label="页签名称" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.tabName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="页签编码" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.tabCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="页签序号" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.seq}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button type="text" @click="showEdit(row)">编辑</el-button>
                        <el-button type="text" @click="delTab(row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <el-dialog :close-on-click-modal="false" :title="dialogType==='create'?'添加页签':'编辑页签'" :visible.sync="dialogFormVisible2" width="460px">
            <el-form ref="tabForm" :rules="rules1" :model="tabForm" inline label-position="top" label-width="120px" style="width:420px;">
                <el-form-item label="页签编码" prop="tabCode">
                    <el-input v-model="tabForm.tabCode" style="width:420px" size="small" placeholder="页签代码" />
                </el-form-item>
                <el-form-item label="页签名称" prop="tabName">
                    <el-input v-model="tabForm.tabName" style="width:420px" size="small" placeholder="页签名称" />
                </el-form-item>
                <el-form-item label="页签序号" prop="seq">
                    <el-input v-model="tabForm.seq" style="width:420px" size="small" placeholder="页签序号" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible2 = false">取消</el-button>
                <el-button type="primary" @click="saveTab()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="编辑企业信息" :visible.sync="dialogFormVisible1" width="750px">
            <el-form ref="dataForm" :rules="rules" :model="enterpriseForm" inline label-position="top" label-width="120px" style="width:720px;">
                <div class="formTit">企业信息</div>
                <!-- <el-form-item label="企业代码" prop="orgCode">
                    <el-input v-model="enterpriseForm.orgCode" style="width:225px" size="small" placeholder="企业代码" />
                </el-form-item> -->
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="enterpriseForm.name" style="width:225px" size="small" placeholder="企业名称" />
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="enterpriseForm.tel" style="width:225px" size="small" placeholder="详细地址" />
                </el-form-item>
                <el-form-item label="企业识别码" prop="taxRegistrationCertificateNo">
                    <el-input v-model="enterpriseForm.taxRegistrationCertificateNo" style="width:225px" size="small" placeholder="企业识别码" />
                </el-form-item>
                <el-form-item label="默认税率(%)" prop="defaultTaxRate">
                    <el-input v-model="enterpriseForm.defaultTaxRate" style="width:225px" size="small" placeholder="默认税率" />
                </el-form-item>
                <el-form-item label="商城管理员" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="enterpriseForm.staffId"></staffList>
                </el-form-item>
                <el-form-item label="虚拟客户" prop="custId">
                    <custList @selectChange="selectChange" :selectId="enterpriseForm.custId"></custList>
                </el-form-item>
                <el-form-item label="选择仓库" prop="warehouseId">
                    <warehouseList @selectChange="selectChange" :selectId="enterpriseForm.warehouseId"></warehouseList>
                </el-form-item>
                <el-form-item label="申请日期" prop="applicationDate">
                    <el-date-picker :editable="false" v-model="enterpriseForm.applicationDate" type="date" placeholder="申请日期" style="width:225px" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="正式上线日期" prop="onlineDate">
                    <el-date-picker :editable="false" v-model="enterpriseForm.onlineDate" type="date" placeholder="正式上线日期" style="width:225px" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <div class="formTit">小程序信息</div>
                <el-form-item label="小程序名称" prop="appName">
                    <el-input v-model="enterpriseForm.appName" style="width:225px" size="small" placeholder="小程序名称" />
                </el-form-item>
                <el-form-item label="小程序缩写" prop="appAbbr">
                    <el-input v-model="enterpriseForm.appAbbr" style="width:225px" size="small" placeholder="小程序缩写" />
                </el-form-item>
                <el-form-item label="小程序一级类目" prop="serviceType1">
                    <el-input v-model="enterpriseForm.serviceType1" style="width:225px" size="small" placeholder="小程序一级类目" />
                </el-form-item>
                <el-form-item label="小程序二级类目" prop="serviceType2">
                    <el-input v-model="enterpriseForm.serviceType2" style="width:225px" size="small" placeholder="小程序二级类目" />
                </el-form-item>
                <el-form-item label="小程序正式密码" prop="appSecret">
                    <el-input v-model="enterpriseForm.appSecret" style="width:225px" size="small" placeholder="小程序正式密码" />
                </el-form-item>
                <el-form-item label="小程序开发密码" prop="devSecret">
                    <el-input v-model="enterpriseForm.devSecret" style="width:225px" size="small" placeholder="小程序开发密码" />
                </el-form-item>
                <el-form-item label="小程序介绍" prop="intro">
                    <el-input v-model="enterpriseForm.intro" type="textarea" rows="2" resize="none" style="width:705px" size="small" placeholder="小程序介绍" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible1 = false">取消</el-button>
                <el-button type="primary" @click="saveInfo()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getEnterpriseInfo, updateEnterpriseInfo, getTabs, delTabById, addTab } from '@/api/mall'
import { deepClone } from '@/utils/index'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import warehouseList from '@/components/selects/warehouseList'
export default {
    components: { staffList, warehouseList, custList },
    filters: {
        formatArr(arr) {
            var name = []
            arr.forEach(item => {
                name.push(item.tabName)
            })
            return name.join(',')
        }
    },
    data() {
        return {
            enterpriseInfo: {},
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            tabs: [],
            tabForm: {
                id: '',
                tabName: '',
                tabCode: '',
                seq: ''
            },
            enterpriseForm: {
                orgCode: '',
                name: '',
                tel: '',
                intro: '',
                serviceType1: '',
                serviceType2: '',
                taxRegistrationCertificateNo: '',
                defaultTaxRate: '',
                staffId: '',
                custId: '',
                warehouseId: '',
                appSecret: '',
                devSecret: '',
                appAbbr: ''
            },
            dialogType: 'create',
            inputVisible: false,
            inputValue: '',
            rules: {
                orgCode: [{ required: true, message: '企业代码不能为空', trigger: 'change' }],
                name: [{ required: true, message: '企业名称不能为空', trigger: 'change' }],
                tel: [{ required: true, message: '联系电话不能为空', trigger: 'change' }],
                intro: [{ required: true, message: '小程序介绍不能为空', trigger: 'change' }],
                appName: [{ required: true, message: '小程序名称不能为空', trigger: 'change' }],
                tel: [{ required: true, message: '联系电话不能为空', trigger: 'change' }],
                taxRegistrationCertificateNo: [{ required: true, message: '企业识别码不能为空', trigger: 'change' }],
                serviceType1: [{ required: true }],
                appAbbr: [{ required: true }],
                serviceType2: [{ required: true }],
                defaultTaxRate: [{ required: true }],
                staffId: [{ required: true }],
                custId: [{ required: true }],
                warehouseId: [{ required: true }],
                appSecret: [{ required: true }],
                devSecret: [{ required: true }]
            },
            rules1: {
                tabCode: [{ required: true, message: '页签编码不能为空', trigger: 'change' }],
                tabName: [{ required: true, message: '页签名称不能为空', trigger: 'change' }],
                seq: [{ required: true, message: '页签序号不能为空', trigger: 'change' }]
            }
        }
    },
    mounted() {
        this.getData()
        this.getTabsData()
    },
    methods: {
        getData() {
            getEnterpriseInfo().then(res => {
                if (res.data.errorCode == 0) {
                    this.enterpriseInfo = res.data.data || {}
                    this.enterpriseInfo.defaultTaxRate = this.enterpriseInfo.defaultTaxRate || 0
                }
            })
        },
        showEdit(row) {
            this.dialogType = 'update'
            for (var key in this.tabForm) {
                this.tabForm[key] = row[key]
            }
            this.dialogFormVisible2 = true
            this.$nextTick(() => {
                this.$refs['tabForm'].clearValidate()
            })
        },
        showAdd() {
            this.dialogType = 'create'
            for (var key in this.tabForm) {
                this.tabForm[key] = ''
            }
            this.dialogFormVisible2 = true
            this.$nextTick(() => {
                this.$refs['tabForm'].clearValidate()
            })
        },
        getTabsData() {
            getTabs().then(res => {
                if (res.data.errorCode == 0) {
                    this.tabs = res.data.data || []
                }
            })
        },
        selectChange(obj) {
            for (var key in obj) {
                this.enterpriseForm[key] = obj[key];
            }
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        delTab(row) {
            this.$confirm("确认删除吗？", '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTabById({ id: row.id }).then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('该页签删除成功')
                        this.getTabsData()
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        saveTab() {
            this.$refs.tabForm.validate(valid => {
                if (valid) {
                    var obj = {
                        id: this.tabForm.id,
                        seq: this.tabForm.seq,
                        tabCode: this.tabForm.tabCode,
                        tabName: this.tabForm.tabName
                    }
                    addTab(obj).then(res => {
                        if (res.data.errorCode == 0) {
                            this.$message.success(this.tabForm.id ? '修改成功' : '添加成功')
                            this.getTabsData()
                            this.$nextTick(() => {
                                this.dialogFormVisible2 = false;
                            })
                        }
                    })
                }
            })
        },
        showCompile() {
            this.dialogFormVisible1 = true
            this.enterpriseForm = deepClone(this.enterpriseInfo)
            this.enterpriseForm.defaultTaxRate = this.enterpriseForm.defaultTaxRate * 100
        },
        saveInfo() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    var form = deepClone(this.enterpriseForm)
                    form.defaultTaxRate = form.defaultTaxRate / 100
                    updateEnterpriseInfo(form).then(res => {
                        this.$message.success('修改成功！')
                        this.getData()
                        this.dialogFormVisible1 = false
                    })
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

/deep/ .el-form-item__label {
    line-height: 30px;
    padding: 0
}
/deep/ .el-form-item {
    margin-bottom: 16px;
}
</style>
<style scoped>
.formTit {
    margin-bottom: 15px;
    font-size: 14px
}

.el-tag+.el-tag {
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}

.listItem {
    height: 36px;
    line-height: 36px;
    border-bottom: 1px #eee solid;
    font-size: 14px;
    color: #333
}

.listItem:last-child {
    border-bottom: none
}

.listItem label {
    display: inline-block;
    vertical-align: middle;
    margin-right: 3px;
    width: 100px;
}
</style>