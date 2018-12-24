var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * http请求
 */
var HttpRequest = (function () {
    function HttpRequest() {
        /**
         * 通信的url
         */
        this.urls = {};
        this._reqQueue = new Array();
    }
    HttpRequest.getInstance = function () {
        if (!this._instance) {
            this._instance = new HttpRequest();
        }
        return this._instance;
    };
    /**
     * 加入到请求队列
     */
    HttpRequest.prototype.addQueue = function (req) {
        this._reqQueue.push(req);
    };
    /**
     * 发送http请求
     * @param method: 网络请求方法 ("GET":GET方式, "POST":POST方式)
     * @param key: 具体的请求
     * @param params: 请求参数
     * @param func: 请求成功或失败的回调
     * @param funcObj: 回调函数的所属对象
     */
    HttpRequest.prototype.send = function (method, key, params, isJSON, func, funcObj) {
        if (isJSON === void 0) { isJSON = true; }
        if (func === void 0) { func = null; }
        if (funcObj === void 0) { funcObj = null; }
        // let data = Common.getUrlParams(params);
        // egret.log("参数------->"+key, params);
        // Common.log("ip: ", Config.ip)
        var http = GameObjectPool.getInstance().createObject(Http, "Http");
        http.func = func;
        http.funcObj = funcObj;
        http.open(this.urls[key], method, isJSON);
        var sendData = JSON.stringify(params);
        // Config.sdwIp = ""
        if (!isJSON) {
            sendData = Common.getUrlParams(params);
        }
        http.send(sendData);
    };
    return HttpRequest;
}());
__reflect(HttpRequest.prototype, "HttpRequest");
// class Http {
//     public constructor(){
//         this.httpRequest = new XMLHttpRequest();
//         this.httpRequest.responseType = "text";
//         this.httpRequest.addEventListener("readystatechange", this.callBack.bind(this));
//         // this.httpRequest.onreadystatechange = this.callBack
//     }
//     public send(params:any = null):void {
//         // this.dataProcess(params);
//         this.sendData = params
//         this.httpRequest.send(params)
//     }
//     /**
//      * 打开一个http请求
//      * @param url url路径
//      * @param token 用于服务端验证的token值
//      * @param method 请求方法(POST, GET, DELETE)
//      */
//     public open(url:string, method:string, isJSON:boolean = true, token:string = null):void {
//         this.httpRequest.open(method, url);
//         //设置token的值
//         if (token){
//             // egret.log("添加token请求tou", token, typeof(token));
//             this.httpRequest.setRequestHeader("Authentication-token", token);   
//         }
//         //设置响应头 
//         if (isJSON) {
//             this.httpRequest.setRequestHeader("Content-Type", "application/json")
//         }else{
//             this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded")
//         }
//     }
//     //网络回调
//     private callBack():void {
//         // let test:string = this.httpRequest.readyState.toString() + " " + this.httpRequest.status.toString()
//         // PanelManager.startPanel.SetTest(test)
//         console.log("callBack", this.httpRequest.readyState)
//         if (this.httpRequest.readyState == 4 && this.httpRequest.status == 200) {
//             this.onPostComplete();
//         }
//         else if (this.httpRequest.readyState == 1) {
//             this.httpRequest.send(this.sendData)
//         }
//     }
//     //请求加载完成
//     private onPostComplete():void {
//         let request = this.httpRequest.responseText
//         GameObjectPool.getInstance().destroyObject(this)
//         let data = JSON.parse(request)
//         console.log("onPostComplete", data)
//         if (data.status_code == 0) {
//             if (this.func && this.funcObj) this.func.call(this.funcObj, data.data);
//         }else{
//         }
//     }
//     //请求失败
//     private onPostIOError():void {
//         Common.log("get Error");
//         this.func.call(this.funcObj);
//         GameObjectPool.getInstance().destroyObject(this);
//     }
//     //请求进度(可通过event.bytesLoaded和event.bytesTotal统计进度信息)
//     private onPostProgress(event:egret.ProgressEvent):void {
//         Common.log("get progress : " + Math.floor(100*event.bytesLoaded/event.bytesTotal) + "%");
//     }
//     //关闭http请求
//     private onPostClose():void {
//         GameObjectPool.getInstance().destroyObject(this);
//     }
//     /**回调函数 */
//     public func:Function;
//     public funcObj:any;
//     /**http请求 */
//     private httpRequest:XMLHttpRequest;
//     private sendData:any
// }
var Http = (function () {
    function Http() {
        this.httpRequest = new egret.HttpRequest();
        this.httpRequest.responseType = egret.HttpResponseType.TEXT;
        this.httpRequest.addEventListener(egret.Event.COMPLETE, this.onPostComplete, this);
        this.httpRequest.addEventListener(egret.IOErrorEvent.IO_ERROR, this.onPostIOError, this);
        this.httpRequest.addEventListener(egret.ProgressEvent.PROGRESS, this.onPostProgress, this);
    }
    Http.prototype.send = function (params) {
        // Common.log("发送的参数===>", params);
        if (params === void 0) { params = null; }
        this.httpRequest.send(params);
    };
    /**
     * 打开一个http请求
     * @param url url路径
     * @param token 用于服务端验证的token值
     * @param method 请求方法(POST, GET, DELETE)
     */
    Http.prototype.open = function (url, method, isJSON, token) {
        if (isJSON === void 0) { isJSON = true; }
        if (token === void 0) { token = null; }
        this.httpRequest.open(url, method);
        // this.httpRequest.setRequestHeader("Access-Control-Allow-Origin", "*")
        //设置token的值
        if (token) {
            // egret.log("添加token请求tou", token, typeof(token));
            this.httpRequest.setRequestHeader("Authentication-token", token);
        }
        //设置响应头 
        if (isJSON) {
            this.httpRequest.setRequestHeader("Content-Type", "application/json");
        }
        else {
            this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        }
    };
    //请求加载完成
    Http.prototype.onPostComplete = function (event) {
        var request = this.httpRequest.response;
        GameObjectPool.getInstance().destroyObject(this);
        var data = JSON.parse(request);
        Common.log("onPostComplete", data);
        // switch (data.status_code) {
        //     case EErrorCode.SUCCESS:
        //         if (this.func && this.funcObj) this.func.call(this.funcObj, data.data)
        //     break
        //     case EErrorCode.USER_EXIST_NOT_REGISTER_AGAIN:
        //         PanelManager.startPanel.SetErrorCode("用户已存在！")
        //     break
        //     case EErrorCode.USER_NOT_EXIST:
        //         Common.log("用户不已存在！")
        //         PanelManager.startPanel.SetErrorCode("用户不已存在！")
        //         // this.onPostClose()
        //         PanelManager.startPanel.Register()
        //     break
        //     case EErrorCode.PASSWORD_ERROR:
        //         PanelManager.startPanel.SetErrorCode("用户名或密码错误！")
        //     break
        //     default:
        //     break
        // }
    };
    //请求失败
    Http.prototype.onPostIOError = function (event) {
        console.log("get Error", event);
        // this.func.call(this.funcObj);
        // GameObjectPool.getInstance().destroyObject(this);
    };
    //请求进度(可通过event.bytesLoaded和event.bytesTotal统计进度信息)
    Http.prototype.onPostProgress = function (event) {
        console.log("get progress : " + Math.floor(100 * event.bytesLoaded / event.bytesTotal) + "%");
    };
    //关闭http请求
    Http.prototype.onPostClose = function () {
        // this.httpRequest.
        // GameObjectPool.getInstance().destroyObject(this);
    };
    return Http;
}());
__reflect(Http.prototype, "Http");
