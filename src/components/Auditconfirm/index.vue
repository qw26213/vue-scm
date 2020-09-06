<template>
  <el-dialog :close-on-click-modal="false" title="确认审核" :visible.sync="visible" width="400px">
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
</template>

<script>
export default {
  name: 'auditConfirm',
  props: ['dialogvisible'],
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
      if(val) {
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
