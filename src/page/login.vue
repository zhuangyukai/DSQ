<template>

    <div id="testHpIndex">
        <div id="imgTest" class="div"></div>
        <div id="imgTest2" class="div"></div>
        <div id="imgTest3" class="div"></div>
        <div class="page-container testLogin">
            <h1 class="loginH1">项目管理</h1>
            <!--<form>-->
                <!--<input type="text" name="username" class="username" v-model="loginForm.username" placeholder="账号">-->
                <!--<input type="password" name="password" class="password" v-model="loginForm.password" placeholder="密码">-->
                <!--<button @click="onLogining">Login</button>-->
            <!--</form>-->
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
                <el-form-item prop="username">
                    <!--<input type="text" name="username" class="username" v-model="loginForm.username" placeholder="账号">-->
                    <input type="text" name="username" class="username" v-model="loginForm.username" placeholder="账号">
                    <!--<el-input class="area-username" type="text" placeholder="用户名" v-model="loginForm.username"-->
                              <!--size="15"></el-input>-->
                </el-form-item>
                <el-form-item prop="password">
                    <input type="password" name="password" class="password" v-model="loginForm.password" placeholder="密码">
                    <!--<el-input class="area-password" type="password" placeholder="密码" v-model="loginForm.password"-->
                              <!--size="15" @keyup.enter.native="submitForm('loginForm')"></el-input>-->
                </el-form-item>
                <el-form-item>
                    <!--<button @click="onLogining">Login</button>-->
                    <el-button type="primary" :loading="mainLoading" @click="submitForm('loginForm')" class="submit_btn" >登陆</el-button>
                </el-form-item>
            </el-form>

            <!--&lt;!&ndash;/*外层最大容器*/&ndash;&gt;
            <div class="wrap">
                &lt;!&ndash;	/*包裹所有元素的容器*/&ndash;&gt;
                <div class="cube">
                    &lt;!&ndash;前面图片 &ndash;&gt;
                    <div class="out_front">
                        <img src="../img/img01.jpg" class="pic" />
                    </div>
                    &lt;!&ndash;后面图片 &ndash;&gt;
                    <div class="out_back">
                        <img src="../img/img02.jpg" class="pic"/>
                    </div>
                    &lt;!&ndash;左图片 &ndash;&gt;
                    <div class="out_left">
                        <img src="../img/img03.jpg" class="pic" />
                    </div>
                    <div class="out_right">
                        <img src="../img/img04.jpg" class="pic" />
                    </div>
                    <div class="out_top">
                        <img src="../img/img05.jpg" class="pic" />
                    </div>
                    <div class="out_bottom">
                        <img src="../img/img06.jpg" class="pic" />
                    </div>
                    &lt;!&ndash;小正方体 &ndash;&gt;
                    <span class="in_front">
					<img src="../img/img07.jpg" class="in_pic" />
				</span>
                    <span class="in_back">
					<img src="../img/img08.jpg" class="in_pic" />
				</span>
                    <span class="in_left">
					<img src="../img/img09.jpg" class="in_pic" />
				</span>
                    <span class="in_right">
					<img src="../img/img10.jpg" class="in_pic" />
				</span>
                    <span class="in_top">
					<img src="../img/img11.jpg" class="in_pic" />
				</span>
                    <span class="in_bottom">
					<img src="../img/img12.jpg" class="in_pic" />
				</span>
                </div>
            </div>-->

        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mUtils from 'utils/mUtils';
	import {mapActions, mapState, mapGetters} from 'vuex';
	import '../js/jquery-1.8.2.min';
	import '../js/scripts';
	import '../js/testBack';
	import '../js/temp';

	export default {
		data() {
			return {
				mainLoading : false,
				loginForm: {
					username: '',
					password: ''
				},
				rules: {
					/*username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
						{ min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],*/
				},
				showLogin: false,
				ip: '',
				menuDateTemp: []
			}
		},
		mounted() {
			this.showLogin = true;
			//this.getip();  // 在页面初始化时，就去获取公网ip
			this.keyupEnter();
		},
		computed: {
			...mapGetters(['menuitems', 'isLoadRoutes'])
		},
		methods: {
			...mapActions(['addMenu', 'loadRoutes']),
			keyupEnter(){
				document.onkeydown = e =>{
					let body = document.getElementsByTagName('body')[0]
					if (e.keyCode === 13) {
                            this.submitForm('loginForm');
					}
				}
			},
			async doSyncMethod() {
				await this.getMenuDate();
				this._ceshi();
			},
			async getMenuDate() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectMenuNew.do',
					data: {},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					that.menuDateTemp = res.data.children;
				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
				});
			},
			onLogining(){
				let that = this;
				let userinfo = this.loginForm;
				axios({
					method: 'POST',
					url: this.baseUrl + 'login.do',
					data: {
						EMP_CODE_ :  userinfo.username,
						PASSWORD_ :  userinfo.password
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
					that.saveUserInfo(res.data.operator.EMP_NAME_, res.data.operator.EMP_ID_, res.data.operator.POSI_EMP_ID_, res.data.operator.POSI_NAME_, res.data.operator.EMP_CODE_, res.data.operator.ORG_NAME_, res.data.operator.ORG_ID_) // 存入缓存，用于显示用户名
					that.generateMenuPushIndex() //模拟动态生成菜单并定位到index

					that.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
				});

				// this.$ajax.post(
				// 	this.baseUrl + 'login.do?EMP_CODE_=' + userinfo.username + '&PASSWORD_=' + userinfo.password + ''
				// )
                //
				// 	.then(function (res) {
				// 		if (res.data.success) {
				// 			that.saveUserInfo(res.data.operator.EMP_NAME_, res.data.operator.EMP_ID_, res.data.operator.POSI_EMP_ID_, res.data.operator.POSI_NAME_, res.data.operator.EMP_CODE_, res.data.operator.ORG_NAME_) // 存入缓存，用于显示用户名
				// 			that.generateMenuPushIndex() //模拟动态生成菜单并定位到index
                //
				// 			that.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
				// 		} else {
				// 			that.$message.error('登录失败');
				// 		}
				// 	})
				// 	.catch(function (res) {
				// 		that.$message.error('登录失败')
				// 	})


				/*if (valid) {
                    //用户登录的接口
                    let userinfo = this.loginForm;
                    let data = {
                        ip:this.ip,
                        url:'http://ip.taobao.com/service/getIpInfo.php?ip='
                    }
                    let userData = Object.assign(userinfo, data);
                    axios({
                        type:'get',
                        path:'/api/user/login',
                        data:userData,
                        fn:data=>{
                            if(data.status == 1){
                                this.saveUserInfo() // 存入缓存，用于显示用户名
                                this.generateMenuPushIndex() //模拟动态生成菜单并定位到index
                                this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
                            }else{
                                this.$message.error('登录失败请重试')
                            }
                        },
                        errFn:res => {
                            this.$message.error('请求出错11：'+res)
                        }
                    })
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '请输入正确的用户名密码',
                        offset: 100
                    });
                    return false;
                }*/
            },
			generateMenuPushIndex() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectUserMenuOld.do',
					data: {
						VUE_: '1'
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
					that.menuDateTemp = res.data.children;
					console.log(11);
					that._ceshi();
					console.log(22);

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
					that.mainLoading = false;
				});
			},
			_ceshi() {
				const menuData = this.menuDateTemp;
				mUtils.setStore('menuData', menuData)     // 将菜单放入缓存。
				this.addMenu(menuData);     			  // 生成菜单,将菜单放入store 。
				// if (!this.isLoadRoutes) {  // 首次进来为false,改变其状态为true
				// 	const routes = mUtils.generateRoutesFromMenu(menuData) //根据菜单生成的路由信息,需要将数据库返回的对象key值转成小写
				// 	const asyncRouterMap = [
				// 		{
				// 			path: '/404',
				// 			name: '404',
				// 			hidden: true,
				// 			component: require('page/404.vue')
				// 		},
				// 		{
				// 			path: '/index',
				// 			name: '',
				// 			hidden: true,
				// 			component: require('layout/home.vue'),
				// 			redirect: '/index',
				// 			children: routes
				// 		}
				// 	]
				// 	this.$router.addRoutes(asyncRouterMap);
				// 	this.loadRoutes()   // true,第二次进来不用再去加载路由
				// }
				console.log(20);
				const routes = mUtils.generateRoutesFromMenu(menuData) //根据菜单生成的路由信息,需要将数据库返回的对象key值转成小写
				const asyncRouterMap = [
					{
						path: '/404',
						name: '404',
						hidden: true,
						component: require('page/404.vue')
					},
					{
						path: '/index',
						name: '',
						hidden: true,
						component: require('layout/home.vue'),
						redirect: '/index',
						children: routes
					}
				]
				console.log(21);
				this.$router.addRoutes(asyncRouterMap);
				this.$router.push('/index');
				this.showMessage('success', '登录成功');
			},
			showMessage(type, message) {
				this.$message({
					type: type,
					message: message
				});
			},
			//保存用户信息到缓存
			saveUserInfo(EMP_NAME_, EMP_ID_, POSI_EMP_ID_, POSI_NAME_, EMP_CODE_, ORG_NAME_, ORG_ID_) {
				const userinfo = {
					username: EMP_NAME_,
					posiEmpId: POSI_EMP_ID_,
					posiName: POSI_NAME_,
					empId: EMP_ID_,
					userCode: EMP_CODE_,
					orgName: ORG_NAME_,
					ORG_ID_ : ORG_ID_
				}
				mUtils.setStore('userinfo', userinfo)
			},
			//模拟动态生成菜单并定位到index
			// generateMenuPushIndex() {
			//
			// 	let that = this;
			// 	this.$ajax.post(
			// 		'http://10.18.26.114:9090/DS/selectUserMenuOldNew.do?POSI_EMP_ID_=' + 'd6fccbcc091c44bfa9b472afaf2c0829' + ''
			// 	).then(function (res) {
			// 		let menuList = res.data.menuList;
			// 		const menuData = menuList;
			// 		mUtils.setStore('menuData', menuData)     // 将菜单放入缓存。
			// 		that.addMenu(menuData);     			  // 生成菜单,将菜单放入store 。
			// 		if (!that.isLoadRoutes) {  // 首次进来为false,改变其状态为true
			// 			const routes = mUtils.generateRoutesFromMenu(menuData) //根据菜单生成的路由信息,需要将数据库返回的对象key值转成小写
			// 			const asyncRouterMap = [
			// 				{
			// 					path: '/404',
			// 					name: '404',
			// 					hidden: true,
			// 					component: require('page/404.vue')
			// 				},
			// 				{
			// 					path: '/index',
			// 					name: '',
			// 					hidden: true,
			// 					component: require('layout/home.vue'),
			// 					redirect: '/index',
			// 					children: routes
			// 				}
			// 			]
			// 			that.$router.addRoutes(asyncRouterMap);
			// 			that.loadRoutes()   // true,第二次进来不用再去加载路由
			// 		}
			//
			// 		that.$router.push('/index')
			// 		that.showMessage('success', '登录成功');
			// 	})
			//
			//
			//
			// 	/*const menuData = [
			// 		{
			// 			path: '/index', name: '首页', component: 'index', icon: 'fa-server', noDropdown: true,
			// 			children: [
			// 				{path: '/index', name: '首页', component: 'index'},
			// 			]
			// 		},
			// 		{
			// 			path: '/infoManage', name: '信息管理', component: 'content', icon: 'fa-asterisk',
			// 			children: [
			// 				{path: '/infoShow', name: '个人信息', component: 'infoShow'},
			// 				{path: '/infoModify', name: '修改信息', component: 'infoModify'}
			// 			]
			// 		},
			// 		{
			// 			path: '/fundManage', name: '周报模块', component: 'content', icon: 'fa-money',
			// 			children: [
			// 				{path: '/fundList', name: '管理周报', component: 'fundList'},
			// 				{path: '/payList', name: '查看周报', component: 'payList'},
			// 				/!*{path: '/dutyList', name: '管理职务', component: 'dutyList'},
			// 				{path: '/dutyList2', name: '管理职务2', component: 'dutyList2'},
			// 				{path: '/dutyList3', name: '管理职务3', component: 'dutyList3'},*!/
			// 				{path: '/viewEmpWeekWork', name: '查看周报汇报情况', component: 'viewEmpWeekWork'},
			// 				{path: '/deptWeekWork', name: '管理部门周报', component: 'deptWeekWork'}
			// 			]
			// 		}
			// 	]*/
			//    ;
			//
			// }


			submitForm(loginForm) {
				this.mainLoading = true;
				var that = this;

				this.$refs[loginForm].validate((valid) => {
					let userinfo = this.loginForm;
					this.$ajax.post(
						this.baseUrl + 'login.do?EMP_CODE_=' + userinfo.username + '&PASSWORD_=' + that.$md5(userinfo.password) + ''
					)

						.then(function (res) {
							if (res.data.success) {
								that.saveUserInfo(res.data.operator.EMP_NAME_, res.data.operator.EMP_ID_, res.data.operator.POSI_EMP_ID_, res.data.operator.POSI_NAME_, res.data.operator.EMP_CODE_, res.data.operator.ORG_NAME_, res.data.operator.ORG_ID_) // 存入缓存，用于显示用户名
								that.generateMenuPushIndex() //模拟动态生成菜单并定位到index

								//that.mainLoading = false;

								that.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
								//that.mainLoading = false;
							} else {
								that.$message.error('账号或密码错误,请重试');
								that.mainLoading = false;
							}
						})
						.catch(function (res) {
							that.$message.error('登录失败');
							that.mainLoading = false;
						})


					/*if (valid) {
						//用户登录的接口
						let userinfo = this.loginForm;
						let data = {
							ip:this.ip,
							url:'http://ip.taobao.com/service/getIpInfo.php?ip='
						}
						let userData = Object.assign(userinfo, data);
                        axios({
                            type:'get',
                            path:'/api/user/login',
                            data:userData,
                            fn:data=>{
								if(data.status == 1){
									this.saveUserInfo() // 存入缓存，用于显示用户名
									this.generateMenuPushIndex() //模拟动态生成菜单并定位到index
									this.$store.dispatch('initLeftMenu'); //设置左边菜单始终为展开状态
								}else{
									this.$message.error('登录失败请重试')
								}
							},
							errFn:res => {
								this.$message.error('请求出错11：'+res)
							}
						})
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						});
						return false;
					}*/
				});
			},
			getip() {
				axios({
					type: 'get',
					path: 'http://httpbin.org/ip',
					data: '',
					fn: data => {
						const ip = data.origin;
						this.ip = ip;
					},
					errFn: res => {
						this.$message.error('请求出错：' + res)
					}
				});
			},


		},
		watch: {
			adminInfo: function (newValue) {
				if (newValue.id) {
					this.$message({
						type: 'success',
						message: '检测到您之前登录过，将自动登录'
					});
					this.$router.push('index')
				}
			}
		}
	}
