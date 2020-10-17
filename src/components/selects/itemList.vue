<template>
    <el-select v-model="curId" filterable size="small" class="filter-item custInput" @change="changeVal" placeholder="">
        <el-option v-for="item in itemList" :key="item.id" :label="item.itemCode + ' ' + item.itemName" :value="item.id" />
    </el-select>
</template>
<script>
import { getItem } from '@/api/basedata'
import { mapGetters } from 'vuex'
export default {
    name: 'list',
    props: ['selectId', 'index', 'selectCode'],
    data() {
        return {
            curIndex: this.index,
            curId: this.selectId,
            curCode: ''
        }
    },
    computed: {
        ...mapGetters([
            'itemList'
        ])
    },
    watch: {
        selectId(val) {
            this.curId = val
        }
    },
    methods: {
        changeVal(val) {
            this.curId = val;
            const obj = this.itemList.find(it => it.id === val)
            if (obj.id) {
                const data = {
                    norms: obj.norms,
                    uom: obj.uom,
                    itemId: val,
                    index: this.curIndex,
                    subUom: obj.subUom,
                    exchangeRate: obj.exchangeRate,
                    salePriceType: obj.salePriceType
                }
                this.$emit('changeVal', data)
            }
        }
    }
}
</script>
<style lang="scss">
.custInput {
    width: 100%;
}

.custInput input {
    border: none;
    width: 100%;
    display: block;
}
</style>