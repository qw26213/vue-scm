<template>
  <div>
    <svg-icon icon-class="qq" @click="click" />
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
      alert('qq')
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
