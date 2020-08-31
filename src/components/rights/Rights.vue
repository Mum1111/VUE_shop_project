<template>
  <div>
    <h3>权限列表</h3>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
   <el-table
    :data="rightsTable"
    border
    style="width: 90%">
    <el-table-column type="index" label="#" ></el-table-column>
    <el-table-column prop="authName" label="权限名称"></el-table-column>
    <el-table-column prop="path" label="路径"></el-table-column>
    <el-table-column prop="level" label="权限等级">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级权限</el-tag>
            <el-tag v-else-if="scope.row.level === '1'" type="success">二级权限</el-tag>
            <el-tag v-else type="warning">三级权限</el-tag>
        </template>
    </el-table-column>
   </el-table>
</el-card>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      rightsTable: []
    }
  },
  created () {
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      const { data: res } = await this.$http.get('rights/list')
      console.log(res)
      this.rightsTable = res.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
