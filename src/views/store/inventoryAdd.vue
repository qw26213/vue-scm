<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker :editable="false" v-model="temp.billDate" type="date" placeholder="单据日期" size="mini" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="mini" v-model="temp.billNo" placeholder="单据号" disabled />
                </el-form-item>
                <el-form-item label="盘点类型:" prop="inventoryType">
                    <el-select v-model="temp.inventoryType" size="mini">
                        <el-option label="报损" :value="0"></el-option>
                        <el-option label="盘盈/盘亏" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="仓库:" prop="warehouseId">
                    <warehouseList @selectChange="selectChange" allowNull="1" keyType="warehouseId" :selectId="temp.warehouseId"></warehouseList>
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
                <el-form-item label="成本金额:" prop="wmapAmount">
                    <el-input size="mini" v-model="temp.wmapAmount" placeholder="成本金额" />
                </el-form-item>
                <el-form-item label="商品金额:" prop="itemAmount">
                    <el-input size="mini" v-model="temp.itemAmount" placeholder="商品金额" />
                </el-form-item>
                <el-form-item label="运费:" prop="freightAmount">
                    <el-input size="mini" v-model="temp.freightAmount" placeholder="运费" />
                </el-form-item>
                <el-form-item label="金额合计:" prop="sumAmount">
                    <el-input size="mini" v-model="temp.sumAmount" placeholder="金额合计" />
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="tdCell">
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="仓库选择" width="160">
                <template slot-scope="scope">
                  <el-select v-model="scope.row.warehouseId" style="border:none;width: 100%;display: block;" disabled placeholder="" size="mini">
                      <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.id"></el-option>
                  </el-select>
                </template>
            </el-table-column>
            <el-table-column label="商品名称" width="160">
                <template slot-scope="scope">
                    <itemList :selectCode="scope.row.itemCode" :selectId="scope.row.itemId" :index="scope.$index" :item-list="item_list" @changeVal="changeVal" />
                </template>
            </el-table-column>
            <el-table-column label="商品代码" width="160">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemCode" disabled>
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.norms" disabled>
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                </template>
            </el-table-column>
            <el-table-column label="批号">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.batchNo" disabled>
                </template>
            </el-table-column>
            <el-table-column label="账簿数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.bookQty" disabled>
                </template>
            </el-table-column>
            <el-table-column label="实际数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.actualQty" disabled @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="盘盈盘亏数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.qty" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
        </el-table>
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="制单日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="制单人:" prop="recorderId">
                    <el-input size="mini" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="mini" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人:" prop="auditorId">
                    <el-input size="mini" v-model="temp.auditor" placeholder="审核人" />
                </el-form-item>
            </el-form>
        </div>
        <div class="tx-c" style="margin-top:15px" v-if="status!=1&&status!=2">
            <el-button class="filter-item" type="primary" @click="save">保存</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="选择仓库" :visible.sync="dialogFormVisible" :show-close="false" width="420px">
            <el-form ref="dataForm" :rules="rules" :model="form" label-position="right" label-width="88px" style="width:400px; margin:10px 25px;">
                <el-form-item label="选择仓库:" prop="warehouseId">
                    <el-select v-model="form.warehouseId" style="width:240px" placeholder="选择仓库" size="small">
                        <el-option label="全部" value="null"></el-option>
                        <el-option v-for="item in warehouseList" :label="item.warehouseName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="零库存:" prop="includeZero">
                    <el-checkbox v-model="form.includeZero" :false-label="0" :true-label="1" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button type="primary" @click="initInventory">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { saveInventory, getInventoryById, queryBookQtyList } from '@/api/sale'
