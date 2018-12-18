class Gesture
{
    private _layer:egret.Shape
    private _gestureRes:Array<any>
    private _gestureData:Array<any>
    // private _gestureSound:egret.Sound
    // private _gestureColor:any
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

    public addEvent(layer:egret.Shape)
    {
        this._layer = layer;

        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
    }
    public removeEvent()
    {
        this._layer.graphics.clear()
        // PanelManager.gamePanel.SetParticle(false, 0, 0)
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
    }

    private _mouseDatas:egret.Point[];
    private _lineData:egret.Point[]
    private _currentPoint:egret.Point;
    private mouseDown(evt:egret.TouchEvent)
    {
        this._layer.graphics.clear();
        this._mouseDatas = [];
        this._lineData = []
        var p:egret.Point = new egret.Point(evt.stageX,evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p)
        this._currentPoint = p;
        this._layer.graphics.moveTo(this._currentPoint.x,this._currentPoint.y);
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
        
        // Common.dispatchEvent(MainNotify.beginLocus)
    }
    private mouseMove(evt:egret.TouchEvent)
    {
        // var p:egret.Point = new egret.Point(evt.stageX, evt.stageY);
        var p:egret.Point = GameObjectPool.getInstance().createObject(egret.Point, "egretPoint")
        p.x = evt.stageX
        p.y = evt.stageY
        this._mouseDatas.push(p);
        this._lineData.push(p)

        this._layer.graphics.lineStyle(8, 0xFFFFFF);
        this._layer.graphics.lineTo(p.x,p.y);
        this._layer.graphics.endFill();
        this._currentPoint = p;
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
    }
    private mouseUp(evt:egret.TouchEvent)
    {
        var p:egret.Point = new egret.Point(evt.stageX,evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p)

        this._layer.graphics.clear();
        // this._layer.graphics.lineStyle(8, 0xff0000, 0.8)
        // this._layer.graphics.endFill();
        // PanelManager.gamePanel.SetParticle(false, p.x, p.y)
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
        console.log( dirstr );
        var rel:number = this.sweep( dirstr );
        console.log("type------------->: ",rel);
        this.disEvent(rel);
    }

    private disEvent(type:number)
    {
		// Config.GestureType = type
        if(type != -1)
        {
            // Common.dispatchEvent(MainNotify.gestureAction)
            for (let i = 0; i < this._gestureRes.length; i++) {
                if (type == this._gestureRes[i].type) {
                    this._layer.graphics.moveTo(this._lineData[0].x,this._lineData[0].y)
                    for (let j = 1; j < this._lineData.length; j++) {
                        this._layer.graphics.lineStyle(8, this._gestureRes[i].color);
                        this._layer.graphics.lineTo(this._lineData[j].x, this._lineData[j].y);
                        this._layer.graphics.endFill();
                    }
                    egret.setTimeout(this._clearGraphics, this, 200)
                    break
                }
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