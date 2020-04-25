<template>
    <div class="app-container">
        <div class="w1200 voucherHeader">
            <el-button type="primary" size="mini" @click="dialogFormVisible1 = true">从模板生成凭证</el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible2 = true">常用摘要</el-button>
            <div class="voucherTit">记账凭证<span class="Period">2019年第10期</span></div>
            <el-form :inline="true" label-position="right" label-width="80px" style="width: 100%; margin-top:0px;">
                <el-form-item label="凭证字号" prop="billNo" style="margin-bottom:10px">
                    <select class="catogeryName uds">
                        <option value="0" v-for="item in catogeryList" :ke="item.id">{{item.catogeryName}}</option>
                    </select>
                    <span class="catogeryNumber uds">{{billHeader.jeSeq | numberFormat}}</span>
                    <span class="btn-wrap uds">
                        <a class="btn-up" @click="catogeryNumberAdd(1)"></a>
                        <a class="btn-down" @click="catogeryNumberAdd(-1)"></a>
                    </span>
                </el-form-item>
                <el-form-item label="日期" prop="billDate" style="margin-bottom:10px;">
                    <el-date-picker v-model="billHeader.billDate" type="date" placeholder="日期" size="mini" value-format="yyyy-MM-dd" style="width:120px">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="附单据" prop="expirationDate" style="float:right;margin-bottom:10px">
                    <input type="text" class="catogeryNumber" v-model="billHeader.voucherAttachmentNum" style="width:40px;margin-right:6px" />
                    <span>张</span>
                </el-form-item>
            </el-form>
        </div>
        <table class="voucher table table-condensed w1200" style="border-left:none;">
            <thead>
                <tr>
                    <th width="18" class="tablectrl thstyle"></th>
                    <th class="thstyle">摘要</th>
                    <th class="thstyle">会计科目</th>
                    <th width="109" class="thstyle">数量</th>
                    <th width="220" class="p0">
                        <b class="money_tit">借方金额</b>
                        <div class="money_unit"><i v-for="(it,index) in numberArr" :key="index">{{it}}</i></div>
                    </th>
                    <th width="220" class="p0">
                        <b class="money_tit">贷方金额</b>
                        <div class="money_unit"><i v-for="(it,index) in numberArr" :key="index">{{it}}</i></div>
                    </th>
                </tr>
            </thead>
            <tbody class="voucher_tbody">
                <tr v-for="(row,index) in tableData">
                    <td class="p0 tablectrl">
                        <a title="增加分录" class="glyicon_plus" @click="addRow()"></a>
                        <a title="删除分录" class="glyicon_remove" @click="delRow(index)"></a>
                    </td>
                    <td class="p0 urel">
                        <summaryList :dataList="summaryArr" :index="index" @changeVal="changeVal" :val="row.summary"></summaryList>
                    </td>
                    <td class="p0 urel">
                        <coaList :dataList="coaArr" :selectId="row.itemId" :index="index" @changeVal="changeVal" :val="row.coaId"></coaList>
                    </td>
                    <td class="p0 urel">
                        <div class="number f12 ptb05" v-if="row.isQuantity==1">
                            <p style="margin-bottom: 3px;">数量:
                                <input type="text" v-model="row.qNumber" /><i class="uom">{{row.qUom}}</i></p>
                            <p>单价:
                                <input type="text" v-model="row.qPrice" /><i class="uom">元</i></p>
                        </div>
                    </td>
                    <td class="urel p0">
                        <div class="money_bg">
                            <i v-if="row.accountedCr>0" v-for="(item,index) in String(row.accountedCr)" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedCr" maxlength="12" @input="inputChange($event)">
                    </td>
                    <td class="urel p0">
                        <div class="money_bg">
                            <i v-if="row.accountedDr>0" v-for="(item,index) in String(row.accountedDr)" :key="index">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedDr" maxlength="12" @input="inputChange($event)">
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="foot h42">
                    <td class="p0"></td>
                    <td colspan="4" class="thstyle tx-l totalNumber">合计:{{totalZh}}</td>
                    <td class="col_debite p0 urel ovh">
                        <input type="hidden" v-model="totalMoney1" />
                        <div class="money_bg h42">
                            <i class="lh42" v-for="(item,index) in String(totalMoney1)" v-if="totalMoney1>0" :key="index">{{item}}</i>
                        </div>
                    </td>
                    <td class="col_credit p0 urel ovh">
                        <input type="hidden" v-model="totalMoney2" />
                        <div class="money_bg h42">
                            <i class="lh42" v-for="(item,index) in String(totalMoney2)" v-if="totalMoney2>0" :key="index">{{item}}</i>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div class="tx-c w1200" style="margin-top:15px">
            <el-button class="filter-item" type="primary" @click="saveTemplet">保存为凭证模板</el-button>
            <el-button class="filter-item" type="default" @click="saveVoucher">保存并新增凭证</el-button>
        </div>
        <el-dialog :close-on-click-modal="false" title="选择凭证模板" :visible.sync="dialogFormVisible1" width="540px">
            <el-table :data="templetData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="trCell">
                <el-table-column label="模板类型" width="140" align="center">
                    <template slot-scope="{row}">
                        <span v-for="item in templetTypeList" v-if="item.id==row.templetType" :key="item.id">{{item.templetTypeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模板名称" width="150" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.templetName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="模板编码" width="120" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.templetCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button class="filter-item" type="primary" size="mini" @click="selectTemplet(row.id)">选择</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total1>10" :total="total1" :page.sync="listQuery1.pageIndex" :limit.sync="listQuery1.pageNum" @pagination="getTempletList" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="常用摘要" :visible.sync="dialogFormVisible2" width="410px">
            <div class="filter-container" style="padding-bottom:0;margin-top:-10px">
                <el-input size="small" v-model="summaryQuery.mnemonicCode" placeholder="助记码" style="width: 135px;" class="filter-item" />
                <el-input size="small" v-model="summaryQuery.summary" placeholder="名称" style="width: 135px;" class="filter-item" />
                <el-button size="mini" class="filter-item" type="primary" @click="handleSummaryAdd">创建摘要</el-button>
            </div>
            <el-table :data="summaryPageData" border fit highlight-current-row style="width: 100%;" size="mini" cell-class-name="trCell">
                <el-table-column label="序号" width="50" align="center">
                    <template slot-scope="scope">
                        <span>{{listQuery2.pageIndex*10 - 10 + scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="助记码" prop="mnemonicCode" align="center"></el-table-column>
                <el-table-column label="名称" prop="summary" align="center"></el-table-column>
                <el-table-column label="操作" prop="summary" align="center" width="100">
                    <template slot-scope="{row}">
                        <el-button class="filter-item" type="danger" size="mini" @click="handDelSummary(row.id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total2>10" :total="total2" :page.sync="listQuery2.pageIndex" :limit.sync="listQuery2.pageNum" @pagination="getSummaryByPage" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="设置科目辅助核算" :visible.sync="dialogFormVisible3" width="400px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="60px" style="width: 360px; margin-left:10px;">
                <el-form-item v-if="auxiliary.charAt(0)=='1'" label="供应商" prop="supplierId">
                    <el-select ref="supplierSelect" placeholder="供应商" v-model="temp.supplierId" style="width:280px">
                        <el-option v-for="(item,index) in supplierList" :key="item.supplierCode" :label="item.supplierName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(1)=='1'" label="客户" prop="custId">
                    <el-select ref="custSelect" placeholder="客户" v-model="temp.custId" style="width:280px">
                        <el-option v-for="(item,index) in custList" :key="item.custCode" :label="item.custName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(2)=='1'" label="部门" prop="deptId">
                    <el-select ref="deptSelect" placeholder="部门" v-model="temp.deptId" style="width:280px">
                        <el-option v-for="(item,index) in deptList" :key="item.deptCode" :label="item.deptName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(3)=='1'" label="职员" prop="staffId">
                    <el-select ref="staffSelect" placeholder="职员" v-model="temp.staffId" style="width:280px">
                        <el-option v-for="(item,index) in staffList" :key="item.staffCode" :label="item.staffName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(4)=='1'" label="存货" prop="itemId">
                    <el-select ref="itemSelect" placeholder="存货" v-model="temp.itemId" style="width:280px">
                        <el-option v-for="(item,index) in itemList" :key="item.itemCode" :label="item.itemName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(5)=='1'" label="项目" prop="projId">
                    <el-select ref="projSelect" placeholder="项目" v-model="temp.projId" style="width:280px">
                        <el-option v-for="(item,index) in projList" :key="item.projCode" :label="item.projName" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="dialogFormVisible3 = false">取消</el-button>
                <el-button type="primary" @click="saveAuxiliaryConfig">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGlPeriodByCenterDate, getGlPeriodByPeriodCode, getMaxVoucherSeq, getVoucherById, voucherSave, getCatogery } from '@/api/voucher'
import { getTempletHeader, getTempletTypeList, getTempletById, templetSave } from '@/api/voucher'
import { getAllUnion, addSummary, delSummary } from '@/api/voucher'
import { getNowDate, deleteEmptyObj, addNullObj, addNullObj2, convertCurrency, validateVal } from '@/utils'
import { getProj, getDept, getStaff, getSupplier, getCust, getItem } from '@/api/user'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
var hexCas = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O']
export default {
    name: 'voucherAdd',
    components: { coaList, summaryList, Pagination },
    data() {
        return {
            selectCatogery: '',
            catogeryList: [],
            total1: 0,
            total2: 0,
            numberArr: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'],
            totalZh: '',
            list: [],
            billHeader: {
                catogeryNumber: 1,
                billDate: getNowDate(),
                voucherAttachmentNum: 0,
            },
            summaryQuery: {
                summary: '',
                mnemonicCode: ''
            },
            auxiliary: '000000',
            curShowIndex: 0,
            temp: {},
            rules: {
                supplierId: [{ required: true, message: '供应商不能为空', trigger: 'change' }],
                custId: [{ required: true, message: '客户不能为空', trigger: 'change' }],
                staffId: [{ required: true, message: '职员不能为空', trigger: 'change' }],
                projId: [{ required: true, message: '项目不能为空', trigger: 'change' }],
                itemId: [{ required: true, message: '存货不能为空', trigger: 'change' }],
                deptId: [{ required: true, message: '部门不能为空', trigger: 'change' }]
            },
            tableData: [{}, {}, {}, {}],
            voucherTable: [],
            dialogFormVisible1: false,
            dialogFormVisible2: false,
            dialogFormVisible3: false,
            templetData: [],
            summaryTable: [],
            summaryPageData: [],
            totalMoney1: 0,
            totalMoney2: 0,
            listQuery1: {
                pageIndex: 1,
                pageNum: 10,
                queryParam: {}
            },
            listQuery2: {
                pageIndex: 1,
                pageNum: 10
            },
            custList: [],
            deptList: [],
            itemList: [],
            supplierList: [],
            staffList: [],
            projList: []
        }
    },
    filters: {
        numberFormat: function(num) {
            return num < 10 ? '00' + num : num < 100 ? '0' + num : num;
        }
    },
    computed: {
        ...mapGetters([
            'auxiliaryArr',
            'templetTypeList',
            'summaryArr',
            'coaArr'
        ])
    },
    watch: {
        summaryArr() {
            this.summaryTable = this.summaryArr
            this.listQuery2.pageIndex = 1
            this.total2 = this.summaryTable.length
            this.getSummaryByPage()
        }
    },
    created() {
        this.$store.dispatch('voucher/getTempletType')
        this.$store.dispatch('voucher/getAuxiliaryTypeList')
        this.getTempletList()
        getCatogery().then(res => {
            this.catogeryList = res.data
        })
        getCust().then(res => {
            this.custList = res.data
        })
        getDept().then(res => {
            this.deptList = res.data
        })
        getStaff().then(res => {
            this.staffList = res.data
        })
        getSupplier().then(res => {
            this.supplierList = res.data
        })
        getItem().then(res => {
            this.itemList = res.data
        })
        getProj().then(res => {
            this.projList = res.data
        })
        if (this.$route.query.id) {
            getVoucherById({ id: this.$route.query.id }).then(res => {
                this.$store.dispatch('voucher/getSummaryList')
                this.$store.dispatch('voucher/getCoaList')
                this.billHeader = res.data.data.header
                this.tableData = res.data.data.lineList
                var totalMoney = 0
                for (var i = 0; i < this.tableData.length; i++) {
                    totalMoney += Number(this.tableData[i].accountedDr);
                }
                this.totalMoney1 = totalMoney
                this.totalMoney2 = totalMoney
                this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
            })
        } else {
            this.$store.dispatch('voucher/getSummaryList')
            this.$store.dispatch('voucher/getCoaList')
        }
    },
    methods: {
        saveAuxiliaryConfig() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    var editIndex = this.curShowIndex
                    var curObj = this.tableData[editIndex]
                    var auxiliary = this.auxiliary
                    if (auxiliary != null && auxiliary.length > 0) {
                        var auxiliaryCode = ""
                        var auxiliaryName = ""
                        var auxiliaries = auxiliary.split("")
                        var AuxiliaryType = ['supplier', 'cust', 'dept', 'staff', 'item', 'proj']
                        for (var i = 0; i < auxiliaries.length; i++) {
                            if (auxiliaries[i] != null && auxiliaries[i] == 1) {
                                // 显示对应的辅助核算项 1-26
                                var auxiliaryType = AuxiliaryType[i]
                                /* 获取当前辅助核算项的值 */
                                var selectId = this.$refs[auxiliaryType + 'Select'].selected.value
                                var selectText = this.$refs[auxiliaryType + 'Select'].selected.label
                                var modelCode = this.$refs[auxiliaryType + 'Select'].selected.key
                                auxiliaryCode += "_" + hexCas[AuxiliaryType.indexOf(auxiliaryType)] + modelCode
                                auxiliaryName += "_" + selectText
                            }
                        }
                        curObj.auxiliaryName = curObj.coaName + '_' + auxiliaryName.substring(1)
                        curObj.auxiliaryCode = curObj.coaCode + '_' + auxiliaryCode.substring(1)
                        // curObj.longName = 
                        // this.tableData.splice(this.curShowIndex + 1, 0, curObj)
                    }
                    this.dialogFormVisible3 = false
                }
            })
        },
        handDelSummary(id) {
            this.$confirm('你确认要删除该摘要吗?', '提示', {
                confirmButtonText: '确定',
                closeOnClickModal: false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delSummary(id).then(res => {
                    if (res.data.success) {
                        this.$message.success("摘要删除成功")
                        this.$store.dispatch('voucher/getSummaryList')
                    } else {
                        this.$message.warning(res.data.msg)
                    }
                }).catch(err => {
                    this.$message.error("系统错误")
                })
            }).catch(err => {
                console.log(err)
            });
        },
        handleSummaryAdd() {
            var obj = {
                mnemonicCode: this.summaryQuery.mnemonicCode,
                summary: this.summaryQuery.summary,
                bookId: sessionStorage.bookId
            }
            if (this.summaryQuery.mnemonicCode == "" || this.summaryQuery.summary == "") {
                this.$message.warning('摘要编码和名称都不能为空！')
                return
            }
            addSummary(obj).then(res => {
                if (res.data.success) {
                    this.$message.success("摘要创建成功")
                    this.summaryQuery.mnemonicCode = ""
                    this.summaryQuery.summary = ""
                    this.$store.dispatch('voucher/getSummaryList')
                } else {
                    this.$message.warning(res.data.msg)
                }
            }).catch(err => {
                this.$message.error("系统错误")
            })
        },
        getSummaryByPage() {
            var pageIndex = this.listQuery2.pageIndex
            var arr = []
            var min = pageIndex * 10 - 10
            var max = pageIndex * 10 <= this.total2 ? pageIndex * 10 : this.total2
            for (var i = min; i < max; i++) {
                arr.push(this.summaryTable[i])
            }
            this.summaryPageData = arr
        },
        addRow() {
            this.tableData.push({})
        },
        getSummaryData() {
            getAllUnion().then(res => {

            })
        },
        delRow(index) {
            if (this.tableData.length <= 2) {
                this.$message.warning('至少要保留两条分录！');
                return
            }
            this.tableData.splice(index, 1)
        },
        saveVoucher() {
            this.voucherTable = deleteEmptyObj(this.tableData)
            if (this.voucherTable.length <= 2) {
                this.$message.warning('凭证至少要两条分录！');
                return
            }
            const curPeriodValue = ''
            const obj = {
                bookId: sessionStorage.bookId,
                catogeryId: this.selectCatogery,
                catogeryName: '记',
                catogeryTitle: "记账凭证",
                // jzCode: jzCode,
                // joinJeHeaderId:joinJeHeaderId,
                periodCode: this.temp.billDate,
                periodId: curPeriodValue,
                periodName: '2020年02期',
                saveType: saveTypeValue,
                totalCreditMoney: this.total1,
                totalDebiteMoney: this.total2,
                voucherAttachmentNum: this.temp.voucherAttachmentNum,
                voucherDate: this.temp.billDate,
                voucherSeq: this.temp.catogeryNumber,
                // voucherId: voucherId,
                // jeHeaderId: voucherId,
                voucherTable: this.voucherTable
            }
            voucherSave(obj).then(res => {
                if (res.data.success) {
                    this.$message.success("凭证模板保存成功")
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        saveTemplet() {
            const obj = {

            }
            templetSave(obj).then(res => {
                if (res.data.success) {
                    this.$message.success("凭证模板保存成功")
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        foucsInput(event) {
            console.log(event.currentTarget.value)
            event.currentTarget.value = event.currentTarget.value == 0 ? '' : ''
        },
        inputChange(event) {
            this.clearNoNum(event.currentTarget)
            this.totalMoney1 = this.calculate1()
            this.totalMoney2 = this.calculate2()
            this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
        },
        clearNoNum(obj) {
            // if (obj.value != '' && obj.value.substr(0, 1) == '=') {
            //     obj.value = 0
            //     valueBalance(obj)
            //     return
            // }
            validateVal(obj)
        },
        calculate1() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedCr) {
                    amount += Number(this.tableData[i].accountedCr);
                }
            }
            return String(amount)
        },
        calculate2() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedDr) {
                    amount += Number(this.tableData[i].accountedDr)
                }
            }
            return String(amount)
        },
        selectTemplet(id) {
            this.dialogFormVisible1 = false
            getTempletById(id).then(res => {
                this.tableData = res.data.data.lineList
            }).catch(err => {
                this.$message.error("系统错误")
            })
        },
        catogeryNumberAdd(num) {
            this.catogeryNumber = this.catogeryNumber + num == 0 ? this.catogeryNumber : this.catogeryNumber + num
        },
        getTempletList() {
            getTempletHeader(this.listQuery1).then(res => {
                this.templetData = res.data.data
                this.total1 = res.data.totalNum
            }).catch(err => {
                this.$message.error("系统错误")
            })
        },
        saveCoa() {

        },
        saveSummary() {

        },
        changeVal(obj) {
            console.log(obj)
            for (var key in obj) {
                this.$set(this.tableData[obj.index], key, obj[key])
            }
            if (obj.isAuxiliary == 1) {
                this.dialogFormVisible3 = true
                this.auxiliary = obj.auxiliary
                this.$nextTick(() => {
                    this.$refs['dataForm'].clearValidate()
                })
                this.curShowIndex = obj.index
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import './voucher.scss';
</style>
<style scoped>
.number {
    width: 122px;
    padding: 4px 8px;
    box-sizing: border-box;
}

.number p {
    font-size: 12px;
    height: 24px;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 24px;
}

.number p input {
    width: 50px;
    border-bottom: 1px #999 solid !important;
    margin: 0 3px;
    outline: none;
}
</style>