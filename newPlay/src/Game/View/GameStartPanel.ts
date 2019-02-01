class GameStartPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameStart.exml"
	}

	// 初始化面板
    public initPanel():void{
        this.m_cloud1Speed = 0.6
		this.m_cloud2Speed = 0.3
		this.m_cloud3Speed = 0.1
		this.m_isInit = false
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_gameStartPanel
		this.touchChildren = true
		// this.m_maskRect.visible = false
		if (!this.m_isInit) {
			this.touchChildren = false
			this.InitGroup.play(0)
			this.m_isInit = true
		}else{
			this.m_groupStart.alpha = 1
			this.m_maskRect.visible = true
			this.initGame.play(0)
		}

		let id = GameConfig.itemUseTable[0]
		let data = GameConfig.itemTable[id.toString()]
		this.m_imgBg.source = data.Scene
		this.m_imgSun.source = data.Sun
		this.m_cloud1.source = data.cloud1
		this.m_cloud2.source = data.cloud2
		this.m_cloud3.source = data.cloud3

		// this.m_imgCloth.y = Config.stageHeight - 1375
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

	public Update() {
		if (this.m_cloud1.x >= -this.m_cloud1.width) {
			this.m_cloud1.x -= this.m_cloud1Speed
		}else{
			this.m_cloud1.x = Config.stageWidth
		}

		if (this.m_cloud2.x >= -this.m_cloud2.width) {
			this.m_cloud2.x -= this.m_cloud2Speed
		}else{
			this.m_cloud2.x = Config.stageWidth
		}

		if (this.m_cloud3.x <= Config.stageWidth + this.m_cloud3.width) {
			this.m_cloud3.x += this.m_cloud1Speed
		}else{
			this.m_cloud3.x = -this.m_cloud3.width
		}
	}

	public get Cloud1() {
		return this.m_cloud1
	}

	public get Cloud2() {
		return this.m_cloud2
	}

	public get Cloud3() {
		return this.m_cloud3
	}
	private _OnHideCloth() {
		// GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _OnStartGame() {
		this.touchChildren = false
		this.m_sceneType = 1
		this.m_maskRect.visible = true
		this.startGame.play(0)
		// this.CloseGroup.play(0)
	}

	private _OnBtnSetting() {
		Common.dispatchEvent(MainNotify.openSettingPanel)
	}

	private _OnBtnRank() {
		
	}

	private _OnBtnProc() {
		this.m_sceneType = 2
		this.m_maskRect.visible = true
		this.startGame.play(0)
	}

	private _OnInitComplete() {
		this.touchChildren = true
	}

	private _OnCloseComplete() {
		this._OnHideCloth()
	}

	private _OnWaterComplete() {
		this.water.play(0)
	}

	private _OnBtn1() {
		GameConfig.testSelectLevel = 1001
	}

	private _OnBtn2() {
		GameConfig.testSelectLevel = 1002
	}

	private _OnBtn3() {
		GameConfig.testSelectLevel = 1003
	}

	private _OnBtnLoop() {
		GameConfig.testSelectLevel = 1004
	}

	private _OnGameStartComplete() {
		if (this.m_sceneType == 1) {
			this._OnHideCloth()
		}
		else if (this.m_sceneType == 2) {
			Common.dispatchEvent(MainNotify.closeGameStartPanel)
			Common.dispatchEvent(MainNotify.openBackpackPanel)
		}
    }

	private _OnInitGameComplete() {
		this.touchChildren = true
	}

	private onComplete() {
		// this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this._OnResize()
		this.water.play(0)
		this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this)
		this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this)
		this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this)

		Common.addTouchBegin(this.m_btnGameStart)
		Common.addTouchBegin(this.m_btnSetting)
		Common.addTouchBegin(this.m_btnRank)
		Common.addTouchBegin(this.m_btnProc)

		this.InitGroup.addEventListener('complete', this._OnInitComplete, this)
		this.CloseGroup.addEventListener('complete', this._OnCloseComplete, this)
		this.water.addEventListener('complete', this._OnWaterComplete, this)
		this.startGame.addEventListener('complete', this._OnGameStartComplete, this)
		this.initGame.addEventListener('complete', this._OnInitGameComplete, this)


		this.m_groupLevel.visible = false
		this.m_btn1.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn1, this)
		this.m_btn2.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn2, this)
		this.m_btn3.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtn3, this)
		this.m_btnLoop.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnLoop, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		super._OnResize(event)
    }


	private m_sceneType:number

	private m_imgBg:eui.Image
	// private m_imgCloth:eui.Image
	private m_btnSetting:eui.Button
	private m_btnGameStart:eui.Button
	private m_btnRank:eui.Button
	private m_btnProc:eui.Button

	/**云朵 */
	private m_cloud1:eui.Image
	private m_cloud2:eui.Image
	private m_cloud3:eui.Image
	private m_cloud1Speed:number
	private m_cloud2Speed:number
	private m_cloud3Speed:number

	private startGame:egret.tween.TweenGroup
	private initGame:egret.tween.TweenGroup

	/**水面 */
	private water:egret.tween.TweenGroup

	/**太阳 */
	private m_imgSun:eui.Image

	private m_isInit:boolean
	private InitGroup:egret.tween.TweenGroup
	private CloseGroup:egret.tween.TweenGroup
	private m_groupStart:eui.Group

	private m_maskRect:eui.Rect

	
	private m_groupLevel:eui.Group
	private m_btn1:eui.Button
	private m_btn2:eui.Button
	private m_btn3:eui.Button
	private m_btnLoop:eui.Button
}