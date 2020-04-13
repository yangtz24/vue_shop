<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
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
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
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
        <!-- <el-table-column label="创建时间" prop="createTime"></!-->
        -->
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            <!-- scope 作用域插槽  scope.row获取行数据 -->
            <el-switch v-model="scope.row.state" @change="statusChanged(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
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

    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
      <!-- 内容主体 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserList()
  },
  data() {
    // 自定义验证规则
    // 验证邮箱
    var validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请正确填写邮箱'))
      } else {
        // 正则表达式
        const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/

        if (!regEmail.test(value)) {
          callback(new Error('请输入有效的邮箱'))
        }
        // 合法的邮箱
        callback()
      }
    }
    // 验证手机号
    var validateMobilePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'))
      } else {
        if (value !== '') {
          var reg = /^1[3456789]\d{9}$/
          if (!reg.test(value)) {
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }
    return {
      // 获取用户列表
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 10
      },
      userList: [],
      total: 0,
      // 控制添加用户的对话框
      addDialogVisible: false,
      // 添加用户
      addForm: {
        username: '',
        password: '',
        nickName: '',
        email: '',
        mobile: ''
      },
      // 添加表单验证
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' },
          {
            min: 6,
            max: 8,
            message: '密码长度在6到8个字符之间',
            trigger: 'blur'
          }
        ],
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户昵称长度在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: validateMobilePhone,
            trigger: 'blur'
          }
        ]
      },
      // 控制修改用户对话框
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {
        username: '',
        nickName: '',
        email: '',
        mobile: ''
      },
      // 修改表单验证规则
      editFormRules: {
        nickName: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户昵称长度在3到10个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱号', trigger: 'blur' },
          {
            validator: validateEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: validateMobilePhone,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('rest/admin/page', {
        params: this.queryInfo
      })
      if (res.code !== 200) return this.$message.error('获取用户列表失败！')
      // 用户列表数据
      console.log(res.data.content)
      this.userList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getUserList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNumber = newPageNum
      this.getUserList()
    },
    // 监听 开关状态改变
    async statusChanged(userInfo) {
      if (!userInfo.state) {
        userInfo.status = 0
      } else {
        userInfo.status = 1
      }
      const { data: res } = await this.$http.put(
        `rest/admin/${userInfo.id}/status/${userInfo.status}`
      )
      if (res.code !== 200) {
        userInfo.state = !userInfo.state
        return this.$message.error('状态更新失败！！！')
      }
      return this.$message.success('状态更新成功！！！')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加用户并进行预验证
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        // 发起添加用户请求
        const { data: res } = await this.$http.post('rest/admin', this.addForm)
        if (res.code !== 200) {
          this.$message.error('添加用户失败！！！')
        }
        this.$message.success('添加用户成功！！！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 刷新列表
        this.getUserList()
        console.log(valid)
      })
    },
    // 编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('rest/admin/' + id)
      if (res.code !== 200) {
        this.$message.error('查询用户失败！！！')
      }

      // 查询成功，保存数据
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        // 发起修改用户信息请求
        const { data: res } = await this.$http.put(
          'rest/admin/modify/' + this.editForm.id,
          this.editForm
        )

        if (res.code !== 200) return this.$message.error('更新失败！！！')
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新列表
        this.getUserList()
        // 提示操作成功按钮
        this.$message.success('更新用户信息成功！！！')
      })
    },
    // 删除用户
    async removeUser(id) {
      const result = await this.$confirm('永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      // 如果用户确认删除，则返回字符串  confirm
      // 如果用户取消删除，则返回字符串  cancle
      if (result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发起删除请求
      const { data: res } = await this.$http.delete('rest/admin/remove/' + id)

      if (res.code !== 200) {
        return this.$message.error('删除用户失败!')
      }
      // 操作成功
      this.$message.success('删除用户成功')
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
