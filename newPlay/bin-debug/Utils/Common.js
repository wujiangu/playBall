/**
* 游戏公用常量和方法
*/
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Common;
(function (Common) {
    /**全局字体颜色 */
    Common.TextColors = {
        white: 0xFFFFFF,
        milkWhite: 0xefe8c0,
        grayWhite: 0xceb6a2,
        yellow: 0xffff00,
        lightYellow: 0xffd375,
        orangeYellow: 0xff9900,
        red: 0xa52d1c,
        green: 0x00e500,
        blue: 0x1a94d7,
        grayBlue: 0x2f5177,
        purple: 0xe938f2,
        pink: 0xFF3030,
        black: 0x2e2d2d,
        golden: 0xFFD700,
        lvNotFull: 0x6f685d,
        lvFull: 0x91bd32,
    };
    /**全局字体大小 */
    Common.LabelFontSize = {
        littleSize: 12,
        middleSize: 18,
        normalSize: 24,
        bigSize: 36 //大型字体大小
    };
    /**判断是否是微信浏览 */
    function isWeiXin() {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (microStr == "null") {
            return false;
        }
        else if (microStr == "micromessenger") {
            return true;
        }
    }
    Common.isWeiXin = isWeiXin;
    /**获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook */
    function systemType() {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if (("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        }
        else if (("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        }
        else if (("" + ua.match(/android/i)) == "android") {
            return "android";
        }
        else if (("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        }
        else if (("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        }
        else if (("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        }
        else if (("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        }
        else {
            console.log("未知系统类型");
        }
    }
    Common.systemType = systemType;
    /**获得平台类型 如 微信、qqzone、qq、微博、校内、facebook */
    function platformType() {
        var ua = window.navigator.userAgent.toLowerCase();
        if (("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        }
        else if (("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        }
        else if (("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        }
        else if (("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        }
        else if (("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        }
        else if (("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        }
        else if (("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        }
        else {
            return "other";
        }
    }
    Common.platformType = platformType;
    /**
     * 输出log信息
     */
    function log(message) {
        var optionalParams = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            optionalParams[_i - 1] = arguments[_i];
        }
        if (!!true) {
            console.log.apply(console, [message].concat(optionalParams));
        }
    }
    Common.log = log;
    /**
     * json格式转换为url参数字符串
     */
    function parseParam(param, isChild) {
        if (isChild === void 0) { isChild = false; }
        var str = "";
        var parseArray = function (obj, flag) {
            if (flag === void 0) { flag = false; }
            for (var i = 0; i < obj.length; i++) {
                var temp = typeof (obj[i]);
                if (temp == "string" || temp == "number" || temp == "boolean") {
                    str += obj[i] + ",";
                }
                else {
                    str += parseParam(obj[i], true);
                    if (!flag)
                        str += ",";
                }
            }
            if (obj.length > 0)
                str = str.substr(0, str.length - 1);
        };
        if ((Object.prototype.toString.call(param) == "[object Array]") && isChild) {
            str += "[";
            parseArray(param, true);
            str += "]";
        }
        if ((Object.prototype.toString.call(param) == "[object Object]")) {
            if (isChild) {
                str += "{";
                for (var key_1 in param) {
                    str += "\"" + key_1 + "\"" + ":";
                    if (typeof (param[key_1]) == "string" || typeof (param[key_1]) == "number" || typeof (param[key_1]) == "boolean") {
                        str += param[key_1];
                    }
                    else {
                        str += parseParam(param[key_1], true);
                    }
                    str += ",";
                }
                if (Object.keys(param).length > 0)
                    str = str.substr(0, str.length - 1);
                str += "}";
            }
            else {
                for (var key in param) {
                    var valueType = typeof (param[key]);
                    if (valueType == "string" || valueType == "number" || valueType == "boolean") {
                        str += (key + "=" + param[key] + "&");
                    }
                    else {
                        if ((Object.prototype.toString.call(param[key]) == "[object Array]")) {
                            str += key + "=[";
                            parseArray(param[key], false);
                            str += "]&";
                        }
                        else {
                            str += key + "=";
                            str += parseParam(param[key], true);
                            str += "&";
                        }
                    }
                }
            }
        }
        return str;
    }
    ;
    /**
     * json格式转换为url参数字符串(不完全转化)
     */
    function parseParamIncomplete(param) {
        var str = "";
        for (var key in param) {
            str += (key + "=" + param[key] + "&");
        }
        return str;
    }
    /**
     * 获取url参数
     */
    function getUrlParams(data) {
        var str = parseParam(data);
        return str.substr(0, str.length - 1);
    }
    Common.getUrlParams = getUrlParams;
    //派发事件
    function dispatchEvent(type, obj, bubbles, cancelable) {
        if (obj === void 0) { obj = null; }
        if (bubbles === void 0) { bubbles = false; }
        if (cancelable === void 0) { cancelable = false; }
        // var event = GameObjectPool.getInstance().createObject(lcp.LEvent, type, obj, bubbles, cancelable)
        var event = new lcp.LEvent(type, obj, bubbles, cancelable);
        lcp.LListener.getInstance().dispatchEvent(event);
        // GameObjectPool.getInstance().destroyObject(event)
    }
    Common.dispatchEvent = dispatchEvent;
    //监听事件
    function addEventListener(type, listener, thisObject, useCapture, priority) {
        if (useCapture === void 0) { useCapture = false; }
        if (priority === void 0) { priority = 0; }
        lcp.LListener.getInstance().addEventListener(type, listener, thisObject, useCapture, priority);
    }
    Common.addEventListener = addEventListener;
    //删除事件
    function removeEventListener(type, listener, thisObject, useCapture) {
        if (useCapture === void 0) { useCapture = false; }
        lcp.LListener.getInstance().removeEventListener(type, listener, thisObject, useCapture);
    }
    Common.removeEventListener = removeEventListener;
    //当前舞台
    function curStage() {
        return egret.MainContext.instance.stage;
    }
    Common.curStage = curStage;
    function SetXY(obj, x, y) {
        if (obj == null)
            return;
        obj.x = x;
        obj.y = y;
    }
    Common.SetXY = SetXY;
    function CreateText(name, size, textColor, isBold, fontFamily, textAlign) {
        if (size === void 0) { size = 30; }
        if (textColor === void 0) { textColor = 0xffffff; }
        if (isBold === void 0) { isBold = false; }
        if (fontFamily === void 0) { fontFamily = "Arial"; }
        if (textAlign === void 0) { textAlign = "left"; }
        var txt = new egret.TextField();
        txt.text = name;
        txt.size = size;
        txt.textColor = textColor;
        txt.bold = isBold;
        txt.fontFamily = fontFamily;
        txt.textAlign = textAlign;
        return txt;
    }
    Common.CreateText = CreateText;
    function CreateShape(x, y, width, height) {
        var shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawRect(x, y, width, height);
        shape.graphics.endFill();
        return shape;
    }
    Common.CreateShape = CreateShape;
    /** create mc
     * @param name clip name
     */
    function CreateMovieClip(name) {
        var data = RES.getRes(name + "_json");
        var texture = RES.getRes(name + "_png");
        var mcData = new egret.MovieClipDataFactory(data, texture);
        var mc;
        mc = new egret.MovieClip(mcData.generateMovieClipData(name));
        return mc;
    }
    Common.CreateMovieClip = CreateMovieClip;
    /**
     * 创建文本
     * @param str   显示的内容
     * @param x,y   文本的位置
     * @param size  文本的大小(默认24)
     * @param color 文本的颜色(默认白色)
     */
    function createText(str, x, y, size, color) {
        if (size === void 0) { size = 24; }
        if (color === void 0) { color = 0xFFFFFF; }
        var text = new egret.TextField();
        text.text = str;
        text.x = x;
        text.y = y;
        text.size = size;
        text.textColor = color;
        return text;
    }
    Common.createText = createText;
    /**
     * 创建位图
     * @param name  位图的ID
     */
    function createBitmap(name) {
        var bitMap = new egret.Bitmap();
        var texture = RES.getRes(name);
        bitMap.texture = texture;
        return bitMap;
    }
    Common.createBitmap = createBitmap;
    //设置控件位置
    function setControlPosition(control, x, y) {
        control.x = x;
        control.y = y;
    }
    Common.setControlPosition = setControlPosition;
    /**
     * 创建位图字体
     */
    function createBitmapText(name, parent) {
        if (parent === void 0) { parent = null; }
        var bitmapText = new egret.BitmapText();
        var font = RES.getRes(name);
        bitmapText.font = font;
        if (parent)
            parent.addChild(bitmapText);
        return bitmapText;
    }
    Common.createBitmapText = createBitmapText;
    /**
     * 深复制对象方法
     */
    function cloneObj(obj) {
        var newObj = {};
        if (obj instanceof Array) {
            newObj = [];
        }
        for (var key in obj) {
            var val = obj[key];
            newObj[key] = typeof val === 'object' ? cloneObj(val) : val;
        }
        return newObj;
    }
    Common.cloneObj = cloneObj;
    /**得到圆角矩形*/
    function getRoundRect(w, h, c, ew, eh, x, y) {
        if (c === void 0) { c = 0; }
        if (ew === void 0) { ew = 5; }
        if (eh === void 0) { eh = 5; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var s = new egret.Sprite();
        s.graphics.beginFill(c);
        s.graphics.drawRoundRect(x, y, w, h, ew, eh);
        s.graphics.endFill();
        return s;
    }
    Common.getRoundRect = getRoundRect;
    /**得到圆形*/
    function getCircle(r, c, x, y) {
        if (c === void 0) { c = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var s = new egret.Sprite();
        s.graphics.beginFill(c);
        s.graphics.drawCircle(x, y, r);
        s.graphics.endFill();
        return s;
    }
    Common.getCircle = getCircle;
    /**得到矩形*/
    function getRect(w, h, c, x, y) {
        if (c === void 0) { c = 0; }
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        var s = new egret.Sprite();
        s.graphics.beginFill(c);
        s.graphics.drawRect(x, y, w, h);
        s.graphics.endFill();
        return s;
    }
    Common.getRect = getRect;
    var Const = (function () {
        function Const() {
        }
        /**布局 横版*/
        Const.HORIZONTAL = "horizontal";
        /**布局 竖版*/
        Const.VERTICAL = "vertical";
        /**形状 方块*/
        Const.SHAPE_RECT = "shape rect";
        /**形状 圆角方块*/
        Const.SHAPE_RECT_ROUND = "shape rect round";
        /**形状 圆块*/
        Const.SHAPE_CIRCLE = "shape circle";
        /**版本 调试*/
        Const.VER_DEBUG = "debug";
        /**版本 发布*/
        Const.VER_RELEASE = "release";
        return Const;
    }());
    Common.Const = Const;
    __reflect(Const.prototype, "Common.Const");
    var MoonDisplayObject = (function (_super) {
        __extends(MoonDisplayObject, _super);
        function MoonDisplayObject() {
            var _this = _super.call(this) || this;
            _this._type = Const.SHAPE_RECT;
            _this._color = 0;
            _this.display = new egret.Sprite;
            _this.bg = new egret.Sprite;
            return _this;
        }
        Object.defineProperty(MoonDisplayObject.prototype, "type", {
            get: function () { return this._type; },
            set: function (value) { this._type = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonDisplayObject.prototype, "color", {
            get: function () { return this._color; },
            set: function (value) { this._color = value; this._data.c = value; this.draw(); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MoonDisplayObject.prototype, "data", {
            /**{w:1,h:1,r:1,c:1,ew:1,eh:1} */
            set: function (value) { this._data = value; this.draw(); },
            enumerable: true,
            configurable: true
        });
        MoonDisplayObject.prototype.draw = function () {
            this._color = this._data.c;
            this.display.graphics.clear();
            this.display = this.getDisplay(this._data);
            this.addChild(this.display);
            this.setPosition();
        };
        MoonDisplayObject.prototype.setPosition = function () {
            if (this._hasBg && this.type != Const.SHAPE_CIRCLE) {
                this.display.x = (this.bg.width - this.display.width) >> 1;
                this.display.y = (this.bg.height - this.display.height) >> 1;
            }
        };
        MoonDisplayObject.prototype.setBackground = function (color, side) {
            if (side === void 0) { side = 1; }
            this._hasBg = true;
            var d = this._data;
            var o = {};
            for (var i in d) {
                o[i] = d[i];
            }
            o.c = color;
            if (o.w)
                o.w = o.w + side * 2;
            if (o.h)
                o.h = o.h + side * 2;
            if (o.r)
                o.r = o.r + side;
            this.bg.graphics.clear();
            this.bg = this.getDisplay(o);
            this.addChildAt(this.bg, 0);
            this.setPosition();
        };
        MoonDisplayObject.prototype.getDisplay = function (o) {
            switch (this.type) {
                case Const.SHAPE_RECT:
                    return Common.getRect(o.w, o.h, o.c);
                case Const.SHAPE_RECT_ROUND:
                    return Common.getRoundRect(o.w, o.h, o.c, o.ew, o.eh);
                case Const.SHAPE_CIRCLE:
                    return Common.getCircle(o.r, o.c);
            }
        };
        return MoonDisplayObject;
    }(egret.Sprite));
    Common.MoonDisplayObject = MoonDisplayObject;
    __reflect(MoonDisplayObject.prototype, "Common.MoonDisplayObject");
})(Common || (Common = {}));
//# sourceMappingURL=Common.js.map