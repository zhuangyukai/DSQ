<template>
    <div>
        <div>
            <el-form
                    ref="insertSubMenuForm"
                    :model="insertSubMenuForm"
                    style="margin:10px;width:auto;height:250px">
                <el-row>
                    <el-col >
                        <el-form-item prop='MENU_NAME_' label="菜单名称:"
                                      :rules="[{ required: true, message: '菜单名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertSubMenuForm.MENU_NAME_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col >
                        <el-form-item prop='MENU_TYPE_' label="菜单类型:"
                                      :rules="[{ required: true, message: '菜单类型不能为空' ,trigger: 'blur' }]">
                            <el-select v-model="insertSubMenuForm.MENU_TYPE_" placeholder="请选择" style="width: 60%">
                                <el-option
                                        v-for="item in menuTypeList"
                                        :key="item.CODE_"
                                        :label="item.NAME_"
                                        :value="item.CODE_">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col>
                        <el-form-item prop='URL_' label="链接地址:"
                                      :rules="[{ required: true, message: '链接地址不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertSubMenuForm.URL_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col>
                        <el-form-item prop='VUE_' label="VUE:" label-width="18.5%"
                                      :rules="[{ required: true, message: 'VUE不能为空' ,trigger: 'blur' }]">
                            <el-select v-model="insertSubMenuForm.VUE_" placeholder="请选择" style="width: 73.5%">
                                <el-option
                                        v-for="item in vueList"
                                        :key="item.CODE_"
                                        :label="item.NAME_"
                                        :value="item.CODE_">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item prop='ORDER_' label="排序:" label-width="18.5%">
                    <el-input-number v-model="insertSubMenuForm.ORDER_" :precision="0" :step="1" style="width: 73.5%">
                    </el-input-number>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertSubMenu("insertSubMenuForm")'>保 存</el-button>
                </el-form-item>


            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		data(){
			return{
				PARENT_MENU_ID_: '',
				insertSubMenuForm: {
					MENU_NAME_: '',
					MENU_TYPE_: '',
					URL_: '',
					VUE_: '',
					ORDER_: ''
				},
				menuTypeList: [],
				vueList: []
			}
		},
		created() {
			this._selectCode();

		},
        methods: {
			async _selectCode(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
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
						let CODE_LIST = res.data.codeList;
						for(let i = 0; i<CODE_LIST.length; i++){
							if(CODE_LIST[i].CATEGORY_ == 'MENU_TYPE'){
								that.menuTypeList.push(CODE_LIST[i]);
							}
							if(CODE_LIST[i].CATEGORY_ == 'BOOLEAN'){
								that.vueList.push(CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			setInsertSubMenu(){
				this.insertSubMenuForm.MENU_NAME_ = '';
				this.insertSubMenuForm.MENU_TYPE_ = '';
				this.insertSubMenuForm.URL_ = '';
				this.insertSubMenuForm.VUE_ = '';
				this.insertSubMenuForm.ORDER_ = '';
			},
			_insertSubMenu(insertSubMenuForm){
				this.$refs[insertSubMenuForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertSubMenuForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertMenu.do',
							data: {
								PARENT_MENU_ID_: that.PARENT_MENU_ID_,
								MENU_NAME_: formData['MENU_NAME_'],
								MENU_TYPE_: formData['MENU_TYPE_'],
								URL_: formData['URL_'],
								VUE_: formData['VUE_'],
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
								let returnValue = res.data.menu;
								that.$emit('insertSubMenuListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>