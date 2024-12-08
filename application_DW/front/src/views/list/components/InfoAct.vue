<template>
  <div class="header-infoo">
    <span>{{ title }}</span>
    <p>{{ value }}</p>
    <em v-if="bordered" />
  </div>
</template>

<script>
export default {
  name: 'InfoAct',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    bordered: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="less" scoped>
@import "~ant-design-vue/es/style/themes/default.less";

.header-infoo {
  position: relative;
  text-align: center;
  & > span {
    display: inline-block;
    color: @heading-color;
    margin: 0;
    font-size: 24px;
  }
  & > p {
    text-align: left;
    margin: 5px;
    color: @text-color-secondary;
    font-size: 16px;
    white-space: pre-line;
  }
  & > em {
    position: absolute;
    top: 0;
    right: 0;
    width: 1px;
    height: 56px;
    background-color: @border-color-split;
  }
}
</style>
