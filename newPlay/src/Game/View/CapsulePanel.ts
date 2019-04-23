class CapsulePanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/choujiang.exml"
	}

	// 初始化面板
    public initPanel():void{
        this._data = new CapsuleData()
		this._data.init()
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		this._hookStop()
		this._btnStop()
		this._remoteStop()
		this._candy.text = GameConfig.candy.toString()

		this._candy.x = 650 - this._candy.width
		this._imgCandy.x = this._candy.x - 73


		this._btnDelay = -1
		this._isCapture = false
		this._data.isEnough = true

		this._hookMove.play(0)
		this.anjian.play(0)

		if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.stop()
		this._bgmChannel = GameVoice.rewardBGM.play(0)
		this.touchChildren = true
		Common.gameScene().uiLayer.addChild(this)
    }

    // 退出面板
    public onExit():void{
		this._btnDelay = -1
		this._bgmChannel.stop()
		GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0)
		if (this._data.isEnough == false) {
			Common.dispatchEvent(MainNotify.openRechargePanel)
		}
		Common.gameScene().uiLayer.removeChild(this)
    }

	public update(timeElapsed:number) {
		if (this._btnDelay < 0) return
		this._btnDelay += timeElapsed
		if (this._btnDelay >= 2000) {
			this._btnDelay = -1
			this.anjian.play(0)
		}
	}

	private _onClose() {
		Common.dispatchEvent(MainNotify.closeCapsulePanel)
		if (GameConfig.sceneType == 0) Common.dispatchEvent(MainNotify.openGameStartPanel)
	}

	private _onBtnCapsule() {
		if (GameConfig.candy < this._data.consume) {
			// TipsManager.show("no enough candy!", Common.TextColors.grayWhite)
			this._data.isEnough = false
			this.touchChildren = false
			Common.dispatchEvent(MainNotify.closeCapsulePanel)
			return
		}
		this.touchChildren = false
		this._isCapture = true
		this._btnDelay = -1
		this._btnStop()
		GameConfig.rewardData = Common.cloneObj(this._data.result)
		this.anjian.play(0)
		this.yaogan.play(0)
		Common.updateCurCandy(-this._data.consume)
		Common.dispatchEvent(MainNotify.updateCandy)
	}

	private _onShow() {
		this.touchChildren = true
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeCapsulePanel)
	}

	private _onHookComplete() {
		this._hookMove.play()
		this._hookStop()
		this.touchChildren = true
		let sound:egret.Sound = RES.getRes("getBaby_mp3")
		if (GameConfig.rewardType == EReward.Candy) {
			sound = RES.getRes("getCandy_mp3")
		}
		let channel = sound.play(0, 1)
		Common.dispatchEvent(MainNotify.openGetRewardPanel)
	}

	private _onBtnComplete() {
		if (this._isCapture) {
			this._isCapture = false
			this._hookMove.pause()
			this._btnDelay = 0
			this.zhua.play(0)
			let channel = GameVoice.rewardVoice.play(0, 1)
			channel.volume = GameConfig.soundValue / 100
			this._hook.alpha = 1
		}else{
			this._btnDelay = 0
		}
	}

	private _hookMoveComplete() {
		this._hookMove.play(0)
	}

	private _updateCandy() {
		this._candy.text = GameConfig.candy.toString()
		this._candy.x = 650 - this._candy.width
		this._imgCandy.x = this._candy.x - 73
	}

	private _onBtnRecharge() {
		Common.dispatchEvent(MainNotify.openRechargePanel)
	}

	private _remoteStop() {
		this._remote1.alpha = 1
		this._remote2.alpha = 0
		this._remote3.alpha = 0
	}

	private _btnStop() {
		this._btnCapture.alpha = 1
		this._imgCapture.alpha = 0
	}

	private _hookStop() {
		this._hook.alpha = 0
		this._hookFirst.alpha = 1
	}

	private onComplete() {
		this._onResize()
		
		this._hookMove.addEventListener('complete', this._hookMoveComplete, this)
		this.anjian.addEventListener('complete', this._onBtnComplete, this)
		this.zhua.addEventListener('complete', this._onHookComplete, this)
		this.m_btnReturn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
		this._btnCapture.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnCapsule, this)
		this._btnRecharge.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnRecharge, this)

		Common.addTouchBegin(this.m_btnReturn)
		Common.addTouchBegin(this._btnCapture)

		Common.addEventListener(MainNotify.updateCandy, this._updateCandy, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }
	private m_imgMask:eui.Image
	private m_scroll:eui.Scroller
	private m_groupScroll:eui.Group
	private m_btnReturn:eui.Button

	private _hookFirst:eui.Image
	private _hook:eui.Group

	private _remote1:eui.Image
	private _remote2:eui.Image
	private _remote3:eui.Image

	private _imgCapture:eui.Image

	// 钩子水平移动
	private _hookMove:egret.tween.TweenGroup
	private anjian:egret.tween.TweenGroup
	private yaogan:egret.tween.TweenGroup
	private zhua:egret.tween.TweenGroup

	private _btnCapture:eui.Button

	private _data:CapsuleData
	private _btnDelay:number = -1
	private _isCapture:boolean
	private _candy:eui.Label
	private _btnRecharge:eui.Button
	private _bgmChannel:egret.SoundChannel
	private _imgCandy:eui.Image
	
}