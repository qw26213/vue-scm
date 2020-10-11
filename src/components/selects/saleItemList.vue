<template>
    <el-select v-model="curId" filterable size="small" class="filter-item custInput" @change="changeVal" placeholder="">
        <el-option v-for="item in itemList" :key="item.itemId" :label="item.itemCode + ' ' +item.itemName" :value="item.itemId">
        </el-option>
    </el-select>
</template>
<script>
export default {
    name: 'list',
    props: ['selectId', 'index', 'itemList'],
    data() {
        return {
            curIndex: this.index,
            curId: this.selectId,
            curName: "",
            curSubUom: "",
            curExchangeRate: "",
            curSalePriceType: '',
            curNorms: "",
            curUom: "",
            curPrice: ''
        }
    },
    watch: {
        selectId() {
            this.curId = this.selectId
        }
    },
    methods: {
        changeVal(val) {
            this.curId = val
            this.itemList.forEach(item => {
                if (item.id == this.curId) {
                    this.curCode = item.itemCode
                    this.curNorms = item.norms
                    this.curUom = item.uom
                    this.curSubUom = item.subUom
                    this.curExchangeRate = item.exchangeRate
                    this.curSalePriceType = item.salePriceType
                    this.curPrice = item.price
                }
            })
            var obj = {
                itemCode: this.curCode,
                itemName: this.curName,
                norms: this.curNorms,
                uom: this.curUom,
                itemId: this.curId,
                index: this.curIndex,
                subUom: this.curSubUom,
                exchangeRate: this.curExchangeRate,
                salePriceType: this.curSalePriceType,
                vatPrice: this.curPrice
            }
            this.$emit('changeVal', obj)
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