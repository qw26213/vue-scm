<template>
    <div class="app-container">
        <div v-for="(item,index) in tableData" :key="index" class="orderItem">
            <div class="clearfix toper" style="height:28px">
                <span>订单号：{{item.billNo}}</span>
                <el-button size="mini" type="text" style="float:right;color:#F56C6C;" @click="deleteOrder(item)">删除</el-button>
                <el-button size="mini" type="text" style="float:right;color:#409EFF;margin-right:15px;" @click="showOrder(item)">查看订单</el-button>
            </div>
            <el-table :key="tableKey" :data="item.salesDetail" fit highlight-current-row :show-header="false" style="width: 100%;">
                <el-table-column label="商品名称" width="190">
                    <template slot-scope="{row}">
                        <div class="itemUrl" :style="{'background-image': 'url('+row.fileUrl+')'}"></div>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称" min-width="120">
                    <template slot-scope="{row}">
                        <span>{{row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" align="center">
                    <template slot-scope="{row}">
                        <span>规格：{{row.norms}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价(元)" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <span>单价：{{row.price | Fixed}}元</span>
                    </template>
                </el-table-column>
                <el-table-column label="数量" align="center">
                    <template slot-scope="{row}">
                        <span>x{{row.qty}}{{row.uom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="金额" min-width="100" align="center">
                    <template slot-scope="{row}">
                        <div class="udb tx-c">金额：{{ row.amount | Fixed }}元</div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :close-on-click-modal="false" title="订单详情" :visible.sync="dialogFormVisible" width="960px">
            <div style="width:100%;border:1px #eee solid;">
                <div class="clearfix toper" style="height:28px">
                    <span>订单号：{{orderInfo.billNo}}</span>
                </div>
                <el-table :key="tableKey" :data="orderInfo.salesDetail" fit highlight-current-row :show-header="false" style="width: 100%;">
                    <el-table-column label="商品名称" width="190">
                        <template slot-scope="{row}">
                            <div class="itemUrl" :style="{'background-image': 'url('+row.fileUrl+')'}"></div>
                        </template>
                    </el-table-column>
                    <el-table-column label="商品名称" min-width="120">
                        <template slot-scope="{row}">
                            <span>{{row.itemName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="规格" align="center">
                        <template slot-scope="{row}">
                            <span>规格：{{row.norms}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="单价(元)" min-width="100" align="center">
                        <template slot-scope="{row}">
                            <span>单价：{{row.price | Fixed}}元</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="数量" align="center">
                        <template slot-scope="{row}">
                            <span>x{{row.qty}}{{row.uom}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="金额" min-width="100" align="center">
                        <template slot-scope="{row}">
                            <div class="udb tx-c">金额：{{ row.amount | Fixed }}元</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="clearfix toper" style="height:28px;background:#f9f9f9;border-top:1px solid:#eee">
                    <span>收货人：{{orderInfo.contact}}</span>
                    <span style="margin-left:20px">联系电话：{{orderInfo.tel}}</span>
                    <span style="margin-left:20px">地址：{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.district}}{{orderInfo.addr}}</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getOrderData, delOrder, getOrderInfo } from '@/api/mall'
export default {
    name: 'merchantList',
    filters: {
        Fixed(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2)
        }
    },
    data() {
        return {
            tableKey: 0,
            tableData: null,
            total: 0,
            listLoading: false,
            orderInfo: {},
            dialogFormVisible: false,
            listQuery: {
                page: 1,
                pageSize: 100
            },
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
            this.$confirm("确认删除吗？", '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delTabById({ headerId: row.id }).then(res => {
                    if (res.data.errorCode == 0) {
                        this.$message.success('订单删除成功')
                        this.getTabsData()
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                })
            })
        },
        showOrder(row) {
            getOrderInfo({ headerId: row.id }).then(res => {
                if (res.data.errorCode == 0) {
                    this.orderInfo = res.data.data
                    this.dialogFormVisible = true
                } else {
                    this.$message.warning(res.data.msg)
                }
            })
        },
        handleCreate() {
            this.$router.push('/merchantAdd');
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