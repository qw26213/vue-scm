<template>
    <el-select v-model="curId" style="width:100%;height:60px" placeholder="" class="filter-item" @change="changeVal" filterable>
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
            this.curCode = val;
            for (var i = 0; i < this.coaList.length; i++) {
                if (this.coaList[i].itemCode == this.curCode) {
                    this.curName = this.coaList[i].itemName
                    this.curArAp = this.coaList[i].arAp
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