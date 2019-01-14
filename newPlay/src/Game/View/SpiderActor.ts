class SpiderActor extends BaseActor {
	public constructor() {
		super()
		this.m_balloons = new Array()
	}

	public Init(data:any) {
		let monsterData = data.elite
		PanelManager.m_gameScenePanel.EliteCount += 1
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
				this.m_type = this.m_data.Difficult
				break
			}
		}
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
		this.m_effectArmatureContainer.visible = false
		this.m_armatureContainer.register(this.m_armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
			DragonBonesAnimations.Explore,
			DragonBonesAnimations.Arrive,
			DragonBonesAnimations.Attack,
			DragonBonesAnimations.ReadyFall,
			DragonBonesAnimations.Move,
		])
		
		this.m_state = EMonsterState.Arrive
		this.m_speedY = this.m_data.Speed / 100 * GameConfig.gameSpeedPercent
		this.m_spFall = 0.7
		this.m_speedX = 0.2

		this.m_armatureContainer.scaleX = this.m_data.Scale
		this.m_armatureContainer.scaleY = this.m_data.Scale
	
		this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this)
		this.m_armatureContainer.addFrameCallFunc(this._OnArmatureFrame, this)
		this.m_armatureContainer.visible = false
		this.m_rect.width = this.m_data.Width
		this.m_rect.height = this.m_data.Height
		this.m_width = this.m_data.Width
		this.m_height = this.m_data.Height

		this.m_gestureData.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			if (this.m_gesturDiff == EGestureDifficult.Mix) {
				this.m_gestureData.push(GameConfig.gestureConfig[i])
			}else{
				if (GameConfig.gestureConfig[i].difficult == this.m_gesturDiff) this.m_gestureData.push(GameConfig.gestureConfig[i])
			}
		}

		this.m_sumBalloon = 0
		this.m_summonWave = 0
		this.m_spitStage = 1
		this.m_sumonDelay = -1
	}

	public InitGraph() {
		this.y = Config.stageHalfHeight - 350
		this.x = Config.stageHalfWidth
		// this.filters = [this.m_dropShadowFilter]
		this.m_armatureContainer.visible = true
		this.GotoArrival()
		
	}

	public GotoArrival() {
		this.m_state = EMonsterState.Arrive
		
		// .volume = GameConfig.soundValue / 100
		this.m_armatureContainer.play(DragonBonesAnimations.Arrive, 1)

		let battleVolume = 0.8 * GameConfig.bgmValue / 100
		
		egret.Tween.get(GameVoice.battleBGMChannel).to({volume:0.2}, 500).call(()=>{
			// GameVoice.battleBGMChannel.volume = battleVolume
			let channel = GameVoice.spiderKingArrive.play(0, 1)
			channel.volume = 0
			egret.Tween.get(channel).to({volume:GameConfig.soundValue / 100}, 2000).call(()=>{
				egret.Tween.get(GameVoice.battleBGMChannel).to({volume:battleVolume}, 500)
			})
		})
	}

	public Summon(a_count:number = 2) {
		for (let i = 0; i < a_count; i++) {
			PanelManager.m_gameScenePanel.CreateSummonActor(this.m_summonData, this.x - 100, this.y - 400, a_count, i, true)
		}
	}

	public GotoIdle() {
		if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.Pause) {
			this.m_state = EMonsterState.Ready
			this.Summon()
			this.m_armatureContainer.play(DragonBonesAnimations.Idle, 1)
			PanelManager.m_gameScenePanel.PlaySpiderWebArmature("idle", 4)
		}
	}

	public GotoAttack() {
		if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.Pause) {
			this.m_state = EMonsterState.Attack
			this.m_isSpit = false
			this.m_armatureContainer.play(DragonBonesAnimations.Attack, 1)
			PanelManager.m_gameScenePanel.PlaySpiderWebArmature("attack", 3)
		}
		
	}

	public GotoSummonFinish() {
		if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.Pause) {
			this.m_state = EMonsterState.SummonFinish
			PanelManager.m_gameScenePanel.PlaySpiderWebArmature("dead", 5)
			// this.m_armatureContainer.play(DragonBonesAnimations.ReadyFall, 1)
		}
		
	}

	public GotoMove() {
		if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.Pause) {
			this.m_state = EMonsterState.Move
			this.m_sumonDelay = 0
			this.UpdateSignSlot()
			this.Summon(3)
			this.m_armatureContainer.play(DragonBonesAnimations.Move, 0)
		}
	}

	public GotoDead() {
		if (GameManager.Instance.GameState == EGameState.Start) {
			this.m_armatureContainer.play(DragonBonesAnimations.Dead, 1)
			this.m_state = EMonsterState.FallDown
			PanelManager.m_gameScenePanel.Power += this.m_data.Power
			// PanelManager.m_gameScenePanel.Score += this.m_data.Score
			GameManager.Instance.GameSlow()
		}
	}

	public GotoExplore() {}

	public GotoRun() {
		this._DestroyBalloon()
		this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
		GameManager.Instance.Stop()
	}

	public GotoFallWater() {
		this.m_effectArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("shuihua", "shuihua")
		if (this.m_effectArmature == null) {
			this.m_effectArmature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_effectArmature.ArmatureDisplay = armatureDisplay
		this.m_effectArmatureContainer.register(this.m_effectArmature,["shuihua"])
		this.m_effectArmatureContainer.scaleX = 1
		this.m_effectArmatureContainer.scaleY = 1
		this.m_effectArmatureContainer.visible = true
		this.m_effectArmatureContainer.play("shuihua", 1)
		ShakeTool.getInstance().shakeObj(PanelManager.m_gameScenePanel.MountBg, 2.3, 4, 6)
		this.m_effectArmatureContainer.addCompleteCallFunc(this._OnEffectArmatureComplete, this)
	}

	public GotoSlow() {

	}


	public BallExplosion(a_ball:Balloon) {
		if (this.y >= 100 && this.m_state == EMonsterState.Move) {
			this.m_exploreIndex = 0
			for (let i = 0; i < this.m_balloons.length; i++) {
				let balloon:Balloon = this.m_balloons[i]
				if (balloon == a_ball) {
					this.m_balloons.splice(i, 1)
					balloon.BalloonExplore()
					this.m_exploreIndex = i
					break
				}
			}
		}
	}

	public UpdateSignSlot() {
		this._DestroyBalloon()
		this.m_sumBalloon = MathUtils.getRandom(this.m_balloonMin, this.m_balloonMax)

		for (let i = 0; i < this.m_sumBalloon; i++) {
			let balloon:Balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon")
			balloon.Init(this.m_gestureData, this)
			balloon.scaleX = 1.2
			balloon.scaleY = 1.2
			this._SetBallonPosition(balloon, this.m_sumBalloon, i)
			this.m_groupBalloon.addChild(balloon)
			this.m_score += balloon.Score
			this.m_balloons.push(balloon)
		}
	}

	protected _SetBallonPosition(balloon:Balloon, count:number, value:number = 0) {
		if (count == 1) {
			balloon.x = 0
			balloon.y = -this.m_rect.height * 1.1
			balloon.BossSetLine()
		}
		else if (count == 2) {
			balloon.x = value * (balloon.width + 100) - 100
			balloon.y = -this.m_rect.height * 1.1
			balloon.BossSetLine(count, value)
		}
		else if (count == 3) {
			if (value == 0) {
				balloon.x = 0
				balloon.y = -this.m_rect.height * 1.1
			}else{
				balloon.x = (value - 1) * (balloon.width + 120) - 100
				balloon.y = -this.m_rect.height
			}
			balloon.BossSetLine(count, value)
		}
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

	public get ActorTableData() {
		return this.m_data
	}

	public Update(timeElapsed:number) {
		if (this.m_state == EMonsterState.Move) {
			this.y += timeElapsed * this.m_speedY
			if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
				this.y = PanelManager.m_gameScenePanel.GroundPos
				this.m_state = EMonsterState.Run
				this.GotoRun()
			}

			if (this.m_sumonDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
				this.m_sumonDelay += timeElapsed
				if (this.m_sumonDelay >= GameConfig.spiderDelay) {
					this.m_sumonDelay = 0
					this.Summon()
				}
			}
		}
		else if (this.m_state == EMonsterState.FallDown) {
			this.y += timeElapsed * this.m_spFall
			if (this.y >= PanelManager.m_gameScenePanel.WaterPos) {
				this.y = PanelManager.m_gameScenePanel.WaterPos
				this.m_state = EMonsterState.Drown
				this.m_armatureContainer.visible = false
				GameVoice.fallDownWaterSound.play(0, 1)
				this.GotoFallWater()
			}
		}
	}

	public Destroy() {
		this._DestroyBalloon()
		this.m_armatureContainer.clear()
		this.m_effectArmatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}

	public BalloonExploreHandle() {

	}

	public RemoveBalloon(balloon:Balloon) {

	}

	public PlayEffect() {}

	private _OnEffectArmatureComplete() {
		if (this.m_state == EMonsterState.Stop || this.m_state == EMonsterState.Drown) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveSpiderActor(this)
		}
	}

	private _OnArmatureComplete() {
		switch (this.m_state) {
			case EMonsterState.Arrive:
				this.GotoAttack()
				// PanelManager.m_gameScenePanel.PlaySpiderWebArmature("arrive2", 2)
			break
			case EMonsterState.Ready:
				this.GotoAttack()
			break
			case EMonsterState.Attack:
				if (this.m_summonWave >= 6) {
					this.GotoSummonFinish()
				}else{
					this.m_spitStage++
					if (this.m_spitStage > 3) this.m_spitStage = 1
					this.GotoIdle()
				}
			break
			case EMonsterState.Move:
				// this.m_armatureContainer.play(DragonBonesAnimations.ReadyFall, 1, 2, 35)
			break
			case EMonsterState.FallDown:
				
			break
		}
		
	}

	private _OnArmatureFrame(event:dragonBones.EgretEvent) {
		let evt:string = event.frameLabel
		let posX:number = 0
		let posY:number = 0
		switch (evt) {
			case "summon1":
				this.m_isSpit = true
				posX = this.x
				posY = this.y + 200
			break
			case "summon2":
				this.m_isSpit = true
				posX = this.x - 100
				posY = this.y + 200
			break
			case "summon3":
				this.m_isSpit = true
				posX = this.x + 100
				posY = this.y + 200
			break
			case "readyFall":
				// this.GotoMove()
			break
		}

		if (this.m_isSpit) {
			this.m_isSpit = false
			this.m_summonWave++
			let count = MathUtils.getRandom(1, 2)
			let data = {"id":1003, "diff":1, "ids":[], "count":2}
			for (let i = 0; i < count; i++) {
				egret.setTimeout(this._Spide, this, i*400, data, posX, posY, count, i)
			} 
		}
	}

	private _Spide(data, posX, posY, count, i) {
		PanelManager.m_gameScenePanel.CreateSummonActor(data, posX, posY, count, i)
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
	private m_isSpit:boolean
	private m_spitStage:number
	private m_summonWave:number
	private m_sumonDelay:number
	private m_exploreIndex:number
	//////////////////////////////////////////////////////////////////
	private m_sumBalloon:number
	private m_score:number
	private m_summonData:any
}