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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="danger" closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                   <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
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
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag type="danger" closable v-for="(item,index) in scope.row.attr_vals" :key="index" @close="handleClose(index,scope.row)">{{item}}</el-tag>
                   <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope.row)"
                      @blur="handleInputConfirm(scope.row)"
                    >
                  </el-input>
                  <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button type="primary" icon="el-icon-edit" circle @click="showeditDialogVisible((scope.row.attr_id))"></el-button>
            <!-- 删除用户信息 -->
            <el-button type="danger" icon="el-icon-delete" circle @click="removeParams(scope.row.attr_id)"></el-button>
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
      // input框的显示和隐藏
      inputVisible: false,
      inputValue: '',
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
      // 修复了一个只选中2级菜单 就会报错的问题 **
      if (this.selctedCateKeys.length !== 3) {
        this.selctedCateKeys = []
        this.manyTableData = []
        this.onlyTableData = []
        return
      }
      // console.log(this.selctedCateKeys)
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
      if (this.activeName === 'many') {
        // 遍历循环res.data 让其中的attr_vals转换成数组 以便渲染到页面上
        res.data.forEach(item => {
          item.inputVisible = false
          item.inputValue = ''
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.manyTableData = res.data
        // console.log('many', this.manyTableData)
      } else {
        res.data.forEach(item => {
          item.inputVisible = false
          item.inputValue = ''
          item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        })
        this.onlyTableData = res.data
      }

      // console.log(res)
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
        // console.log(res)
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
        // console.log(res)
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
    },
    // 添加动态参数
    handleInputConfirm (row) {
      // 先判断用户输入的数据是否合法

      if (row.inputValue.trim().length !== 0) {
        row.attr_vals.push(row.inputValue.trim())
        row.inputValue = ''
        row.inputVisible = false
        console.log(row.inputValue)
        this.saveAttrVals(row)
      }

      // 解决了发送两次请求的问题****
      /* if (row.inputValue.trim().length !== 0) {
        row.inputValue = ''
        row.inputVisible = false

      } */

      // this.inputVisible = false
      // 如果用户输入了真实的数据 保存起来
    },

    // 召唤出输入框
    showInput (row) {
      console.log(row)
      // 这个显示只能在目标的焦点选中之前
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
        // this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 关闭tag框删除动态参数
    handleClose (index, row) {
      row.attr_vals.splice(index, 1)
      this.saveAttrVals(row)
    },

    // 封装一个保存可选项的操作的函数
    async saveAttrVals (row) {
      const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals: row.attr_vals.join(' ')
        })
      if (res.meta.status !== 200) return this.$message.error('修改失败')
      this.$message.success('修改成功')
      // this.handleChange()
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
.el-tag{
  margin-right: 20px;
}
.input-new-tag{
  width: 90px;
}
</style>
