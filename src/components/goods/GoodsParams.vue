<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon></el-alert>
      <el-row>
        <el-col>
          <span>选择商品分类：</span>

          <el-cascader
            v-model="selctedCateKeys"
            :options="cateList"
            :props="{
                        expandTrigger: 'hover' ,
                        value:'cat_id',
                        label:'cat_name',
                        children:'children'
                    }"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isButtondisabled" @click="showAddDialogVisible">添加参数</el-button>
          <el-table :data="manyTableData" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showeditDialogVisible(scope.row.attr_id)"></el-button>
            <!-- 删除用户信息 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeParams(scope.row.attr_id)"></el-button>
          </template>
        </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数 -->
        <el-tab-pane label="静态参数" name="only">
            <el-button type="primary" size="mini" :disabled="isButtondisabled">添加参数</el-button>
          <el-table :data="onlyTableData" border style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="180px">
            <template slot-scope="">
            <!-- 修改用户信息 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showeditDialogVisible((scope.row.attr_id))"></el-button>
            <!-- 删除用户信息 -->
            <el-button type="danger" icon="el-icon-delete" circle ></el-button>
          </template>
        </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数 -->
<el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed">
  <!-- 添加表单 -->
  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="addForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addParams">确 定</el-button>
  </span>
</el-dialog>

<!-- 编辑参数 -->
<el-dialog :title="'编辑'+titleText" :visible.sync="editDialogVisible" width="50%" @close="editDialogClosed">
  <!-- 编辑表单 -->
  <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
    <el-form-item :label="titleText" prop="attr_name">
      <el-input v-model="editForm.attr_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editParams">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      cateList: [],
      selctedCateKeys: [],
      activeName: 'many',
      manyTableData: [],
      onlyTableData: [],
      addDialogVisible: false,
      // 添加参数的表单数据对象
      addForm: {
        attr_name: ''
      },

      // 添加表单验证规则
      addFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      },
      // 编辑参数区域
      editDialogVisible: false,
      // 编辑参数的表单数据对象
      editForm: {
        attr_name: ''
      },

      // 编辑表单验证规则
      editFormRules: {
        attr_name: [{ required: true, message: '请输入名称', trigger: 'blur' }]
      }

    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      this.cateList = res.data
      // console.log(this.cateList)
    },
    async handleChange () {
      // console.log(this.selctedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (this.activeName === 'many') {
        this.manyTableData = res.data
      } else {
        this.onlyTableData = res.data
      }

      console.log(res)
    },
    handleTabsClick () {
      // console.log(11)
      this.handleChange()
    },

    // 添加参数操作
    showAddDialogVisible () {
      this.addDialogVisible = true
    },
    addDialogClosed () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击确定 提交数据
    addParams () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, { attr_name: this.addForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 201) return this.$message.error('添加' + this.titleText + '失败')
        this.$message.success('添加' + this.titleText + '成功')
        this.addDialogVisible = false
        this.getCateList()
      })
    },
    async showeditDialogVisible (id) {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${id}`, {
        params: {
          attr_sel: this.activeName
        }
      })
      // console.log(res)
      this.editForm = res.data
      this.editDialogVisible = true
    },
    editDialogClosed () {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确定 提交数据
    editParams () {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, { attr_name: this.editForm.attr_name, attr_sel: this.activeName })
        console.log(res)
        if (res.meta.status !== 200) return this.$message.error('编辑' + this.titleText + '失败')
        this.$message.success('编辑' + this.titleText + '成功')
        this.editDialogVisible = false
        this.handleChange()
      })
    },
    // 移除参数
    async removeParams (id) {
      const confirmResult = await this.$confirm('确认删除吗', '提示框', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${id}`)
      if (res.meta.status !== 200) return this.$message.error('删除参数数据失败')
      this.$message.success('删除参数成功')
      this.handleChange()
    }
  },
  computed: {
    isButtondisabled () {
      return this.selctedCateKeys.length !== 3
    },
    cateId () {
      if (this.selctedCateKeys.length === 3) {
        return this.selctedCateKeys[this.selctedCateKeys.length - 1]
      }
      return null
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态属性'
      } else {
        return '静态参数'
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
