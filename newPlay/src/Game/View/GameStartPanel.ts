class GameStartPanel extends BasePanel {
	public constructor() {
		super()
		this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameStart.exml"
	}

	// 初始化面板
    public initPanel():void{
        this.m_cloud1Speed = 1
		this.m_cloud2Speed = 0.6
		this.m_cloud3Speed = 0.3
		this.m_imgWaters = new Array()


		this.m_progress = new egret.Shape()
		this.addChild(this.m_progress)

		this.m_angle = 200
    }

    // 初始化面板数据
    public initData():void{

    }

    // 进入面板
    public onEnter():void{
		Common.curPanel = PanelManager.m_gameStartPanel
		this.touchChildren = true

		

		// this.m_imgCloth.y = Config.stageHeight - 1375
        Common.gameScene().uiLayer.addChild(this)

    }

    // 退出面板
    public onExit():void{
		this.touchChildren = false
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

	private _WaterAnimate(target:eui.Image) {
		Animations.floatUpDown(target, 2000, 10, 0)
	}

	private _OnHideCloth() {
		GameManager.Instance.Start()
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openGamePanel)
	}

	private _OnStartGame() {
		this.touchChildren = false
		this._OnHideCloth()
		// egret.Tween.get(this.m_imgCloth).to({y:-this.m_imgCloth.height}, 1000, egret.Ease.backOut).call(this._OnHideCloth, this)
		// Common.dispatchEvent(MainNotify.closeBottomBtnPanel)
	}

	private _OnBtnSetting() {
		Common.dispatchEvent(MainNotify.openSettingPanel)
	}

	private _UpdateProgress(angle:number) {
		this.m_progress.graphics.clear();
        this.m_progress.graphics.lineStyle(2, 0x0000ff, 1);
        this.m_progress.graphics.drawArc(50, 50, 50, Math.PI, angle * Math.PI / 180, false);
        this.m_progress.graphics.endFill();
	}

	private _OnBtnRank() {
		this.m_angle += 2
		this._UpdateProgress(this.m_angle)
	}

	private _OnBtnProc() {
		Common.dispatchEvent(MainNotify.closeGameStartPanel)
		Common.dispatchEvent(MainNotify.openBackpackPanel)
	}

	private onComplete() {
		// this.m_imgCloth.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this._OnResize()

		this.m_imgWaters.push(this.m_imgWater0)
		this.m_imgWaters.push(this.m_imgWater1)
		this.m_imgWaters.push(this.m_imgWater2)
		this.m_imgWaters.push(this.m_imgWater3)
		this.m_imgWaters.push(this.m_imgWater4)
		this.m_imgWaters.push(this.m_imgWater5)
		this.m_imgWaters.push(this.m_imgWater6)

		for (let i = 0; i < this.m_imgWaters.length; i++) {
			this.m_imgWaters[i].y = 10
			egret.setTimeout(this._WaterAnimate, this, i*200, this.m_imgWaters[i])
		}


		this.m_btnGameStart.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnStartGame, this)
		this.m_btnSetting.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnSetting, this)
		this.m_btnRank.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnRank, this)
		this.m_btnProc.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnProc, this)
	}

    protected _OnResize(event:egret.Event = null)
    {
		
    }

	private m_progress:egret.Shape
	private m_angle:number


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
	private m_imgWater0:eui.Image
	private m_imgWater1:eui.Image
	private m_imgWater2:eui.Image
	private m_imgWater3:eui.Image
	private m_imgWater4:eui.Image
	private m_imgWater5:eui.Image
	private m_imgWater6:eui.Image
	private m_imgWaters:Array<eui.Image>

	/**太阳 */
	private m_imgSun:eui.Image
}