<template>
    <el-select v-model="curId" style="width:150px" placeholder="" size="small" @change="changeVal">
        <el-option v-for="item in list" :label="item.measName" :key="item.id" :value="item.id"></el-option>
    </el-select>
</template>
<script>
import { getMeas } from '@/api/basedata'
export default {
    name: 'list',
    props: ['selectId', 'index', 'resdata', 'keyType'],
    data() {
        return {
            list: [],
            curName: '',
            curCode: '',
            curId: this.selectId
        }
    },
    watch: {
        'selectId' () {
            this.curId = this.selectId
        }
    },
    created() {
        var list = this.resdata;
        if (this.keyType == 'subMeas') {
            var list = [{ id: '', measName: '无' }, ...this.resdata]
        }
        this.list = list
    },
    methods: {
        changeVal(val) {
            for (var i = 0; i < this.resdata.length; i++) {
                if (this.resdata[i].id == val) {
                    this.curName = this.resdata[i].measName;
                }
            }
            if (this.keyType == 'subMeas') {
                var obj = { subMeasId: val, subMeasName: this.curName, index: this.index }
            } else {
                var obj = { measId: val, measName: this.curName, index: this.index }
            }
            this.$emit('changeVal', obj)
        }
    }
}
</script>