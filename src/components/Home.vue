<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/imgs/kb.jpg" alt="" style="width: 100px; height: 50px" />
        <span>商品后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
        unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
        <!-- 一级菜单      index 字符串唯一-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.name }}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
             :key="subItem.id" @click="savaNavState('/' + subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.name }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data() {
    return {
      // 左侧菜单
      menuList: [],
      iconObj: {
        '1': 'iconfont icon-users',
        '2': 'iconfont icon-tijikongjian',
        '3': 'iconfont icon-shangpin',
        '4': 'iconfont icon-danju',
        '5': 'iconfont icon-baobiao'
      },
      // 折叠控制
      isCollapse: false,
      // 激活的链接地址
      activePath: ''
    }
  },
  methods: {
    async logout() {
      const { data: res } = await this.$http.get('rest/admin/logout')
      if (res.code !== 200) return this.$message.error(res.message)
      this.$message.success('退出成功')
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      const { data: res } = await this.$http.get('rest/menu')
      if (res.code !== 200) return this.$message.error(res.message)
      this.menuList = res.data
    },
    // 点击按钮实现菜单折叠展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    },
    // 保存连接激活状态
    savaNavState(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
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
  padding-left: 0;
  align-items: center;
  color: #ffffff;
  font: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
      font-size: x-large;
      font-weight: bold;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.iconfont {
  margin-right: 10px;
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #ffffff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
