class Balloon extends egret.Sprite {
	public name = "Balloon"
	public constructor() {
		super()
		let data = RES.getRes("balloonBlue_json")
        let texture = RES.getRes("balloonBlue_png")
		this._balloonData = new egret.MovieClipDataFactory(data, texture)
        this._balloon = new egret.MovieClip(this._balloonData.generateMovieClipData("balloonBlue"))
		// this._balloon = Common.createBitmap("balloon_png")
		this.addChild(this._balloon)
		this._balloon.anchorOffsetX = this._balloon.width / 2
		this._balloon.anchorOffsetY = this._balloon.height / 2
		this._gesture = new egret.Bitmap()
		this.addChild(this._gesture)
		this._rop = Common.createBitmap("imgRop_png")
		this.addChild(this._rop)

		// this._boomSound = RES.getRes("balloonBoom_mp3")
		// this._boomSound.load(AudioManager.balloonBoom)

		this._balloon.addEventListener(egret.Event.COMPLETE, this._OnBalloonComplete, this)
	}

	public Init(data:Array<any>, actor:Monster) {
		this._score = 0
		this._root = actor
		this._rop.scaleX = 0
		this._rop.scaleY = 0
		let random = MathUtils.getRandom(data.length - 1)
		this._ChangeBalloonAnimate(data[random].balloon)
		this._balloon.gotoAndStop(1)
		this._balloon.anchorOffsetY = this._balloon.height
		this._balloon.x = -20
		this._gesture.texture = RES.getRes(data[random].path)
		this._gesture.anchorOffsetX = this._gesture.width / 2
		this._gesture.anchorOffsetY = this._gesture.height / 2
		this._gesture.x = 8
		this._gesture.visible = true
		this._type = data[random].type
		this._score = data[random].count
		this.anchorOffsetY = this.height

		data.splice(random, 1)
	}

	public SetLine(count:number = 1, value:number = 0) {
		this._rop.x = this._balloon.x + 30
		this._rop.y = this._balloon.y + this._balloon.height / 2
		this._rop.scaleX = 2
		if (count == 1) {
			this._rop.rotation = 0
			this._rop.scaleY = 40
		}
		else if (count == 2) {
			this._rop.scaleY = 55
			if (value == 0) {
				this._rop.rotation = -45
			}else{
				this._rop.rotation = 45
			}
		}
		else if (count == 3) {
			this._rop.scaleY = 60
			if (value == 0) {
				this._rop.rotation = 0
				this._rop.scaleY = 90
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
		this._balloon.play(1)
		
		// if (this._root.State == EWolfState.Ready) {
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
		return this._balloon.width
	}

	public get root():Monster {
		return this._root
	}

	public get Score():number {
		return this._score
	}

	private _OnBalloonComplete(e:egret.Event) {
		// this._root.BalloonExploreHandle()
		// GameObjectPool.getInstance().destroyObject(this)
		// this._root.removeChild(this)
	}

	private _ChangeBalloonAnimate(name:string) {
		this._balloonData.mcDataSet = RES.getRes(name + "_json")
		this._balloonData.texture = RES.getRes(name + "_png")
		this._balloon.movieClipData = this._balloonData.generateMovieClipData(name)
	}

	private _gesture:egret.Bitmap
	private _balloonData:egret.MovieClipDataFactory
	private _balloon:egret.MovieClip
	private _type:number
	private _score:number
	private _rop:egret.Bitmap
	private _root:Monster
	// private _boomSound:egret.Sound
}