<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="发票日期:" prop="invoiceDate">
                    <el-date-picker :editable="false" v-model="temp.invoiceDate" type="date" placeholder="发票日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="发票号:" prop="invoiceNo">
                    <el-input size="small" v-model="temp.invoiceNo" placeholder="发票号" />
                </el-form-item>
                <el-form-item label="客户:" prop="custId">
                    <custList @selectChange="selectChange" keyType="custId" :contact="1" :selectId="temp.custId" />
                </el-form-item>
                <el-form-item label="地址:" prop="addr">
                    <el-input size="small" v-model="temp.addr" placeholder="地址" />
                </el-form-item>
                <el-form-item label="电话:" prop="tel">
                    <el-input size="small" v-model="temp.tel" placeholder="电话" />
                </el-form-item>
                <el-form-item label="开户行:" prop="bankName">
                    <el-input size="small" v-model="temp.bankName" placeholder="开户行" />
                </el-form-item>
                <el-form-item label="账户:" prop="bankAccount">
                    <el-input size="small" v-model="temp.bankAccount" placeholder="账户" />
                </el-form-item>
                <el-form-item label="纳税人识别号:" prop="taxRegistrationCertificateNo" label-width="84">
                    <el-input size="small" v-model="temp.taxRegistrationCertificateNo" placeholder="纳税人识别号" />
                </el-form-item>
                <el-form-item label="销售方名称:" prop="sellerName">
                    <el-input size="small" v-model="temp.sellerName" placeholder="销售方名称" />
                </el-form-item>
                <el-form-item label="销售方税号:" prop="sellerTaxRegistrationCertificateNo">
                    <el-input size="small" v-model="temp.sellerTaxRegistrationCertificateNo" placeholder="销售方税号" />
                </el-form-item>
                <el-form-item label="销售方地址:" prop="sellerAddr">
                    <el-input size="small" v-model="temp.sellerAddr" placeholder="销售方地址" />
                </el-form-item>
                <el-form-item label="销售方电话:" prop="sellerTel">
                    <el-input size="small" v-model="temp.sellerTel" placeholder="销售方电话" />
                </el-form-item>
                <el-form-item label="销售方开户行:" prop="sellerBankName" label-width="84">
                    <el-input size="small" v-model="temp.sellerBankName" placeholder="销售方开户行" />
                </el-form-item>
                <el-form-item label="销售方账号:" prop="sellerBankAccount">
                    <el-input size="small" v-model="temp.sellerBankAccount" placeholder="销售方账号" />
                </el-form-item>
                <el-form-item label="价税合计:" prop="vatAmount">
                    <el-input size="small" v-model="temp.vatAmount" placeholder="价税合计" disabled />
                </el-form-item>
                <el-form-item label="未开票余额:" prop="salesVatBalance">
                    <el-input size="small" v-model="temp.salesVatBalance" placeholder="未开票余额" />
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell">
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column label="商品名称" width="160">
                <template slot-scope="scope">
                    <itemList :selectId="scope.row.itemId" :index="scope.$index" :item-list="item_list" @changeVal="changeVal" />
                </template>
            </el-table-column>
            <el-table-column label="商品代码" width="160">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell" v-model="row.itemCode" disabled />
                </template>
            </el-table-column>
            <el-table-column label="规格">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.norms" disabled />
                </template>
            </el-table-column>
            <el-table-column label="单位" width="60">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-c" v-model="row.uom" disabled />
                </template>
            </el-table-column>
            <el-table-column label="数量">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.qty" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="含税价(元)">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.vatPrice" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="价税合计">
                <template slot-scope="{row}">
                    <input type="text" class="inputCell tx-r" v-model="row.vatAmount||0" disabled />
                </template>
            </el-table-column>
            <el-table-column label="税率">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.taxRate" @change="calculate(scope.$index)">
                </template>
            </el-table-column>
            <el-table-column label="税额">
                <template slot-scope="scope">
                    <input type="text" class="inputCell tx-r" v-model="scope.row.taxAmount" disabled />
                </template>
            </el-table-column>
        </el-table>
        <div class="dataTable" style="margin-top: 10px">
            <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                <el-form-item label="开票日期:" prop="recordDate">
                    <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="small" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开票人:" prop="recorder">
                    <el-input size="small" v-model="temp.recorder" placeholder="制单人" />
                </el-form-item>
                <el-form-item label="收款人:" prop="beneficiaryName">
                    <el-input size="small" v-model="temp.beneficiaryName" placeholder="收款人" />
                </el-form-item>
                <el-form-item label="审核日期:" prop="auditDate">
                    <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="small" :clearable="false" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="审核人:" prop="auditorId">
                    <el-input size="small" v-model="temp.auditor" placeholder="审核人" />
                </el-form-item>
            </el-form>
        </div>
        <div class="tx-c" style="margin-top:15px" v-if="status!=1 && status!=2">
            <el-button class="filter-item" type="primary" @click="save">保存</el-button>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { saveInvoice, getInvoiceById } from '@/api/sale'
