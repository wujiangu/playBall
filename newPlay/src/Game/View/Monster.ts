class Monster extends BaseActor {
	public constructor() {
		super()
		this.m_balloons = new Array()
	}

	public Init(data:any, type:ELevelType) {
		let monsterData = null
		switch (type) {
			case ELevelType.Normal:
				monsterData = data.normal
			break
			case ELevelType.Elite:
				monsterData = data.elite
				PanelManager.m_gameScenePanel.EliteCount += 1
			break
		}
		this.m_sumWeight = 0
		for (let i = 0; i < monsterData.length; i++) {
			this.m_sumWeight += monsterData[i].prob
			monsterData[i].weight = this.m_sumWeight
		}
		let random = MathUtils.getRandom(1, this.m_sumWeight)
		for (let i = 0; i < monsterData.length; i++) {
			if (random <= monsterData[i].weight) {
				this.m_gesturDiff = monsterData[i].diff
				this.m_balloonMin = monsterData[i].min
				this.m_balloonMax = monsterData[i].max
				this.m_summonData = monsterData[i].summon
				this.m_data = GameConfig.monsterTable[monsterData[i].id.toString()]
				break
			}
		}
		// this.m_data = this._RandomMonsterData()
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
		this.m_effectArmatureContainer.visible = false
		this.m_armatureContainer.register(this.m_armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
			DragonBonesAnimations.Explore,
		])
		
		this.m_state = EMonsterState.Ready
		this.m_speedY = this.m_data.Speed / 100
		this.m_speedX = 0.2

		this.m_armatureContainer.scaleX = this.m_data.Scale
		this.m_armatureContainer.scaleY = this.m_data.Scale

		this.m_armatureContainer.addFrameCallFunc(this._OnArmatureFrame, this)

		this.m_rect.width = this.m_data.Width
		this.m_rect.height = this.m_data.Height
		this.m_width = this.m_data.Width
		this.m_height = this.m_data.Height

		this.m_slowDelay = -1

		this.m_gestureData.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (this.m_gesturDiff == EGestureDifficult.Mix) {
				this.m_gestureData.push(GameConfig.gestureConfig[i])
			}else{
				if (GameConfig.gestureConfig[i].difficult == this.m_gesturDiff) this.m_gestureData.push(GameConfig.gestureConfig[i])
			}
		}

		this.m_sumBalloon = 0
	}

	public InitGraph() {
		this.y = 0

		// this.filters = [this.m_dropShadowFilter]

		this.GotoIdle()
		this.UpdateSignSlot()

		this.x = MathUtils.getRandom(this.m_rect.width, Config.stageWidth - this.m_rect.width)
	}

	public GotoIdle() {
		if (this.m_data.ID == 1002) {
			this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0, 1, 1, 0.5)
		}else{
			this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
		}
	}

	public GotoHurt() {
		if (this.m_type != EMonsterType.Normal) {
			this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0)
		}
	}

	public GotoDead() {
		this.m_armatureContainer.play(DragonBonesAnimations.Dead, 1)
		this.m_state = EMonsterState.Dead
		this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this)
		PanelManager.m_gameScenePanel.Power += this.m_data.Power
		PanelManager.m_gameScenePanel.Score += this.m_data.Score
	}

	public GotoRun() {
		this._DestroyBalloon()
		this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
		GameManager.Instance.Stop()
	}

	public GotoSlow() {
		
	}

	public ChangeToEasy() {
		this.m_gestureData.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			let data = GameConfig.gestureConfig[i]
			if (data.difficult == 1) {
				this.m_gestureData.push(data)
			}
		}
		for (let i = 0; i < this.m_balloons.length; i++) {
			this.m_balloons[i].ChangeToEasy()
		}
	}

	/**
	 * 更新怪物身上的特效动画
	 */
	public UpdateEffectArmature(data:any) {
		this.m_effectArmatureContainer.clear()
		if (data.bullet != "") {
			let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.step1, data.step1)
			if (this.m_effectArmature == null) {
				this.m_effectArmature = new DragonBonesArmature(armatureDisplay)
			}
			this.m_effectData = data
			this.m_effectArmature.ArmatureDisplay = armatureDisplay
			this.m_effectArmatureContainer.register(this.m_effectArmature,[data.step1])
			this.m_effectArmatureContainer.visible = false
			this.m_effectArmatureContainer.scaleX = 0.8
			this.m_effectArmatureContainer.scaleY = 0.8
			this.m_effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this)
			this.m_effectArmatureContainer.addFrameCallFunc(this._OnEffectFrame, this)
		}
	}

	public PlayEffect() {
		this.m_effectArmatureContainer.visible = true
		this.m_effectArmatureContainer.play(this.m_effectData.step1, 1)
		
		if (this.m_effectData.type == EEffectType.Fire) {
			this.m_state = EMonsterState.Stop
		}
	}

	public BallExplosion(a_ball:Balloon) {
		if (this.y >= 100 && this.m_state == EMonsterState.Ready) {
			this.m_exploreIndex = 0
			for (let i = 0; i < this.m_balloons.length; i++) {
				let balloon:Balloon = this.m_balloons[i]
				if (balloon == a_ball) {
					this.m_balloons.splice(i, 1)
					balloon.BalloonExplore()
					this.m_exploreIndex = i
					if (this.m_balloons.length <= 0) {
						this.m_state = EMonsterState.Dead
					}
					break
				}
			}
		}
	}

	public AllBalloonExplosion() {
		while(this.m_balloons.length > 0) {
			let balloon:Balloon = this.m_balloons.pop()
			balloon.BalloonExplore()
		}
	}

	public RemoveBalloon(a_ball:Balloon) {
		this.m_groupBalloon.removeChild(a_ball)
	}

	public BalloonExploreHandle() {
		if (this.m_balloons.length <= 0) {
			this.m_sumBalloon = 0
			// this.GotoDead()
		}else{
			if (this.m_sumBalloon == 2 && this.m_balloons.length > 0) {
				let balloon:Balloon = this.m_balloons[0]
				let posx = 0
				egret.Tween.get(balloon).to({x:posx}, 200, egret.Ease.circOut)
				egret.Tween.get(balloon.rop).to({scaleY:20, rotation:0}, 200, egret.Ease.circOut)
				this.m_sumBalloon = 1
			}

			if (this.m_sumBalloon == 3 && this.m_balloons.length > 0) {
				this.m_sumBalloon = 2
				if (this.m_exploreIndex == 2) {
					this.m_balloons.reverse()
				}
				for (let i = 0; i < this.m_balloons.length; i++) {
					let balloon:Balloon = this.m_balloons[i]
					let posX = i * (balloon.width+5) - this.m_rect.width / 2
					let posY = -this.m_rect.height * 1.1
					let rotation = 90 * i - 45
					egret.Tween.get(balloon).to({x:posX, y:posY}, 200, egret.Ease.circOut)
					egret.Tween.get(balloon.rop).to({scaleY:14, rotation:rotation}, 200, egret.Ease.circOut)
				}
			}
		}
	}

	public Update(timeElapsed:number) {
		if (this.m_state == EMonsterState.Ready) {
			this.y += timeElapsed * this.m_speedY
			if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
				this.y = PanelManager.m_gameScenePanel.GroundPos
				this.m_state = EMonsterState.Run
				this.GotoRun()
			}
		}
	}

	public Destroy() {
		this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		this._DestroyBalloon()
		this.m_armatureContainer.clear()
		this.m_effectArmatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}


	/**
	 * 更新符号槽位
	 */
	public UpdateSignSlot() {
		this._DestroyBalloon()
		this.m_sumBalloon = MathUtils.getRandom(this.m_balloonMin, this.m_balloonMax)

		for (let i = 0; i < this.m_sumBalloon; i++) {
			let balloon:Balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon")
			balloon.Init(this.m_gestureData, this)
			this._SetBallonPosition(balloon, this.m_sumBalloon, i)
			this.m_groupBalloon.addChild(balloon)
			this.m_score += balloon.Score
			this.m_balloons.push(balloon)
		}
	}

	public get State() {
		return this.m_state
	}

	public get Score() {
		return this.m_score
	}

	public set Score(value:number) {
		this.m_score = value
	}

	public get Balloons() {
		return this.m_balloons
	}

	private _OnEffectFrame(event:dragonBones.EgretEvent) {
		let evt:string = event.frameLabel
		switch (evt) {
			case "xiaoshi":
				PanelManager.m_gameScenePanel.Power += this.m_data.Power
				this._DestroyBalloon()
				this.m_armatureContainer.visible = false
			break
		}
	}

	private _OnEffectArmatureComplete() {
		if (this.m_state == EMonsterState.Stop) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveMonster(this)
		}
	}

	private _OnArmatureFrame(event:dragonBones.EgretEvent) {
		let evt:string = event.frameLabel
		switch (evt) {
			case "vomit":
				if (GameManager.Instance.GameState == EGameState.Start && this.m_summonData != undefined) {
					PanelManager.m_gameScenePanel.CreateSummonActor(this.m_summonData, this.x, this.y)
				}
			break
		}
	}

	private _OnArmatureComplet() {
		if (this.m_state == EMonsterState.Dead) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveMonster(this)
		}
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

	private _DestroyBalloon() {
		this.m_sumBalloon = 0
		while(this.m_balloons.length > 0) {
			let balloon:Balloon = this.m_balloons.pop()
			GameObjectPool.getInstance().destroyObject(balloon)
			this.m_groupBalloon.removeChild(balloon)
		}
	}

	private m_sumWeight:number
	private m_state:EMonsterState
	//////////////////////////////////////////////////////////////////
	private m_sumBalloon:number
	private m_score:number
	private m_exploreIndex:number

	private m_summonData:any
}