class ChooseOperationPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/chooseOperationPanel.exml"
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
		this.m_isAgain = false		
		this.Show.play(0)		
		PanelManager.gameScenePanel.sceneData.addCandy = 0
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.Hide.play(0)
    }

	private _onBtnReturn() {
		this.touchChildren = false
		Common.dispatchEvent(MainNotify.closeChooseOperationPanel)		
	}

	private _onbtnContinue() {
		this.touchChildren = false
		this.m_isAgain = true
		this.Hide.play(0)
	}

	private _onShow() {
		this.touchChildren = true
	}

	private _onHide() {
		Common.gameScene().uiLayer.removeChild(this)
		if (this.m_isAgain) {
			if (GameManager.Instance.gameState == EGameState.EndLevel) {
				PanelManager.gameScenePanel.continueLevel()
			}else{
				PanelManager.gameScenePanel.init()
				GameManager.Instance.start()
			}
		}else{
			GameManager.Instance.gameState = EGameState.Ready
			Common.dispatchEvent(MainNotify.closeGamePanel)
			Common.dispatchEvent(MainNotify.openGameStartPanel)
		}
	}

	private onComplete() {
		this._onResize()
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnReturn, this)
		this.m_btnContinue.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onbtnContinue, this)
		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnContinue)
		
		this.Show.addEventListener('complete', this._onShow, this)
		this.Hide.addEventListener('complete', this._onHide, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

	private m_btnReturn:eui.Button
	private m_btnContinue:eui.Button
	private m_isAgain:boolean
	/**本次得分 */

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}