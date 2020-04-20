<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
        <!-- 警告区域 -->
      <el-alert show-icon title="注意：只允许为第三级分类设置相关参数" type="warning" :closable="false"></el-alert>

      <!-- 选择商品分类区域 -->
      <el-row class="cat_opt">
          <el-col>
              <span>选择商品分类：</span>
              <!-- 选择商品分类级联框 -->
          </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {},
  data() {
    return {}
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.cat_opt {
    margin: 15px 0;
}
</style>
