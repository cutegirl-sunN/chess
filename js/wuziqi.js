$(function(){
	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");
	var canva=document.getElementById("clock");
	var ctx1=canva.getContext("2d");
	var canva2=document.getElementById("clock2");
	var ctx2=canva2.getContext("2d");
	var audio=document.getElementById("audio");
	var sep=40;//一个棋子
	var sr=4;//小圆点
	var br=18;//棋子
	var luozi1={};
	var t;
	var t2;
	var ms=0;
	var AI=false;
	var kongbai={};
	var gameState="pause";
	//进入游戏
	$(".come").on("click",function(){
		$(".bg").css("display","none")
	})
	
	//秒针
	function miaozhen(){
		ctx1.clearRect(0,0,100,100)
			ctx1.save();
			var img=$("#img").get(0);
			ctx1.drawImage(img,5,4,213,213,0,0,100,100)
			ctx1.translate(50,50);
			var date=new Date();
			ms+=1;
			ctx1.rotate(Math.PI/(180*1000)*12*ms);
			ctx1.beginPath();
			ctx1.moveTo(0,0);
			ctx1.lineTo(0,-35);
			ctx1.moveTo(0,-35);
			ctx1.lineTo(-5,-29);
			ctx1.moveTo(0,-35);
			ctx1.lineTo(5,-29);
			ctx1.closePath();
			ctx1.stroke();
			ctx1.restore();
	}
	miaozhen();
	ms=0;
	
	function miaozhen2(){
			ctx2.save();
			var img=$("#img").get(0);
			ctx2.drawImage(img,5,4,213,213,0,0,100,100)
			ctx2.translate(50,50);
			ctx2.rotate(Math.PI/(180*1000)*12*ms);
			ms+=1;
			ctx2.beginPath();
			ctx2.moveTo(0,0);
			ctx2.lineTo(0,-35);
			ctx2.moveTo(0,-35);
			ctx2.lineTo(-5,-29);
			ctx2.moveTo(0,-35);
			ctx2.lineTo(5,-29);
			ctx2.closePath();
			ctx2.stroke();
			ctx2.restore();
	}
	miaozhen2();
	ms=0;
	
	function time(){
		ctx1.save();
		ctx1.clearRect(0,0,100,100)
		miaozhen();
		ctx1.restore();
	}
	function time2(){
		ctx1.save();
		ctx1.clearRect(0,0,100,100)
		miaozhen2();
		ctx1.restore();
	}
	
	function q(x){
		return (x+0.5)*sep+0.5;
	}
	
	//棋盘上的四个小圆点
	function circle(x,y){
		ctx.save();
		ctx.translate(q(x),q(y))
		ctx.beginPath();
		ctx.arc(0,0,sr,0,Math.PI*2);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	}
	
	//棋盘
	function qipan(){
		ctx.clearRect(0,0,600,600)
		ctx.save();
		ctx.beginPath();
		for(var i=0;i<15;i++){
			ctx.moveTo(q(i),q(0));
			ctx.lineTo(q(i),q(14));
			ctx.moveTo(q(0),q(i));
			ctx.lineTo(q(14),q(i));
		}
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		circle(3,3);
		circle(3,11);
		circle(7,7);
		circle(11,3);
		circle(11,11);
		for(var i=0;i<15;i++){
			for(var j=0;j<15;j++){
				kongbai[lianjie(i,j)]=true
			}
		}
	}
	qipan()
	
	//落子
	function luozi(x,y,color){
		ctx.save();
		ctx.translate(q(x),q(y))
		ctx.beginPath();
		if(color==="black"){
			var bg=ctx.createRadialGradient(-5,-5,0,0,0,25);
			bg.addColorStop(0.05,'#ddd');
			bg.addColorStop(1,'#000');
		}else{
			var bg=ctx.createRadialGradient(-5,-5,0,0,0,25);
			bg.addColorStop(0.1,'#fff');
			bg.addColorStop(1,'#ccd');
		}
		ctx.shadowOffsetX=2;
		ctx.shadowOffsetY=3;
		ctx.shadowBlur=4;
		ctx.shadowColor="rgba(0,0,0,0.5)"
		ctx.fillStyle=bg;
		ctx.arc(0,0,br,0,Math.PI*2);
		ctx.fill();
		luozi1[x+"_"+y]=color;
		ctx.closePath();
		ctx.restore();
		console.log(kongbai)
		audio.play();
		
	}
	
	
	//棋谱
	function chessManual(){
		ctx.save();
		ctx.font="20px 微软雅黑";
		ctx.textBaseline="middle";
		ctx.textAlign='center';
		var j =1;
		for(var k in luozi1){
			var arr=k.split("_");
			if(luozi1[k]==="black"){
				ctx.fillStyle="white";
			}else{
				ctx.fillStyle="black";
			}
			ctx.fillText(j++,q(parseInt(arr[0])),q(parseInt(arr[1])));
			
		}
		
		ctx.restore();
		$("<img>").attr("src",canvas.toDataURL()).appendTo(".box");
		//下载
		$("<a>").attr("href",canvas.toDataURL()).attr("download","qipu.png").appendTo(".box")
	}
	
	//人机
	//棋盘上所有空白位置
	//每个函数调用 cal(pos.x,pos,y,)
	function intel(){
		var max=-Infinity;
		var pos={}
		for(var k in kongbai){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			var m=panduan(x,y,'black');
			if(m>max){
				max=m;
				pos.x=x;
				pos.y=y;
			}
		}
		var max2=-Infinity;
		var pos2={};
		for(var k in kongbai){
			var x=parseInt(k.split('_')[0]);
			var y=parseInt(k.split('_')[1]);
			var m2=panduan(x,y,'white');
			if(m2>max2){
				max2=m2;
				pos2.x=x;
				pos2.y=y;
			}
		}
		if(max>max2){
			return pos;
		}else{
			return pos2;
		}
	}
	
	//luozi
	var kaiguan=true;
	function moving(e){
		var x=Math.floor(e.offsetX/sep);
		var y=Math.floor(e.offsetY/sep);
		console.log(x,y)
		if(luozi1[x+"_"+y]){
			return
		}
		//人机
		if(AI){
			luozi(x,y,"black");
			if(panduan(x,y,"black")>=5){
				$(canvas).off("click")
				clearInterval(t);
				$("#info").css("display","block")
				$("#info .text").html("黑棋赢")
			}
			var p=intel();
			
			luozi(p.x,p.y,"white");
//			alert(p.x+'_'+p.y)
			if(panduan(p.x,p.y,"white")>=5){
				$(canvas).off("click")
				clearInterval(t2);
				$("#info").css("display","block")
				$("#info .text").html("白棋赢")
			}
			console.log(luozi1)
			return false;
		}
		
		
		if(kaiguan){
			luozi(x,y,"black");
			t=setInterval(time,1)
			clearInterval(t2);
			if(panduan(x,y,"black")>=5){
				$(canvas).off("click")
				clearInterval(t);
				$("#info").css("display","block")
				$("#info .text").html("黑棋赢")
			}
		}else{
			luozi(x,y,"white");
			t2=setInterval(time2,1)
			clearInterval(t);
			if(panduan(x,y,"white")>=5){
				$(canvas).off("click")
				clearInterval(t2);
				$("#info").css("display","block")
				$("#info .text").html("白棋赢")
			}
		}
		
		
		
		kaiguan=!kaiguan
	}
	//lianjian
	function lianjie(a,b){
		return a + "_" + b
	}
	//输赢判断
	function panduan(x,y,color){
		var i;
		//循环
		//行
		var row=1;i=1;
		while(luozi1[lianjie(x+i,y)]===color){
			row++;
			i++;
		}
		i=1;
		while(luozi1[lianjie(x-i,y)]===color){
			row++;
			i++;
		}
		//列
		var lie=1; i=1;
		while(luozi1[lianjie(x,y+i)]===color){
			lie++;
			i++;
		}
		while(luozi1[lianjie(x,y-i)]===color){
			lie++;
			i++;
		}
		//左斜
		var zuoxie=1; i=1;
		while(luozi1[lianjie(x-i,y-i)]===color){
			zuoxie++;
			i++;
		}
		while(luozi1[lianjie(x+i,y+i)]===color){
			zuoxie++;
			i++;
		}
		//右斜
		var youxie=1; i=1;
		while(luozi1[lianjie(x-i,y+i)]===color){
			youxie++;
			i++;
		}
		while(luozi1[lianjie(x+i,y-i)]===color){
			youxie++;
			i++;
		}
		return Math.max(zuoxie,youxie,row,lie);
	}
	
	//模式
	var lis=$(".duizhanbox li");
	lis.each(function(n){
		$(this).on("click",function(){
			lis.removeClass("red");
			lis.eq(n).addClass('red');
		})
	})
	$(".ai").on("click",function(){
		if(gameState==="play"){
			return;
		}
		AI=true;
		console.log(kongbai)
	})
	
	$(".normal").on("click",function(){
		if(gameState==="play"){
			return;
		}
		AI=false;
	})
	
	
	$("#start").on("click",function(){
		$(canvas).css("display","block")
		$(canvas).on("click",moving)
	})
	var divs=$(".anniu div");
	divs.each(function(index){
		$(this).on("click",function(){
			divs.removeClass("act");
			divs.eq(index).addClass('act');
		})
	})
	
	//退出
	$("#out").on("click",function(){
		$(".tc").css("display","block")
	})
	//取消
	$(".quxiao").on("click",function(){
		$(".tc").css("display","none")
	})
	//按钮退出
	$(".sure").on("click",function(){
		qipan();
		luozi1={};
		kaiguan=true;
		$(canvas).css("display","none")
		$(".tc").css("display","none")
		$(".bg").css("display","block")
	})
	//对战
	$("#duizhan").on("click",function(){
		$(".duizhanbox").css("display","block");
	})
	
	//查看棋谱
	$("#look").on("click",function(){
		chessManual()
		$(".box").show();
		(".box img").remove()
	})
	//关闭棋谱
	$("#close").on("click",function(){
		$(".box").hide();
		(".box img").remove()
		for(var k in luozi1){
			var x=parseInt(k.split("_")[0]);
			var x=parseInt(k.split("_")[1]);
			luozi(x,y,luozi1[k])
			
		}
	})
	
	
	function restart(){
		qipan();
		luozi1={};
		kaiguan=true;
		$(canvas).on("click",moving)
		$("#info").css("display","none")
		gameState='pause';
	}
	$(".again").on("click",restart)
	
	
	//info退出
	$(".tuichu").on("click",function(){
		qipan();
		luozi1={};
		kaiguan=true;
		$("#info").css("display","none")
		$(canvas).css("display","none")
		$(".bg").css("display","block")
	})	
})
