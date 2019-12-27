<template>
    <div class="main">
        <div class="leftTree">
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" default-expand-all></el-tree>
        </div>
        <div class="app-container">
            <div class="filter-container">
                <el-input size="small" v-model="listQuery.queryParam.itemName" placeholder="商品名称" style="width: 200px;" class="filter-item" />
                <el-input size="small" v-model="listQuery.queryParam.itemCode" placeholder="商品代码" style="width: 200px;" class="filter-item" />
                <el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
                <el-button size="mini" class="filter-item" type="primary" icon="el-icon-plus" @click="handleAdd">新增</el-button>
            </div>
            <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="mini">
                <el-table-column label="序号" type="index" width="50" align="center">
                </el-table-column>
                <el-table-column label="商品代码">
                    <template slot-scope="{row}">
                        <span>{{row.itemCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品名称">
                    <template slot-scope="{row}">
                        <span>{{row.itemName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="品牌">
                    <template slot-scope="{row}">
                        <span>{{row.brandName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="产地">
                    <template slot-scope="{row}">
                        <span>{{row.prodArea}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="商品属性">
                    <template slot-scope="{row}">
                        <span>{{row.attr==0?'库存商品':'负单价商品'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="保质期(天)" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.qualityDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="主单位" width="72" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.uom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="辅助单位" width="72" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.subUom}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="换算率" width="72" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.exchangeRate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="规格" width="90" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.norms}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="税率" width="90" align="right">
                    <template slot-scope="{row}">
                        <span>{{row.taxRate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="计价方式" width="90" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.priceModeCode|formatWay}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="序列号管理" width="90" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.isBatch==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否低温" width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.isRefrigerated==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否在售" width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.isSale==1?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="是否可用" width="80" align="center">
                    <template slot-scope="{row}">
                        <span>{{row.isDisable==0?'是':'否'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="190">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="handleCompile(row)">编辑</el-button>
                        <el-button type="danger" size="mini" @click="handleDel(row.id)">删除</el-button>
                        <el-button type="warning" size="mini" @click="updateStatus(row)">{{row.isDisable==0?'禁用':'解禁'}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.limit" @pagination="getList" />
            <el-dialog :close-on-click-modal="false" :title="dialogStatus=='create'?'新增商品':'修改商品'" :visible.sync="dialogFormVisible" width="760px">
                <el-form ref="dataForm" :rules="rules" :model="temp" :inline="true" label-position="right" label-width="130px" style="width: 690px; margin-left:30px;overflow:auto;height:600px">
                    <el-form-item label="商品代码" prop="itemCode">
                        <el-input v-model="temp.itemCode" placeholder="商品代码" />
                    </el-form-item>
                    <el-form-item label="商品名称" prop="itemName">
                        <el-input v-model="temp.itemName" placeholder="商品名称" />
                    </el-form-item>
                    <el-form-item label="规格" prop="norms">
                        <el-input v-model="temp.norms" placeholder="规格" />
                    </el-form-item>
                    <el-form-item label="主单位" prop="measId">
                        <el-select v-model="temp.measId" style="width:180px" class="filter-item">
                            <el-option v-for="item in measList" :key="item.id" :label="item.measName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="辅助单位" prop="subMeasId">
                        <el-select v-model="temp.subMeasId" style="width:180px" class="filter-item">
                            <el-option v-for="item in measList" :key="item.id" :label="item.measName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="换算率" prop="exchangeRate">
                        <el-input v-model="temp.exchangeRate" placeholder="换算率" />
                    </el-form-item>
                    <el-form-item label="税率" prop="taxRate">
                        <el-input v-model="temp.taxRate" placeholder="税率" />
                    </el-form-item>
                    <el-form-item label="品牌" prop="brandId">
                        <el-select v-model="temp.brandId" style="width:180px" class="filter-item">
                            <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="建议最低价" prop="price0">
                        <el-input v-model="temp.price0" placeholder="建议最低价" />
                    </el-form-item>
                    <el-form-item label="销售最低价" prop="lowestPrice">
                        <el-input v-model="temp.lowestPrice" placeholder="销售最低价" />
                    </el-form-item>
                    <el-form-item label="计价方式" prop="priceModeCode">
                        <el-select v-model="temp.priceModeCode" style="width:180px" class="filter-item">
                            <el-option label="移动平均" value="0"></el-option>
                            <el-option label="个别计价" value="1"></el-option>
                            <el-option label="先进先出" value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产地" prop="prodArea">
                        <el-input v-model="temp.prodArea" placeholder="产地" />
                    </el-form-item>
                    <el-form-item label="保质期(天)" prop="qualityDays">
                        <el-input v-model="temp.qualityDays" placeholder="保质期" />
                    </el-form-item>
                    <el-form-item label="销售用计量单位" prop="measSale">
                        <el-radio v-model="temp.measSale" label="1" style="margin-right:10px">主单位</el-radio>
                        <el-radio v-model="temp.measSale" label="0">辅助单位</el-radio>
                    </el-form-item>
                    <el-form-item label="打印用计量单位" prop="measPrint">
                        <el-radio v-model="temp.measPrint" label="1" style="margin-right:10px">主单位</el-radio>
                        <el-radio v-model="temp.measPrint" label="0">辅助单位</el-radio>
                    </el-form-item>
                    <el-form-item label="销售改价类型" prop="salePriceType">
                        <el-radio-group v-model="temp.salePriceType">
                            <el-radio label="0" style="margin-right:10px">完全禁止</el-radio>
                            <el-radio label="1" style="margin-right:10px">完全可以</el-radio>
                            <el-radio label="2">按业务员</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="退货改价类型" prop="returnPriceType">
                        <el-radio-group v-model="temp.returnPriceType">
                            <el-radio label="0" style="margin-right:10px">完全禁止</el-radio>
                            <el-radio label="1" style="margin-right:10px">完全可以</el-radio>
                            <el-radio label="2">按业务员</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="商品属性" prop="attr">
                        <el-radio v-model="temp.attr" label="0" style="margin-right:10px">库存商品</el-radio>
                        <el-radio v-model="temp.attr" label="1">负单价商品</el-radio>
                    </el-form-item>
                    <el-form-item label="序列号管理" prop="isBatch">
                        <el-radio v-model="temp.isBatch" label="1" style="margin-right:10px">是</el-radio>
                        <el-radio v-model="temp.isBatch" label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="允许负库存" prop="negativeType">
                        <el-radio-group v-model="temp.negativeType">
                            <el-radio label="1" style="margin-right:10px">是</el-radio>
                            <el-radio label="0" style="margin-right:10px">否</el-radio>
                            <el-radio label="2">按仓库</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="是否低温" prop="isRefrigerated">
                        <el-radio v-model="temp.isRefrigerated" label="1" style="margin-right:10px">是</el-radio>
                        <el-radio v-model="temp.isRefrigerated" label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="保质期管理" prop="isQuality">
                        <el-radio v-model="temp.isQuality" label="1" style="margin-right:10px">是</el-radio>
                        <el-radio v-model="temp.isQuality" label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否在售" prop="isSale" style="width:278px">
                        <el-radio v-model="temp.isSale" label="1" style="margin-right:10px">是</el-radio>
                        <el-radio v-model="temp.isSale" label="0">否</el-radio>
                    </el-form-item>
                    <el-form-item label="是否可用" prop="isDisable">
                        <el-radio v-model="temp.isDisable" label="0" style="margin-right:10px">是</el-radio>
                        <el-radio v-model="temp.isDisable" label="1">否</el-radio>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer" align="center">
                    <el-button @click="dialogFormVisible = false">取消</el-button>
                    <el-button type="primary" @click="dialogStatus == 'create'?handleCreate():handleModify()">确定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import { getMeas,getItem, saveItem, delItem, getItemTree, updateItemDisabled, getItemChildrenByParentId, getAllByInvCatgId, getBrand } from '@/api/basedata'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'
export default {
    name: 'baseItem',
    components: { Pagination },
    data() {
        return {
            treeData: [],
            measList:[],
            defaultProps: {
                children: 'children',
                label: 'invCatgName'
            },
            invCatgId: "",
            tableKey: 0,
            tableData: [],
            brandList: [],
            total: 0,
            listLoading: true,
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    itemCode: '',
                    itemName: ''
                }
            },
            temp: {
                id:'',
                invCatgId:'',
                itemName: '',
                itemCode: '',
                measId: '',
                subMeasId: '',
                norms: '',
                attr: '0',
                price0:'',
                measSale:'',
                measPrint:'',
                lowestPrice:'',
                exchangeRate: '',
                salePriceType:'',
                returnPriceType:'',
                prodArea: '',
                priceModeCode:'0',
                brandId: '',
                qualityDays: '',
                isBatch: '0',
                taxRate: '',
                isRefrigerated: '0',
                negativeType: '1',
                isQuality: '0',
                isSale: '1',
                isDisable: "0"
            },
            dialogFormVisible: false,
            dialogStatus: '',
            rules: {
                itemName: [{ required: true, message: '商品名称不能为空', trigger: 'change' }],
                itemCode: [{ required: true, message: '商品代码不能为空', trigger: 'change' }],
                norms: [{ required: true, message: '规格不能为空', trigger: 'change' }],
                measId: [{ required: true, message: '单位不能为空', trigger: 'change' }],
                isDisable: [{ required: false }]
            }
        }
    },
    filters: {
      formatWay: function(str) {
          if(str==0) { 
            return "移动平均"
          }else if(str=1){
            return "个别计价"
          }else if(str==2){
            return "先进先出"
          }else{
            return '无'
          }
      }
    },
    created() {
        this.getList()
        getMeas({}).then(res => {
          this.measList= res.data.data
        })
    },
    methods: {
        getItemById() {
            this.listLoading = true
            getAllByInvCatgId(this.invCatgId).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            })
        },
        getList() {
            this.listLoading = true
            getItem(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
            }).catch(err => {
                this.listLoading = false
            })
            getItemTree({ parentId: '', includeRoot: 1 }).then(res => {
                this.treeData = res.data.body
            })
            getBrand({}).then(res => {
                this.brandList = res.data.data
            })
        },
        handleNodeClick(e) {
            this.invCatgId = e.id;
            this.getItemById()
        },
        handleAdd(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'create'
            for (var key in this.temp) {
                this.temp[key] = ''
            }
            this.temp.attr = '0';
            this.temp.isRefrigerated = '0';
            this.temp.priceModeCode = '0';
            this.temp.negativeType = '1';
            this.temp.measSale = '1';
            this.temp.measPrint = '1';
            this.temp.negativeType = '1';
            this.temp.salePriceType = '1';
            this.temp.returnPriceType = '2';
            this.temp.isQuality = '0';
            this.temp.isSale = '1';
            this.temp.isBatch = '0';
            this.temp.isDisable = '0';
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleCompile(obj) {
            this.dialogFormVisible = true
            this.dialogStatus = 'update'
            for (var key in this.temp) {
                this.temp[key] = obj[key]
            }
            this.temp.attr = String(obj.attr)
            this.temp.isRefrigerated = String(obj.isRefrigerated)
            this.temp.priceModeCode = String(obj.priceModeCode)
            this.temp.negativeType = String(obj.negativeType)
            this.temp.measSale = String(obj.measSale)
            this.temp.measPrint = String(obj.measPrint)
            this.temp.salePriceType = String(obj.salePriceType)
            this.temp.returnPriceType = String(obj.returnPriceType)
            this.temp.isQuality = String(obj.isQuality)
            this.temp.isSale = String(obj.isSale)
            this.temp.isBatch = String(obj.isBatch)
            this.temp.isDisable = String(obj.isDisable)
            this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
            })
        },
        handleFilter() {
            this.listQuery.pageIndex = 1
            this.getList()
        },
        handleDel(id) {
            this.$confirm('确定删除？', '提示', {
                confirmButtonText: '确定',closeOnClickModal:false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.delItem(id)
            });
        },
        updateStatus(data) {
            this.$confirm('确定' + (data.isDisable == 1 ? '解禁？' : '禁用？'), '提示', {
                confirmButtonText: '确定',closeOnClickModal:false,
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.changeAvaiable(data);
            });
        },
        changeAvaiable(data) {
            var obj = { id: data.id, isDisable: data.isDisable == 1 ? 0 : 1 }
            updateItemDisabled(obj).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
                    this.$message.success(data.isDisable == 1 ? '解禁' : '禁用' + '成功')
                } else {
                    this.$message.error(res.data.msg)
                }
            })
        },
        handleModify() {
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveItem(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('修改成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        handleCreate() {
            this.temp.invCatgId = this.invCatgId;
            this.$refs['dataForm'].validate((valid) => {
                if (valid) {
                    saveItem(this.temp).then(res => {
                        if (res.data.errorCode == 0) {
                            this.getList();
                            this.dialogFormVisible = false
                            this.$message.success('新增成功')
                        } else {
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            })
        },
        delItem(id) {
            delItem(id).then(res => {
                if (res.data.errorCode == 0) {
                    this.getList();
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
    padding-left: 180px;
}

.leftTree {
    width: 160px;
    height: 100%;
    background-color: #fff;
    position: absolute;
    top: 20px;
    left: 20px;
    border: 1px #eee solid;
    overflow-y: auto;
}

.tableDiv {
    width: 100%;
}
</style>