<template>
  <div class="icon" @click="click">
    <span class="qq_icon"></span>
    <span class="qq_txt">在线客服</span>
  </div>
</template>
<script>
export default {
  name: 'QQ',
  data() {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click() {
      location.href="tencent://message/?uin=1374822911&Menu=yes&Service=300&sigT=42a1e5347953b64c5ff3980f8a6e644d4b31456cb0b6ac6b27663a3c4dd0f4aa14a543b1716f9d45";
    }
  }
}
</script>

<style scoped>
.qq_icon {
  display: inline-block;
  cursor: pointer;
  width: 18px;
  height: 20px;
  vertical-align: middle;
  background: url(../../assets/qq.png) no-repeat center center;background-size: 100% 100%;
}
.qq_txt {
  font-size: 14px;
  color: #666;
}
.icon:hover .qq_txt {
  color: #1989fa;
}
</style>
