class GameSelectLevel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/guankajiemian.exml"
	}

	// 初始化面板
    public initPanel():void{

    }

    // 初始化面板数据
    public initData():void{
		this.groupTip.visible = false
		this._curChapterIndex = GameConfig.curChpter % 1000
		this._curSelectChapter = GameConfig.curChpter
		this._ChangeChapter()		
		
		this._updateChapterInfo()
		if (this._curSelectChapter == GameConfig.curChpter && GameConfig.isOpenNewChapter == true) {
			this.m_imgIcon.visible = false
			let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
			this.m_imgChapter.source = chapterData.unlockIcon
			this.m_imgIcon.source = "guankajiemian13_png"
		}

		this.m_imgEndlessBg.source = "guankajiemian12_png"
		this.m_imgEndlessIcon.source = "guankajiemian15_png"
		if (GameConfig.curChpter <= 1001) {
			this.m_imgEndlessBg.source = "guankajiemian16_png"
			this.m_imgEndlessIcon.source = "guankajiemian14_png"
		}
    }

    // 进入面板
    public onEnter():void{
		Common.getChapterScore()
        Common.getChapterCombo()
		Common.getIsChapterPass()
		
		this.touchChildren = false
		this.initData()
		this.show.play(0)
        Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		Common.gameScene().uiLayer.removeChild(this)
    }

	public get selectChater() {
		return this._curSelectChapter
	}

	private _onShow() {
		if (GameConfig.isOpenNewChapter) {
			this.m_groupLock.visible = true
			this.suo.play(0)
		}else{
			this.touchChildren = true
		}
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeGameSelectLevel)
		if (this._status == 1) {
			// Common.dispatchEvent(MainNotify.closeGameStartPanel)
			if (PanelManager.gameScenePanel != null) {
				PanelManager.gameScenePanel.sceneData.continueCount = 0
				PanelManager.gameScenePanel.sceneData.isScoreRewardGet = false
				PanelManager.gameScenePanel.sceneData.isComboRewardGet = false
			}
			Common.dispatchEvent(MainNotify.openGamePanel)
		}else{
			Common.dispatchEvent(MainNotify.openGameStartPanel)
		}
	}

	private _OnLock() {
		this.touchChildren = true
		this.m_imgIcon.visible = true
		let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
		this.m_imgChapter.source = chapterData.icon
		// if(chapterData.candy == 0){//不需要购买，但是未解锁，需要提示通关上一章
		// 	TipsManager.show("通关上一章!")
		// }
		// else if(chapterData.candy > 0)
		// {
		// 	//判断自己的糖果是否足够
		// 	if(GameConfig.candy >= chapterData.candy)
		// 	{
		// 		Common.dispatchEvent(MainNotify.openBuyConfirmPanel)								
		// 	}
		// 	else
		// 	{
		// 		TipsManager.show(`Insufficient candy!`);
		// 	}
		// }
	}

	private _onMaskClick() {
		this.touchChildren = false
		this.hide.play(0)
		this._status = 0
	}

	private _onChapterBegin() {
		this.m_imgChapter.alpha = 0.8
	}

	private _onChapterEnd() {
		this.m_imgChapter.alpha = 1
	}
	private _onChapterClick() {
		if (!this._isLock()) {
			this._beforeEnterBattle()
			GameConfig.gameMode = EBattleMode.Level
		}
	}

	private _onEndlessBegin() {
		this.m_imgEndlessBg.alpha = 0.8
	}

	private _onEndlessEnd() {
		this.m_imgEndlessBg.alpha = 1
	}

	private _onEndlessClick() {
		if (GameConfig.curChpter > 1001) {
			this._beforeEnterBattle()
			GameConfig.gameMode = EBattleMode.Endless
		}
		else{//未解锁提示
			TipsManager.show(`Chapter 1 Unlocking Endless Mode of 
			Customs Clearance!`)
		}
	}

	//进入之前的准备
	private _beforeEnterBattle() {
		this.touchChildren = false
		this.hide.play(0)
		this._status = 1
		if(GameConfig.isPlaySound)
		{
			GameVoice.beginBGMChannel.stop()
			let voice = GameVoice.vectory.play(0,1)
			voice.volume = GameConfig.soundValue / 100
		}		
	}

	private _isLock() {
		if (this._curSelectChapter > GameConfig.curChpter) {
			return true
		}
		return false
	}

	private _updateChapterInfo() {
		let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
		this.m_imgIcon.visible = true
		this.m_groupLock.visible = false
		this.m_imgChapter.source = chapterData.icon
		this.m_labChapter.text = this._curChapterIndex.toString()
		if (this._curSelectChapter == GameConfig.curChpter && GameConfig.curLevel > 0) {
			let levelData = GameConfig.levelTable[GameConfig.curLevel.toString()]
			this.m_labChapter.text = this._curChapterIndex.toString() + "-" + levelData.level.toString()
		}
		this.m_imgIcon.source = "guankajiemian13_png"
		if (this._isLock()) {
			this.m_imgChapter.source = chapterData.unlockIcon
			this.m_imgIcon.source = "guankajiemian14_png"
		}	
	}

	private _onNextClick() {
		if (this._curChapterIndex < 18) {
			this._curSelectChapter++
			this._curChapterIndex++
			this._updateChapterInfo()
			this._ChangeChapter()
		} 
	}

	private _onLastClick() {
		if (this._curChapterIndex > 1) {
			this._curChapterIndex--
			this._curSelectChapter--
			this._updateChapterInfo()
			this._ChangeChapter()
		}
	}

	private _onRecordIconBg0Begin()
	{		
		this._showTip(this._recordTipMessages[0]);
	}
	private _onRecordIconBg0End()
	{
		this.groupTip.visible = false
	}
	private _onRecordIconBg0Click()
	{
		//显示对应提示
		this._onRecordIconBg0Begin()
		this.timeNum.start();
	}

	private _onRecordIconBg1Begin()
	{
		this._showTip(this._recordTipMessages[1]);
	}

	private _onRecordIconBg1End()
	{
		this.groupTip.visible = false
	}

	private _onRecordIconBg1Click()
	{
		//显示对应提示
		this._onRecordIconBg1Begin()
		this.timeNum.start();
	}

	//切换章节界面奖励显示状态
	private _ChangeChapter()
	{
		this._recordTipMessages.length = 0
		let chapterData = GameConfig.chapterTable[this._curSelectChapter.toString()]
		for(let i = 0; i < chapterData.reward.length; i++){
			let levelData = GameConfig.levelRewardTable[chapterData.reward[i]]
			if(levelData.condition != 4 || levelData.condition != 5){
				if(levelData.reward == 1000){//糖果
					let recordNameStr:string
					if(GameConfig.isGetChapterRecord[chapterData.id][i] == 1){//获取
						if(levelData.value >= 200){//糖果数量大于200显示糖果盒子
						recordNameStr = "icon5greyState_png"
						}else{
							if(levelData.value > 0)  recordNameStr = "icon4greyState_png"
						}
					}
					if(GameConfig.isGetChapterRecord[chapterData.id][i] == 0){//未获取
						if(levelData.value >= 200){//糖果数量大于200显示糖果盒子
							recordNameStr = "icon5_png"
						}else{
							if(levelData.value > 0)  recordNameStr = "icon4_png"
						}
					}
					let tipmessageStr:string
					switch (levelData.condition) {
						case ELevelRewardCondition.Finish:
							tipmessageStr = "Get "+ levelData.value +` candies through
			chapters.`;
						break
						case ELevelRewardCondition.EnoughScore:
							tipmessageStr = "Getting "+levelData.value+` candy requires
			a score of `+ levelData.count +".";
						break
						case ELevelRewardCondition.EnoughCombo:
							tipmessageStr = "Getting "+levelData.value+` candy requires
			a combo of `+ levelData.count +".";
						break
						case ELevelRewardCondition.OnesFinish:

						break
						case ELevelRewardCondition.RepeatFinish:

						break
					}
					if(i == 0){					
						this.m_recordIcon0.source = recordNameStr;
						this._recordTipMessages[0] = tipmessageStr
					}else if(i == 1){
						this.m_recordIcon1.source = recordNameStr;
						this._recordTipMessages[1] = tipmessageStr
					}
				}else {//宠物
					if(levelData.reward > 0 ){
						let data = GameConfig.actorTable[levelData.reward]
						let recordNameStr:string
						if(GameConfig.isGetChapterRecord[chapterData.id][i] == 1){//获取
							recordNameStr = data.getRecordIcon;
						}
						if(GameConfig.isGetChapterRecord[chapterData.id][i] == 0){//未获取
							recordNameStr = data.recordIcon;
						}
						if(i == 0){
							this.m_recordIcon0.source = recordNameStr;
							this._recordTipMessages[0] = data.unlockDesc;
						}else{
							if(i == 1){
								this.m_recordIcon1.source = recordNameStr;
								this._recordTipMessages[1] = data.unlockDesc;
							}							
						}						
					}					
				}
			}			
		}
		this._lblhighestscore.text = <string>GameConfig.chapterMaxScore[(this._curChapterIndex + 1000)]
		this._lblbomba.text = <string>GameConfig.chapterMaxCombo[(this._curChapterIndex + 1000)]
	}

	private _showTip(message:string)
	{
		this._lblBabyDescribe.text = message;
		this.groupTip.visible = true
	}
	private _hideTip()
	{
		if(this.groupTip.visible)
		{
			this.groupTip.visible = false
			this.timeNum.stop();
		}		
	}

	private _onComplete() {
		// this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this)
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this)		
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onChapterBegin, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_END, this._onChapterEnd, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onChapterEnd, this)
		this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onChapterClick, this)

		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onEndlessBegin, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_END, this._onEndlessEnd, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onEndlessEnd, this)
		this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onEndlessClick, this)

		this.m_btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onNextClick, this)
		this.m_btnLast.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onLastClick, this)

		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg0Begin, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg0End, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg0End, this)
		this.m_btnRecordIconBg0.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg0Click, this)
		this.timeNum = new egret.Timer(100,1);
		this.timeNum.addEventListener(egret.TimerEvent.TIMER, this._hideTip, this);

		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onRecordIconBg1Begin, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_END, this._onRecordIconBg1End, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onRecordIconBg1End, this)
		this.m_btnRecordIconBg1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onRecordIconBg1Click, this)

		Common.addTouchBegin(this.m_btnNext)
		Common.addTouchBegin(this.m_btnLast)

		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
		this.suo.addEventListener('complete', this._OnLock, this)
	}

	private m_imgMask:eui.Image
	private m_btnReturn:eui.Image
	private m_imgChapter:eui.Image
	private m_imgIcon:eui.Image
	private m_imgEndlessBg:eui.Image
	private m_imgEndlessIcon:eui.Image
	private m_recordIcon0:eui.Image //章节第一个奖励
	private m_recordIcon1:eui.Image	//章节第二个奖励

	private m_labChapter:eui.Label
	private _lblhighestscore:eui.Label
	private _lblbomba:eui.Label

	private m_btnNext:eui.Button
	private m_btnLast:eui.Button
	private m_btnRecordIconBg0:eui.Image
	private m_btnRecordIconBg1:eui.Image
	private _lblBabyDescribe:eui.Label

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
	private suo:egret.tween.TweenGroup
	private m_groupLock:eui.Group
	private groupTip:eui.Group

	private _status:number
	private _curChapterIndex:number
	private _curSelectChapter:number
	private timeNum:egret.Timer

	private _recordTipMessages:Array<string> = new Array()
	// private _srollView:ScrollView
}