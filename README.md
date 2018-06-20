# ImgToBase64（js图片转base64）
闲暇时间兴起，自己动手实现了将本地图片文件转为base64的方法，后面又借鉴了网上较为常见的方式转换网络图片为base64。
上传上来以记录自己的成长历程，也欢迎各位大佬指正，觉得实用的同学还请点亮小星星给我的麒麟臂注入能量。
使用方式非常简单，这里也简单的举个栗子。
### 本地文件： 
var obj = new ImgToBase64(file);	// file为图片文件<br/>
obj.onerror = function(eve){};	// 数据读取错误时的回调<br/>
obj.onprogress = function(eve){};	// 正在读取数据时的回调<br/>
obj.onload = function(eve){};		// 数据加载完成时的回调<br/>

### 网络图片：
var obj = new ImgToBase64(url, ext)	// url为图片加载路径， ext为图片格式（默认为png)<br/>
obj.onerror = function(eve){};	// 图片加载错误时的回调<br/>
obj.onload = function(eve){};		// 图片加载完成时的回调（已解析为base64）<br/>