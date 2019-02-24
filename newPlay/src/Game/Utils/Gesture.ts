class Gesture
{
    private _layer:egret.Shape
    private _group:eui.Group
    private _isDown:boolean
    private _gestureRes:Array<any>
    private _gestureData:Array<any>
    // private _gestureSound:egret.Sound
    // private _gestureColor:any
    //{"difficult":2, "type":104,"path":"gestureSheet_json.gesture104","data":["2828", "4646"], "count":2, "balloon":"balloonPurple", "color":"0xaa69e9"},
    public Init() 
    {
        // this._gestureColor = {}
        this._gestureData = []
		this._gestureRes = RES.getRes("gesture_json")
		for (let i = 0; i < this._gestureRes.length; i++) {
			let data:Array<string> = this._gestureRes[i].data
			for (let j = 0; j < data.length; j++) {
				let gesture:any = {type:-1, data:""}
				gesture.type = this._gestureRes[i].type
				gesture.data = data[j]
                // this._gestureColor[gesture.type] = gesture.color
				this._gestureData.push(gesture)
			}
		}

        // this._gestureSound = RES.getRes("gesture_mp3")
        // this._gestureSound.load(AudioManager.gesture)
    }

    public get gestureRes()
    {
        return this._gestureRes
    }

    public addEvent(layer:egret.Shape, group:eui.Group)
    {
        this._layer = layer
        this._group = group
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.mouseUp,this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
    }
    public removeEvent()
    {
        this._layer.graphics.clear()
        // PanelManager.gamePanel.SetParticle(false, 0, 0)
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
        // PanelManager.m_gameScenePanel.SetParticle(false, 0, 0)
        this._group.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE,this.mouseUp,this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
    }

    private _mouseDatas:egret.Point[];
    private _lineData:egret.Point[]
    private _currentPoint:egret.Point;
    private _catmullRom:egret.Point[]
    private _catmullIndex:number
    private mouseDown(evt:egret.TouchEvent)
    {
        if (this._isDown) return
        this._isDown = true
        this._layer.graphics.clear();
        this._mouseDatas = [];
        this._lineData = []
        this._catmullRom = []
        this._catmullIndex = 0
        var p:egret.Point = new egret.Point(evt.stageX,evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p)
        this._currentPoint = p;

        // this._layer.graphics.moveTo(this._currentPoint.x,this._currentPoint.y);
        // PanelManager.m_gameScenePanel.SetParticle(true, p.x, p.y)
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
        
        // Common.dispatchEvent(MainNotify.beginLocus)
    }
    private mouseMove(evt:egret.TouchEvent)
    {
        if (!this._isDown) return
        // var p:egret.Point = new egret.Point(evt.stageX, evt.stageY);
        var p:egret.Point = GameObjectPool.getInstance().createObject(egret.Point, "egretPoint")
        p.x = evt.stageX
        p.y = evt.stageY
        this._mouseDatas.push(p)
        /////////////////////////////////
        this._lineData.push(p)
        // if (this._lineData.length >= 3) {
        //     let i0 = 2 * this._catmullIndex + 1
        //     let i1 = 2 * (this._catmullIndex + 1)
        //     let p0 = this._lineData[i0]
        //     let p1 = this._lineData[i1]
        //     let p2 = this._lineData[i1 - 2]
        //     if (p0 != undefined && p1 != undefined) {
        //         this._layer.graphics.lineStyle(8, 0xFFFFFF)
        //         this._layer.graphics.moveTo(p2.x, p2.y);
        //         this._layer.graphics.curveTo(p0.x, p0.y, p1.x, p1.y)
        //         this._layer.graphics.endFill()
        //         this._catmullIndex++
        //     } 
        // }


        // if (this._mouseDatas.length >= 4) {
        //     this._catmullRom = []
        //     for (let i = this._catmullIndex; i < 4 + this._catmullIndex; i++) {
        //         this._catmullRom.push(this._mouseDatas[i])
        //     }
        //     var p0 = this._catmullRom[0]
        //     var p1 = this._catmullRom[1]
        //     var p2 = this._catmullRom[2]
        //     var p3 = this._catmullRom[3]
        //     // Common.log(p0, p1, p2, p3)
        //     if (p0 != undefined && p1 != undefined && p2 != undefined && p3 != undefined)
        //     {
                
        //         let index = this._lineData.length
        //         if (this._catmullIndex == 0) {
        //             // this._lineData.push(p0)
        //             this._lineData.push(p1)
        //             index = 0
        //         }
                
        //         for (let i = 1; i <= 10; i++) {
        //             let t = i / 10
        //             let tt = t * t
        //             let ttt = tt * t
        //             let factor = 0.5
        //             let c1x = factor * (p2.x - p0.x)
        //             let c1y = factor * (p2.y - p0.y)
        //             let c2x = p0.x - 2.5 * p1.x + 2 * p2.x - factor * p3.x
        //             let c2y = p0.y - 2.5 * p1.y + 2 * p2.y - factor * p3.y
        //             let c3x = 1.5 * p1.x - 1.5 * p2.x + factor * p3.x - factor * p0.x
        //             let c3y = 1.5 * p1.y - 1.5 * p2.y + factor * p3.y - factor * p0.y
        //             let pi:egret.Point = GameObjectPool.getInstance().createObject(egret.Point, "egretPoint")
        //             pi.x = c3x * ttt + c2x * tt + c1x * t + p1.x
        //             pi.y = c3y * ttt + c2y * tt + c1y * t + p1.y
        //             // pi.x = Math.round(pi.x)
        //             // pi.y = Math.round(pi.y)
        //             this._lineData.push(pi)
        //         }
        //         // this._lineData.push(p2)

        //         // for (let i = index; i < this._lineData.length; i++) {
        //         //     this._layer.graphics.lineStyle(8, 0xFFFFFF);
        //         //     this._layer.graphics.lineTo(this._lineData[i].x, this._lineData[i].y);
        //         //     this._layer.graphics.endFill();
        //         // }
        //         this._catmullIndex = this._catmullIndex + 1
        //     }
            
        // }
        
        this._layer.graphics.lineStyle(16, 0xFFFFFF);
        this._layer.graphics.lineTo(p.x, p.y);
        this._layer.graphics.endFill();
        this._currentPoint = p
        // PanelManager.m_gameScenePanel.SetParticle(true, p.x, p.y)
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
    }
    private mouseUp(evt:egret.TouchEvent)
    {
        if (!this._isDown) return
        this._isDown = false
        var p:egret.Point = new egret.Point(evt.stageX,evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p)
        // for (let i = 0; i < this._mouseDatas.length; i++) Common.log(this._mouseDatas[i])
        this._layer.graphics.clear();

        // this._layer.graphics.lineStyle(8, 0xff0000, 0.8)
        // this._layer.graphics.endFill();
        // PanelManager.gamePanel.SetParticle(false, p.x, p.y)
        // PanelManager.m_gameScenePanel.SetParticle(false, p.x, p.y)
        this.motion();

        // this._gestureSound.play(0, 1)
    }

    private motion()
    {
        var _arr:egret.Point[] = [];
        var currentIndex:number = 0;
        var len:number = this._mouseDatas.length;
        _arr.push(this._mouseDatas[currentIndex]);
        for(var i:number=0; i<len; i++)
        {
            if( egret.Point.distance(this._mouseDatas[currentIndex], this._mouseDatas[i])>40 )
            {
                currentIndex = i;
                _arr.push(this._mouseDatas[currentIndex]);
            }
        }

        this._mouseDatas = _arr;
        //console.log(this._mouseDatas);
        //console.log("ll:",_arr);
        this.parseDirection();
    }

    private _dirsArr:number[];
    private parseDirection()
    {

        this._dirsArr = [];
        var len:number = this._mouseDatas.length;
        for(var i:number=0; i<len; i++)
        {
            if( this._mouseDatas[i+1])
            {
                var p1:egret.Point = this._mouseDatas[i];
                var p2:egret.Point = this._mouseDatas[i+1];
                var a:number = p1.y - p2.y;
                var b:number = egret.Point.distance(p1,p2);
                var rad:number = Math.asin( a/b );
                var ang:number = Number((rad * 57.2957800).toFixed(1)); // rad * 180/Math.PI 直接求常量，优化
                var quad:number = this.quadrant(p1,p2);
                var dir:number = this.getDirByAngQuad(ang, quad);
                this._dirsArr.push(dir);
                // console.log("quad: ",quad, "ang: ", ang);
            }
        }
        //console.log(this._dirsArr);
        var dirstr:string = this.repDiff( this._dirsArr );
        // console.log( dirstr );
        var rel:number = this.sweep( dirstr );
        // console.log("type------------->: ",rel);
        this.disEvent(rel);
    }

    private disEvent(type:number)
    {
		GameConfig.gestureType = type
        if(type != -1)
        {
            Common.dispatchEvent(MainNotify.gestureAction)
            this._catmullIndex = 0
            for (let i = 0; i < this._gestureRes.length; i++) {
                if (type == this._gestureRes[i].type) {
                    this._layer.graphics.moveTo(this._lineData[0].x,this._lineData[0].y)
                    this._layer.graphics.lineStyle(16, this._gestureRes[i].color);


                    for (let i = this._lineData.length; i >= 0; i--) {
                        if (i % 2 > 0) {
                            this._lineData.splice(i, 1)
                        }
                    }
                    this._BezierInterpolation()
                    // for (let j = 0; j < this._lineData.length; j+=4) {
                    //     let x0 = this._lineData[j].x
                    //     let y0 = this._lineData[j].y
                    //     if (this._lineData[j+1] != undefined && this._lineData[j+2] != undefined && this._lineData[j+3] != undefined) {
                    //         let x1 = this._lineData[j+1].x
                    //         let y1 = this._lineData[j+1].y
                    //         let x2 = this._lineData[j+2].x
                    //         let y2 = this._lineData[j+2].y
                    //         let x3 = this._lineData[j+3].x
                    //         let y3 = this._lineData[j+3].y
                    //         let xc1 = (x0 + x1) / 2
                    //         let yc1 = (y0 + y1) / 2
                    //         let xc2 = (x1 + x2) / 2
                    //         let yc2 = (y1 + y2) / 2
                    //         let xc3 = (x2 + x3) / 2
                    //         let yc3 = (y2 + y3) / 2
                    //         let len1 = Math.sqrt((x1-x0) * (x1-x0) + (y1-y0) * (y1-y0))
                    //         let len2 = Math.sqrt((x2-x1) * (x2-x1) + (y2-y1) * (y2-y1))
                    //         let len3 = Math.sqrt((x3-x2) * (x3-x2) + (y3-y2) * (y3-y2))
                    //         let k1 = len1 / (len1 + len2)
                    //         let k2 = len2 / (len2 + len3)
                    //         let xm1 = xc1 + (xc2 - xc1) * k1
                    //         let ym1 = yc1 + (yc2 - yc1) * k1
                    //         let xm2 = xc2 + (xc3 - xc2) * k2
                    //         let ym2 = yc2 + (yc3 - yc2) * k2
                    //         let smooth_value = 0.1
                    //         let ctrl1_x = xm1 + (xc2 - xm1) * smooth_value + x1 - xm1
                    //         let ctrl1_y = ym1 + (yc2 - ym1) * smooth_value + y1 - ym1
                    //         let ctrl2_x = xm2 + (xc2 - xm2) * smooth_value + x2 - xm2
                    //         let ctrl2_y = ym2 + (yc2 - ym2) * smooth_value + y2 - ym2
                    //         this._layer.graphics.cubicCurveTo(ctrl1_x, ctrl1_y, ctrl2_x, ctrl2_y, x3, y3)
                    //     }
                    // }


                    // for (let j = 1; j < this._lineData.length; j++) {
                    //     // let p1 = this._lineData[j+1]
			        //     // let p2 = this._lineData[j+2]
                    //     this._layer.graphics.lineTo(this._lineData[j].x, this._lineData[j].y);
                    //     // if (p1 != undefined && p2 != undefined) {
                    //     //     this._layer.graphics.curveTo(p1.x, p1.y, p2.x, p2.y);
                    //     // }
                        
                    // }
                    this._layer.graphics.endFill()
                    egret.setTimeout(this._clearGraphics, this, 200)
                    break
                }
            } 
        }
    }

    // 贝塞尔插值算法
    private _BezierInterpolation() {
        let scale = 0.6;  
        let midpoints = []
        //生成中点   
        let originCount = this._lineData.length   
        for(let i = 0 ;i < this._lineData.length; i++){
            let nexti = (i + 1) % originCount     
            let p0 = this._lineData[i]
            let p1 = this._lineData[nexti]
            if (p1 != undefined) {
                let midPoint = new egret.Point()
                midPoint.x = 0.5 * (p0.x + p1.x)
                midPoint.y = 0.5 * (p0.y + p1.y)
                midpoints.push(midPoint)
            }
        }
        
        //平移中点
        let extrapoints:Array<egret.Point> = new Array(2*originCount)
        for(let i = 0 ; i < originCount; i++){  
            let nexti = (i + 1) % originCount;  
            let backi = (i + originCount - 1) % originCount;  
            let midinmid = new egret.Point()
            midinmid.x = (midpoints[i].x + midpoints[backi].x)/2.0;  
            midinmid.y = (midpoints[i].y + midpoints[backi].y)/2.0;  
            let offsetx = this._lineData[i].x - midinmid.x;  
            let offsety = this._lineData[i].y - midinmid.y;  
            let extraindex = 2 * i;
            extrapoints[extraindex] = new egret.Point()
            extrapoints[extraindex].x = midpoints[backi].x + offsetx;  
            extrapoints[extraindex].y = midpoints[backi].y + offsety;  
            //朝 originPoint[i]方向收缩    
            let addx = (extrapoints[extraindex].x - this._lineData[i].x) * scale;  
            let addy = (extrapoints[extraindex].y - this._lineData[i].y) * scale;  
            extrapoints[extraindex].x = this._lineData[i].x + addx;  
            extrapoints[extraindex].y = this._lineData[i].y + addy;  
            
            let extranexti = (extraindex + 1)%(2 * originCount); 
            extrapoints[extranexti] = new egret.Point() 
            extrapoints[extranexti].x = midpoints[i].x + offsetx;  
            extrapoints[extranexti].y = midpoints[i].y + offsety;  
            //  朝 originPoint[i]方向收缩    
            addx = (extrapoints[extranexti].x - this._lineData[i].x) * scale;  
            addy = (extrapoints[extranexti].y - this._lineData[i].y) * scale;  
            extrapoints[extranexti].x = this._lineData[i].x + addx;  
            extrapoints[extranexti].y = this._lineData[i].y + addy;
        }
        
        let controlPoint = []
        //生成4控制点，产生贝塞尔曲线
        this._layer.graphics.moveTo(this._lineData[0].x, this._lineData[0].y)        
        this._layer.graphics.lineTo(this._lineData[1].x, this._lineData[1].y)
        
        for(let i = 1 ;i < originCount; i++){  
            controlPoint[0] = this._lineData[i];  
            let extraindex = 2 * i;  
            controlPoint[1] = extrapoints[extraindex + 1];  
            let extranexti = (extraindex + 2) % (2 * originCount);  
            controlPoint[2] = extrapoints[extranexti];  
            let nexti = (i + 1) % originCount;
            if (nexti > 0) {
                controlPoint[3] = this._lineData[nexti];      
                this._layer.graphics.moveTo(controlPoint[0].x, controlPoint[0].y)
                this._layer.graphics.cubicCurveTo(controlPoint[1].x, controlPoint[1].y, controlPoint[2].x, controlPoint[2].y, controlPoint[3].x, controlPoint[3].y)
            }
        }
    }

    private _clearGraphics() {
        while(this._lineData.length > 0) {
            let p:egret.Point = this._lineData.pop()
            GameObjectPool.getInstance().destroyObject(p)
        }
        this._layer.graphics.clear()
        this._lineData.length = 0
    }

    private _symbol:string[] = ["28","46","82","64","141","585","3","7","5","1","4321876","2345678"];
    private _symbolG:number[] = [0,0,3,3,5,5,1,1,2,2,4,4];

    // v 0
    // | 1
    // - 2
    // ^ 3
    // 6 4
    // z 5

    private sweep( str:string ):number
    {
        var maxType:number = -1;
        var max:number = -1;
        var len:number = this._gestureData.length;
        for(var i:number=0; i<len; i++)
        {
            var val:number = this.Levenshtein_Distance_Percent(this._gestureData[i].data, str);
            if(val>max)
            {
                max = val;
                maxType = this._gestureData[i].type;
            }
        }

        if(max<0.4)
        {
            
            maxType = -1;
        }

        return maxType;
    }

    /*
    对比去重
     */
    private repDiff(data:number[]):string
    {
        var str:string = "";
        var len:number = data.length;
        var currentType:number = 0;
        for(var i:number=0; i<len; i++)
        {
            if( currentType != data[i])
            {
                currentType = data[i];
                str += data[i];
            }
        }
        return str;
    }
    /*
    根据所在象限与角度计算出方向编号。
    方向编号，以第一象限0度为基础，按照顺时针方向，将圆等分为8份。
     */
    private getDirByAngQuad(ang:number,quad:number):number
    {
        switch(quad)
        {
            case 1:
                if( ang<=22.5 && ang>= 0 )
                {
                    return 1;
                }
                else if( ang<= 67.5 && ang> 22.5 )
                {
                    return 8;
                }
                else
                {
                    return 7;
                }
            case 2:
                if( ang<=22.5 && ang>=0 )
                {
                    return 5;
                }
                else if( ang<= 67.5 && ang> 22.5 )
                {
                    return 6;
                }
                else
                {
                    return 7;
                }
            case 3:
                if( ang<= -67.5 && ang>= -90 )
                {
                    return 3;
                }
                else if( ang<=-22.5 && ang> -67.5 )
                {
                    return 4;
                }
                else{
                    return 5;
                }
            case 4:
                if( ang<=-67.5 && ang>= -90 )
                {
                    return 3;
                }
                else if( ang<=-22.5 && ang>-67.5)
                {
                    return 2;
                }
                else{
                    return 1;
                }
        }
    }

    /*
    计算两点关系所形成的象限
    以P1 作为坐标原点，P2为设定点，判断P2相对于P1时所在象限
     */
    private quadrant(p1:egret.Point,p2:egret.Point):number
    {
        if(p2.x>=p1.x)
        {
            if( p2.y <= p1.y )
            {
                return 1;
            }
            else
            {
                return 4;
            }
        }
        else
        {
            if( p2.y <= p1.y )
            {
                return 2;
            }
            else
            {
                return 3;
            }
        }
    }

    private Levenshtein_Distance(s,t)
    {
        var n=s.length;// length of s
        var m=t.length;// length of t
        var d=[];// matrix
        var i;// iterates through s
        var j;// iterates through t
        var s_i;// ith character of s
        var t_j;// jth character of t
        var cost;// cost

        // Step 1
        if (n == 0) return m;
        if (m == 0) return n;

        // Step 2
        for (i = 0; i <= n; i++) {
            d[i]=[];
            d[i][0] = i;
        }

        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }

        // Step 3

        for (i = 1; i <= n; i++) {
            s_i = s.charAt (i - 1);
            // Step 4
            for (j = 1; j <= m; j++) {
                t_j = t.charAt (j - 1);
                // Step 5
                if (s_i == t_j) {
                    cost = 0;
                }else{
                    cost = 1;
                }

                // Step 6
                d[i][j] = this.Minimum (d[i-1][j]+1, d[i][j-1]+1, d[i-1][j-1] + cost);
            }
        }

        // Step 7
        return d[n][m];
    }

    private Levenshtein_Distance_Percent(s,t):number{

        var l=s.length>t.length?s.length:t.length;
        var d=this.Levenshtein_Distance(s,t);
        return (1-d/l);//.toFixed(4);

    }

    private Minimum(a,b,c){
        return a<b?(a<c?a:c):(b<c?b:c);
    }

}