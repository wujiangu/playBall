class GameSceneData {
	public constructor() {
		this.allActors = new Array()
	}

	public allActors:Array<BaseActor>

	/**过关需要的分值 */
	public needScore:number = 0
	/**上一关的分值 */
	public lastScore:number = 0

	public midOffset:number = 120
	public leftRightOffset:number = 90
	/**增加的能量值 */
	public addPower:number = 0
	/**糖果的获得数量 */
	public addCandy:number = 0
	/**真实分数 */
    public realScore:number
	/** 额外糖果 */
	public extra:number

	// 获取召唤物目标X值
	public getSummonTargetX(e_pos:EMonsterPos, a_x:number, a_count:number = 0, a_num:number = 0, type:ESummonType = ESummonType.Balloon, isBoss:boolean = false) {
		let target = a_x
		switch (e_pos) {
			case EMonsterPos.Left:
				if (a_count == 1) {
					if (type == ESummonType.Balloon) target += this.leftRightOffset
				}
				else if (a_count == 2) {
					target += 2 * this.leftRightOffset * a_num - this.leftRightOffset
				}else if (a_count == 3) {
					if (type == ESummonType.Monster) target += 80 * a_num - 80
					else {
						if (a_num <= 0) target -= this.leftRightOffset
						else target += this.leftRightOffset * a_num
					}
				}else{
					if (type == ESummonType.Monster) target += 80 * a_num - 120
					else {
						if (a_num <= 0) target -= this.leftRightOffset
						else target += this.leftRightOffset * a_num
					}
				}
			break
			case EMonsterPos.Middle:
				if (a_count == 1) {
					if (type == ESummonType.Balloon) target += this.midOffset
				}
				else if (a_count == 2) {
					target += 2 * this.midOffset * a_num - this.midOffset
				}else if (a_count == 3) {
					if (type == ESummonType.Monster) target += this.leftRightOffset * a_num - this.leftRightOffset
					else {
						if (a_num <= 0) target -= this.midOffset
						else target += this.midOffset * a_num
					}
				}else{
					if (type == ESummonType.Monster) target += 80 * a_num - 120
					else {
						if (a_num <= 1) target += this.midOffset * a_num - 200
						else target += this.midOffset * (a_num - 1)
					}
				}
			break
			case EMonsterPos.Right:
				if (a_count == 1) {
					if (type == ESummonType.Balloon) target -= this.leftRightOffset
				}
				else if (a_count == 2) {
					target += 2 * this.leftRightOffset * a_num - this.leftRightOffset
				}else if (a_count == 3) {
					if (type == ESummonType.Monster) target += this.leftRightOffset * a_num - this.leftRightOffset
					else {
						if (a_num <= 0) target += this.leftRightOffset
						else target -= this.leftRightOffset * a_num
						// Common.log(target, a_num)
					}
				}else{
					if (type == ESummonType.Monster) target += 80 * a_num - 120
					else {
						if (a_num <= 0) target += this.leftRightOffset
						else target -= this.leftRightOffset * (a_num - 1)
					}
				}
			break
			default:
			break
		}
		return target
	}

	// 获取召唤物目标Y值
	public getSummonTargetY() {

	}

	/**
	 * 获取挑战的关卡ID
	 */
	public get level() {
		let level = 0
		if (GameConfig.guideIndex == 0) {
			// 引导关
			level = 1000
		}else{
            switch (GameConfig.gameMode) {
                case EBattleMode.Level:
                    let selectChater = PanelManager.gameSelectLevel.selectChater
                    let chapterData = GameConfig.chapterTable[selectChater.toString()]
                    if (selectChater >= GameConfig.curChpter) {
						if (GameConfig.curLevel <= 0) Common.updateCurLevel(10101)
						level = GameConfig.curLevel
                    }else{
                        level = chapterData.begin
                    }
					GameConfig.curBattleChapter = selectChater
                break
                case EBattleMode.Endless:
					level = 1001
                break
                case EBattleMode.Timelimite:
                break
                default:
                break
            }
		}
		this.levelData = GameConfig.levelTable[level.toString()]
		return level
	}

	/**获取挑战的关卡数据 */
	public get levelData() {
		return this._levelData
	}

	/**设置挑战的关卡数据 */
	public set levelData(value) {
		this._levelData = value
		this.needScore = this._levelData.normalCount
	}

	/**获取当前关卡的上一关 */
	public getLastLevel(a_level:number) {
		for (let i = 0; i < GameConfig.levelConfig.length; i++) {
			let data = GameConfig.levelConfig[i]
			if (data.next == a_level) return data.key
		}
		return -1
	}

	/**更新糖果 */
	public updateCandy(value:number) {
		this.addCandy += value
		Common.updateCurCandy(value)
	}

	/**根据连击数获取糖果奖励
	 * @param value 连击数
	 */
	public comboRewardCandy(value:number) {
		if (value > 0 && value % 15 == 0) {
			let extra = Math.floor(value / 15)
			this.extra += extra
			this.extra = Math.min(3, this.extra)
			// this.updateCandy(extra)
		}
	}

	private _levelData:any
}