import { getItem, getWarehouse, getTruck } from '@/api/basedata'
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils'
import { getResPageByFuzzyCustId } from '@/api/store'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
import warehouseList from '@/components/selects/warehouseList'
import itemList from '@/components/selects/saleItemList'
import settleTypeList from "@/components/selects/settleTypeList"
import salesTypeList from "@/components/selects/salesTypeList"
import { getName, getNowDate } from '@/utils/auth'
export default {
    name: 'saleAdd',
    components: { staffList, warehouseList, custList, itemList },
    data() {
        return {
            id: '',
            status: this.$route.query.status,
            settleData: [{}, {}, {}, {}, {}],
            dialogFormVisible: false,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            item_list: [],
            warehouseList: [],
            truckList: [],
            form: {
                warehouseId: '',
                includeZero: 0
            },
            rules: {
                warehouseId: [{ required: true, message: '业务员不能为空', trigger: 'change' }]
            },
            temp: {
                billDate: getNowDate(),
                statusInvoice: 1,
                billNo: '',
                bizTypeId: '',
                inventoryType: 1,
                warehouseId: '',
                warehouseName: '',
                truckId: '',
                truckName: '',
                staffId: '',
                paymentTypeId: '',
                paymentDueDate: '',
                currPayAmount: 0,
                itemAmount: 0,
                advPayAmount: 0,
                rebateAmount: 0,
                withoutPayAmount: 0,
                auditDate: '',
                returnedType: 0,
                auditor: '',
                recordDate: getNowDate() + ' 00:00:00',
                recorder: getName()
            }
        }
    },
    created() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            getInventoryById(this.id).then(res => {
                if (res.data.data) {
                    for (var key in this.temp) {
                        this.temp[key] = res.data.data[key]
                    }
                    this.temp.autoAdvr = true
                    const resp = res.data.data.inventoryLine || []
                    this.tableData = addNullObj(resp)
                    this.getItemList()
                }
            })
        } else {
            this.dialogFormVisible = true
        }
        this.getData()
    },
    methods: {
        getData() {
            getWarehouse().then(res => {
                this.warehouseList = res.data.data||[]
            })
            const obj = {
              pageIndex: 1,
              pageNum: 100,
              queryParam:{
                custId: this.temp.custId
              }
            }
            getItem(obj).then(res => {
                this.item_list = res.data.data||[]
            })
            getTruck().then(res => {
                this.truckList = res.data.data||[]
            })
        },
        initTableData(id) {
            getInventoryBySalesHeaderId(id).then(res => {
                for (var key in this.temp) {
                    this.temp[key] = res.data.data[key]
                }
                this.tableData = addNullObj(res.data.data.inventoryLine);
                this.settleData = addNullObj2(res.data.data.settleTypeReturnedDetail)
            })
        },
        initInventory() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    const data = this.form
                    queryBookQtyList(data).then(res => {
                        this.dialogFormVisible = false
                        var resdata = res.data.data || []
                        this.tableData = addNullObj(resdata)
                    })
                }
            })
        },
        calculate(index) {
            var qty = this.tableData[index].qty
            var actualQty = this.tableData[index].actualQty
            if(qty&&actualQty){
                var bookQty = Number(qty) - Number(actualQty)
                this.$set(this.tableData[index],'bookQty',bookQty)
            }
        },
        showSettleType() {
            this.dialogFormVisible = true
        },
        settleTypeChange(obj) {
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key];
            }
        },
        salesTypeChange(obj){
            for(var key in obj){
                this.tableData[obj.index][key] = obj[key];
            }
        },
        selectChange(obj) {
            for (var key in obj) {
                this.temp[key] = obj[key];
            }
            if (obj && obj.warehouseId) {
                this.temp.warehouseName = obj.warehouseName
                this.temp.truckId = ''
                this.temp.truckName = ''
            }
            if (obj && obj.truckId) {
                this.temp.truckName = obj.truckName
                this.temp.warehouseName = ''
                this.temp.warehouseId = ''
            }
            if (obj.custId) {
                this.getItemList()
            }
        },
        getItemList() {
            const obj = {
              pageIndex: 1,
              pageNum: 100,
              queryParam:{
                custId: this.temp.custId
              }
            }
            getResPageByFuzzyCustId(obj).then(res => {
                this.item_list = res.data.data;
            })
        },
        changeVal(obj) {
            for (var key in obj) {
                this.tableData[obj.index][key] = obj[key];
            }
        },
        save() {
            this.temp.id = this.id;
            this.temp.inventoryLine = deleteEmptyProp(this.tableData)
            saveInventory(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.id == "" ? '新增成功' : '修改成功')
                    this.$store.dispatch('tagsView/delView', this.$route)
                    this.$router.replace('/store/inventory')
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(() => {
                this.$message.error('保存失败，请稍后重试！')
            })
        }
    }
}
</script>