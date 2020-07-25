<template>
    <div class="homeMain">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span style="display:inline-block;line-height:28px">企业信息</span>
                <el-button type="primary" style="float: right;" size="mini" @click="showCompile">编辑</el-button>
            </div>
            <div class="listItem">
                <label>企业代码:</label>{{enterpriseInfo.orgCode}}
            </div>
            <div class="listItem">
                <label>企业名称:</label>{{enterpriseInfo.name}}
            </div>
            <div class="listItem">
                <label>小程序名称:</label>{{enterpriseInfo.appName}}
            </div>
            <div class="listItem">
                <label>小程序介绍:</label>{{enterpriseInfo.intro}}
            </div>
            <div class="listItem">
                <label>联系电话:</label>{{enterpriseInfo.tel}}
            </div>
            <div class="listItem">
                <label>服务类型:</label>{{enterpriseInfo.serviceType1}}
            </div>
            <div class="listItem">
                <label>纳税识别号:</label>{{enterpriseInfo.taxRegistrationCertificateNo}}
            </div>
            <div class="listItem">
                <label>申请日期:</label>{{enterpriseInfo.applicationDate}}
            </div>
        </el-card>
        <el-card class="box-card" style="margin-top:20px">
            <div class="listItem">
                <label>小程序页签:</label>
                <el-tag v-for="item in tabs" :key="item.id" :closable="item.tabName != '首页'" @close="handleClose(item)">{{item.tabName}}</el-tag>
                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm" />
                <el-button v-else class="button-new-tag" size="mini" @click="showInput">+ 新页签</el-button>
            </div>
        </el-card>
        <el-dialog :close-on-click-modal="false" title="编辑企业信息" :visible.sync="dialogFormVisible" width="440px">
            <el-form ref="dataForm" :rules="rules" :model="enterpriceForm" label-position="right" label-width="108px" style="width:390px;">
                <el-form-item label="企业代码" prop="orgCode">
                    <el-input v-model="enterpriceForm.orgCode" placeholder="企业代码" />
                </el-form-item>
                <el-form-item label="企业名称" prop="name">
                    <el-input v-model="enterpriceForm.name" placeholder="企业名称" />
                </el-form-item>
                <el-form-item label="联系电话" prop="tel">
                    <el-input v-model="enterpriceForm.tel" placeholder="详细地址" />
                </el-form-item>
                <el-form-item label="小程序名称" prop="appName">
                    <el-input v-model="enterpriceForm.appName" placeholder="小程序介绍" />
                </el-form-item>
                <el-form-item label="小程序介绍" prop="intro">
                    <el-input v-model="enterpriceForm.intro" placeholder="小程序介绍" />
                </el-form-item>
                <el-form-item label="服务类型" prop="serviceType1">
                    <el-input v-model="enterpriceForm.serviceType1" placeholder="小程序介绍" />
                </el-form-item>
                <el-form-item label="纳税人识别号" prop="taxRegistrationCertificateNo">
                    <el-input v-model="enterpriceForm.taxRegistrationCertificateNo" placeholder="纳税人识别号" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible = false">取消</el-button>
                <el-button type="primary" @click="saveInfo()">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getEnterpriseInfo, updateEnterpriseInfo, getTabs, delTabById, addTab } from '@/api/mall'
import { deepClone } from '@/utils/index'
export default {
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
            dialogFormVisible: false,
            tabs: [],
            enterpriceForm: {
                orgCode: '',
                name: '',
                tel: '',
                intro: '',
                serviceType1: '',
                taxRegistrationCertificateNo: '',
            },
            inputVisible: false,
            inputValue: '',
            rules: {
                orgCode: [{ required: true, message: '企业代码不能为空', trigger: 'change' }],
                name: [{ required: true, message: '企业名称不能为空', trigger: 'change' }],
                tel: [{ required: true, message: '联系电话不能为空', trigger: 'change' }],
                intro: [{ required: true, message: '小程序介绍不能为空', trigger: 'change' }],
                appName: [{ required: true, message: '小程序名称不能为空', trigger: 'change' }],
                tel: [{ required: true, message: '联系电话不能为空', trigger: 'change' }],
                serviceType1: [{ required: true }],
                taxRegistrationCertificateNo: [{ required: true, message: '纳税人识别号不能为空', trigger: 'change' }]
            },
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
                }
            })
        },
        getTabsData() {
            getTabs().then(res => {
                if (res.data.errorCode == 0) {
                    this.tabs = res.data.data || []
                }
            })
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        handleClose(row) {
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
        handleInputConfirm() {
            var obj = {
                seq: 1,
                tabCode: 2,
                tabName: this.inputValue
            }
            addTab(obj).then(res => {
              if (res.data.errorCode == 0) {
                this.$message.success('已添加！')
                this.getTabsData()
                this.$nextTick(() => {
                  this.inputVisible = false;
                  this.inputValue = '';
                })
              }
            })
        },
        showCompile() {
            this.dialogFormVisible = true
            this.enterpriceForm = deepClone(this.enterpriseInfo)
        },
        saveInfo() {
            this.$refs.dataForm.validate(valid => {
                if (valid) {
                    updateEnterpriseInfo(this.enterpriceForm).then(res => {
                        this.$message.success('修改成功！')
                        this.getData()
                        this.dialogFormVisible = false
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
</style>
<style scoped>
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
    width: 80px;
}
</style>