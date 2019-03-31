class GameObjectPool {

    constructor() {
        // egret.Ticker.getInstance().register(this.onEnterFrame, this);
    }

    // private onEnterFrame(advancedTime:number):void {
    //     var list = this._list.concat();
    //     for (var i = 0 , length = list.length; i < length; i++) {
    //         var obj:GameObject = list[i];
    //         obj.onEnterFrame(advancedTime);
    //     }
    // }

    private _pool = {};

    private _list:Array<any> = [];
    public count:number = 0
    public balloon:number = 0

    public createObject(classFactory:any, name:string, ...args:any[]):any {
        var result;
        var key = name
        var arr = this._pool[key];
        if (arr != null && arr.length) {
            result = arr.shift();
        }
        else {
            let argsLen:number = args.length
            if (argsLen == 0){
                result = new classFactory()
            }
            else if (argsLen == 1){
                result = new classFactory(args[0])
            }
            else if (argsLen == 2){
                result = new classFactory(args[0], args[1])
            }
            else if (argsLen == 3){
                result = new classFactory(args[0], args[1], args[2])
            }
            else{
                result = new classFactory(args[0], args[1], args[2], args[3])
            }
            // console.log("创建：", key)
            
            result.key = key;
        }
        this._list.push(result);
        if (key == "Monster") {
            this.count++
        }

        if (key == "Balloon") {
            this.balloon++
        }
        return result;
    }

    public destroyObject(obj:any) {
        var key = obj.key;
        if (this._pool[key] == null) {
            this._pool[key] = [];
        }
        // console.log("回收：", key)
        if (key == "Monster") {
            this.count--
        }

        if (key == "Balloon") {
            this.balloon--
        }
        this._pool[key].push(obj);
        var index = this._list.indexOf(obj);
        if (index != -1) {
            this._list.splice(index, 1);
        }
    }

    private static instance:GameObjectPool;

    public static getInstance():GameObjectPool {
        if (GameObjectPool.instance == null) {
            GameObjectPool.instance = new GameObjectPool();
        }
        return GameObjectPool.instance;
    }
}