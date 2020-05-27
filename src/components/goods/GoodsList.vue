<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">商品管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            class="input-with-select"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table :data="goodsList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="price" width="110px"></el-table-column>
        <el-table-column label="商品重量(kg)" prop="weight" width="120px"></el-table-column>
        <el-table-column label="商品库存" prop="amount" width="100px"></el-table-column>
        <!-- <el-table-column label="商品" prop="introduce" width="80px"></el-table-column> -->
        <el-table-column label="商品热卖数量" prop="hotNumber" width="120px"></el-table-column>
        <el-table-column label="是否促销" prop="isPromote" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" width="180px">
          <template slot-scope="scope">{{scope.row.createTime | dataFormate}}</template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="remove(scope.row.id)"
            ></el-button>
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
    this.getGoodsList()
  },
  data() {
    return {
      // 查询参数
      queryInfo: {
        query: '',
        pageNumber: 1,
        pageSize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('rest/goods', {
        params: this.queryInfo
      })
      if (res.code !== 200) return this.$message.error('获取商品列表失败！')

      // 用户列表数据
      this.goodsList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getGoodsList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNumber = newPageNum
      this.getGoodsList()
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

      const { data: res } = await this.$http.delete(`rest/goods/remove/${id}`)
      if (res.code !== 200) {
        this.$message.error('删除商品失败！！！')
      }

      this.$message.success('删除商品成功！！！')
      //  刷新列表
      this.getGoodsList()
    },
    addGoodsPage() {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style lang="less" scoped>
</style>
