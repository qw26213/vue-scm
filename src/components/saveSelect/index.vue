<template>
    <el-dialog :close-on-click-modal="false" title="保存选择" :visible.sync="visible" width="420px">
        <el-form ref="dataForm" label-position="right" label-width="80px" :model="form" :rules="rules" style="width: 370px; margin-lef:15px;">
            <el-form-item label="模板编码" prop="queryCode" required>
                <el-input v-model.trim="form.queryCode" style="width:100%" />
            </el-form-item>
            <el-form-item label="模板名称" prop="queryName">
                <el-input v-model.trim="form.queryName" style="width:100%" />
            </el-form-item>
            <el-form-item label="模板类型" prop="templateType">
                <el-radio v-model="form.templateType" label="1" style="margin-right:10px">公司模板</el-radio>
                <el-radio v-model="form.templateType" label="2">个人模板</el-radio>
            </el-form-item>
            <el-form-item label="模板说明" prop="remarks">
                <el-input v-model.trim="form.remarks" style="width:100%" />
            </el-form-item>
            <el-form-item label="顺序号" prop="seq">
                <el-input v-model.trim="form.seq" maxLength="2" style="width:100%" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
            <el-button type="default" @click="$emit('update:dialogvisible', false)">取消</el-button>
            <el-button type="primary" @click="save">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    name: 'saveSelect',
    props: ['dialogvisible'],
    data() {
        return {
            visible: false,
            form: {
                queryCode: '',
                queryName: '',
                templateType: '',
                remarks: '',
                seq: ''
            },
            rules: {
                queryCode: [{ required: true, trigger: 'blur', message: '模板编码不能为空' }],
                queryName: [{ required: true, trigger: 'blur', message: '模板名称不能为空' }],
                templateType: [{ required: true, trigger: 'blur', message: '请选择模板类型' }],
                remarks: [{ required: true, trigger: 'blur', message: '模板说明不能为空' }]
            }
        }
    },
    watch: {
        dialogvisible(val) {
            if (val) {
                this.visible = true
                this.form.status = '1'
                this.form.remarks = ''
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
            } else {
                this.visible = false
            }
        },
        visible(val) {
            this.$emit('update:dialogvisible', val)
        }
    },
    methods: {
        save() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$emit('saveTemplate', this.form)
                }
            })
        }
    }
}
</script>
<style scoped>
.message-title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding-right: 8px;
}
</style>
<style lang="scss" scoped>
>>>.el-dialog__body {
    padding-bottom: 20px!important
}
</style>