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
		if(GameConfig.isChapterPassShow){
			this._caiDaiGroup.visible = true
			this.caidai.play(0)
			GameConfig.isChapterPassShow = false
		}
		this._scoreEffect(0,PanelManager.gameScenePanel.sceneData.realScore,10);
		this._recordShowPos()
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

		if(GameConfig.isPlaySound)
		{
			if (GameManager.Instance.gameState == EGameState.EndLevel) {
				GameVoice.vectory.play(0, 1).volume = GameConfig.soundValue / 100
			}else{
				GameVoice.jiesuanSound.play(0, 1).volume = GameConfig.soundValue / 100
			}
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
		// PanelManager.gameScenePanel.updeLevelData(PanelManager.gameScenePanel._data.levelData.next, PanelManager.gameScenePanel._data.levelData.key)
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
				PanelManager.gameScenePanel.sceneData.continueCount += 1
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

	//数字累加效果
	private _scoreEffect(MinScoreNum:number,MaxScoreNum:number,speed:number)
	{
		let delta:number
		if(MaxScoreNum > 100){
			delta= Math.floor((MaxScoreNum - MinScoreNum) / (speed*10));
		}else{
			delta = 1;
			if(MaxScoreNum < 50) speed = 50;
		}		
		let result:number = 0;		        
		result = MinScoreNum; 
		let thisTemp = this;
		let thisTime;
		thisTime = setInterval(function () {
			if(result < MaxScoreNum){
				result += delta; 				
				thisTemp.m_labScore.text = result.toString();
			}	
			else{			 
			 clearInterval(Number(thisTime))
			 thisTemp.m_labScore.text = MaxScoreNum.toString(); 
		 	} 			
	　　},speed);		 
	}

	//奖励显示位置
	private _recordShowPos(){
		if(PanelManager.gameScenePanel.sceneData.addCandy > 0){//奖励至少有一个
			switch(PanelManager.gameScenePanel.sceneData.recordBabySource.length){
				case 0://一个奖励
					this.m_recoredBg.width = 200;
					this.firstRecordGroup.x = 232;
					this.thirdRecordGroup.visible = false;
				break;
				case 1://两个奖励
					this.m_recoredBg.width = 400;
					this.firstRecordGroup.x = 150;
					this.thirdRecordGroup.visible = true;
					this.m_thirdRecordIcon.source = PanelManager.gameScenePanel.sceneData.recordBabySource[0];					
				break;
				case 2://三个奖励

				break;
				default:
				break;
			}		
		}else{//没有奖励
			this.firstRecordGroup.visible = false;
			this.thirdRecordGroup.visible = false;			
			this.m_recoredBg.visible = false;
		}

		PanelManager.gameScenePanel.sceneData.recordBabySource.length = 0;//清空
	}


	private m_btnReturn:eui.Button
	private m_btnAgain:eui.Button
	private m_groupGameOver:eui.Group
	private m_isAgain:boolean
	private m_thirdrecordbg:eui.Image
	private m_thirdRecordIcon:eui.Image
	private firstRecordGroup:eui.Group
	private thirdRecordGroup:eui.Group
	private _caiDaiGroup:eui.Group
	private m_recoredBg:eui.Image

	/**本次得分 */
	private m_labScore:eui.BitmapLabel

	private m_labPingfen:eui.BitmapLabel
	private m_labLianji:eui.BitmapLabel
	private _labCandy:eui.Label

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup
	private caidai:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}