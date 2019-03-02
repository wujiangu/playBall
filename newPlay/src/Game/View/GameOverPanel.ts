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
		this.m_labLianji.text = "X" + GameConfig.curCombo.toString()

		let comboScore:string = "C"

		if (GameConfig.curCombo <= 3) comboScore = "C"
		else if (GameConfig.curCombo > 3 && GameConfig.curCombo <= 6) comboScore = "B"
		else if (GameConfig.curCombo > 6 && GameConfig.curCombo <= 10) comboScore = "A"
		else if (GameConfig.curCombo > 10 && GameConfig.curCombo <= 15) comboScore = "S"
		else comboScore = "S+"
		
		this.m_labPingfen.text = comboScore
		Common.UpdateMaxScore(PanelManager.m_gameScenePanel.Score)
		this.Show.play(0)
		GameVoice.jiesuanSound.play(0, 1).volume = GameConfig.soundValue / 100
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.Hide.play(0)
    }

	public set Channel(value) {
		this.channel = value 
	}

	public get Channel() {
		return this.channel
	}

	public set IsClose(value) {
		this.m_isClose = value
	}

	public get IsClose() {
		return this.m_isClose
	}

	private _OnBtnReturn() {
		this.touchChildren = false
		Common.dispatchEvent(MainNotify.closeGameOverPanel)
		
	}

	private _OnBtnAgain() {
		this.touchChildren = false
		this.m_isAgain = true
		this.Hide.play(0)
	}

	private _OnShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.gameScene().uiLayer.removeChild(this)
		if (this.m_isAgain) {
			if (GameManager.Instance.GameState == EGameState.EndLevel) {
				PanelManager.m_gameScenePanel.ContinueLevel()
			}else{
				PanelManager.m_gameScenePanel.Init()
				GameManager.Instance.Start()
			}
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
		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnAgain)
		
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
	private m_labScore:eui.BitmapLabel

	private m_labPingfen:eui.BitmapLabel
	private m_labLianji:eui.BitmapLabel

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup

	private channel:egret.SoundChannel

	private m_isClose:boolean
}