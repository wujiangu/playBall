class RechargeUI extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/chongzhi.exml"
	}

	// 初始化面板
    public initPanel():void{

    }

    // 初始化面板数据
    public initData():void{
		this.m_labCount.text = GameConfig.candy.toString()
		this.m_labCount.x = 720 - this.m_labCount.width
		this.m_imgCandy.x = this.m_labCount.x - this.m_imgCandy.width - 10
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = false
		this.initData()
        this.show.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _onBtnReturn() {
        this.touchEnabled = false
		this.hide.play(0)
	}

    private _onShow() {
		this.touchChildren = true
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeRechargePanel)
	}

	private _onComplete() {
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
        this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
	}

    private m_btnReturn:eui.Button
    private m_imgCandy:eui.Image
    private m_labCount:eui.Label
	private m_imgMask:eui.Image

    private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}