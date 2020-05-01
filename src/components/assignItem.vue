<template>
    <el-dialog :close-on-click-modal="false" :title="'分配商品_'+tit" :visible.sync="showModal" :show-close="false" ::close-on-click-modal="false" width="500px">
        <!-- <div class="curTit">当前价格组：{{}})</div> -->
        <el-table ref="table" :data="itemData" border fit highlight-current-row style="width: 100%;" size="mini" row-key="id" @selection-change="selectChange" @select-all="selectChange">
            <el-table-column type="selection" width="50" align="center" :reserve-selection="true"></el-table-column>
            <el-table-column label="序号" type="index" width="50" align="center"></el-table-column>
            <el-table-column label="商品代码" prop="itemCode" />
            <el-table-column label="商品名称" prop="itemName" />
        </el-table>
        <pagination v-show="total>10" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageNum" @pagination="getItemTable" />
        <div slot="footer" class="dialog-footer" align="center">
            <el-button @click="closeModal">取消</el-button>
            <el-button type="primary" @click="saveAssign">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { getItem, getItemListByUserId } from '@/api/basedata'
import Pagination from '@/components/Pagination'
import { getStrByData, deepClone } from '@/utils'
export default {
    components: { Pagination },
    name: 'assignitem',
    props: ['showModal', 'tit', 'handleObj', 'type'],
    data() {
        return {
            curRowObj: {},
            itemData: [],
            selectIdArr2: [],
            initselectIds: [], // 初始化时被选的数组
            activePageSelectIds: [], //当前页被选的数据
            initActivePageSelectIds: [], //当前页刚进来被选的数据
            total: 0,
            listQuery: { pageIndex: 1, pageNum: 10, itemCode: "", itemName: "" }
        }
    },
    watch: {
        showModal(val) {
            if (val === true) {
                this.listQuery.pageIndex = 1
                if (this.type === 'user') {
                    getItemListByUserId({ channelTypeId: this.handleObj.id }).then(res => {
                        var rowObj = this.handleObj
                        rowObj.itemList = res.data.data
                        this.curRowObj = deepClone(rowObj)
                        this.getItemTable()
                    })
                }
                if (this.type === 'group'){
                    this.curRowObj = deepClone(this.handleObj)
                    this.getItemTable()
                }
            }
        }
    },
    methods: {
        closeModal() {
            this.$refs.table.clearSelection()
            this.$emit('update:showModal2', false)
        },
        getItemTable() {
            this.initActivePageSelectIds = []
            getItem(this.listQuery).then(res => {
                this.itemData = res.data.data || []
                this.initselectIds = getStrByData(this.curRowObj.itemList)
                this.total = res.data.totalNum
                this.initCheckedItems()
            })
        },
        saveAssign() {
            this.initActivePageSelectIds.forEach(item => {
                var index = this.initselectIds.indexOf(item.id)
                this.initselectIds.splice(index, 1)
            })
            Object.assign(this.initselectIds, this.activePageSelectIds)
            this.$emit('handleAssign', this.initselectIds)
        },
        selectChange(selection) {
            var arr = [];
            for (var i = 0; i < selection.length; i++) {
                arr.push(selection[i].id)
            }
            this.activePageSelectIds = arr
        },
        initCheckedItems() {
            this.initselectIds = getStrByData(this.curRowObj.itemList)
            var selectIds = this.initselectIds.join(',')
            this.$nextTick(() => {
                this.itemData.forEach(item => {
                    if (selectIds.indexOf(item.id) >= 0) {
                        this.initActivePageSelectIds.push(item.id)
                        this.$refs.table.toggleRowSelection(item, true)
                    }
                })
            })
        }
    }
}
</script>
<style scoped>
.curTit {
    font-size: 14px;
    margin-bottom: 10px
}
</style>