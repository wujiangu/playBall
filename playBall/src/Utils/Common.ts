/**
* 游戏公用常量和方法
*/

namespace Common {
    /**全局字体颜色 */
    export var TextColors = {
        white: 0xFFFFFF,//白色
        milkWhite: 0xefe8c0,//乳白色 
        grayWhite: 0xceb6a2,//灰白色
        yellow: 0xffff00,//金黄色 
        lightYellow: 0xffd375,//淡黄色
        orangeYellow: 0xff9900,//橘黄色//道具名称 //玩家姓名
        red: 0xa52d1c,//红色
        green: 0x00e500,//绿色 
        blue: 0x1a94d7,//蓝色 
        grayBlue: 0x2f5177,//墨蓝色 
        purple: 0xe938f2,//紫色 
        pink: 0xFF3030,//粉色 
        black: 0x2e2d2d,//黑色
        golden: 0xFFD700, //金色
        lvNotFull: 0x6f685d, //等级未满
        lvFull: 0x91bd32, //等级已满
    }
    /**全局字体大小 */
    export var LabelFontSize = {
        littleSize: 12,//小型字体大小
        middleSize: 18,//中型字体大小
        normalSize: 24,//正常字体大小
        bigSize: 36//大型字体大小
    }
    /**判断是否是微信浏览 */
    export function isWeiXin(): boolean {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if(microStr == "null") {
            return false;
        } else if(microStr == "micromessenger") {
            return true;
        }
    }
    /**获得浏览器类型 pc android ios -- 可扩展为其他 如 微信、qqzone、qq、微博、校内、facebook */
    export function systemType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        var microStr = "" + ua.match(/MicroMessenger/i);
        if(("" + ua.match(/windows nt/i)) == "windows nt") {
            return "windows";
        } else if(("" + ua.match(/iphone/i)) == "iphone") {
            return "ios";
        } else if(("" + ua.match(/android/i)) == "android") {
            return "android";
        } else if(("" + ua.match(/ipad/i)) == "ipad") {
            return "ipad";
        } else if(("" + ua.match(/linux/i)) == "linux") {
            return "linux";
        } else if(("" + ua.match(/mac/i)) == "mac") {
            return "mac";
        } else if(("" + ua.match(/ucbrower/i)) == "ucbrower") {
            return "ucbrower";
        } else {
            console.log("未知系统类型");
        }
    }
    /**获得平台类型 如 微信、qqzone、qq、微博、校内、facebook */
    export function platformType(): string {
        var ua = window.navigator.userAgent.toLowerCase();
        if(("" + ua.match(/micromessenger/i)) == "micromessenger") {
            return "micromessenger";
        } else if(("" + ua.match(/qzone/i)) == "qzone") {
            return "qzone";
        } else if(("" + ua.match(/weibo/i)) == "weibo") {
            return "weibo";
        } else if(("" + ua.match(/qq/i)) == "qq") {
            return "qq";
        } else if(("" + ua.match(/renren/i)) == "renren") {
            return "renren";
        } else if(("" + ua.match(/txmicroblog/i)) == "txmicroblog") {
            return "txmicroblog";
        } else if(("" + ua.match(/douban/i)) == "douban") {
            return "douban";
        } else {
            return "other";
        }
    }
    
    /**
     * 输出log信息
     */
    export function log(message?: any, ...optionalParams: any[]) {
        if (!!DEBUG) {
            console.log(message, ...optionalParams)
        }
    }

    /**
     * json格式转换为url参数字符串
     */
    function parseParam(param, isChild=false):string {
        var str: string = "";
        let parseArray = function (obj, flag=false) {
            for (let i = 0; i < obj.length; i++) {
                let temp: string = typeof (obj[i]);
                if (temp == "string" || temp == "number" || temp == "boolean") {
                    str += obj[i] + ",";
                } else {
                    str += parseParam(obj[i], true);
                    if (!flag) str += ",";
                }
            }
            if (obj.length > 0) str = str.substr(0, str.length-1);
        }
        if ((Object.prototype.toString.call(param) == "[object Array]") && isChild) {
            str += "[";
            parseArray(param, true);
            str += "]";
        }

        if ((Object.prototype.toString.call(param) == "[object Object]")) {
            if (isChild) {
                str += "{";
                for (let key in param) {
                    str += "\"" + key + "\"" + ":";
                    if (typeof (param[key]) == "string" || typeof (param[key]) == "number" || typeof (param[key]) == "boolean") {
                        str += param[key];
                    } else {
                        str += parseParam(param[key], true);
                    }
                    str += ",";
                }
                if (Object.keys(param).length > 0) str = str.substr(0, str.length-1);
                str += "}";
            } else {
                for (var key in param) {
                    let valueType: string = typeof (param[key]);
                    if (valueType == "string" || valueType == "number" || valueType == "boolean") {
                        str += (key + "=" + param[key] + "&");
                    } else {
                        if ((Object.prototype.toString.call(param[key]) == "[object Array]")) {
                            str += key + "=[";
                            parseArray(param[key], false)
                            str += "]&";
                        } else {
                            str += key + "=";
                            str += parseParam(param[key], true);
                            str += "&";
                        }
                    }
                }   
            }
        }
        return str
    };

    /**
     * json格式转换为url参数字符串(不完全转化)
     */
    function parseParamIncomplete(param):string {
        var str: string = "";
        for (var key in param) {
            str += (key + "=" + param[key] + "&");
        }
        return str;
    }


    /**
     * 获取url参数
     */
    export function getUrlParams(data:any):string {
        let str = parseParam(data);
        return str.substr(0, str.length-1);
    }


	//派发事件
	export function dispatchEvent(type:string, obj:Object = null, bubbles:boolean = false, cancelable:boolean = false):void
	{ 	
        // var event = GameObjectPool.getInstance().createObject(lcp.LEvent, type, obj, bubbles, cancelable)
        var event = new lcp.LEvent(type, obj, bubbles, cancelable)
		lcp.LListener.getInstance().dispatchEvent(event)
        // GameObjectPool.getInstance().destroyObject(event)
	}

	//监听事件
	export function addEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean=false,priority:number=0):void
	{ 
		lcp.LListener.getInstance().addEventListener(type,listener,thisObject,useCapture,priority);
	}

    //删除事件
    export function removeEventListener(type:string,listener:Function,thisObject:any,useCapture:boolean=false):void {
        lcp.LListener.getInstance().removeEventListener(type, listener, thisObject, useCapture);
    }

    //当前舞台
    export function curStage(): egret.Stage {
        return egret.MainContext.instance.stage;
    }



    export function SetXY(obj:any, x:number, y:number):void{
        if(obj == null) return;
        obj.x = x;
        obj.y = y;
    }

    export function CreateText(name:string, size:number = 30, textColor:number = 0xffffff, isBold:boolean = false, fontFamily:string = "Arial", textAlign:string = "left"):egret.TextField{
        let txt:egret.TextField = new egret.TextField();
        txt.text = name;
        txt.size = size;
        txt.textColor = textColor;
        txt.bold = isBold;
        txt.fontFamily = fontFamily;
        txt.textAlign = textAlign;

        return txt;
    }

    export function CreateShape(x,y,width,height):egret.Shape{
        let shape = new egret.Shape();
        shape.graphics.beginFill(0x000000, 1);
        shape.graphics.drawRect(x,y,width,height);
        shape.graphics.endFill();
        return shape;
    }

    /** create mc 
     * @param name clip name
     */
    export function CreateMovieClip(name:string):egret.MovieClip{
        let data = RES.getRes(name + "_json");
        let texture = RES.getRes(name + "_png");
        let mcData = new egret.MovieClipDataFactory(data, texture);
        let mc:egret.MovieClip;
        mc = new egret.MovieClip(mcData.generateMovieClipData(name));
        return mc;
    }

    /**
     * 创建文本
     * @param str   显示的内容
     * @param x,y   文本的位置
     * @param size  文本的大小(默认24)
     * @param color 文本的颜色(默认白色)
     */
    export function createText(str:string, x:number, y:number, size:number = 24, color:number = 0xFFFFFF):egret.TextField{
        let text  = new egret.TextField();
        text.text = str;
        text.x    = x;
        text.y    = y;
        text.size = size;
        text.textColor = color;
        return text;
    }
    /**
     * 创建位图
     * @param name  位图的ID
     */
     export function createBitmap(name:string):egret.Bitmap {
        let bitMap = new egret.Bitmap();
        let texture:egret.Texture = RES.getRes(name);
        bitMap.texture = texture;
        return bitMap;
    }

    //设置控件位置
    export function setControlPosition(control:any, x:number, y:number):void{
        control.x = x;
        control.y = y;
    }

    /**
     * 创建位图字体
     */
    export function createBitmapText(name:string, parent:any = null):egret.BitmapText {
        let bitmapText:egret.BitmapText = new egret.BitmapText();
        let font = RES.getRes(name);
        bitmapText.font = font;
        if (parent) parent.addChild(bitmapText);
        return bitmapText;
    }

    /**
     * 深复制对象方法
     */
    export function cloneObj(obj) {  
        var newObj = {};  
        if (obj instanceof Array) {  
            newObj = [];  
        }  
        for (var key in obj) {  
            var val = obj[key];    
            newObj[key] = typeof val === 'object' ? cloneObj(val): val;  
        }  
        return newObj;  
    }; 
}