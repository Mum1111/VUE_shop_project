<template>
    <div>
        <h3>添加商品</h3>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 消息提示 -->
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条 -->
            <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center >
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave"  @tab-click="tableClicked">
                    <!-- 基本信息页面 -->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                         <el-cascader
                            v-model="addForm.goods_cat"
                            :options="cateList"
                            :props="{
                                expandTrigger: 'hover',
                                value:'cat_id',
                                label:'cat_name',
                                children: 'children'
                             }"
                            @change="handleChange"></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 将动态参数渲染到页面上 -->
                        <!-- 渲染表单item项 -->
                        <el-form-item :label="item.attr_name" :key="item.attr_id" v-for="item in manyTableData">
                            <!-- 使用数组渲染复选框组 -->
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="val" v-for="(val,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :key="item.attr_id" v-for="item in onlyTableData" :label="item.attr_name">
                            <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        :action="uploadURL"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :headers="headerObj"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                         <quill-editor v-model="addForm.goods_introduce">
                        </quill-editor>
                        <!-- 添加商品按钮 -->
                        <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>
        <!-- 预览图片对话框 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
        <img :src="previewPath" class="previewImg" />
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
export default {
  props: [],
  data () {
    return {
      // 保存步骤条 激活项索引
      activeIndex: '0',
      addForm: {
        goods_name: '张三',
        goods_price: '1',
        goods_weight: '2',
        goods_number: '3',
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      //   保存分类数据
      cateList: [],
      manyTableData: [],
      onlyTableData: [],
      // 上传图片保存路径
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerObj: { Authorization: window.sessionStorage.getItem('token') },
      previewVisible: false,
      previewPath: '',
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res.data)
      this.cateList = res.data
    },
    handleChange () {
    // 判断选中的是不是3级分类 不是的话不能选中
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforeTabLeave (activeName, oldActiveName) {
      if (oldActiveName === '0') {
      // 在第一个标签页的时候
        if (this.addForm.goods_cat.length !== 3) {
          this.$message.error('请选择商品的分类')
          return false
        } else if (this.addForm.goods_name.trim() === '') {
          this.$message.error('请输入商品名称')
          return false
        } else if (this.addForm.goods_price.trim() === '0') {
          this.$message.error('请输入商品价格')
          return false
        } else if (this.addForm.goods_weight.trim() === '0') {
          this.$message.error('请输入商品重量')
          return false
        } else if (this.addForm.goods_number.trim() === '0') {
          this.$message.error('请输入商品数量')
          return false
        }
      }
    },
    async tableClicked () {
      // console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        // 获取动态参数列表
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'many'
          }
        })
        // console.log(res)
        // 对获取来的数据进行处理，将attr_vals转换成数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
        // console.log(this.manyTableData)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, {
          params: {
            sel: 'only'
          }
        })
        this.onlyTableData = res.data
      }
    },
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    handleRemove (file) {
      const filePath = file.response.data.tmp_path
      const index = this.addForm.pics.findIndex(item => item.pic === filePath)
      this.addForm.pics.splice(index, 1)
      //  console.log(111)
    },
    handleSuccess (file) {
      console.log(file)
      // 添加成功后 把路径存入到pic里面 以便发送添加商品请求
      this.addForm.pics.push({ pic: file.data.tmp_path })
      // console.log(222)
    },
    add () {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必填项')
        // 将addform 进行深拷贝 防止attr_cat转字符串之后对级联选择框造成影响
        const form = _.cloneDeep(this.addForm)
        // 将goods_cat转换成字符串
        form.goods_cat = form.goods_cat.join(',')
        // 对form中的attrs进行处理 把many和only都写入数组中
        this.manyTableData.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') })
        })
        this.onlyTableData.forEach(item => {
          form.attrs.push({ attr_id: item.attr_id, attr_value: item.attr_vals })
        })
        // console.log(form)
        // 数据处理完成之后发送添加商品请求
        const { data: res } = await this.$http.post('goods', form)
        // console.log(res)
        if (res.meta.status !== 201) return this.$message.error(res.meta.msg)
        this.$message.success(res.meta.msg)
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.previewImg{
    width: 300px;
}

</style>
