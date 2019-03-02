class GameSceneData {
	public constructor() {
		this.allActors = new Array()
	}

	public allActors:Array<BaseActor>

	/**过关需要的分值 */
	public needScore:number

	// 获取召唤物目标X值
	public getSummonTargetX(e_pos:EMonsterPos, a_x:number, a_y:number, a_count:number = 0, a_num:number = 0, isBoss:boolean = false) {
		switch (e_pos) {
			case EMonsterPos.Left:
				
			break
			case EMonsterPos.Middle:
			break
			case EMonsterPos.Right:
			break
			default:
			break
		}
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
                    let selectChater = PanelManager.m_gameSelectLevel.selectChater
                    let chapterData = GameConfig.chapterTable[selectChater.toString()]
                    if (selectChater >= GameConfig.curChpter) {
						if (GameConfig.curLevel <= 0) Common.UpdateCurLevel(10101)
						level = GameConfig.curLevel
                    }else{
                        level = chapterData.begin
                    }
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
		return this.m_levelData
	}

	/**设置挑战的关卡数据 */
	public set levelData(value) {
		this.m_levelData = value
		this.needScore = this.m_levelData.normalCount
	}

	/**获取当前关卡的上一关 */
	public GetLastLevel(a_level:number) {
		for (let i = 0; i < GameConfig.levelConfig.length; i++) {
			let data = GameConfig.levelConfig[i]
			if (data.next == a_level) return data.key
		}
		return -1
	}

	private m_levelData:any
}