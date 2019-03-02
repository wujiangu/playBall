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
		this.m_normalGesture = new Array()
		this.m_hardGesture = new Array()
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
				this.m_normalGesture.push(GameConfig.gestureConfig[i])
			}else{
				this.m_hardGesture.push(GameConfig.gestureConfig[i])
			}
		}


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

	public ResetNormalGesture() {
		this.m_normalGesture.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
				this.m_normalGesture.push(GameConfig.gestureConfig[i])
			}
		}
	}

	public ResetHardGesture() {
		this.m_hardGesture.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Hard) {
				this.m_hardGesture.push(GameConfig.gestureConfig[i])
			}
		}
	}

	public GotoIdle() {

	}

	public GotoHurt() {

	}

	public GotoDead() {

	}

	public GotoExplore() {}

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

	public get EPos() {
		return this.m_ePos
	}

	public set EPos(value:EMonsterPos) {
		this.m_ePos = value
	}

	public get ActorTableData() {
		return this.m_data
	}

	public get Type() {
		return this.m_type
	}

	public Update(timeElapsed:number) {

	}

	public ResetGestureData() {
		
	}

	public SetVertical(addNum:number) {
		if (this.m_speedY <= 0) return
		this.ResetVertical()
		this.m_addNum += addNum
		this.m_speedY += addNum
	}

	public ResetVertical() {
		this.m_speedY -= this.m_addNum
		this.m_addNum = 0
	}

	/**
	 * 更新怪物身上的特效动画
	 */
	public UpdateEffectArmature(data:any) {
		this.m_effectArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.skillFile, data.skillFile)
		if (this.m_effectArmature == null) {
			this.m_effectArmature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_effectData = data
		this.m_effectResult = data.result
		this.m_effectArmature.ArmatureDisplay = armatureDisplay
		this.m_effectArmatureContainer.register(this.m_effectArmature, [data.skill])
		this.m_effectArmatureContainer.visible = false
		this.m_effectArmatureContainer.scaleX = 1
		this.m_effectArmatureContainer.scaleY = 1
		this.m_effectArmatureContainer.x = data.skillPosX
		this.m_effectArmatureContainer.y = data.skillPosY
		this.m_effectArmatureContainer.addCompleteCallFunc(this.OnEffectArmatureComplete, this)
		this.m_effectArmatureContainer.addFrameCallFunc(this.OnEffectArmatureFram, this)
		this.m_effectArmatureContainer.visible = false
	}

	public get State() {
		return this.m_state
	}

	public PlayEffect(data:any) {}

	public BalloonExploreHandle() {}

	public RemoveBalloon(balloon:Balloon) {}

	public OnEffectArmatureComplete() {
		if (this.m_state == EMonsterState.Stop) {
			switch (this.m_effectResult) {
				case ESkillResult.Kill:
					this.m_effectResult = ESkillResult.Invalid
					this.GotoDead()
					this._DestroyBalloon()
				break
				case ESkillResult.StopSpeed:
					this.m_speedY = 0
					this.m_state = EMonsterState.Ready
				break
				case ESkillResult.ChangeLucky:
				break
			}
		}
	}

	public OnEffectArmatureFram(event:dragonBones.EgretEvent) {}

	protected _DestroyBalloon() {
		this.m_sumBalloon = 0
		while(this.m_balloons.length > 0) {
			let balloon:Balloon = this.m_balloons.pop()
			GameObjectPool.getInstance().destroyObject(balloon)
			this.m_groupBalloon.removeChild(balloon)
		}
	}

	protected _SetBallonPosition(balloon:Balloon, count:number, value:number = 0) {
		if (count == 1) {
			balloon.x = 0
			balloon.y = -this.m_rect.height * 1.1
			balloon.SetLine()
		}
		else if (count == 2) {
			balloon.x = value * (balloon.width + 5) - this.m_rect.width / 2
			balloon.y = -this.m_rect.height * 1.3
			balloon.SetLine(count, value)
		}
		else if (count == 3) {
			if (value == 0) {
				balloon.x = 0
				balloon.y = -this.m_rect.height * 1.5
			}else{
				balloon.x = (value - 1) * (balloon.width + this.m_rect.width/2) - this.m_rect.width * 0.7
				balloon.y = -this.m_rect.height * 1.2
			}
			balloon.SetLine(count, value)
		}
	}

	protected m_sumBalloon:number
	protected m_groupBalloon:egret.DisplayObjectContainer
	protected m_armatureContainer:DragonBonesArmatureContainer
	protected m_type:EMonsterDifficult
	// protected m_dropShadowFilter:egret.DropShadowFilter
	protected m_armature:DragonBonesArmature
	protected m_gestureData:Array<any>
	protected m_normalGesture:Array<any>
	protected m_hardGesture:Array<any>
	protected m_rect:egret.Rectangle
	protected m_shape:egret.Shape

	protected m_effectArmatureContainer:DragonBonesArmatureContainer
	protected m_effectArmature:DragonBonesArmature
	protected m_effectData:any
	protected m_effectResult:ESkillResult
	protected m_width:number
	protected m_height:number

	protected m_speedY:number
	protected m_speedX:number
	protected m_spFall:number
	protected m_baseSpeedY:number

	protected m_balloons:Array<Balloon>

	protected m_data:any

	protected m_slowDelay:number

	protected m_gesturDiff:number
	protected m_balloonMin:number
	protected m_balloonMax:number
	protected m_addNum:number

	protected m_ePos:EMonsterPos
	protected m_state:EMonsterState
}