<template>
    <el-select v-model="curId" style="width:100%;height:60px" placeholder="" class="filter-item" @change="changeVal" filterable>
        <el-option v-for="item in summaryList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: 'summaryList',
    props: ['selectId', 'index', 'dataList'],
    data() {
        return {
            curId: '',
            curName: '',
            curIndex: this.index,
            summaryList: this.dataList
        }
    },
    methods: {
        changeVal(val) {
            this.curCode = val;
            for (var i = 0; i < this.summaryList.length; i++) {
                if (this.summaryList[i].itemCode == this.curCode) {
                    this.curName = this.summaryList[i].itemName
                    this.curArAp = this.summaryList[i].arAp
                }
            }
            var obj = {
                itemCode: this.curCode,
                itemName: this.curName,
                arAp: this.curArAp,
                index: this.curIndex
            }
            this.$emit('changeVal', obj)
        },
        remoteGet(){

        }
    }
}
</script>