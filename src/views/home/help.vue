<template>
  <div style="height:660px;">
    <div class="guide-wrap">
      <div class="guide-content">
        <img src="../../assets/guide.png" width="100%" height="100%">
        <div class="steps step1 cf" data-index="1">
          <span class="step-num">1</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/init/createBill')">建账</p>
            <div class="guide-line" />
            <p class="size-12">设置账套名称、会计体系、启用期间、</p>
            <p class="size-12">科目级次、科目编码规则等</p>
          </div>
        </div>
        <div class="steps step2 cf" data-index="2">
          <span class="step-num">2</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/set/balance')">设置</p>
            <div class="guide-line" />
            <p class="size-12" @click="toPath('/set/coaList')">1.科目设置，增加下级科目，设置核算项</p>
            <p class="size-12" @click="toPath('/set')">2.辅助核算，增加或者修改辅助</p>
            <p class="size-12">核算项数据，自定义辅助核算项</p>
          </div>
        </div>
        <div class="steps step3 cf" data-index="3">
          <span class="step-num">3</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/set/balance')">期初余额</p>
            <div class="guide-line" />
            <p class="size-12">录入开账的期初余额</p>
            <p class="size-12">录入年初至截止启用期间的借贷发生额度</p>
          </div>
        </div>
        <div class="steps step4 cf" data-index="4">
          <span class="step-num">4</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/voucher/add')">凭证</p>
            <div class="guide-line" />
            <p class="size-12" @click="toPath('/voucher/add')">1.新增凭证</p>
            <p class="size-12" @click="toPath('/voucher/list')">2.查询凭证</p>
            <p class="size-12" @click="toPath('/voucher/auidt')">3.审核凭证</p>
            <p class="size-12" @click="toPath('/voucher/table')">4.凭证汇总表</p>
          </div>
        </div>
        <div class="steps step5 cf" data-index="5">
          <span class="step-num">5</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/accbook/totalaccount')">账簿</p>
            <div class="guide-line" />
            <p class="size-12">包括总账、明细账、科目余额表、</p>
            <p class="size-12">数量总账、数量明细账等各种</p>
            <p class="size-12">企业常用账簿</p>
          </div>
        </div>
        <div class="steps step6 cf" data-index="6">
          <span class="step-num">6</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/account/closePeriod')">结账</p>
            <div class="guide-line" />
            <p class="size-12">结账，进入下一个会计期间</p>
          </div>
        </div>
        <div class="steps step7 cf" data-index="7">
          <span class="step-num">7</span>
          <div class="step-dtl">
            <p class="bold pointer" @click="toPath('/report/debt')">报表</p>
            <div class="guide-line" />
            <p class="size-12" @click="toPath('/report/debt')">1.资产负债表</p>
            <p class="size-12" @click="toPath('/report/profit')">2.利润表</p>
          </div>
        </div>
        <div class="guide-tips" />
        <div class="btn btn-default plr15 guide-download">
          <el-button type="primary" @click="downloadFile">手册下载</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'usingHelp',
  data() {
    return {
      info: {}
    }
  },
  methods: {
    downloadFile() {
      var eleLink = document.createElement('a')
      eleLink.href = 'https://www.baidu.com'
      eleLink.target = '_blank'
      eleLink.download = '金账簿使用手册'
      eleLink.style.display = 'none'
    },
    toPath(path) {
      this.$router.push(path)
    }
  }
}
</script>
<style scoped>
.guide-download {
    right: 20px;
    top: 20px;
    width: 150px;
    height: 36px;
    position: absolute;
    border-radius: 3px;
    line-height: 30px;
}
.guide-wrap{height:100%;background:#fafcff}
.guide-wrap .guide-content{height:100%;width:100%;position:relative}
.guide-wrap .guide-content .steps{position:absolute;cursor:pointer}
.guide-wrap .guide-content .steps:hover .step-num{background:#0089bd;line-height: 60px}
.guide-wrap .guide-content .steps:hover .step-dtl .guide-line{background-position:0 -8px}
.guide-wrap .guide-content .steps .step-num{color:#fff;background:#56d2f5;font-size:26px;padding:2px 18px;border-radius:8px;float:left;width:50px;height:40px;box-sizing:border-box;margin-top:20px}
.guide-wrap .guide-content .steps .step-dtl{float:left}
.guide-wrap .guide-content .steps .step-dtl p{margin-bottom:5px;margin-top:5px;margin-left:10px}
.guide-wrap .guide-content .steps .step-dtl .size-12{font-size:12px}
.guide-wrap .guide-content .steps .step-dtl .bold{font-weight:700}
.guide-wrap .guide-content .steps .step-dtl .guide-line{background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAAOCAYAAAAVFIODAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzgxMDA0RDg5Q0IyMTFFNjlBMzRDMThBQjhBRjZEQzIiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzgxMDA0RDc5Q0IyMTFFNjlBMzRDMThBQjhBRjZEQzIiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpCQjdGMTBGQTlDQUIxMUU2OUEzNEMxOEFCOEFGNkRDMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpCQjdGMTBGQjlDQUIxMUU2OUEzNEMxOEFCOEFGNkRDMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiAXKdUAAACaSURBVHjaYmTY/p5hFAx5wAbE3UAcA8SMQLwYiEtZRsNlWIAuIM5D4oPY3xmBOff/aNgMScCIxH4LxEJo8u+YRsNo+AImaAoYxUMPI4PFWOJ2zmidOzxAGTTCY5Eiu5bx///RKnc4F8ujYJgCFsbOA6OhMNrPHQVDrZ8LitzRSnfo93Njscinjta5o/3cUTzazx0Fg6qfCxBgAHEvHHCfOFhxAAAAAElFTkSuQmCC) no-repeat 50%;background-position:0 0;width:119px;height:6px}
.guide-wrap .guide-content .step1{left:12.5%;top:72.5%}
.guide-wrap .guide-content .step2{left:15.4%;top:34.5%}
.guide-wrap .guide-content .step3{left:31.8%;top:20.3%}
.guide-wrap .guide-content .step4{left:34.8%;top:55.5%}
.guide-wrap .guide-content .step5{left:56.0%;top:42.5%}
.guide-wrap .guide-content .step6{left:70.1%;top:21.5%}
.guide-wrap .guide-content .step7{left:78.9%;top:66.5%}
.guide-wrap .guide-content .guide-tips{background:url(../../assets/guideTxt.png) no-repeat 50%;left:20px;top:20px;width:477px;height:75px;position:absolute}
</style>
