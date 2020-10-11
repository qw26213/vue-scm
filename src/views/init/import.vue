<template>
  <div class="app-container">
    <div class="contentDiv">
      <el-table :data="tableData" border fit resize style="width: 100%;" size="small">
        <el-table-column type="index" label="序号" align="center" />
        <el-table-column label="导入项" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方向" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.count }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作类型" min-width="80" align="center">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="fileImport(row.id)">导入</el-button>
          </template>
        </el-table-column>
      </el-table>
      <input ref="uploadFile" enctype="multipart/form-data" style="display:none" type="file" @change="importFile($event)">
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      tableData: [{
        name: '客户',
        count: 0,
        id: 1
      }, {
        name: '商品',
        count: 0,
        id: 2
      }, {
        name: '期初余额',
        count: 0,
        id: 3
      }, {
        name: '库存',
        count: 0,
        id: 4
      }],
      dialogVisible: false,
      temp: {
        file: ''
      },
      type: 0,
      formData: {}
    }
  },
  mounted() {

  },
  methods: {
    fileImport(id) {
      this.type = id
      this.temp.file = ''
      this.$refs.uploadFile.click()
    },
    importFile(event) {
      this.formData = new FormData()
      var fileObj = event.currentTarget.files[0]
      if (fileObj == null || fileObj == undefined) { return }
      this.formData.append('file', fileObj)
      this.formData.append('fileName', 'employee.xlsx')
      this.saveImport()
    },
    saveImport() {
      if (this.type === 1) {
        this.$axios({
          url: '/drp/importData/cust',
          method: 'POST',
          data: this.formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          if (res.status == 200) {
            this.dialogVisible = false
          } else {
            this.$message.error('系统错误')
          }
        }).catch(res => {
          this.$message.error('导入失败,请稍后重试')
        })
      }
      if (this.type === 2) {
        this.$axios({
          url: '/drp/importData/item',
          method: 'POST',
          data: this.formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          if (res.status == 200) {
            this.dialogVisible = false
          } else {
            this.$message.error('系统错误')
          }
        }).catch(res => {
          this.$message.error('导入失败,请稍后重试')
        })
      }
      if (this.type === 3) {
        this.$axios({
          url: '/drp/importData/beginBalance',
          method: 'POST',
          data: this.formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          if (res.status == 200) {
            this.dialogVisible = false
          } else {
            this.$message.error('系统错误')
          }
        }).catch(res => {
          this.$message.error('导入失败,请稍后重试')
        })
      }
      if (this.type === 4) {
        this.$axios({
          url: '/drp/importData/onhand',
          method: 'POST',
          data: this.formData,
          timeout: 10000,
          headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
          if (res.status == 200) {
            this.dialogVisible = false
          } else {
            this.$message.error('系统错误')
          }
        }).catch(res => {
          this.$message.error('导入失败,请稍后重试')
        })
      }
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
