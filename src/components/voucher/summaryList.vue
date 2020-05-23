<template>
    <el-select v-model="summary" style="width:100%;height:60px" placeholder="摘要" class="filter-item" filterable :allow-create="allowAdd" @blur="changeVal1" @change="changeVal2">
        <el-option v-for="(item,index) in summaryList" :key="index" :label="item.summary" :value="item.summary"></el-option>
    </el-select>
</template>
<script>
export default {
    name: 'summaryList',
    props: ['index', 'dataList', 'val'],
    data() {
        return {
            summary: '',
            summaryList: this.dataList,
            allowAdd: false
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
        changeVal1(event) {
            var obj = {
                summary: event.target.value,
                index: this.index
            }
            this.$emit('changeVal', obj)
        },
        changeVal2(val) {
            var obj = {
                summary: val,
                index: this.index
            }
            this.$emit('changeVal', obj)
        },
        focusSelect(event) {
            this.summaryList = this.dataList
        }
    }
}
</script>