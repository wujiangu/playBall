var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Gesture = (function () {
    function Gesture() {
        this._dirsArr = new Array();
        this._symbol = ["28", "46", "82", "64", "141", "585", "3", "7", "5", "1", "4321876", "2345678"];
        this._symbolG = [0, 0, 3, 3, 5, 5, 1, 1, 2, 2, 4, 4];
    }
    // private _gestureSound:egret.Sound
    // private _gestureColor:any
    //{"difficult":2, "type":104,"path":"gestureSheet_json.gesture104","data":["2828", "4646"], "count":2, "balloon":"balloonPurple", "color":"0xaa69e9"},
    Gesture.prototype.init = function () {
        // this._gestureColor = {}
        this._mouseDatas = new Array();
        this._lineData = new Array();
        this._catmullRom = new Array();
        this._arr = new Array();
        this._gestureData = [];
        this._gestureRes = RES.getRes("gesture_json");
        for (var i = 0; i < this._gestureRes.length; i++) {
            var data = this._gestureRes[i].data;
            for (var j = 0; j < data.length; j++) {
                var gesture = { type: -1, data: "" };
                gesture.type = this._gestureRes[i].type;
                gesture.data = data[j];
                // this._gestureColor[gesture.type] = gesture.color
                this._gestureData.push(gesture);
            }
        }
        // this._gestureSound = RES.getRes("gesture_mp3")
        // this._gestureSound.load(AudioManager.gesture)
    };
    Object.defineProperty(Gesture.prototype, "gestureRes", {
        get: function () {
            return this._gestureRes;
        },
        enumerable: true,
        configurable: true
    });
    Gesture.prototype.addEvent = function (layer, group) {
        this._layer = layer;
        this._group = group;
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        // egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._mouseDown, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_END, this._mouseUp, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._mouseUp, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this._mouseMove, this);
    };
    Gesture.prototype.removeEvent = function () {
        this._layer.graphics.clear();
        // PanelManager.gamePanel.setParticle(false, 0, 0)
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
        // PanelManager.gameScenePanel.setParticle(false, 0, 0)
        this._group.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._mouseDown, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_END, this._mouseUp, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._mouseUp, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this._mouseMove, this);
    };
    Gesture.prototype._mouseDown = function (evt) {
        if (this._isDown)
            return;
        this._isDown = true;
        this._layer.graphics.clear();
        this._mouseDatas.length = 0;
        this._lineData.length = 0;
        this._catmullRom.length = 0;
        this._catmullIndex = 0;
        // var p:any = new egret.Point(evt.stageX,evt.stageY);
        var p1 = egret.Point.create(evt.stageX, evt.stageY);
        var p2 = egret.Point.create(evt.stageX, evt.stageY);
        // var p:any = {x:evt.stageX, y:evt.stageY}
        this._mouseDatas.push(p1);
        this._lineData.push(p2);
        // this._currentPoint = p;
        // this._layer.graphics.moveTo(this._currentPoint.x,this._currentPoint.y);
        // PanelManager.gameScenePanel.setParticle(true, p.x, p.y)
        // PanelManager.gamePanel.setParticle(true, p.x, p.y)
        // Common.dispatchEvent(MainNotify.beginLocus)
    };
    Gesture.prototype._mouseMove = function (evt) {
        if (!this._isDown)
            return;
        // var p:egret.Point = new egret.Point(evt.stageX, evt.stageY);
        var p1 = egret.Point.create(evt.stageX, evt.stageY);
        var p2 = egret.Point.create(evt.stageX, evt.stageY);
        // var p:any = {x:evt.stageX, y:evt.stageY}
        // var p:egret.Point = GameObjectPool.getInstance().createObject(egret.Point, "egretPoint")
        // p.x = evt.stageX
        // p.y = evt.stageY
        this._mouseDatas.push(p1);
        /////////////////////////////////
        this._lineData.push(p2);
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
        this._layer.graphics.lineTo(p1.x, p1.y);
        this._layer.graphics.endFill();
        // this._currentPoint = p
        // PanelManager.gameScenePanel.setParticle(true, p.x, p.y)
        // PanelManager.gamePanel.setParticle(true, p.x, p.y)
    };
    Gesture.prototype._mouseUp = function (evt) {
        if (!this._isDown)
            return;
        this._isDown = false;
        // var p:egret.Point = new egret.Point(evt.stageX,evt.stageY);
        var p1 = egret.Point.create(evt.stageX, evt.stageY);
        var p2 = egret.Point.create(evt.stageX, evt.stageY);
        // var p:any = {x:evt.stageX, y:evt.stageY}
        this._mouseDatas.push(p1);
        this._lineData.push(p2);
        // for (let i = 0; i < this._mouseDatas.length; i++) Common.log(this._mouseDatas[i])
        this._layer.graphics.clear();
        // this._layer.graphics.lineStyle(8, 0xff0000, 0.8)
        // this._layer.graphics.endFill();
        // PanelManager.gamePanel.setParticle(false, p.x, p.y)
        // PanelManager.gameScenePanel.setParticle(false, p.x, p.y)
        this._motion();
        // this._gestureSound.play(0, 1)
    };
    Gesture.prototype._motion = function () {
        this._arr.length = 0;
        var currentIndex = 0;
        var len = this._mouseDatas.length;
        var p = egret.Point.create(this._mouseDatas[currentIndex].x, this._mouseDatas[currentIndex].y);
        this._arr.push(p);
        for (var i = 0; i < len; i++) {
            // let distance = MathUtils.getDistance(this._mouseDatas[currentIndex].x, this._mouseDatas[currentIndex].y, this._mouseDatas[i].x, this._mouseDatas[i].y)
            if (egret.Point.distance(this._mouseDatas[currentIndex], this._mouseDatas[i]) > 40) 
            // if( distance > 40 )
            {
                currentIndex = i;
                var p0 = egret.Point.create(this._mouseDatas[currentIndex].x, this._mouseDatas[currentIndex].y);
                this._arr.push(p0);
                // this._arr.push(this._mouseDatas[currentIndex]);
            }
        }
        // while(this._mouseDatas.length > 0) {
        //     let p:egret.Point = this._mouseDatas.pop()
        //     egret.Point.release(p)
        // }
        // while(this._arr.length > 0) {
        //     let p:egret.Point = this._arr.pop()
        //     this._mouseDatas.push(p)
        // }
        // this._mouseDatas = this._arr
        this.parseDirection();
    };
    Gesture.prototype.parseDirection = function () {
        this._dirsArr.length = 0;
        var len = this._arr.length;
        for (var i = 0; i < len; i++) {
            if (this._arr[i + 1]) {
                // var p1:egret.Point = this._mouseDatas[i];
                // var p2:egret.Point = this._mouseDatas[i+1];
                // var p1:any = this._mouseDatas[i];
                // var p2:any = this._mouseDatas[i+1];
                var a = this._arr[i].y - this._arr[i + 1].y;
                var b = egret.Point.distance(this._arr[i], this._arr[i + 1]);
                // var b:number = MathUtils.getDistance(p1.x, p1.y, p2.x, p2.y)
                var rad = Math.asin(a / b);
                var ang = Number((rad * 57.2957800).toFixed(1)); // rad * 180/Math.PI 直接求常量，优化
                var quad = this._quadrant(this._arr[i], this._arr[i + 1]);
                var dir = this._getDirByAngQuad(ang, quad);
                this._dirsArr.push(dir);
                // console.log("quad: ",quad, "ang: ", ang);
            }
        }
        // console.log(this._dirsArr);
        var dirstr = this._repDiff(this._dirsArr);
        // console.log( dirstr );
        var rel = this._sweep(dirstr);
        // console.log("type------------->: ",rel);
        this._disEvent(rel);
    };
    Gesture.prototype._disEvent = function (type) {
        GameConfig.gestureType = type;
        if (type != -1) {
            Common.dispatchEvent(MainNotify.gestureAction);
            this._catmullIndex = 0;
            for (var i = 0; i < this._gestureRes.length; i++) {
                if (type == this._gestureRes[i].type) {
                    this._layer.graphics.moveTo(this._lineData[0].x, this._lineData[0].y);
                    this._layer.graphics.lineStyle(16, this._gestureRes[i].color);
                    for (var i_1 = this._lineData.length; i_1 >= 0; i_1--) {
                        if (i_1 % 2 > 0) {
                            egret.Point.release(this._lineData[i_1]);
                            this._lineData.splice(i_1, 1);
                        }
                    }
                    this._bezierInterpolation();
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
                    this._layer.graphics.endFill();
                    break;
                }
            }
        }
        while (this._lineData.length > 0) {
            var p = this._lineData.pop();
            egret.Point.release(p);
        }
        while (this._mouseDatas.length > 0) {
            var p = this._mouseDatas.pop();
            egret.Point.release(p);
        }
        while (this._arr.length > 0) {
            var p = this._arr.pop();
            egret.Point.release(p);
        }
        egret.setTimeout(this._clearGraphics, this, 200);
    };
    // 贝塞尔插值算法
    Gesture.prototype._bezierInterpolation = function () {
        var scale = 0.6;
        var midpoints = [];
        //生成中点   
        var originCount = this._lineData.length;
        for (var i = 0; i < this._lineData.length; i++) {
            var nexti = (i + 1) % originCount;
            // let p0 = this._lineData[i]
            // let p1 = this._lineData[nexti]
            var p0 = { x: this._lineData[i].x, y: this._lineData[i].y };
            if (this._lineData[nexti] != undefined) {
                var p1 = { x: this._lineData[nexti].x, y: this._lineData[nexti].y };
                var midPoint = { x: 0, y: 0 };
                midPoint.x = 0.5 * (p0.x + p1.x);
                midPoint.y = 0.5 * (p0.y + p1.y);
                midpoints.push(midPoint);
            }
        }
        //平移中点
        var extrapoints = new Array(2 * originCount);
        for (var i = 0; i < originCount; i++) {
            var nexti = (i + 1) % originCount;
            var backi = (i + originCount - 1) % originCount;
            var midinmid = { x: 0, y: 0 };
            midinmid.x = (midpoints[i].x + midpoints[backi].x) / 2.0;
            midinmid.y = (midpoints[i].y + midpoints[backi].y) / 2.0;
            var offsetx = this._lineData[i].x - midinmid.x;
            var offsety = this._lineData[i].y - midinmid.y;
            var extraindex = 2 * i;
            extrapoints[extraindex] = { x: 0, y: 0 };
            extrapoints[extraindex].x = midpoints[backi].x + offsetx;
            extrapoints[extraindex].y = midpoints[backi].y + offsety;
            //朝 originPoint[i]方向收缩    
            var addx = (extrapoints[extraindex].x - this._lineData[i].x) * scale;
            var addy = (extrapoints[extraindex].y - this._lineData[i].y) * scale;
            extrapoints[extraindex].x = this._lineData[i].x + addx;
            extrapoints[extraindex].y = this._lineData[i].y + addy;
            var extranexti = (extraindex + 1) % (2 * originCount);
            extrapoints[extranexti] = { x: 0, y: 0 };
            extrapoints[extranexti].x = midpoints[i].x + offsetx;
            extrapoints[extranexti].y = midpoints[i].y + offsety;
            //  朝 originPoint[i]方向收缩    
            addx = (extrapoints[extranexti].x - this._lineData[i].x) * scale;
            addy = (extrapoints[extranexti].y - this._lineData[i].y) * scale;
            extrapoints[extranexti].x = this._lineData[i].x + addx;
            extrapoints[extranexti].y = this._lineData[i].y + addy;
        }
        var controlPoint = [];
        //生成4控制点，产生贝塞尔曲线
        if (this._lineData[0] && this._lineData[1]) {
            this._layer.graphics.moveTo(this._lineData[0].x, this._lineData[0].y);
            this._layer.graphics.lineTo(this._lineData[1].x, this._lineData[1].y);
        }
        for (var i = 1; i < originCount; i++) {
            controlPoint[0] = { x: this._lineData[i].x, y: this._lineData[i].y };
            var extraindex = 2 * i;
            controlPoint[1] = extrapoints[extraindex + 1];
            var extranexti = (extraindex + 2) % (2 * originCount);
            controlPoint[2] = extrapoints[extranexti];
            var nexti = (i + 1) % originCount;
            if (nexti > 0) {
                controlPoint[3] = { x: this._lineData[nexti].x, y: this._lineData[nexti].y };
                this._layer.graphics.moveTo(controlPoint[0].x, controlPoint[0].y);
                this._layer.graphics.cubicCurveTo(controlPoint[1].x, controlPoint[1].y, controlPoint[2].x, controlPoint[2].y, controlPoint[3].x, controlPoint[3].y);
            }
        }
    };
    Gesture.prototype._clearGraphics = function () {
        // while(this._lineData.length > 0) {
        //     let p:egret.Point = this._lineData.pop()
        //     // GameObjectPool.getInstance().destroyObject(p)
        // }
        this._layer.graphics.clear();
        // this._mouseDatas.length = 0
        // this._lineData.length = 0
        // this._arr.length = 0
    };
    // v 0
    // | 1
    // - 2
    // ^ 3
    // 6 4
    // z 5
    Gesture.prototype._sweep = function (str) {
        var maxType = -1;
        var max = -1;
        var len = this._gestureData.length;
        for (var i = 0; i < len; i++) {
            var val = this._levenshteinDistancePercent(this._gestureData[i].data, str);
            if (val > max) {
                max = val;
                maxType = this._gestureData[i].type;
            }
        }
        if (max < 0.4) {
            maxType = -1;
        }
        return maxType;
    };
    /*
    对比去重
     */
    Gesture.prototype._repDiff = function (data) {
        var str = "";
        var len = data.length;
        var currentType = 0;
        for (var i = 0; i < len; i++) {
            if (currentType != data[i]) {
                currentType = data[i];
                str += data[i];
            }
        }
        return str;
    };
    /*
    根据所在象限与角度计算出方向编号。
    方向编号，以第一象限0度为基础，按照顺时针方向，将圆等分为8份。
     */
    Gesture.prototype._getDirByAngQuad = function (ang, quad) {
        switch (quad) {
            case 1:
                if (ang <= 22.5 && ang >= 0) {
                    return 1;
                }
                else if (ang <= 67.5 && ang > 22.5) {
                    return 8;
                }
                else {
                    return 7;
                }
            case 2:
                if (ang <= 22.5 && ang >= 0) {
                    return 5;
                }
                else if (ang <= 67.5 && ang > 22.5) {
                    return 6;
                }
                else {
                    return 7;
                }
            case 3:
                if (ang <= -67.5 && ang >= -90) {
                    return 3;
                }
                else if (ang <= -22.5 && ang > -67.5) {
                    return 4;
                }
                else {
                    return 5;
                }
            case 4:
                if (ang <= -67.5 && ang >= -90) {
                    return 3;
                }
                else if (ang <= -22.5 && ang > -67.5) {
                    return 2;
                }
                else {
                    return 1;
                }
        }
    };
    /*
    计算两点关系所形成的象限
    以P1 作为坐标原点，P2为设定点，判断P2相对于P1时所在象限
     */
    Gesture.prototype._quadrant = function (p1, p2) {
        if (p2.x >= p1.x) {
            if (p2.y <= p1.y) {
                return 1;
            }
            else {
                return 4;
            }
        }
        else {
            if (p2.y <= p1.y) {
                return 2;
            }
            else {
                return 3;
            }
        }
    };
    Gesture.prototype._levenshteinDistance = function (s, t) {
        var n = s.length; // length of s
        var m = t.length; // length of t
        var d = []; // matrix
        var i; // iterates through s
        var j; // iterates through t
        var s_i; // ith character of s
        var t_j; // jth character of t
        var cost; // cost
        // Step 1
        if (n == 0)
            return m;
        if (m == 0)
            return n;
        // Step 2
        for (i = 0; i <= n; i++) {
            d[i] = [];
            d[i][0] = i;
        }
        for (j = 0; j <= m; j++) {
            d[0][j] = j;
        }
        // Step 3
        for (i = 1; i <= n; i++) {
            s_i = s.charAt(i - 1);
            // Step 4
            for (j = 1; j <= m; j++) {
                t_j = t.charAt(j - 1);
                // Step 5
                if (s_i == t_j) {
                    cost = 0;
                }
                else {
                    cost = 1;
                }
                // Step 6
                d[i][j] = this._minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        // Step 7
        return d[n][m];
    };
    Gesture.prototype._levenshteinDistancePercent = function (s, t) {
        var l = s.length > t.length ? s.length : t.length;
        var d = this._levenshteinDistance(s, t);
        return (1 - d / l); //.toFixed(4);
    };
    Gesture.prototype._minimum = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    };
    return Gesture;
}());
__reflect(Gesture.prototype, "Gesture");
//# sourceMappingURL=Gesture.js.map