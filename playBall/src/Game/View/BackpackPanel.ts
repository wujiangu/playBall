class BackpackPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/backpackPanel.exml"
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

	private _OnBtnReturn() {
		Common.dispatchEvent(MainNotify.closeBackpackPanel)
		Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _OnBtnUse() {

	}

	private _OnBtnLeft() {

	}

	private _OnBtnRight() {

	}

	private onComplete() {
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnUse.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnUse, this)
		this.m_btnLeft.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLeft, this)
		this.m_btnRight.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRight, this)

		this._OnResize()
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_btnReturn:eui.Button
	private m_btnRight:eui.Button
	private m_btnLeft:eui.Button
	private m_btnUse:eui.Button

	private m_labItemName:eui.Label
	private m_labItemDesc:eui.Label

	private m_itemCenter:eui.Image
	private m_itemLeft:eui.Image
	private m_itemRight:eui.Image
}