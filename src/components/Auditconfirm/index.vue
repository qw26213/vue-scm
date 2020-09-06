<template>
  <el-dialog :close-on-click-modal="false" title="确认审核" :visible.sync="visible" width="400px">
      <el-form label-position="right" label-width="72px" style="width: 360px; margin-lef:10px;">
        <el-form-item label="审核结果">
            <el-radio v-model="form.status" label="1" style="margin-right:10px">通过</el-radio>
            <el-radio v-model="form.status" label="0">不通过</el-radio>
        </el-form-item>
        <el-form-item label="审核意见">
            <el-input v-model="form.remarks" style="width:100%" />
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
      this.$emit('auditBill', this.form)
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
