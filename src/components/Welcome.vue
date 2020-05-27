<template>
  <div class="app-container">
    <div class="address-layout">
      <el-row :gutter="50">
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">后端项目</div>
            <div class="color-main address-content">
              <a href="https://github.com/yangtz24/shop_back">shop-back</a>
            </div>
          </div>
        </el-col>
        <el-col :span="24">
          <div class="out-border">
            <div class="layout-title">前端项目</div>
            <div class="color-main address-content">
              <a href="https://github.com/yangtz24/vue_shop">vue-shop-web</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<style lang="less" scoped>
.app-container {
    margin-top: 40px;
    margin-left: 120px;
    margin-right: 120px;
  }

  .address-layout {
  }

  .total-layout {
    margin-top: 20px;
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }

  .layout-title {
    text-align: center;
    color: #606266;
    padding: 15px 20px;
    background: #F2F6FC;
    font-weight: bold;
  }

  .address-content{
    text-align: center;
    padding: 20px;
    font-size: 18px
  }

  .out-border {
    border: 1px solid #DCDFE6;
  }
</style>
