class SummonActor extends BaseActor {
	public constructor() {
		super()

		this.m_gesture = new egret.Bitmap()
		this.addChild(this.m_gesture)
		this.m_gesture.scaleX = 0.5
		this.m_gesture.scaleY = 0.5

		this._animations = ["hong", "huang", "lan"]
	}

	public Init(a_data:any, a_x:number, a_y:number) {
		this.m_sumWeight = 0
		// for (let i = 0; i < GameConfig.luckyConfig.length; i++) {
		// 	this.m_sumWeight += GameConfig.luckyConfig[i].Prob
		// 	GameConfig.luckyConfig[i].weight = this.m_sumWeight
		// }

		// this.m_data = this._RandomSummonActorData()

		this.m_data = GameConfig.summonConfig[a_data.id.toString()]
		this.m_gesturDiff = a_data.diff
		this.m_gestureData.length = 0
		if (a_data.ids.length > 0) {
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

		this.m_isArrive = false
		if (this.m_data) {
			this.InitData()
			this.InitGraph()
			this.m_endX = Math.max(a_x, this.w)
			this.m_endY = Math.min(a_y, Config.stageWidth - this.w)
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
		this.m_speedY = this.m_data.Speed / 100
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
		this.UpdateGesture()
	}

	public UpdateGesture() {
		let random = MathUtils.getRandom(this.m_gestureData.length - 1)
		this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path)
		this.m_gesture.anchorOffsetX = this.m_gesture.width / 2
		this.m_gesture.anchorOffsetY = this.m_gesture.height / 2
		this.m_gesture.x = this.m_armatureContainer.x + 2
		this.m_gesture.y = this.m_armatureContainer.y - 38
		this.m_gesture.visible = true
		this.m_gestureType = this.m_gestureData[random].type
		this.m_score = this.m_gestureData[random].count
		this.m_gestureData.splice(random, 1)

		let colorIndex = MathUtils.getRandom(this._animations.length - 1)
		this._animationName = this._animations[colorIndex]
		this.m_armatureContainer.play(this._animationName, 1)
		this.m_armatureContainer.pause(this._animationName)
	}

	public GotoIdle() {
		// this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public GotoRun() {
		// this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
		GameManager.Instance.Stop()
	}

	public GotoDead() {
		this.m_gesture.visible = false
		this.m_armatureContainer.play(this._animationName, 1)
		this.m_state = EMonsterState.Dead
		this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this)
		PanelManager.m_gameScenePanel.Power += this.m_data.Power

		GameVoice.ballonBoomSound.play(0, 1)
	}

	public Destroy() {
		// this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this)
		this.m_armatureContainer.clear()
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
				let speed = timeElapsed
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

	// public UpdateGesture() {
	// 	// this.m_balloon.UpdateColorAndGesture()
	// 	// if (PanelManager.m_gameScenePanel != null) {
	// 	// 	PanelManager.m_gameScenePanel.Score += this.m_balloon.Score
	// 	// }
	// }

	private _OnArmatureComplet() {
		if (this.m_state == EMonsterState.Dead) {
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveSummonActor(this)
		}
	}

	private _RandomSummonActorData():any {
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

	private m_gesture:egret.Bitmap

	private m_gestureType:number

	private _animations:Array<string>

	private _animationName:string

	private m_endX:number
	private m_endY:number
	private m_isArrive:boolean
}