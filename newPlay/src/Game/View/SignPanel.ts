class SignPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/qiandao.exml"
	}

	// 初始化面板
    public initPanel():void{
        this._signGroups = new Array()
		
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		this.m_imgMask.touchEnabled = false
		this.show.play(0)
		
		Common.gameScene().uiLayer.addChild(this)
		
    }

    // 退出面板
    public onExit():void{
		Common.gameScene().uiLayer.removeChild(this)
    }

	private _onClose() {
		this.hide.play(0)
	}

	private _onShow() {
		this.m_imgMask.touchEnabled = true
		this.m_scroll.verticalScrollBar.visible = false
		this.m_scroll.verticalScrollBar.autoVisibility = false
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeSignPanel)
	}

	private onComplete() {
		this._onResize()
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
		this._signGroups.length = 0
		for (let i = 0; i < GameConfig.signConfig.length; i++) {
			let config = GameConfig.signConfig[i]
			let data = GameConfig.signTable[config.id.toString()]
			let signIR = new SignIR()
			signIR.init(data, i)
			this.m_groupScroll.addChild(signIR)
			this._signGroups.push(signIR)
		}
		
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

	private m_imgMask:eui.Image
	private m_scroll:eui.Scroller
	private m_groupScroll:eui.Group

	private _signGroups:Array<SignIR>

	private show:egret.tween.TweenGroup
	private hide:egret.tween.TweenGroup
}

class SignIR extends eui.Component {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/qiandaoIR.exml"
	}

	public id:number
	public index:number
	public data:any

	public init(data:any, day:number) {
		let signIndex = day + 1
		this.m_labDay.text = signIndex.toString()
		this.m_labCount.text = "X" + 1
		if (data.rewardType == EReward.Candy) {
			this.m_labCount.text = "X" + data.reward
		}
		this.m_imgReward.source = data.icon

		this.m_imgBg.source = "qiandao2_png"
		this.m_imgGou.visible = false
		if (data.isGet) {
			this.m_imgBg.source = "qiandao3_png"
			this.m_imgGou.visible = true
		}else{
			if (signIndex == GameConfig.signCount && GameConfig.sign == 1) {
				this.m_imgBg.source = "qiandao3_png"
				this.m_imgGou.visible = true
			}
			if (signIndex == GameConfig.signCount + 1 && GameConfig.sign == 0) {
				this.m_imgBg.source = "qiandao3_png"
			}
			Common.log(signIndex, GameConfig.signCount, GameConfig.sign)
		}
		this.id = data.id
		this.index = day
		this.data = data
	}

	private _onBtnSign() {
		let data = GameConfig.signTable[this.id.toString()]
		if (!data.isGet && this.index == GameConfig.signCount && GameConfig.sign == 0) {
			Common.updateSign(1)
			GameConfig.signCount++
			Common.updateSignCount(GameConfig.signCount)
			data.isGet = true
			this.m_imgGou.visible = true
			switch (this.data.rewardType) {
				case EReward.Candy:
					Common.updateCurCandy(this.data.reward)
					Common.dispatchEvent(MainNotify.updateCandy)
					GameConfig.rewardData = Common.cloneObj(this.data)
					GameConfig.rewardCandy = this.data.reward
					GameConfig.rewardType = EReward.Candy
					Common.dispatchEvent(MainNotify.openGetRewardPanel)
				break
				case EReward.AssignBaby:
					// 判断是否在已解锁列表中
					let index = GameConfig.babyUnlockList.indexOf(this.data.reward)
					if (index < 0) {
						// 加入到解锁列表
						GameConfig.babyUnlockList.push(this.data.reward)
						Common.updateUnlockBaby()
					}else{
						// 转换成糖果
					}
					let baby = GameConfig.actorTable[this.data.reward.toString()]
					GameConfig.rewardData = Common.cloneObj(baby)
					GameConfig.rewardType = EReward.AssignBaby
					Common.dispatchEvent(MainNotify.openGetRewardPanel)
				break
				default:
				break
			}
		}
	}

	private _onComplete() {
		this.m_imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSign, this)
		// Common.addTouchBegin(this.m_imgBg)
	}

	private m_imgBg:eui.Image
	private m_imgGou:eui.Image
	private m_imgReward:eui.Image
	private m_labDay:eui.Label
	private m_labCount:eui.Label
}