<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='weekWork_data'
                    ref="weekWork_data"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="weekWork_data.startDate"
                            type="date"
                            placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker
                            v-model="weekWork_data.endDate"
                            type="date"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectWeekWork("weekWork_data")'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertWeekWork()'>添加
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
        <div>
            <el-table
                    v-loading="weekWorkloading"
                    :data="weekWorkList"
                    :style="weekWorkGridTableStyle"
                    :height="weekWorkGridTableStyle.height"
                    align='center'
                    ref="weekWorkGridRef">
                <el-table-column
                        v-if="idFlag"
                        prop="WEEK_WORK_ID_"
                        label="周工作报告ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="DEPT_NAME_"
                        label="部门"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="DEPT_MANAGER_NAME_"
                        label="部门负责人"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="POSI_NAME_"
                        label="岗位名称"
                        align='center'
                        width="240">
                </el-table-column>
                <el-table-column
                        prop="WEEK_START_DATE_"
                        label="本周开始时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WEEK_END_DATE_"
                        label="本周结束时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_END_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WEEK_"
                        label="年周数"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="DRAFTOR_NAME_"
                        label="起草人姓名"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="180">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='onEditWeekWork(scope.row,scope.$index)'
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='onDeleteWeekWork(scope.row,scope.$index)'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='paginations.total > 0'
                                :page-sizes="paginations.page_sizes"
                                :page-size="paginations.page_size"
                                :layout="paginations.layout"
                                :total="paginations.total"
                                :current-page='paginations.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>

            <!--添加-->
            <el-dialog
                    :title="insertWeekWorkDialog.title"
                    :visible.sync="insertWeekWorkDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="insertWeekWorkDialog.style"
                    :width="insertWeekWorkDialog.width"
                    @closed="_closeInsertWeekWorkDialog"
            >
                <template>
                    <insertWeekWorkCom ref="insert_weekWork_ref" v-if="insertWeekWorkDialog.dialogVisible"
                                       @insertWeekWorkListeners="_completeInsertWeekWork" @insertUpdateWeekWorkListeners="_completeInsertUpdateWeekWork"></insertWeekWorkCom>
                </template>
            </el-dialog>

            <!--编辑-->
            <el-dialog
                    :title="updateWeekWorkDialog.title"
                    :visible.sync="updateWeekWorkDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="updateWeekWorkDialog.style"
                    :width="updateWeekWorkDialog.width"
                    @closed="_closeUpdateWeekWorkDialog"
            >
                <template>
                    <updateWeekWorkCom ref="update_weekWork_ref" v-if="updateWeekWorkDialog.dialogVisible"
                                       @updateWeekWorkListeners="_completeUpdateWeekWork"></updateWeekWorkCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	import insertWeekWorkCom from "../weekWork/preInsertWeekWork.vue";
	import updateWeekWorkCom from "../weekWork/preUpdateWeekWork.vue";

	export default {
		components: {insertWeekWorkCom, updateWeekWorkCom},
		data(){
		    return{
				weekWork_data: {
					startDate: '',
					endDate: '',
					startDatePage: '',
					endDatePage : ''
				},
				weekWorkloading: false,
				weekWorkList: [],
                updateIndex : '',
				weekWorkGridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				idFlag: false,
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				//新增窗口
				insertWeekWorkDialog: {
					show: false,
					title: '新增周报',
					insertWeekWorkDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '1000px'
				},
				//修改窗口
				updateWeekWorkDialog: {
					show: false,
					title: '修改周报',
					updateWeekWorkDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '1000px'
				},
            }
        },
		mounted() {
			//加载数据之前，先加载theme颜色
			this.getWeekWorkList({
				fun: () => {
				}
			});
		},
        methods:{
			setPath(field, value) {
				var path = this.$route.path,
					query = Object.assign({}, this.$route.query);
				if (typeof field === 'object') {
					query = field;
				} else {
					query[field] = value;
				}
				this.$router.push({
					path,
					query
				});
			},
			getWeekWorkList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.weekWorkloading = true;
				var query = this.$route.query;
				this.paginations.page_index = page || parseInt(query.page) || 1;
				this.paginations.page_size = page_size || parseInt(query.page_size) || this.paginations.page_size;
				var data = {
					pageIndex: this.paginations.page_index,
					pageSize: this.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let formData = this.weekWork_data;
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				let FROM_START_DATE_ = formData['startDatePage'];
				let TO_START_DATE_ = formData['endDatePage'];

				if (mutils.isEmpty(FROM_START_DATE_)) {
					FROM_START_DATE_ = "";
				} else {
					FROM_START_DATE_ = mutils.formatDate(new Date(FROM_START_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_START_DATE_)) {
					TO_START_DATE_ = "";
				} else {
					TO_START_DATE_ = mutils.formatDate(new Date(TO_START_DATE_));
				}

				// 封装  get,path,params,fn,errfn
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'selectWeekWork.do?FROM_START_DATE_=' + FROM_START_DATE_ + '&TO_START_DATE_=' + TO_START_DATE_ + '&DRAFTOR_ID_='+ EMP_ID_+ '&DEPT_STATUS_='+ '0' +'&limit=' + this.paginations.page_size + '&page=' + this.paginations.page_index + ''
				).then(function (res) {
					if (res.data.success) {
						that.paginations.total = res.data.total;
						that.weekWorkList = [];
						res.data.weekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								WEEK_WORK_ID_: item.WEEK_WORK_ID_,
								WEEK_START_DATE_: dtime(item.WEEK_START_DATE_).format('YYYY-MM-DD '),
								WEEK_END_DATE_: dtime(item.WEEK_END_DATE_).format('YYYY-MM-DD '),
								DEPT_NAME_: item.DEPT_NAME_,
								DEPT_MANAGER_NAME_: item.DEPT_MANAGER_NAME_,
								POSI_NAME_: item.POSI_NAME_,
								DRAFTOR_NAME_: item.DRAFTOR_NAME_,
								WEEK_NUM_: item.WEEK_NUM_,
								WEEK_: item.WEEK_
							}
							that.weekWorkList.push(tableItem);
						})
						that.weekWorkloading = false;
					} else {
						that.$message.error(res.data.message);
					}

					})
					.catch(function (res) {
						that.weekWorkloading = false;
					})
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
            //筛选
			selectWeekWork(weekWork_data){
				this.weekWork_data.startDatePage = this.weekWork_data.startDate;
				this.weekWork_data.endDatePage = this.weekWork_data.endDate;

				this.getWeekWorkList({
					fun: () => {
					}
				});
            },
            //点击添加按钮
			preInsertWeekWork(){
				this.insertWeekWorkDialog.show = true;
				this.insertWeekWorkDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_weekWork_ref.setInsertWeekWorkForm();
				})
            },
			_completeInsertWeekWork(returnValue){
				this.insertWeekWorkTemp = returnValue;
				let that = this;
				const tableItem = {
					WEEK_WORK_ID_: this.insertWeekWorkTemp.WEEK_WORK_ID_,
					WEEK_START_DATE_: dtime(this.insertWeekWorkTemp.WEEK_START_DATE_).format('YYYY-MM-DD '),
					WEEK_END_DATE_: dtime(this.insertWeekWorkTemp.WEEK_END_DATE_).format('YYYY-MM-DD '),
					DEPT_NAME_: this.insertWeekWorkTemp.DEPT_NAME_,
					DEPT_MANAGER_NAME_: this.insertWeekWorkTemp.DEPT_MANAGER_NAME_,
					POSI_NAME_: this.insertWeekWorkTemp.POSI_NAME_,
					DRAFTOR_NAME_: this.insertWeekWorkTemp.DRAFTOR_NAME_,
					WEEK_NUM_: this.insertWeekWorkTemp.WEEK_NUM_,
					WEEK_: this.insertWeekWorkTemp.WEEK_
				};
				this.weekWorkList.push(tableItem);
            },
			_completeInsertUpdateWeekWork(returnValue){
				let updateWeekWorkTemp = returnValue;
				let that =this;
				for (let key in updateWeekWorkTemp) {//装载被修改数据到页面
					(that.weekWorkList[0][key] != null) ? that.weekWorkList[0][key] = updateWeekWorkTemp[key] : '';
				}
            },
            //点击编辑按钮
			onEditWeekWork(row, index){
				this.updateWeekWorkDialog.show = true;
				this.updateWeekWorkDialog.dialogVisible = true;
				this.updateIndex = index;
				this.$nextTick(_ => {
					this.$refs.update_weekWork_ref.WEEK_WORK_ID_ = row.WEEK_WORK_ID_;
					this.$refs.update_weekWork_ref.setLoadWeekWorkForm();
				})
            },
			_completeUpdateWeekWork(returnValue){
				let updateWeekWorkTemp = returnValue;
				let that =this;
				for (let key in updateWeekWorkTemp) {//装载被修改数据到页面
					(that.weekWorkList[this.updateIndex][key] != null) ? that.weekWorkList[this.updateIndex][key] = updateWeekWorkTemp[key] : '';
				}
            },
            //点击删除按钮
			onDeleteWeekWork(row, index){
				//根据id来删除数据
				let that = this;

				let data = {
					WEEK_WORK_ID_: row.WEEK_WORK_ID_
				}
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() =>{
					let that = this;
					axios({
						method:'POST',
						url: this.baseUrl + 'deleteWeekWork.do',
						data:{
							WEEK_WORK_ID_:row.WEEK_WORK_ID_
						},
						transformRequest:[function (data) {
							let ret = ''
							for (let it in data){
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
							}
							return ret
						}],
						headers:{'Content-Type': "application/x-www-form-urlencoded"}
					}).then(function(res){
						if (res.data.success) {
							that.$message.success('删除成功');
							that.weekWorkList.splice(index,1);
						} else {
							that.$message.error(res.data.message);
						}

					}).catch(function(err){
						/*请求失败*/
						that.$message.error('删除失败请重试')
					})
				})
            },
			_closeUpdateWeekWorkDialog(){
				this.updateWeekWorkDialog.dialogVisible = false;
            },
			_closeInsertWeekWorkDialog(){
				this.insertWeekWorkDialog.dialogVisible = false;
			}
        },
	}
</script>

<style lang="less" scoped>

</style>
