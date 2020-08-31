<template>
  <div>
    <h3>角色列表</h3>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
   <el-card >
       <el-row>
           <el-col>
               <el-button type="primary">添加角色</el-button>
           </el-col>
       </el-row>
       <el-table border stripe :data="rolesList">
           <el-table-column type="expand">
               <template slot-scope="scope">
                   <!-- 渲染1级权限 -->
                    <el-row :class="['bgbottom',index1===0?'bgtop':'','vcenter']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
                        <el-col :span="5">
                            <el-tag closable>
                                {{item1.authName}}
                            </el-tag>
                            <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 渲染二，三级权限 -->
                        <el-col :span="19">
                            <el-row :class="['vcenter',index2===0?'bgtop':'','bgbottom']" v-for="(item2,index2) in item1.children" :key="item2.id" >
                                <el-col :span="6">
                                    <el-tag type="warning" closable>
                                        {{item2.authName}}
                                    </el-tag>
                                    <i class="el-icon-caret-right"></i>
                                </el-col>
                                <el-col :span="18">
                                    <el-tag type="danger" v-for="(item3) in item2.children" :key="item3.id" closable>
                                        {{item3.authName}}
                                    </el-tag>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
               </template>
           </el-table-column>
           <el-table-column type="index" label="#" ></el-table-column>
            <el-table-column prop="roleName" label="权限名称"></el-table-column>
            <el-table-column prop="roleDesc" label="权限描述"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope>
                    <el-button type="primary" icon="el-icon-edit" circle></el-button>
                    <el-button type="danger" icon="el-icon-delete" circle></el-button>
                    <el-button type="warning" icon="el-icon-setting" circle></el-button>
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
      rolesList: []
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.rolesList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bgbottom{
    border-bottom: 1px solid #ccc;
}
.bgtop{
    border-top: 1px solid #ccc;
}
.vcenter{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
