class Baby extends egret.DisplayObjectContainer{
	public constructor() {
		super()

		this._actorArmatureContainer = new DragonBonesArmatureContainer()
        this._actorArmatureContainer.scaleX = 0.5
        this._actorArmatureContainer.scaleY = 0.5
		this.addChild(this._actorArmatureContainer)
		
		this._powerGroup = new egret.Sprite()
		this.addChild(this._powerGroup)

		let bg = Common.createBitmap("gameProgressBg_png")
		this._powerGroup.addChild(bg)

		let img = Common.createBitmap("power_Pro_png")
		this._powerGroup.addChild(img)

		this._progress = new egret.Shape()
		img.mask = this._progress
		this._powerGroup.addChild(this._progress)

		this._powerGroup.scaleX = 0.5
		this._powerGroup.scaleY = 0.5

		this._influenceActors = new Array()
		this._influenceBalls = new Array()
		this._actorsIndex = new Array()
	}

	public skillData:any

	public initData() {
        this._actorArmatureContainer.clear()
		let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action)
		if (this._actorArmature == null) {
			this._actorArmature = new DragonBonesArmature(armatureDisplay)
		}
		this._actorArmature.ArmatureDisplay = armatureDisplay
		this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"])
		this.gotoIdle()
        this._actorSpeed = 0.5
        this._actorArmatureContainer.scaleX = 0.5 * GameConfig.curBabyData.direction
        this.x = Config.stageHalfWidth
		this._actorArmatureContainer.addCompleteCallFunc(this._onArmatureComplete, this)
		this._powerGroup.x = -this.width / 2
		this._powerGroup.y = -1 * this.height
		this._powerGroup.visible = false

