  /**
    * 面板基类 
    * 面板的基本属性和方法
    */
class BasePanel extends eui.Component{

    public assets:egret.SpriteSheet;
    public w:number = 0;
    public h:number = 0;

    // 构造函数
    public constructor(){
        super();
        this.w = Config.stageWidth
        this.h = Config.stageHeight
        this.initPanel();
        // 当舞台尺寸发送变化
		this.addEventListener(egret.Event.RESIZE, this._OnResize, this)
    }

    // 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
        
    }

    // 退出面板
    public onExit():void{
        
    }

    protected _OnResize(event:egret.Event = null)
    {
        if (Config.stageHeight / Config.stageWidth < 1366 / 750) {
            Common.log("比率小")
        }
    }

}

