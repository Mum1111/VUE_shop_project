<template>
  <div>
    <h3>用户列表组件</h3>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="username" label="姓名"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column prop="role_name" label="角色"></el-table-column>
      <el-table-column prop="mg_state" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope>
          <el-button type="primary" icon="el-icon-edit" circle></el-button>
          <el-button type="danger" icon="el-icon-delete" circle></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
            <el-button type="warning" icon="el-icon-star-off" circle></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
     </el-card>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      tableData: [],
      total: 0
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      this.tableData = res.data.users
      this.total = res.data.total
      // console.log(this.total)
      // console.log(this.tableData)
    },
    handleSizeChange (size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    handleCurrentChange (num) {
      this.queryInfo.pagenum = num
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
