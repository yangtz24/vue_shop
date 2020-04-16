<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="authorityList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop></el-table-column>
        <el-table-column label="路径" prop></el-table-column>
        <el-table-column label="权限等级" prop>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level = '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level = '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level = '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNumber"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
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
</style>
