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
            <el-form-item :label="item.name" v-for="item in onlyTableData" :key="item.id">
              <el-input v-model="item.values"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action: 上传图片的url -->
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.introduce"></quill-editor>

            <!-- 添加商品文本 -->
            <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt class="previewImage" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
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
        category: [],
        pics: [],
        introduce: '',
        attrs: []
      },
      // 输入框验证
      addFormRules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        category: [
          { required: true, message: '请输入商品分类', trigger: 'blur' }
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
      onlyTableData: [],
      // 上传的URL
      uploadURL: '',
      // 图片上传的请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      previewPath: '',
      previewVisible: false
    }
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('rest/goods/category/parent')
      if (res.code !== 200) {
        return this.$message.error('获取商品分类失败！！！')
      }

      this.cateList = this.getTreeData(res.data)
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
          `rest/attribute/${this.id}/attributes`,
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
          `rest/attribute/${this.id}/attributes`,
          {
            params: { type: 'only' }
          }
        )

        if (res.code !== 200) {
          return this.$message.error('获取动态参数数据失败！！！')
        }

        this.onlyTableData = res.data
      }
    },
    // 处理图片预览事件
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理移除图片的事件
    handleRemove(file) {
      // 获取删除图片的路径
      const filePath = file.response.data.tem_url
      // 从 pics中拿到图片索引值
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 调用数组的splice()方法，删除图片信息 1个
      this.addForm.pics.splice(i, 1)
    },
    // 监听图片上传成功
    handleSuccess(response) {
      // 获取图片信息
      const picInfo = { pic: response.data.tem_url }
      // 添加到pics中
      this.addForm.pics.push(picInfo)
    },
    addGoods() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项!')
        }
        // 添加商品请求业务逻辑
        // lodash 深拷贝
        const form = _.cloneDeep(this.addForm)
        this.addForm.category = form.join(',')

        // 处理动态参数
        this.manyTableData.forEach(element => {
          const newInfo = { id: element.id, values: element.values.join('') }
          this.addForm.attrs.push(newInfo)
        })
        //  静态属性
        this.onlyTableData.forEach(element => {
          const newInfo = { id: element.id, values: element.values }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs

        // 添加商品请求
        const { data: res } = await this.$http.post('rest/goods', form)
        if (res.code !== 200) {
          return this.$message.error('添加商品失败！！！')
        }
        this.$message.error('添加商品成功！！！')
        this.$router.push('/goods')
      })
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

.previewImage {
  width: 100%;
}

.btnAdd {
  margin-top: 15px;
}
</style>
