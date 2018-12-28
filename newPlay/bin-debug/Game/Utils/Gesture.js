var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Gesture = (function () {
    function Gesture() {
        this._symbol = ["28", "46", "82", "64", "141", "585", "3", "7", "5", "1", "4321876", "2345678"];
        this._symbolG = [0, 0, 3, 3, 5, 5, 1, 1, 2, 2, 4, 4];
    }
    // private _gestureSound:egret.Sound
    // private _gestureColor:any
    Gesture.prototype.Init = function () {
        // this._gestureColor = {}
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
        this._group.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
        this._group.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    Gesture.prototype.removeEvent = function () {
        this._layer.graphics.clear();
        // PanelManager.gamePanel.SetParticle(false, 0, 0)
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.mouseDown,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.mouseUp,this);
        // egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.mouseMove,this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.mouseDown, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_END, this.mouseUp, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.mouseUp, this);
        this._group.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.mouseMove, this);
    };
    Gesture.prototype.mouseDown = function (evt) {
        this._isDown = true;
        this._layer.graphics.clear();
        this._mouseDatas = [];
        this._lineData = [];
        var p = new egret.Point(evt.stageX, evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p);
        this._currentPoint = p;
        this._layer.graphics.moveTo(this._currentPoint.x, this._currentPoint.y);
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
        // Common.dispatchEvent(MainNotify.beginLocus)
    };
    Gesture.prototype.mouseMove = function (evt) {
        if (!this._isDown)
            return;
        // var p:egret.Point = new egret.Point(evt.stageX, evt.stageY);
        var p = GameObjectPool.getInstance().createObject(egret.Point, "egretPoint");
        p.x = evt.stageX;
        p.y = evt.stageY;
        this._mouseDatas.push(p);
        this._lineData.push(p);
        this._layer.graphics.lineStyle(8, 0xFFFFFF);
        this._layer.graphics.lineTo(p.x, p.y);
        this._layer.graphics.endFill();
        this._currentPoint = p;
        // PanelManager.gamePanel.SetParticle(true, p.x, p.y)
    };
    Gesture.prototype.mouseUp = function (evt) {
        if (!this._isDown)
            return;
        this._isDown = false;
        var p = new egret.Point(evt.stageX, evt.stageY);
        this._mouseDatas.push(p);
        this._lineData.push(p);
        this._layer.graphics.clear();
        // this._layer.graphics.lineStyle(8, 0xff0000, 0.8)
        // this._layer.graphics.endFill();
        // PanelManager.gamePanel.SetParticle(false, p.x, p.y)
        this.motion();
        // this._gestureSound.play(0, 1)
    };
    Gesture.prototype.motion = function () {
        var _arr = [];
        var currentIndex = 0;
        var len = this._mouseDatas.length;
        _arr.push(this._mouseDatas[currentIndex]);
        for (var i = 0; i < len; i++) {
            if (egret.Point.distance(this._mouseDatas[currentIndex], this._mouseDatas[i]) > 40) {
                currentIndex = i;
                _arr.push(this._mouseDatas[currentIndex]);
            }
        }
        this._mouseDatas = _arr;
        //console.log(this._mouseDatas);
        //console.log("ll:",_arr);
        this.parseDirection();
    };
    Gesture.prototype.parseDirection = function () {
        this._dirsArr = [];
        var len = this._mouseDatas.length;
        for (var i = 0; i < len; i++) {
            if (this._mouseDatas[i + 1]) {
                var p1 = this._mouseDatas[i];
                var p2 = this._mouseDatas[i + 1];
                var a = p1.y - p2.y;
                var b = egret.Point.distance(p1, p2);
                var rad = Math.asin(a / b);
                var ang = Number((rad * 57.2957800).toFixed(1)); // rad * 180/Math.PI 直接求常量，优化
                var quad = this.quadrant(p1, p2);
                var dir = this.getDirByAngQuad(ang, quad);
                this._dirsArr.push(dir);
            }
        }
        //console.log(this._dirsArr);
        var dirstr = this.repDiff(this._dirsArr);
        console.log(dirstr);
        var rel = this.sweep(dirstr);
        console.log("type------------->: ", rel);
        this.disEvent(rel);
    };
    Gesture.prototype.disEvent = function (type) {
        GameConfig.gestureType = type;
        if (type != -1) {
            Common.dispatchEvent(MainNotify.gestureAction);
            for (var i = 0; i < this._gestureRes.length; i++) {
                if (type == this._gestureRes[i].type) {
                    this._layer.graphics.moveTo(this._lineData[0].x, this._lineData[0].y);
                    for (var j = 1; j < this._lineData.length; j++) {
                        this._layer.graphics.lineStyle(8, this._gestureRes[i].color);
                        this._layer.graphics.lineTo(this._lineData[j].x, this._lineData[j].y);
                        this._layer.graphics.endFill();
                    }
                    egret.setTimeout(this._clearGraphics, this, 200);
                    break;
                }
            }
        }
    };
    Gesture.prototype._clearGraphics = function () {
        while (this._lineData.length > 0) {
            var p = this._lineData.pop();
            GameObjectPool.getInstance().destroyObject(p);
        }
        this._layer.graphics.clear();
        this._lineData.length = 0;
    };
    // v 0
    // | 1
    // - 2
    // ^ 3
    // 6 4
    // z 5
    Gesture.prototype.sweep = function (str) {
        var maxType = -1;
        var max = -1;
        var len = this._gestureData.length;
        for (var i = 0; i < len; i++) {
            var val = this.Levenshtein_Distance_Percent(this._gestureData[i].data, str);
            if (val > max) {
                max = val;
                maxType = this._gestureData[i].type;
            }
        }
        if (max < 0.5) {
            maxType = -1;
        }
        return maxType;
    };
    /*
    对比去重
     */
    Gesture.prototype.repDiff = function (data) {
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
    Gesture.prototype.getDirByAngQuad = function (ang, quad) {
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
    Gesture.prototype.quadrant = function (p1, p2) {
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
    Gesture.prototype.Levenshtein_Distance = function (s, t) {
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
                d[i][j] = this.Minimum(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
            }
        }
        // Step 7
        return d[n][m];
    };
    Gesture.prototype.Levenshtein_Distance_Percent = function (s, t) {
        var l = s.length > t.length ? s.length : t.length;
        var d = this.Levenshtein_Distance(s, t);
        return (1 - d / l); //.toFixed(4);
    };
    Gesture.prototype.Minimum = function (a, b, c) {
        return a < b ? (a < c ? a : c) : (b < c ? b : c);
    };
    return Gesture;
}());
__reflect(Gesture.prototype, "Gesture");
//# sourceMappingURL=Gesture.js.map