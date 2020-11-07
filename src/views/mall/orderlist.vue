<template>
  <div v-loading="listLoading" class="app-container">
    <div class="contentDiv">
      <div v-for="(item,index) in tableData" :key="index" class="orderItem">
        <div class="clearfix toper" style="height:28px">
          <span>{{ item.createDate }} <i style="opacity:0">666</i>订单号：{{ item.billNo }}</span>
          <el-button size="small" type="text" style="float:right;color:#F56C6C;" @click="deleteOrder(item)">删除</el-button>
          <el-button size="small" type="text" style="float:right;color:#409EFF;margin-right:15px;" @click="showOrder(item)">查看订单</el-button>
          <el-button v-if="item.status===1 && item.deliveryType==1" size="small" type="text" style="float:right;margin-right:5px;" @click="scanDeliveryBill(item)">查看配送单</el-button>
          <el-button v-if="item.status===1" size="small" type="text" style="float:right;margin-right:5px;" @click="toBuildBill(item, 1, item.isOutboundOrder)">{{ item.isOutboundOrder==1?'查看':'生成' }}出库单</el-button>
          <el-button v-if="item.status===0" size="small" type="text" style="float:right;color:#409EFF;margin-right:5px;" @click="toAuditOrder(item)">审核</el-button>
        </div>
        <el-table :key="tableKey" :data="item.salesDetail" fit highlight-current-row :show-header="false" style="width: 100%;">
          <el-table-column label="商品图片" width="190">
            <template slot-scope="{row}">
              <div v-if="row.fileUrl" class="itemUrl" :style="{'background-image': 'url(' + row.fileUrl + ')'}" />
              <div v-else class="itemUrl" :style="{'background-image': 'url(' + nullImg + ')'}" />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row.itemName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template slot-scope="{row}">
              <span>规格：{{ row.norms }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" min-width="100" align="center">
            <template slot-scope="{row}">
              <span>单价：{{ row.price | Fixed }}元</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="{row}">
              <span>x{{ row.qty }}{{ row.uom }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" min-width="100" align="center">
            <template slot-scope="{row}">
              <div class="udb tx-c">金额：{{ row.amount | Fixed }}元</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="tableData.length===0 && !listLoading" style="width:100%;height:300px;line-height:300px;border:1px solid #eee;text-align:center">
        暂无订单
      </div>
    </div>
    <el-dialog :close-on-click-modal="false" title="订单详情" :visible.sync="dialogFormVisible1" width="960px">
      <div style="width:100%;border:1px #eee solid;">
        <div class="clearfix toper" style="height:28px">
          <span>订单号：{{ orderInfo.billNo }}</span>
        </div>
        <el-table :key="tableKey" :data="orderInfo.salesDetail" fit highlight-current-row :show-header="false" style="width: 100%;">
          <el-table-column label="商品名称" width="190">
            <template slot-scope="{row}">
              <div class="itemUrl" :style="{'background-image': 'url('+row.fileUrl+')'}" />
            </template>
          </el-table-column>
          <el-table-column label="商品名称" min-width="120">
            <template slot-scope="{row}">
              <span>{{ row.itemName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="规格" align="center">
            <template slot-scope="{row}">
              <span>规格：{{ row.norms }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单价(元)" min-width="100" align="center">
            <template slot-scope="{row}">
              <span>单价：{{ row.price | Fixed }}元</span>
            </template>
          </el-table-column>
          <el-table-column label="数量" align="center">
            <template slot-scope="{row}">
              <span>x{{ row.qty }}{{ row.uom }}</span>
            </template>
          </el-table-column>
          <el-table-column label="金额" min-width="100" align="center">
            <template slot-scope="{row}">
              <div class="udb tx-c">金额：{{ row.amount | Fixed }}元</div>
            </template>
          </el-table-column>
        </el-table>
        <div class="clearfix toper" style="height:28px;background:#f9f9f9;border-top:1px solid:#eee">
          <span>收货人：{{ orderInfo.contact }}</span>
          <span style="margin-left:20px">联系电话：{{ orderInfo.tel }}</span>
          <span style="margin-left:20px">地址：{{ orderInfo.province }}{{ orderInfo.city }}{{ orderInfo.district }}{{ orderInfo.addr }}</span>
        </div>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" title="请选择出库单日期" :visible.sync="dialogFormVisible2" width="400px">
      <el-form style="margin-top:30px;text-align:center;">
        <el-form-item label="" prop="isBillDate">
          <el-radio v-model="isBillDate" :label="0" style="margin-right:10px">当前日期</el-radio>
          <el-radio v-model="isBillDate" :label="1">销售单日期</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" align="center">
        <el-button type="default" @click="dialogFormVisible2 = false">取消</el-button>
        <el-button type="primary" @click="createBill()">确定</el-button>
      </div>
    </el-dialog>
    <modalTable :modal-table-visible="modalTableVisible" :header-id="salesHeaderId" type="s" />
    <outboundOrderBill :modal-table-visible="modalTableVisible1" :header-id="salesHeaderId" type="s" />
  </div>
</template>
<script>
import { getOrderData, getOrderInfo, auditOrder } from '@/api/mall'
import { buildOutboundOrderByHeaderId, buildDeliveryByHeaderId } from '@/api/sale'
import nullImg from '@/assets/null.png'
import modalTable from '@/components/modalTable/deliveryBill'
import outboundOrderBill from '@/components/modalTable/outboundOrderBill'
export default {
  name: 'orderlist',
  components: { modalTable, outboundOrderBill },
  filters: {
    Fixed(num) {
      if (!num) { return '0.00' }
      return parseFloat(num).toFixed(2)
    }
  },
  data() {
    return {
      nullImg,
      tableKey: 0,
      isBillDate: 0,
      curBillId: '',
      curBillDate: '',
      tableData: [],
      total: 0,
      listLoading: false,
      orderInfo: {},
      dialogFormVisible1: false,
      dialogFormVisible2: false,
      modalTableVisible: false,
      modalTableVisible1: false,
      listQuery: {
        page: 1,
        pageSize: 100
      },
      salesHeaderId: ''
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getOrderData(this.listQuery).then(response => {
        this.listLoading = false
        this.tableData = response.data.data || []
      })
    },
    deleteOrder(row) {
      this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTabById({ headerId: row.id }).then(res => {
          if (res.data.errorCode == 0) {
            this.$message.success('订单删除成功')
            this.getList()
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    toAuditOrder(row) {
      this.$confirm('确认审核通过吗？', '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        auditOrder({ headerId: row.id }).then(res => {
          if (res.data.errorCode == 0) {
            this.$message.success('订单已审核通过')
            this.getList()
          } else {
            this.$message.warning(res.data.msg)
          }
        })
      })
    },
    createBill() {
      var obj = { isBillDate: this.isBillDate, id: this.curBillId, billDate: this.curBillDate }
      buildSalesOrder(obj).then(res => {
        if (res.data.errorCode == 0) {
          this.dialogFormVisible2 = false
          this.getList()
          this.$message.success('生成出库单成功')
        } else {
          this.$message.warning(res.data.msg)
        }
      }).catch(() => {
        this.$message.error('生成失败，请稍后重试！')
      })
    },
    toBuildBill(row, status) {
      if (status === 1) {
          this.salesHeaderId = row.id
          this.modalTableVisible1 = true
      } else {
        this.type = type
        this.dialogFormVisible2 = true
        this.curBillId = row.id
        this.curBillDate = row.billDate
      }
    },
    scanDeliveryBill(row) {
      this.salesHeaderId = row.id
      this.modalTableVisible = true
    },
    toDeliveryDetail(id) {
      this.$router.push('/sale/deliveryDetail?id=' + id)
    },
    showOrder(row) {
      getOrderInfo({ headerId: row.id }).then(res => {
        if (res.data.errorCode == 0) {
          this.orderInfo = res.data.data
          this.dialogFormVisible1 = true
        } else {
          this.$message.warning(res.data.msg)
        }
      })
    },
    handleCreate() {
      this.$router.push('/merchantAdd')
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.el-dialog__body {
    padding: 10px 20px 20px!important;
}
</style>
<style scoped>
.orderItem {
    margin-bottom: 15px;
    border-radius: 4px;
    border: 1px #eee solid;
}

.toper {
    background: #f9f9f9;
    height: 28px;
    padding-left: 15px;
    padding-right: 15px
}

.toper span {
    font-size: 13px;
    display: inline-block;
    line-height: 28px;
    color: #666
}

.pointer {
    cursor: pointer;
    text-decoration: underline;
}

.itemUrl {
    width: 180px;
    height: 120px;
    background-color: #f1f1f1;
    border-radius: 4px;
    border: 1px #e5e5e5 solid;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: inline-block;
}
</style>
