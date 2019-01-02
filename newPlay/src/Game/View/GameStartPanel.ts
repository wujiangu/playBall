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
		if (!this.m_isInit) {
			this.touchChildren = false
			this.InitGroup.play(0)
			this.m_isInit = true
		}else{
			this.m_groupStart.alpha = 1
		}
		// this.m_imgCloth.y = Config.stageHeight - 1375
		if (GameVoice.beginBGMChannel != null) GameVoice.beginBGMChannel.stop()
		GameVoice.beginBGMChannel = GameVoice.beginBGMSound.play(0)
        Common.gameScene().uiLayer.addChild(this)

    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
		GameVoice.beginBGMChannel.stop()
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

	private _OnHideCloth() {
		// GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _OnStartGame() {
		this.touchChildren = false
		this.CloseGroup.play(0)
	}

	private _OnBtnSetting() {
		Common.dispatchEvent(MainNotify.openSettingPanel)
	}

	private _OnBtnRank() {
		
	}

	private _OnBtnProc() {
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openBackpackPanel)
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
	}

    protected _OnResize(event:egret.Event = null)
    {
		super._OnResize(event)
    }


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

	/**水面 */
	private water:egret.tween.TweenGroup

	/**太阳 */
	private m_imgSun:eui.Image

	private m_isInit:boolean
	private InitGroup:egret.tween.TweenGroup
	private CloseGroup:egret.tween.TweenGroup
	private m_groupStart:eui.Group

	
}