<template>
  <div>
    <h3>角色列表</h3>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table border stripe :data="rolesList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 渲染1级权限 -->
            <el-row
              :class="['bgbottom',index1===0?'bgtop':'','vcenter']"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二，三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="['vcenter',index2===0?'':'bgtop']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="warning" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="danger"
                      v-for="(item3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="removeRightById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="roleName" label="权限名称"></el-table-column>
        <el-table-column prop="roleDesc" label="权限描述"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" circle></el-button>
            <el-button type="danger" icon="el-icon-delete" circle></el-button>
            <!-- 分配权限按钮 -->
            <el-button type="warning" icon="el-icon-setting" circle @click="showSetRightDialog(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setRoleDialogVisible">
      <!--   权限树 -->
      <el-tree
        :data="rolesTreeList"
        show-checkbox
        node-key="id"
        :default-expand-all="true"
        :default-checked-keys="defKeys"
        :props="RoleTreeProps"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleDialogUpdate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      rolesList: [],
      setRoleDialogVisible: false,
      // 权限树的数据
      rolesTreeList: [],
      // 树模版对象
      RoleTreeProps: {
        label: 'authName',
        // 设置通过chiildren属性展示子节点信息
        children: 'children'
      },
      defKeys: [],
      roleid: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      this.rolesList = res.data
    },
    async removeRightById (row, id) {
      const confirm = await this.$confirm('确认删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch((err) => err)
      // console.log(confirm)
      if (confirm !== 'confirm') return this.$message.error('已经取消删除')
      const { data: res } = await this.$http.delete(
        `roles/${row.id}/rights/${id}`
      )
      // console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 不跳转渲染页面
      row.children = res.data
      this.$message.success(res.meta.msg)
    },
    // 点击显示dialog对话框
    async showSetRightDialog (row) {
      this.defKeys = []
      this.roleid = row.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.rolesTreeList = res.data
      this.getLeafKeys(row, this.defKeys)
      this.setRoleDialogVisible = true
    },
    // 递归保存选中的按钮
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    async setRoleDialogUpdate () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const strId = keys.join(',')
      console.log(strId)
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, {
        rids: strId
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.getRolesList()
      this.setRoleDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bgbottom {
  border-bottom: 1px solid #ccc;
}
.bgtop {
  border-top: 1px solid #ccc;
}
.vcenter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
