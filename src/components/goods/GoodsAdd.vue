<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
      <!-- 进度条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- tab标签 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClickTab"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="price">
              <el-input v-model="addForm.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="weight">
              <el-input v-model="addForm.weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="amount">
              <el-input v-model="addForm.amount" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="category">
              <el-cascader
                expand-trigger="hover"
                v-model="addForm.category"
                :options="cateList"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item :label="item.name" v-for="item in manyTableData" :key="item.id">
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.values">
                <el-checkbox :label="cb" v-for="(cb, i) in item.values" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item label=""></el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCateList()
  },
  data() {
    return {
      activeIndex: '0',
      //   添加商品
      addForm: {
        name: '',
        price: 0,
        weight: 0,
        amount: 0,
        // 商品所属分类数组
        category: []
      },
      // 输入框验证
      addFormRules: {
        name: [
          { requried: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        price: [{ requried: true, message: '请输入商品价格', trigger: 'blur' }],
        weight: [
          { requried: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        amount: [
          { requried: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        category: [
          { requried: true, message: '请输入商品分类', trigger: 'blur' }
        ]
      },
      cateList: [],
      cateProps: {
        label: 'name',
        value: 'id',
        children: 'children'
      },
      // 动态参数列表
      manyTableData: [],
      // 静态属性列表
      onlyTableData: []
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('rest/goods/category/all')
      if (res.code !== 200) {
        return this.$message.error('获取商品分类失败！！！')
      }

      this.cateList = res.data
    },
    handleChange() {
      if (this.addForm.category.length === 1) {
        this.addForm.category = []
      }
    },
    beforeLeaveTab(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.category.length === 1) {
        this.$message.error('请选择商品分类信息！！！')
        return false
      }
    },
    async tabClickTab() {
      // 访问的是动态参数面板
      if (this.activeIndex === '1') {
        // 根据分类ID
        const { data: res } = await this.$http.get(
          `rest/goods/category/${this.cateId}/attributes`,
          {
            params: { type: 'many' }
          }
        )
        if (res.code !== 200) {
          return this.$message.error('获取动态参数数据失败！！！')
        }

        res.data.forEach(element => {
          element.values =
            element.vals.length === 0 ? [] : element.vals.split('')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        // 根据分类ID
        const { data: res } = await this.$http.get(
          `rest/goods/category/${this.cateId}/attributes`,
          {
            params: { type: 'only' }
          }
        )

        if (res.code !== 200) {
          return this.$message.error('获取动态参数数据失败！！！')
        }

        this.onlyTableData = res.data
      }
    }
  },
  computed: {
    cateId() {
      if (this.addForm.category.length === 3) {
        return this.addForm.category[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
