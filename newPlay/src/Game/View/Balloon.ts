class Balloon extends egret.Sprite {
	public name = "Balloon"
	public constructor() {
		super()
		this._gestureData = new Array()

		this._balloonArmatureContainer = new DragonBonesArmatureContainer()
		this.addChild(this._balloonArmatureContainer)

		this._animations = ["hong", "huang", "lan"]
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("qiqiu", "qiqiu")
		if (this._balloonArmature == null) {
			this._balloonArmature = new DragonBonesArmature(armatureDisplay)
		}
		this._balloonArmature.ArmatureDisplay = armatureDisplay
		this._balloonArmatureContainer.register(this._balloonArmature, this._animations)

		this._balloonArmatureContainer.scaleX = 0.45
		this._balloonArmatureContainer.scaleY = 0.45

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
		this._rop = Common.createBitmap("imgRop_png")
		this.addChild(this._rop)
		this._gesture.scaleX = 0.5
		this._gesture.scaleY = 0.5
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
		this._gesture.x = this._balloonArmatureContainer.x - 3
		this._gesture.y = this._balloonArmatureContainer.y - 36
		this._gesture.visible = true
		this._type = data[random].type
		this._score = data[random].count
		data.splice(random, 1)

		let colorIndex = MathUtils.getRandom(2)
		this._animationName = this._animations[colorIndex]
		this._balloonArmatureContainer.play(this._animationName, 1)
		this._balloonArmatureContainer.pause(this._animationName)
	}

	public ChangeToEasy() {
		this._isChangeEasy = true
		this.UpdateColorAndGesture()		
	}

	public UpdateColorAndGesture() {
		this._type = 0
		this._effectArmatureContainer.play("bianhua", 1)
	}

	public SetLine(count:number = 1, value:number = 0) {
		this._rop.x = this._balloonArmatureContainer.x
		this._rop.y = this._balloonArmatureContainer.y
		this._rop.scaleX = 0.5
		if (count == 1) {
			this._rop.rotation = 0
			this._rop.scaleY = 10
		}
		else if (count == 2) {
			this._rop.scaleY = 14
			if (value == 0) {
				this._rop.rotation = -45
			}else{
				this._rop.rotation = 45
			}
		}
		else if (count == 3) {
			this._rop.scaleY = 20
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

	public BalloonExplore() {
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		this._gesture.visible = false
		// this._balloon.play(1)
		this._balloonArmatureContainer.play(this._animationName, 1)
		let channel = GameVoice.ballonBoomSound.play(0, 1)
		channel.volume = GameConfig.soundValue / 100

		if (PanelManager.m_gameScenePanel != null) {
			PanelManager.m_gameScenePanel.Score += this._score
		}

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
		this._root.BalloonExploreHandle()
		GameObjectPool.getInstance().destroyObject(this)
		this._root.RemoveBalloon(this)
	}

	private _OnEffectArmatureComplete(e:egret.Event) {
		// if (this._isChangeEasy) {
		// 	this._isChangeEasy = false
		// 	this._gestureData.length = 0
		// 	for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
		// 		let data = GameConfig.gestureConfig[i]
		// 		if (data.difficult == 1) {
		// 			this._gestureData.push(data)
		// 		}
		// 	}
		// 	this.UpdateGesture(this._gestureData)
		// }else{
		// 	this.UpdateGesture(this._root.GestureData)
		// }
		this.UpdateGesture(this._root.GestureData)
	}

	// private _ChangeBalloonAnimate(name:string) {
	// 	this._balloonData.mcDataSet = RES.getRes(name + "_json")
	// 	this._balloonData.texture = RES.getRes(name + "_png")
	// 	this._balloon.movieClipData = this._balloonData.generateMovieClipData(name)
	// }

	private _gesture:egret.Bitmap
	// private _balloonData:egret.MovieClipDataFactory
	// private _balloon:egret.MovieClip
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