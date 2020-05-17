<template>
    <el-select v-model="curId" style="width:100%;height:60px" placeholder="科目" class="filter-item" @change="changeVal" filterable>
        <el-option v-for="item in coaList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: 'coaList',
    props: {
        dataList: {
            type: Array,
            default: []
        },
        index: {
            type: Number,
            default: 0
        },
        val: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            curId: this.val,
            isAuxiliary: 0,
            isCurrency: 0,
            isQuantity: 0,
            auxiliary: '',
            uom: '',
            crDr: '',
            coaCode: '',
            coaName: '',
            curIndex: this.index,
            coaList: this.dataList
        }
    },
    watch: {
        dataList() {
            this.coaList = this.dataList
            this.curId = this.val
        },
        'val': {
            handler: function() {
                this.curId = this.val
            },
            deep: false, //为true可监听到对象内部属性的改变
            immediate: false //为true表示在watch中声明的时候，就立即执行handler方法
        }
    },
    methods: {
        changeVal(val) {
            if (!val) { return }
            this.curId = val;
            for (var i = 0; i < this.coaList.length; i++) {
                if (this.coaList[i].id == this.curId) {
                    this.isAuxiliary = this.coaList[i].isAuxiliary
                    this.isCurrency = this.coaList[i].isCurrency
                    this.isQuantity = this.coaList[i].isQuantity
                    this.auxiliary = this.coaList[i].auxiliary
                    this.uom = this.coaList[i].uom
                    this.coaCode = this.coaList[i].coaCode
                    this.coaName = this.coaList[i].coaName
                    this.crDr = this.coaList[i].crDr
                }
            }
            var obj = {
                isAuxiliary: this.isAuxiliary,
                isCurrency: this.isCurrency,
                isQuantity: this.isQuantity,
                index: this.curIndex,
                auxiliary: this.auxiliary,
                coaCode: this.coaCode,
                coaId: this.curId,
                coaName: this.coaName,
                uom: this.uom,
                crDr: this.crDr
            }
            this.$emit('changeVal', obj)
        }
    }
}
</script>