<template>
  <div>
    <!-- 面包区域导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>
        <a href="/">订单管理</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col :span="10">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单列表 -->
      <el-table :data="orderList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="orderNumber"></el-table-column>
        <el-table-column label="订单价格(元)" prop="orderPrice"></el-table-column>
        <el-table-column label="是否付款" prop="payStatus">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payStatus === 1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="isSend">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.isSend === 1">已发货</el-tag>
          <el-tag type="danger" v-else>未发货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="createTime" width="180px">
          <template slot-scope="scope">{{scope.row.createTime | dataFormate}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showBox"></el-button>
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showLocationBtn(scope.row.id)"
            ></el-button>
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

    <!-- 修改订单地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressHandleClose">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address">
          <el-cascader :options="cityData" v-model="addressForm.address"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流进度 -->
    <el-dialog
      title="物流进度"
      :visible.sync="locationVisible"
      width="50%"
      @close="locationHandleClose"
    >
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in locationInfo"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  created() {
    this.getOrderList()
  },
  data() {
    return {
      queryInfo: {
        pageNumber: 1,
        pageSize: 10,
        query: ''
      },
      orderList: [],
      total: 0,
      addressVisible: false,
      addressForm: {
        address: [],
        address2: ''
      },
      addressFormRules: {
        address: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        address2: [
          { required: true, message: '请输入详细地址信息', trigger: 'blur' }
        ]
      },
      cityData,
      locationVisible: false,
      locationInfo: []
    }
  },
  methods: {
    async getOrderList() {
      const { data: res } = await this.$http.get('rest/order', {
        params: this.queryInfo
      })
      if (res.code !== 200) return this.$message.error('获取订单列表失败！')

      // 订单列表数据
      this.orderList = res.data.content
      // 列表总数
      this.total = res.data.totalElements
    },
    // 监听 pageSize
    handleSizeChange(newPageSize) {
      this.queryInfo.pageSize = newPageSize
      this.getOrderList()
    },
    // 监听 页码 值变化
    handleCurrentChange(newPageNum) {
      this.queryInfo.pageNumber = newPageNum
      this.getOrderList()
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true
    },
    addressHandleClose() {
      this.$refs.addressFormRef.resetFields()
    },
    async showLocationBtn() {
      const { data: res } = await this.$http.get('rest/wuliiu/oid')
      if (res.code !== 200) return this.$message.error('获取物流信息失败！')

      this.locationInfo = res.data
      this.locationVisible = true
    },
    locationHandleClose() {}
  }
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
.el-cascader {
  width: 100%;
}
</style>
