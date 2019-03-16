class PermanentUI extends BasePanel {
	public constructor() {
		super()

		this.m_cloud1Speed = 0.6
		this.m_cloud2Speed = 0.3
		this.m_cloud3Speed = 0.1
        this.m_sunSpeed = 0.05
		this.addEventListener(eui.UIEvent.COMPLETE, this._onComplete, this)
        this.skinName = "resource/game_skins/permanentUI.exml"
	}

	public get sceneBg() {
		return this.m_imgBg
	}

	public updateScene(path:string, water:number) {
		this.m_imgBg.source = path
		if (water == 0) {
			this.groupRiver.visible = false
		}else{
			this.groupRiver.visible = true
		}
	}

	public updateSun(path:string) {
		if (path == null) this.m_imgSun.visible = false
		else {
			this.m_imgSun.visible = true
			this.m_imgSun.source = path
		}
		
	}

	public updateCloud(a_bottom:string, a_top:string) {
		// this.m_cloud1.source = a_middle
		this.m_cloud2.source = a_top
		this.m_cloud3.source = a_bottom
	}

	public update() {
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

        if (this.m_imgSun.x <= Config.stageWidth + this.m_imgSun.width) {
            this.m_imgSun.x += this.m_sunSpeed
        }else{
			this.m_imgSun.x = -this.m_imgSun.width
		}
	}

	private _onWaterComplete() {
		this.water.play(0)
	}

	private _onComplete() {
		ShakeTool.getInstance().setInitPos(this.m_imgBg.x, this.m_imgBg.y)
		this.water.play(0)
		this.water.addEventListener('complete', this._onWaterComplete, this)
	}

	private m_imgBg:eui.Image
	private m_imgSun:eui.Image
	private m_cloud1:eui.Image
	private m_cloud2:eui.Image
	private m_cloud3:eui.Image
	private groupRiver:eui.Group


	private m_cloud1Speed:number
	private m_cloud2Speed:number
	private m_cloud3Speed:number
	private m_sunSpeed:number

	private water:egret.tween.TweenGroup

	private m_imgGroundLine:eui.Image
}