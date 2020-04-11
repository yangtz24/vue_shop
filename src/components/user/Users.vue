<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">用户管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getUserList" placeholder="请输入内容" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户信息列表 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="昵称" prop="nickName"></el-table-column>
        <el-table-column label="角色" prop="username"></el-table-column>
        <!-- <el-table-column label="创建时间" prop="createTime"></!--> -->
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <!-- scope 作用域插槽  scope.row获取行数据 -->
            <el-switch v-model="scope.row.status" @change="statusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template>
            <!-- 编辑 -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!-- 删除 -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNumber"
        :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    return {
      // 获取用户列表
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 10
      },
      userList: [],
      total: 0
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('rest/admin/page', {
        params: this.queryInfo
      })
      if (res.code !== 200) return this.$message.error('获取用户列表失败！')
      // 用户列表数据
      this.userList = res.data.content
      // 列表总数
      this.total = res.data.count
      console.log(res)
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
        console.log(newPageSize)
        this.queryInfo.pageSize = newPageSize
        this.getUserList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
        console.log(newPageNum)
        this.queryInfo.pageNumber = newPageNum
        this.getUserList()
    },
    // 监听 开关状态改变
    async statusChanged(userInfo) {
        console.log(userInfo)
        const { data: res } = await this.$http.put(`rest/admin/${userInfo.id}/status/${userInfo.status}`)
        if (res.code !== 200) {
            userInfo.status = !userInfo.status
            return this.$message.error('状态更新失败！！！')
        }
        return this.$message.success('状态更新成功！！！')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
