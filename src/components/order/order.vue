<template>
  <div>
    <!--面包屑 导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容 区域-->
    <el-card class="box-card">
      <!--搜索框区域 -->
      <el-col :span="8"
        ><el-input
          v-model="queryInfo.query"
          style="margin-bottom: 15px"
          placeholder="请输入内容"
          clearable
          @clear="getOrderList"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getOrderList"
          ></el-button> </el-input
      ></el-col>
      <!--权限列表 表格区域-->
      <el-table :data="orderList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格"></el-table-column>
        <el-table-column prop="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status !== '1'" type="danger"
              >未付款</el-tag
            >
            <el-tag v-else type="success">已付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货"></el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | format('yyyy-MM-dd hh:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="addressVisible = true"
              title="修改地址"
            ></el-button>

            <!--删除按钮 -->
            <el-button
              type="success"
              icon="el-icon-location"
              size="mini"
              @click="showProgressBox(scope.row)"
              title="物流信息"
            ></el-button>

            <!--修改地址对话框-->
            <el-dialog
              title="修改地址"
              :visible.sync="addressVisible"
              width="50%"
              @close="addressDialogClosed"
            >
              <el-form
                :model="addressForm"
                :rules="rules"
                ref="addressruleForm"
                label-width="100px"
              >
                <el-form-item label="省市区/县" prop="address1">
                  <el-cascader
                    v-model="addressForm.address1"
                    :options="cityData"
                  ></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" prop="address2">
                  <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="addressVisible = false">取 消</el-button>
                <el-button type="primary" @click="addressVisible = false"
                  >确 定</el-button
                >
              </span>
            </el-dialog>
            <!--查看物理信息对话框-->
            <el-dialog
              title="物流进度"
              :visible.sync="progressVisible"
              width="50%"
            >
              <!--时间线组件-->
              <el-timeline >
                <el-timeline-item
                  v-for="(activity, index) in progressInfo"
                  :key="index"
                  :timestamp="activity.time"
                >
                  {{ activity.status }}
                </el-timeline-item>
              </el-timeline>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>

      <!--分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
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
// 导入城市区县信息
import cityData from './citydata'
export default {
  data() {
    return {
      // 获取订单列表请求传递的数据
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      // 存储订单列表数据
      orderList: [],
      // 存储数据列表总数
      total: 0,
      // 修改地址对话框显示与隐藏
      addressVisible: false,
      // 查看物理信息对话框显示与隐藏
      progressVisible: false,
      // 修改地址表单
      addressForm: {
        address1: [],
        address2: '',
      },
      // 城市区县信息
      cityData: cityData,
      // 存储物流信息
      progressInfo: [],
      // 表单验证规则
      rules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据列表
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.orderList = res.data.goods
        this.total = res.data.total
        console.log(res.data)
      }
    },
    // pageSize 每页显示条数改变时会触发
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrderList()
    },
    // 页码发生变化时触发
    handleCurrentChange(newNum) {
      this.queryInfo.pagenum = newNum
      this.getOrderList()
    },
    // 展示修改地址对话框
    showBox() {
      this.addressVisible = true
    },
    // 修改地址对话框关闭 处理函数
    addressDialogClosed() {
      this.$refs.addressruleForm.resetFields()
    },
    // 点击查看物流信息按钮
    async showProgressBox(id) {
      const { data: res } = await this.$http.get('/kuaidi/273303130843')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.progressInfo = res.data
        console.log(this.progressInfo)
      }
      this.progressVisible = true
    },
  },
}
</script>

<style lang="less" scoped>
@import '../../plugins/timeline/timeline.css';
@import '../../plugins/timeline-item/timeline-item.css';
</style>