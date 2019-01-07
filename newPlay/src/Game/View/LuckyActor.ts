class LuckyActor extends BaseActor{
	public constructor() {
		super()

		this.m_balloon = new Balloon()
		this.m_groupBalloon.addChild(this.m_balloon)
	}

	public Init() {
		this.m_sumWeight = 0
		for (let i = 0; i < GameConfig.luckyConfig.length; i++) {
			this.m_sumWeight += GameConfig.luckyConfig[i].Prob
			GameConfig.luckyConfig[i].weight = this.m_sumWeight
		}

		this.m_data = this._RandomLuckyActorData()
		if (this.m_data) {
			this.InitData()
			this.InitGraph()
		}else{
			Error("no wolf data")
		}
	}

	public InitData() {
		let name = this.m_data.Animation
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this.m_armature == null) {
			this.m_armature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_armature.ArmatureDisplay = armatureDisplay
		this.m_armatureContainer.visible = true
		this.m_armatureContainer.register(this.m_armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
			DragonBonesAnimations.Explore,
		])
		
		this.m_state = EMonsterState.Ready
		this.m_speedY = 0
		this.m_speedX = 0.1

		this.m_armatureContainer.scaleX = this.m_data.Scale
		this.m_armatureContainer.scaleY = this.m_data.Scale
		this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this)

		this.m_rect.width = this.m_data.Width
		this.m_rect.height = this.m_data.Height
		this.m_width = this.m_data.Width
		this.m_height = this.m_data.Height

		this.m_gestureData.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			this.m_gestureData.push(GameConfig.gestureConfig[i])
		}
	}

	public InitGraph() {
		this.x = Config.stageWidth + this.m_width / 2
		this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200)

		this.GotoIdle()
		
		this.m_balloon.Init(this.m_gestureData, this)
		this._SetBallonPosition(this.m_balloon, 1, 0)
	}

	public GotoIdle() {
		this.m_state = EMonsterState.Ready
		this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public GotoHurt() {
		this.m_state = EMonsterState.Hurt
		this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 1)
	}

	public Destroy() {
		// this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		this.m_armatureContainer.clear()
		this.m_effectArmatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}

	public Update(timeElapsed:number) {
		if (this.m_state == EMonsterState.Ready) {
			this.x -= timeElapsed * this.m_speedX
			if (this.x <= -this.m_width / 2) {
				this.x = -this.m_width / 2
				this.m_state = EMonsterState.Dead
				this.Destroy()
				PanelManager.m_gameScenePanel.RemoveLuckyActor(this)
				// this.GotoRun()
			}
		}
	}

	public UpdateGesture() {
		this.m_balloon.UpdateColorAndGesture()
		let channel = GameVoice.ballonBoomSound.play(0, 1)
		channel.volume = GameConfig.soundValue / 100
		GameConfig.balloonScore += this.m_balloon.Score
		PanelManager.m_gameScenePanel.Boom = true
		this.GotoHurt()
	}

	public get ballon() {
		return this.m_balloon
	}

	private _OnArmatureComplete() {
		if (this.m_state == EMonsterState.Hurt) {
			this.GotoIdle()
		}
	}

	private _RandomLuckyActorData():any {
		let random = MathUtils.getRandom(1, this.m_sumWeight)
		for (let i = 0; i < GameConfig.luckyConfig.length; i++)
		{
			if (random <= GameConfig.luckyConfig[i].weight)
			{
				return GameConfig.luckyConfig[i]
			}
		}
		return null
	}

	private m_sumWeight:number
	
	private m_state:EMonsterState
	//////////////////////////////////////////////////////////////////
	private m_balloon:Balloon
	private m_score:number
}