class Balloon extends egret.Sprite {
	public name = "Balloon"
	public constructor() {
		super()
		this._gestureData = new Array()

		this._rop = Common.createBitmap("imgRop_png")
		this.addChild(this._rop)

		this._balloonArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._balloonArmatureContainer)

		this._animations = ["hong", "huang", "lan", "explore", "lv", "zi"]
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("qiqiu", "qiqiu")
		if (this._balloonArmature == null) {
			this._balloonArmature = new DragonBonesArmature(armatureDisplay)
		}
		this._balloonArmature.ArmatureDisplay = armatureDisplay
		this._balloonArmatureContainer.register(this._balloonArmature, this._animations)
		this._balloonArmatureContainer.scaleX = 1
		this._balloonArmatureContainer.scaleY = 1
		


		this._effectArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._effectArmatureContainer)
		// let effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("bianhua", "bianhua")
		// if (this._effectArmature == null) {
		// 	this._effectArmature = new DragonBonesArmature(effectArmatureDisplay)
		// }
		// this._effectArmature.ArmatureDisplay = effectArmatureDisplay
		// this._effectArmatureContainer.register(this._effectArmature, ["bianhua"])
		// this._effectArmatureContainer.scaleX = 1
		// this._effectArmatureContainer.scaleY = 1
		// this._effectArmatureContainer.addCompleteCallFunc(this._onEffectArmatureComplete, this)

		this._gesture = new egret.Bitmap()
		this.addChild(this._gesture)
		this._gesture.scaleX = 0.55
		this._gesture.scaleY = 0.55
		// this._balloon.addEventListener(egret.Event.COMPLETE, this._onBalloonComplete, this)

		this._guideArmatureContainer = new DragonBonesArmatureContainer()
        this.addChild(this._guideArmatureContainer)
        let guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao")
        let guideArmature = new DragonBonesArmature(guideDisplay)
        guideArmature.ArmatureDisplay = guideDisplay
        this._guideArmatureContainer.register(guideArmature, ["xinshouyindao2"])
		this._guideArmatureContainer.y = 30
		this._guideArmatureContainer.scaleX = 0.8
		this._guideArmatureContainer.scaleY = 0.8
	}

	public init(data:Array<any>, actor:BaseActor) {
		this._score = 0
		this._root = actor
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		this._rop.height = 0
		this._isChangeEasy = false
		this.updateGesture(data, true)
		this._guideArmatureContainer.visible = false
		this._effectResult = ESkillResult.Invalid
		this._effectArmatureContainer.visible = false
		this._balloonArmatureContainer.removeCompleteCallFunc(this._onBalloonComplete, this)
		// this._guideArmatureContainer.play("xinshouyindao2", 0)
	}

	public guideStart() {
		this._guideArmatureContainer.visible = true
		this._guideArmatureContainer.play("xinshouyindao2", 0)
	}

	/**
	 * 更新气球身上的特效动画
	 */
	public updateEffectArmature(data:any) {
		this._effectArmatureContainer.clear()
		let effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.skillFile, data.skillFile)
		if (this._effectArmature == null) {
			this._effectArmature = new DragonBonesArmature(effectArmatureDisplay)
		}
		this._effectArmature.ArmatureDisplay = effectArmatureDisplay
		this._effectArmatureContainer.register(this._effectArmature, [data.skill])
		this._effectArmatureContainer.scaleX = 1
		this._effectArmatureContainer.scaleY = 1
		this._effectArmatureContainer.x = data.skillPosX
		this._effectArmatureContainer.y = data.skillPosY
		this._changeType = data.param[1]
		this._effectResult = data.result
		this._effectArmatureContainer.addCompleteCallFunc(this._onEffectArmatureComplete, this)
	}

	public playEffect(data:any) {
		if (this._root.state == EMonsterState.Ready) {
			switch (this._effectResult) {
				case ESkillResult.Kill:
					this._type = -1
				break
				case ESkillResult.GestureChange:
					this._type = 0
				break
			}
			this._effectArmatureContainer.visible = true
			this._effectArmatureContainer.play(data.skill, 1)
		}
		
	}

	public updateGesture(data:Array<any>, isInit:boolean = false) {
		if (data.length > 0) {
			let random = MathUtils.getRandom(data.length - 1)
			this._gesture.texture = RES.getRes(data[random].path)
			this._gesture.anchorOffsetX = this._gesture.width / 2
			this._gesture.anchorOffsetY = this._gesture.height / 2
			this._gesture.x = this._balloonArmatureContainer.x + 1
			this._gesture.y = this._balloonArmatureContainer.y - 38
			this._gesture.visible = true
			this._type = data[random].type
			this._score = data[random].count
			this._animationName = data[random].balloon
			this._gestureIcon = data[random].path
			data.splice(random, 1)
			this._balloonArmatureContainer.play(this._animationName, 1)
			this._balloonArmatureContainer.pause(this._animationName)
		}
		this.scaleX = 1
		this.scaleY = 1
		if (data.length <= 0) this._root.resetGestureData()
	}

	public changeToEasy() {
		this._isChangeEasy = true
		this._type = 0
		this._effectArmatureContainer.play("bianhua", 1, 1, 0, 1.6)	
	}

	public updateColorAndGesture() {
		this._type = 0
		this._gesture.visible = false
		this._balloonArmatureContainer.play("explore", 1, 1, 0, 3)
		this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this)
	}

	public calculateRop(x1:number, y1:number) {
		let distance = MathUtils.getDistance(x1, y1, 0, -60)
		let radian = MathUtils.getRadian2(x1, y1, 0, -60)
		let rotation = MathUtils.getAngle(radian) - 90
		this._ropRotation = rotation
		this._rop.height = distance
	}

	public get ropRotation() {
		return this._ropRotation
	}

	public setLine() {
		this._rop.x = this._balloonArmatureContainer.x
		this._rop.y = this._balloonArmatureContainer.y - 10
		this.calculateRop(this.x, this.y)
		this._rop.rotation = this._ropRotation
		this._rop.scaleX = 1
		this._rop.scaleY = 1
	}

	public balloonExplore(isSummon:boolean = false) {
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		this._gesture.visible = false
		// this._balloon.play(1)
		this._balloonArmatureContainer.play(this._animationName, 1)
		let channel = GameVoice.ballonBoomSound.play(0, 1)
		channel.volume = GameConfig.soundValue / 100

		GameConfig.balloonScore += this._score
		
		if (isSummon == false) {
			this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this)
		}

		if (isSummon == false && this._root.balloons != null && this._root.balloons.length <= 0) {
			this._root.gotoDead()
			// this._balloonArmatureContainer.addCompleteCallFunc(this._onBalloonComplete, this)
		}
		// if (this._root.state == EMonsterState.Ready) {
		// 	let posY = this._root.y - 20
		// 	egret.Tween.get(this._root).to({y:posY}, 50)
		// }

		// egret.setTimeout(this._OnBalloonBoom, this, 200)
	}

	public changeToUnknown() {
		this._lastType = this._type
		this._type = 0
		this._gesture.texture = RES.getRes("gestureSheet_json.gesture104")
	}

	public changeToKnown() {
		this._type = this._lastType
		this._gesture.texture = RES.getRes(this._gestureIcon)
	}

	private _onBalloonBoom() {
		// this._boomSound.play(0, 1)
	}


	public destroy() {

	}

	public update(delay:number) {

	}

	public get type() {
		return this._type
	}

	public set type(value:number) {
		this._type = value
	}

	public get lastType() {
		return this._lastType
	}

	public set lastType(value:number) {
		this._lastType = value
	}

	public get rop():egret.Bitmap {
		return this._rop
	}

	public get width():number {
		// return this._balloon.width
		return 80
	}

	public get root():BaseActor {
		return this._root
	}

	public get score():number {
		return this._score
	}

	private _onBalloonComplete(e:egret.Event) {
		if (this._type == 0) {
			this.updateGesture(this._root.gestureData)
		}
		else if (this.type == -1) {
			this._root.balloonExploreHandle()
			GameObjectPool.getInstance().destroyObject(this)
		}else{
			this._root.balloonExploreHandle()
			GameObjectPool.getInstance().destroyObject(this)
			Common.log("_onBalloonComplete")
			this._root.removeBalloon(this)
		}
		
	}

	private _onEffectArmatureComplete(e:egret.Event) {
		// this.updateGesture(this._root.gestureData)
		switch (this._effectResult) {
			case ESkillResult.Kill:
				this._effectResult = ESkillResult.Invalid
				this._root.ballExplosion(this)
				this.balloonExplore()
			break
			case ESkillResult.GestureChange:
				this._gestureData.length = 0
				for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
					if (GameConfig.gestureConfig[i].type == this._changeType) {
						this._gestureData.push(GameConfig.gestureConfig[i])
					}
				}
				
				this.updateGesture(this._gestureData)
				Common.log("_onEffectArmatureComplete", this._type)
			break
		}
	}

	private _gesture:egret.Bitmap
	private _type:number
	private _gestureIcon:string
	private _lastType:number
	private _score:number
	private _rop:egret.Bitmap
	private _root:BaseActor
	// private _boomSound:egret.Sound

	private _balloonArmatureContainer:DragonBonesArmatureContainer
	private _balloonArmature:DragonBonesArmature

	private _effectArmatureContainer:DragonBonesArmatureContainer
	private _effectArmature:DragonBonesArmature

	private _guideArmatureContainer:DragonBonesArmatureContainer

	private _animationName:string
	private _animations:Array<string>

	private _gestureData:Array<any>

	private _isChangeEasy:boolean

	private _changeType:number

	private _effectResult:ESkillResult

	private _pointBall:egret.Point
	private _pointRoot:egret.Point
	private _ropRotation:number
}