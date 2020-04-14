<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
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
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getAuthorityList()
  },
  data() {
    return {
      // 权限列表
      authorityList: []
    }
  },
  methods: {
    // 获取权限列表
    async getAuthorityList() {
      const { data: res } = await this.$http.get('rest/xxx')
      if (res.code !== 200) {
        return this.$message.error('获取权限列表失败！！！')
      }

      this.authorityList = res.data.content
    },
    // 删除权限信息
    async remove(role, aId) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('取消删除！！')
      }

      const { data: res } = await this.$http.delete(`rest/${role.id}/xx/${aId}`)
      if (res.code !== 200) {
        this.$message.error('删除权限失败！！！')
      }

      //   刷新列表
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
