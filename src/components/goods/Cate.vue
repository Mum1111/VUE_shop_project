<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table
        :data="goodsCate"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
      >
        <!-- 是否有效区域， 设置对应的模板列： slot="isok"(与columns中设置的template一致) -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color:lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag size="mini" type="success" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope>
          <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
<el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"  @close="addCateDialogClosed">
  <!-- 添加分类表单 -->
  <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRuleForm" label-width="100px">
    <el-form-item label="分类名称" prop="cat_name">
      <el-input v-model="addCateForm.cat_name"></el-input>
    </el-form-item>
    <el-form-item label="父级分类" prop="cat_pid">
        <!-- expandTrigger='hover'(鼠标悬停触发级联) v-model(设置级联菜单绑定数据) :options(指定级联菜单数据源)  :props(用来配置数据显示的规则) clearable(提供“X”号完成删除文本功能) change-on-select(是否可以选中任意一级的菜单) -->
  <el-cascader expandTrigger='hover' v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable change-on-select></el-cascader>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="addCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addCate">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
export default {
  props: [],
  data () {
    return {
      goodsCate: [],
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      total: 0,
      columns: [
        { label: '分类名称', prop: 'cat_name' },
        // type:'template'(将该列设置为模板列)，template:'isok'(设置该列模板的名称为isok)
        { label: '是否有效', prop: '', type: 'template', template: 'isok' },
        { label: '排序', prop: '', type: 'template', template: 'order' },
        { label: '操作', prop: '', type: 'template', template: 'opt' }
      ],
      // 用来显示或隐藏添加分类对话框
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 分类名称
        cat_name: '',
        // 添加分类的父级id，0则表示父级为0.添加一级分类
        cat_pid: 0,
        // 添加分类的等级，0则表示添加一级分类
        cat_level: 0
      },
      // 添加分类校验规则
      addCateFormRules: {
        // 验证规则
        cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
      },
      // 保存1,2级父级分类的列表
      parentCateList: [],
      // 配置级联菜单中数据如何展示
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 绑定用户选择的分类值
      selectedKeys: []
    }
  },
  created () {
    this.getGoodsCate()
  },
  methods: {
    async getGoodsCate () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.$message.success(res.meta.msg)
      this.goodsCate = res.data.result
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange (newSize) {
    // 当pagesize发生改变时触发
      this.queryInfo.pagesize = newSize
      this.getGoodsCate()
    },
    handleCurrentChange (newPage) {
    // 当pagenum发生改变时触发
      this.queryInfo.pagenum = newPage
      this.getGoodsCate()
    },
    showAddCateDialog () {
      // 调用getParentCateList获取分类列表
      this.getParentCateList()
      // 显示添加分类对话框
      this.addCateDialogVisible = true
    },
    addCateDialogClosed () {
      // 当关闭添加分类对话框时，重置表单
      this.$refs.addCateFormRuleForm.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    addCate () {
      // 点击确定，完成添加分类
      this.$refs.addCateFormRuleForm.validate(async valid => {
        if (!valid) return
        // 发送请求完成添加分类
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')
        this.getGoodsCate()
        this.addCateDialogVisible = false
      })
    },

    async getParentCateList () {
      // 获取父级分类数据列表
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表数据失败')
      }
      this.parentCateList = res.data
    },
    parentCateChange () {
    // 级联菜单中选择项发生变化时触发
      console.log(this.selectedKeys)
      // 如果用户选择了父级分类
      if (this.selectedKeys.length > 0) {
      // 则将数组中的最后一项设置为父级分类
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // level也要跟着发生变化
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
