class GameSceneData {
	public constructor() {
		this.allActors = new Array()
		this.recordBabySource = new Array()
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
	/**无尽分数增加索引 */
	public soreIndex:number = 1
	/**无尽连击增加索引 */
	public comboIndex:number = 1
	/** */
	public chapter:number = 0
	/**继续次数 */
	public continueCount:number = 0
	/**分数奖励是否领取 */
	public isScoreRewardGet = false
	/**连击奖励是否领取 */
	public isComboRewardGet = false
	/**奖励宠物图片资源**/
	public recordBabySource:Array<string>

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
			this.chapter = 1001
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
					this.chapter = selectChater
                break
                case EBattleMode.Endless:
					level = 1001
					this.chapter = 1000
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

	/**判断是否本章最后一关 */
	public isChapterFinal() {
		let nextLevel = this._levelData.next
		if (nextLevel != null && nextLevel > 0) {
			let levelData = GameConfig.levelTable[nextLevel.toString()]
			if (levelData.section == this.chapter) {
				return false
			}
		}
		return true
	}

	/**获取关卡奖励 */
	public getLevelReward(score:number, combo:number, isEnd:boolean = false) {
		let chapterData = GameConfig.chapterTable[this.chapter.toString()]
		if (chapterData.reward && chapterData.reward[0] > 0) {
			for (let i = 0; i < chapterData.reward.length; i++) {
				let rewardId = chapterData.reward[i]
				let rewardData = GameConfig.levelRewardTable[rewardId]
				switch (rewardData.condition) {
					case ELevelRewardCondition.Finish:
						if (isEnd == true && this.isChapterFinal() && this.chapter == GameConfig.curChpter) {
							this._rewardHandle(rewardData.reward, rewardData.value)
						}
					break
					case ELevelRewardCondition.EnoughScore:
						if (!this.isScoreRewardGet && score >= rewardData.count) {
							this.isScoreRewardGet = true
							this._rewardHandle(rewardData.reward, rewardData.value)
						}
					break
					case ELevelRewardCondition.EnoughCombo:
						if (!this.isComboRewardGet && combo >= rewardData.count) {
							this.isComboRewardGet = true
							this._rewardHandle(rewardData.reward, rewardData.value)
						}
					break
					case ELevelRewardCondition.OnesFinish:
						if (isEnd == true && this.isChapterFinal() && this.continueCount <= 0 && this.chapter == GameConfig.curChpter) {
							this._rewardHandle(rewardData.reward, rewardData.value)
						}
					break
					case ELevelRewardCondition.RepeatFinish:
						if (isEnd == true && this.isChapterFinal() && this.chapter < GameConfig.curChpter) {
							this._rewardHandle(rewardData.reward, rewardData.value)
						}
					break
				}
			}
		}
	}

	/**关卡奖励数据处理 */
	private _rewardHandle(rewardId:number, value:number) {
		if (rewardId == 1000) {
			this.extra += value
			this.updateCandy(value)
			PanelManager.gameScenePanel.updateExtarCandy(value)
		}else{
			if (rewardId > 0) {
				this.unlockBaby(rewardId)
				let data = GameConfig.actorTable[rewardId] //保存奖励对应图片
				this.recordBabySource.push(data.recordIcon);
			}
		}
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

	/**解锁宝宝 */
	public unlockBaby(id:number) {
		let index = GameConfig.babyUnlockList.indexOf(id)
		if (index < 0) {
			// 未解锁
			GameConfig.babyUnlockList.push(id)
			Common.updateUnlockBaby()
			PanelManager.gameScenePanel.unlockEffect(id)
		}
	}

	/**分数解锁 */
	public scoreUnlock(value:number) {
		switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.getLevelReward(value, 0)
            break
            case EBattleMode.Endless:
                this.extra = 0
                let extra = Math.floor(value / 500)
                if (this.soreIndex == extra) {
                    this.soreIndex++
                    this.extra += extra * 5
                    this.updateCandy(this.extra)
					PanelManager.gameScenePanel.updateExtarCandy(this.extra)
                }
                if (value >= 5000) {
                    this.unlockBaby(10110)
                }
                if (value >= 10000) {
                    this.unlockBaby(10120)
                }
            break
            case EBattleMode.Timelimite:
            break
            default:
            break
        }
	}

	/**连击解锁 */
	public comboUnlock(value:number) {
		switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.getLevelReward(0, value)
            break
            case EBattleMode.Endless:
                this.extra = 0
                let extra = Math.floor(value / 10)
                if (this.comboIndex == extra) {
                    this.comboIndex++
                    this.extra += extra
                    this.updateCandy(this.extra)
					PanelManager.gameScenePanel.updateExtarCandy(this.extra)
                }
                if (value >= 50) {
                    this.unlockBaby(10170)
                }
            break
            case EBattleMode.Timelimite:
            break
            default:
            break
        }
	}

	private _levelData:any
}