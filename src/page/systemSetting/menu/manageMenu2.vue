<template>
    <div>
        <div class="statistics2">
            <el-row class="searchForm">
                <el-col :span="24">
                    <div class="grid-content">
                        <el-button type="primary" size="mini"
                                   @click='preInsertRootMenu()'>新增根
                        </el-button>
                        <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertSubMenu"
                                   @click='preInsertSubMenu()'>新增下级
                        </el-button>
                        <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateMenu"
                                   @click='preUpdateMenu()'>修改
                        </el-button>
                        <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteMenu"
                                   @click='deleteMenu()'>删除
                        </el-button>
                    </div>
                </el-col>
            </el-row>
            <div class="currentStyleColor">
            <el-table ref="multipleTable" :data="statisticDatas" border style="width: 100%;" size="medium"
                      v-loading="mainLoading"
                      :style="{height : 1000}"
                      :row-class-name="rowClassNameHandler" row-key="MENU_ID_"
                      :row-style="{height:0}"
                      :cell-style="{padding:0}"
                      :height="gridTableStyle.height"
                      @row-click="clickRow"
                      highlight-current-row
            >
                <el-table-column label="菜单名称" width="460" align="left" show-overflow-tooltip>
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
                              :style="{marginLeft: 4 + 'px'}">{{ scope.row.MENU_NAME_ }}</span>
                    </template>
                </el-table-column>
                <!--<el-table-column prop="DUTY_ID_" label="分类ID" width="80" align="center"></el-table-column>-->
                <!--<el-table-column prop="PARENT_DUTY_ID_" label="父类ID" width="80" align="center"></el-table-column>-->
                <el-table-column label="菜单类型" align="left" width="100px">
                    <template slot-scope="scope">
                        <span>{{scope.row.MENU_TYPE_ == '0' ? '目录' : scope.row.MENU_TYPE_ == '1' ? 'JSP' : scope.row.MENU_TYPE_ == '2' ? 'INNER JSP' : scope.row.MENU_TYPE_ == '3' ? 'AJAX' : scope.row.MENU_TYPE_ == '11' ? '快捷登录' : null}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="URL_" label="链接地址" align="left" width="900px">
                </el-table-column>
                <el-table-column label="VUE" align="left">
                    <template slot-scope="scope">
                        <span>{{scope.row.VUE_ == '1' ? '是' : scope.row.VUE_ == '0' ? '否' : null}}</span>
                    </template>
                </el-table-column>

                <el-table-column prop="ORDER_" width="80" label="排序" align="left">
                </el-table-column>
            </el-table>
            </div>
        </div>
        <!--新增根菜单-->
        <el-dialog
                :title="insertRootMenuDialog.title"
                :visible.sync="insertRootMenuDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="insertRootMenuDialog.style"
                :width="insertRootMenuDialog.width"
                @close="_closeInsertRootMenuDialog">
            <template>
                <insertRootMenuCom ref="insert_root_menu_ref" v-if="insertRootMenuDialog.dialogVisible"
                                   @insertRootMenuListeners="_insertRootMenuReturn"></insertRootMenuCom>
            </template>
        </el-dialog>
        <!--新增下级菜单-->
        <el-dialog
                :title="insertSubMenuDialog.title"
                :visible.sync="insertSubMenuDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="insertSubMenuDialog.style"
                :width="insertSubMenuDialog.width"
                @close="_closeInsertSubMenuDialog">
            <template>
                <insertSubMenuCom ref="insert_sub_menu_ref" v-if="insertSubMenuDialog.dialogVisible"
                                  @insertSubMenuListeners="_insertSubMenuReturn"></insertSubMenuCom>
            </template>
        </el-dialog>

        <!--修改菜单-->
        <el-dialog
                :title="updateMenuDialog.title"
                :visible.sync="updateMenuDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="updateMenuDialog.style"
                :width="updateMenuDialog.width"
                @close="_closeUpdateSubMenuDialog">
            <template>
                <updateMenuCom ref="update_menu_ref" v-if="updateMenuDialog.dialogVisible"
                               @updateMenuListeners="_updateMenuReturn"></updateMenuCom>
            </template>
        </el-dialog>
    </div>
</template>

<script>
	import axios from 'axios';
	import insertRootMenuCom from "../menu/preInsertRootMenu.vue";
	import insertSubMenuCom from "../menu/preInsertSubMenu.vue";
	import updateMenuCom from "../menu/preUpdateMenu.vue";

	export default {
		components: {insertRootMenuCom, insertSubMenuCom, updateMenuCom},
		name: "manageMenu2",
		data() {
			return {
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				statisticDatas: [],
				mainLoading : false,
				BUTTON_STATUS: {
					preInsertSubMenu : true,
					preUpdateMenu : true,
					deleteMenu : true,
				},
				//新增根菜单的窗口
				insertRootMenuDialog:{
					show: false,
					title: '新增根菜单',
					insertRootMenuDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//新增下级菜单的窗口
				insertSubMenuDialog:{
					show: false,
					title: '新增下级菜单',
					insertSubMenuDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//修改菜单的窗口
				updateMenuDialog:{
					show: false,
					title: '新增下级菜单',
					updateMenuDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				multipleSelection: [],//checkbox
				numbers: [],
            }
		},
		mounted() {
			this.loadStatisticData()
		},
        methods: {
			//点击新增根的按钮
			preInsertRootMenu(){
				this.insertRootMenuDialog.show = true;
				this.insertRootMenuDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_root_menu_ref.setInsertRootMenu();
				})
			},
			//新增根后的变化
			_insertRootMenuReturn(returnValue){
				let insertRootMenuTemp = returnValue;
				const tableItem = {
					MENU_ID_: insertRootMenuTemp.MENU_ID_,
					MENU_NAME_: insertRootMenuTemp.MENU_NAME_,
					MENU_TYPE_: insertRootMenuTemp.MENU_TYPE_,
					URL_: insertRootMenuTemp.URL_,
					VUE_: insertRootMenuTemp.VUE_,
					ORDER_: insertRootMenuTemp.ORDER_,
				};
				//this.statisticDatas.push(tableItem);
                this.loadStatisticData();
				this.insertRootMenuDialog.show = false;
			},
			//新增下级的按钮
			preInsertSubMenu(){
				let that = this;
				this.insertSubMenuDialog.show = true;
				this.insertSubMenuDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_sub_menu_ref.PARENT_MENU_ID_ = that.multipleSelection.MENU_ID_;
					this.$refs.insert_sub_menu_ref.setInsertSubMenu();
				})
			},
			//新增下级后的变化
			_insertSubMenuReturn(returnValue){
				this.loadStatisticData();
				this.insertSubMenuDialog.show = false;
			},
			//新增下级关闭监听
			_closeInsertSubMenuDialog(){
				this.insertSubMenuDialog.dialogVisible = false;
			},
			//修改按钮
			preUpdateMenu(){
				let that = this;
				this.updateMenuDialog.show = true;
				this.updateMenuDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_menu_ref.MENU_ID_ = that.multipleSelection.MENU_ID_;
					this.$refs.update_menu_ref.setUpdateMenu();
				})
			},
			//修改后的变化
			_updateMenuReturn(returnValue){
				let updateMenuTemp = returnValue;
				let that =this;
				for (let key in updateMenuTemp) {//装载被修改数据到页面
					(that.statisticDatas[that.numbers][key] != null) ? that.statisticDatas[that.numbers][key] = updateMenuTemp[key] : '';
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.multipleSelection[key] != null) ? that.multipleSelection[key] = updateMenuTemp[key] : '';
				}
				this.updateMenuDialog.show = false;
			},
			//关闭修改的监听
			_closeUpdateSubMenuDialog(){
				this.updateMenuDialog.dialogVisible = false;
			},
			//点击删除按钮
			deleteMenu(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteMenuNew.do',
						data: {
							MENU_ID_: that.multipleSelection.MENU_ID_
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
							that.multipleSelection = null;
							that._setButtonStatus();

							that.loadStatisticData();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			},
			loadStatisticData() {
				this.mainLoading = true;
				let self = this
				let params = {
					pastDays: self.pastDays
				}

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'selectMenu.do'
				).then(function (res) {
					let result = res.data.menuList;
					let resultArray = self._processLevelStatisticData(result)
					self.statisticDatas = resultArray
					self.mainLoading = false;
				})
			},
			_processLevelStatisticData(dataArray) {
				let self = this
				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_MENU_ID_ == null) {
						item['level'] = level;
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
					if (originItem.PARENT_MENU_ID_ == item.MENU_ID_) {
						item['hasChildren'] = true
						item['showChildren'] = true

						originItem['level'] = level
						originItem['visible'] = true // 子项默认隐藏(false 隐藏,  true 自动展开) 跟随上面showChildren 也得改成true;
						originItem['hiddenByCategory'] = false

						resultArray.push(originItem)
						self._loadChildrenData(
							resultArray,
							originArray,
							originItem,
							level + 1
						)
					}
				}
			},
			rowClassNameHandler({row, rowIndex}) {
				let className = 'pid-' + row.PARENT_MENU_ID_;
				if (
					row.PARENT_MENU_ID_ !== null &&
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
					if (tempItem.PARENT_MENU_ID_ === item.MENU_ID_) {
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
			clickRow(row, column) {
				this.multipleSelection = row;
				this._setButtonStatus();

				this.statisticDatas.forEach((r, i) => {
					if (r.MENU_ID_ == row.MENU_ID_) {
						this.numbers = i;
					}
				});
			},
			_setButtonStatus(){
				if(this.multipleSelection == null){
					this.BUTTON_STATUS.preInsertSubMenu = true;
					this.BUTTON_STATUS.preUpdateMenu = true;
					this.BUTTON_STATUS.deleteMenu = true;
				}else{
					this.BUTTON_STATUS.preInsertSubMenu = false;
					this.BUTTON_STATUS.preUpdateMenu = false;
					this.BUTTON_STATUS.deleteMenu = false;
                }
			},
			//新增根关闭的监听
			_closeInsertRootMenuDialog(){
				this.insertRootMenuDialog.dialogVisible = false;
			},
        }
	}
</script>

<style lang="less">
    .statistics2 {
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
    /*!* 用来设置当前页面element全局table 选中某行时的背景色*!*/
    /*.currentStyleColor .el-table__body tr.current-row>td{*/
        /*background-color: #AAAAFF !important;*/
         /*color: #fff;   !* 设置文字颜色，可以选择不设置 *!*/
    /*}*/
    /*!* 用来设置当前页面element全局table 鼠标移入某行时的背景色*!*/
    /*.el-table--enable-row-hover .el-table__body tr:hover>td {*/
        /*background-color:  	#d0d0d0;*/
        /*!* color: #f19944; *! !* 设置文字颜色，可以选择不设置 *!*/
    /*}*/
</style>