		let skillId:number = GameConfig.curBabyData.skillId
		if (skillId != null && skillId > 0) {
			this.skillData = GameConfig.babySkillTable[skillId.toString()]
		}else{
			console.error("不存在技能ID")
			this.skillData = null
		}
		
	}

	public gotoIdle() {
		this._state = EBabyState.Idle
		this._actorArmatureContainer.play("idle", 0)
	}

	public gotoRun() {
		this._state = EBabyState.Run
		this._actorArmatureContainer.play("zoulu", 0)
	}

	public gotoAttack() {
		this._state = EBabyState.Attack
		this._actorArmatureContainer.play("fangdazhao", 1)
		let voice:egret.Sound = RES.getRes(this.skillData.music)
		if(GameConfig.isPlaySound){
			let channel = voice.play(0, 1)
			channel.volume = GameConfig.soundValue / 100
		}
	}

	public gotoTired() {
		this._state = EBabyState.Tired
		this._actorArmatureContainer.play("idle", 0)
		this._tiredTime = 0
	}


	/////////////////////////////////////////////////////////////////////////////////////////
	public releaseSkill(a_power:number, a_method:ESkillReleaseType, a_monster:BaseActor = null) {
		if (a_power >= 100 && this.skillData.method == a_method) {
			switch (this.skillData.method) {
				case ESkillReleaseType.Immediately:
					// this.releaseImmediately()
				break
				case ESkillReleaseType.Range:
					// this.releaseRange(a_monster)
				break
				default:
				break
			}
		}
	}

	public releaseRange(a_monster:BaseActor) {
		let range = this.skillData.range * Config.stageHeight
		if (this.skillData.range > 0 && a_monster.state == EMonsterState.Ready && a_monster.y >= range && this.canRelease()) {
			PanelManager.gameScenePanel.releaseSkill()
			if (this.skillData.sceneEffect && this.skillData.sceneEffect != "") {
				// 全屏动画
			}
			// a_monster.playEffect()
			// this.ReleaseResult()
		}
	}

	public releaseImmediately() {
		if (this.canRelease()) {
			PanelManager.gameScenePanel.releaseSkill()
		}
		// this.ReleaseResult()
	}

	public canRelease() {
		let isRelease:boolean = false
		let actors:Array<BaseActor> = PanelManager.gameScenePanel.getAllActors()
		this._influenceActors.length = 0
		this._influenceBalls.length = 0
		this._actorsIndex.length = 0
		// 筛选
		switch (this.skillData.rangeType) {
			case ESkillRange.All:
				this.selectRangeAll()
				isRelease = true
			break
			case ESkillRange.Random:
				this.selectRangeRandom(actors)
			break
			case ESkillRange.FrontToBack:
				this.selectRangeFrontToBack(actors)
			break
			default:
			break
		}

		if (!isRelease && (this._influenceActors.length > 0 || this._influenceBalls.length > 0)) {
			isRelease = true
		}
		return isRelease
	}

	public releaseResult() {
		
		// 影响的结果
		for (let i = 0; i < this._influenceActors.length; i++) {
			let actor:BaseActor = this._influenceActors[i]
			actor.updateEffectArmature(this.skillData)
			actor.playEffect(this.skillData)
		}

		for (let i = 0; i < this._influenceBalls.length; i++) {
			let ball:Balloon = this._influenceBalls[i]
			ball.updateEffectArmature(this.skillData)
			ball.playEffect(this.skillData)
		}
	}

	public selectRangeAll() {
		let actors:Array<BaseActor> = PanelManager.gameScenePanel.getAllActors()
		for (let i = 0; i < actors.length; i++) {
			if (actors[i].state == EMonsterState.Ready) this._influenceActors.push(actors[i])
		}
		switch (this.skillData.result) {
			case ESkillResult.ContinuedKill:
				// 全体范围内持续
				PanelManager.gameScenePanel.setSkillDuration()
			break
			case ESkillResult.SlowSpeed:
				// 全体减速
				PanelManager.gameScenePanel.setSkillDuration()
			break
		}
	}

	public isInfluence(a_actor:BaseActor) {
		if (!a_actor.isBoss()) return true
		if (a_actor.isBoss() && this.skillData.boss) return true
		return false
	}

	public selectRangeRandom(actors:Array<BaseActor>) {
		for (let i = 0; i < actors.length; i++) {
			this._actorsIndex.push(i)
		}
		MathUtils.shuffle(this._actorsIndex)
		if (this.skillData.param && this.skillData.param.length > 0) {
			let count = this.skillData.param[0]
			if (this.skillData.param.lenght > 1) count = parseInt(this.skillData.param[0])
			count = Math.min(count, actors.length)
			if (this.skillData.skillHang == ESkillHand.Ballon) {
				for (let i = 0; i < this._actorsIndex.length; i++) {
					let random = this._actorsIndex[i]
					let actor:BaseActor = actors[random]
					// xiugaiwu
					if (this.isInfluence(actor) && actor.balloons.length > 0 && actor.state == EMonsterState.Ready && actor.y >= 100) {
						for (let j = 0; j < actor.balloons.length; j++) {
							if (this._influenceBalls.length >= count) break
							if (actor.balloons[j].type > 0) {
								this._influenceBalls.push(actor.balloons[j])
							}
						}
					}
				}
			}else{
				for (let i = 0; i < count; i++) {
					let random = this._actorsIndex[i]
					let actor:BaseActor = actors[random]
					// xiugaiwu
					if (this.isInfluence(actor) && actor.state == EMonsterState.Ready && actor.y >= 100) this._influenceActors.push(actor)
				}
			}
		}
	}

	public selectRangeFrontToBack(actors:Array<BaseActor>) {
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
				if (this.isInfluence(actor) && actor.state == EMonsterState.Ready && actor.y >= 100) {
					if (this.skillData.skillHang == ESkillHand.Ballon) {
						for (let j = 0; j < actor.balloons.length; j++) {
							if (value >= count) break
							if (actor.balloons[j].type > 0) {
								this._influenceBalls.push(actor.balloons[j])
								value++
							}
						}
					}else{
						if (value >= count) break
						this._influenceActors.push(actor)
						value++
					}
				}
			}
		}
	}

	public skillResultKill() {

	}

	////////////////////////////////////////////////////////////////////////////////////////

	public update(timeElapsed:number) {
		if (this._state == EBabyState.Run) {
			this.x += this._actorSpeed
			if (this.x >= 600) {
				this._actorSpeed = -0.5
				this._actorArmatureContainer.scaleX = -0.5 * GameConfig.curBabyData.direction
				this.gotoTired()
			}
			if (this.x <= 130) {
				this._actorSpeed = 0.5
				this._actorArmatureContainer.scaleX = 0.5 * GameConfig.curBabyData.direction
				this.gotoTired()
			}
		}

		if (this._state == EBabyState.Tired) {
			this._tiredTime += timeElapsed
			if (this._tiredTime >= 2000) {
				this.gotoRun()
				this._tiredTime = 0
			}
		}
	}

	// 弃用
	public updateProgress(angle:number) {
        let r = this._powerGroup.height
        this._progress.graphics.clear();
        this._progress.graphics.beginFill(0x00ffff);
        this._progress.graphics.moveTo(r, r)
        this._progress.graphics.lineTo(2 * r, r);
        this._progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this._progress.graphics.lineTo(r, r);
        this._progress.graphics.endFill();
        // this._progress.x = 0
        this._progress.y = -5
	}

	private _onArmatureComplete() {
		if (this._state == EBabyState.Attack) {
			this.gotoRun()
		}
	}

	private _tiredTime:number = 0

	private _actorArmatureContainer:DragonBonesArmatureContainer
    private _actorArmature:DragonBonesArmature
    private _actorSpeed:number
	private _state:EBabyState
	private _powerGroup:egret.Sprite
	private _progress:egret.Shape

	private _influenceActors:Array<BaseActor>
	private _influenceBalls:Array<Balloon>
	private _actorsIndex:Array<number>
}