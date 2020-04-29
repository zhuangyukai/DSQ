var curIndex = 0;
//时间间隔(单位毫秒)，每秒钟显示一张，数组共有3张图片放在img文件夹下
var timeInterval = 5000;

//定义一个存放照片位置的数组，可以放任意个，在这里放3个
var arr = new Array();
arr[0] = "static/img/backgrounds/1.jpg";
arr[1] = "static/img/backgrounds/2.jpg";
arr[2] = "static/img/backgrounds/3.jpg";
var imgIndex = 1;
var curIndex = 0;
var index = 0

setInterval(changeImg2, timeInterval);
function changeImg2(){
	//某个div显示，其他的隐藏
	$(".div").eq(index).css('z-index','4');
	//$(".div").hide().eq(index).show();
	$(".div").eq(index).fadeOut(1500,function () {
		// $(".div").eq((index == 2) ? 0 : index + 1).fadeIn();
	});
	index = (index == 2) ? 0 : index + 1;
	if(index == 0){
		$(".div").eq(index).css('z-index','1');
		$(".div").eq(index).fadeIn();
	}
	if(index == 1){
		$(".div").eq(index).css('z-index','2');
		$(".div").eq(index).fadeIn();
	}
	if(index == 2){
		$(".div").eq(index).css('z-index','3');
		$(".div").eq(index).fadeIn();
	}
}
function changeImg() {

	// if (curIndex == arr.length - 1) {
	// 	curIndex = 0;
	// } else {
	// 	curIndex += 1;
	// }
	// console.log('AAAAA');
	//
	// //先将Id为bgImg的Div隐藏，隐藏的间隔为900毫秒（可调），完全隐藏后执行回调函数也就是900后面function里面的方法
	// $("body").fadeOut(900, function () {
	// 	//document.body.style.backgroundImage = "URL(" + arr[curIndex] + ")";
	// 	$("body").css("background", "url("+arr[imgIndex]+") no-repeat center");
	// 	$("body").css("background-size", "cover");
	// 	imgIndex ++;
	// });
	// //改变Div的background图片后，在调用fadeIn函数将Div显示，显示的间隔为900毫秒（可调）。
	// $("body").fadeIn(900);
	//设置body的背景图片
	//document.body.style.backgroundImage ="-webkit-cross-fade(URL("+ arr[curIndex] + "), URL(" +arr[curIndex +1] + "), 50%);"
	// document.body.style.position = "absolute";
	// document.body.style.webkitTransition = "opacity 1s ease-in-out";
	//document.body.style.backgroundImage = "URL(" + arr[curIndex] + ")";  //显示对应的图片
	//document.body.style.backgroundImage =  "URL(static/1.jpg)";
	$('#imgTest').fadeTo('slow',0.3, function()
	{
		if (curIndex >= arr.length)
			curIndex = 0;

			$(this).css('background-image', 'url(' + arr[curIndex] + ')');
	}).fadeTo('slow', 1);

	curIndex += 1;
}
