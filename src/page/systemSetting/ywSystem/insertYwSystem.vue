<template>
    <div class="fillcontain">
        <el-form
                ref="insertYwSystemForm"
                :model="insertYwSystemForm"
                style="margin:10px;width:auto; ">
            <el-form-item prop='ORG_ID_' label="公司名称:" label-width="100px"
                          :rules="[{ required: true, message: '公司名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '公司名称不能超过60位', trigger: 'blur' }]">
                <el-select v-model="insertYwSystemForm.ORG_ID_" placeholder="请选择公司" style="width: 100%" clearable>
                    <el-option
                            v-for="item in orgList"
                            :key="item.ORG_ID_"
                            :label="item.ORG_NAME_"
                            :value="item.ORG_ID_">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop='SYSTEM_CODE_' label="系统编码:" label-width="100px"
                          :rules="[{ required: true, message: '系统编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '系统编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertYwSystemForm.SYSTEM_CODE_" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item prop='SYSTEM_NAME_' label="系统名称:" label-width="100px"
                          :rules="[{ required: true, message: '系统名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '系统名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertYwSystemForm.SYSTEM_NAME_" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item prop='ORDER_' label="排序:" label-width="24.5%">
                <el-input-number v-model="insertYwSystemForm.ORDER_" label="排序:" :precision="0" :step="1">
                </el-input-number>
            </el-form-item>
            <el-form-item class="text_right">
                <el-button type="primary" icon="el-icon-check" @click='_insertYwSystem("insertYwSystemForm")'>保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	export default {
		name: "insertYwSystem",
        data(){
			return{
				insertYwSystemForm: {
					ORG_ID_: '',
					SYSTEM_CODE_: '',
					SYSTEM_NAME_: '',
					ORDER_: ''
				},
				orgList: [],
            }
        },
		created(){
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectYwOrg();
			},
			async _selectYwOrg(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectDevOpsOrg.do',
					data: {
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
						that.orgList = res.data.orgList;

					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			setInsertYwSystemForm(){
				this.insertYwSystemForm.ORG_ID_ = '';
				this.insertYwSystemForm.SYSTEM_CODE_ = '';
				this.insertYwSystemForm.SYSTEM_NAME_ = '';
				this.insertYwSystemForm.ORDER_ = '';
            },
            //点击保存
			_insertYwSystem(insertYwSystemForm) {
				this.$refs[insertYwSystemForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertYwSystemForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertYwSystem.do',//'insertProjectPerson.do',
							data: {
								ORG_ID_: formData['ORG_ID_'],
								SYSTEM_CODE_: formData['SYSTEM_CODE_'],
								SYSTEM_NAME_: formData['SYSTEM_NAME_'],
								ORDER_: formData['ORDER_']
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
								let returnValue = res.data.ywSystem;

								that.$emit('insertYwSystemListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/!*请求失败*!/
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
