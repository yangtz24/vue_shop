<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">权限管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
    </el-card>

    <!-- 角色列表区域 -->
    <el-table :data="rolesList" border stripe>
      <!-- 展开列 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-row
            :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
            v-for="(item1, i1) in scope.row.children"
            :key="item1.id"
          >
            <!-- 渲染一级权限信息 -->
            <el-col :span="5">
              <el-tag closable
                    @close="remove(scope.row, item1.id)">{{item1.name}}</el-tag>
              <i class="el-icon-caret-right"></i>
            </el-col>
            <!-- 渲染二级、三级权限信息 -->
            <el-col :span="20">
              <!-- 渲染二级权限信息 -->
              <el-row
                :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']"
                v-for="(item2, i2) in item1.children"
                :key="item2.id"
              >
                <el-col :span="8">
                  <el-tag type="success" closable
                    @close="remove(scope.row, item2.id)">{{item2.name}}</el-tag>
                  <i class="el-icon-caret-right"></i>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    type="warning"
                    v-for="(item3, i3) in item2.children"
                    :key="item3.id"
                    closable
                    @close="remove(scope.row, item3.id)"
                  >{{item3.name}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <!-- 索引列 -->
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop></el-table-column>
      <el-table-column label="角色描述" prop></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-setting" size="mini">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  created() {
    getRolesList()
  },
  data() {
    return {
      rolesList: []
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('rest/role')
      if (res.code !== 200) {
        this.$message.error('获取权限列表失败！！！')
      }

      this.rolesList = res.data.content
    },
    // 删除权限信息
    async remove(role, aId) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (confirmResult !== 'confirm') {
          return this.$message.info('取消删除！！')
      }

      const { data: res } = await this.$http.delete(`rest/${role.id}/xx/${aId}`)
      if (res.code !== 200) {
        this.$message.error('删除权限失败！！！')
      }

    //   刷新列表
      this.getRolesList()
      role.children = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 8px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
