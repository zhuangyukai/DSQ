<template>
            <div id="ganttDiv" v-loading="ganttDivLoading">
                <table id="ganttTable" border="1" cellpadding="0" cellspacing="0">
                    <tr id="trBigDate" class="trBigDate">
                    </tr>
                    <tr id="trDate" class="trDate">
                    </tr>
                </table>
            </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';

	export default {
		name: "viewProjectGantt",
		data() {
			return {
				tableStartDate: '',
				tableEndDate: '',
				tableTdSum: 0,
				moduleForm: {
					PROJECT_ID_: ''
				},
				ganttDivLoading: true,
				CODE_LIST: []
			}
		},
		mounted: function () {
			//this._initGantt();
			//this._initGanttDate();
		},
		methods: {
			async doSyncMethod() {
				await this._selectCode();
				//await this.selectModule();
				await this._selectModuleInGantt();
				//this.getProjectList();
			},
			async _selectCode() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
					data: {},
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
						for (let i = 0; i < that.CODE_LIST.length; i++) {
							if (that.CODE_LIST[i].CATEGORY_ == 'MODULE_STATUS') {
								that.moduleTree.moduleStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			selectModule() {
				this.moduleTree.mainLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectModule.do',
					data: {
						PROJECT_ID_: that.moduleForm.PROJECT_ID_,
						notModuleStatus: '0'
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
						let moduleList = res.data.moduleList;

						for (let i = 0; i < moduleList.length; i++) {
							moduleList[i].STATUS_DESC_ = that.moduleTree.moduleStatusCodeMapList[moduleList[i].MODULE_STATUS_];
						}
						let resultArray = that._processLevelModuleData(moduleList)
						that.moduleTree.moduleList = resultArray
						that.moduleTree.mainLoading = false;

						//that.moduleList = res.data.children;
						//that.moduleTree.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.moduleTree.mainLoading = false;
				})
			},
			_processLevelModuleData(dataArray) {
				let that = this
				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_MODULE_ID_ == null) {
						item['level'] = level;
						resultArray.push(item)
						that._loadChildrenData(resultArray, dataArray, item, level + 1)
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
					if (originItem.PARENT_MODULE_ID_ == item.MODULE_ID_) {
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
				let className = 'pid-' + row.PARENT_MODULE_ID_;
				if (
					row.PARENT_MODULE_ID_ !== null &&
					(row['visible'] !== true || row['hiddenByCategory'] === true)
				) {
					className += ' hiddenRow'
				}

				if (row.MODULE_STATUS_ == '9') {
					className += ' moduleTreeRowClass9';
				} else if (row.MODULE_STATUS_ == '1') {
					className += ' moduleTreeRowClass1';
				}

				return className
			},
			async _selectModuleInGantt() {
				let that = this;
				that.ganttDivLoading = true;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectModuleInGantt.do',
					data: {
						PROJECT_ID_: that.moduleForm.PROJECT_ID_
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
						let result = res.data.children;
						if (result != null) {
							that._initGantt(res.data.MIN_START_DATE_, res.data.MAX_END_DATE_)
							that._initGanttDate(result);
						}

						that.ganttDivLoading = false;

					} else {
						that.$message.error(res.data.message);
						that.ganttDivLoading = false;
					}
				}).catch(function (err) {
					that.ganttDivLoading = false;
				});
			},
			//初始化甘特图两个标题行(月份行, 天行)
			_initGantt(MIN_START_DATE_, MAX_END_DATE_) {
				console.log(new Date(MIN_START_DATE_))
				let startDate = new Date(MIN_START_DATE_ + " 00:00:00");
				let endDate = new Date(MAX_END_DATE_ + " 00:00:00");

				//给全局赋值
				let temp = new Date(startDate);
				temp.setDate(1);
				this.tableStartDate =new Date(temp.getTime() - 7 * (1000 * 60 * 60 * 24));
				//----赋值结束
				let dayArr = [];
				let intervalMonth = endDate.getFullYear() * 12 + endDate.getMonth() - (startDate.getFullYear() * 12 + startDate.getMonth());
				let tempDate = new Date();
				let forEachDate = startDate;
				let daySum = 0;
				for (let i = 0; i < intervalMonth + 2; i++) {
					let monthDay = 0;
					if (i == 0) {
						let iDate = this.tableStartDate;
						monthDay = 7;
						dayArr.push({
							year: this.tableStartDate.getFullYear(),
							month: (this.tableStartDate.getMonth() + 1) > 9 ? (this.tableStartDate.getMonth() + 1) : '0' + (this.tableStartDate.getMonth() + 1),
							monthDay: monthDay
						});
						forEachDate = new Date(this.tableStartDate.getFullYear(), this.tableStartDate.getMonth() + 1, 1);
						daySum += monthDay
					} else {
						tempDate.setFullYear(forEachDate.getFullYear());
						tempDate.setMonth(forEachDate.getMonth());
						tempDate.setDate(1);
						tempDate.setDate(tempDate.getDate() - 1);
						monthDay = this._getMonthLength(forEachDate);
						dayArr.push({
							year: forEachDate.getFullYear(),
							month: (forEachDate.getMonth() + 1) > 9 ? (forEachDate.getMonth() + 1) : '0' + (forEachDate.getMonth() + 1),
							monthDay: monthDay
						});
						if (forEachDate.getMonth() + 1 != 12) {
							forEachDate = new Date(forEachDate.getFullYear(), forEachDate.getMonth() + 1, 1);
						} else {
							forEachDate = new Date(forEachDate.getFullYear() + 1, 0, 1);
						}
						daySum += monthDay;
					}
				}

				for (let i = 0; i < dayArr.length; i++) {
					$('#trBigDate').append('<th colspan="' + dayArr[i].monthDay + '">' + dayArr[i].year + '-' + dayArr[i].month + '</th>');

					if (i == 0) {
						let nextMonthFirstDay = new Date(dayArr[i].year, dayArr[i].month, 1);
						let oneDay = 1000 * 60 * 60 * 24;
						let temDate = new Date(nextMonthFirstDay - (7 * oneDay));
						let date = temDate.getDate();
						for (let j = 0; j < dayArr[i].monthDay; j++) {
							$('#trDate').append('<td>' + (date) + '</td>');
							date++;
						}
					} else {
						for (let j = 0; j < dayArr[i].monthDay; j++) {
							$('#trDate').append('<td>' + (j + 1) + '</td>');
						}
					}
				}
				this.tableTdSum = daySum;
			},
            //根据指定日期 查询当月有多少天
			_getMonthLength(date) {
				let d = new Date(date)
				// 将日期设置为下月一号
				d.setMonth(d.getMonth() + 1)
				d.setDate('1')
				// 获取本月最后一天
				d.setDate(d.getDate() - 1)
				return d.getDate()
			},
			//初始化甘特图内容数据渲染
			_initGanttDate(dataList) {
				let tempHtmlContent = ''; //临时存储html 内容用的, 直接用append 方法 会造成tr闭标签 提前生成
				for (let j = 0; j < dataList.length; j++) {
					console.log(dataList[j].START_DATE_);
					console.log(this.tableStartDate);

					let leftNoStartDayP = parseInt(((new Date(dataList[j].START_DATE_)).getTime() - this.tableStartDate.getTime()) / (1000 * 60 * 60 * 24));
					let intervalDateP = parseInt(((new Date(dataList[j].END_DATE_)).getTime() - (new Date(dataList[j].START_DATE_)).getTime()) / (1000 * 60 * 60 * 24)) + 1;
					console.log("leftNoStartDayP------->" + leftNoStartDayP);
					console.log("intervalDateP------->" + intervalDateP);
					tempHtmlContent = '<tr class="trContent">';
					for (let i = 0; i < this.tableTdSum; i++) {
						if (i < leftNoStartDayP) {
							tempHtmlContent += '<td>&nbsp;</td>';
						} else if (i == leftNoStartDayP) {
							tempHtmlContent += '<td colspan="' + (intervalDateP) + '"><div class="trContentDiv"><span class="tooltip tooltip-turnleft"><span class="tooltip-item">' + dataList[j].MODULE_NAME_ + '</span><span class="tooltip-content">' + dataList[j].MODULE_NAME_ + '</span></span></div></td>';
						} else if (i >= (intervalDateP + leftNoStartDayP)) {
							tempHtmlContent += '<td>&nbsp;</td>';
						}
					}
					tempHtmlContent += '</tr>';
					//遍历第二层甘特图(临时遍历,暂不做成递归遍历)
					if (dataList[j].children.length > 0) {
						for (let c = 0; c < dataList[j].children.length; c++) {
							let leftNoStartDay = parseInt(((new Date(dataList[j].children[c].START_DATE_)).getTime() - this.tableStartDate.getTime()) / (1000 * 60 * 60 * 24));
							let intervalDate = parseInt(((new Date(dataList[j].children[c].END_DATE_)).getTime() - (new Date(dataList[j].children[c].START_DATE_)).getTime()) / (1000 * 60 * 60 * 24)) + 1;
							tempHtmlContent += '<tr class="trContent">';
							for (let i = 0; i < this.tableTdSum; i++) {
								if (i == leftNoStartDayP - 1) {
									let tdWidth = 26 - 1;
									let jtwidth = (leftNoStartDay - (leftNoStartDayP - 1)) * 26;
									let tdHeight = 26;
									let czHeight = tdHeight * (c + 2);
									let jtwidth1 = jtwidth - 10;
									tempHtmlContent += '<td><div style="border: 0px red solid; width: ' + jtwidth + 'px; height: ' + ((26 * (c + 2)) - 1) + 'px; margin-top: ' + ((-27 * (c + 1)) + 1) + 'px; opacity: 0.7"><svg xmlns="http://www.w3.org/2000/svg" width="' + jtwidth + '" height="' + (26 * (c + 2)) + '"><polygon points="25 8 0 8 0 ' + (czHeight - 8) + ' ' + jtwidth1 + ' ' + (czHeight - 8) + ' ' + jtwidth1 + ' ' + (czHeight - 4) + ' ' + jtwidth + ' ' + (czHeight - 13) + ' ' + jtwidth1 + ' ' + (czHeight - 22) + ' ' + jtwidth1 + ' ' + (czHeight - 18) + ' 10 ' + (czHeight - 18) + ' 10 18 ' + tdWidth + ' 18" stroke="#FFF0AC" fill="#FFE66F"></polygon></svg></div></td>';
								} else if (i < leftNoStartDay) {
									tempHtmlContent += '<td>&nbsp;</td>';
								} else if (i == leftNoStartDay) {
									tempHtmlContent += '<td colspan="' + (intervalDate) + '"><div class="trContentDivChild"><span class="tooltip tooltip-turnleft"><div class="toolTempDiv"><span class="tooltip-item">' + dataList[j].children[c].MODULE_NAME_ + '</span></div><span class="tooltip-content">' + dataList[j].children[c].MODULE_NAME_ + '</span></span></div></td>';
								} else if (i >= (intervalDate + leftNoStartDay)) {
									tempHtmlContent += '<td>&nbsp;</td>';
								}
							}
							tempHtmlContent += '</tr>';
						}
					}
					$(tempHtmlContent).appendTo('#ganttTable');
				}

				// $("#ganttTable tr td .trContentDiv").mouseover(function(a){
				// 	$("#divInfo").css("z-index",9999999);//让层浮动
				// 	$("#divInfo").css("top",'122px');//设置提示div的位置
				// 	$("#divInfo").css("left",'100px');
				// 	$("#divInfo").css("visibility","visible");
				// 	$("#divInfo").css('position', 'absolute');
				// })
			},
		}
	}
