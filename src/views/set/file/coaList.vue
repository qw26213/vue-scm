<template>
  <div class="app-container">
    <div class="filterDiv">
      <el-radio-group v-model="coaClassCode" size="small" @change="getData">
        <el-radio-button v-for="(item,index) in coaClassList" :key="index" :label="item.coaClassCode">{{ item.coaClassName }}</el-radio-button>
      </el-radio-group>
      <el-button type="primary" size="small" style="float:right" @click="updateDispNameByUuid()">校正名称</el-button>
    </div>
    <div class="contentDiv">
      <el-table :data="tableData" border fit resize empty-text="无同步数据" style="width: 100%;" size="small">
        <el-table-column label="科目编码">
          <template slot-scope="{row}">
            <span>{{ row.coaCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科目名称" min-width="100" show-overflow-tooltip>
          <template slot-scope="{row}">
            <span v-html="row.pageCoaName" />
          </template>
        </el-table-column>
        <el-table-column label="科目分类" min-width="100" align="center">
          <template slot-scope="{row}">
            <span>{{ row.coaClassName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="方向" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.crDr == 1?'借':'贷' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="辅助核算" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isAuxiliary == 1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="币种核算" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isCurrency == 1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="数量核算" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isQuantity == 1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="禁用" min-width="80" align="center">
          <template slot-scope="{row}">
            <span>{{ row.isDisable == 1?'是':'否' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="260" align="center">
          <template slot-scope="{row}">
            <el-button type="text" size="small" @click="handleAdd(row)">新增下级</el-button>
            <el-button type="text" size="small" @click="handleCompile(row)">修改</el-button>
            <el-button type="text" size="small" @click="handleDel(row)">删除</el-button>
            <el-button type="text" size="small" @click="handleDisable(row)">{{ row.isDisable == 1?'解禁':'禁用' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增下级科目':'修改科目'" :visible.sync="dialogFormVisible" width="620px">
      <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="85px" style="width: 580px; margin-left:10px;">
        <el-form-item label="科目类别" prop="coaClassId">
          <el-input v-model="temp.coaClassName" placeholder="科目类别" disabled />
        </el-form-item>
        <el-form-item label="科目代码" prop="coaCode">
          <el-input v-model="temp.coaCode" placeholder="科目代码" :disabled="dialogStatus=='update' && temp.unchageableFlag==1" />
        </el-form-item>
        <el-form-item label="科目名称" prop="coaName" min-width="220">
          <el-input v-model="temp.coaName" placeholder="科目名称" :disabled="dialogStatus=='update' && temp.unchageableFlag==1" />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='create'" label="上级科目" prop="parentId">
          <el-input v-model="parentName" placeholder="上级科目" disabled />
        </el-form-item>
        <el-form-item v-if="dialogStatus=='update'" label="上级科目" prop="parentId">
          <el-input v-for="item in coaArr" v-if="temp.parentId == item.id" :key="item.id" v-model="item.coaName" placeholder="上级科目" disabled />
        </el-form-item>
        <el-form-item label="借贷方向" prop="crDr" style="width:265px">
          <el-radio v-model="temp.crDr" :label="1" :disabled="dialogStatus=='update' && temp.unchageableFlag==1">借</el-radio>
          <el-radio v-model="temp.crDr" :label="-1" :disabled="dialogStatus=='update' && temp.unchageableFlag==1">贷</el-radio>
        </el-form-item>
        <el-form-item label="是否现金" prop="cashFlowFlag" style="width:265px">
          <el-radio v-model="temp.cashFlowFlag" :label="1">是</el-radio>
          <el-radio v-model="temp.cashFlowFlag" :label="0">否</el-radio>
        </el-form-item>
        <el-form-item v-if="temp.noAuxiliary == 0 && dialogStatus == 'create'" label="" style="width:600px">
          <el-checkbox v-model="temp.isCurrency" disabled :false-label="0" :true-label="1">币种核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxiliary" :disabled="isForceAddChild==1" :false-label="0" :true-label="1">辅助核算(至多选6项)</el-checkbox>
          <el-checkbox v-model="temp.isQuantity" :disabled="isForceAddChild==1" :false-label="0" :true-label="1">数量核算</el-checkbox>
          <el-input v-if="temp.isQuantity==1" v-model="temp.uom" :disabled="isForceAddChild==1" placeholder="计量单位" style="width:120px" />
        </el-form-item>
        <el-form-item v-if="dialogStatus == 'update'" label="" style="width:600px">
          <el-checkbox v-model="temp.isCurrency" disabled :false-label="0" :true-label="1">币种核算</el-checkbox>
          <el-checkbox v-model="temp.isAuxiliary" :disabled="temp.noAuxiliary==1 || temp.leaf==0 || temp.usedFlag==1" :false-label="0" :true-label="1">辅助核算(至多选6项)</el-checkbox>
          <el-checkbox v-model="temp.isQuantity" :disabled="temp.noAuxiliary==1 || temp.leaf==0 || temp.usedFlag==1" :false-label="0" :true-label="1">数量核算</el-checkbox>
          <el-input v-if="temp.isQuantity==1" v-model="temp.uom" :disabled="temp.noAuxiliary==1 || temp.leaf==0 || temp.usedFlag==1" placeholder="计量单位" style="width:100px" />
        </el-form-item>
        <el-form-item v-if="temp.isAuxiliary==1 && temp.noAuxiliary == 0" style="width:600px">
          <el-checkbox v-model="temp.auxiliary[0]" :checked="temp.auxiliary&&temp.auxiliary[0]==1" false-label="0" true-label="1">供应商</el-checkbox>
          <el-checkbox v-model="temp.auxiliary[1]" :checked="temp.auxiliary&&temp.auxiliary[1]==1" false-label="0" true-label="1">客户</el-checkbox>
          <el-checkbox v-model="temp.auxiliary[2]" :checked="temp.auxiliary&&temp.auxiliary[2]==1" false-label="0" true-label="1">部门</el-checkbox>
          <el-checkbox v-model="temp.auxiliary[3]" :checked="temp.auxiliary&&temp.auxiliary[3]==1" false-label="0" true-label="1">职员</el-checkbox>
          <el-checkbox v-model="temp.auxiliary[4]" :checked="temp.auxiliary&&temp.auxiliary[4]==1" false-label="0" true-label="1">存货</el-checkbox>
          <el-checkbox v-model="temp.auxiliary[5]" :checked="temp.auxiliary&&temp.auxiliary[5]==1" false-label="0" true-label="1">项目</el-checkbox>
        </el-form-item>
        <el-form-item label="" style="width:610px">
          <el-checkbox v-model="temp.isDisable" :disabled="!(dialogStatus=='update'&&temp.leaf==1 && temp.unchageableFlag==0)" :false-label="0" :true-label="1">是否禁用</el-checkbox>
          <el-checkbox v-model="temp.isDisableChildren" :disabled="!(dialogStatus=='update'&&temp.leaf==1 && temp.unchageableFlag==0)" :false-label="0" :true-label="1">同时修改子科目</el-checkbox>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="save()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getCoaDatatables, coaClassification, delCoa, updateDisabledCoa, saveCoa, updateDispName, getGlCoaCode } from '@/api/user'
import { getCoaCodeUsedByIdNoSysTemplet, getChildrenCountByParentId, getCoaCodeUsedById, getChildCountById, getMsgBeforeDelete } from '@/api/user'
import { deepClone } from '@/utils/index.js'
export default {
  data() {
    return {
      temp: {
        id: '',
        coaClassId: '',
        coaClassName: '',
        coaCode: '',
        coaName: '',
        parentId: '',
        crDr: 1,
        isCurrency: 0,
        isDisable: 0,
        isAuxiliary: 0,
        isQuantity: 0,
        uom: '',
        isDisableChildren: 0,
        cashFlowFlag: 0,
        crDr: 1,
        auxiliary: [0, 0, 0, 0, 0, 0, 0],
        unchageableFlag: 0,
        coaHierarchyId: '',
        coaLevel: '',
        coaIndustryId: '',
        dispName: '',
        noAuxiliary: '',
        usedFlag: 0,
        leaf: 0
      },
      resetTemp: {
        id: '',
        coaClassId: '',
        coaClassName: '',
        coaCode: '',
        coaName: '',
        parentId: '',
        crDr: 1,
        isCurrency: 0,
        isDisable: 0,
        isAuxiliary: 0,
        isQuantity: 0,
        uom: '',
        isDisableChildren: 0,
        cashFlowFlag: 0,
        crDr: 1,
        auxiliary: [0, 0, 0, 0, 0, 0, 0],
        unchageableFlag: 0,
        coaHierarchyId: '',
        coaLevel: '',
        coaIndustryId: '',
        dispName: '',
        noAuxiliary: '',
        usedFlag: 0,
        leaf: 0
      },
      parentName: '',
      rules: {
        coaName: [{ required: true, message: '不能为空', trigger: 'change' }],
        coaCode: [{ required: true, message: '不能为空', trigger: 'change' }]
      },
      isForceAddChild: 0,
      dialogStatus: 'update',
      dialogFormVisible: false,
      coaClassCode: '',
      coaClassList: [],
      tableData: []
    }
  },
  computed: {
    ...mapGetters([
      'coaArr'
    ])
  },
  mounted() {
    this.$store.dispatch('voucher/getCoaList')
    this.getCoaClass()
  },
  methods: {
    handleCompile(row) {
      for (var key in this.temp) {
        this.temp[key] = row[key]
      }
      this.temp.auxiliary = (row.auxiliary || '000000000000000').split('')
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleAdd(row) {
      this.isForceAddChild = 0
      getCoaCodeUsedByIdNoSysTemplet(row.id).then(res => {
        if (res.data.data == 1) {
          this.$confirm('本科目已被使用，增加第一个下级科目时，系统将把上述信息更新至新增的下级科目中,是否继续？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isForceAddChild = 1
            console.log('强制增加下级')
            this.initAddFrom(row)
          })
        } else {
          getCoaCodeUsedById(row.id).then(rep => {
            this.isForceAddChild = rep.data.data
            this.initAddFrom(row)
          })
        }
      })
    },
    initAddFrom(row) {
      for (var key in this.temp) {
        this.temp[key] = this.resetTemp[key]
      }
      this.temp.coaClassName = row.coaClassName
      this.temp.coaClassId = row.coaClassId
      this.temp.parentId = row.id
      this.parentName = row.coaName
      this.temp.cashFlowFlag = row.cashFlowFlag
      this.temp.crDr = row.crDr
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      var obj = {
        coaCode: row.coaCode,
        coaLevel: row.coaLevel,
        coaStartCode: row.coaStartCode
      }
      getGlCoaCode(obj).then(res => {
        this.temp.coaCode = res.data.data
      })
    },
    updateDispNameByUuid() {
      var id = sessionStorage.bookId
      updateDispName(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getData()
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const obj = deepClone(this.temp)
          obj.auxiliary = this.temp.auxiliary.join('')
          saveCoa(obj).then(res => {
            if (res.data.errorCode == 0) {
              this.getData()
              this.dialogFormVisible = false
              this.$message.success(this.dialogStatus == 'create' ? '新增下级科目成功' : '修改科目成功')
            } else {
              this.$message.warning(res.data.msg)
            }
          })
        }
      })
    },
    handleDisable(row) {
      var isDisable = row.isDisable
      var coaCode = row.coaCode
      var coaName = row.coaName
      var info = ''
      if (isDisable != 1) {
        isDisable = 1
        info = '确定要禁用【' + coaCode + ' ' + coaName + '】及子科目吗？'
      } else {
        isDisable = 0
        info = '确定要解除禁用【' + coaCode + ' ' + coaName + '】及父科目(禁用的子科目并不会同时解除禁用)吗？'
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
            this.getData()
            this.$message.success('修改科目禁用标志完成！')
          } else {
            this.$message.error(res.data.msg)
          }
        })
      })
    },
    handleDel(row) {
      getMsgBeforeDelete(row.id).then(resp => {
        if (resp.data.errorCode == 0) {
          this.$confirm(resp.data.msg, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.delCourse(row.id)
          }).catch(err => {
            console.log(err)
          })
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    delCourse(id) {
      delCoa(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getData()
          this.$message.success('删除科目成功')
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
