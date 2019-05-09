class GameOverPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameOverPanel.exml"
	}

	// 初始化面板
    public initPanel():void{
        this._rewardGroups = new Array()
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
		this.m_labLianji.text = GameConfig.curCombo.toString()
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
		GameConfig.isShowEndlessModePanelNow = false;
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
		//有宠物或者是糖果
		Common.log(PanelManager.gameScenePanel.sceneData.addCandy, PanelManager.gameScenePanel.sceneData.recordBabySource.length)
		this.m_rewardGroup.removeChildren()
		this.m_recoredBg.visible = true;
		if(PanelManager.gameScenePanel.sceneData.addCandy != 0){
			let rewardIR = new RewardIR()
			rewardIR.init(1000, PanelManager.gameScenePanel.sceneData.addCandy)
			switch(PanelManager.gameScenePanel.sceneData.recordBabySource.length){
				case 0://一个奖励	
					this.m_recoredBg.width = 150;				
					rewardIR.x = 175
					rewardIR.y = 14										
				break;
				case 1://两个奖励
					this.m_recoredBg.width = 300;	
					rewardIR.x = 90
					rewardIR.y = 14
					let rewardIR11 = new RewardIR()
					rewardIR11.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1)
					rewardIR11.x = 260
					rewardIR11.y = 14
					this.m_rewardGroup.addChild(rewardIR11)
					this._rewardGroups.push(rewardIR11)				
				break;
				case 2://三个奖励
					this.m_recoredBg.width = 450;	
					rewardIR.x = 50
					rewardIR.y = 14
					let rewardIR21 = new RewardIR()
					rewardIR21.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1)
					rewardIR21.x = 175
					rewardIR21.y = 14
					this.m_rewardGroup.addChild(rewardIR21)
					this._rewardGroups.push(rewardIR21)
					let rewardIR22 = new RewardIR()
					rewardIR22.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1)
					rewardIR22.x = 300
					rewardIR22.y = 14
					this.m_rewardGroup.addChild(rewardIR22)
					this._rewardGroups.push(rewardIR22)
				break;
				default:
				break;
			}
			this.m_rewardGroup.addChild(rewardIR)
			this._rewardGroups.push(rewardIR)						
		}else{//没有糖果的情况下
			if(PanelManager.gameScenePanel.sceneData.recordBabySource.length != 0){			
				switch(PanelManager.gameScenePanel.sceneData.recordBabySource.length){
					case 1://一个奖励
						this.m_recoredBg.width = 150;	
						let rewardIR1 = new RewardIR()
						rewardIR1.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1)
						rewardIR1.x = 175
						rewardIR1.y = 14
						this.m_rewardGroup.addChild(rewardIR1)
						this._rewardGroups.push(rewardIR1)		
					break;
					case 2://两个奖励
						this.m_recoredBg.width = 300;	
						let rewardIR21 = new RewardIR()
						rewardIR21.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1)
						rewardIR21.x = 90
						rewardIR21.y = 14
						this.m_rewardGroup.addChild(rewardIR21)
						this._rewardGroups.push(rewardIR21)
						let rewardIR22 = new RewardIR()
						rewardIR22.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1)
						rewardIR22.x = 260
						rewardIR22.y = 14
						this.m_rewardGroup.addChild(rewardIR22)
						this._rewardGroups.push(rewardIR22)
					break;
					case 3://三个奖励
						this.m_recoredBg.width = 450;	
						let rewardIR31 = new RewardIR()
						rewardIR31.init(PanelManager.gameScenePanel.sceneData.recordBabySource[0], 1)
						rewardIR31.x = 50
						rewardIR31.y = 14
						this.m_rewardGroup.addChild(rewardIR31)
						this._rewardGroups.push(rewardIR31)
						let rewardIR32 = new RewardIR()
						rewardIR32.init(PanelManager.gameScenePanel.sceneData.recordBabySource[1], 1)
						rewardIR32.x = 175
						rewardIR32.y = 14
						this.m_rewardGroup.addChild(rewardIR32)
						this._rewardGroups.push(rewardIR32)
						let rewardIR33 = new RewardIR()
						rewardIR33.init(PanelManager.gameScenePanel.sceneData.recordBabySource[2], 1)
						rewardIR33.x = 300
						rewardIR33.y = 14
						this.m_rewardGroup.addChild(rewardIR33)
						this._rewardGroups.push(rewardIR33)
					break;
					default:
					break;
				}				
			}
		}
		if(PanelManager.gameScenePanel.sceneData.recordBabySource.length == 0 && PanelManager.gameScenePanel.sceneData.addCandy == 0){
			this.m_recoredBg.visible = false;
		}
		PanelManager.gameScenePanel.sceneData.addCandy = 0
		PanelManager.gameScenePanel.sceneData.recordBabySource.length = 0
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
	private m_rewardGroup:eui.Group
	private _rewardGroups:Array<RewardIR>

	/**本次得分 */
	private m_labScore:eui.BitmapLabel

	private m_labPingfen:eui.BitmapLabel
	private m_labLianji:eui.BitmapLabel

	private Show:egret.tween.TweenGroup
	private Hide:egret.tween.TweenGroup
	private caidai:egret.tween.TweenGroup

	private channel:egret.SoundChannel
}

class RewardIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/rewardIR.exml"
	}

	public index:number
	public data:any

	//初始化奖项
	public init(rewardType:number, rewardNum:number) {
		if(rewardType == 1000){//糖果
			this.m_rewardIcon.source = "icon4_png";
			this._lblRewardName.text = "Candy";
		}else{
			if(rewardType > 0){
				let data = GameConfig.actorTable[rewardType] 
				this.m_rewardIcon.source = data.recordIcon;
				this._lblRewardName.text = "Monster";
			}
		}
		this._lblRewardNum.text = rewardNum.toString();
	}

	private _onComplete() {

	}

	private m_rewardBg:eui.Image //奖励背景
	private m_rewardIcon:eui.Image //奖励图标
	private _lblRewardNum:eui.Label //奖励数量
	private _lblRewardName:eui.Label //奖励名字
}