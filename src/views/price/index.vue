<template>
  <div class="main">
    <div class="leftTree contentDiv">
      <div style="margin-bottom:10px">
        <el-input v-model="search" size="small" placeholder="商品名称" style="width:180px;margin-right: 5px">
          <el-button slot="append" type="primary" icon="el-icon-search" @click="getData" />
        </el-input>
      </div>
      <el-table :data="treeData" stripe fit style="width: 100%;" size="small" :row-class-name="rowClass" :row-style="curStyle" height="720" @row-click="rowClick">
        <el-table-column label="商品名称" prop="itemName" align="left" show-overflow-tooltip />
        <el-table-column label="规格" prop="norms" align="right" />
      </el-table>
    </div>
    <div class="app-container">
      <div class="contentDiv">
        <div class="clearfix">
          <el-button size="small" style="float:right" type="primary" :disabled="tableData.length == 0" @click="handleAnyModify">批量修改</el-button>
        </div>
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit style="width: 100%;margin-top:10px" size="small">
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column label="价格组编码">
            <template slot-scope="{row}">
              <span>{{ row.priceGroupCode }}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格组名称">
            <template slot-scope="{row}">
              <span>{{ row.priceGroupName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="售价(元)" align="right">
            <template slot-scope="{row}">
              <span>{{ row.price|Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="最新价(元)" align="right">
            <template slot-scope="{row}">
              <span>{{ row.lastPrice|Fixed }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生效时间" min-width="140" align="center">
            <template slot-scope="{row}">
              <span>{{ row.effectiveDate | parseDate }}</span>
            </template>
          </el-table-column>
          <el-table-column label="生效" min-width="80" align="center">
            <template slot-scope="{row}">
              <span>{{ row.isDisable==0?'是':'否' }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="220">
            <template slot-scope="{row}">
              <el-button type="text" size="small" @click="handleCompile(row)">改售价</el-button>
              <el-button type="text" size="small" @click="handleDel(row.id)">删除</el-button>
              <el-button type="text" size="small" @click="updateStatus(row)">{{ row.isDisable==1?'生效':'失效' }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog :close-on-click-modal="false" title="修改售价" :visible.sync="dialogFormVisible" width="380px">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="100px" style="width: 320px; margin-left:10px;">
          <el-form-item label="售价(元)" prop="price">
            <el-input v-model="temp.price" placeholder="售价" />
          </el-form-item>
          <el-form-item label="生效时间" prop="effectiveDate" class="question">
            <el-tooltip class="item" effect="dark" content="价格生效时间" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            <el-date-picker v-model="temp.effectiveDate" type="datetime" style="width:220px" placeholder="生效时间" value-format="yyyy-MM-dd HH:mm:ss" />
          </el-form-item>
          <el-form-item label="改价类型" prop="modifiedType" class="question">
            <el-tooltip class="item" effect="dark" content="业务员修改商品价格类型" placement="bottom">
              <i class="el-icon-question" />
            </el-tooltip>
            <el-select v-model="temp.modifiedType" placeholder="改价类型" style="width:220px">
              <el-option label="完全禁止" :value="0" />
              <el-option label="按商品" :value="1" />
              <el-option label="完全允许" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="是否有效" prop="isDisable">
            <el-radio v-model="temp.isDisable" :label="0">是</el-radio>
            <el-radio v-model="temp.isDisable" :label="1">否</el-radio>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="handleModify()">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog :close-on-click-modal="false" title="批量修改价格" :visible.sync="dialogFormVisible2" :show-close="false" width="820px">
        <el-table ref="checkTable" :data="tableList" border fit style="width: 100%;" size="small" cell-class-name="compileall">
          <el-table-column label="价格组代码" align="left" prop="priceGroupCode" width="110" />
          <el-table-column label="价格组名称" align="left" prop="priceGroupName" width="110" />
          <el-table-column label="售价" align="right" width="120">
            <template slot-scope="{row}">
              <el-input v-model="row.price" size="small" placeholder="售价" style="width:100px" /></template>
          </el-table-column>
          <el-table-column label="生效时间" width="188">
            <template slot-scope="{row}">
              <el-date-picker v-model="row.effectiveDate" type="datetime" placeholder="生效时间" value-format="yyyy-MM-dd HH:mm:ss" style="width:170px" size="small" :clearable="false" />
            </template>
          </el-table-column>
          <el-table-column label="改价类型" align="center">
            <template slot-scope="{row}">
              <el-select v-model="row.modifiedType" placeholder="改价类型">
                <el-option label="完全禁止" :value="0" />
                <el-option label="按商品" :value="1" />
                <el-option label="完全允许" :value="2" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="是否生效" width="120" align="center">
            <template slot-scope="{row}">
              <el-radio v-model="row.isDisable" :label="0" style="margin-right:10px">是</el-radio>
              <el-radio v-model="row.isDisable" :label="1">否</el-radio>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer" align="center">
          <el-button @click="dialogFormVisible2 = false">取消</el-button>
          <el-button type="primary" @click="handleModify2()">确定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getPrice, savePrice, delPrice, updatePriceDisabled, getItem, updatePriceByItemIdPriceGroupIdList, updateLastPriceByItemIdPriceGroupId, updatePriceByItemIdPriceGroupId } from '@/api/basedata'
import { parseTime, deepClone } from '@/utils/index'
export default {
  name: 'PriceIndex',
  filters: {
    parseDate(val) {
      return val ? parseTime(val) : '未设定'
    },
    Fixed(num) {
      if (!num) { return '0.0000' }
      return parseFloat(num).toFixed(4)
    }
  },
  data() {
    const validateNum = (rule, value, callback) => {
      if (value == 0) {
        callback(new Error('售价不能为零'))
      } else if (value < 0) {
        callback(new Error('售价不能小于零'))
      } else {
        callback()
      }
    }
    return {
      search: '',
      tableKey: 0,
      treeData: [],
      getIndex: 0,
      tableData: [],
      tableList: [],
      total: 0,
      defaultProps: {
        children: 'children',
        label: 'itemName'
      },
      listLoading: true,
      listQuery: {
        itemId: ''
      },
      temp: {
        price: '',
        id: '',
        priceGroupId: '',
        modifiedType: 1,
        isDisable: 0,
        itemId: '',
        effectiveDate: new Date()
      },
      temp1: {
        lastPrice: '',
        priceGroupId: ''
      },
      dialogFormVisible: false,
      dialogFormVisible2: false,
      dialogStatus: '',
      rules: {
        price: [{ required: true, trigger: 'change', validator: validateNum }],
        effectiveDate: [{ required: false, message: '生效时间不能为空', trigger: 'change' }]
      },
      rules1: {
        lastPrice: [{ required: true, message: '最新价格不能为空', trigger: 'change' }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      var obj = {
        pageIndex: 1,
        pageNum: 20,
        queryParam: { itemCode: '', itemName: this.search }
      }
      getItem(obj).then(res => {
        this.treeData = res.data.data
        if (this.treeData.length > 0) {
          this.listQuery.itemId = this.treeData[0].id
          this.getList()
        }
      })
    },
    handleAnyModify() {
      this.dialogFormVisible2 = true
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].effectiveDate == null) {
          this.tableList[i].effectiveDate = new Date()
        }
      }
    },
    rowClass({ row, rowIndex }) {
      row.index = rowIndex
    },
    curStyle({ row, rowIndex }) {
      if ((this.getIndex) === rowIndex) {
        return {
          'background-color': '#e8f4ff'
        }
      }
    },
    rowClick(row, column, event) {
      this.getIndex = row.index
      this.listQuery.itemId = row.id
      this.getList()
    },
    getList() {
      this.listLoading = true
      getPrice(this.listQuery).then(res => {
        this.listLoading = false
        for (var i = 0; i < res.data.data.length; i++) {
          res.data.data[i].price = parseFloat(res.data.data[i].price).toFixed(4)
        }
        this.tableData = res.data.data
        this.tableList = deepClone(res.data.data)
      })
    },
    handleCompile(obj) {
      this.dialogFormVisible = true
      for (var key in this.temp) {
        this.temp[key] = obj[key]
      }
      this.temp.price = parseFloat(obj.price).toFixed(4)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateStatus(data) {
      this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.changeAvaiable(data)
      })
    },
    changeAvaiable(data) {
      var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
      updatePriceDisabled(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.$message.success(data.isDisable == 1 ? '解禁？' : '禁用？' + '成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDel(id) {
      this.$confirm('确认要删除吗?', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delItem(id)
      })
    },
    handleModify() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updatePriceByItemIdPriceGroupId(this.temp).then(res => {
            if (res.data.errorCode == 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$message.success('修改成功')
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }
      })
    },
    handleModify2() {
      this.tableList.forEach(item => {
        item.effectiveDate = parseTime(item.effectiveDate)
      })
      updatePriceByItemIdPriceGroupIdList(this.tableList).then(res => {
        if (res.data.errorCode == 0) {
          this.dialogFormVisible2 = false
          this.getList()
          this.$message.success('批量修改成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    delItem(id) {
      delPrice(id).then(res => {
        if (res.data.errorCode == 0) {
          this.getList()
          this.dialogFormVisible = false
          this.$message.success('删除成功')
        } else {
          this.$message.error(res.data.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.main {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0 10px;
    padding-left: 240px;
}

.leftTree {
    width: 220px;
    height: calc(100vh - 120px);
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
}

.tableDiv {
    width: 100%;
}
</style>
