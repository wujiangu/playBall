class GameStartPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameStart.exml"
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_gameStartPanel
		this.touchChildren = true

		// this.m_imgCloth.y = Config.stageHeight - 1375

        Common.gameScene().uiLayer.addChild(this)

    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _OnHideCloth() {
		GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _OnStartGame() {
		this.touchChildren = false
		this._OnHideCloth()
		// egret.Tween.get(this.m_imgCloth).to({y:-this.m_imgCloth.height}, 1000, egret.Ease.backOut).call(this._OnHideCloth, this)
		// Common.dispatchEvent(MainNotify.closeBottomBtnPanel)
	}

	private _OnBtnSetting() {
		Common.dispatchEvent(MainNotify.openSettingPanel)
	}

	private _OnBtnRank() {
		Common.UpdateMaxScore(10)
	}

	private _OnBtnProc() {

	}

	private onComplete() {
		// this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this._OnResize()

		this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this)
		this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this)
		this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_imgBg:eui.Image
	// private m_imgCloth:eui.Image
	private m_btnSetting:eui.Button
	private m_btnGameStart:eui.Button
	private m_btnRank:eui.Button
	private m_btnProc:eui.Button
}