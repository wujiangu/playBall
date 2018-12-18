class GameScenePanel extends BasePanel {
	public constructor() {
		super()
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = true
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private onComplete() {
		
		this._OnResize()
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_btnPause:eui.Button
	private m_imgScene:eui.Image
	private m_labScore:eui.Label

	private m_groupScore:eui.Group
	private m_groupBottom:eui.Group
}