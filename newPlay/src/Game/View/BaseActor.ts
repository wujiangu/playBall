class BaseActor extends egret.DisplayObjectContainer {
	public constructor() {
		super()

		this.m_groupBalloon = new egret.DisplayObjectContainer()
		this.addChild(this.m_groupBalloon)

		this.m_armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this.m_armatureContainer)

		this.m_effectArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this.m_effectArmatureContainer)

		this.m_gestureData = new Array()

		// var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
		// var angle:number = 45;              /// 阴影的角度，0 到 360 度
		// var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
		// var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
		// var blurX:number = 16;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		// var blurY:number = 16;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		// var strength:number = 0.65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		// var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
		// var inner:boolean = false;            /// 指定发光是否为内侧发光
		// var knockout:boolean = false;            /// 指定对象是否具有挖空效果

		// this.m_dropShadowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,
    	// strength, quality, inner, knockout)

		this.m_rect = new egret.Rectangle()

		// this.m_shape = new egret.Shape()
		// this.addChild(this.m_shape)
		// this.m_shape.graphics.beginFill( 0xff0000, 0.5);
	}

	public GotoIdle() {

	}

	public GotoHurt() {

	}

	public GotoDead() {

	}

	public GotoRun() {

	}

	public GotoSlow() {}

	public get w() {
		return this.m_width
	}

	public get h() {
		return this.m_height
	}

	public get Balloons() {
		return this.m_balloons
	}

	public get GestureData() {
		return this.m_gestureData
	}

	public set GestureData(value) {
		this.m_gestureData = value
	}

	public set SpeedVertical(value) {
		this.m_speedY = value
	}
	
	public set SpeedHorizon(value) {
		this.m_speedX = value
	}

	public get ActorTableData() {
		return this.m_data
	}

	public Update(timeElapsed:number) {

	}

	public BalloonExploreHandle() {}

	public RemoveBalloon(balloon:Balloon) {}

	public PlayEffect() {}

	protected _SetBallonPosition(balloon:Balloon, count:number, value:number = 0) {
		if (count == 1) {
			balloon.x = 0
			balloon.y = -this.m_rect.height * 1.1
			balloon.SetLine()
		}
		else if (count == 2) {
			balloon.x = value * (balloon.width + 5) - this.m_rect.width / 2
			balloon.y = -this.m_rect.height * 1.1
			balloon.SetLine(count, value)
		}
		else if (count == 3) {
			if (value == 0) {
				balloon.x = 0
				balloon.y = -this.m_rect.height * 1.4
			}else{
				balloon.x = (value - 1) * (balloon.width + this.m_rect.width/2) - this.m_rect.width * 0.7
				balloon.y = -this.m_rect.height
			}
			balloon.SetLine(count, value)
		}
	}

	protected m_groupBalloon:egret.DisplayObjectContainer
	protected m_armatureContainer:DragonBonesArmatureContainer
	protected m_type:EMonsterType
	// protected m_dropShadowFilter:egret.DropShadowFilter
	protected m_armature:DragonBonesArmature
	protected m_gestureData:Array<any>
	protected m_rect:egret.Rectangle
	protected m_shape:egret.Shape

	protected m_effectArmatureContainer:DragonBonesArmatureContainer
	protected m_effectArmature:DragonBonesArmature
	protected m_effectData:any
	protected m_width:number
	protected m_height:number

	protected m_speedY:number
	protected m_speedX:number

	protected m_balloons:Array<Balloon>

	protected m_data:any

	protected m_slowDelay:number

	protected m_gesturDiff:number
	protected m_balloonMin:number
	protected m_balloonMax:number
}