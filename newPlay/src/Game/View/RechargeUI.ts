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

    private _OnShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeRechargePanel)
	}

	private _onComplete() {
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
        this.show.addEventListener('complete', this._OnShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
	}

    private m_btnReturn:eui.Button
    private m_imgCandy:eui.Image
    private m_labCount:eui.Label

    private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}