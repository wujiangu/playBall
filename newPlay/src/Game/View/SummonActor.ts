class SummonActor extends BaseActor {
	public constructor() {
		super()

		// this.m_balloon = new Balloon()
		// this._groupBalloon.addChild(this.m_balloon)
		this._balloons = new Array()

		this.m_gesture = new egret.Bitmap()
		this.addChild(this.m_gesture)
		this.m_gesture.scaleX = 0.55
		this.m_gesture.scaleY = 0.55
	}

	public init(a_data:any, a_x:number, a_y:number, beginX:number, beginY:number) {
		this._sumWeight = 0
		this._type = EMonsterDifficult.Summon
		this._data = GameConfig.summonTable[a_data.id.toString()]
		this._animations = this._data.Actions
		this._gesturDiff = a_data.diff
		this._gestureData.length = 0
		if (a_data.ids != undefined && a_data.ids.length > 0) {
			for (let i = 0; i < a_data.ids.length; i++) {
				let id = a_data.ids[i]
				for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
					if (GameConfig.gestureConfig[i].type == id) {
						this._gestureData.push(GameConfig.gestureConfig[i])
					}
				}
			}
		}else{
			for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
				if (this._gesturDiff == EGestureDifficult.Mix) {
					this._gestureData.push(GameConfig.gestureConfig[i])
				}else{
					if (GameConfig.gestureConfig[i].difficult == this._gesturDiff) this._gestureData.push(GameConfig.gestureConfig[i])
				}
			}
		}
		
		if (this._data) {
			this.initData()
			this.initGraph()
			this._endX = a_x
			this._endY = a_y
			if (this._data.Type == ESummonType.Balloon) {
				this.x = beginX
				this.y = beginY
			}
			else if (this._data.Type == ESummonType.Monster) {
				this.x = a_x
				this.y = beginY - this.master.actorTableData.Height / 2
			}
        	// Common.log("位置", this._endX, this._endY)
		}else{
			Error("no wolf data")
		}
	}

	public initData() {
		super.initData()
		let name = this._data.Animation
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		if (this._armature == null) {
			this._armature = new DragonBonesArmature(armatureDisplay)
		}
		this._armature.ArmatureDisplay = armatureDisplay
		this._armatureContainer.register(this._armature, this._animations)
		
		this._state = EMonsterState.Ready
		this._addNum = 0
		this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent
		this._baseSpeedY = this._speedY
		this._speedX = 0.1
		this._effectArmatureContainer.visible = false
		this._armatureContainer.scaleX = this._data.Scale
		this._armatureContainer.scaleY = this._data.Scale

		this._rect.width = this._data.Width
		this._rect.height = this._data.Height
		this._width = this._data.Width
		this._height = this._data.Height
	}

	public initGraph() {
		this.x = Config.stageWidth + this._width / 2
		this.y = MathUtils.getRandom(Config.stageHalfHeight - 200, Config.stageHalfHeight + 200)

		this.m_gesture.visible = false
		this._groupBalloon.visible = false
		this._armatureContainer.visible = true
		this._destroyBalloon()
		if (this._data.Type == ESummonType.Balloon) {
			this._isArrive = false
			this.updateGesture()
			// let colorIndex = MathUtils.getRandom(this._animations.length - 1)
			// this._animationName = this._animations[colorIndex]
			this._armatureContainer.play(this._animationName, 1)
			this._armatureContainer.pause(this._animationName)
		}
		else if (this._data.Type == ESummonType.Monster) {
			this._isArrive = true
			this._sumBalloon = 1
			for (let i = 0; i < this._sumBalloon; i++) {
				let balloon:Balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon")
				balloon.init(this._gestureData, this)
				this._setBallonPosition(balloon, this._sumBalloon, i)
				this._groupBalloon.addChild(balloon)
				this._balloons.push(balloon)
			}
			// this.m_balloon.Init(this._gestureData, this)
			// this._setBallonPosition(this.m_balloon, 1, 0)
			// this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
			this._animationName = DragonBonesAnimations.Dead
			this._gestureType = this._balloons[0].type

			this._state = EMonsterState.Summon
			this._armatureContainer.play(DragonBonesAnimations.Arrive, 1, 1, 0, 3)

			this._armatureContainer.addCompleteCallFunc(this._onArmatureComplet, this)
			// this.x = MathUtils.getRandom(this._rect.width, Config.stageWidth - this._rect.width)
			// this.y = MathUtils.getRandom(200, PanelManager.gameScenePanel.groundPos - 200)
		}
	}

	public updateGesture() {
		let random = MathUtils.getRandom(this._gestureData.length - 1)
		this.m_gesture.texture = RES.getRes(this._gestureData[random].path)
		this.m_gesture.anchorOffsetX = this.m_gesture.width / 2
		this.m_gesture.anchorOffsetY = this.m_gesture.height / 2
		this.m_gesture.x = this._armatureContainer.x + 1
		this.m_gesture.y = this._armatureContainer.y - 38
		this.m_gesture.visible = true
		this._gestureType = this._gestureData[random].type
		this._score = this._gestureData[random].count
		this._animationName = this._gestureData[random].balloon
		this._gestureData.splice(random, 1)
	}

	public gotoIdle() {
		// this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
	}

	public gotoRun() {
		// this._armatureContainer.play(DragonBonesAnimations.Run, 0)
		GameManager.Instance.stop()
	}

	public get type() {
		return this._type
	}

	public gotoDead() {
		// if (this._state == EMonsterState.Ready && this.y >= 100) {
			this._master.summonBeKill()
			PanelManager.gameScenePanel.boom = true
			this._gestureType = -1
			this.m_gesture.visible = false
			this._armatureContainer.play(this._animationName, 1)
			this._state = EMonsterState.Dead
			this._armatureContainer.addCompleteCallFunc(this._onArmatureComplet, this)
			PanelManager.gameScenePanel.sceneData.addPower += this._data.Power
			// if (PanelManager.gameScenePanel.levelStage == ELevelType.Normal) {
			// 	PanelManager.gameScenePanel.Score += this._score
			// }
			if (this._data.Type == ESummonType.Balloon) {
				GameConfig.balloonScore += this._score
				PanelManager.gameScenePanel.boom = true
				if(GameConfig.isPlaySound){
					let channel = GameVoice.ballonBoomSound.play(0, 1)
					channel.volume = GameConfig.soundValue / 100
				}				
			}
			else if (this._data.Type == ESummonType.Monster) {
				if (this._balloons[0] != null) {
					this._balloons[0].balloonExplore(true)
				}
			}
		// }
	}

	public destroy() {
		this._armatureContainer.removeCompleteCallFunc(this._onArmatureComplet, this)
		this._destroyBalloon()
		this._armatureContainer.clear()
		this._armatureContainer.visible = false
		GameObjectPool.getInstance().destroyObject(this)
	}

	public destroyAndRemove() {
		super.destroyAndRemove()
		this.destroy()
		PanelManager.gameScenePanel.removeSummonActor(this)
	}

	public update(timeElapsed:number) {
		super.update(timeElapsed)
		if (this._state == EMonsterState.Ready) {
			if (this._isArrive) {
				this.y += timeElapsed * this._speedY
				if (this.y >= PanelManager.gameScenePanel.groundPos) {
					this.y = PanelManager.gameScenePanel.groundPos
					this._state = EMonsterState.Run
					this.gotoRun()
				}
			}else{
				let distance:number = MathUtils.getDistance(this._endX, this._endY, this.x, this.y)
				if (distance <= 10) {
					this._isArrive = true
					return
				}
				let radian = MathUtils.getRadian2(this.x, this.y, this._endX, this._endY)
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

	public get gestureType() {
		return this._gestureType
	}

	public set gestureType(value:number) {
		this._gestureType = value
	}

	/**
	 * 更新怪物身上的特效动画
	 */
	public updateEffectArmature(data:any) {
		super.updateEffectArmature(data)
	}

	public playEffect(data:any) {
		if (this._state == EMonsterState.Ready) {
			this._effectArmatureContainer.visible = true
			this._effectArmatureContainer.play(data.skill, 1)
			if (data.result != ESkillResult.SlowSpeed) {
				this._state = EMonsterState.Stop
			}
		}
		// if (this._effectData.type == EEffectType.Fire) {
		// 	this.m_gesture.visible = false
		// 	this._groupBalloon.visible = false
		// 	this._armatureContainer.visible = false
		// 	this._state = EMonsterState.Stop
		// 	GameConfig.balloonScore = 0
		// 	PanelManager.gameScenePanel.boom = true
		// 	PanelManager.gameScenePanel.updateBatter()
		// }
	}

	public changeGestureType(a_gestureType:number) {
		this.gestureType = a_gestureType
	}

	public onEffectArmatureComplete() {
		super.onEffectArmatureComplete()
	}

	public onEffectArmatureFram(event:dragonBones.EgretEvent) {
		super.onEffectArmatureFram(event)
		let evt:string = event.frameLabel
		switch (evt) {
			case "xiaoshi":
				this._destroyBalloon()
				this._armatureContainer.visible = false
			break
		}
	}

	private _onArmatureComplet() {
		if (this._state == EMonsterState.Dead) {
			this.destroyAndRemove()
		}

		if (this._state == EMonsterState.Summon) {
			this._groupBalloon.visible = true
			this._armatureContainer.play(DragonBonesAnimations.Idle, 0)
			this._state = EMonsterState.Ready
			this._armatureContainer.removeCompleteCallFunc(this._onArmatureComplet, this)
		}
	}

	private _sumWeight:number
	//////////////////////////////////////////////////////////////////
	// private m_balloon:Balloon
	private _score:number

	private m_gesture:egret.Bitmap

	private _animations:Array<string>

	private _animationName:string

	private _endX:number
	private _endY:number
	private _isArrive:boolean
}