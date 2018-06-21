+function(){



	const encodeStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", zero_blob = "00000000", status_sym = Symbol();
	
	function ImgToBase64(target){
		/*-1: target为url时表示加载图片失败，为文件时表示读取文件流失败，
		0: 初始化状态，
		1：target为文件时才有的状态，表示正在读取文件流
		2：表示文件流读取成功或图片加载成功*/
		this[status_sym] = 0;
		this.result = "";
		this.onerror = null;
		this.onprogress = null;
		this.onload = null;
		Object.defineProperty(this, "target", {
			configurable: false,
			writable: false,
			value: target
		}),
		Object.defineProperty(this, "status", {
			get: function(){
				return this[status_sym];
			}
		});
	}

	ImgToBase64.prototype.parse = function(){
		if( isImgFile(this.target) ) parseImgFile(this);
		else if( isURLStr(this.target) ) imgEntry(this);
		else throw new TypeError("target is not an image file or url string");
	};
	
	// 判断目标是否为图片文件
	function isImgFile(target){
		var bool = target instanceof File;
		if( !bool ) return false;
		var type = target.type;
		return type.startsWith("image/");
	}

	// 编码
	function cover(a, b, c, result){
		a = a.toString(2), b = b.toString(2), c = c.toString(2);
		var cov_a = 8 - a.length, cov_b = 8 - b.length, cov_c = 8 - c.length;
		a = zero_blob.substring(0, cov_a) + a, b = zero_blob.substring(0, cov_b) + b, c = zero_blob.substring(0, cov_c) + c;
		var str = a + b + c;
		for(var i = 0; i < 4; i++){
			var s = str.substring(6*i, 6*(i + 1));
			s = parseInt(s,2), result.push(encodeStr.charAt(s));
		}
	}

	// 补差
	function balance(a,b, result){
		if(a == b == undefined) return;		
		if(b == undefined){
			a = a.toString(2);
			var cov  = 8 -  a.length;
			a = zero_blob.substring(0, cov) + a;
			var s1 = a.substring(0, 6), s2 = a.substring(6);
			s1 = parseInt(s1,2), s2 = parseInt(s2, 2), result.push( encodeStr.charAt(s1) + encodeStr.charAt(s2) + "==" );
		}else{
			a = a.toString(2), b = b.toString(2);
			var cov_a  = 8 -  a.length, cov_b = 8 - b.length;
			a = zero_blob.substring(0, cov_a) + a, b = zero_blob.substring(0, cov_b) + b;
			a = a + b;
			var s1 = a.substring(0, 6), s2 = a.substring(6, 12), s3 = a.substring(12);
			s1 = parseInt(s1,2), s2 = parseInt(s2, 2), s3 = parseInt(s3, 2),
				result.push( encodeStr.charAt(s1) + encodeStr.charAt(s2) + encodeStr.charAt(s3) + "=" );
		}
	}

	// 将本地图片文件转为base64
	function parseImgFile(obj){	
		if( !isImgFile(obj.target) ) throw new TypeError("target is not an image file");
		var reader = new FileReader(), _this = obj;
		reader.onerror = function(event){
			_this[status_sym] = -1;
			if(typeof _this.onerror == "function") _this.onerror(event);
		},

		reader.onprogress = function(event){
			_this[status_sym] = 1;
			if(typeof _this.onprogress == "function") _this.onprogress(event);
		},

		reader.onload = function(event){
			_this[status_sym] = 2;
			var buffer = this.result, buf_len = buffer.byteLength, remainder = buf_len%3, view = new DataView(buffer),
				result = "data:image/jpg;base64,".split("");
			var a = b = c = -1;
			for(var i = 0; i < buf_len - remainder; i = i + 3){
				a = view.getUint8(i), b = view.getUint8(i+1), c = view.getUint8(i+2);
				cover(a,b,c, result);
			}
			if(remainder == 1) balance(view.getUint8(buf_len - 1),undefined, result);
			if(remainder == 2) balance(view.getUint8(buf_len - 2), view.getUint8(buf_len - 1), result);
			_this.result = result.join("");
			if(typeof _this.onload == "function") _this.onload(event);
		},

		reader.readAsArrayBuffer(_this.target);
	}

	/*将网络图片转为base64*/

	function isURLStr(url){
		return url && (typeof url === 'string');
	}

	function imgEntry(_this){
		var url = _this.target, img = new Image();
		img.src = url;
		img.onerror = function(eve){
			_this[status_sym] = -1;
			if(typeof _this.onerror == "function") _this.onerror(event);
		},
		img.onload = function(eve){
			agent(url,_this);
		}
	}

	function agent(url, _this){
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://localhost:8888?" + url);
		xhr.responseType = 'blob';
		xhr.onload = function(eve){
			parseBlob(xhr.response, _this);
		},
		xhr.onerror = function(eve){
			throw new Error("an error occured when try to load the image from the url");
		};
		xhr.send();
	}

	function parseBlob(blob, _this){	
		var reader = new FileReader();
		reader.onerror = function(event){
			_this[status_sym] = -1;
			if(typeof _this.onerror == "function") _this.onerror(event);
		},

		reader.onprogress = function(event){
			_this[status_sym] = 1;
			if(typeof _this.onprogress == "function") _this.onprogress(event);
		},

		reader.onload = function(event){
			_this[status_sym] = 2;
			var buffer = this.result, buf_len = buffer.byteLength, remainder = buf_len%3, view = new DataView(buffer),
				result = "data:image/jpg;base64,".split("");
			var a = b = c = -1;
			for(var i = 0; i < buf_len - remainder; i = i + 3){
				a = view.getUint8(i), b = view.getUint8(i+1), c = view.getUint8(i+2);
				cover(a,b,c, result);
			}
			if(remainder == 1) balance(view.getUint8(buf_len - 1),undefined, result);
			if(remainder == 2) balance(view.getUint8(buf_len - 2), view.getUint8(buf_len - 1), result);
			_this.result = result.join("");
			if(typeof _this.onload == "function") _this.onload(event);
		},

		reader.readAsArrayBuffer(blob);
	}
	

	window.ImgToBase64 = ImgToBase64;

}();
