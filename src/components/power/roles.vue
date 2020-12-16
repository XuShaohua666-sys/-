<template>
  <div>
    <!--面包屑 导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片内容 区域-->
    <el-card class="box-card">
      <!--添加角色区域 -->
      <el-button type="primary" @click="addRolesDiaolog = true"
        >添加角色</el-button
      >
      <!--添加角色对话框-->
      <el-dialog
        title="添加角色"
        :visible.sync="addRolesDiaolog"
        close="addRolesClose"
      >
        <el-form ref="addRolesFrom" :model="addRoles" :rules="rules" >
          <el-form-item label="角色名称" prop="roleName" >
            <el-input v-model="addRoles.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addRoles.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addRolesDiaolog = false">取 消</el-button>
          <el-button type="primary" @click="addRolesSure">确 定</el-button>
        </div>
      </el-dialog>
      <!--权限列表 表格区域-->
      <el-table :data="rolesList" stripe style="width: 100%" border>
        <!--展开列，expand显示为一个可展开的按钮-->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item, index) in scope.row.children"
              :key="item.id"
              :class="['bdbottom', index == 0 ? 'bdtop' : '', 'vcenter']"
            >
              <!--渲染一级权限 占5列-->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">{{
                  item.authName
                }}</el-tag>
                <!--三角图标-->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 列-->
              <el-col :span="19">
                <!-- 循环嵌套二级权限-->
                <el-row
                  v-for="(item2, index) in item.children"
                  :key="item2.id"
                  :class="[index == 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <!-- 二级权限 列-->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightById(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 列-->
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300">
          <!--作用域插槽 -->
          <template slot-scope="scope">
            <!--编辑按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="showUpData(scope.row)"
              >编辑</el-button
            >

            <!--删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRoles(scope.row.id)"
              >删除</el-button
            >
            <!--分配权限按钮 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="small"
              @click="showSetRigthDialog(scope.row)"
              >分配权限</el-button
            >
            <!--编辑角色对话框-->
            <el-dialog
              title="编辑角色"
              :visible.sync="UpDataRolesDiaolog"
              close="UpDataRolesClose"
            >
              <el-form
                :model="UpDataRoles"
                :rules="rules"
                ref="upDataRolesFrom"
              >
                <el-form-item label="角色名称" prop="roleName">
                  <el-input v-model="UpDataRoles.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                  <el-input v-model="UpDataRoles.roleDesc"></el-input>
                </el-form-item>
              </el-form>
              <div slot="footer" class="dialog-footer">
                <el-button @click="UpDataRolesDiaolog = false">取 消</el-button>
                <el-button type="primary" @click="UpDataRolesSure"
                  >确 定</el-button
                >
              </div>
            </el-dialog>

            <!--分配权限对话框-->
            <el-dialog
              title="分配权限"
              :visible.sync="setRightDialogVisible"
              width="50%"
            >
              <!--树形控件-->
              <el-tree
                :data="rightsList"
                :props="treeProps"
                show-checkbox
                node-key="id"
                default-expand-all
                :default-checked-keys="defKeys"
                ref="treeRef"
              ></el-tree>
              <div slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false"
                  >取 消</el-button
                >
                <el-button type="primary" @click="allotRights"
                  >确 定</el-button
                >
              </div>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存储角色列表
      rolesList: [],
      // 添加角色表单
      addRoles: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色对话框 显示隐藏
      addRolesDiaolog: false,
      // 编辑角色对话框 显示隐藏
      UpDataRolesDiaolog: false,
      // 分配权限对话框 显示隐藏
      setRightDialogVisible: false,
      // 所有权限数据
      rightsList: [],
      // 树形控件 属性绑定对象
      treeProps: {
        // 树形中显示的值
        label: 'authName',
        // 父子节点通过children实现嵌套
        children: 'children',
      },
      // 树形控件 中默认选中的节点
      defKeys: [],
      // 存储当前用户id
      id:'',
      // 编辑角色表单
      UpDataRoles: {
        roleName: '',
        roleDesc: '',
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名', trigger: 'blur' },
          {
            min: 1,
            max: 10,
            message: '长度在 1 到 10 个字符',
            trigger: 'blur',
          },
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return
      this.rolesList = res.data
    },
    // 添加角色对话框关闭 处理函数
    addRolesClose() {
      this.$refs.addRolesFrom.resetFields()
    },
    // 添加角色确定按钮 处理函数
    async addRolesSure() {
      this.$refs.addRolesFrom.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.post('roles', this.addRoles)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            this.addRolesDiaolog = false
            this.getRolesList()
          }
        }
      })
    },
    // 编辑角色对话框关闭 处理函数
    UpDataRolesClose() {
      this.$refs.upDataRolesFrom.resetFields()
    },
    // 编辑角色按钮点击 处理函数
    showUpData(data) {
      // 存储 当前选中的角色id(bug:在点击确定时无法存储，只能在显示对话框前，提前存储)
      this.id = data.id
      
      this.UpDataRolesDiaolog = true
      this.UpDataRoles.roleName = data.roleName
      this.UpDataRoles.roleDesc = data.roleDesc
    },
    // 编辑角色对话框确定按钮 处理函数
    async UpDataRolesSure() {
      console.log(this.id)
      this.$refs.upDataRolesFrom.validate(async (valid) => {
        if (!valid) {
          return
        } else {
          const { data: res } = await this.$http.put(
            'roles/' + this.id,
            this.UpDataRoles
          )
          if (res.meta.status !== 200) {
            return this.$message.error('编辑角色失败')
          } else {
            this.$message.success('编辑角色成功')
            this.getRolesList()
            this.UpDataRolesDiaolog = false
          }
        }
      })
    },
    // 删除按钮点击 处理函数
    deleteRoles(id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.message.error('删除角色失败')
          } else {
            this.$message.success('删除角色成功')
            this.getRolesList()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 点击权限下拉列表中差号，根据角色 ID,权限 ID删除对应权限，处理函数
    removeRightById(role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          } else {
            this.$message.success(res.meta.msg)
            // 将删除成功的权限列表 重新赋值给当前权限列表对象
            role.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    // 展示分配权限对话框
    async showSetRigthDialog(role) {
      // 存储当前角色的id(bug:在点击确定时无法存储，只能在显示对话框前，提前存储)
      this.id = role.id
      // 获取所有权限列表 url参数tree 树状显示权限
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      } else {
        this.rightsList = res.data

        // 先将defKeys保存三级权限id的数组 清空
        this.defKeys = []
        // 调用getLeafKeys，递归获取三级权限的id
        this.getLeafKeys(role, this.defKeys)

        this.setRightDialogVisible = true
      }
    },
    // 通过递归的形式，获取角色所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前节点没有children属性，即为三级权限
      if (!node.children) {
        // 将当前节点的id保存到数组中
        return arr.push(node.id)
      } else {
        // 如果有children属性，遍历它的children，并让每个节点递归调用getLeafKeys
        node.children.forEach((item) => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    // 点击分配权限确定按钮，处理函数
    async allotRights() {
        
      const keys = [
         // 获取取树形组件中，所有已选中节点的id数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 获取取树形组件中，返回目前半选中的节点id所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 将数据转换为以逗号分隔的字符串
      const idStr = keys.toString()
      console.log(this.id)
      const {data:res} = await this.$http.post(`roles/${this.id}/rights`,{rids:idStr})
      if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
      }else{
        this.$message.success(res.meta.msg)
        this.getRolesList()
        this.setRightDialogVisible = false
      }
        
      
    },
  },
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
// 上边框类
.bdtop {
  border-top: 1px solid #eee;
}
// 下边框类
.bdbottom {
  border-bottom: 1px solid #eee;
}
// 垂直居中类
.vcenter {
  display: flex;
  align-items: center;
}
</style>