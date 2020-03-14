<template>
    <el-select v-model="curId" style="width:100%;height:60px" placeholder="" class="filter-item" @change="changeVal" filterable allow-create>
        <el-option v-for="item in summaryList" :key="item.id" :label="item.summary" :value="item.summary">
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: 'summaryList',
    props: ['index', 'dataList'],
    data() {
        return {
            curId: '',
            summary: '',
            curIndex: this.index,
            summaryList: this.dataList
        }
    },
    watch:{
        dataList() {
            this.summaryList = this.dataList
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