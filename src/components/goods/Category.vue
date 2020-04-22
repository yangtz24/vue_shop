<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
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
          <el-button type="primary" @click="showAddCategoryDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <tree-table
        class="treeTable"
        :data="categoryList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.deleted == 0"></i>
          <i class="el-icon-error" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.level === 0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.level === 1">二级</el-tag>
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeCate(scope.row.id)"
          ></el-button>
          <!-- <el-button type="primary" icon="el-icon-search" size="mini"></el-button> -->
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCategoryDialogVisible"
      width="50%"
      @close="categoryDialogClosed"
    >
      <el-form
        ref="addCategoryRef"
        :model="addCategoryForm"
        :rules="addCategoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="addCategoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类等级：">
          <!-- options: 指定数据源 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCategoryList"
            :props="cascaderProps"
            @change="parentCategoryChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategory">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑分类的对话框 -->
    <el-dialog
      title="编辑分类"
      :visible.sync="editCategoryDialogVisible"
      width="50%"
      @close="editCategoryDialogClosed"
    >
      <el-form
        ref="editCategoryRef"
        :model="editCategoryForm"
        :rules="editCategoryRules"
        label-width="100px"
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input v-model="editCategoryForm.name"></el-input>
        </el-form-item>
        <el-form-item label="分类等级：">
          <!-- options: 指定数据源 -->
          <el-cascader
            v-model="selectKeys"
            :options="parentCategoryList"
            :props="cascaderProps"
            @change="parentCategoryChange"
            clearable
            change-on-select
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCategory">确 定</el-button>
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
      // 参数
      queryInfo: {
        key: '',
        currentPage: 1,
        pageSize: 10
      },
      total: 0,
      // 商品分类数据列表
      categoryList: [],
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'name'
        },
        {
          label: '是否有效',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'isok'
        },
        {
          label: '排序',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCategoryDialogVisible: false,
      // 添加分类的表单数据对象
      addCategoryForm: {
        name: '',
        // 父级分类
        parentId: 0,
        // 分类等级
        level: 0
      },
      // 验证规则对象
      addCategoryRules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      editCategoryDialogVisible: false,
      editCategoryForm: {
        name: '',
        // 父级分类
        parentId: 0,
        // 分类等级
        level: 0
      },
      // 验证规则对象
      editCategoryRules: {
        name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          }
        ]
      },
      // 父级分类列表
      parentCategoryList: [],
      // 指定级联选择器的配置对象
      cascaderProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      // 选中的父级分类ID
      selectKeys: []
    }
  },
  methods: {
    // 获取商品分类列表
    async getCategoryList() {
      const { data: res } = await this.$http.get('rest/goods/category', {
        params: this.queryInfo
      })
      if (res.code !== 200) {
        return this.$message.error('获取商品分类列表失败！！！')
      }

      this.categoryList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newSize) {
      this.queryInfo.pageSize = newSize
      this.getCategoryList()
    },
    // 监听 pageNumber
    handleCurrentChange(newPageNumber) {
      this.queryInfo.currentPage = newPageNumber
      this.getCategoryList()
    },
    // 显示添加对话框
    showAddCategoryDialog() {
      // 获取分类列表
      this.getParentCategoryList()
      this.addCategoryDialogVisible = true
    },
    // 获取父级分类列表
    async getParentCategoryList() {
      const { data: res } = await this.$http.get('rest/goods/category/parent')
      if (res.code !== 200) {
        return this.$message.error('获取父级分类列表失败！！！')
      }

      this.parentCategoryList = this.getTreeData(res.data)
    },
    // 解决出现空面板情况
    getTreeData(data) {
      data.forEach(element => {
        if (element.children.length < 1) {
          // children若为空数组，则将children设为 null
          element.children = null
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(element.children)
        }
      })
      return data
    },
    // 选择项变化触发改变事件
    parentCategoryChange() {
      if (this.selectKeys.length > 0) {
        this.addCategoryForm.parentId = this.selectKeys[
          this.selectKeys.length - 1
        ]

        // 选中赋值
        this.addCategoryForm.level = this.selectKeys.length
        return 0
      } else {
        this.addCategoryForm.parentId = 0
        this.addCategoryForm.level = 0
      }
    },
    // 添加分类事件
    addCategory() {
      this.$refs.addCategoryRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'rest/goods/category',
          this.addCategoryForm
        )
        if (res.code !== 200) {
          return this.$message.error('添加分类失败！！！')
        }
        this.$message.success('添加分类成功！！！')
        this.getCategoryList()
        this.addCategoryDialogVisible = false
      })
    },
    // 关闭对话框事件
    categoryDialogClosed() {
      this.$refs.addCategoryRef.resetFields()
      this.selectKeys = []
      this.addCategoryForm.level = 0
      this.addCategoryForm.parentId = 0
    },
    editCategoryDialogClosed() {
      this.$refs.editCategoryRef.resetFields()
      this.selectKeys = []
      this.editCategoryForm.level = 0
      this.editCategoryForm.parentId = 0
    },
    // 删除
    async removeCate(id) {
      const { data: res } = await this.$http.delete('rest/goods/category/' + id)
      if (res.code !== 200) {
        return this.$message.error('删除分类失败！！！')
      }
      this.$message.success('删除分类成功！！！')
      this.getCategoryList()
    },
    editCategory() {
      this.$refs.editCategoryRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(
          'rest/goods/category/' + this.editCategoryForm.id,
          this.editCategoryForm
        )
        if (res.code !== 200) {
          return this.$message.error('修改分类失败！！！')
        }
        this.$message.success('修改分类成功！！！')
        this.getCategoryList()
        this.editCategoryDialogVisible = false
      })
    },
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('rest/goods/category/' + id)
      if (res.code !== 200) {
          return this.$message.error('获取详情数据失败！！！')
        }

      // 查询成功，保存数据
      this.editCategoryForm = res.data
      this.getParentCategoryList()
      this.editCategoryDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}

.el-cascader {
  width: 100%;
}
</style>
