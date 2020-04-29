<template>
    <div>
        <div>
            <el-form
                    ref="insertReceivableForm"
                    :model="insertReceivableForm"
                    style="margin:10px;width:auto;"
            >
                <el-form-item prop='PROJECT_NAME_' label="项目名称:" label-width="27%"
                              :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' }]">
                        <el-input v-model="insertReceivableForm.PROJECT_NAME_"
                                      @focus="_preChooseProject()"
                                  style="width: 90%"
                                      placeholder="请选择项目"></el-input>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_TYPE_' label="应收类型:" label-width="27%"
                              :rules="[{ required: true, message: '应收类型不能为空' ,trigger: 'blur' }]">
                    <el-select v-model="insertReceivableForm.RECEIVABLE_TYPE_" placeholder="请选择" style="width: 68%">
                        <el-option
                                v-for="item in receivableTypeList"
                                :key="item.CODE_"
                                :label="item.NAME_"
                                :value="item.CODE_">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_MONEY_'label="应收金额(万元):"
                              :rules="[{ required: true, message: '应收金额不能为空' ,trigger: 'blur' }]">
                    <el-input-number v-model="insertReceivableForm.RECEIVABLE_MONEY_" :precision="2" :min="0" label="应售金额(万元):" style="width: 50%" >
                    </el-input-number>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_DATE_' label="应收日期:" label-width="27%"
                              :rules="[{ required: true, message: '应收日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="insertReceivableForm.RECEIVABLE_DATE_"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertReceivable("insertReceivableForm")'>保 存</el-button>
                </el-form-item>
            </el-form>
            <!--选择项目-->
            <el-dialog
                    :title="chooseProjectDialog.title"
                    :visible.sync="chooseProjectDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="chooseProjectDialog.style"
                    :width="chooseProjectDialog.width"
            >
                <template>
                    <chooseProjectCom ref="choose_project_ref" v-if="chooseProjectDialog.dialogVisible"
                                  @chooseProjectListeners="_completeChooseProject">
                    </chooseProjectCom>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	import chooseProjectCom from '../project/preChooseProject.vue';

	export default {
		components: {chooseProjectCom},
		data() {
			return {
				insertReceivableForm: {
					PROJECT_NAME_: '',
					RECEIVABLE_TYPE_: '',
					RECEIVABLE_MONEY_: '',
					RECEIVABLE_DATE_: ''
				},
				receivableTypeList: [],
				//打开项目的窗口
				chooseProjectDialog: {
					width: '700px',
					show: false,
					title: '选择项目',
					dialogVisible : true,
					formLabelWidth: '120px'
				},
                //定义一个全局的project_id_
                project_id_: ''
			}
		},
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectCode();
			},
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
						that.CODE_LIST = res.data.codeList;
						for(let i = 0; i<that.CODE_LIST.length; i++){
							if(that.CODE_LIST[i].CATEGORY_ == 'RECEIVABLE_TYPE'){
								that.receivableTypeList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//进页面赋空值
			setInsertReceivableFormNull(){
				this.insertReceivableForm.PROJECT_NAME_ = '';
				this.insertReceivableForm.RECEIVABLE_TYPE_ = '';
				this.insertReceivableForm.RECEIVABLE_MONEY_ = '';
				this.insertReceivableForm.RECEIVABLE_DATE_ = '';
			},
            //点击选择项目的单元格
			_preChooseProject(){
				this.chooseProjectDialog.show = true;
            },
            //赋项目
			_completeChooseProject(returnValue){
				this.chooseProjectDialog.show = false;
				this.insertReceivableForm.PROJECT_NAME_ = returnValue.PROJECT_NAME_;
				this.project_id_ = returnValue.PROJECT_ID_;
            },
            //点击保存按钮
			_insertReceivable(insertReceivableForm){
				this.$refs[insertReceivableForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertReceivableForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertReceivable.do',
							data: {
								PROJECT_ID_: that.project_id_,
								RECEIVABLE_TYPE_: formData['RECEIVABLE_TYPE_'],
								RECEIVABLE_MONEY_: formData['RECEIVABLE_MONEY_'],
								RECEIVABLE_DATE_: mutils.formatDate(new Date(formData['RECEIVABLE_DATE_'])),
							},
							transformRequest: [function (data) {
								let ret = ''
								for (let it in data) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
								}
								return ret
							}],
							headers: {'Content-Type': "application/x-www-form-urlencoded"}
						}).then(function (res) {
							if (res.data.success) {
								that.$message.success('新增成功');
								let returnValue = res.data.receivable;

								that.$emit('insertReceivableListeners', returnValue);
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