<template>
    <el-select v-model="summary" style="width:100%;height:60px" placeholder="" class="filter-item" @change="changeVal" filterable allow-create>
        <el-option v-for="(item,index) in summaryList" :key="index" :label="item.summary" :value="item.summary"></el-option>
    </el-select>
</template>
<script>
export default {
    name: 'summaryList',
    props: ['index', 'dataList', 'val'],
    data() {
        return {
            curIndex: this.index,
            summary: '',
            summaryList: this.dataList
        }
    },
    watch:{
        dataList() {
            this.summaryList = this.dataList
            this.summary = this.val
        },
        val(){
            this.summary = this.val
        }
    },
    methods: {
        changeVal(val) {
            var obj = {
                summary: val,
                index: this.curIndex
            }
            this.$emit('changeVal', obj)
        }
    }
}
</script>