class LuckyActor extends BaseActor{
	public constructor() {
		super()

		this._balloon = new Balloon()
		this._groupBalloon.addChild(this._balloon)
	}

	public init(x:number = null, y:number = null) {
		this._sumWeight = 0
		for (let i = 0; i < GameConfig.luckyConfig.length; i++) {
			this._sumWeight += GameConfig.luckyConfig[i].Prob
			GameConfig.luckyConfig[i].weight = this._sumWeight
		}

		this._data = this._randomLuckyActorData()
		if (this._data) {
			this.initData()
			this.initGraph(x, y)
		}else{
			Error("no wolf data")
		}
	}

	public initData() {
		let name = this._data.Animation
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this._armature == null) {
			this._armature = new DragonBonesArmature(armatureDisplay)
		}
		this._armature.ArmatureDisplay = armatureDisplay
		this._armatureContainer.visible = true
		this._armatureContainer.register(this._armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
			DragonBonesAnimations.Explore,
		])
		
		this._state = EMonsterState.Ready
		this._speedY = 0
		this._speedX = this._data.Speed / 10

		this._armatureContainer.scaleX = this._data.Scale
		this._armatureContainer.scaleY = this._data.Scale
		this._armatureContainer.addCompleteCallFunc(this._onArmatureComplete, this)

		this._rect.width = this._data.Width
		this._rect.height = this._data.Height
		this._width = this._data.Width
		this._height = this._data.Height

		this.resetGestureData()
	}

	public resetGestureData() {
		this._gestureData.length = 0
		for (let i = 0; i < this._data.balloon.length; i++) {
			let id = this._data.balloon[i]
			if (this._data.balloon.length == 1) id = id.toString()
			this._gestureData.push(GameConfig.gestureTable[id])
		}
	}

	public initGraph(x:number, y:number) {
		this.x = Config.stageWidth + this._width / 2
		this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200)
		if (x != null && y != null) {
			this.x = x
			this.y = y
		}

		this.gotoIdle()
		
		this._balloon.init(this._gestureData, this)
		this._setBallonPosition(this._balloon, 1, 0)
	}

	public gotoIdle() {
		this._speedX = 0.16 * 1.3
		this._state = EMonsterState.Ready
		this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public gotoHurt() {
		// this._state = EMonsterState.Hurt
		this._speedX = 0.05
		this._armatureContainer.play(DragonBonesAnimations.Hurt, 1)
	}

	public destroy() {
		// this._armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		this._armatureContainer.clear()
		this._effectArmatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}

	public update(timeElapsed:number) {
		if (this._state == EMonsterState.Ready) {
			this.x -= timeElapsed * this._speedX
			if (this.x <= -this._width / 2) {
				this.x = -this._width / 2
				this._state = EMonsterState.Dead
				this.destroy()
				PanelManager.gameScenePanel.removeLuckyActor(this)
				// this.gotoRun()
			}
		}
	}

	public updateGesture() {
		// if (this._state == EMonsterState.Ready) {
			this._balloon.updateColorAndGesture()
			let channel = GameVoice.ballonBoomSound.play(0, 1)
			channel.volume = GameConfig.soundValue / 100
			GameConfig.balloonScore += this._balloon.score
			PanelManager.gameScenePanel.boom = true
			this.gotoHurt()
		// }
		
	}

	public get ballon() {
		return this._balloon
	}

	private _onArmatureComplete() {
		// if (this._state == EMonsterState.Hurt) {
			this.gotoIdle()
		// }
	}

	private _randomLuckyActorData():any {
		let random = MathUtils.getRandom(1, this._sumWeight)
		for (let i = 0; i < GameConfig.luckyConfig.length; i++)
		{
			if (random <= GameConfig.luckyConfig[i].weight)
			{
				return GameConfig.luckyConfig[i]
			}
		}
		return null
	}

	private _sumWeight:number
	//////////////////////////////////////////////////////////////////
	private _balloon:Balloon
	private _score:number
}