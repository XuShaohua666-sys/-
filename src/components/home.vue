<template>
  <div>
    <el-button type="info" plain @click="leaveBtn">退出</el-button>
  </div>
</template>

<script>
export default {
  methods: {
    leaveBtn() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style lang="less" scoped></style>
