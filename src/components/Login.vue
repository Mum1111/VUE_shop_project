<template>
    <div class="login_container">
        <div class="login_box">
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <el-form :model="loginForm" ref="LoginFormRef"  label-width="0px" class="login_from" :rules="rules">
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-icon-test" v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-mima" v-model="loginForm.password" show-password></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    // 重置表单
    resetForm () {
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      this.$refs.LoginFormRef.validate(async (vaild) => {
        // console.log(vaild)
        if (!vaild) return
        // const res = await this.$http.post('login', this.loginForm)
        const { data: res } = await this.$http.post('login', this.loginForm)
        // console.log(res)
        if (res.meta.status !== 200) return this.$message.error('登录失败' + res.meta.msg)
        this.$message.success('登录成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        .login_box{
            width: 450px;
            height: 300px;
            background-color: #fff;
            border-radius: 4px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%,-50%);
            .avatar_box{
                width: 130px;
                height: 130px;
                border: 1px solid #eee;
                // background-color: tomato;
                border-radius: 50%;
                overflow: hidden;
                padding: 10px;
                box-shadow: 0 0 10px #ddd;
                position: absolute;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: #fff;
                img{
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }
            .login_from{
                box-sizing: border-box;
                width: 100%;
                padding: 0 20px;
                position: absolute;
                bottom: 0;
            }

        }
        .btns{
            display: flex;
            justify-content: flex-end;
        }

    }
</style>
