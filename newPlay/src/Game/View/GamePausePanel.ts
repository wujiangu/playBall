class GamePausePanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/quitPanel.exml"
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
		this.show.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.hide.play(0)
    }

	private _onBtnReturn() {
		this._state = EGamePauseState.Return
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
	}

	private _onBtnAgain() {
		this._state = EGamePauseState.Again
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
	}

	private _onBtnContinue() {
		this._state = EGamePauseState.Continue
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
		// GameManager.Instance.Start()
	}

	private _onShow() {
		this.touchChildren = true
	}

	private _onHide() {
		Common.gameScene().uiLayer.removeChild(this)

		switch (this._state) {
			case EGamePauseState.Continue:
				GameManager.Instance.start()
			break
			case EGamePauseState.Again:
				GameManager.Instance.start()
				PanelManager.gameScenePanel.init()
			break
			case EGamePauseState.Return:
				GameManager.Instance.gameState = EGameState.Ready
				Common.dispatchEvent(MainNotify.closeGamePanel)
				Common.dispatchEvent(MainNotify.openGameStartPanel)
			break
		}
	}

	private onComplete() {
		
		this._onResize()

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
		this.m_btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnContinue, this)



		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnContinue)
		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }
	private _state:EGamePauseState

	private m_btnReturn:eui.Button
	private m_btnContinue:eui.Button

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}