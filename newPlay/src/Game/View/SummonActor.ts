class SummonActor extends BaseActor {
	public constructor() {
		super()

		this.m_balloon = new Balloon()
		this.m_groupBalloon.addChild(this.m_balloon)

		this.m_gesture = new egret.Bitmap()
		this.addChild(this.m_gesture)
		this.m_gesture.scaleX = 0.55
		this.m_gesture.scaleY = 0.55
	}

	public Init(a_data:any, a_x:number, a_y:number, beginX:number, beginY:number, a_count:number = 0, a_num:number = 0, a_isBoss:boolean = false) {
		this.m_sumWeight = 0
		// for (let i = 0; i < GameConfig.luckyConfig.length; i++) {
		// 	this.m_sumWeight += GameConfig.luckyConfig[i].Prob
		// 	GameConfig.luckyConfig[i].weight = this.m_sumWeight
		// }

		// this.m_data = this._RandomSummonActorData()

		this.m_data = GameConfig.summonTable[a_data.id.toString()]
		this._animations = this.m_data.Actions
		this.m_gesturDiff = a_data.diff
		this.m_gestureData.length = 0
		if (a_data.ids != undefined && a_data.ids.length > 0) {
			for (let i = 0; i < a_data.ids.length; i++) {
				let id = a_data.ids[i]
				for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
					if (GameConfig.gestureConfig[i].type == id) {
						this.m_gestureData.push(GameConfig.gestureConfig[i])
					}
				}
			}
		}else{
			for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
				if (this.m_gesturDiff == EGestureDifficult.Mix) {
					this.m_gestureData.push(GameConfig.gestureConfig[i])
				}else{
					if (GameConfig.gestureConfig[i].difficult == this.m_gesturDiff) this.m_gestureData.push(GameConfig.gestureConfig[i])
				}
			}
		}
		
		if (this.m_data) {
			this.InitData()
			this.InitGraph()
			this.m_endX = Math.max(a_x, this.m_rect.width)
			this.m_endX = Math.min(a_x, Config.stageWidth - this.m_rect.width)
			// if (a_x > 0) this.m_endX = a_x + this.m_rect.width
			// if (a_x <= 0) this.m_endX = a_x - this.m_rect.width
			this.m_endY = beginY
			if (this.m_data.Type == ESummonType.Balloon) {
				this.x = beginX
				this.y = beginY
			}
			else if (this.m_data.Type == ESummonType.Monster) {

				if (a_count == 1) this.x = beginX
				else if (a_count == 2) {
					this.x = beginX - (-2 * a_num + 1) * 60
					if (a_isBoss) this.x = beginX - (-2 * a_num + 1) * 400
					this.x = Math.max(this.x, this.m_rect.width)
					this.x = Math.min(this.x, Config.stageWidth - this.m_rect.width)
				}
				else if (a_count == 3) {
					this.x = beginX - (-a_num + 1) * 120
					if (a_isBoss) this.x = Config.stageHalfWidth - (-a_num + 1) * 500
					this.x = Math.max(this.x, this.m_rect.width)
					this.x = Math.min(this.x, Config.stageWidth - this.m_rect.width)
				}
				else if (a_count == 4) {
					this.x = beginX + (2 * a_num - 3) * 60
					if (a_isBoss) this.x = Config.stageHalfWidth - (-a_num + 1) * 500
					this.x = Math.max(this.x, this.m_rect.width)
					this.x = Math.min(this.x, Config.stageWidth - this.m_rect.width)
				}
				else if (a_count == 5) {
					this.x = beginX - (a_num - 2) * 120
					if (a_isBoss) this.x = Config.stageHalfWidth - (-a_num + 1) * 500
					this.x = Math.max(this.x, this.m_rect.width)
					this.x = Math.min(this.x, Config.stageWidth - this.m_rect.width)
				}
				
				this.y = beginY
			}
        	// Common.log("位置", this.m_endX, this.m_endY)
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
		this.m_armatureContainer.register(this.m_armature, this._animations)
		
		this.m_state = EMonsterState.Ready
		this.m_addNum = 0
		this.m_speedY = this.m_data.Speed / 100 * GameConfig.gameSpeedPercent
		this.m_baseSpeedY = this.m_speedY
		this.m_speedX = 0.1

		this.m_armatureContainer.scaleX = this.m_data.Scale
		this.m_armatureContainer.scaleY = this.m_data.Scale

		this.m_rect.width = this.m_data.Width
		this.m_rect.height = this.m_data.Height
		this.m_width = this.m_data.Width
		this.m_height = this.m_data.Height

		// this.m_gestureData.length = 0
		// for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
		// 	this.m_gestureData.push(GameConfig.gestureConfig[i])
		// }
	}

	public InitGraph() {
		this.x = Config.stageWidth + this.m_width / 2
		this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200)

		this.m_gesture.visible = false
		this.m_groupBalloon.visible = false
		this.m_armatureContainer.visible = true
		if (this.m_data.Type == ESummonType.Balloon) {
			this.m_isArrive = false
			this.UpdateGesture()
			// let colorIndex = MathUtils.getRandom(this._animations.length - 1)
			// this._animationName = this._animations[colorIndex]
			this.m_armatureContainer.play(this._animationName, 1)
			this.m_armatureContainer.pause(this._animationName)
		}
		else if (this.m_data.Type == ESummonType.Monster) {
			this.m_isArrive = true
			this.m_balloon.Init(this.m_gestureData, this)
			this._SetBallonPosition(this.m_balloon, 1, 0)
			// this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
			this._animationName = DragonBonesAnimations.Dead
			this.m_gestureType = this.m_balloon.type

			this.m_state = EMonsterState.Summon
			this.m_armatureContainer.play(DragonBonesAnimations.Arrive, 1, 1, 0, 3)

			this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this)
			// this.x = MathUtils.getRandom(this.m_rect.width, Config.stageWidth - this.m_rect.width)
			// this.y = MathUtils.getRandom(200, PanelManager.m_gameScenePanel.GroundPos - 200)
		}
	}

	public UpdateGesture() {
		let random = MathUtils.getRandom(this.m_gestureData.length - 1)
		this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path)
		this.m_gesture.anchorOffsetX = this.m_gesture.width / 2
		this.m_gesture.anchorOffsetY = this.m_gesture.height / 2
		this.m_gesture.x = this.m_armatureContainer.x + 1
		this.m_gesture.y = this.m_armatureContainer.y - 38
		this.m_gesture.visible = true
		this.m_gestureType = this.m_gestureData[random].type
		this.m_score = this.m_gestureData[random].count
		this._animationName = this.m_gestureData[random].balloon
		this.m_gestureData.splice(random, 1)
	}

	public GotoIdle() {
		// this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public GotoRun() {
		// this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
		GameManager.Instance.Stop()
	}

	public GotoExplore() {
		if (this.m_state == EMonsterState.Ready && this.y >= 100) {
			this.m_gesture.visible = false
			this.m_armatureContainer.play(this._animationName, 1)
			this.m_state = EMonsterState.Dead
			this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this)
			PanelManager.m_gameScenePanel.Power += this.m_data.Power
			// if (PanelManager.m_gameScenePanel.LevelStage == ELevelType.Normal) {
			// 	PanelManager.m_gameScenePanel.Score += this.m_score
			// }
			if (this.m_data.Type == ESummonType.Balloon) {
				GameConfig.balloonScore += this.m_score
				PanelManager.m_gameScenePanel.Boom = true
				let channel = GameVoice.ballonBoomSound.play(0, 1)
				channel.volume = GameConfig.soundValue / 100
			}
			else if (this.m_data.Type == ESummonType.Monster) {
				this.m_balloon.BalloonExplore()
			}
		}
	}

	public Destroy() {
		// this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		this.m_armatureContainer.clear()
		this.m_armatureContainer.visible = false
		GameObjectPool.getInstance().destroyObject(this)
	}

	public Update(timeElapsed:number) {
		if (this.m_state == EMonsterState.Ready) {
			if (this.m_isArrive) {
				this.y += timeElapsed * this.m_speedY
				if (this.y >= PanelManager.m_gameScenePanel.GroundPos) {
					this.y = PanelManager.m_gameScenePanel.GroundPos
					this.m_state = EMonsterState.Run
					this.GotoRun()
				}
			}else{
				let distance:number = MathUtils.getDistance(this.m_endX, this.m_endY, this.x, this.y)
				if (distance <= 10) {
					this.m_isArrive = true
					return
				}
				let radian = MathUtils.getRadian2(this.x, this.y, this.m_endX, this.m_endY)
				let speed = timeElapsed / 2
				let tempX:number = Math.cos(radian) * speed
				let tempY:number = Math.sin(radian) * speed
				let deltaX = parseFloat(tempX.toFixed(2))
				let deltaY = parseFloat(tempY.toFixed(2))
				this.x += deltaX
				this.y += deltaY
			}
		}
	}

	public get GestureType() {
		return this.m_gestureType
	}

	public get State() {
		return this.m_state
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
		}
	}

	public PlayEffect() {
		this.m_effectArmatureContainer.visible = true
		this.m_effectArmatureContainer.play(this.m_effectData.step1, 1)
		if (this.m_effectData.type == EEffectType.Fire) {
			this.m_gesture.visible = false
			this.m_groupBalloon.visible = false
			this.m_armatureContainer.visible = false
			this.m_state = EMonsterState.Stop
			GameConfig.balloonScore = 0
			PanelManager.m_gameScenePanel.Boom = true
			PanelManager.m_gameScenePanel.UpdateBatter()
		}
	}

	private _OnEffectArmatureComplete() {
		if (this.m_state == EMonsterState.Stop || this.m_state == EMonsterState.Drown) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveSummonActor(this)
		}
	}

	private _OnArmatureComplet() {
		if (this.m_state == EMonsterState.Dead) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveSummonActor(this)
		}

		if (this.m_state == EMonsterState.Summon) {
			this.m_groupBalloon.visible = true
			this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
			this.m_state = EMonsterState.Ready
			this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		}
	}

	private m_sumWeight:number
	
	private m_state:EMonsterState
	//////////////////////////////////////////////////////////////////
	private m_balloon:Balloon
	private m_score:number

	private m_gesture:egret.Bitmap

	private m_gestureType:number

	private _animations:Array<string>

	private _animationName:string

	private m_endX:number
	private m_endY:number
	private m_isArrive:boolean
}