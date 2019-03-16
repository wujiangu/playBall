class GetRewardUI extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/getReward.exml"
	}

	// 初始化面板
    public initPanel():void{
        
    }

    // 初始化面板数据
    public initData(data:any, type:EReward):void{
		
    }

    // 进入面板
    public onEnter():void{
		this.touchChildren = false
		this._lightShow.play(0)
		this._lightLoop.stop()
		Common.log(GameConfig.rewardType)
		if (GameConfig.rewardType == EReward.Candy) {
			this._imgItem.visible = false
			this._babyGroup.visible = false
			this._candCount.visible = false
		}else{
			let data = GameConfig.rewardData
			this._imgItem.visible = false
			this._babyGroup.visible = true
			this._candCount.visible = false
			this._actorArmatureContainer.clear()
			let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.action, data.action)
			if (this._actorArmature == null) {
				this._actorArmature = new DragonBonesArmature(armatureDisplay)
			}
			this._actorArmature.ArmatureDisplay = armatureDisplay
			this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"])
			this._actorArmatureContainer.play("idle")
			this._actorArmatureContainer.visible = false
		}

		Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _onClose() {
		
	}

	private _onShow() {
		// this.touchChildren = true
	}

	private _onHide() {
		
	}

	private _lightShowComplete() {
		this._lightLoop.play(0)
		this.touchChildren = true
		if (GameConfig.rewardType == EReward.Candy) {
			this._imgItem.visible = true
			this._candCount.visible = true
			this._candCount.text = GameConfig.rewardCandy.toString()
		}else{
			this._actorArmatureContainer.visible = true
		}
		
	}

	private _lightLoopComplete() {
		this._lightLoop.play(0)
	}

	private _onResult() {
		Common.dispatchEvent(MainNotify.closeGetRewardPanel)
	}

	private onComplete() {
		this._onResize()
		this._actorArmatureContainer = new DragonBonesArmatureContainer()
		this._actorArmatureContainer.x = this._babyGroup.width / 2
        this._actorArmatureContainer.y = this._babyGroup.height
		this._babyGroup.addChild(this._actorArmatureContainer)

		this._lightShow.addEventListener('complete', this._lightShowComplete, this)
		this._lightLoop.addEventListener('complete', this._lightLoopComplete, this)

		// this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
		this.groupResult.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onResult, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }
	// private m_btnReturn:eui.Button

	/** 抽奖结果 */
	private groupResult:eui.Group
	// 宝宝
	private _actorArmatureContainer:DragonBonesArmatureContainer
    private _actorArmature:DragonBonesArmature
	private _babyGroup:eui.Group
	private _imgItem:eui.Image

	private _lightShow:egret.tween.TweenGroup
	private _lightLoop:egret.tween.TweenGroup

	private _candCount:eui.Label

	private _type:any
}