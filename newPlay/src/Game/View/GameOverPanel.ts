class GameOverPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameOverPanel.exml"
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
		this.m_labScore.text = PanelManager.m_gameScenePanel.Score.toString()
		this.m_labHistoryScore.text = GameConfig.maxScore.toString()
		Common.UpdateMaxScore(PanelManager.m_gameScenePanel.Score)
		this.Show.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.Hide.play(0)
    }

	private _OnBtnReturn() {
		Common.dispatchEvent(MainNotify.closeGameOverPanel)
	}

	private _OnBtnAgain() {
		this.m_isAgain = true
		this.Hide.play(0)
	}

	private _OnShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.gameScene().uiLayer.removeChild(this)
		if (this.m_isAgain) {
			GameManager.Instance.Start()
			PanelManager.m_gameScenePanel.Init()
		}else{
			GameManager.Instance.GameState = EGameState.Ready
			Common.dispatchEvent(MainNotify.closeGamePanel)
			Common.dispatchEvent(MainNotify.openGameStartPanel)
		}
	}

	private onComplete() {
		
		this._OnResize()

		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnReturn, this)
		this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAgain, this)
		this.Show.addEventListener('complete', this._OnShow, this)
		this.Hide.addEventListener('complete', this._OnHide, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_btnReturn:eui.Button
	private m_btnAgain:eui.Button
	private m_groupGameOver:eui.Group
	private m_isAgain:boolean

	/**本次得分 */
	private m_labScore:eui.Label
	/**历史最高分 */
	private m_labHistoryScore:eui.Label

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup
}