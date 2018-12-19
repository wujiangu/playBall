class BaseActor extends egret.DisplayObjectContainer {
	public constructor() {
		super()

		this.m_armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this.m_armatureContainer)

		var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
		var angle:number = 45;              /// 阴影的角度，0 到 360 度
		var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
		var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
		var blurX:number = 16;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
		var blurY:number = 16;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
		var strength:number = 0.65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
		var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
		var inner:boolean = false;            /// 指定发光是否为内侧发光
		var knockout:boolean = false;            /// 指定对象是否具有挖空效果

		this.m_dropShadowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,
    	strength, quality, inner, knockout)
	}

	public GotoIdle() {

	}

	public GotoHurt() {

	}

	public GotoDead() {

	}

	public GotoRun() {

	}

	public Update(timeElapsed:number) {

	}

	protected m_armatureContainer:DragonBonesArmatureContainer
	protected m_type:EMonsterType
	protected m_dropShadowFilter:egret.DropShadowFilter
	protected m_armature:DragonBonesArmature
}