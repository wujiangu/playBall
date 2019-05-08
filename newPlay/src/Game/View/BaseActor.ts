class BaseActor extends egret.DisplayObjectContainer {
	public constructor() {
		super()

		this._groupBalloon = new egret.DisplayObjectContainer()
		this.addChild(this._groupBalloon)

		this._armatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._armatureContainer)

		this._effectArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._effectArmatureContainer)

		this._gestureData = new Array()
		this._normalGesture = new Array()
		this._centerGesture = new Array()
		this._hardGesture = new Array()
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
				this._normalGesture.push(GameConfig.gestureConfig[i])
			}else{
				this._hardGesture.push(GameConfig.gestureConfig[i])
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

		this._rect = new egret.Rectangle()

		// this._shape = new egret.Shape()
		// this.addChild(this._shape)
		// this._shape.graphics.beginFill( 0xff0000, 0.5);
	}

	public resetNormalGesture() {
		this._normalGesture.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
				this._normalGesture.push(GameConfig.gestureConfig[i])
			}
		}
	}

	public resetCenterGesture() {
		this._centerGesture.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Center) {
				this._normalGesture.push(GameConfig.gestureConfig[i])
			}
		}
	}

	public resetHardGesture() {
		this._hardGesture.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Hard) {
				this._hardGesture.push(GameConfig.gestureConfig[i])
			}
		}
	}

	public initData() {
		this._summonCount = 0
		this._summonWave = 0
		this._summonBeKillCount = 0
		this._unusualDelay = 0
	}

	public gotoIdle() {

	}

	public gotoHurt() {

	}

	public gotoDead() {

	}

	public gotoExplore() {}

	public gotoRun() {

	}

	public gotoSlow() {}

	public get w() {
		return this._width
	}

	public get h() {
		return this._height
	}

	public get balloons() {
		return this._balloons
	}

	public get gestureData() {
		return this._gestureData
	}

	public set gestureData(value) {
		this._gestureData = value
	}

	public set speedVertical(value) {
		this._speedY = value
	}
	
	public set speedHorizon(value) {
		this._speedX = value
	}

	public get ePos() {
		return this._ePos
	}

	public set ePos(value:EMonsterPos) {
		this._ePos = value
	}

	public get actorTableData() {
		return this._data
	}

	public get type() {
		return this._type
	}

	public update(timeElapsed:number) {
		if (this._state == EMonsterState.Ready && this._speedY == 0) {
			this._unusualDelay += timeElapsed
			if (this._unusualDelay >= PanelManager.gameScenePanel.baby.skillData.time) {
                this._unusualDelay = 0
				this._effectArmatureContainer.visible = false
				this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent
            }
		}
	}

	public resetGestureData() {
		
	}

	public changeGestureType(a_gestureType:number) {}

	public setVertical(addNum:number) {
		if (this._speedY <= 0) return
		this.resetVertical()
		this._addNum += addNum
		this._speedY += addNum
	}

	public resetVertical() {
		this._speedY -= this._addNum
		this._addNum = 0
		this._speedY = Math.max(this._speedY, 0)
	}

	/**
	 * 更新怪物身上的特效动画
	 */
	public updateEffectArmature(data:any) {
		this._effectArmatureContainer.clear()
		if (data.skillFile == null || data.skillFile == "") return
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.skillFile, data.skillFile)
		if (this._effectArmature == null) {
			this._effectArmature = new DragonBonesArmature(armatureDisplay)
		}
		this._effectData = data
		this._effectResult = data.result
		this._effectArmature.ArmatureDisplay = armatureDisplay
		this._effectArmatureContainer.register(this._effectArmature, [data.skill])
		this._effectArmatureContainer.visible = false
		this._effectArmatureContainer.scaleX = data.scale
		this._effectArmatureContainer.scaleY = data.scale
		this._effectArmatureContainer.x = data.skillPosX
		this._effectArmatureContainer.y = data.skillPosY
		this._effectArmatureContainer.addCompleteCallFunc(this.onEffectArmatureComplete, this)
		this._effectArmatureContainer.addFrameCallFunc(this.onEffectArmatureFram, this)
		this._effectArmatureContainer.visible = false
	}

	public get state() {
		return this._state
	}

	public set state(value:EMonsterState) {
		this._state = value
	}

	public get master() {
		return this._master
	}

	public set master(value:BaseActor) {
		this._master = value
	}

	public get summonCount() {
		return this._summonCount
	}

	public set summonCount(value:number) {
		this._summonCount = value
	}

	public playEffect(data:any) {}

	public ballExplosion(balloon:Balloon) {}

	public removeBalloon(balloon:Balloon) {}

	public onEffectArmatureComplete() {
		switch (this._state) {
			case EMonsterState.Dead:
				this.destroyAndRemove()
			break
			case EMonsterState.Stop:
				switch (this._effectResult) {
					case ESkillResult.Kill:
						this._effectResult = ESkillResult.Invalid
						this.gotoDead()
						this._destroyBalloon()
					break
					case ESkillResult.StopSpeed:
						this._speedY = 0
						this._state = EMonsterState.Ready
					break
					case ESkillResult.ChangeLucky:
						if (this.type == EMonsterDifficult.Summon) {
							this.master.summonBeKill()
						}
						PanelManager.gameScenePanel.createLuckyActor(this.x, this.y)
						this.destroyAndRemove()
					break
				}
			break
			case EMonsterState.Drown:
				this.destroyAndRemove()
			break
			default:
			break
		}
	}

	public destroy() {
		// this._state = EMonsterState.Ready
	}

	public destroyAndRemove() {
		this._effectArmatureContainer.visible = false
	}

	public onEffectArmatureFram(event:dragonBones.EgretEvent) {}

	public summonBeKill() {}

	protected _destroyBalloon() {
		this._sumBalloon = 0
		while(this._balloons.length > 0) {
			let balloon:Balloon = this._balloons.pop()
			GameObjectPool.getInstance().destroyObject(balloon)
			if (this._groupBalloon.contains(balloon)) {
				this._groupBalloon.removeChild(balloon)
			}else{
				balloon.parent.removeChild(balloon)
			}
			
		}
	}

	public isBoss() {
		if (this.type == EMonsterDifficult.Normal || this.type == EMonsterDifficult.Summon) {
			return false
		}
		return true
	}

	public balloonExploreHandle() {
		if (this._balloons.length <= 0) {
			this._sumBalloon = 0
			// this.gotoDead()
		}else{
			if (this._sumBalloon == 2 && this._balloons.length > 0) {
				let balloon:Balloon = this._balloons[0]
				let posx = 0
				egret.Tween.get(balloon).to({x:posx}, 200, egret.Ease.circOut)
				egret.Tween.get(balloon.rop).to({rotation:0}, 200, egret.Ease.circOut)
				this._sumBalloon = 1
			}

			if (this._sumBalloon == 3 && this._balloons.length > 0) {
				this._sumBalloon = 2
				if (this._exploreIndex == 2) {
					this._balloons.reverse()
				}
				for (let i = 0; i < this._balloons.length; i++) {
					let balloon:Balloon = this._balloons[i]
					let posX = i * (balloon.width+5) - this._rect.width / 2
					let posY = -this._rect.height * 1.2
					balloon.calculateRop(posX, posY)
					egret.Tween.get(balloon).to({x:posX, y:posY}, 200, egret.Ease.circOut)
					egret.Tween.get(balloon.rop).to({rotation:balloon.ropRotation}, 200, egret.Ease.circOut)
				}
			}
		}
	}

	protected _setBallonPosition(balloon:Balloon, count:number, value:number = 0) {
		if (count == 1) {
			balloon.x = 0
			balloon.y = -this._rect.height * 1.1
		}
		else if (count == 2) {
			balloon.x = value * (balloon.width + 5) - this._rect.width / 2
			balloon.y = -this._rect.height * 1.3
		}
		else if (count == 3) {
			if (value == 0) {
				balloon.x = 0
				balloon.y = -this._rect.height * 1.5
			}else{
				balloon.x = (value - 1) * (balloon.width + this._rect.width/2) - this._rect.width * 0.7
				balloon.y = -this._rect.height * 1.2
			}
		}
		balloon.setLine()
	}

	protected _exploreIndex:number
	protected _sumBalloon:number
	protected _groupBalloon:egret.DisplayObjectContainer
	protected _armatureContainer:DragonBonesArmatureContainer
	protected _type:EMonsterDifficult
	// protected m_dropShadowFilter:egret.DropShadowFilter
	protected _armature:DragonBonesArmature
	protected _gestureData:Array<any>
	protected _normalGesture:Array<any>
	protected _centerGesture:Array<any>
	protected _hardGesture:Array<any>
	protected _rect:egret.Rectangle
	protected _shape:egret.Shape

	protected _effectArmatureContainer:DragonBonesArmatureContainer
	protected _effectArmature:DragonBonesArmature
	protected _effectData:any
	protected _effectResult:ESkillResult
	protected _width:number
	protected _height:number

	protected _speedY:number
	protected _speedX:number
	protected _spFall:number
	protected _baseSpeedY:number

	protected _balloons:Array<Balloon>

	protected _data:any

	protected _slowDelay:number

	protected _gesturDiff:number
	protected _balloonMin:number
	protected _balloonMax:number
	protected _addNum:number

	protected _ePos:EMonsterPos
	protected _state:EMonsterState
	protected _summonType:number
	/**异常状态计时 */
	protected _unusualDelay:number
	protected _master:BaseActor
	protected _summonCount:number
	/**召唤物波数 */
	protected _summonWave:number
	/**召唤物被消灭的数量 */
	protected _summonBeKillCount:number

	protected _gestureType:number
}