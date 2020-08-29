<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="logo">
        <img src="../assets/logo.png" alt />
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'67px':'200px'">
        <div class="toggle-botton" @click="toggleBtn">|||</div>
        <el-menu :default-active="activePath" class="el-menu-vertical-demo" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <!-- 一级菜单 -->
          <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模版 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级子菜单 -->
            <el-menu-item :index="'/'+citem.path" v-for="citem in item.children" :key="citem.id" @click="activeItem('/'+citem.path)">
              <!-- 二级子菜单模版 -->
              <template slot="title">
                <!-- 二级子菜单图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{citem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体结构 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      menuList: [],
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('active')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return res.meta.msg
      this.menuList = res.data
      // console.log(this.menuList)
    },
    toggleBtn () {
      this.isCollapse = !this.isCollapse
    },
    activeItem (path) {
      this.activePath = path
      window.sessionStorage.setItem('active', path)
    }
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  .logo {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 10px;
    }
    span {
      color: #fff;
      font-size: 18px;
    }
  }
}
.el-aside {
  background-color: #333744;
}
.el-main {
  background-color: #eaedf1;
}
.toggle-botton{
  text-align: center;
  color: #fff;
  font-size: 16px;
  letter-spacing: .2em;
  line-height: 28px;
  cursor: pointer;
}
</style>
