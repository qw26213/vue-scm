<template>
  <div>
    <svg-icon icon-class="qq" title="在线客服" @click="click" />
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
.qq-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
