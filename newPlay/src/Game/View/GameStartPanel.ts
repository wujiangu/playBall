class GameStartPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameStart.exml"
	}

	// 初始化面板
    public initPanel():void{
		this.m_isInit = false
    }

    // 初始化面板数据
    public initData():void{
		this._actorArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action)
		if (this._actorArmature == null) {
			this._actorArmature = new DragonBonesArmature(armatureDisplay)
		}
		this._actorArmature.ArmatureDisplay = armatureDisplay
		this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"])
		this._actorArmatureContainer.play("idle")

		this.m_labCandy.text = GameConfig.candy.toString()

		let curChapterIndex = GameConfig.curChpter % 1000
		this.m_labEvent.text = GameConfig.maxScore.toString()
		this.m_labGrade.text = curChapterIndex.toString()


		this.m_btnAddCandy.x = 100 + this.m_labCandy.width
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = false
		let chapterData = GameConfig.chapterTable[GameConfig.curChpter.toString()]
		if (GameConfig.curBattleChapter > 0) {
			chapterData = GameConfig.chapterTable[GameConfig.curBattleChapter.toString()]
		}
		GameManager.Instance.updateSceneBg(chapterData.bg, chapterData.water)
		GameManager.Instance.updateSceneCloud(chapterData.cloud1, chapterData.cloud2)
		GameManager.Instance.updateSceneSun(chapterData.sun)
		this.show.play(0)
		this.initData()
		this._onDialog()

		if(GameConfig.isPlaySound)
		{
			if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.stop()
			GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0)
		}		
        Common.gameScene().uiLayer.addChild(this)

    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		this.groupDialog.visible = false
		// if (this._sceneType == 1) GameVoice.beginBGMChannel.stop()
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _onHideCloth() {
		// GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _onStartGame() {
		this.touchChildren = false
		this._sceneType = 1
		this.m_maskRect.visible = false
		this.hide.play(0)
		//Common.dispatchEvent(MainNotify.openGameSelectLevel)
	}

	//声音
	private _onBtnSound() {
		// Common.dispatchEvent(MainNotify.openSettingPanel);
		if(GameConfig.soundValue == 100 && GameConfig.bgmValue == 100)
		{
			//关闭声音
			GameConfig.isPlaySound = false;
			GameConfig.soundValue = 0
			GameConfig.bgmValue = 0
			GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100
			//切换按钮图片
			this._btnSound.source = "btnSound1_png";
		}
		else
		{
			//关闭声音
			GameConfig.isPlaySound = true;
			GameConfig.soundValue = 100
			GameConfig.bgmValue = 100
			GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100
			//切换按钮图片
			this._btnSound.source = "btnSound0_png";
		}
	}

	private _onBtnAddCandy() {
		Common.dispatchEvent(MainNotify.openRechargePanel)
	}

	private _onBtnAd() {
		// Common.dispatchEvent(MainNotify.openSignPanel)
	}

	private _onActorClick() {
		this.touchChildren = false
		this._sceneType = 2
		this.hide.play(0)
	}

	private _onInitGameComplete() {
		this.touchChildren = true
	}

	private _onShow() {
		this.touchChildren = true
		if (GameConfig.sign == 0 && GameConfig.signCount <= 6 && GameConfig.guideIndex >= 3) {
			Common.dispatchEvent(MainNotify.openSignPanel)
		}
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		switch (this._sceneType) {
			case 1:
				GameConfig.isOpenNewChapter = false
				Common.dispatchEvent(MainNotify.openGameSelectLevel)
			break
			case 2:
				Common.dispatchEvent(MainNotify.openActorListPanel)
			break
			default:
			break
		}		
	}

	private _onBtnSign() {
		Common.dispatchEvent(MainNotify.openSignPanel)
	}

	private _updateCandy() {
		this.m_labCandy.text = GameConfig.candy.toString()
		this.m_btnAddCandy.x = 100 + this.m_labCandy.width
	}

	private _onDialog() {
		this.groupDialog.visible = false
		if (GameConfig.babylistIndex == 0) {
			this._setTimeOut(10 * 1000)
		}else{
			this._setTimeOut(120 * 1000)
		}
	}

	private _showDialog() {
		this.groupDialog.visible = true
		this.yuye.play(0)
	}

	private _setTimeOut(delay:number) {
		egret.setTimeout(this._showDialog, this, delay)
	}

	private onComplete() {
		this._onResize()
		this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onStartGame, this)
		this._btnSound.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSound, this)
		this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAddCandy, this)
		this.m_btnBaby.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this)
		this.m_btnAd.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnAd, this)
		this.m_btnSign.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSign, this)

		Common.addTouchBegin(this.m_btnGameStart)
		// Common.addTouchBegin(this._btnSound)
		Common.addTouchBegin(this.m_btnAd)
		Common.addTouchBegin(this.m_btnAddCandy)
		Common.addTouchBegin(this.m_btnBaby)
		Common.addTouchBegin(this.m_btnSign)

		this._actorArmatureContainer = new DragonBonesArmatureContainer()
		this._actorArmatureContainer.x = this.groupActor.width / 2
        this._actorArmatureContainer.y = this.groupActor.height
		this.groupActor.addChild(this._actorArmatureContainer)
		this.groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onActorClick, this)

		//抽奖
		// this._liheArmatureContainer = new DragonBonesArmatureContainer()
		// this._liheArmatureContainer.x = 41
		// this._liheArmatureContainer.y = 9
		// this.groupTopRight.addChild(this._liheArmatureContainer)

		// let liheArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("lihe", "lihe")
		// let liheArmature = new DragonBonesArmature(liheArmatureDisplay)
		// liheArmature.ArmatureDisplay = liheArmatureDisplay
		// this._liheArmatureContainer.register(liheArmature, ["newAnimation"])
		// this._liheArmatureContainer.play("newAnimation")

		this._adArmatureContainer = new DragonBonesArmatureContainer()
		this._adArmatureContainer.x = 84
		this._adArmatureContainer.y = 146
		this.groupBtnAd.addChild(this._adArmatureContainer)
		let adArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("tubiao", "tubiao")
		let adArmature = new DragonBonesArmature(adArmatureDisplay)
		adArmature.ArmatureDisplay = adArmatureDisplay
		this._adArmatureContainer.register(adArmature, ["newAnimation"])
		this._adArmatureContainer.play("newAnimation")

		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
		this.yuye.addEventListener('complete', this._onDialog, this)

		Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		super._onResize(event)
    }

	private _sceneType:number
	// private m_imgCloth:eui.Image
	private _btnSound:eui.Image
	private m_btnGameStart:eui.Button
	private m_btnRank:eui.Button
	private m_btnBaby:eui.Button
	private m_btnAd:eui.Button
	private m_btnSign:eui.Button
	private m_isInit:boolean
	private m_groupStart:eui.Group
	private groupActor:eui.Group
	private m_labGrade:eui.Label
	private m_labEvent:eui.Label
	private m_maskRect:eui.Rect
	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
	private _actorArmatureContainer:DragonBonesArmatureContainer
    private _actorArmature:DragonBonesArmature
	private m_btnAddCandy:eui.Button
	private m_labCandy:eui.Label
	private groupTopRight:eui.Group
	private groupBtnAd:eui.Group
	private groupDialog:eui.Group
	private yuye:egret.tween.TweenGroup

	private _liheArmatureContainer:DragonBonesArmatureContainer
	private _adArmatureContainer:DragonBonesArmatureContainer
}