import { getItem } from '@/api/basedata'
import { deleteEmptyProp, addNullObj, addNullObj2 } from '@/utils'
import custList from '@/components/selects/custList'
import itemList from '@/components/selects/saleItemList'
import { getResPageByFuzzyCustId } from '@/api/store'
import { getName, getNowDate } from '@/utils/auth'
export default {
    name: 'orderAdd',
    components: { custList, itemList },
    data() {
        return {
            id: '',
            status: this.$route.query.status,
            settleData: [{}, {}, {}, {}, {}],
            dialogFormVisible: false,
            tableData: [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}],
            keys: ["itemId", "itemCode", "itemName", "norms", "uom", "qty", "vatPrice", "amount", "taxRate", "taxAmount", "vatAmount"],
            item_list: [],
            temp: {
                invoiceDate: getNowDate(),
                invoiceNo: '',
                custId: '',
                custName: '',
                contact: '',
                tel: '',
                addr: '',
                bankAccount: '',
                bankName: '',
                sellerTel: '',
                sellerAddr: '',
                sellerName: '',
                sellerBankAccount: 1,
                sellerBankName: 0,
                salesVatBalance: 0,
                vatAmount: 0,
                sellerTaxRegistrationCertificateNo: 0,
                auditDate: "",
                auditor: "",
                recordDate: getNowDate() + ' 00:00:00',
                recorder: getName()
            }
        }
    },
    computed: {
        ...mapGetters([
            'userInfo'
        ])
    },
    created() {
        if (this.$route.query.id) {
            this.id = this.$route.query.id
            var date = this.$route.query.invoiceDate
            getInvoiceById(this.id, date).then(res => {
                if (res.data.data) {
                    for (var key in this.temp) {
                        this.temp[key] = res.data.data[key]
                    }
                    this.temp.autoAdvr = true;
                    for (var i = 0; i < res.data.data.invoiceLine.length; i++) {
                        for (var j = 0; j < this.keys.length; j++) {
                            this.tableData[i][this.keys[j]] = res.data.data.invoiceLine[i][this.keys[j]]
                            if (this.tableData[i].taxRate < 1) {
                                this.tableData[i].taxRate = this.tableData[i].taxRate * 100
                            }
                        }
                    }
                    this.settleData = addNullObj2(res.data.data.settleTypeDetail || [])
                    this.getItemList()
                }
            })
        } else {
            const req = {pageIndex: 1, pageNum: 50,queryParam:{}}
            getItem(req).then(res => {
                this.item_list = res.data.data
            })
        }
    },
    methods: {
        calculate(index) {
            var vatPrice = this.tableData[index].vatPrice //含税价
            var qty = this.tableData[index].qty //数量
            if (qty && vatPrice) {
                var vatAmount = parseFloat(Number(qty) * Number(vatPrice)).toFixed(2)
                this.$set(this.tableData[index], 'vatAmount', vatAmount)
                var taxRate = this.tableData[index].taxRate;
                if (taxRate) {
                    var price = parseFloat(Number(vatPrice) / (Number(taxRate) / 100 + 1)).toFixed(2)
                    var amount = parseFloat(Number(qty) * Number(price)).toFixed(2)
                    var taxAmount = parseFloat(Number(vatAmount) - Number(amount)).toFixed(2)
                    this.$set(this.tableData[index], 'taxAmount', taxAmount)
                    this.$set(this.tableData[index], 'price', price)
                    this.$set(this.tableData[index], 'amount', amount)
                } else {
                    this.$set(this.tableData[index], 'taxRate', 0)
                    this.$set(this.tableData[index], 'price', 0)
                    this.$set(this.tableData[index], 'amount', 0)
                }
                this.calculateTotal()
            }
        },
        calculateTotal() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].vatAmount) {
                    amount += Number(this.tableData[i].vatAmount);
                }
            }
            this.temp.vatAmount = parseFloat(amount).toFixed(2);
        },
        showSettleType() {
            this.dialogFormVisible = true
        },
        settleTypeChange(obj) {
            for (var key in obj) {
                this.settleData[obj.index][key] = obj[key];
            }
        },
        salesTypeChange(obj) {
            for (var key in obj) {
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
            this.temp.invoiceLine = deleteEmptyProp(this.tableData);
            this.temp.advPayAmount = Number(this.temp.advPayAmount);
            this.temp.settleTypeDetail = this.settleData;
            saveInvoice(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.id == "" ? '新增成功' : '修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/sale/invoice')
                } else {
                    this.$message.warning(res.data.msg)
                }
            }).catch(() => {
                this.$message.error('保存失败，请稍后重试！')
            })
        }
    }
}
</script>