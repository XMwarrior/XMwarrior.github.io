window.onload = function() {
	var data = ['../../../medias/featureimages/0.jpg', '../../../medias/featureimages/1.jpg', '../../../medias/featureimages/2.jpg'];
	var linkdata = ['#', '#', '#'];
	mySlide('SlideBox', data, linkdata, 2000, 400);
}
/*slide轮播函数，参数说明：
 * id:字符串-'id'
 * data:数组-['图片路径','图片路径'···]
 * duration:数值，单位：毫秒-5000
 * moveTime:数值，单位：毫秒，限制moveTime=100的整数倍； */
function mySlide(id, data, link, duration, moveTime) {
	var SlideBox = document.getElementById(id),
		ImgBox = SlideBox.getElementsByClassName('Slide_ImgBox')[0],
		IconBox = SlideBox.getElementsByClassName('Slide_IconBox')[0],
		BtnBox = SlideBox.getElementsByClassName('Slide_BtnBox')[0],
		PrevBtn = SlideBox.getElementsByClassName('Slide_Prev')[0],
		NextBtn = SlideBox.getElementsByClassName('Slide_Next')[0],
		SlideBox_width = SlideBox.offsetWidth,
		imgHtml = '',
		iconHtml = '',
		times = 1,
		t = 100,
		TimeOut,
		mainSlide,
		isok = true;
	//初始化布局
	SlideBox.style.height = window.innerHeight + 'px';
	for(var i in data) {
		switch(i) {
			case '0':
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[data.length - 1] + ');"><a href="' + link[data.length - 1] + '" style="display:block;height:100%;"></a></li>';
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');"><a href="' + link[i] + '" style="display:block;height:100%;"></a></li>';
				break;
			case(data.length - 1).toString():
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');"><a href="' + link[i] + '" style="display:block;height:100%;"></a></li>';
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[0] + ');"><a href="' + link[0] + '" style="display:block;height:100%;"></a></li>';
				break;
			default:
				imgHtml += '<li style="width:' + SlideBox_width + 'px;background-image:url(' + data[i] + ');"><a href="' + link[i] + '" style="display:block;height:100%;"></a></li>';
				break;
		}
		iconHtml += '<li style="width:' + SlideBox_width / data.length + 'px"></li>';
	}
	ImgBox.style.width = SlideBox_width * (data.length + 2) + 'px';
	IconBox.style.width = SlideBox_width + 'px';
	ImgBox.innerHTML = imgHtml;
	IconBox.innerHTML = iconHtml;
	IconBox.style.marginLeft = -IconBox.offsetWidth / 2 + 'px';
	Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -1 + 'px, 0px, 0px)');
	//初始化绑定setInterval函数及init图标
	var Icon = IconBox.getElementsByTagName('li'),
		Img = ImgBox.getElementsByTagName('li');
	window.onresize = function() {
		SlideBox_width = SlideBox.offsetWidth;
		for(var i = 0, len = data.length + 2; i < len; i++) {
			Img[i].style.width = SlideBox_width + 'px';
		}
		for(var i in data) {
			Icon[i].style.width = SlideBox_width / data.length + 'px';
		}
		ImgBox.style.width = SlideBox_width * (data.length + 2) + 'px';
		IconBox.style.width = SlideBox_width + 'px';
		IconBox.style.marginLeft = -IconBox.clientWidth / 2 + 'px';
	}
	var autoSlide = setInterval(slide, duration);
	Icon[0].style.background = 'blue';
	//prev、next按钮点击事件
	PrevBtn.onclick = function() {
		clearInterval(autoSlide);
		slide(-1);
		autoSlide = setInterval(slide, duration);
	}
	NextBtn.onclick = function() {
		clearInterval(autoSlide);
		slide(1);
		autoSlide = setInterval(slide, duration);
	}
	//Touch事件
	var startTouchX, endTouchX;
	document.addEventListener('touchstart', function(e) {
		startTouchX = e.touches[0].pageX;
	});
	document.addEventListener('touchend', function(e) {
		endTouchX = e.changedTouches[0].pageX;
		if(endTouchX - startTouchX >= 0) {
			PrevBtn.onclick();
		} else {
			NextBtn.onclick();
		}
	});
	//init图标点击事件
	for(var i = 0, len = Icon.length; i < len; i++) {
		! function(i) {
			Icon[i].addEventListener('click', function() {
				if(!isok) return false;
				isok = false;
				var selfI = i,
					showI;
				for(var i1 = 0, len = Icon.length; i1 < len; i1++) {
					if(Icon[i1].style.background === 'blue') {
						showI = i1;
						break;
					}
				}
				if(selfI === showI) return false;
				clearInterval(autoSlide);
				Compatible(ImgBox, 'transitionDuration', 0 + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -(showI + 1) + 'px, 0px, 0px)');
				iconColor(selfI);
				times = selfI;
				Compatible(ImgBox, 'transitionDuration', moveTime + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -(selfI + 1) + 'px, 0px, 0px)');
				isok = true;
				autoSlide = setInterval(slide, duration);
			});
		}(i);
	}
	/*轮播核心函数
	 * direction方向，默认1。范围（1左移动，-1右移动）*/
	function slide(direction) {
		direction = direction ? direction : 1;
		if(!isok) return false;
		isok = false;
		if(direction > 0 && times < data.length + 1) { //左移
			times++;
			times < data.length + 1 ? iconColor(times - 1) : iconColor(0);
			if(times < data.length + 1) {
				Compatible(ImgBox, 'transitionDuration', moveTime + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
				setTimeout(function() {
					isok = true;
				}, 400);
			} else {
				Compatible(ImgBox, 'transitionDuration', moveTime + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
				setTimeout(function() {
					times = 1;
					Compatible(ImgBox, 'transitionDuration', 0 + 'ms');
					Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
					isok = true;
				}, 400);
			}
		} else { //右移
			if(times <= 0) return false;
			times--;
			times > 0 ? iconColor(times - 1) : iconColor(data.length - 1);
			if(times > 0) {
				Compatible(ImgBox, 'transitionDuration', moveTime + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
				setTimeout(function() {
					isok = true;
				}, 400);
			} else {
				Compatible(ImgBox, 'transitionDuration', moveTime + 'ms');
				Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
				setTimeout(function() {
					times = data.length;
					Compatible(ImgBox, 'transitionDuration', 0 + 'ms');
					Compatible(ImgBox, 'transform', 'translate3d(' + SlideBox_width * -times + 'px, 0px, 0px)');
					isok = true;
				}, 400);
			}
		}
	}
	//图标颜色转换函数
	function iconColor(showIndex) {
		for(var i = 0, len = Icon.length; i < len; i++) {
			Icon[i].style.background = i === showIndex ? 'blue' : 'red';
		}
	}
	//兼容属性设置
	function Compatible(target, prop, animation) {
		var humpProp = prop.slice(0, 1).toUpperCase() + prop.substr(1);
		target.style[prop] = animation;
		target.style['webkit' + humpProp] = animation;
		target.style['moz' + humpProp] = animation;
		target.style['ms' + humpProp] = animation;
		target.style['o' + humpProp] = animation;
	}
}