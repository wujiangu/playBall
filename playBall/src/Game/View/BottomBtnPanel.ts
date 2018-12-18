class BottomBtnPanel extends BasePanel{
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/bottomBtn.exml"
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
        Common.gameScene().mainUILayer.addChild(this)
		this._ShowBtn()
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this._HideBtn()
    }

	private _OnBtnItem(){
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openBackpackPanel)
		// TipsManager.Show(GameTips.test)
	}

	private _OnBtnAchieve() {
		
	}

	private _OnBtnRank() {
		
	}

	private onComplete() {
		this.m_btnItem.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnItem, this)
		this.m_btnAchieve.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAchieve, this)
		this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this)

		this._OnResize()
	}

	private _OnShowBtn() {

	}

	private _ShowBtn() {
		this.alpha = 0
		this.y = Config.stageHeight
		egret.Tween.get(this).to({ alpha: 1.0, y:Config.stageHeight - this.height}, 500, egret.Ease.backIn).call(this._OnShowBtn, this)
	}

	private _OnHideBtn() {
		Common.gameScene().mainUILayer.removeChild(this)
	}

	private _HideBtn() {
		egret.Tween.get(this).to({ alpha: 0, y:Config.stageHeight}, 500, egret.Ease.backOut).call(this._OnHideBtn, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }


	private m_groupBtn:eui.Group
	private m_btnItem:eui.Button
	private m_btnAchieve:eui.Button
	private m_btnRank:eui.Button
}