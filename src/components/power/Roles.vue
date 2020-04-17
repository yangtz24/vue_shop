<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
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

      <!-- 角色列表区域 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, i1) in scope.row.permissionList"
              :key="item1.id"
            >
              <!-- 渲染一级权限信息 -->
              <el-col :span="5">
                <el-tag closable @close="remove(scope.row, item1.id)">{{item1.name}}</el-tag>
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
                    <el-tag
                      type="success"
                      closable
                      @close="remove(scope.row, item2.id)"
                    >{{item2.name}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3) in item2.children"
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
        <el-table-column label="角色名称" prop="name"></el-table-column>
        <el-table-column label="角色描述" prop="description"></el-table-column>
        <el-table-column label="角色数量" prop="adminCount"></el-table-column>
        <el-table-column label="创建时间" prop="createTimeStr"></el-table-column>
        <el-table-column label="状态" prop="description">
          <template slot-scope="scope">
            <!-- scope 作用域插槽  scope.row获取行数据 -->
            <el-switch v-model="scope.row.state" @change="statusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="remove(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="assignPermissionDialog(scope.row)"
                size="mini"
              ></el-button>
            </el-tooltip>
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

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignPermissionDialogVisible"
      width="50%"
      @close="assignPermissionDialogVisibleClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="assignPermissionList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotPermissions">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesList()
  },
  data() {
    return {
      // 获取角色列表
      queryInfo: {
        key: '',
        currentPage: 1,
        pageSize: 10
      },
      rolesList: [],
      total: 0,
      // 控制分配权限对话框的显示与隐藏
      assignPermissionDialogVisible: false,
      // 所有权限数据
      assignPermissionList: [],
      // 树形控件绑定对象
      treeProps: {
        label: 'name',
        children: 'children'
      },
      // 默认选中的数据
      defaultKeys: [1, 8],
      // 分配权限的ID
      roleId: ''
    }
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('rest/role', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        this.$message.error('获取权限列表失败！！！')
      }

      this.rolesList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getRolesList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNumber = newPageNum
      this.getRolesList()
    },
    // 监听 开关状态改变
    async statusChanged(roleInfo) {
      if (!roleInfo.state) {
        roleInfo.status = 0
      } else {
        roleInfo.status = 1
      }
      const { data: res } = await this.$http.put(
        `rest/role/${roleInfo.id}/status/${roleInfo.status}`
      )
      if (res.code !== 200) {
        roleInfo.state = !roleInfo.state
        return this.$message.error('状态更新失败！！！')
      }
      return this.$message.success('状态更新成功！！！')
    },

    async remove(id) {
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

      const { data: res } = await this.$http.delete('rest/role/remove/' + id)
      if (res.code !== 200) {
        this.$message.error('删除权限失败！！！')
      }

      //  刷新列表
      // this.getRolesList()
      this.children = res.data
    },

    // 分配权限对话框
    async assignPermissionDialog(role) {
      this.roleId = role.id
      // 获取权限列表  树状结构
      const { data: res } = await this.$http.get('rest/role/' + role.id + '/permissions')
       if (res.code !== 200) {
        return this.$message.error('获取权限失败！！！')
      }
      console.log(res.data)

      this.assignPermissionList = res.data
      this.assignPermissionDialogVisible = true

      // 递归获取三级节点的ID
      this.getLeafKeys(role, this.defaultKeys)
    },
    // 通过递归的方式，获取角色下所有三级的权限的ID，并保存在 defaultKeys
    getLeafKeys(node, arr) {
      // 判断 node 是否为三级权限 children
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(element => {
        this.getLeafKeys(element, arr)
      })
    },
    // 关闭分配权限框 监听
    assignPermissionDialogVisibleClosed() {
      this.defaultKeys = []
    },
    // 分配权限
    async allotPermissions() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]

      const idStr = keys.join(',')

      const { data: res } = await this.$http.post('rest/role', { rids: idStr })
      if (res.code !== 200) {
        return this.$message.error('分配权限失败！！！')
      }
      this.$message.success('分配权限成功！！！')
      this.getRolesList()
      this.assignPermissionDialog = false
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
