<template>
  <div>
    <!--面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域 -->
    <el-card>
      <!--分栏区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!--搜索与添加区域 -->
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!--添加用户区域 -->
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
          <!--添加用户对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="dialogVisible"
            width="50%"
            @close="addUserClosed"
          >
            <!--添加用户表单-->
            <el-form
              :model="addUser"
              :rules="rules"
              ref="ruleForm"
              label-width="70px"
              status-icon
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addUser.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addUser.password" type="password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addUser.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addUser.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="addUsers">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!--用户列表区域 -->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="150"
        ></el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <!--作用域插槽 -->
          <template slot-scope="scope">
            <!--.row可以获取到当前行所有数据 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="170">
          <!--作用域插槽 -->
          <template slot-scope="scope">
            <el-button-group>
              <!--修改按钮 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showUpDataDialog(scope.row)"
              ></el-button>
              <!--修改用户对话框 -->
              <el-dialog
                title="修改用户信息"
                :visible.sync="upDataDialog"
                width="50%"
                @close="upDataClosed"
              >
                <!--修改用户表单-->
                <el-form
                  :model="upDataUser"
                  :rules="rules"
                  ref="upDataForm"
                  label-width="70px"
                  status-icon
                >
                  <el-form-item label="用户名">
                    <el-input v-model="upDataUser.username" disabled></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="upDataUser.email"></el-input>
                  </el-form-item>
                  <el-form-item label="手机" prop="mobile">
                    <el-input v-model="upDataUser.mobile"></el-input>
                  </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                  <el-button @click="upDataDialog = false">取 消</el-button>
                  <el-button type="primary" @click="upDataUsers"
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <!--删除按钮 -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeUserByID(scope.row.id)"
              ></el-button>
              <!--文字提示 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <!--分配角色按钮 -->
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  size="mini"
                  @click="setRole(scope.row)"
                ></el-button>
              </el-tooltip>
            </el-button-group>
            <!--分配角色对话框 -->
            <el-dialog
              title="分配角色"
              :visible.sync="setRoleDialog"
              width="50%"
              @close="setRoleDialogClosed"
            >
              <p>
                当前用户:<el-input
                  v-model="setRoles.username"
                  disabled
                ></el-input>
              </p>
              <p>
                当前用户:<el-input v-model="setRoles.role" disabled></el-input>
              </p>
              <p>
                分配新角色:
                <template>
                  <el-select v-model="nowRoleId" placeholder="请选择">
                    <el-option
                      v-for="item in rolesList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </p>
              <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialog = false">取 消</el-button>
                <el-button type="primary" @click="setRoleSure">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
      <!--分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱自定义规则
    var checkEmail = (rule, value, callback) => {
      let reg = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/
      if (reg.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法邮箱'))
      }
    }

    // 验证手机号自定义规则
    var checkMobile = (rule, value, callback) => {
      let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        return callback()
      } else {
        callback(new Error('请输入合法手机号'))
      }
    }
    return {
      /* 获取用户列表的参数对象 */
      queryInfo: {
        // 搜索关键及
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 2,
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框的显示与隐藏
      dialogVisible: false,
      // 控制修改用户对话框的显示与隐藏
      upDataDialog: false,
      // 控制分配角色对话框的显示与隐藏
      setRoleDialog: false,
      /* 添加用户表单 */
      addUser: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      /* 修改用户表单 */
      upDataUser: {
        id: '',
        username: '',
        email: '',
        mobile: '',
      },
      // 分配角色存储当前id,用户名，和角色
      setRoles: {
        id: '',
        username: '',
        role: '',
      },
      // 存储角色列表
      rolesList: {},
      // 与分配角色下拉列表 绑定
      nowRoleId: '',
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 5,
            max: 15,
            message: '长度在 5 到 15 个字符',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          {
            validator: checkEmail,
            message: '请输入正确的邮箱地址',
            trigger: 'blur',
          },
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          {
            validator: checkMobile,
            message: '请输入正确的电话',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户失败')
      } else {
        this.userList = res.data.users
        this.total = res.data.total
      }
    },
    // 监听每页条数变化事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      // 重新发起请求，获取用户列表
      this.getUserList()
    },
    // 监听页码变化事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      // 重新发起请求，获取用户列表
      this.getUserList()
    },
    // 监听switch开关状态的改变
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('修改状态失败')
        // 将页面中的状态重置回去
        userInfo.mg_state = !userInfo.mg_state
      } else {
        this.$message.success('修改状态成功')
      }
    },
    // 当添加用户Dialog 对话框关闭时触发
    addUserClosed() {
      this.$refs.ruleForm.resetFields()
    },

    // 点击对话框确定按钮 添加新用户
    addUsers() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('users', this.addUser)
          if (res.meta.status !== 201) {
            this.$message.error(res.meta.msg)
          } else {
            this.dialogVisible = false
            this.$message.success(res.meta.msg)
            this.getUserList()
          }
        }
      })
    },
    // 点击修改按钮
    showUpDataDialog(res) {
      this.upDataDialog = true
      this.upDataUser.id = res.id
      this.upDataUser.username = res.username
      this.upDataUser.email = res.email
      this.upDataUser.mobile = res.mobile
    },
    // 当修改用户Dialog 对话框关闭时触发
    upDataClosed() {
      this.$refs.upDataForm.resetFields()
    },
    // 点击对话框确定按钮 修改新用户
    upDataUsers() {
      this.$refs.upDataForm.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.put(
            `users/${this.upDataUser.id}`,
            {
              email: this.upDataUser.email,
              mobile: this.upDataUser.mobile,
            }
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          } else {
            console.log(res)
            this.upDataDialog = false
            this.$message.success(res.meta.msg)
            this.getUserList()
          }
        }
      })
    },
    // 点击删除按钮 处理函数根据id删除用户
    removeUserByID(id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('users/' + id)
          if (res.meta.status !== 200) {
            return this.$message({
              type: 'error',
              message: '删除失败!',
            })
          } else {
            this.$message({
              type: 'success',
              message: '删除成功!',
            })
            this.getUserList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击分配角色按钮 处理函数
    async setRole(role) {
      this.setRoles.id = role.id
      this.setRoles.username = role.username
      this.setRoles.role = role.role_name

      //获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rolesList = res.data
        this.setRoleDialog = true
      }
    },
    // 点击分配角色对话框确定按钮，处理函数
    async setRoleSure() {
      if (!this.nowRoleId) {
        return this.$message.error('请选择要分配的角色')
      } else {
        const { data: res } = await this.$http.put(
          `users/${this.setRoles.id}/role`,
          {
            rid: this.nowRoleId,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        } else {
          this.$message.success(res.meta.msg)
          this.getUserList()
          this.setRoleDialog = false
        }
      }
    },
    // 分配角色对话框 关闭事件处理函数
    setRoleDialogClosed() {
      // 将存储下拉列表存储的id 置空
      this.nowRoleId = ''
    },
  },
}
</script>

<style lang="less" scoped>
</style>