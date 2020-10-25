<template>
    <el-select v-model="curId" filterable size="small" class="filter-item custInput" @change="changeVal" placeholder="">
        <el-option v-for="item in itemList" :key="item.itemId" :label="item.itemCode + ' ' +item.itemName" :value="item.itemId" />
    </el-select>
</template>
<script>
export default {
    name: 'list',
    props: ['selectId', 'index', 'itemList'],
    data() {
        return {
            curIndex: this.index,
            curId: this.selectId
        }
    },
    watch: {
        selectId() {
            this.curId = this.selectId
        }
    },
    methods: {
        changeVal(val) {
            this.curId = val;
            const obj = this.itemList.find(it => it.itemId === val)
            if (obj.id) {
                const data = {
                    norms: obj.norms,
                    uom: obj.uom,
                    itemId: val,
                    index: this.curIndex,
                    subUom: obj.subUom,
                    exchangeRate: obj.exchangeRate,
                    salePriceType: obj.salePriceType,
                    vatPrice: obj.price,
                    qualityDays: obj.qualityDays
                }
                this.$emit('changeVal', data)
            }
        }
    }
}
</script>
<style lang="scss">
.custInput {
    width: 100%
}
.custInput input {
    border: none;
    width: 100%;
    display: block;
}
</style>