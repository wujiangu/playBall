var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameObjectPool = (function () {
    function GameObjectPool() {
        // private onEnterFrame(advancedTime:number):void {
        //     var list = this._list.concat();
        //     for (var i = 0 , length = list.length; i < length; i++) {
        //         var obj:GameObject = list[i];
        //         obj.onEnterFrame(advancedTime);
        //     }
        // }
        this._pool = {};
        this._list = [];
        // egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }
    GameObjectPool.prototype.createObject = function (classFactory, name) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var result;
        var key = name;
        var arr = this._pool[key];
        if (arr != null && arr.length) {
            result = arr.shift();
        }
        else {
            var argsLen = args.length;
            if (argsLen == 0) {
                result = new classFactory();
            }
            else if (argsLen == 1) {
                result = new classFactory(args[0]);
            }
            else if (argsLen == 2) {
                result = new classFactory(args[0], args[1]);
            }
            else if (argsLen == 3) {
                result = new classFactory(args[0], args[1], args[2]);
            }
            else {
                result = new classFactory(args[0], args[1], args[2], args[3]);
            }
            // console.log("创建：", key)
            result.key = key;
        }
        this._list.push(result);
        return result;
    };
    GameObjectPool.prototype.destroyObject = function (obj) {
        var key = obj.key;
        if (this._pool[key] == null) {
            this._pool[key] = [];
        }
        // console.log("回收：", key)
        this._pool[key].push(obj);
        var index = this._list.indexOf(obj);
        if (index != -1) {
            this._list.splice(index, 1);
        }
    };
    GameObjectPool.getInstance = function () {
        if (GameObjectPool.instance == null) {
            GameObjectPool.instance = new GameObjectPool();
        }
        return GameObjectPool.instance;
    };
    return GameObjectPool;
}());
__reflect(GameObjectPool.prototype, "GameObjectPool");
