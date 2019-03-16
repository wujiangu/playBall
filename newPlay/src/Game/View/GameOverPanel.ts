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
		this.m_labScore.text = PanelManager.gameScenePanel.sceneData.realScore.toString()
		this.m_labLianji.text = "X" + GameConfig.curCombo.toString()
		let comboScore:string = "C"
		if (GameConfig.curCombo <= 3) comboScore = "C"
		else if (GameConfig.curCombo > 3 && GameConfig.curCombo <= 6) comboScore = "B"
		else if (GameConfig.curCombo > 6 && GameConfig.curCombo <= 10) comboScore = "A"
		else if (GameConfig.curCombo > 10 && GameConfig.curCombo <= 15) comboScore = "S"
		else comboScore = "S+"
		
		this.m_labPingfen.text = comboScore

		switch (GameConfig.gameMode) {
			case EBattleMode.Level:
				Common.updateMaxScore(PanelManager.gameScenePanel.sceneData.realScore)
			break
			case EBattleMode.Endless:
				
			break
			case EBattleMode.Timelimite:
			break
			default:
			break
		}
		this.Show.play(0)

		if (GameManager.Instance.gameState == EGameState.EndLevel) {
			GameVoice.vectory.play(0, 1).volume = GameConfig.soundValue / 100
		}else{
			GameVoice.jiesuanSound.play(0, 1).volume = GameConfig.soundValue / 100
		}

		this._labCandy.text = PanelManager.gameScenePanel.sceneData.addCandy.toString()
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
		Common.dispatchEvent(MainNotify.closeGameOverPanel)
		
	}

	private _onBtnAgain() {
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
		this.m_btnAgain.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAgain, this)
		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this.m_btnAgain)
		
		this.Show.addEventListener('complete', this._onShow, this)
		this.Hide.addEventListener('complete', this._onHide, this)
	}

    protected _onResize(event:egret.Event = null)
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
	private _labCandy:eui.Label

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}