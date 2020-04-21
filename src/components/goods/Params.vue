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
          <el-cascader
            expand-trigger="hover"
            v-model="selectedCateKeys"
            :options="categoryList"
            :props="cateProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab 页签区域 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <!-- 动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加参数</el-button>
          <!-- 动态参数数据表格 -->
          <el-table :data="manyTableData" border stripe>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag v-for="(item, i) in scope.row.attrVals" :key="i" closable>{{item}}</el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <!-- 添加按钮 -->
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.id)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attrId)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isBtnDisabled"
            @click="addDialogVisible=true"
          >添加属性</el-button>
          <!-- 静态属性数据表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand"></el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attrId)"
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attrId)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 添加参数对话框 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="addForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 添加参数对话框 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
        <el-form-item :label="titleText" prop="name">
          <el-input v-model="editForm.name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getCategoryList()
  },
  data() {
    return {
      // 商品分类列表
      categoryList: [],
      // 级联选择框配置对象
      cateProps: {
        value: 'id',
        lable: 'name',
        children: 'children'
      },
      // 选择的数据
      selectedCateKeys: [],
      // tab 被激活的页签名称
      activeName: 'many',
      // 动态参数数据
      manyTableData: [],
      // 静态属性数据
      onlyTableData: [],
      // 提那家对话框隐藏于显示
      addDialogVisible: false,
      // 表单参数收集对象
      addForm: {
        name: ''
      },
      // 表单验证规则
      addFormRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 修改对话框显示隐藏
      editDialogVisible: false,
      // 修改变淡数据对象
      editForm: {},
      // 修改表单验证规则
      editFormRules: {
        name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 控制按钮与文本框切换
      inputVisible: false,
      // 文本框输入的内容
      inputValue: ''
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoryList() {
      const { data: res } = await this.$http.get('rest/goods/category/all')
      if (res.code !== 200) {
        return this.$message.error('获取商品全部分类失败！！！')
      }

      this.categoryList = res.data
    },
    // 监听选择项的变化
    handleChange() {
      this.getParamsData()
    },
    // tab点击事件
    handleTabClick() {
      this.getParamsData()
    },
    // 获取参数列表
    async getParamsData() {
      if (this.selectedCateKeys.length !== 3) {
        this.selectedCateKeys = []
        return 0
      }

      // 根据所选分类ID，获取参数
      const { data: res } = await this.$http.get(
        `rest/goods/category/${this.id}/attributes`,
        {
          params: { sel: this.activeName }
        }
      )
      if (res.code !== 200) {
        return this.$message.error('获取商品参数列表失败！！！')
      }

      res.data.forEach(element => {
        element.attrVals = element.attrVals ? element.attrVals.split('') : []
        // 控制文本框显示与隐藏
        element.inputVisible = false
        // 文本框输入的内容
        element.inputValue = ''
      })

      // 挂载数据
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }
    },
    // 对话框关闭
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 提交表单
    addParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.post(
          `rest/goods/category/${this.id}/attributes`,
          {
            name: this.addForm.name,
            sel: this.activeName
          }
        )
      })

      if (res.code !== 200) {
        return this.$message.error('添加参数失败！！！')
      }

      this.$message.success('添加参数成功！！！')
      this.addDialogVisible = false
      this.getParamsData()
    },
    // 编辑
    async showEditDialog(attrId) {
      // 查询当前参数的信息
      const { data: res } = await this.$$http.get(
        `rest/goods/category/${this.cateId}/a: ttributes/${attrId}`,
        {
          params: { sel: this.activeName }
        }
      )

      if (res.code !== 200) {
        return this.$message.error('获取商品参数信息失败！！！')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 重置修改的表单
    editDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 修改
    editParams() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return

        const { data: res } = await this.$http.put(
          `rest/goods/category/${this.cateId}/attributes/${this.editForm.attrId}`,
          {
            name: this.addForm.name,
            sel: this.activeName
          }
        )
      })

      if (res.code !== 200) {
        return this.$message.error('修改参数失败！！！')
      }

      this.$message.success('修改参数成功！！！')
      this.addDialogVisible = false
      this.getParamsData()
    },
    // 删除
    async removeParams() {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消该操作')
      }

      // 删除请求
      const { data: res } = await this.$http.delete(
        `rest/goods/category/${this.cateId}/attributes/${attrId}`
      )
      if (res.code !== 200) {
        return this.$message.error('删除参数失败！！！')
      }

      this.$message.success('删除参数成功！！！')
      this.getParamsData()
    },
    // 文本框失去焦点
    handleInputConfirm() {},
    // 文本输入框
    showInput(row) {
      row.inputVisible = true
    }
  },
  // 计算属性
  computed: {
    // 如果按钮被禁用 返回true 否则 返回false
    isBtnDisabled() {
      if (this.selectedCateKeys.length !== 3) {
        return true
      }
      return false
    },
    // 获取选中三级分类的ID
    cateId() {
      if (this.selectedCateKeys.length === 3) {
        return this.selectedCateKeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      } else {
        return '静态属性'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>
