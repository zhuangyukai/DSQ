<template>
    <div>
        <div>
            <el-button
                    size="small"
                    type="primary"
                    icon="el-icon-circle-plus-outline"
                    @click="_preInsertProjectPerson">添加
            </el-button>
            <el-table
                    class="template-list"
                    :data="projectPersonList"
                    v-loading="projectPersonLoading"
                    style="width: 100%;height: 600px">
                <el-table-column
                        label="人员姓名">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.EMP_NAME_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.EMP_NAME_"
                                      @focus="_preChooseEmp(scope.$index, scope.row)"
                                      placeholder="请选择人员"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="项目角色">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.PROJECT_ROLE_NAME_ }}</span>
                        </div>
                        <div v-else>
                            <el-select v-model="scope.row.PROJECT_ROLE_" placeholder="请选择项目角色">
                                <el-option
                                        v-for="item in projectRoleList"
                                        :key="item.CODE_"
                                        :label="item.NAME_"
                                        :value="item.CODE_">
                                </el-option>
                            </el-select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                >
                    <template slot-scope="scope">
                        <div class="operate-groups">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-edit-outline"
                                    @click="_preUpdateProjectPerson(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.editing"
                                    icon="el-icon-success"
                                    @click="_insertProjectPerson(scope.$index, scope.row)">保存
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-delete"
                                    @click="_deleteProjectPerson(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.editing"
                                    icon="el-icon-warning"
                                    @click="_cancelProjectPerson(scope.$index, scope.row)">取消
                            </el-button>
                        </div>
                    </template>
                </el-table-column>

            </el-table>

            <!--选择人员-->
            <el-dialog
                    :title="chooseEmpDialog.title"
                    :visible.sync="chooseEmpDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseEmpDialog.style"
                    :width="chooseEmpDialog.width"
                    @close="closeChooseEmpDialog"
            >
                <template>
                    <chooseEmpCom ref="choose_emp_ref" v-if="chooseEmpDialog.dialogVisible"
                                  @chooseEmpListeners="_completeChooseEmp">
                    </chooseEmpCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';

	import chooseEmpCom from '../emp/preChooseEmp.vue';

	export default {
		components: {chooseEmpCom},
		data(){
            return{
				projectPersonForm: {
					PROJECT_ID_: ''
                },
				projectPersonList: [],
				projectPersonLoading: false,
				projectRoleList: [],
				CODE_LIST : [],
				projectRoleCodeMapList: {},
				projectPerson: {
					tempDate: {
						PROJECT_ID_: '',
						EMP_NAME_: '',
						EMP_ID_: ''
					},
					insertOrUpdate: false,
					PROJECT_ID_: '',
					tempIndex: ''
				},
				//打开人员机构的窗口
				chooseEmpDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					dialogVisible : true,
					formLabelWidth: '120px',
					empLoading: false,
				},
            }
        },
		created() {
			//this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this._selectCode();

				await this.selectProjectPerson();
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
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_ROLE'){
								that.projectRoleList.push(that.CODE_LIST[i]);
								that.projectRoleCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			selectProjectPerson(){
				let that = this;
				this.projectPersonLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectPerson.do',
					data: {
						PROJECT_ID_: that.projectPersonForm.PROJECT_ID_,
						STATUS_: '1'
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
						that.projectPersonList = [];
						let projectPersonListTemp = res.data.projectPersonList;

						for (let i = 0; i < projectPersonListTemp.length; i++) {
							const tableItem = {
								PROJECT_PERSON_ID_: projectPersonListTemp[i].PROJECT_PERSON_ID_,
								PROJECT_ID_: projectPersonListTemp[i].PROJECT_ID_,
								EMP_ID_: projectPersonListTemp[i].EMP_ID_,
								PROJECT_ROLE_: projectPersonListTemp[i].PROJECT_ROLE_,
								EMP_NAME_: projectPersonListTemp[i].EMP_NAME_,
								PROJECT_ROLE_NAME_: that.projectRoleCodeMapList[projectPersonListTemp[i].PROJECT_ROLE_],
								isSet: false
							}
							that.projectPersonList.push(tableItem);
						}
					} else {
						that.$message.error(res.data.message);
					}

					that.projectPersonLoading = false;
				}).catch(function (err) {
					that.projectPersonLoading = false;
					that.$message.error('系统错误请联系管理员')
				})
            },
            //点击添加
			_preInsertProjectPerson(){
				for (let i = 0; i < this.projectPersonList.length; i++) {
					if (this.projectPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				//this.projectPerson.tempDate.EMP_NAME_ = '';
				this.projectPerson.insertOrUpdate = true;
				this.projectPersonList = this.projectPersonList || []
				this.projectPersonList.push({
					PROJECT_PERSON_ID_: "",
					PROJECT_ID_: "",
					EMP_ID_: "",
					PROJECT_ROLE_: "",
					ENABLE_DATE_: "",
					DISABLE_DATE_: "",
					STATUS_: "",
					EMP_NAME_: "",
					editing: true
				});
            },
            //点击编辑
			_preUpdateProjectPerson($index, row) {
				for (let i = 0; i < this.projectPersonList.length; i++) {
					if (this.projectPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				this.projectPerson.insertOrUpdate = false;
				this.$set(this.projectPersonList[$index], 'editing', true)
				this.projectPerson.tempDate.EMP_NAME_ = row.EMP_NAME_;
				this.projectPerson.tempDate.EMP_ID_ = row.EMP_ID_;
			},
            //选择人员
			_preChooseEmp(index, row) {
				this.chooseEmpDialog.show = true;
				this.chooseEmpDialog.dialogVisible = true;
				this.projectPerson.tempIndex = index;
				this.$nextTick(_ => {
					this.$refs.choose_emp_ref._selectOrg();
				})
			},
            //关闭监听
			closeChooseEmpDialog(){
				this.chooseEmpDialog.dialogVisible = false;
            },
			//赋人名
			_completeChooseEmp(row){
				this.projectPersonList[this.projectPerson.tempIndex].EMP_ID_ = row.EMP_ID_;
				this.projectPersonList[this.projectPerson.tempIndex].EMP_NAME_ = row.EMP_NAME_;
				this.chooseEmpDialog.show = false;
			},
            //保存
			_insertProjectPerson(index, row){
				if(row.PROJECT_ROLE_ == ''){
					this.$message.warning("请录入人员角色!");
					return;
                }
				let that = this;
				if(row.PROJECT_PERSON_ID_ == '') {
                    axios ({
						method: 'POST',
						url: this.baseUrl + 'loadProject.do',
						data: {
							PROJECT_ID_: that.projectPersonForm.PROJECT_ID_
						},
						transformRequest: [function (data) {
							let ret = ''
							for (let it in data) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
							}
							return ret
						}],
						headers: {'Content-Type': "application/x-www-form-urlencoded"}
                    }).then(function (res){
                        if(res.data.success){
							let projectRoleData = res.data.project.PROJECT_ROLE_;
							if(row.PROJECT_ROLE_ == projectRoleData){
								that.$message.error('该项目已有负责人，负责人只能有一个');
								return;
                            }else{
								axios({
									method: 'POST',
									url: that.baseUrl + 'insertProjectPerson.do',
									data: {
										PROJECT_ID_: that.projectPersonForm.PROJECT_ID_,
										EMP_ID_: that.projectPersonList[index].EMP_ID_,
										PROJECT_ROLE_: row.PROJECT_ROLE_
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
										let projectPerson = res.data.projectPerson;
										that.$set(that.projectPersonList[index], 'editing', false);
										that.$set(that.projectPersonList[index], 'PROJECT_PERSON_ID_', projectPerson.PROJECT_PERSON_ID_);
										that.$set(that.projectPersonList[index], 'EMP_ID_', projectPerson.EMP_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ID_', projectPerson.PROJECT_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_', projectPerson.PROJECT_ROLE_);
										that.$set(that.projectPersonList[index], 'ENABLE_DATE_', projectPerson.ENABLE_DATE_);
										that.$set(that.projectPersonList[index], 'DISABLE_DATE_', projectPerson.DISABLE_DATE_);
										that.$set(that.projectPersonList[index], 'STATUS_', projectPerson.STATUS_);
										that.$set(that.projectPersonList[index], 'EMP_NAME_', projectPerson.EMP_NAME_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_NAME_', that.projectRoleCodeMapList[projectPerson.PROJECT_ROLE_]);
										//this._selectProjectPerson(this.projectPerson.tempDate.PROJECT_ID_);

										that.$message.success("添加成功");
										let returnValue = res.data.projectPerson;

										that.$emit('projectPersonListeners', returnValue);
									} else {
										that.$message.error(res.data.message);
									}
								}).catch(function (err) {
									that.$message.error('操作失败请重试')
								})
                            }
                        }else{
							that.$message.error(res.data.message);
                        }
                    }).catch(function (err){
						that.$message.error('操作失败请重试')
                    })
                }else{
                    axios({
						method: 'POST',
						url: this.baseUrl + 'loadProject.do',
						data: {
							PROJECT_ID_: that.projectPersonForm.PROJECT_ID_
						},
						transformRequest: [function (data) {
							let ret = ''
							for (let it in data) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
							}
							return ret
						}],
						headers: {'Content-Type': "application/x-www-form-urlencoded"}
                    }).then(function (res){
                        if(res.data.success){
                            let PROJECT_PERSON_ID_ = res.data.project.PROJECT_PERSON_ID_;
							let projectRoleData = res.data.project.PROJECT_ROLE_;
                            if(PROJECT_PERSON_ID_ == row.PROJECT_PERSON_ID_){
								axios({
									method: 'POST',
									url: that.baseUrl + 'updateProjectPerson.do',
									data: {
										PROJECT_PERSON_ID_: row.PROJECT_PERSON_ID_,
										EMP_ID_: row.EMP_ID_,
										PROJECT_ROLE_: row.PROJECT_ROLE_
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
										let projectPerson = res.data.projectPerson;
										that.$set(that.projectPersonList[index], 'editing', false);
										that.$set(that.projectPersonList[index], 'PROJECT_PERSON_ID_', projectPerson.PROJECT_PERSON_ID_);
										that.$set(that.projectPersonList[index], 'EMP_ID_', projectPerson.EMP_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ID_', projectPerson.PROJECT_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_', projectPerson.PROJECT_ROLE_);
										that.$set(that.projectPersonList[index], 'ENABLE_DATE_', projectPerson.ENABLE_DATE_);
										that.$set(that.projectPersonList[index], 'DISABLE_DATE_', projectPerson.DISABLE_DATE_);
										that.$set(that.projectPersonList[index], 'STATUS_', projectPerson.STATUS_);
										that.$set(that.projectPersonList[index], 'EMP_NAME_', projectPerson.EMP_NAME_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_NAME_', that.projectRoleCodeMapList[projectPerson.PROJECT_ROLE_]);
										//this._selectProjectPerson(this.projectPerson.tempDate.PROJECT_ID_);
										that.$message.success("修改成功");
										let returnValue = res.data.projectPerson;
										that.$emit('projectPersonListeners', returnValue);
									} else {
										that.$message.error(res.data.message);
									}
								}).catch(function (err) {
									that.$message.error('操作失败请重试')
								})
                            }else if(PROJECT_PERSON_ID_ != row.PROJECT_PERSON_ID_ && row.PROJECT_ROLE_ == projectRoleData){
								that.$message.error('该项目已有负责人，负责人只能有一个');
								return;
                            }else{
								axios({
									method: 'POST',
									url: that.baseUrl + 'updateProjectPerson.do',
									data: {
										PROJECT_PERSON_ID_: row.PROJECT_PERSON_ID_,
										EMP_ID_: row.EMP_ID_,
										PROJECT_ROLE_: row.PROJECT_ROLE_
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
										let projectPerson = res.data.projectPerson;
										that.$set(that.projectPersonList[index], 'editing', false);
										that.$set(that.projectPersonList[index], 'PROJECT_PERSON_ID_', projectPerson.PROJECT_PERSON_ID_);
										that.$set(that.projectPersonList[index], 'EMP_ID_', projectPerson.EMP_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ID_', projectPerson.PROJECT_ID_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_', projectPerson.PROJECT_ROLE_);
										that.$set(that.projectPersonList[index], 'ENABLE_DATE_', projectPerson.ENABLE_DATE_);
										that.$set(that.projectPersonList[index], 'DISABLE_DATE_', projectPerson.DISABLE_DATE_);
										that.$set(that.projectPersonList[index], 'STATUS_', projectPerson.STATUS_);
										that.$set(that.projectPersonList[index], 'EMP_NAME_', projectPerson.EMP_NAME_);
										that.$set(that.projectPersonList[index], 'PROJECT_ROLE_NAME_', that.projectRoleCodeMapList[projectPerson.PROJECT_ROLE_]);
										that.$message.success("修改成功");
										let returnValue = res.data.projectPerson;
										that.$emit('projectPersonListeners', returnValue);
									} else {
										that.$message.error(res.data.message);
									}
								}).catch(function (err) {
									that.$message.error('操作失败请重试')
								})
                            }
                        }else{
							that.$message.error(res.data.message);
                        }
                    }).catch(function (err){
						that.$message.error('操作失败请重试')
                    })
                }

            },
            //点击删除
			_deleteProjectPerson(index, row){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'deleteProjectPerson.do',
					data: {
						PROJECT_PERSON_ID_: row.PROJECT_PERSON_ID_
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
						that.$message.success('删除成功');
						that.projectPersonList.splice(index, 1);

						let returnValue = res.data.projectPerson;

						that.$emit('projectPersonListeners', returnValue);
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('删除失败请重试')
				})
            },
			// 点击取消
			_cancelProjectPerson(index, row) {
				this.$set(this.projectPersonList[index], 'editing', false);
				if (this.projectPerson.insertOrUpdate) {
					this.projectPersonList.splice(index, 1);
				} else {
					this.projectPersonList[index].EMP_ID_ = this.projectPerson.tempDate.EMP_ID_;
					this.projectPersonList[index].EMP_NAME_ = this.projectPerson.tempDate.EMP_NAME_;
				}
			},
        }
	}
</script>

<style scoped>

</style>
