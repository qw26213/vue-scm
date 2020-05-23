<template>
    <div class="app-container">
        <div class="w1200 voucherHeader">
            <el-button type="primary" size="mini" @click="dialogFormVisible1 = true">从模板生成凭证</el-button>
            <el-button type="primary" size="mini" @click="dialogFormVisible2 = true">常用摘要</el-button>
            <div class="voucherTit">记账凭证<span class="Period">{{ periodName }}</span></div>
            <el-form :inline="true" label-position="right" label-width="80px" style="width: 100%; margin-top:0px;">
                <el-form-item label="凭证字号" prop="billNo" style="margin-bottom:10px">
                    <select class="catogeryName uds" v-model="billHeader.jeCatogeryId">
                        <option v-for="item in catogeryList" :ke="item.id" :value="item.id">{{item.catogeryName}}</option>
                    </select>
                    <span class="jeSeq uds">{{billHeader.jeSeq | numberFormat}}</span>
                    <span class="btn-wrap uds">
                        <a class="btn-up" @click="jeSeqAdd(1)"></a>
                        <a class="btn-down" @click="jeSeqAdd(-1)"></a>
                    </span>
                </el-form-item>
                <el-form-item label="日期" prop="billDate" style="margin-bottom:10px;">
                    <el-date-picker v-model="billHeader.jeDate" type="date" placeholder="日期" size="mini" :clearable="false" value-format="yyyy-MM-dd" style="width:120px" @change="getJeSeqByDate">
                    </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="附单据" prop="expirationDate" style="float:right;margin-bottom:10px">
                    <input type="text" class="jeSeq" v-model="billHeader.voucherAttachmentNum" style="width:40px;margin-right:6px" />
                    <span>张</span>
                </el-form-item> -->
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
                    <td class="tablectrl">
                        <a title="增加分录" class="glyicon_plus" @click="addRow()"></a>
                        <a title="删除分录" class="glyicon_remove" @click="delRow(index)"></a>
                    </td>
                    <td width="330">
                        <summaryList :dataList="summaryArr" :index="index" @changeVal="changeVal" :val="row.summary"></summaryList>
                    </td>
                    <td width="330">
                        <coaList v-show="!row.coaCobinationName || dialogStatus != 'static'" :dataList="coaArr" :index="index" @changeVal="changeVal" :val="row.coaId"></coaList>
                        <div v-show="row.coaCobinationName && dialogStatus == 'static'" class="longName" @click="longNameClick(row, index)">{{ row.coaCode + ' ' + row.coaName + '_'+ row.coaCobinationName }}</div>
                    </td>
                    <td>
                        <div class="number f12 ptb05" v-if="row.isQuantity==1">
                            <p style="margin-bottom: 3px;">数量:
                                <input type="text" v-model="row.qty" @change="getAmount(index)" /><i class="uom">{{row.uom}}</i>
                            </p>
                            <p>单价:
                                <input type="text" v-model="row.unitprice" @change="getAmount(index)" /><i class="uom">元</i>
                            </p>
                        </div>
                    </td>
                    <td class="urel">
                        <div class="money_bg">
                            <i v-if="row.accountedDr && row.accountedDr != 0" v-for="(item,index) in String(row.accountedDr)" :key="index" :style="{color:(row.accountedDr<0?'#f00':'#333')}">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedDr" maxlength="12" @input="inputChange($event, 'accountedDr',index)" @focus="inputFocus($event, 'accountedDr', index)" @blur="inputBlur($event, 'accountedDr', index)">
                    </td>
                    <td class="urel">
                        <div class="money_bg">
                            <i v-if="row.accountedCr && row.accountedCr != 0" v-for="(item,index) in String(row.accountedCr)" :key="index" :style="{color:(row.accountedCr<0?'#f00':'#333')}">{{item}}</i>
                        </div>
                        <input type="text" autocomplete="off" class="input_bg" v-model="row.accountedCr" maxlength="12" @input="inputChange($event, 'accountedCr',index)" @focus="inputFocus($event, 'accountedCr', index)" @blur="inputBlur($event, 'accountedCr', index)">
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr class="foot h42">
                    <td class="p0"></td>
                    <td colspan="3" class="thstyle tx-l totalNumber">合计:{{totalZh}}</td>
                    <td class="col_debite p0 urel ovh">
                        <input type="hidden" v-model="totalMoney1" />
                        <div class="money_bg h42">
                            <i v-if="totalMoney1 && totalMoney1 != 0" class="lh42" v-for="(item,index) in String(totalMoney1)" :key="index" :style="{color:(totalMoney1<0?'#f00':'#333')}">{{item}}</i>
                        </div>
                    </td>
                    <td class="col_credit p0 urel ovh">
                        <input type="hidden" v-model="totalMoney2" />
                        <div class="money_bg h42">
                            <i v-if="totalMoney2 && totalMoney2 != 0" class="lh42" v-for="(item,index) in String(totalMoney2)" :key="index" :style="{color:(totalMoney2<0?'#f00':'#333')}">{{item}}</i>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
        <div class="tx-c w1200" style="margin-top:15px">
            <el-button v-if="!$route.query.id" class="filter-item" type="primary" @click="saveData(1)">保存为凭证模板</el-button>
            <el-button v-if="!$route.query.id" class="filter-item" type="default" @click="saveData(2)">保存并新增凭证</el-button>
            <el-button v-if="$route.query.id" class="filter-item" type="primary" style="width:160px" @click="saveData(2)">保存凭证</el-button>
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
            <pagination v-show="total1>10" :total="total1" :page.sync="listQuery1.pageIndex" layout="prev, pager, next" :limit.sync="listQuery1.pageNum" @pagination="getTempletList" />
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="常用摘要" :visible.sync="dialogFormVisible2" width="500px">
            <div class="filter-container" style="padding-bottom:0;margin-top:-10px">
                <el-input size="small" v-model="summaryQuery.mnemonicCode" placeholder="助记码" style="width: 180px;" class="filter-item" />
                <el-input size="small" v-model="summaryQuery.summary" placeholder="名称" style="width: 180px;" class="filter-item" />
                <el-button size="mini" class="filter-item" type="primary" @click="saveSummary">新增摘要</el-button>
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
        <el-dialog :close-on-click-modal="false" :title="'科目辅助核算设置——'+showCoaCode" :visible.sync="dialogFormVisible3" :show-close="false" width="400px">
            <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="65px" style="width: 360px; margin-left:10px;">
                <el-form-item v-if="auxiliary.charAt(0)=='1'" label="供应商" prop="supplierId">
                    <el-select ref="supplierSelect" placeholder="供应商" v-model="temp.supplierId" style="width:280px">
                        <el-option v-for="(item,index) in supplierList" :key="item.id" :label="item.supplierName" :data-code="item.supplierCode" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(1)=='1'" label="客户" prop="custId">
                    <el-select ref="custSelect" placeholder="客户" v-model="temp.custId" style="width:280px">
                        <el-option v-for="(item,index) in custList" :key="item.id" :label="item.custName" :data-code="item.custCode" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(2)=='1'" label="部门" prop="deptId">
                    <el-select ref="deptSelect" placeholder="部门" v-model="temp.deptId" style="width:280px">
                        <el-option v-for="(item,index) in deptList" :key="item.id" :label="item.deptName" :data-code="item.deptCode" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(3)=='1'" label="职员" prop="staffId">
                    <el-select ref="staffSelect" placeholder="职员" v-model="temp.staffId" style="width:280px">
                        <el-option v-for="(item,index) in staffList" :key="item.id" :label="item.staffName" :data-code="item.staffCode" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(4)=='1'" label="存货" prop="itemId">
                    <el-select ref="itemSelect" placeholder="存货" v-model="temp.itemId" style="width:280px">
                        <el-option v-for="(item,index) in itemList" :key="item.id" :label="item.itemName" :data-code="item.itemCode" :data-uom="item.uom" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="auxiliary.charAt(5)=='1'" label="项目" prop="projId">
                    <el-select ref="projSelect" placeholder="项目" v-model="temp.projId" style="width:280px">
                        <el-option v-for="(item,index) in projList" :key="item.id" :label="item.projName" :data-code="item.projCode" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="cancelAuxiliary">取消</el-button>
                <el-button type="primary" @click="saveAuxiliary">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="分录辅助核算设置" :visible.sync="dialogFormVisible4" :show-close="false" width="900px">
            <el-table :key="tableKey" :data="lineData" border fit style="width: 100%;">
                <el-table-column label="科目" min-width="120">
                    <template slot-scope="{row}">
                        <span>{{row.coaCode + ' ' + row.coaName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助核算" min-width="400">
                    <template slot-scope="{row}">
                        <div v-if="row.isAuxiliary==1" style="display:inline-block;margin-right:10px" v-for="(item, index) in row.auxTypes" :key="index">
                            <span style="display:inline-block;text-align:right">{{ item.auxiliaryTypeName }}：</span>
                            <el-select v-model="row[item.auxiliaryTypeCode+'Id']" size="small" :placeholder="item.auxiliaryTypeName" style="width:140px">
                                <el-option v-for="(it,index) in item.children" :key="it.id" :label="it.modelName" :data-code="it.modelCode" :value="it.id" />
                            </el-select>
                        </div>
                        <div v-if="row.isAuxiliary==0" style="text-align:center">无</div>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer" align="center">
                <el-button @click="cancelTempletAuxiliary">取消</el-button>
                <el-button type="primary" @click="saveTempletAuxiliary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
import { getGlPeriodByCenterDate, getGlPeriodByPeriodCode, getMaxVoucherSeq, getVoucherMaxDate } from '@/api/voucher'
import { getVoucherById, voucherSave, getCatogery } from '@/api/voucher'
import { getTempletHeader, getTempletTypeList, getTempletById, templetSave } from '@/api/voucher'
import { getAllUnion, addSummary, delSummary } from '@/api/voucher'
import { getNowDate, deleteEmptyObj, addNullObj, addNullObj2, convertCurrency, validateVal, deepClone, showNumber1, showNumber2, getIsAuxiliary } from '@/utils'
import { getProj, getDept, getStaff, getSupplier, getCust, getItem } from '@/api/user'
import Pagination from '@/components/Pagination'
import coaList from '@/components/voucher/coaList'
import summaryList from '@/components/voucher/summaryList'
var hexCas = ['A', 'B', 'C', 'D', 'E', 'F']
export default {
    name: 'voucherAdd',
    components: { coaList, summaryList, Pagination },
    data() {
        return {
            tableKey: 0,
            catogeryList: [],
            lineData: [],
            showCoaCode: '',
            periodId: '',
            periodName: '',
            periodCode: '',
            saveType: this.$route.type || 1, //插入传2
            total1: 0,
            total2: 0,
            numberArr: ['亿', '千', '百', '十', '万', '千', '百', '十', '元', '角', '分'],
            totalZh: '',
            list: [],
            billHeader: {
                jeCatogeryId: '',
                jeSeq: 0,
                jeDate: getNowDate(),
                voucherAttachmentNum: 0,
            },
            summaryQuery: {
                summary: '',
                mnemonicCode: ''
            },
            auxiliary: '000000',
            curShowIndex: 0,
            temp: {
                supplierId: '',
                custId: '',
                staffId: '',
                projId: '',
                itemId: '',
                deptId: ''
            },
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
            dialogFormVisible4: false,
            dialogStatus: 'static', //static原始状态，create设置辅助核算，update编辑辅助核算
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
        getCatogery().then(res => {
            this.catogeryList = res.data.data || []
            this.$set(this.billHeader, 'jeCatogeryId', this.catogeryList[0].id)
        })
        this.getTempletList()
        getCust().then(res => {
            this.custList = res.data.data || []
        })
        getDept().then(res => {
            this.deptList = res.data.data || []
        })
        getStaff().then(res => {
            this.staffList = res.data.data || []
        })
        getSupplier().then(res => {
            this.supplierList = res.data.data || []
        })
        getItem().then(res => {
            this.itemList = res.data.data || []
        })
        getProj().then(res => {
            this.projList = res.data.data || []
        })
        if (this.$route.query.id) {
            getVoucherById({ id: this.$route.query.id }).then(res => {
                this.$store.dispatch('voucher/getSummaryList')
                this.$store.dispatch('voucher/getCoaList')
                this.billHeader = res.data.data.header
                this.tableData = res.data.data.lineList
                if (this.tableData.length < 3) {
                    this.tableData.push({})
                }
                if (this.tableData.length < 4) {
                    this.tableData.push({})
                }
                for (var i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].accountedDr || this.tableData[i].accountedCr) {
                        this.$set(this.tableData[i], 'accountedDr', this.tableData[i].accountedDr * 100)
                        this.$set(this.tableData[i], 'accountedCr', this.tableData[i].accountedCr * 100)
                    }
                }
                this.getTotalMoney()
            })
        } else {
            this.$store.dispatch('voucher/getSummaryList')
            this.$store.dispatch('voucher/getCoaList')
            this.getJeSeqByDate()
            getVoucherMaxDate().then(res => {
                this.billHeader.jeDate = res.data.data //取服务器日期
            })
        }
    },
    methods: {
        cancelTempletAuxiliary() {
            this.lineData = []
            this.dialogFormVisible4 = false
        },
        saveTempletAuxiliary() {
            var len = this.lineData.length
            for (var i = 0; i < len; i++) {
                var curObj = this.lineData[i]
                // var len1 = this.lineData[i].auxTypes.length
                if (curObj.isAuxiliary === 1) {
                    var AuxiliaryType = ['supplier', 'cust', 'dept', 'staff', 'item', 'proj']
                    var coaCobinationCode = ''
                    var coaCobinationName = ''
                    AuxiliaryType.forEach(item => {
                        if (curObj[item+'Id']) {
                            const id = curObj[item+'Id']
                            const modelCode = this.getParamValueById(this[item + 'List'], item+'Code', id)
                            const modelName = this.getParamValueById(this[item + 'List'], item+'Name', id)
                            coaCobinationCode += '_' + hexCas[AuxiliaryType.indexOf(item)] + modelCode
                            coaCobinationName += '_' + modelName
                            if (item === 'item') {
                                curObj.uom = this.getParamValueById(this[item + 'List'], 'uom', id)
                            }
                        }
                    })
                    curObj.coaCobinationCode = coaCobinationCode.substring(1)
                    curObj.coaCobinationName = coaCobinationName.substring(1)
                    if (curObj.coaCobinationCode === '' || curObj.coaCobinationCode.split('_').length < curObj.auxTypes.length) {
                        this.$message.warning('第'+(i+1)+'行的辅助核算录入不完整！')
                        return
                    }
                }
            }
            this.tableData = deepClone(this.lineData)
            this.dialogFormVisible4 = false
        },
        getParamValueById(arr, param, id) {
            var val = ''
            arr.forEach(item => {
                if(item.id == id) {
                    val = item[param]
                }
            })
            return val
        },
        getJeSeqByDate() {
            var date = this.billHeader.jeDate
            getGlPeriodByCenterDate({ centerDate: date }).then(res => {
                if (res.data.errorCode == 0) {
                    this.periodName = res.data.data.periodName
                    this.periodCode = res.data.data.periodCode
                    this.periodId = res.data.data.id
                    this.getJeSeqNum(this.periodId)
                }
            })
        },
        getJeSeqNum(periodId) {
            var obj = {
                periodId: periodId,
                catogeryId: this.billHeader.jeCatogeryId,
                jeDate: this.billHeader.jeDate
            }
            getMaxVoucherSeq(obj).then(res => {
                this.billHeader.jeSeq = res.data.data
            })
        },
        getPeriodIdByCode(arr, code) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].periodCode == code) {
                    return arr[i].id
                }
            }
        },
        longNameClick(row, index) {
            this.dialogFormVisible3 = true
            this.showModifyAuxiliary(row, index)
        },
        showModifyAuxiliary(row, index) {
            this.dialogStatus = 'update'
            this.auxiliary = getIsAuxiliary(this.coaArr, row.coaId)
            this.showCoaCode = row.coaCode + ' ' + row.coaName
            this.curShowIndex = index
            for (var key in this.temp) {
                this.temp[key] = row[key]
            }
        },
        showSetAuxiliary(obj) {
            this.dialogStatus = 'create'
            for (var key in this.temp) {
                this.temp[key] = ''
            }
            this.showCoaCode = obj.coaCode + ' ' + obj.coaName
            this.curShowIndex = obj.index
            this.dialogFormVisible3 = true
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        cancelAuxiliary() {
            this.dialogFormVisible3 = false
            if (this.dialogStatus === 'create') {
                // 设置辅助核算取消时清空
                this.$set(this.tableData[this.curShowIndex], 'coaId', '')
                this.$set(this.tableData[this.curShowIndex], 'isQuantity', 0)
            } else {
                // 编辑辅助核算取消时清空选择
            }
            this.dialogStatus = 'static'
        },
        saveAuxiliary() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    var editIndex = this.curShowIndex
                    var curObj = this.tableData[editIndex]
                    var auxiliary = this.auxiliary
                    if (auxiliary != null && auxiliary.length > 0) {
                        var coaCobinationCode = ''
                        var coaCobinationName = ''
                        var auxiliaries = auxiliary.split("")
                        var AuxiliaryType = ['supplier', 'cust', 'dept', 'staff', 'item', 'proj']
                        for (var i = 0; i < auxiliaries.length; i++) {
                            if (auxiliaries[i] != null && auxiliaries[i] == 1) {
                                // 显示对应的辅助核算项 1-26
                                const auxiliaryType = AuxiliaryType[i]
                                /* 获取当前辅助核算项的值 */
                                const modelCode = this.$refs[auxiliaryType + 'Select'].selected.$attrs['data-code']
                                const selectText = this.$refs[auxiliaryType + 'Select'].selected.label
                                coaCobinationCode += '_' + hexCas[AuxiliaryType.indexOf(auxiliaryType)] + modelCode
                                coaCobinationName += '_' + selectText
                                curObj[auxiliaryType + 'Id'] = this.temp[auxiliaryType + 'Id']
                                if (auxiliaryType === 'item') {
                                    curObj.uom = this.$refs[auxiliaryType + 'Select'].selected.$attrs['data-uom']
                                }
                            }
                        }
                        curObj.coaCobinationCode = coaCobinationCode.substring(1)
                        curObj.coaCobinationName = coaCobinationName.substring(1)
                        // curObj.longName = 
                        // this.tableData.splice(this.curShowIndex + 1, 0, curObj)
                    }
                    this.dialogFormVisible3 = false
                    this.dialogStatus = 'static'
                }
            })
        },

        // ******************************************************************************** 附属代码
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
        saveSummary() {
            var obj = {
                mnemonicCode: this.summaryQuery.mnemonicCode,
                summary: this.summaryQuery.summary
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
        delRow(index) {
            if (this.tableData.length <= 2) {
                this.$message.warning('至少要保留两条分录')
                return
            }
            this.tableData.splice(index, 1)
        },
        saveData(type) {
            this.voucherTable = deepClone(deleteEmptyObj(this.tableData))
            var listLen = this.voucherTable.length
            if (this.voucherTable.length < 2) {
                this.$message.warning('凭证至少要两条分录！')
                return
            }
            for (var i = 0; i < listLen; i++) {
                if (this.voucherTable[i].summary == "") {
                    this.$message.warning("第" + (i + 1) + "行，摘要未填写！")
                    return
                }
                if (this.voucherTable[i].coaId == "") {
                    this.$message.warning("第" + (i + 1) + "行，科目未填写！")
                    return
                }
                if (type != 1 && (this.voucherTable[i].accountedCr == "" && this.voucherTable[i].accountedDr == "")) {
                    this.$message.warning("第" + (i + 1) + "行，金额未填写！")
                    return
                }
            }
            var lineArr = []
            for (var i = 0; i < this.voucherTable.length; i++) {
                this.$set(this.voucherTable[i], 'rowId', i + 1)
                this.$set(this.voucherTable[i], 'rowNum ', i + 1)
                this.$set(this.voucherTable[i], 'accountedCr', Number(this.voucherTable[i].accountedCr) / 100)
                this.$set(this.voucherTable[i], 'accountedDr', Number(this.voucherTable[i].accountedDr) / 100)
                this.$set(this.voucherTable[i], 'qty', Number(this.voucherTable[i].qty))
                this.$set(this.voucherTable[i], 'unitprice', Number(this.voucherTable[i].unitprice))
                lineArr.push({ container: this.voucherTable[i] })
            }
            const voucherId = this.$route.query.id || ''
            const obj = {
                id: voucherId,
                joinJeHeaderId: '',
                jeDate: this.billHeader.jeDate,
                jeSeq: this.billHeader.jeSeq,
                jeCatogeryId: this.billHeader.jeCatogeryId,
                jeCatogeryName: '记',
                jeCatogeryTitle: "记账凭证",
                voucherAttachmentNum: 0,
                baseCurrencyCode: 'CNY',
                baseCurrencyId: '',
                baseCurrencyName: '人民币',
                periodCode: this.periodCode,
                periodId: this.periodId,
                periodName: this.periodName,
                saveType: this.saveType,
                voucherTable: lineArr,
                totalCreditMoney: Number(this.totalMoney1) / 100,
                totalDebiteMoney: Number(this.totalMoney2) / 100
                // jzCode: jzCode
            }
            if (type == 1) {
                this.saveTemplet(obj)
            } else {
                if (this.totalMoney1 !== this.totalMoney2) {
                    this.$message.warning('借贷金额必须相等！')
                    return
                }
                var type = this.$route.query.id && this.saveType == 1 ? 'modify' : 'save'
                this.saveVoucher(obj, type)
            }
        },
        saveTemplet(obj) {
            templetSave({ container: obj }).then(res => {
                if (res.data.success) {
                    this.$message.success("凭证模板保存成功!")
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        saveVoucher(obj, type) {
            voucherSave({ container: obj }, type).then(res => {
                if (res.data.success) {
                    if (this.saveType == 1 && !this.$route.query.id) {
                        this.$message.success('凭证新增成功！')
                        this.tableData = [{}, {}, {}, {}]
                        this.getJeSeqByDate()
                        this.getTotalMoney()
                    }
                    if (this.saveType == 1 && this.$route.query.id) {
                        this.$message.success('凭证保存成功！')
                        this.$store.dispatch('tagsView/delView', this.$route)
                        this.$router.replace('/voucher/data')
                    }
                    if (this.saveType == 2) {
                        this.$message.success('凭证插入成功！')
                        this.$store.dispatch('tagsView/delView', this.$route)
                        this.$router.replace('/voucher/data')
                    }
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        getAmount(index) {
            var price = this.tableData[index].unitprice
            var qty = this.tableData[index].qty
            if (qty && price) {
                var amount = (Number(qty) * Number(price) * 100).toFixed(2)
                if (this.tableData[index].crDr == 1) {
                    this.$set(this.tableData[index], 'accountedDr', Number(amount))
                    this.$set(this.tableData[index], 'accountedCr', 0)
                }
                if (this.tableData[index].crDr == -1) {
                    this.$set(this.tableData[index], 'accountedCr', Number(amount))
                    this.$set(this.tableData[index], 'accountedDr', 0)
                }
                this.getTotalMoney()
            }
        },
        inputBlur(event, param, index) {
            var num = showNumber1(event.currentTarget.value)
            this.$set(this.tableData[index], param, num)
            this.getTotalMoney()
        },
        inputFocus(event, param, index) {
            event.currentTarget.select()
            var num = showNumber2(event.currentTarget.value)
            this.$set(this.tableData[index], param, num)
        },
        inputChange(event, param, index) {
            var num = validateVal(event.currentTarget.value)
            this.$set(this.tableData[index], param, num)
            if (this.tableData[index].accountedDr != 0 || this.tableData[index].accountedCr != 0) {
                var item = param === 'accountedDr' ? 'accountedCr' : 'accountedDr'
                this.$set(this.tableData[index], item, 0)
            }
        },
        getTotalMoney() {
            this.totalMoney1 = this.calculate1()
            this.totalMoney2 = this.calculate2()
            this.totalZh = this.totalMoney1 == this.totalMoney2 ? convertCurrency(this.totalMoney1) : ''
        },
        calculate1() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedDr) {
                    amount += Number(this.tableData[i].accountedDr)
                }
            }
            return String(amount)
        },
        calculate2() {
            var amount = 0;
            for (var i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i] && this.tableData[i].accountedCr) {
                    amount += Number(this.tableData[i].accountedCr)
                }
            }
            return String(amount)
        },
        selectTemplet(id) {
            this.dialogFormVisible1 = false
            getTempletById(id).then(res => {
                if(res.data.data.popup == 1) {
                    this.lineData = res.data.data.lineList
                    this.lineData.forEach(item => {
                        item.supplierId = ''
                        item.staffId = ''
                        item.deptId = ''
                        item.custId = ''
                        item.itemId = ''
                        item.projId = ''
                    })
                    this.dialogFormVisible4 = true
                } else {
                    this.tableData = res.data.data.lineList
                }
            }).catch(err => {
                this.$message.error("系统错误")
            })
        },
        jeSeqAdd(num) {
            this.billHeader.jeSeq = this.billHeader.jeSeq + num == 0 ? this.billHeader.jeSeq : this.billHeader.jeSeq + num
        },
        getTempletList() {
            getTempletHeader(this.listQuery1).then(res => {
                this.templetData = res.data.data
                this.total1 = res.data.totalNum
            }).catch(err => {
                this.$message.error("系统错误")
            })
        },
        changeVal(obj) {
            for (var key in obj) {
                this.$set(this.tableData[obj.index], key, obj[key])
            }
            if (obj.isAuxiliary == 1) {
                this.auxiliary = obj.auxiliary
                this.showSetAuxiliary(obj)
            } else {
                this.auxiliary = '000000'
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