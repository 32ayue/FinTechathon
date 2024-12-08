<template>
  <div id="building">
    <a-result status="500" title="您访问的网址很可能是异常网址" sub-title="The website you visited is most likely a fraudulent website">
      <template #extra>
        <div>您正在访问的网站经检测存在危险，继续访问可能会危害您的计算机及信息财产安全</div>
        <div>本次访问已被智盾拦截，建议立即关闭页面</div><br>
      <!-- </template>
      <template #extra> -->
      <a-button type="primary" @click="to403">
        获取分析结果
      </a-button>&nbsp;&nbsp;&nbsp;
      <a-button type="primary" @click="toHome">
        无视风险继续访问
      </a-button>&nbsp;&nbsp;&nbsp;
      <a-button type="primary" @click="toHome">
        Back Home
      </a-button>
    </template>
    </a-result>
  </div>
    <!-- <span>您正在访问的网站经检测存在危险，继续访问可能会危害您的计算机及信息财产安全</span>
    <span>本次访问已被智盾拦截，建议立即关闭页面</span> -->
</template>

<script>
export default {
  name: 'Exception404',
  methods: {
    toHome () {
      this.$router.push({ path: '/' })
    },
    to403 () {
      this.$router.push({ path: '/403' })
    }
  }
}
</script>

<style lang="less" scoped>
  body{
    margin:0;
    padding:0;
    border:0
  }
  #building{
  background:url("~@/assets/1.jpg");
  width:100%;
  height:100%;
  // position:fixed;
  background-size:100% 100%;
  text-align: center;
  font-size: 18px;
  // color: #ffffff;
  }
  #a{
    color: #ffffff ;
  }
</style>
