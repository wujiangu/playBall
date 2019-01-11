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

		this._balloonArmatureContainer.addCompleteCallFunc(this._OnBalloonComplete, this)



		this._effectArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._effectArmatureContainer)
		let effectArmatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("bianhua", "bianhua")
		if (this._effectArmature == null) {
			this._effectArmature = new DragonBonesArmature(effectArmatureDisplay)
		}
		this._effectArmature.ArmatureDisplay = effectArmatureDisplay
		this._effectArmatureContainer.register(this._effectArmature, ["bianhua"])
		this._effectArmatureContainer.scaleX = 1
		this._effectArmatureContainer.scaleY = 1
		this._effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this)

		this._gesture = new egret.Bitmap()
		this.addChild(this._gesture)
		this._gesture.scaleX = 0.55
		this._gesture.scaleY = 0.55
		// this._balloon.addEventListener(egret.Event.COMPLETE, this._OnBalloonComplete, this)
	}

	public Init(data:Array<any>, actor:BaseActor) {
		this._score = 0
		this._root = actor
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		this._isChangeEasy = false
		this.UpdateGesture(data, true)
	}

	public UpdateGesture(data:Array<any>, isInit:boolean = false) {
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
		data.splice(random, 1)

		// let colorIndex = MathUtils.getRandom(2)
		// this._animationName = this._animations[colorIndex]
		
		this._balloonArmatureContainer.play(this._animationName, 1)
		this._balloonArmatureContainer.pause(this._animationName)

		this.scaleX = 1
		this.scaleY = 1

		if (data.length <= 0) this._root.ResetGestureData()
	}

	public ChangeToEasy() {
		this._isChangeEasy = true
		this._type = 0
		this._effectArmatureContainer.play("bianhua", 1)
		// this.UpdateColorAndGesture()		
	}

	public UpdateColorAndGesture() {
		this._type = 0
		this._gesture.visible = false
		this._balloonArmatureContainer.play("explore", 1, 1, 0, 3)
	}

	public SetLine(count:number = 1, value:number = 0) {
		this._rop.x = this._balloonArmatureContainer.x
		this._rop.y = this._balloonArmatureContainer.y - 10
		this._rop.scaleX = 0.5
		if (count == 1) {
			this._rop.rotation = 0
			this._rop.scaleY = 15
		}
		else if (count == 2) {
			this._rop.scaleY = 16
			if (value == 0) {
				this._rop.rotation = -45
			}else{
				this._rop.rotation = 45
			}
		}
		else if (count == 3) {
			this._rop.scaleY = 25
			if (value == 0) {
				this._rop.rotation = 0
			}
			else if (value == 1) {
				this._rop.rotation = -60
			}else{
				this._rop.rotation = 60
			}
		}
	}

	public BossSetLine(count:number = 1, value:number = 0) {
		this._rop.x = this._balloonArmatureContainer.x
		this._rop.y = this._balloonArmatureContainer.y - 10
		this._rop.scaleX = 0.5
		if (count == 1) {
			this._rop.rotation = 0
			this._rop.scaleY = 40
		}
		else if (count == 2) {
			this._rop.scaleY = 60
			if (value == 0) {
				this._rop.rotation = -15
			}else{
				this._rop.rotation = 15
			}
		}
		else if (count == 3) {
			this._rop.scaleY = 40
			if (value == 0) {
				this._rop.rotation = 0
			}
			else if (value == 1) {
				this._rop.rotation = -30
			}else{
				this._rop.rotation = 30
			}
		}
	}

	public BalloonExplore(isGestureExplore:boolean = true) {
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		this._gesture.visible = false
		// this._balloon.play(1)
		this._balloonArmatureContainer.play(this._animationName, 1)
		let channel = GameVoice.ballonBoomSound.play(0, 1)
		channel.volume = GameConfig.soundValue / 100

		GameConfig.balloonScore += this._score
		// if (PanelManager.m_gameScenePanel != null) {
		// 	PanelManager.m_gameScenePanel.Score += this._score
		// }

		if (isGestureExplore) PanelManager.m_gameScenePanel.Boom = true

		if (this._root.Balloons != null && this._root.Balloons.length <= 0) {
			this._root.GotoDead()
		}
		// if (this._root.State == EMonsterState.Ready) {
		// 	let posY = this._root.y - 20
		// 	egret.Tween.get(this._root).to({y:posY}, 50)
		// }

		// egret.setTimeout(this._OnBalloonBoom, this, 200)
	}

	private _OnBalloonBoom() {
		// this._boomSound.play(0, 1)
	}


	public Destroy() {

	}

	public Update(delay:number) {

	}

	public get type() {
		return this._type
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

	public get Score():number {
		return this._score
	}

	private _OnBalloonComplete(e:egret.Event) {
		if (this._type == 0) {
			this.UpdateGesture(this._root.GestureData)
		}else{
			this._root.BalloonExploreHandle()
			GameObjectPool.getInstance().destroyObject(this)
			this._root.RemoveBalloon(this)
		}
		
	}

	private _OnEffectArmatureComplete(e:egret.Event) {
		this.UpdateGesture(this._root.GestureData)
	}

	private _gesture:egret.Bitmap
	private _type:number
	private _score:number
	private _rop:egret.Bitmap
	private _root:BaseActor
	// private _boomSound:egret.Sound

	private _balloonArmatureContainer:DragonBonesArmatureContainer
	private _balloonArmature:DragonBonesArmature

	private _effectArmatureContainer:DragonBonesArmatureContainer
	private _effectArmature:DragonBonesArmature

	private _animationName:string
	private _animations:Array<string>

	private _gestureData:Array<any>

	private _isChangeEasy:boolean
}