</script>

<style lang="less">
    #ganttDiv {
        height: 600px;
        width: 100%;
        border: 1px solid #cccccc;
        overflow: auto;
        padding: 0;
    }

    #trDate {
        background-color: #C0C0C0;
        color: #fff;
    }

    #trDate td {
        text-align: center;
        min-width: 25px;
        height: 25px;
    }

    .trContent {
        //border-bottom: 1px solid #cccccc;
        /*height: 26px;*/
        /*min-height: 26px;*/
    }

    .trContent td {
        min-width: 25px;
        height: 25px;
        min-height: 25px;
        max-width: 25px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    #ganttTable td {
        border-left: 1px solid #ccc !important;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        height: 25px; //不加会 跳动??????
        line-height: 25px; //不加会 跳动??????
        vertical-align: middle;
    }

    #ganttTable {
        font-family: verdana, arial, sans-serif;
        font-size: 11px;
        color: #333333;
        border-collapse: collapse;
        table-layout: fixed;
    }

    .trBigDate {
       // background: -webkit-linear-gradient(top, white, #484891);
        background-color:  	#F08080;
        border: 2px solid white;
        color: #fff;
        height: 25px;
        line-height: 25px;
    }

    .trBigDate th {
        border-right: 1px solid white;
    }

    /*#ganttTable td:hover{*/
    /*background-color: #dafdf3;*/
    /*}*/

    #ganttTable tr td .trContentDiv:hover {
        background-color: #ffaad5;
        height: 25px;
        line-height: 25px;
        font-size: 15px;
    }

    .trContent .trContentDiv {
        background-color: #FF99CC;
        text-align: center;
        color: #fff;
        cursor: pointer;
        height: 23px;
        line-height: 23px;
        border-radius: 3px;
    }

    .trContent .trContentDivChild {
        background-color: #FF9224;
        text-align: center;
        color: #fff;
        cursor: pointer;
        height: 23px;
        line-height: 23px;

    }

    .toolTempDiv {
        width: 100%;
        overflow: hidden; /* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow: ellipsis; /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/
    }

    #ganttTable tr td .trContentDivChild:hover {
        background-color: #FF9224;
        height: 25px;
        line-height: 25px;
        font-size: 13px;
    }

    .tooltip {
        position: relative;
        z-index: 999;
    }

    /* Trigger text */

    .tooltip-item {
        font-weight: bold;
        cursor: pointer;
    }

    .tooltip-content {
        position: absolute;
        font-size: 12px;
        background: #FFD9EC;
        z-index: 99999;
        width: 180px;
        height: 15px;
        bottom: 100%;
        left: 20%;
        margin: 0 0 15px -140px;
        padding: 25px;
        text-align: left;
        border-radius: 20px;
        border: 2px solid #613030;
        color: #dd5864;
        opacity: 0;
        cursor: default;
        pointer-events: none;
        -webkit-transition: opacity 1s, -webkit-transform 1s;
        transition: opacity 1s, transform 1s;
    }

    .tooltip-turnright .tooltip-content {
        -webkit-transform: translate3d(0, 50px, 0) rotate3d(1, 1, 1, 6deg);
        transform: translate3d(0, 50px, 0) rotate3d(1, 1, 1, 6deg);
    }

    .tooltip-turnleft .tooltip-content {
        -webkit-transform: translate3d(0, 50px, 0) rotate3d(1, 1, 1, -15deg);
        transform: translate3d(0, 50px, 0) rotate3d(1, 1, 1, -15deg);
    }

    .tooltip:hover .tooltip-content {
        opacity: 0.8;
        -webkit-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
    }

    /* Arrow */

    .tooltip-content::after {
        content: '';
        position: absolute;
        width: 15px;
        height: 15px;
        top: 100%;
        z-index: 11;
        background: url(../../img/tooltip3.svg) no-repeat center center;
        background-size: 100%;
        -webkit-transform-origin: 50% 0;
        transform-origin: 50% 0;
        -webkit-transition: -webkit-transform 1s;
        transition: transform 1s;
    }

    .tooltip-turnright .tooltip-content::after {
        left: 25%;
        -webkit-transform: scale3d(-1, 1, 1) rotate3d(1, 1, 1, 25deg) translate3d(0, -50px, 0);
        transform: scale3d(-1, 1, 1) rotate3d(1, 1, 1, 25deg) translate3d(0, -15px, 0);
    }

    .tooltip-turnleft .tooltip-content::after {
        right: 25%;
        /*-webkit-transform: rotate3d(1,1,1,25deg) translate3d(0,-15px,0);*/
        /*transform: rotate3d(1,1,1,-15deg) translate3d(0,-10px,5);*/
    }

    .tooltip-turnright:hover .tooltip-content::after {
        -webkit-transform: scale3d(-1, 1, 1) rotate3d(1, 1, 1, 0) translate3d(0, -5px, 0);
        transform: scale3d(-1, 1, 1) rotate3d(1, 1, 1, 0) translate3d(0, -5px, 0);
    }

    .tooltip-turnleft:hover .tooltip-content::after {
        /*-webkit-transform: rotate3d(1,1,1,0) translate3d(0,-5px,0);*/
        /*transform: rotate3d(1,1,1,0) translate3d(0,-5px,0);*/
    }

    .trContent {
        position: relative;
    }

    .trTitleDiv {
        position: absolute;
        width: 70px;
        height: 23px;
        border: 0px solid #00b0ff;
        border-radius: 0 30px 30px 0;
        color: white;
        background-color: #909399;
        top: 1px;
        line-height: 23px;
        font-size: 11px;
        opacity: 0.5;
        cursor: pointer;
        font-weight: bold;
        overflow: hidden;

    }

    #ganttTable tr td .trTitleDiv:hover {
        background-color: yellow;
        color: #72767b;
    }

    .svgDivX {
        position: absolute;
        border: 0px solid #00b0ff;
        height: 23px;
        top: 1px;
    }

    .currentStyleColor2 .el-table {
        //去掉table的border start----------------------------
        border: 0;
        th,
        tr,
        td {
            border: 0;
            // background-color: #fff;
        }
        &::before {
            height: 0px;
        }
        &::after {
            width: 0;
        }

        .el-table__fixed:before {
            height: 0;
        }
        //去掉table的border end----------------------------
    }

    .moduleTreeDiv {
        .hiddenRow {
            display: none;
        }
        position: relative;
        top: 31px;
    }

    .moduleTreeHearder {
        font-size: 12px;
    }

    .moduleDateClass {
        font-size: 10px;
    }

    .moduleTreeRowClass1 {
        background-color: #FFC0CB !important;
    }

    .moduleTreeRowClass9 {
        background-color: #FFF0F5 !important;
    }

    #moduleTableTree {
        th{
            height: 25px;
            line-height: 25px;
            padding: 0 !important;
        }
        td{
            border-bottom : 1px solid #ccc;
            height: 26px;
            padding: 0 !important;
        }
    }


</style>
