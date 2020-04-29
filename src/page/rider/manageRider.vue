<template>
    <div class="fillcontain"  v-loading="riderGrid.gridLoading" style="height: 500px;">
        <el-scrollbar>
            <el-upload
                    class="upload-demo"
                    ref="upload"
                    name="file"
                    action="http://10.18.26.114:9090/DS/insertRider.do"
                    :file-list="riderGrid.riderList"
                    :on-preview="DownloadRider"
                    :on-change="OnChange"
                    :on-remove="OnRemove"
                    style="height: 450px"
                    multiple
                    :auto-upload="false">

                <el-button slot="trigger" size="small" type="primary">选择</el-button>
                <!--<el-button style="margin-left: 10px;" size="small" type="success" @click="getList">查询</el-button>-->
                <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>
            </el-upload>
        </el-scrollbar>

    </div>
</template>
<script>
	import axios from 'axios';
	export default {
		data(){
			return {
				idFlag: false,
                riderForm:{
				    ID_ : '',
                    TYPE_ : '',
                },
				fileList:[],
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
			DownloadRider(file){
				location.href = this.baseUrl + 'loadRiderContent.do?RIDER_ID_=' + file.RIDER_ID_;
			},
			OnChange(file,fileList){
				this.fileList=fileList;
            },
			OnRemove(file,fileList){
				if(file.RIDER_ID_ == "" || file.RIDER_ID_ == undefined || file.RIDER_ID_ == null){
					return;
                }
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'deleteRiderOne.do',
					data: {
						RIDER_ID_: file.RIDER_ID_
					},
					transformRequest: [function (data) {
						let ret = '';
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret;
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					if (res.data.success) {
						that.$message.success('删除成功');
						that.fileList=fileList;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
				})

            },
			uploadImg(f){
				let param = new FormData(); //创建form对象
				param.append('files',f.file);//通过append向form对象添加数据
				param.append('ID_',this.riderForm.ID_);
				param.append('TYPE_',this.riderForm.TYPE_);
                let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'insertRider.do',
					data: param,
					// transformRequest: [function (data) {
					// 	let ret = ''
					// 	for (let it in data) {
					// 		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// 	}
					// 	return ret
					// }],
					headers: {'Content-Type': 'multipart/form-data'}
				}).then(function (res) {
					if (res.data.success) {

					} else {
						that.$message.error('系统错误,请检查文件是否过大');
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.riderGrid.gridLoading = false;
				})
            },
            _deleteRider(file, fileList){

            },
			_selectRider(){
			    this.getList();
            },
			_preInsertRider(){

            },
			submitUpload(){
				this.riderGrid.gridLoading = true;
				let param = new FormData(); //创建form对象
				//param.append('files',f.file);//通过append向form对象添加数据
				param.append('ID_',this.riderForm.ID_);
				param.append('TYPE_',this.riderForm.TYPE_);
				for(let i=0;i<this.fileList.length;i++){
					param.append("files",this.fileList[i].raw);
				}
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'insertRider.do',
					data: param,
					// transformRequest: [function (data) {
					// 	let ret = ''
					// 	for (let it in data) {
					// 		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// 	}
					// 	return ret
					// }],
					headers: {'Content-Type': 'multipart/form-data'}
				}).then(function (res) {
					if (res.data.success) {
						that.getList();
						that.$message.success("操作成功");
						that.riderGrid.gridLoading = false;
					} else {
						that.$message.error('系统错误,请检查文件是否过大');
					}
				}).catch(function (err) {
					/*请求失败*/
					that.getList();
					that.$message.error('操作失败请重试');
					that.riderGrid.gridLoading = false;
				})
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
						TYPE_: this.riderForm.TYPE_,
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
					if (res.data.success) {
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
								RIDER_LENGTH_: riderList[i].RIDER_LENGTH_,
								name :  riderList[i].RIDER_NAME_
							};
							that.riderGrid.riderList.push(tableItem);
						}
						that.riderGrid.gridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
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
