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
      <el-col>
        <el-button type="primary">添加权限</el-button>
      </el-col>

      <el-table :data="authorityList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="权限名称" prop="name"></el-table-column>
        <el-table-column label="路径" prop="uri"></el-table-column>
        <el-table-column label="权限等级" prop="sort">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level = '0'">一级</el-tag>
            <el-tag type="success" v-if="scope.row.level = '1'">二级</el-tag>
            <el-tag type="warning" v-if="scope.row.level = '2'">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
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
  created() {
    this.getAuthorityList()
  },
  data() {
    return {
      // 参数
      queryInfo: {
        key: '',
        currentPage: 1,
        pageSize: 10
      },
      // 权限列表
      authorityList: [],
      total: 0
    }
  },
  methods: {
    // 获取权限列表
    async getAuthorityList() {
      const { data: res } = await this.$http.get('rest/permission', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取权限列表失败！！！')
      }

      this.authorityList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getAuthorityList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNumber = newPageNum
      this.getAuthorityList()
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
.el-tag {
  display: flexbox;
  margin-right: 15px;
}
</style>
