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
		this.m_actorArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action)
		if (this.m_actorArmature == null) {
			this.m_actorArmature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_actorArmature.ArmatureDisplay = armatureDisplay
		this.m_actorArmatureContainer.register(this.m_actorArmature, ["fangdazhao", "idle", "zoulu"])
		this.m_actorArmatureContainer.play("idle")
    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_gameStartPanel
		this.touchChildren = false
		// this.m_maskRect.visible = false
		// if (!this.m_isInit) {
		// 	this.touchChildren = true
		// 	this.m_isInit = true
		// }else{
		// 	// this.m_groupStart.alpha = 1
		// 	// this.m_maskRect.visible = true
		// }
		GameManager.Instance.updateSceneBg("Bg1_png")
		this.show.play(0)

		let id = GameConfig.itemUseTable[0]
		let data = GameConfig.itemTable[id.toString()]
		this.initData()
		if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.stop()
		GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0)
        Common.gameScene().uiLayer.addChild(this)

    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		if (this.m_sceneType == 1) GameVoice.beginBGMChannel.stop()
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _OnHideCloth() {
		// GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _OnStartGame() {
		this.touchChildren = false
		this.m_sceneType = 1
		this.m_maskRect.visible = false
		this.hide.play(0)
		// Common.dispatchEvent(MainNotify.openGameSelectLevel)
	}

	private _OnBtnSetting() {
		Common.dispatchEvent(MainNotify.openSettingPanel)
	}

	private _OnBtnAddCandy() {
		Common.dispatchEvent(MainNotify.openRechargePanel)
	}

	private _OnBtnProc() {
		
		this.m_maskRect.visible = true
	}

	private _OnBtnAd() {

	}

	private _OnActorClick() {
		this.touchChildren = false
		this.m_sceneType = 2
		this.hide.play(0)
	}

	private _OnInitGameComplete() {
		this.touchChildren = true
	}

	private _OnShow() {
		this.touchChildren = true
	}

	private _OnHide() {
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		switch (this.m_sceneType) {
			case 1:
				Common.dispatchEvent(MainNotify.openGameSelectLevel)
			break
			case 2:
				Common.dispatchEvent(MainNotify.openActorListPanel)
			break
			default:
			break
		}
		
		
	}

	private onComplete() {
		// this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this._OnResize()
		this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this)
		this.m_btnAddCandy.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAddCandy, this)
		// this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this)
		this.m_btnAd.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnAd, this)

		Common.addTouchBegin(this.m_btnGameStart)
		Common.addTouchBegin(this.m_btnSetting)
		Common.addTouchBegin(this.m_btnAd)
		Common.addTouchBegin(this.m_btnAddCandy)
		// Common.addTouchBegin(this.m_btnProc)

		this.m_actorArmatureContainer = new DragonBonesArmatureContainer()
		this.m_actorArmatureContainer.x = this.groupActor.width / 2
        this.m_actorArmatureContainer.y = this.groupActor.height
		this.groupActor.addChild(this.m_actorArmatureContainer)
		this.groupActor.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnActorClick, this)

		this.show.addEventListener('complete', this._OnShow, this)
		this.hide.addEventListener('complete', this._OnHide, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		super._OnResize(event)
    }


	private m_sceneType:number
	// private m_imgCloth:eui.Image
	private m_btnSetting:eui.Button
	private m_btnGameStart:eui.Button
	private m_btnRank:eui.Button
	private m_btnProc:eui.Button
	private m_btnAd:eui.Button

	private m_isInit:boolean
	private m_groupStart:eui.Group

	private groupActor:eui.Group

	private m_labGrade:eui.Label
	private m_labEvent:eui.Label

	private m_maskRect:eui.Rect

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup


	private m_actorArmatureContainer:DragonBonesArmatureContainer
    private m_actorArmature:DragonBonesArmature

	private m_btnAddCandy:eui.Button
	private m_btnGift:eui.Button
	private m_labCandy:eui.Label
}