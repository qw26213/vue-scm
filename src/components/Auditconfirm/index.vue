<template>
    <el-dialog v-if="type==='create'" :close-on-click-modal="false" title="审核" :visible.sync="visible" width="400px">
        <el-form ref="dataForm" label-position="right" label-width="80px" :model="form" style="width: 360px; margin-lef:10px;">
            <el-form-item label="审核结果" prop="status" required>
                <el-radio v-model="form.status" label="1" style="margin-right:10px">通过</el-radio>
                <el-radio v-model="form.status" label="-1">不通过</el-radio>
            </el-form-item>
            <el-form-item label="审核意见" prop="remarks" :rules="form.status==-1 ? {required: true, message: '审核意见不能为空', trigger: 'change'} : {}">
                <el-input type="textarea" v-model.trim="form.remarks" style="width:100%" />
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
            <el-button type="default" @click="$emit('update:dialogvisible', false)">取消</el-button>
            <el-button type="primary" @click="saveAudit">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog v-else :close-on-click-modal="false" title="查看审核意见" :visible.sync="visible" width="600px">
        <el-table style="width: 100%;" :data="remarklist" size="small" border resize>
            <el-table-column label="审核日期" prop="auditDate" width="140" align="center" />
            <el-table-column label="审核人" prop="auditorName" width="120" align="center" />
            <el-table-column label="审核意见" prop="remarks" />
        </el-table>
    </el-dialog>
</template>
<script>
export default {
    name: 'auditConfirm',
    props: ['dialogvisible', 'remarklist', 'type'],
    data() {
        return {
            visible: false,
            form: {
                status: '1',
                remarks: ''
            }
        }
    },
    watch: {
        dialogvisible(val) {
            if (val) {
                this.visible = true
                this.form.status = '1'
                this.form.remarks = ''
                if (this.type === 'create') {
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                }
            } else {
                this.visible = false
            }
        },
        visible(val) {
            this.$emit('update:dialogvisible', val)
        }
    },
    methods: {
        saveAudit() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    this.$emit('auditBill', this.form)
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