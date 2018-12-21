class Monster extends BaseActor {
	public constructor() {
		super()

		this.m_gesture = Common.createBitmap("gestureSheet_json.gesture001")
	}

	public Init() {
		this.m_sumWeight = 0
		for (let i = 0; i < GameConfig.monsterConfig.length; i++) {
			this.m_sumWeight += GameConfig.monsterConfig[i].Prob
			GameConfig.monsterConfig[i].weight = this.m_sumWeight
		}
		this.m_data = this._RandomMonsterData()
		if (this.m_data) {
			this.InitData()
			this.InitGraph()
		}else{
			Error("no wolf data")
		}
	}

	public InitData() {
		let name = this.m_data.Animation
		let armature = DragonBonesFactory.getInstance().buildArmature(name, name)
		let clock = DragonBonesFactory.getInstance().createWorldClock(10.0)
		if (this.m_armature == null) {
			this.m_armature = new DragonBonesArmature(armature, clock)
		}
		this.m_armature.Armature = armature
		this.m_armature.Clock = clock
		// this.m_armatureContainer.scaleX = 0.5
		// this.m_armatureContainer.scaleY = 0.5

		this.m_armatureContainer.register(this.m_armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
		])
		this.m_state = EMonsterState.Ready
		this.m_speedY = GameConfig.baseFallSpeed + this.m_data.Speed / 100
		this.m_speedX = 0.2

		this.m_gestureData.length = 0

		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			this.m_gestureData.push(GameConfig.gestureConfig[i])
		}
	}

	public InitGraph() {
		this.y = 0

		this.filters = [this.m_dropShadowFilter]

		this.UpdateSignSlot()

		this.GotoIdle()

		this.x = MathUtils.getRandom(this.m_armatureContainer.width/2, Config.stageWidth - this.m_armatureContainer.width/2)
	}

	public GotoIdle() {
		this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public GotoHurt() {
		if (this.m_type != EMonsterType.Normal) {
			this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0)
		}
	}

	public GotoDead() {
		if (this.y >= 100) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveMonster(this)

			PanelManager.m_gameScenePanel.Power += this.m_data.Power
		}
		// if (this.m_type != EMonsterType.Normal) {
		// 	this.m_armatureContainer.play(DragonBonesAnimations.Dead, 0)
		// }
	}

	public GotoRun() {
		this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
	}

	public Update(timeElapsed:number) {
		if (this.m_state == EMonsterState.Ready) {
			this.y += timeElapsed * this.m_speedY
			if (this.y >= Config.stageHeight - 120) {
				this.y = Config.stageHeight - 120
				this.m_state = EMonsterState.Run
				this.GotoRun()
			}
		}
		else if (this.m_state == EMonsterState.Run) {
			this.x -= timeElapsed * this.m_speedX
			if (this.x <= -this.m_armatureContainer.width) {
				this.m_state = EMonsterState.Dead
				this.Destroy()
				PanelManager.m_gameScenePanel.RemoveMonster(this)
				// this.Destroy()
				// PanelManager.gamePanel.RemoveWolf(this)
			}
		}
	}

	public Destroy() {
		this.m_armatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}


	/**
	 * 更新符号槽位
	 */
	public UpdateSignSlot() {

		let random = MathUtils.getRandom(this.m_gestureData.length - 1)

		let slot = this.m_armature.Armature.getSlot("Sign")
        this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path)
		this.m_gesture.x = slot.display.x;
        this.m_gesture.y = slot.display.y;
        this.m_gesture.anchorOffsetX = this.m_gesture.width/2;
        this.m_gesture.anchorOffsetY = this.m_gesture.height/2;
		slot.setDisplay(this.m_gesture)

		this.m_gestureType = this.m_gestureData[random].type
	}

	public get GestureType() {
		return this.m_gestureType
	}

	public set GestureType(value:number) {
		this.m_gestureType = value
	}

	private _RandomMonsterData():any {
		let random = MathUtils.getRandom(1, this.m_sumWeight)
		for (let i = 0; i < GameConfig.monsterConfig.length; i++)
		{
			if (random <= GameConfig.monsterConfig[i].weight)
			{
				return GameConfig.monsterConfig[i]
			}
		}
		return null
	}

	private m_sumWeight:number
	private m_data:any
	private m_state:EMonsterState
	private m_speedY:number
	private m_speedX:number

	//////////////////////////////////////////////////////////////////
	private m_gesture:egret.Bitmap
	private m_gestureType:number
}