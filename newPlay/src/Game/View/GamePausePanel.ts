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

	private _OnBtnReturn() {
		this.m_state = EGamePauseState.Return
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
	}

	private _OnBtnAgain() {
		this.m_state = EGamePauseState.Again
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
	}

	private _OnBtnContinue() {
		this.m_state = EGamePauseState.Continue
		Common.dispatchEvent(MainNotify.closeGamePausePanel)
		// GameManager.Instance.Start()
	}

	private _OnShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.gameScene().uiLayer.removeChild(this)

		switch (this.m_state) {
			case EGamePauseState.Continue:
				GameManager.Instance.Start()
			break
			case EGamePauseState.Again:
				GameManager.Instance.Start()
				PanelManager.m_gameScenePanel.Init()
			break
			case EGamePauseState.Return:
				GameManager.Instance.GameState = EGameState.Ready
				Common.dispatchEvent(MainNotify.closeGamePanel)
				Common.dispatchEvent(MainNotify.openGameStartPanel)
			break
		}
	}

	private onComplete() {
		
		this._OnResize()

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this)
		this.m_btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnContinue, this)



		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnAgain)
		Common.addTouchBegin(this.m_btnContinue)
		this.show.addEventListener('complete', this._OnShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }
	private m_state:EGamePauseState

	private m_btnReturn:eui.Button
	private m_btnAgain:eui.Button
	private m_btnContinue:eui.Button

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}