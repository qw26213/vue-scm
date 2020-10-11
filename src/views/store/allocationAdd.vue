<template>
    <div class="app-container">
        <div class="dataTable">
            <el-form :inline="true" label-position="right" label-width="64px" style="width: 100%; margin-top:0px;">
                <el-form-item label="单据日期:" prop="billDate">
                    <el-date-picker v-model="temp.billDate" type="date" placeholder="单据日期" size="small" :clearable="false" value-format="yyyy-MM-dd" />
                </el-form-item>
                <el-form-item label="单据号:" prop="billNo">
                    <el-input size="small" v-model="temp.billNo" placeholder="单据号" disabled />
                </el-form-item>
                <el-form-item label="调出仓库:" prop="outWarehouseId">
                    <warehouseList @selectChange="selectChange" keyType="outWarehouseId" :selectId="temp.outWarehouseId" />
                </el-form-item>
                <el-form-item label="调入仓库:" prop="inWarehouseId">
                    <warehouseList @selectChange="selectChange" keyType="inWarehouseId" :selectId="temp.inWarehouseId" />
                </el-form-item>
                <el-form-item label="业务员:" prop="staffId">
                    <staffList @selectChange="selectChange" :selectId="temp.staffId"></staffList>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentDiv">
            <el-table :data="tableData" border fit highlight-current-row style="width: 100%;" size="small" cell-class-name="tdCell">
                <el-table-column label="序号" type="index" width="50" align="center" />
                <el-table-column label="商品" width="300">
                    <template slot-scope="scope">
                        <itemList :selectId="scope.row.itemId" :selectCode="scope.row.itemCode" :index="scope.$index" @changeVal="changeVal" />
                    </template>
                </el-table-column>
                <el-table-column label="规格">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell" v-model="row.norms" disabled>
                    </template>
                </el-table-column>
                <el-table-column label="单位" width="60">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-c" v-model="row.uom" disabled>
                    </template>
                </el-table-column>
                <el-table-column label="数量" width="90">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-r" v-model="row.qty">
                    </template>
                </el-table-column>
                <el-table-column label="批号">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l" v-model="row.batchNo">
                    </template>
                </el-table-column>
                <el-table-column label="生产日期" width="120">
                    <template slot-scope="{row}">
                        <el-date-picker :editable="false" v-model="row.productionDate" type="date" placeholder="" size="small" style="width:100%" :clearable="false" value-format="yyyy-MM-dd" />
                    </template>
                </el-table-column>
                <el-table-column label="保质期(天)">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-r" v-model="row.qualityDays">
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="{row}">
                        <input type="text" class="inputCell tx-l" v-model="row.remarks">
                    </template>
                </el-table-column>
            </el-table>
            <div class="dataTable" style="margin-top: 10px">
                <el-form label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="备 注:" prop="remarks">
                        <el-input size="small" v-model="temp.remarks" placeholder="备注" style="width:790px" />
                    </el-form-item>
                </el-form>
                <el-form :inline="true" label-position="right" label-width="72px" style="width: 100%; margin-top:0px;">
                    <el-form-item label="制单日期:" prop="recordDate">
                        <el-date-picker :editable="false" v-model="temp.recordDate" type="date" placeholder="制单日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="制单人:" prop="recorderId">
                        <el-input size="small" v-model="temp.recorder" placeholder="制单人" />
                    </el-form-item>
                    <el-form-item label="审核日期:" prop="auditDate">
                        <el-date-picker :editable="false" v-model="temp.auditDate" type="date" placeholder="审核日期" size="small" style="width:145px" :clearable="false" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="审核人:" prop="auditorId">
                        <el-input size="small" v-model="temp.auditor" placeholder="审核人" />
                    </el-form-item>
                </el-form>
            </div>
            <div class="tx-c" style="margin-top:15px" v-if="status!=1&&status!=2">
              <el-button class="filter-item" type="primary" @click="save">保存</el-button>
            </div>
        </div>
    </div>
</template>
<script>
import {saveAllocation,getAllocationById} from '@/api/store'
import { getDept,getStaff} from '@/api/basedata'
import {deleteEmptyProp,addNullObj} from '@/utils'
import staffList from '@/components/selects/staffList';
import warehouseList from '@/components/selects/warehouseList';
import bizTypeList from '@/components/selects/bizTypeList';
import itemList from '@/components/selects/itemList';
import { getName,getNowDate } from '@/utils/auth'
export default {
    name: 'allocationAdd',
    components:{
        staffList,warehouseList,bizTypeList,itemList
    },
    data() {
        return {
            id:'',
            status:this.$route.query.status,
            tableData: [{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}],
            temp: { 
                billDate:getNowDate(),
                remarks:'',
                billNo: '', 
                bizTypeId: '', 
                staffId: '', 
                outWarehouseId: '',
                inWarehouseId:'',
                auditDate:"",
                auditor:"",
                recordDate:getNowDate()+" 00:00:00",
                recorder:getName()
            }
        }
    },
    created() {
        if(this.$route.query.id){
            this.id = this.$route.query.id;
            getAllocationById(this.id).then(res=>{
                for(var key in this.temp){
                    this.temp[key] = res.data.data[key]
                }
                this.tableData = addNullObj(res.data.data.allocationLine);
            })
        }
    },
    methods: {
        selectChange(obj){
            for(var key in obj){
                this.temp[key]=obj[key];
            }
        },
        changeVal(obj){
            for(var key in obj){
                this.tableData[obj.index][key]=obj[key];
            }
            if (obj.index + 1 == this.tableData.length) {
                this.tableData.push({});
                this.$nextTick(() => {
                    let container = this.$el.querySelector('.el-table__body-wrapper');
                    container.scrollTop = container.scrollHeight;
                })
            }
        },
        save() {
            this.temp.id = this.id;
            this.temp.allocationLine = deleteEmptyProp(this.tableData);
            saveAllocation(this.temp).then(res => {
                if (res.data.errorCode == 0) {
                    this.$message.success(this.temp.id==""?'新增成功':'修改成功');
                    this.$store.dispatch('tagsView/delView', this.$route);
                    this.$router.replace('/store/allocation');
                } else {
                    this.$message.error(res.data.msg)
                }
            }).catch(()=>{
                this.$message.error('保存失败，请稍后重试！')
            })
        }
    }
}
</script>