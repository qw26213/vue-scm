<template>
  <div style="display:inline-block">
    <el-date-picker v-model="date1" size="small" :picker-options="startDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="开始月份" @change="pickerChange1" />
    <span class="zhi">至</span>
    <el-date-picker v-model="date2" size="small" :picker-options="endDateOptions" :clearable="false" type="month" value-format="yyyy-MM" placeholder="结束月份" @change="pickerChange2" />
  </div>
</template>
<script>
import { getNowMonth } from '@/utils/index'
import { getYearsById } from '@/api/voucher'
export default {
    name: 'coaList',
    props: {
        start: {
            type: String,
            default: ''
        },
        end: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            startDateOptions: null,
            endDateOptions: null,
            date1: this.start,
            date2: this.end
        }
    },
    watch: {
      start(val){
        this.date1 = val
      },
      end(val){
        this.date2 = val
      }
    },
    mounted() {
        getYearsById().then(res => {
            const list = res.data.data
            const s = new Date(list[0] + '-01-01 00:00:00').getTime()
            const e = new Date(list[list.length - 1] + '-12-31 00:00:00').getTime()
            this.startDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
            this.endDateOptions = { disabledDate: (time) => time.getTime() < s || time.getTime() > e }
        })
    },
    methods: {
        pickerChange1() {
            const startDate = this.date1 + '-01 00:00:00'
            const endDate = startDate.substr(0, 4) + '-12-31 00:00:00'
            this.endDateOptions = { disabledDate: (time) => time.getTime() < new Date(startDate) || time.getTime() > new Date(endDate) }
            this.$parent.changeVal({ periodCode1: this.date1 })
            const dateTime2 = new Date(this.date2+'-01 00:00:00').getTime()
            if (dateTime2 <= new Date(startDate).getTime() || dateTime2 >= new Date(endDate).getTime()) {
                this.$parent.changeVal({ periodCode2: startDate.substr(0, 4) + '-12' })
            } 
        },
        pickerChange2(val) {
            this.$parent.changeVal({ periodCode2: this.date2 })
        }
    }
}
</script>
<style lang="scss" scoped>
.el-date-editor{width: 120px!important}
</style>