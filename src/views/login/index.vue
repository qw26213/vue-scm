<template>
    <div class="login-container">
        <router-view />
    </div>
</template>
<style lang="scss" scoped>
.login-container {
    background: url(../../assets/bg.jpg) no-repeat center center;
    background-size: cover;
    height: 100%;
    width: 100%;
    overflow: hidden;
}
>>>.vertify {
    width: 112px;
    position: absolute;
    top: 2px;
    right: 0;
    height: 42px;
    border-radius: 4px;
}

>>>.login-form {
    position: relative;
    width: 480px;
    max-width: 100%;
    background: rgba(241, 241, 241, 0.80);
    box-shadow: 0 0 10px #ccc;
    padding: 40px 35px 20px;
    margin: 120px auto;
    overflow: hidden;
}

>>>.title-container {
    position: relative;
}

>>>.title-container .title {
    font-size: 26px;
    color: #333;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
}

>>>.bot {
    margin: 10px 0
}

>>>.bot span {
    display: inline-block;
    font-size: 14px;
    color: #666;
    cursor: pointer;
}

>>>.bot span:hover {
    color: #333;
}
</style>