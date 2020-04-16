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
          <i class="el-icon-success" v-if="scope.row.deleted === false"></i>
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
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-delete" size="mini"></el-button>
          <el-button type="primary" icon="el-icon-search" size="mini">搜索</el-button>
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
    <el-dialog title="添加分类" :visible.sync="addCategoryDialogVisible" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCategoryDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCategoryDialogVisible = false">确 定</el-button>
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
      addCategoryDialogVisible: false
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
      this.addCategoryDialogVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
</style>
