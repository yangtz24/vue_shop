<template>
  <div class="login_container">
    <el-card>
      <div class="login_box">
        <!-- 头像区域 -->
        <div class="avatar_box">
          <img src="../assets/logo.png" alt />
        </div>
        <!-- 登录表单区域 -->
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginRules"
          label-width="0px"
          class="login_form"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item>
            <el-input
              v-model="loginForm.password"
              prefix-icon="iconfont icon-3702mima"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮区域 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
            <el-button type="primary" @click.native.prevent="handleTry">获取体验账号</el-button>
            <!-- <a href="">去注册</a> -->
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-dialog
      title="公众号二维码"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%"
    >
      <div style="text-align: center">
        <span class="font-title-large">
          <span class="color-main font-extra-large">关注公众号</span>回复
          <span class="color-main font-extra-large">体验</span>获取体验账号
        </span>
        <br />
        <img src="../assets/imgs/kb.jpg" width="160" height="160" style="margin-top: 10px" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单数据绑定
      loginForm: {
        username: 'basketboy',
        password: '123'
      },
      // form表单验证规则对象
      loginRules: {
        // 验证用户名是否合法
        username: [
          { required: true, message: '请输入登录名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        //  验证密码是否合法
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      supportDialogVisible: false
    }
  },
  methods: {
    // 添加重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          '/rest/admin/login',
          this.loginForm
        )
        if (res.code !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // console.log(res);
        // 登录成功后，token保存在客户端sessionStorage中
        window.sessionStorage.setItem('token', res.data.token)
        // 跳转地址，主页
        this.$router.push('/home')
      })
    },
    handleTry() {
      this.dialogVisible = true
    },
    dialogConfirm() {
      this.dialogVisible = false
      //   setSupport(true)
    },
    dialogCancel() {
      this.dialogVisible = false
      //   setSupport(false)
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: white;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #ffffff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

.btns {
  display: flex;
  justify-content: center;
}
</style>
