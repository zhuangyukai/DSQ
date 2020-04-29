<template>
    <div class="fillcontain">
        <div class="riderForm">
            <el-form
                    :inline="true"
                    :model='riderForm'
                    ref="riderForm"
                    class="demo-form-inline search-form">
                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='_selectRider()'>筛选
                    </el-button>
                </el-form-item>
                <el-form-item class="btnRight">
                    <el-button type="primary" size="mini" icon="view" @click='_preInsertRider()'>添加</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    highlight-current-row
                    v-loading="riderGrid.gridLoading"
                    :data="riderGrid.projectReqList"
                    :style="riderGrid.gridTableStyle"
                    :height="riderGrid.gridTableStyle.height"
                    align='center'
            >
                <el-table-column
                        v-if="idFlag"
                        prop="RIDER_ID_"
                        label="附件ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="RIDER_NAME_"
                        label="附件名称"
                        align='center'
                >
                </el-table-column>
                <el-table-column
                        prop="RIDER_LENGTH_"
                        label="大小"
                        width="100">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="160">
                    <template slot-scope='scope'>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='_deleteProjectReq(scope.row,scope.$index)'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='riderGrid.pagination.total > 0'
                                :page-sizes="riderGrid.pagination.page_sizes"
                                :page-size="riderGrid.pagination.page_size"
                                :layout="riderGrid.pagination.layout"
                                :total="riderGrid.pagination.total"
                                :current-page='riderGrid.pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>
<script>
	import axios from 'axios';
	export default {
		data(){
			return {
				idFlag: false,
                riderForm:{
				    ID_ : ''
                },
				riderGrid: {
					sortNum: 0,
					gridLoading: false,
					riderList: [],
					gridTableStyle: {
						width: '100%',
						height:'400px'
					},
					pagination: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
            }
        },
        methods:{
			_selectRider(){
			    this.getList();
            },
			_preInsertRider(){

            },
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {

				this.riderGrid.gridLoading = true;
				let query = this.$route.query;
				this.riderGrid.pagination.page_index = page || parseInt(query.page) || 1;
				this.riderGrid.pagination.page_size = page_size || parseInt(query.page_size) || this.riderGrid.pagination.page_size;
				let data = {
					pageIndex: this.riderGrid.pagination.page_index,
					pageSize: this.riderGrid.pagination.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectRider.do',
					data: {
						ID_: this.riderForm.ID_,
						limit: this.riderGrid.pagination.page_size,
						page: this.riderGrid.pagination.page_index
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
					that.riderGrid.pagination.total = res.data.total;
					that.riderGrid.riderList = [];

					let riderList = res.data.riderList;

					for (let i = 0; i < riderList.length; i++) {
						const tableItem = {
							sortNum: that.riderGrid.sortNum + (i + 1),
							RIDER_ID_: riderList[i].RIDER_ID_,
							ID_: riderList[i].ID_,
							TYPE_: riderList[i].TYPE_,
							RIDER_NAME_: riderList[i].RIDER_NAME_,
							RIDER_LENGTH_: riderList[i].RIDER_LENGTH_
						};
						that.riderGrid.riderList.push(tableItem);
					}
					that.riderGrid.gridLoading = false;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.riderGrid.gridLoading = false;
				})
			},
			// 上下分页
			handleCurrentChange(page) {
				this.riderGrid.sortNum = this.riderGrid.pagination.page_size * (page - 1);
				this.getList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			setPath(field, value) {
				let path = this.$route.path,
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
        }
	}
</script>
