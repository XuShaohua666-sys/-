<template>
  <el-container>
    <!--头部区域-->
    <el-header>
      <div class="headerLeft">
        <img src="../assets/电商管理系统.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" plain @click="leaveBtn">退出</el-button>
    </el-header>
    <!--页面主体区域-->
    <el-container>
      <!--侧边栏-->
      <el-aside :width="flag ? '64px' : '200px' ">
        <!--侧边栏菜单区域-->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :default-active='path'
          unique-opened
          :collapse='flag'
          :collapse-transition='false'
          :router='true'
        >
          <!--一级菜单区域-->
          <el-submenu :index="'/' + item.path" v-for="item in menuList" :key="item.id">
            <template slot="title">
              <i :class="iconsObj[item.id]" style="margin-right:10px" ></i>
              <span>{{item.authName}}</span>
            </template>
            <!--二级菜单区域-->
            <el-menu-item :index="'/' + children.path" v-for="children in item.children" :key="children.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{children.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容-->
      <el-main>
       <!--路由占位符，展示子组件-->
      <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单栏数据
      menuList: [],
      iconsObj:{
        125:'iconfont icon-users',
        103:'iconfont icon-tijikongjian',
        101:'iconfont icon-shangpin',
        102:'iconfont icon-danju',
        145:'iconfont icon-baobiao'
      },
      // 控制菜单栏折叠与展开
      flag:false,
      path:this.$route.path
    }
  },
  // 生命周期函数，在实例创建完成后被立即调用
  created() {
    // 调用获取菜单数据函数
    this.getMenuList()
  },
  methods: {
    // 退出按钮
    leaveBtn() {
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 取菜单数据函数
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status != 200) {
        return this.$message.error(res.meta.msg)
      } else {
        // 将获取到的数据 保存到data数据中
        this.menuList = res.data
      }
      console.log(res)
    },

    toggleCollapse(){
      this.flag = !this.flag
    }
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d42;
  display: flex;
  line-height: 60px;
  padding-left: 0;
  justify-content: space-between;
  align-items: center;
}
.headerLeft {
  display: flex;
  img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  span {
    display: inline-block;
    font-size: 20px;
    color: #eaedf1;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #345064;
  color: #ffffff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
