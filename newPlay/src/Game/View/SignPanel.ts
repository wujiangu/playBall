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
		this.m_imgMask7.visible = false
		this.m_imgCheck7.visible = false

		if (GameConfig.signCount >= 7) {
			this.m_imgMask7.visible = true
			this.m_imgCheck7.visible = true
		}
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
		// this.m_scroll.verticalScrollBar.visible = false
		// this.m_scroll.verticalScrollBar.autoVisibility = false
	}

	private _onHide() {
		Common.dispatchEvent(MainNotify.closeSignPanel)
	}

	private _onBtnSignIn() {
		if (GameConfig.sign == 0 && GameConfig.signCount <= 6) {
			if (GameConfig.signCount <= 5) {
				this._signGroups[GameConfig.signCount].sign()
			}else{
				this.m_imgMask7.visible = true
				this.m_imgCheck7.visible = true
				let config = GameConfig.signConfig[GameConfig.signCount]
				let data = GameConfig.signTable[config.id.toString()]
				data.isGet = true
				Common.updateSign(1)
				GameConfig.signCount++
				Common.updateSignCount(GameConfig.signCount)
				switch (data.rewardType) {
					case EReward.Candy:
						Common.updateCurCandy(data.reward)
						Common.dispatchEvent(MainNotify.updateCandy)
						GameConfig.rewardData = Common.cloneObj(data)
						GameConfig.rewardCandy = data.reward
						GameConfig.rewardType = EReward.Candy
						Common.dispatchEvent(MainNotify.openGetRewardPanel)
					break
					case EReward.AssignBaby:
						// 判断是否在已解锁列表中
						let index = GameConfig.babyUnlockList.indexOf(data.reward)
						let baby = GameConfig.actorTable[data.reward.toString()]
						if (index < 0) {
							// 加入到解锁列表
							GameConfig.babyUnlockList.push(data.reward)
							Common.updateUnlockBaby()
							GameConfig.rewardData = Common.cloneObj(baby)
							GameConfig.rewardType = EReward.AssignBaby
						}else{
							// 转换成糖果
							GameConfig.rewardCandy = baby.candy
							GameConfig.rewardType = EReward.Candy
							Common.updateCurCandy(baby.candy)
							Common.dispatchEvent(MainNotify.updateCandy)
						}
						Common.dispatchEvent(MainNotify.openGetRewardPanel)
					break
					default:
					break
				}
			}
		}else{
			TipsManager.show("today is signed!")
		}
	}

	private onComplete() {
		this._onResize()
		this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this)
		this.show.addEventListener('complete', this._onShow, this)
		this.hide.addEventListener('complete', this._onHide, this)
		this._signGroups.length = 0
		for (let i = 0; i < GameConfig.signConfig.length-1; i++) {
			let config = GameConfig.signConfig[i]
			let data = GameConfig.signTable[config.id.toString()]
			let signIR = new SignIR()
			let row = Math.floor(i/4)
			let col = i % 4
			signIR.init(data, i)
			signIR.x = 165 * col - 40
			signIR.y = 234 * row + 111
			this.group.addChild(signIR)
			this._signGroups.push(signIR)
		}
		
		this.m_btnSignIn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSignIn, this)
	}

    protected _onResize(event:egret.Event = null)
    {
		
    }

	private m_imgMask:eui.Image
	private m_btnSignIn:eui.Button
	private group:eui.Group
	private m_imgMask7:eui.Image
	private m_imgCheck7:eui.Image

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
		this.m_imgTime.source = data.icon
		this.m_labCount.text = "X" + 1
		if (data.rewardType == EReward.Candy) {
			this.m_labCount.text = "X" + data.reward
		}
		// this.m_imgReward.source = data.icon

		// this.m_imgBg.source = "qiandao2_png"
		// this.m_imgGou.visible = false
		this._hideMask()
		if (data.isGet) {
			// this.m_imgBg.source = "qiandao3_png"
			// this.m_imgGou.visible = true
			this._showMask()
		}
		// else
		// {
		// 	if (signIndex == GameConfig.signCount && GameConfig.sign == 1) {
		// 		this._showMask()
		// 		// this.m_imgBg.source = "qiandao3_png"
		// 		// this.m_imgGou.visible = true
		// 	}
		// 	if (signIndex == GameConfig.signCount + 1 && GameConfig.sign == 0) {
		// 		this._showMask()
		// 		// this.m_imgBg.source = "qiandao3_png"
		// 	}
		// 	Common.log(signIndex, GameConfig.signCount, GameConfig.sign)
		// }
		this.id = data.id
		this.index = day
		this.data = data
	}

	public sign() {
		let data = GameConfig.signTable[this.id.toString()]
		if (!data.isGet && this.index == GameConfig.signCount && GameConfig.sign == 0) {
			Common.updateSign(1)
			GameConfig.signCount++
			Common.updateSignCount(GameConfig.signCount)
			data.isGet = true
			this._showMask()
			// this.m_imgGou.visible = true
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

	private _hideMask() {
		this.m_imgMask.visible = false
		this.m_imgCheckIn.visible = false
	}

	private _showMask() {
		this.m_imgMask.visible = true
		this.m_imgCheckIn.visible = true
	}

	private _onBtnSign() {
		let data = GameConfig.signTable[this.id.toString()]
		if (!data.isGet && this.index == GameConfig.signCount && GameConfig.sign == 0) {
			Common.updateSign(1)
			GameConfig.signCount++
			Common.updateSignCount(GameConfig.signCount)
			data.isGet = true
			// this.m_imgGou.visible = true
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
		// this.m_imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSign, this)
		// Common.addTouchBegin(this.m_imgBg)
	}

	private m_imgBg:eui.Image
	private m_imgTime:eui.Image
	private m_imgReward:eui.Image
	private m_labCount:eui.Label
	private m_imgMask:eui.Image
	private m_imgCheckIn:eui.Image
}