</script>
<style>
    @import "../style/hovertree.css";
</style>

<style lang="less" scoped>
    @import "../style/reset.css";
    @import "../style/style.css";
    @import "../style/supersized.css";
    #testHpIndex{
        /*width: 100%;*/
        /*position: absolute;*/
        /*background: url("../img/backgrounds/1.jpg") no-repeat center;*/
        /*background-size:cover;*/
        /*height: 100%;*/
    }
    .testLogin{
        z-index: 9999;
        opacity: 1;
        position: absolute;
        top: 70px;
        left: 50%;
        width: 980px;
        margin-left: -490px;
    }
    #imgTest{
        width: 100%;
        position: absolute;
        background: url("../img/backgrounds/1.jpg") no-repeat center;
        background-size:cover;
        height: 100%;
        z-index: 3;
        /*position: relative;*/
    }
    #imgTest2{
        width: 100%;
        position: absolute;
        background: url("../img/backgrounds/2.jpg") no-repeat center;
        background-size:cover;
        height: 100%;
        z-index: 2;
        /*position: relative;*/
    }
    #imgTest3{
        width: 100%;
        position: absolute;
        background: url("../img/backgrounds/3.jpg") no-repeat center;
        background-size:cover;
        height: 100%;
        z-index: 1;
        /*position: relative;*/
    }
    .login_page {
        position: absolute;
        width: 100%;
        height: 100%;
        background: url(../assets/img/bg2.jpg) no-repeat center center;
        background-size: 100% 100%;
    }

    .loginForm {
        background-color: white;
        padding: 20px;
        border-radius: 3px;
        box-shadow: 5px 5px 10px #01144c;
        height: 350px;
        width: 450px;
        position: relative;
        left: 650px;
        .fa-tips-username {
            position: absolute;
            top: 80px;
            left: 10px;
            z-index: 20;
            color: #9E9E9E;
            font-size: 18px;
        }
        .fa-tips-password {
            position: absolute;
            top: 100px;
            left: 10px;
            z-index: 20;
            color: #9E9E9E;
            font-size: 18px;
        }
        .area-username {
            position: relative;
            top: 75px;
        }
        .area-password {
            position: relative;
            top: 95px;
        }

    }

    .title {
        position: relative;
        top: 40px;
        font-family: cursive;
        font-weight: bold;
        font-size: 26px;
        color: black;
    }

    .form_contianer {
        width: 370px;
        height: 210px;
        position: absolute;
        top: 20%;
        left: 34%;
        padding: 25px;
        border-radius: 5px;
        text-align: center;
        .submit_btn {
            position: relative;
            top: 120px;
            width: 100%;
            font-size: 20px;
            letter-spacing: 25px;
        }
    }

    .form-fade-enter-active, .form-fade-leave-active {
        transition: all 1s;
    }

    .form-fade-enter, .form-fade-leave-active {
        transform: translate3d(0, -50px, 0);
        opacity: 0;
    }

    .loginForm {
        .el-button--primary {
            background-color: #a9d86e;
            border: 1px solid #a9d86e;
        }
    }
</style>
