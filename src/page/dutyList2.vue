<template>
    <div class="fillcontain">
        <div class="statistics common-content">
            <el-row class="searchForm">
                <el-col :span="24">
                    <div class="grid-content">
                        <el-button type="primary" @click="preInsertDuty">新增根节点</el-button>
                    </div>
                </el-col>
            </el-row>
            <!-- <el-table ref="multipleTable" :data="dialogTables" @select-all="dialogCheck" @select="dialogCheck"
                       @selection-change="dialogCheckChange">
                 <el-table-column type="selection" width="55"></el-table-column>
                 <el-table-column property="ANAME" label="模块名称"></el-table-column>
             </el-table>-->

            <el-table ref="multipleTable" :data="statisticDatas" border style="width: 100%;" size="medium"
                      :row-class-name="rowClassNameHandler" row-key="DUTY_ID_" @select-all="dialogCheck"
                      @select="dialogCheck"
                      @selection-change="dialogCheckChange" >
                <el-table-column type="selection" width="55"></el-table-column>
                <!-- <el-table-column :render-header="renderHeader" width="50" align="center">
                     <template slot-scope="scope">
                         <el-checkbox v-model="scope.row.checks" @change="toselect(scope.row)"></el-checkbox>
                     </template>
                 </el-table-column>-->
                <!--  <el-table-column label="选择" width = "100px">
                      <template slot-scope="scope">
                          <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange(scope.row.DUTY_ID_)">
                              <el-checkbox></el-checkbox>
                          </el-checkbox-group>
                      </template>
                  </el-table-column>-->
                <el-table-column label="职务名称" width="460" align="left" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span :style="{marginLeft: scope.row.level * 23 + 'px'}">&ensp;</span>
                        <i v-if="scope.row.showChildren"
                           :class="{'fa fa-folder-open':scope.row.showChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <i v-else :class="{'fa fa-folder':scope.row.hasChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <span :data-level="scope.row.level"
                              :style="{marginLeft: 4 + 'px'}">{{ scope.row.DUTY_NAME_ }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="DUTY_ID_" label="分类ID" width="80" align="center"></el-table-column>-->
                <!--<el-table-column prop="PARENT_DUTY_ID_" label="父类ID" width="80" align="center"></el-table-column>-->
                <el-table-column prop="DUTY_CODE_" label="职务编码" align="left"></el-table-column>
                <el-table-column label="机构领导等级" align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row.ORG_LEADER_LEVEL_ == '1' ? '正职领导' : scope.row.ORG_LEADER_LEVEL_ == '2' ? '副职领导' : scope.row.ORG_LEADER_LEVEL_ == '3' ? '机构高管' : scope.row.ORG_LEADER_LEVEL_ == '9' ? '职员' : null}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ORDER_" width="80" label="排序" align="left"></el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="300">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='insert'
                                size="mini"
                                @click='preInsertChildDuty(scope.row)'
                        >新增下级节点
                        </el-button>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='preUpdateDuty(scope.row)'
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='deleteDuty(scope.row,scope.$index)'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog
                :title="dialog.title"
                :visible.sync="dialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false">
            <div class="form">
                <el-form
                        ref="form"
                        :model="form"
                        :label-width="dialog.formLabelWidth"
                        style="margin:10px;width:auto;">
                    <el-tabs v-model="activeName">
                        <el-form-item prop='DUTY_CODE_' label="职务代码:">
                            <el-input type="DUTY_CODE_" v-model="form.DUTY_CODE_" style="width: 200px;"></el-input>
                        </el-form-item>

                        <el-form-item prop='DUTY_NAME_' label="职务名称:">
                            <el-input type="DUTY_NAME_" v-model="form.DUTY_NAME_" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item prop='ORG_LEADER_LEVEL_' label="机构领导等级:">
                            <el-select @change="chickvalue"
                                       v-model="form.ORG_LEADER_LEVEL_" filterable placeholder="请输入/请选择"
                                       class="h-m-select" style="width: 200px;">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        v-model="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop='ORDER_' label="排序:">
                            <el-input-number v-model="form.ORDER_" controls-position="right" :min="0"
                                             style="width: 200px;"></el-input-number>
                        </el-form-item>
                        <el-form-item class="text_right">
                            <el-button @click="dialog.show = false">取 消</el-button>
                            <el-button type="primary" @click='insertDuty("form")'>提 交</el-button>
                        </el-form-item>
                    </el-tabs>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	//import { commonService } from '@/service/commonService.js'
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'
	export default {
		name: 'ContractStatistic',
		data() {
			return {
				selectioned: '',
				checkAll: false,
				isIndeterminate: false,
				checkedCities: [],
				statisticDatas: [],
				pastDays: 0,
				activeName: {},
				//详情弹框信息
				dialog: {
					width: '400px',
					show: false,
					title: '新增职务根节点',
					formLabelWidth: '120px'
				},
				form: {
					DUTY_ID_:'',
					PARENT_DUTY_ID_:'',
					DUTY_CODE_: '',
					DUTY_NAME_: '',
					ORG_LEADER_LEVEL_: '',
					ORDER_: ''
				},
				options: [{
					value: '1',
					label: '正职领导'
				}, {
					value: '2',
					label: '副职领导'
				}, {
					value: '3',
					label: '机构高管'
				}, {
					value: '9',
					label: '职员'
				}]
			}

		},

		mounted() {
			this.loadStatisticData()
		},

		methods: {
			preInsertChildDuty(row){
				this.form.PARENT_DUTY_ID_ = row.DUTY_ID_;
				this.form.DUTY_CODE_ = '';
				this.form.DUTY_NAME_ = '';
				this.form.ORG_LEADER_LEVEL_ = '';
				this.form.ORDER_ = '';

				this.dialog.show = true;
            },
			preUpdateDuty(row){
				//this.$message('新增DUTY');
				this.form.DUTY_ID_ = row.DUTY_ID_;
				this.form.DUTY_CODE_ = row.DUTY_CODE_;
				this.form.DUTY_NAME_ = row.DUTY_NAME_;
				this.form.ORG_LEADER_LEVEL_ = row.ORG_LEADER_LEVEL_;
				this.form.ORDER_ = row.ORDER_;

				this.dialog.show = true;
            },
			deleteDuty(row){
				this.$confirm('此操作将永久删除数据,是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method:'POST',
						url:'http://localhost:9090/DS/deleteDutyNew.do',
						data:{
							DUTY_ID_ : row.DUTY_ID_
						},
						transformRequest: [function (data) {
							let ret = ''
							for (let it in data) {
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
							}
							return ret
						}],
						headers:{'Content-Type': "application/x-www-form-urlencoded"}
					}).then(function(res){
						that.$message('删除成功'),
							that.search({
								fun: () => {
								}
							});
					}).catch(function(err){
						/*请求失败*/
						that.$message.error('删除失败请重试')
					})
                })
            },
			chickvalue() {
			},
			preInsertDuty() {
				/*if (this.selectioned.DUTY_ID_ == null) {
					this.$message.error('请选择一条记录');
				} else {
				}*/

				//this.$message('新增DUTY');
				this.form.DUTY_ID_ = '';
				this.form.PARENT_DUTY_ID_ = '',
				this.form.DUTY_CODE_ = '';
				this.form.DUTY_NAME_ = '';
				this.form.ORG_LEADER_LEVEL_ = '';
				this.form.ORDER_ = 0;

				this.dialog.show = true;
			},
			insertDuty(form){
				let formData = this[form];
				let userinfo = mutils.getStore('userinfo');
				if(formData['DUTY_ID_'] == ''){
					this.$refs[form].validate((valid) => {
						if (valid) {//表单数据验证完成之后，提交数据;
							let that = this;
							axios({
								method:'POST',
								url:'http://localhost:9090/DS/insertDutyNew.do',
								data:{
									PARENT_DUTY_ID_ : formData['PARENT_DUTY_ID_'],
									DUTY_CODE_ : formData['DUTY_CODE_'],
									DUTY_NAME_ : formData['DUTY_NAME_'],
									ORG_LEADER_LEVEL_ : formData['ORG_LEADER_LEVEL_'],
									ORDER_ : formData['ORDER_'],
									OPERATOR_NAME_ : userinfo.username
								},
								transformRequest: [function (data) {
									let ret = ''
									for (let it in data) {
										ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
									}
									return ret
								}],
								headers:{'Content-Type': "application/x-www-form-urlencoded"}
							}).then(function(res){
								that.$message('新增成功'),
									that.search({
										fun: () => {
										}
									});
								that.dialog.show = false;
							}).catch(function(err){
								/*请求失败*/
								that.$message.error('新增失败请重试')
							})

						}
					})
                }else{
					this.$refs[form].validate((valid) => {
						if (valid) {//表单数据验证完成之后，提交数据;
							let that = this;
							axios({
								method:'POST',
								url:'http://localhost:9090/DS/updateDutyNew.do',
								data:{
									DUTY_ID_ :  formData['DUTY_ID_'],
									DUTY_CODE_ : formData['DUTY_CODE_'],
									DUTY_NAME_ : formData['DUTY_NAME_'],
									ORG_LEADER_LEVEL_ : formData['ORG_LEADER_LEVEL_'],
									ORDER_ : formData['ORDER_'],
									OPERATOR_NAME_ : userinfo.username
								},
								transformRequest: [function (data) {
									let ret = ''
									for (let it in data) {
										ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
									}
									return ret
								}],
								headers:{'Content-Type': "application/x-www-form-urlencoded"}
							}).then(function(res){
								that.$message('修改成功'),
									that.search({
										fun: () => {
										}
									});
								that.dialog.show = false;
							}).catch(function(err){
								/*请求失败*/
								that.$message.error('修改失败请重试')
							})

						}
					})
                }

            },
			dialogCheck(selection, row) {
				this.$refs.multipleTable.clearSelection()
				if (selection.length === 0) { // 判断selection是否有值存在
					return
				}
				if (row) {
					this.selectioned = row
					this.$refs.multipleTable.toggleRowSelection(row, true)
				}
			},
			dialogCheckChange(row) {
				if (row.length === 0) {
					this.selectioned = ''
				}
			},
			_processLevelStatisticData(dataArray) {
				let self = this

				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_DUTY_ID_ == null) {
						item['level'] = level
						resultArray.push(item)
						self._loadChildrenData(resultArray, dataArray, item, level + 1)
					}
				}
				return resultArray
			},

			_loadChildrenData(resultArray, originArray, item, level) {
				let self = this

				let deployed = 0
				let undeployed = 0
				let edit = 0
				let completed = 0
				for (let i = 0; i < originArray.length; i++) {
					let originItem = originArray[i]
					// 判断是否是item项的子项
					if (originItem.PARENT_DUTY_ID_ == item.DUTY_ID_) {
						item['hasChildren'] = true
						item['showChildren'] = false

						originItem['level'] = level
						originItem['visible'] = false // 子项默认隐藏
						originItem['hiddenByCategory'] = false

						resultArray.push(originItem)
						self._loadChildrenData(
							resultArray,
							originArray,
							originItem,
							level + 1
						)

						// 应该放在统计完子类数据之后
						//deployed += originItem.deployed
						//undeployed += originItem.undeployed
						//edit += originItem.edit
						//completed += originItem.completed
					}
				}
				// 计算子栏目统计合计
				//item.deployed += deployed
				//item.undeployed += undeployed
				//item.edit += edit
				//item.completed += completed
			},

			search() {
				this.loadStatisticData()
			},

			loadStatisticData() {
				let self = this
				let params = {
					pastDays: self.pastDays
				}
				/*let result = [{
                    "parentcategoryid": 0,
                    "edit": 0,
                    "undeployed": 1,
                    "deployed": 0,
                    "completed": 0,
                    "categoryName": "商业管理类",
                    "categoryid": 1105
                }, {
                    "parentcategoryid": 0,
                    "edit": 0,
                    "undeployed": 0,
                    "deployed": 1,
                    "completed": 0,
                    "categoryName": "研发设计类",
                    "categoryid": 1117
                }, {
                    "parentcategoryid": 0,
                    "edit": 0,
                    "undeployed": 3,
                    "deployed": 0,
                    "completed": 0,
                    "categoryName": "行政管理类",
                    "categoryid": 1901
                }, {
                    "parentcategoryid": 1105,
                    "edit": 0,
                    "undeployed": 0,
                    "deployed": 0,
                    "completed": 0,
                    "categoryName": "成都",
                    "categoryid": 1121
                }];
                let resultArray = self._processLevelStatisticData(result)
                self.statisticDatas = resultArray;*/

				let that = this;
				this.$ajax.post(
					'http://localhost:9090/DS/selectDutyNew.do'
				).then(function (res) {
					let result = res.data.dutyList;
					let resultArray = self._processLevelStatisticData(result)
					self.statisticDatas = resultArray
				})

				/*commonService.getGeneralStatistics(params).then(function(response) {
                    let result = response.data
                    let resultArray = self._processLevelStatisticData(result)
                    self.statisticDatas = resultArray
                })*/
			},
			rowClassNameHandler({row, rowIndex}) {
				// console.log(row['visible'])
				let className = 'pid-' + row.PARENT_DUTY_ID_
				if (
					row.PARENT_DUTY_ID_ !== null &&
					(row['visible'] !== true || row['hiddenByCategory'] === true)
				) {
					className += ' hiddenRow'
				}
				return className
			},

			onExpand(row) {
				let self = this
				let isShowChildren = !row['showChildren']
				row['showChildren'] = isShowChildren
				self._loadAllSubItems(row, true, isShowChildren)
			},

			_loadAllSubItems(item, isFirstLevlChildren, isShowChilren) {
				let self = this
				let dataArray = []
				for (let i = 0; i < self.statisticDatas.length; i++) {
					let tempItem = self.statisticDatas[i]
					if (tempItem.PARENT_DUTY_ID_ === item.DUTY_ID_) {
						if (isFirstLevlChildren) {
							tempItem['visible'] = !tempItem['visible']
						}
						tempItem['hiddenByCategory'] = !isShowChilren

						dataArray.push(tempItem)
						let subItemArray = self._loadAllSubItems(
							tempItem,
							false,
							isShowChilren
						)
						dataArray = dataArray.concat(subItemArray)
					}
				}
				return dataArray
			}
		}
	}
</script>

<style lang="less">
    .statistics {
        padding: 10px;
        .hiddenRow {
            display: none;
        }
        .searchForm {
            padding: 10px;
            span.label {
                margin-right: 10px;
            }
            span.attention {
                color: #e50021;
            }
        }

    }
</style>
