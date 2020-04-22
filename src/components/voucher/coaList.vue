<template>
    <el-select v-model="curId" style="width:100%;height:60px" placeholder="科目" class="filter-item" @change="changeVal" filterable>
        <el-option v-for="item in coaList" :key="item.id" :label="item.name" :value="item.id">
        </el-option>
    </el-select>
</template>
<!--  filterable remote reserve-keyword :remote-method="remoteGet" -->
<script>
export default {
    name: 'coaList',
    props: ['selectId', 'index', 'dataList', 'val'],
    data() {
        return {
            curName: '',
            curId: '',
            isAuxiliary: 0,
            isCurrency: 0,
            isQuantity: 0,
            auxiliary: '',
            uom: '',
            curIndex: this.index,
            coaList: this.dataList
        }
    },
    watch:{
        dataList() {
            this.coaList = this.dataList
            this.curId = this.val
        },
        val(){
            this.curId = this.val
        }
    },
    methods: {
        changeVal(val) {
            this.curId = val;
            for (var i = 0; i < this.coaList.length; i++) {
                if (this.coaList[i].id == this.curId) {
                    this.isAuxiliary = this.coaList[i].isAuxiliary
                    this.isCurrency = this.coaList[i].isCurrency
                    this.isQuantity = this.coaList[i].isQuantity
                    this.auxiliary = this.coaList[i].auxiliary
                    this.uom = this.coaList[i].uom
                }
            }
            var obj = {
                isAuxiliary: this.isAuxiliary,
                isCurrency: this.isCurrency,
                isQuantity: this.isQuantity,
                index: this.curIndex,
                auxiliary: this.auxiliary,
                qUom: this.uom
            }
            this.$emit('changeVal', obj)
        }
    }
}
</script>