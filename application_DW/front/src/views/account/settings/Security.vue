<template>
  <a-list
    itemLayout="horizontal"
    :dataSource="data"
  >
    <a-list-item slot="renderItem" slot-scope="item, index" :key="index">
      <a-list-item-meta>
        <a slot="title">{{ item.title }}</a>
        <span slot="description">
          <span class="security-list-description">{{ item.description }}</span>
          <span v-if="item.value"> : </span>
          <span class="security-list-value">{{ item.value }}</span>
          <a-input-password placeholder="请输入旧密码" v-model="oldPwd" style="width: 35%;margin-left: 20px" v-if="!item.avail"/>
          <a-input-password placeholder="请输入新密码" v-model="newPwd" style="width: 35%;margin-left: 20px" v-if="!item.avail"/>
        </span>
      </a-list-item-meta>
      <template v-if="item.actions">
        <a slot="actions" @click="onclick" :disabled="item.avail || oldPwd.length === 0 || newPwd.length === 0">{{ item.actions.title }}</a>
      </template>
    </a-list-item>
  </a-list>
</template>

<script>
import storage from 'store'
import { changePwd } from '@/api/login'
import { scorePassword } from '@/utils/util'

export default {
computed: {
    data () {
        return [
        { title: this.$t('account.settings.security.password'), description: this.$t('account.settings.security.password-description'), value: '强', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.info('This is a normal message') } }, avail: false },
        { title: this.$t('account.settings.security.phone'), description: this.$t('account.settings.security.phone-description'), value: String(storage.get('PHONE')), actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.success('This is a message of success') } }, avail: true },
        { title: this.$t('account.settings.security.question'), description: this.$t('account.settings.security.question-description'), value: '', actions: { title: this.$t('account.settings.security.set'), callback: () => { this.$message.error('This is a message of error') } }, avail: true }
        // { title: this.$t('account.settings.security.email'), description: this.$t('account.settings.security.email-description'), value: 'ant***sign.com', actions: { title: this.$t('account.settings.security.modify'), callback: () => { this.$message.warning('This is message of warning') } } }
        // { title: this.$t('account.settings.security.mfa'), description: this.$t('account.settings.security.mfa-description'), value: '', actions: { title: this.$t('account.settings.security.bind'), callback: () => { this.$message.info('This is a normal message') } } }
      ]
    }
  },
data () {
   return { newPwd: '', oldPwd: '' }
},
methods: {
  onclick () {
    if (scorePassword(this.newPwd.trim()) < 60) {
      this.$notification.error({
        message: '修改失败',
        description: '新密码强度不足，密码强度评分至少为60，新密码强度评分为：' + String(scorePassword(this.newPwd.trim()))
      })
      return
    }
    changePwd({ newPwd: this.newPwd.trim(), oldPwd: this.oldPwd.trim() }).then((res) => {
      if (res.code === 1) {
        this.$notification.success({
          message: '修改成功',
          description: '密码修改成功'
        })
        this.newPwd = ''
        this.oldPwd = ''
      } else {
        if (res.code === 0) {
          this.$notification.error({
            message: '修改失败',
            description: '旧密码错误，请重新输入'
          })
        this.oldPwd = ''
        } else {
          this.$notification.error({
            message: '修改失败',
            description: res.message
          })
        }
      }
    })
  }
}
}
</script>

<style scoped>

</style>
