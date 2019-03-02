class Baby extends egret.DisplayObjectContainer{
	public constructor() {
		super()

		this.m_actorArmatureContainer = new DragonBonesArmatureContainer()
        this.m_actorArmatureContainer.scaleX = 0.5
        this.m_actorArmatureContainer.scaleY = 0.5
		this.addChild(this.m_actorArmatureContainer)
		
		this.m_powerGroup = new egret.Sprite()
		this.addChild(this.m_powerGroup)

		let bg = Common.createBitmap("gameProgressBg_png")
		this.m_powerGroup.addChild(bg)

		let img = Common.createBitmap("power_Pro_png")
		this.m_powerGroup.addChild(img)

		this.m_progress = new egret.Shape()
		img.mask = this.m_progress
		this.m_powerGroup.addChild(this.m_progress)

		this.m_powerGroup.scaleX = 0.5
		this.m_powerGroup.scaleY = 0.5

		this.m_influenceActors = new Array()
		this.m_influenceBalls = new Array()
		this.m_actorsIndex = new Array()
	}

	public skillData:any

	public initData() {
        this.m_actorArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action)
		if (this.m_actorArmature == null) {
			this.m_actorArmature = new DragonBonesArmature(armatureDisplay)
		}
		this.m_actorArmature.ArmatureDisplay = armatureDisplay
		this.m_actorArmatureContainer.register(this.m_actorArmature,["fangdazhao", "idle", "zoulu"])
		this.gotoIdle()
        this.m_actorSpeed = 0.5
        this.m_actorArmatureContainer.scaleX = 0.5
        this.x = Config.stageHalfWidth
		this.m_actorArmatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this)
		this.m_powerGroup.x = -this.width / 2
		this.m_powerGroup.y = -3.5 * this.height
		// this.m_powerGroup.visible = true

		let skillId:number = GameConfig.curBabyData.skillId
		if (skillId != null && skillId > 0) {
			this.skillData = GameConfig.babySkillTable[skillId.toString()]
		}else{
			console.error("不存在技能ID")
			this.skillData = null
		}
		
	}

	public gotoIdle() {
		this.m_state = EBabyState.Idle
		this.m_actorArmatureContainer.play("idle", 0)
	}

	public gotoRun() {
		this.m_state = EBabyState.Run
		this.m_actorArmatureContainer.play("zoulu", 0)
	}

	public gotoAttack() {
		this.m_state = EBabyState.Attack
		this.m_actorArmatureContainer.play("fangdazhao", 1)
		
	}

	public gotoTired() {
		this.m_state = EBabyState.Tired
		this.m_actorArmatureContainer.play("idle", 0)
		this.m_tiredTime = 0
	}


	/////////////////////////////////////////////////////////////////////////////////////////
	public ReleaseSkill(a_power:number, a_method:ESkillReleaseType, a_monster:BaseActor = null) {
		if (a_power >= 360 && this.skillData.method == a_method) {
			switch (this.skillData.method) {
				case ESkillReleaseType.Immediately:
					this.ReleaseImmediately()
				break
				case ESkillReleaseType.Range:
					this.ReleaseRange(a_monster)
				break
				default:
				break
			}
		}
	}

	public ReleaseRange(a_monster:BaseActor) {
		let range = this.skillData.range * Config.stageHeight
		if (this.skillData.range > 0 && a_monster.State == EMonsterState.Ready && a_monster.y >= range) {
			PanelManager.m_gameScenePanel.ReleaseSkill()
			if (this.skillData.sceneEffect && this.skillData.sceneEffect != "") {
				// 全屏动画
			}
			// a_monster.PlayEffect()
		}
	}

	public ReleaseImmediately() {
		PanelManager.m_gameScenePanel.ReleaseSkill()
		this.ReleaseResult()
	}

	public ReleaseResult() {
		let actors:Array<BaseActor> = PanelManager.m_gameScenePanel.GetAllActors()
		this.m_influenceActors.length = 0
		this.m_influenceBalls.length = 0
		this.m_actorsIndex.length = 0
		// 筛选
		switch (this.skillData.rangeType) {
			case ESkillRange.All:
				this.SelectRangeAll()
			break
			case ESkillRange.Random:
				this.SelectRangeRandom(actors)
			break
			case ESkillRange.FrontToBack:
				this.SelectRangeFrontToBack(actors)
			break
			default:
			break
		}
		// 影响的结果
		for (let i = 0; i < this.m_influenceActors.length; i++) {
			let actor:BaseActor = this.m_influenceActors[i]
			actor.UpdateEffectArmature(this.skillData)
			actor.PlayEffect(this.skillData)
		}

		for (let i = 0; i < this.m_influenceBalls.length; i++) {
			let ball:Balloon = this.m_influenceBalls[i]
			ball.UpdateEffectArmature(this.skillData)
			ball.PlayEffect(this.skillData)
		}

	}

	public SelectRangeAll() {
		switch (this.skillData.result) {
			case ESkillResult.ContinuedKill:
				// 全体范围内持续
			break
			case ESkillResult.SlowSpeed:
				// 全体减速
			break
		}
	}

	public SelectRangeRandom(actors:Array<BaseActor>) {
		for (let i = 0; i < actors.length; i++) {
			this.m_actorsIndex.push(i)
		}
		MathUtils.shuffle(this.m_actorsIndex)
		if (this.skillData.param && this.skillData.param.length > 0) {
			let count = this.skillData.param[0]
			if (this.skillData.param.lenght > 1) count = parseInt(this.skillData.param[0])
			count = Math.min(count, actors.length)
			if (this.skillData.skillHang == ESkillHand.Ballon) {
				for (let i = 0; i < this.m_actorsIndex.length; i++) {
					let random = this.m_actorsIndex[i]
					let actor:BaseActor = actors[random]
					if (actor.Balloons.length > 0 && actor.State == EMonsterState.Ready) {
						for (let j = 0; j < actor.Balloons.length; j++) {
							if (this.m_influenceBalls.length >= count) break
							this.m_influenceBalls.push(actor.Balloons[j])
						}
					}
				}
			}else{
				for (let i = 0; i < count; i++) {
					let random = this.m_actorsIndex[i]
					let actor:BaseActor = actors[random]
					if (actor.State == EMonsterState.Ready && actor.y >= 100) this.m_influenceActors.push(actor)
				}
			}
		}
	}

	public SelectRangeFrontToBack(actors:Array<BaseActor>) {
		// 对所有的敌人进行排序
		actors.sort(function(a, b) {
			return b.y - a.y
		})
		if (this.skillData.param && this.skillData.param.length > 0) {
			let count = this.skillData.param[0]
			if (this.skillData.param.lenght > 1) count = parseInt(this.skillData.param[0])
			count = Math.min(count, actors.length)
			let value = 0
			for (let i = 0; i < actors.length; i++) {
				let actor:BaseActor = actors[i]
				if (actor.State == EMonsterState.Ready && actor.y >= 100) {
					if (this.skillData.skillHang == ESkillHand.Ballon) {
						for (let j = 0; j < actor.Balloons.length; j++) {
							if (value >= count) break
							this.m_influenceBalls.push(actor.Balloons[j])
							value++
						}
					}else{
						if (value >= count) break
						this.m_influenceActors.push(actor)
						value++
					}
				}
			}
		}
	}

	public SkillResultKill() {

	}

	////////////////////////////////////////////////////////////////////////////////////////

	public update(timeElapsed:number) {
		if (this.m_state == EBabyState.Run) {
			this.x += this.m_actorSpeed
			if (this.x >= 600) {
				this.m_actorSpeed = -0.5
				this.m_actorArmatureContainer.scaleX = -0.5
				this.gotoTired()
			}
			if (this.x <= 130) {
				this.m_actorSpeed = 0.5
				this.m_actorArmatureContainer.scaleX = 0.5
				this.gotoTired()
			}
		}

		if (this.m_state == EBabyState.Tired) {
			this.m_tiredTime += timeElapsed
			if (this.m_tiredTime >= 2000) {
				this.gotoRun()
				this.m_tiredTime = 0
			}
		}
	}

	public updateProgress(angle:number) {
        let r = this.m_powerGroup.height
        this.m_progress.graphics.clear();
        this.m_progress.graphics.beginFill(0x00ffff);
        this.m_progress.graphics.moveTo(r, r)
        this.m_progress.graphics.lineTo(2 * r, r);
        this.m_progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this.m_progress.graphics.lineTo(r, r);
        this.m_progress.graphics.endFill();
        // this.m_progress.x = 0
        this.m_progress.y = -5
	}

	private _OnArmatureComplete() {
		if (this.m_state == EBabyState.Attack) {
			this.gotoRun()
		}
	}

	private m_tiredTime:number = 0

	private m_actorArmatureContainer:DragonBonesArmatureContainer
    private m_actorArmature:DragonBonesArmature
    private m_actorSpeed:number
	private m_state:EBabyState
	private m_powerGroup:egret.Sprite
	private m_progress:egret.Shape

	private m_influenceActors:Array<BaseActor>
	private m_influenceBalls:Array<Balloon>
	private m_actorsIndex:Array<number>
}