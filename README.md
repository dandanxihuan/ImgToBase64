# ImgToBase64（js图片转base64）
闲暇时间兴起，自己动手实现了将本地图片文件转为base64的方法，后面又借鉴了网上较为常见的方式转换网络图片为base64（然而并没有卵用，后面Google找到了新的思路：本地node代理），后又改为node代理。代理方式限制较多，这里比较low的地方是，如果需要转换网络图片，需要运行init.bat文件(window系统，且已正确安装配置node，还得确保本地8888端口未被占用……好吧，承认第二个实现是强行给自己加戏)。
在实现了上述两种转换方式后便上传了上来（至于其应用场景，大约应该就是简单的一个图片转base64的功能吧）。以记录自己的成长历程，也欢迎各位大佬指正，觉得实用的同学还请点亮小星星给我的麒麟臂注入能量。使用方式如test.html中所展示的一样，非常简单。
```
	<!DOCTYPE html>
		<html>
		<head>
			<title></title>
		</head>
		<body>
			<input type="file" name="">
			<button id="btn1">test file</button>
			<input type="text" name="">
			<button id="btn2">test url</button>
			<br><br>
			<textarea rows="20" cols="80" id="area" placeholder="base64"></textarea>
		</body>
		<script type="text/javascript" src="base64.js"></script>
		<script type="text/javascript">
			
			var btn1 = document.getElementById("btn1"), btn2 = document.getElementById("btn2"), area = document.getElementById("area");
			btn1.onclick = function(){
				var input = document.querySelector("input[type='file']"), file = input.files[0];
				var o = new ImgToBase64(file);
				o.onload = function(){
					var img = new Image();
					img.src = this.result;
					document.body.append(img);
					area.value = this.result;
				},
				o.parse();
			},
			btn2.onclick = function(){
				var input = document.querySelector("input[type='text']"), url = input.value;
				var o = new ImgToBase64(url);
				o.onload = function(){
					var img = new Image();
					img.src = this.result;
					document.body.append(img);
					area.value = this.result;
				},
				o.parse();
			};

		</script>
	</html>
```