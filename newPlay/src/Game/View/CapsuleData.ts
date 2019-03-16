class CapsuleData {
	public constructor() {
	}

	/** 抽奖消耗糖果数量 */
	public consume:number = 20
	/** 抽奖的结果 */
	public resultType:number = 0

	public get result() {
		let capsuleRandom = MathUtils.getRandom(1, this._capsuleWeight)
		let capsuleData = null
		for (let i = 0; i < GameConfig.capsuleConfig.length; i++) {
			let config = GameConfig.capsuleConfig[i]
			let capsule = GameConfig.capsuleTable[config.id.toString()]
			if (capsuleRandom <= capsule.range) {
				capsuleData = capsule
				break
			}
		}
		if (GameConfig.babyUnlockList.length == 1) {
			capsuleData.type = ECapsule.BlueBaby
		}

		switch (capsuleData.type) {
			case ECapsule.Candy:
				this._capsuleCandy(capsuleData.value)
			break
			case ECapsule.GreenBaby:
				this._capsuleBaby(EBabyQuality.Green)
			break
			case ECapsule.BlueBaby:
				this._capsuleBaby(EBabyQuality.Blue)
			break
			case ECapsule.PurpleBaby:
				this._capsuleBaby(EBabyQuality.Purple)
			break
		}

		if (capsuleData.type != ECapsule.Candy) {
			// 判断是否在已解锁列表中
			let index = GameConfig.babyUnlockList.indexOf(this._result.id)
			if (index < 0) {
				// 加入到解锁列表
				GameConfig.rewardType = EReward.AssignBaby
				GameConfig.babyUnlockList.push(this._result.id)
				Common.updateUnlockBaby()
			}else{
				// 转换成糖果
				this._capsuleCandy(this._result.candy)
			}
		}

		return this._result
	}

	public init() {
		this._capsuleWeight = 0
		this._babys = new Array()

		for (let i = 0; i < GameConfig.capsuleConfig.length; i++) {
			let id:number = GameConfig.capsuleConfig[i].id
			let capsule = GameConfig.capsuleTable[id.toString()]
			this._capsuleWeight += capsule.weight
			capsule.range = this._capsuleWeight
		}
	}

	private _capsuleCandy(value:number) {
		GameConfig.rewardCandy = value
		GameConfig.rewardType = EReward.Candy
		Common.updateCurCandy(value)
		Common.dispatchEvent(MainNotify.updateCandy)
	}

	private _capsuleBaby(quality:EBabyQuality) {
		this._babys.length = 0
		let range = 0
		for (let i = 0; i < GameConfig.actorConfig.length; i++) {
			let config = GameConfig.actorConfig[i]
			if (config.quality == quality) {
				this._babys.push(config)
			}
		}

		for (let i = 0; i < this._babys.length; i++) {
			let id:number = this._babys[i].id
			let baby = GameConfig.actorTable[id.toString()]
			range += baby.weight
			baby.range = range
		}

		let random = MathUtils.getRandom(1, range)
		for (let i = 0; i < this._babys.length; i++) {
			let config = this._babys[i]
			let baby = GameConfig.actorTable[config.id.toString()]
			if (random <= baby.range) {
				this._result = baby
				break
			}
		}
	}

	private _capsuleWeight:number
	private _allWeight:number
	/** 抽奖结果 */
	private _result:any
	private _babys:Array<any>
}