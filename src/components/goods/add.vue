<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域 -->
    <el-card>
      <!--提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!--步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!--tab栏标签区域 -->
      <el-form
        :model="addForm"
        :rules="addRules"
        ref="ruleForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          tab-position="left"
          v-model="activeIndex"
          :before-leave="beforeTablLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals" size="small">
                <el-checkbox
                  :label="attr_vals"
                  border
                  v-for="(attr_vals, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--action表示图片要上传到的后台api地址  list-type表示文件类型 
              headers表示设置上传的请求头部 on-success文件上传成功时的钩子-->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              list-type="picture-card"
              :headers="headerObj"
              :on-success="handleSuccess"
              ref="pictureUpload"
            >
              <i slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />
                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>

                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <!--图片预览-->
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!--富文本编辑器组件  ❗需要安装vue-quill-editor依赖-->
            <quill-editor v-model="addForm.goods_introduce" />
            <el-button type="primary" style="margin-top: 15px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入lodash
import _ from 'lodash'

export default {
  data() {
    return {
      // 步骤条 设置当前激活步骤
      activeIndex: '0',
      // 添加商品表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数数据
        goods_cat: [],
        // 商品参数和商品属性的数据
        attrs: [],
        // 图片的数组
        pics: [],
        // 商品的详情介绍
        goods_introduce: '',
      },
      // 商品分类列表
      catelist: [],
      // 级联选择器配置项
      cateProps: {
        // 显示的属性
        label: 'cat_name',
        // 选中的属性
        value: 'cat_id',
        // 父子节点嵌套属性
        children: 'children',
      },
      // 动态商品参数数据
      manyTableData: [],
      // 静态商品属性数据
      onlyTableData: [],
      // 上传图片
      // 存储图片url 图片预览
      dialogImageUrl: '',
      // 图片预留对话框显示或隐藏
      dialogVisible: false,
      disabled: false,
      // 图片上传组件的header请求头对象
      headerObj: {
        Authorization: sessionStorage.getItem('token'),
      },
      addRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    //获取商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('res.meta.msg')
      } else {
        this.catelist = res.data
      }
    },
    // 级联选择器选中项变化 处理函数
    handleChange() {
      console.log(this.addForm.goods_cat)
    },
    // 标签页切换触发before-leave 处理函数、
    // activeName即将进入的标签页名字, oldActiveName即将离开的标签页名字,
    beforeTablLeave(activeName, oldActiveName) {
      if (oldActiveName == '0' && this.addForm.goods_cat.length == 0) {
        // 若返回 false阻止切换。
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // tab被选中时触发 处理函数
    async tabClicked() {
      if (this.activeIndex == '1') {
        // 访问的是动态商品参数面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            // 获取动态商品参数
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('res.meta.msg')
        } else {
          this.manyTableData = res.data

          // 将获取到的参数列表中的 attr_vals 转换为数组
          this.manyTableData.forEach((item) => {
            item.attr_vals = item.attr_vals.split(' ')
          })
          console.log(this.manyTableData)
        }
      } else if (this.activeIndex == '2') {
        // 访问的是静态商品属性面板
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            // 获取动态商品参数
            params: { sel: 'only' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('res.meta.msg')
        } else {
          console.log(res.data)
          this.onlyTableData = res.data
        }
      }
    },
    // 监听文件上传成功的事件
    // response服务器返回的数据对象
    handleSuccess(response) {
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象，push到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm.pics)
    },
    // 删除上传的图片按钮被点击 处理函数
    handleRemove(file) {
      // 获取要删除图片的路径
      const filePath = file.response.data.tmp_path
      // 从pics数组中，找到这个图片对应的索引值
      const fileIndex = this.addForm.pics.findIndex(
        (value) => value.pic == filePath
      )
      // 调用splice方法，把图片信息对象从，pics数组中移除
      this.addForm.pics.splice(fileIndex, 1)
      // ⭐ 获取到文件上传组件，调用handleRemove，删除文件上传后的缩略图file
      this.$refs.pictureUpload.handleRemove(file)
      console.log(file)
    },
    // 预览图片按钮被点击 处理函数
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    //添加商品按钮被点击 处理函数、
     add() {
      this.$refs.ruleForm.validate(async(valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        } else {
           // 处理动态商品参数
          this.manyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals.toString(),
            }
            this.addForm.attrs.push(newInfo)
          })
          // 处理静态商品属性
          this.onlyTableData.forEach((item) => {
            const newInfo = {
              attr_id: item.attr_id,
              attr_value: item.attr_vals,
            }
            this.addForm.attrs.push(newInfo)
          })
          // 安装lodash依赖并导入，使用_.cloneDeep深拷贝addForm对象
          const form = _.cloneDeep(this.addForm)
          form.goods_cat = form.goods_cat.toString()
          console.log(form)

          // 发起请求添加商品
          const {data:res} = await this.$http.post('goods',form)
          if(res.meta.status !== 201){
            return this.$message.error(res.meta.msg)
          }else{
            this.$message.success(res.meta.msg)
            this.$router.push('/goods')
          }

        }
      })
    },
  },
  // 计算属性
  computed: {
    cateId() {
      return this.addForm.goods_cat[this.addForm.goods_cat.length - 1]
    },
  },
}
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important ;
}
</style>