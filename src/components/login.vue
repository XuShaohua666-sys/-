<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatat_box">
        <img src="../assets/u=3305298991,2024211813&fm=26&gp=0.png" alt="" />
      </div>
      <!--登录表单区域 -->
      <el-form
        ref="loginFormRef"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!--用户名 -->
        <el-form-item prop="username">
          <svg class="icon myicon" aria-hidden="true">
            <use
              xlink:href="#iconwulumuqishigongandashujuguanlipingtai-ico-"
            ></use>
          </svg>
          <el-input v-model="loginForm.username"> </el-input>
        </el-form-item>
        <!--密码 -->
        <el-form-item prop="password">
          <svg class="icon myicon" aria-hidden="true">
            <use xlink:href="#iconmimahui"></use>
          </svg>

          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!--按钮 -->
        <el-row class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      /* 登录表单的数据绑定对象 */
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      /* 表单验证规则对象 */
      loginFormRules: {
        //验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        //验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  methods: {
    /* 重置登录表单 */
    resetLoginForm() {
      /* 获取到表单元素，调用resetFields方法，重置表单 */
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (valid) {
          const { data: res } = await this.$http.post('/login', this.loginForm)
          if (res.meta.status != 200) {
            return this.$message.error('登录失败!请重试')
          } else {
            this.$message.success('登录成功')
            // 将登陆成功之后token，保存到客户端 sessionStorage中
            sessionStorage.setItem('token', res.data.token)
            // 通过编程式导航跳转到后台主页
            this.$router.push('/home')
          }
        } else {
          return
        }
      })
    },
  },
}
</script>

<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.avatat_box {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  box-shadow: 0 0 10px #fff;
  position: absolute;
  top: -65px;
  left: 0;
  right: 0;
  margin: 0 auto;
  img {
    width: 100%;
    height: 100%;
  }
}
.btns {
  text-align: right;
}
.login_form {
  padding: 20px;
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.icon {
  z-index: 1;
  font-size: 20px;
  position: absolute;
  top: 50%;
  transform: translate(30%, -50%);
}
</style>

<style>
.login_form input.el-input__inner {
  padding: 0 30px;
}
</style>
