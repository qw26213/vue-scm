<template>
    <el-select v-model="curCode" style="width:145px" size="small" placeholder="选择结算方式" class="filter-item" @change="changeVal">
        <el-option v-for="item in settleTypeList" :key="item.id" :label="item.settleTypeName" :value="item.settleTypeCode">
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: 'settleTypeList',
    props: ['selectCode', 'selectName', 'selectArap', 'index', 'settleTypeArr'],
    data() {
        return {
            curArAp: '',
            curCode: this.selectCode,
            curName: '',
            curIndex: this.index,
            settleTypeList: this.settleTypeArr
        }
    },
    methods: {
        changeVal(val) {
            this.curCode = val;
            for (var i = 0; i < this.settleTypeList.length; i++) {
                if (this.settleTypeList[i].settleTypeCode == this.curCode) {
                    this.curName = this.settleTypeList[i].settleTypeName
                    this.curArAp = this.settleTypeList[i].arAp
                }
            }
            var obj = {
                settleTypeCode: this.curCode,
                settleTypeName: this.curName,
                arAp: this.curArAp,
                index: this.curIndex
            }
            this.$emit('settleTypeChange', obj)
        }
    }
}
</script>