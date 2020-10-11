<template>
    <el-select v-model="salesTypeCode" style="width:100%" placeholder="" class="custInput" size="small" @change="changeVal">
        <el-option v-for="item in salesTypeArr" :key="item.id" :label="item.salesTypeName" :value="item.salesTypeCode"></el-option>
    </el-select>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
    name: 'list',
    props: ['selectId', 'index'],
    data() {
        return {
            list: [],
            curIndex: this.index,
            salesTypeCode: this.selectId,
        }
    },
    computed: {
        ...mapGetters([
            'salesTypeArr'
        ])
    },
    watch: {
        'selectId' () {
            this.salesTypeCode = this.selectId
            this.curIndex = this.index
        }
    },
    methods: {
        changeVal(val) {
            var obj = { salesTypeCode: val, index: this.curIndex }
            this.$emit('selectChange', obj)
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