<template>

    <div class="fillcontain">
        <el-form
                ref="insertDevOpsDeptForm"
                :model="insertDevOpsDeptForm"
                style="margin:10px;width:auto; "
        >
            <el-form-item prop='ORG_ID_' label="单位ID:"  label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertDevOpsDeptForm.ORG_ID_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='DEPT_CODE_' label="作业区代码:"  label-width="100px"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertDevOpsDeptForm.DEPT_CODE_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='DEPT_NAME_' label="作业区名字:"  label-width="100px"
                          :rules="[{ required: true, message: '机构名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertDevOpsDeptForm.DEPT_NAME_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_insertDevOpsDept("insertDevOpsDeptForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
    
</template>

<script>
	import axios from 'axios';
	export default {
		name: "preInsertDevOpsDept",

        data() {
			return {
				idFlag: false,
				insertDevOpsDeptForm: {
					ORG_ID_: '',
					DEPT_CODE_: '',
					DEPT_NAME_: ''
				},

            }

        },

        created () {

        },

        methods : {
			//进页面赋空值
			setInsertDevOpsDeptForm() {
				this.setInsertDevOpsDeptForm.ORG_ID_ = this.insertDevOpsDeptForm.ORG_ID_;
				this.setInsertDevOpsDeptForm.DEPT_CODE_ = '';
				this.setInsertDevOpsDeptForm.DEPT_NAME_ = '';

			},

			//点击保存按钮
			_insertDevOpsDept(insertDevOpsDeptForm) {
				this.$refs[insertDevOpsDeptForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertDevOpsDeptForm];

						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertDevOpsDept.do',//'insertProjectPerson.do',
							data: {
								ORG_ID_: formData['ORG_ID_'],
								DEPT_CODE_: formData['DEPT_CODE_'],
								DEPT_NAME_: formData['DEPT_NAME_'],


							},
							transformRequest: [function (data) {
								let ret = '';
								for (let it in data) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
								}
								return ret
							}],
							headers: {'Content-Type': "application/x-www-form-urlencoded"}
						}).then(function (res) {
							if (res.data.success) {
								that.$message.success('新增成功');
								let returnValue = res.data.devOpsDept;

								that.$emit('insertDevOpsDeptListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
			},

        }
	}
</script>

<style scoped>

</style>