<template>
    <div class="areaBox">
        <div class="areaSelect">
            <el-select v-model="provinceCode"  placeholder="请选择省份" @change="provinceChange" style="width:120px;">
                <el-option v-for="(item,index) in provinceList" :key="index" :label="item.ssqname" :value="item.ssqid">
                </el-option>
            </el-select>
            <el-select v-model="cityCode"  placeholder="请选择城市" @change="cityChange" style="width:120px;margin-left:10px">
                <el-option v-for="(item,index) in cityList" :key="index" :label="item.ssqname" :value="item.ssqid">
                </el-option>
            </el-select>
            <el-select v-model="areaCode"  placeholder="请选择县区" @change="areaChange" style="width:120px;margin-left:10px">
                <el-option v-for="(item,index) in areaList" :key="index" :label="item.ssqname" :value="item.ssqid">
                </el-option>
            </el-select>
        </div>
    </div>
</template>

<script>
    import Areas from "@/api/area.js"
    export default {
        name: "areas",
        props:["addressCode"],
        data(){
            return{
                provinceList:Areas,
                provinceValue:'',
                provinceCode:'',
                cityList:[],
                areaList:[],
                cityValue:'',
                cityCode:'',
                areaCode:'',
                areaValue:''
            }
        },
        methods:{
            provinceChange(e){
                // this.provinceCode = e;
                for(var i = 0;i<this.provinceList.length;i++){
                    if(this.provinceCode == this.provinceList[i].ssqid){
                        this.cityList = [].concat(this.provinceList[i].cities.city);
                        this.provinceValue = this.provinceList[i].ssqname
                    }
                }
                this.cityValue = this.cityList[0].ssqname;
                this.cityCode = this.cityList[0].ssqid;
                this.areaList = this.cityList[0].areas.area;
                this.areaValue = this.cityList[0].areas.area[0].ssqname;
                this.areaCode = this.cityList[0].areas.area[0].ssqid;
                this.$emit("giveData",this.provinceValue + "-" + this.cityValue+ "-" + this.areaValue)
            },
            cityChange(e){
                // this.cityCode = e;
                for(var i = 0;i<this.cityList.length;i++){
                    if(this.cityCode == this.cityList[i].ssqid){
                        this.areaList = [].concat(this.cityList[i].areas.area);
                        this.cityValue = this.cityList[i].ssqname
                    }
                }
                this.areaValue = this.areaList[0].ssqname;
                this.areaCode = this.areaList[0].ssqid;
                this.$emit("giveData",this.provinceValue + "-" + this.cityValue+ "-" + this.areaValue)
            },
            areaChange(e){
                // this.areaCode = e;
                for(var i = 0;i<this.areaList.length;i++){
                    if(this.areaCode == this.areaList[i].ssqid){
                        this.areaValue = this.areaList[i].ssqname
                    }
                }
                this.$emit("giveData",this.provinceValue + "-" + this.cityValue+ "-" + this.areaValue)
            },
            init(){
                if(this.addressCode){
                    this.modifyAddress();
                }else{
                    this.cityList = [].concat(this.provinceList[0].cities.city);
                    this.areaList = [].concat(this.cityList[0].areas.area);
                    this.provinceChange()
                }
            },
            modifyAddress(){
                for(var i =0;i<this.provinceList.length;i++){
                    if(this.addressCode.province == this.provinceList[i].ssqname){
                        this.provinceCode = this.provinceList[i].ssqid;
                        this.provinceValue = this.provinceList[i].ssqname;
                        this.cityList = this.provinceList[i].cities.city;
                        for(var j = 0;j<this.provinceList[i].cities.city.length;j++){
                            if(this.addressCode.city == this.provinceList[i].cities.city[j].ssqname){
                                this.cityCode = this.provinceList[i].cities.city[j].ssqid;
                                this.areaList = this.provinceList[i].cities.city[j].areas.area;
                                this.cityValue = this.provinceList[i].cities.city[j].ssqname;
                                for(var k =0;k<this.provinceList[i].cities.city[j].areas.area.length;k++){
                                    if(this.addressCode.area == this.provinceList[i].cities.city[j].areas.area[k].ssqname){
                                        this.areaCode = this.provinceList[i].cities.city[j].areas.area[k].ssqid;
                                        this.areaValue = this.provinceList[i].cities.city[j].areas.area[k].ssqname;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        mounted(){
            this.init()
        },
        watch:{
            'addressCode'() {
                this.init()
            }
        }
    }
</script>

<style scoped>

</style>