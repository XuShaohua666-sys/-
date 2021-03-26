<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <!--搜索框区域 -->
        <el-col :span="8"
          ><el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button> </el-input
        ></el-col>
        <!--添加区域 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!--table表格区域 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column
          prop="goods_price"
          label="商品价格(元)"
          width="95px"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="商品重量"
          width="70px"
        ></el-table-column>
        <el-table-column prop="add_time " label="创建时间" width="160px">
          <template slot-scope="scope">
            {{ scope.row.add_time | format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!--编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showUpData(scope.row)"
            ></el-button>
            <!--编辑对话框 -->
            <el-dialog
              title="编辑商品"
              :visible.sync="UpDataRolesDiaolog"
            >
              <el-form
                :model="UpDataGoods"
                :rules="rules"
                ref="upDataGoodsFrom"
              >
                <el-form-item label="商品名称" prop="goods_name">
                  <el-input v-model="UpDataGoods.goods_name"></el-input>
                </el-form-item>
                <el-form-item label="价格" prop="goods_price">
                  <el-input v-model="UpDataGoods.goods_price"></el-input>
                </el-form-item>
                <el-form-item label="数量" prop="goods_name">
                  <el-input v-model="UpDataGoods.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="重量" prop="goods_name">
                  <el-input v-model="UpDataGoods.goods_weight"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="UpDataRolesDiaolog = false">取 消</el-button>
                <el-button type="primary" @click="UpDataGoodsSure"
                  >确 定</el-button
                >
              </div>
            </el-dialog>

            <!--删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteGoods(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 存储商品列表
      goodsList: [],
      // 存储数据总数
      total: 0,
      UpDataRolesDiaolog:false,
      UpDataGoodsId :'',
      UpDataGoods:{
        goods_name:'',
        goods_price:null,
        goods_number:null,
        goods_weight:null,
      },
      rules:{
        goods_name:[
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price:[
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_number:[
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ]
      }
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 根据分页获取对应的商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.goodsList = res.data.goods
        this.total = res.data.total
      }
    },
    // 显示信息数量发生变化 处理函数
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // 当页码发生变化 处理函数
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getGoodsList()
    },
    /* 编辑商品 */
    showUpData(row){
      
      this.UpDataRolesDiaolog = true
      this.UpDataGoodsId = row.goods_id
      this.UpDataGoods.goods_name = row.goods_name
      this.UpDataGoods.goods_price  = row.goods_price
      this.UpDataGoods.goods_number = row.goods_number
      this.UpDataGoods.goods_weight = row.goods_weight
    },
    /* 提交编辑商品对话框 */
    UpDataGoodsSure(){
      console.log(this.UpDataGoodsId);
      this.$refs.upDataGoodsFrom.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const {data:res} = await this.$http.put(
            'goods/' + this.UpDataGoodsId,
            this.UpDataGoods
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success('编辑商品成功')
            this.getGoodsList()
            this.UpDataRolesDiaolog = false
          }
        }
        })
      
    },
    // 删除商品按钮点击 处理函数
    deleteGoods(id) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async() => {
          const {data:res} = await this.$http.delete('goods/'+id)
          if(res.meta.status!==200){
            return this.$message.error(res.meta.msg)
          }else{
            this.$message.success(res.meta.msg)
            this.getGoodsList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击添加商品路由 处理函数
    goAddpage(){
      this.$router.push('/goods/add')
    }
  },
}
</script>

<style lang="less" scoped>
</style>