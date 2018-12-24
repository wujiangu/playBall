class Monster extends BaseActor {
	public constructor() {
		super()

		// this.m_gesture = Common.createBitmap("gestureSheet_json.gesture001")
		this.m_balloons = new Array()
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
		// let armature = DragonBonesFactory.getInstance().buildArmature(name, name)
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name)
		// let clock = DragonBonesFactory.getInstance().createWorldClock(10.0)
		if (this.m_armature == null) {
			this.m_armature = new DragonBonesArmature(armatureDisplay)
		}
		// this.m_armature.Armature = armature
		this.m_armature.ArmatureDisplay = armatureDisplay

		// this.m_armature.scaleX = 0.5
		// this.m_armature.scaleY = 0.5

		this.m_armatureContainer.register(this.m_armature,[
			DragonBonesAnimations.Idle,
			DragonBonesAnimations.Dead,
			DragonBonesAnimations.Run,
			DragonBonesAnimations.Hurt,
			DragonBonesAnimations.Explore,
		])
		this.m_state = EMonsterState.Ready
		this.m_speedY = GameConfig.baseFallSpeed + this.m_data.Speed / 100
		this.m_speedX = 0.2

		this.m_gestureData.length = 0
		for (let i = 0; i < GameConfig.gestureConfig.length; i++) {
			this.m_gestureData.push(GameConfig.gestureConfig[i])
		}

		this.m_sumBalloon = 0
	}

	public InitGraph() {
		this.y = 0

		// this.filters = [this.m_dropShadowFilter]

		this.GotoIdle()
		this.UpdateSignSlot()

		this.x = MathUtils.getRandom(this.m_rect.width/2, Config.stageWidth - this.m_rect.width/2)
	}

	public GotoIdle() {
		this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0)
		// this.m_armature.ArmatureDisplay.getBounds(this.m_rect, true)
		this.m_armature.ArmatureDisplay.getTransformedBounds(this.m_armatureContainer, this.m_rect)
		
		// this.m_shape.graphics.drawRect(0, 0, this.m_rect.width, this.m_rect.height)
		// this.m_shape.graphics.endFill()
		// Common.log("GotoIdle宽度", this.m_rect.width)
	}

	public GotoHurt() {
		if (this.m_type != EMonsterType.Normal) {
			this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0)
		}
	}

	public GotoDead() {
		// if (this.y >= 100) {
			this.m_state = EMonsterState.Dead
			this.Destroy()
			PanelManager.m_gameScenePanel.RemoveMonster(this)

			PanelManager.m_gameScenePanel.Power += this.m_data.Power
		// }
		// if (this.m_type != EMonsterType.Normal) {
		// 	this.m_armatureContainer.play(DragonBonesAnimations.Dead, 0)
		// }
	}

	public GotoRun() {
		this._DestroyBalloon()
		this.m_armatureContainer.play(DragonBonesAnimations.Run, 0)
		this.m_armature.ArmatureDisplay.getTransformedBounds(this.m_armatureContainer, this.m_rect)

		// this.m_shape.graphics.drawRect(0, 0, this.m_rect.width, this.m_rect.height)
		// this.m_shape.graphics.endFill()
		// Common.log("GotoRun", this.m_rect.width)
	}

	public BallExplosion(a_ball:Balloon) {
		if (this.y >= 100) {
			this.m_exploreIndex = 0
			for (let i = 0; i < this.m_balloons.length; i++) {
				let balloon:Balloon = this.m_balloons[i]
				if (balloon == a_ball) {
					balloon.BalloonExplore()
					this.m_balloons.splice(i, 1)
					this.m_exploreIndex = i
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
			this.GotoDead()
			// this._speedY = 0.7
			// this._ChangeAnimate(this._data.fall)
			// this._wolfGraph.play(-1)
			// if (!this._isFallDown) {
			// 	this._isFallDown = true
			// 	this._fallDownSound.play(0, 1)
			// 	egret.setTimeout(this._OnFallDownComplete, this, 500)
			// 	// fall.addEventListener(egret.Event.SOUND_COMPLETE, this._OnFallDownComplete, this)
			// }
		}else{
			if (this.m_sumBalloon == 2 && this.m_balloons.length > 0) {
				let balloon:Balloon = this.m_balloons[0]
				let posx = 0
				// if (this._data.type == EWolfType.Red) {
				// 	posx = this.width / 2
				// }
				egret.Tween.get(balloon).to({x:posx}, 200, egret.Ease.circOut)
				egret.Tween.get(balloon.rop).to({scaleY:40, rotation:0}, 200, egret.Ease.circOut)
				this.m_sumBalloon = 1
			}

			if (this.m_sumBalloon == 3 && this.m_balloons.length > 0) {
				this.m_sumBalloon = 2
				if (this.m_exploreIndex == 2) {
					this.m_balloons.reverse()
				}
				for (let i = 0; i < this.m_balloons.length; i++) {
					let balloon:Balloon = this.m_balloons[i]
					let posX = i * balloon.width - this.m_rect.width / 3
					let posY = -this.m_rect.height + 40
					let rotation = 90 * i - 45
					// if (this.m_data.type == EWolfType.Red) {
					// 	posY = 100
					// }
					egret.Tween.get(balloon).to({x:posX, y:posY}, 200, egret.Ease.circOut)
					egret.Tween.get(balloon.rop).to({scaleY:55, rotation:rotation}, 200, egret.Ease.circOut)
				}
				
			}
		}
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
			if (this.x <= -this.m_rect.width) {
				this.m_state = EMonsterState.Dead
				this.Destroy()
				PanelManager.m_gameScenePanel.RemoveMonster(this)
				// this.Destroy()
				// PanelManager.gamePanel.RemoveWolf(this)
			}
		}
	}

	public Destroy() {
		this._DestroyBalloon()
		this.m_armatureContainer.clear()
		GameObjectPool.getInstance().destroyObject(this)
	}


	/**
	 * 更新符号槽位
	 */
	public UpdateSignSlot() {
		this._DestroyBalloon()
		this.m_sumBalloon = 3

		// let random = MathUtils.getRandom(this.m_gestureData.length - 1)

		// let slot = this.m_armature.Armature.getSlot("Sign")
        // this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path)
		// this.m_gesture.x = slot.display.x;
        // this.m_gesture.y = slot.display.y;
        // this.m_gesture.anchorOffsetX = this.m_gesture.width/2;
        // this.m_gesture.anchorOffsetY = this.m_gesture.height/2;
		// slot.setDisplay(this.m_gesture)
		// this.m_gestureType = this.m_gestureData[random].type

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

	public _SetBallonPosition(balloon:Balloon, count:number, value:number = 0) {
		if (count == 1) {
			balloon.x = 0
			balloon.y = -this.m_rect.height
			balloon.SetLine()
		}
		else if (count == 2) {
			balloon.x = value * balloon.width - this.m_rect.width / 3
			balloon.y = -this.m_rect.height
			balloon.SetLine(count, value)
		}
		else if (count == 3) {
			if (value == 0) {
				balloon.x = 0
				balloon.y = -this.m_rect.height
			}else{
				balloon.x = (value - 1) * (balloon.width + 60) - this.m_rect.width / 2 + 5
				balloon.y = -this.m_rect.height + 40
			}
			balloon.SetLine(count, value)
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
	private m_data:any
	private m_state:EMonsterState
	private m_speedY:number
	private m_speedX:number

	//////////////////////////////////////////////////////////////////
	// private m_gesture:egret.Bitmap
	private m_balloons:Array<Balloon>
	private m_sumBalloon:number
	private m_score:number
	private m_exploreIndex:number
}