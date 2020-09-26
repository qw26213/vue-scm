<template>
    <div class="app-container">
        <div class="filterDiv">
            <el-date-picker :editable="false" v-model="listQuery.queryParam.visitDate1" type="date" placeholder="开始日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <span class="zhi">至</span>
            <el-date-picker :editable="false" v-model="listQuery.queryParam.visitDate2" type="date" placeholder="结束日期" size="small" :clearable="false" value-format="yyyy-MM-dd"></el-date-picker>
            <custList @selectChange="selectChange" ctrType="list"></custList>
            <staffList @selectChange="selectChange" ctrType="list" :selectId="listQuery.queryParam.staffId"></staffList>
            <el-button size="small" type="primary" @click="getList">查询</el-button>
            <el-button size="small" style="float:right" type="primary" @click="showLine">地图轨迹</el-button>
        </div>
        <div class="contentDiv">
        <el-table :key="tableKey" v-loading="listLoading" :data="tableData" border fit highlight-current-row style="width: 100%;" size="small">
            <el-table-column label="日期" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.visitDate}}</span>
                </template>
            </el-table-column>
            <el-table-column label="业务员">
                <template slot-scope="{row}">
                    <span>{{row.staffName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户">
                <template slot-scope="{row}">
                    <span>{{row.custName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="签到时间" width="150">
                <template slot-scope="{row}">
                    <span>{{row.checkInTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="偏差(米)" width="100" right="center">
                <template slot-scope="{row}">
                    <span>{{row.distanceM}}</span>
                </template>
            </el-table-column>
            <el-table-column label="签退时间" width="150">
                <template slot-scope="{row}">
                    <span>{{row.checkOutTime}}</span>
                </template>
            </el-table-column>
            <el-table-column label="偏差(米)" width="100" right="center">
                <template slot-scope="{row}">
                    <span>{{row.distanceOutM}}</span>
                </template>
            </el-table-column>
            <el-table-column label="停留时间" show-overflow-tooltip>
                <template slot-scope="{row}">
                    <span>{{row.staySecondsStr}}</span>
                </template>
            </el-table-column>
            <el-table-column label="使用Gps" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.isGps==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="是否跳过" align="center" width="100">
                <template slot-scope="{row}">
                    <span>{{row.isSkip==1?'是':'否'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="跳过原因" show-overflow-tooitip>
                <template slot-scope="{row}">
                    <span>{{row.skipReason}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button size="small" type="text" @click="handleLink(row.id)">关联图片</el-button>
                    <el-button size="small" type="text" @click="printBill(row)">打印</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="total>20" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getList" />
        </div>
        <el-dialog :close-on-click-modal="false" title="地图轨迹" :visible.sync="dialogFormVisible" width="1000px" top="5%">
            <baidu-map id="allmap" :zoom="13" :center="center" :scroll-wheel-zoom="true" @ready="mapReady" />
        </el-dialog>
    </div>
</template>
<script>
import { getVisitData, printByHeaderId } from '@/api/visit'
import Pagination from '@/components/Pagination'
import { getNowDate } from '@/utils/auth'
import { parseTime } from '@/utils/index'
import staffList from '@/components/selects/staffList'
import custList from '@/components/selects/custList'
export default {
    name: 'presaleData',
    components: { Pagination, custList, staffList },
    data() {
        const end = getNowDate()
        const start = parseTime(new Date().getTime() - 86400000 * 7)
        return {
            tableKey: 0,
            tableData: [],
            points: [],
            total: 0,
            isBillDate: '0',
            dialogFormVisible: false,
            listLoading: true,
            curBillId: '',
            center: { lng: 114.00000, lat: 22.55 },
            listQuery: {
                pageIndex: 1,
                pageNum: 20,
                queryParam: {
                    visitDate1: start,
                    visitDate2: end,
                    staffId: '',
                    custId: ''
                }
            }
        }
    },
    filters: {
        Fixed: function(num) {
            if (!num) { return '0.00' }
            return parseFloat(num).toFixed(2);
        }
    },
    created() {
        this.getList();
    },
    methods: {
        printBill(row) {
            printByHeaderId(row.id).then(res => {
                if (res.data.errorCode == 0) {
                    window.open("http://" + window.location.host + res.data.data)
                } else {
                    this.$messae.warning('文件生成失败')
                }
            })
        },
        mapReady({ BMap, map }) {
            var points = [
                { lng: 114.00100, lat: 22.550000 },
                { lng: 114.00200, lat: 22.550000 },
                { lng: 114.00300, lat: 22.550000 },
                { lng: 114.00400, lat: 22.550000 },
                { lng: 114.00500, lat: 22.550000 },
                { lng: 114.00600, lat: 22.550000 },
                { lng: 114.00700, lat: 22.550000 },
                { lng: 114.00800, lat: 22.550000 },
                { lng: 114.00900, lat: 22.550000 },
            ];
            points.forEach((item,index) => {
                var point = new BMap.Point(item.lng, item.lat)
                var  myIcon  =  new  BMap.Icon("http://api.map.baidu.com/img/markers.png",  new BMap.Size(23,  25), {
                    offset: new BMap.Size(10,  25),
                    imageOffset: new BMap.Size(0, 0 - index * 25)
               });
                var marker = new BMap.Marker(point,   { icon:  myIcon })
                map.addOverlay(marker)
            })

        },
        showLine() {
            this.dialogFormVisible = true
        },
        getList() {
            this.listLoading = true
            getVisitData(this.listQuery).then(res => {
                this.listLoading = false
                this.tableData = res.data.data
                this.points = this.tableData.map(it => {
                    return {
                        lng: it.longitude,
                        lat: it.latitude
                    }
                })
                this.total = res.data.totalNum
            }).catch(err => {
                this.listLoading = false
            })
        },
        handleLink(id) {
            this.$router.push('/visit/table?id=' + id)
        },
        selectChange(obj) {
            for (var key in obj) {
                this.listQuery.queryParam[key] = obj[key];
            }
        }
    }
}
</script>
<style lang="scss">
>>>.anchorBL {
    display: none
}
</style>
<style scoped>
#allmap {
    width: 960px;
    height: 600px;
    margin: 0 auto;
}
</style>