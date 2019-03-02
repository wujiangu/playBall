class GameScenePanel extends BasePanel {
	public constructor() {
		super()
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameScenePanel.exml"
        this.m_monsters = new Array()
        this.m_bullets = new Array()
        this.m_luckyActors = new Array()
        this.m_summonActors = new Array()
        this.m_spiderActors = new Array()
        this.m_data = new GameSceneData()
	}

	// 初始化面板
    public initPanel():void{
        this.m_gestureShape = new egret.Shape()
        this.m_gesture = new Gesture()
		this.m_gesture.Init()
        this.m_currentItemId = 0
        this._particleLayer = new egret.Sprite()
		this.addChild(this._particleLayer)

        // //获取纹理
        // let image = RES.getRes("putParticle_png")
        // //获取配置
        // var config = RES.getRes("putParticle_json")
		// this._particle = new particle.GravityParticleSystem(image, config)
        // this._particleLayer.addChild(this._particle)
    }

    public Init() {
        this.ClearAllActor()
        this.touchChildren = false
        this.readyAnimate.play(0)
        GameVoice.readyGoSound.play(0, 1).volume = GameConfig.soundValue / 100
        this.m_imgEffectMask.visible = false
        this.m_rectWarning.visible = false
        this.m_bitLabScore.visible = false
        this.m_fntCombo.visible = false
        this.m_fntComboCount.visible = false
        this.m_spiderWebArmatureContainer.visible = false
        this.m_imgBossWarning.visible = false
        this.itemUnlockGroup.visible = false
        this.m_normalCount = 0
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
        this.initData()
        if (GameVoice.battleBGMChannel != null) GameVoice.battleBGMChannel.stop()
        GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0)
        GameVoice.battleBGMChannel.volume = 0.8 * GameConfig.bgmValue / 100
    }

    public ContinueLevel() {
        let nextId:number = this.m_data.levelData.next
        let nextData = GameConfig.levelTable[nextId.toString()]
        if (nextId == null || nextId < 0 || nextData == null) {
            this.ReturnSelectLevel()
            console.error("没有下一关卡数据")
            return
        }else{
            if (nextData.section != this.m_data.levelData.section) {
                this.ReturnSelectLevel()
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key)
            }else{
                this.touchChildren = true
                this.m_baby.gotoRun()
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key)
                this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
                Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
                GameManager.Instance.Start()
            }
        }
    }

    public ReturnSelectLevel() {
        GameManager.Instance.GameState = EGameState.Ready
		Common.dispatchEvent(MainNotify.closeGamePanel)
		Common.dispatchEvent(MainNotify.openGameSelectLevel)
    }

    public Exit() {
        this.m_imgEffectMask.visible = false
        this.touchChildren = false
        this.m_gesture.removeEvent()
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
        this.m_baby.gotoIdle()
    }

    // 初始化面板数据
    public initData():void{
        GameConfig.gestureType = 0
        this.m_monsterAddDelay = 0
        this.m_luckyAddDelay = 0
        this.m_angle = 180
        this.Power = 89
        this.m_slowDelay = -1
        this.m_comboDelay = -1
        this.m_comboCount = 0
        GameConfig.curCombo = 0
        this.m_isBoom = false
        this.m_baby.initData()
        let level = this.m_data.level
        this.Score = 0
        this.UpdeLevelData(level, null)
    }

    public UpdeLevelData(a_levelId:number, a_curId:number) {
        this.m_monsterAddDelay = 0
        this.m_levelState = ELevelType.Normal
        this.m_isLuck = false
        this.m_rectWarning.fillColor = 0xff0000
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.m_data.levelData = GameConfig.levelTable[a_levelId.toString()]
                let chapterId:number = this.m_data.levelData.section
                let chapterData = GameConfig.chapterTable[chapterId.toString()]
                // Common.log("UpdeLevelData", a_levelId, chapterId)
                if (this.m_data.levelData.section >= GameConfig.curChpter) {
                    if (a_levelId > chapterData.begin) {
                        let lastLevel = a_curId
                        if (a_curId == null) lastLevel = this.m_data.GetLastLevel(a_levelId)
                        let lastLevelData = GameConfig.levelTable[lastLevel.toString()]
                        this.Score = lastLevelData.normalCount
                    }
                    Common.UpdateCurLevel(a_levelId)
                    Common.UpdateCurChpter(this.m_data.levelData.section)
                }
                GameManager.Instance.updateSceneBg(chapterData.bg)
            break
            case EBattleMode.Endless:
                GameManager.Instance.updateSceneBg("Bg1_png")
                this.m_data.levelData = GameConfig.levelTable[a_levelId.toString()]
                if (a_levelId == this.m_data.levelData.next) {
                    this.m_data.needScore += this.m_normalCount * 200
                    this.m_normalCount++
                }
            break
            case EBattleMode.Timelimite:
            break
            default:
            break
        }
        GameConfig.gameSpeedPercent = this.m_data.levelData.speed

        if (a_levelId == 1000) {
            GameConfig.isGuide = true
            this.m_rectWarning.fillColor = 0x000000
            this.m_isLuck = true
            this.m_gesture.removeEvent()
            Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
        }
    }

    public GuideStart() {
        this.m_rectWarning.visible = true
        if (GameConfig.guideIndex == 0) {
            this.m_guideArmatureContainer.play("xinshouyindao", 0)
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.Balloons.length; j++) {
                    let balloon:Balloon = monster.Balloons[j]
                    balloon.GuideStart()
                }
            }
            this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
            Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
        }else{
            
        }
    }

    public GuideEnd() {
        this.m_rectWarning.visible = false
        // this.m_guideArmatureContainer.stop()
        // this.m_guideArmatureContainer.visible = false
        GameConfig.isGuide = false
        this.Power = 0
        Common.UpdateGuide(2)
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this)
    }

    // 进入面板
    public onEnter():void{
        Common.curPanel = PanelManager.m_gameScenePanel
        Common.gameScene().uiLayer.addChild(this)
        this.Init()
    }

    // 退出面板
    public onExit():void{
        this.ClearAllActor()
		Common.gameScene().uiLayer.removeChild(this)
        this.Exit()
        GameVoice.battleBGMChannel.stop()
    }

    public Update(timeElapsed:number) {
        let actorElapsed = timeElapsed
        if (this.m_slowDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
            this.m_slowDelay += timeElapsed
            if (this.m_slowDelay >= this.m_baby.skillData.time) {
                this.m_slowDelay = -1
            }
        }

        if (GameManager.Instance.GameState == EGameState.Start) {
            if (this.m_slowDelay >= 0) actorElapsed *= 0.2

            if (this.m_levelState == ELevelType.Normal) {
                this.m_monsterAddDelay += timeElapsed
            }else{
                this.m_monsterAddDelay = 0
            }
            
            this.m_luckyAddDelay += timeElapsed

            // 连击
            if (this.m_comboDelay >= 0) {
                this.m_comboDelay += actorElapsed
                if (this.m_comboDelay >= GameConfig.comboDelay) {
                    this.m_comboDelay = -1
                    GameConfig.curCombo = Math.max(this.m_comboCount, GameConfig.curCombo)
                    this.m_comboCount = 0
                    this.m_isBoom = false
                    this.comboMove.stop()
                    this.comboEnd.play(0)
                    
                    for (let i = 0; i < this.m_monsters.length; i++) {
                        let monster:Monster = this.m_monsters[i]
                        if (monster.Type == EMonsterDifficult.Normal) {
                            monster.ResetVertical()
                        }
                    }

                    for (let i = 0; i < this.m_summonActors.length; i++) {
                        let summon:SummonActor = this.m_summonActors[i]
                        summon.ResetVertical()
                    }
                }
            }


            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                if (monster.State == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._Warning()
                }
                this.m_baby.ReleaseSkill(this.m_score, ESkillReleaseType.Range, monster)
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                if (summon.State == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._Warning()
                }
                this.m_baby.ReleaseSkill(this.m_score, ESkillReleaseType.Range, summon)
            }

            

            if (this.m_score < this.m_data.needScore && this.m_monsterAddDelay >= this.m_data.levelData.addTime) {
                this.m_monsterAddDelay = 0
                this._CreateMonster()
                if (GameConfig.isGuide) this.m_score++
            }

            if (this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay && !GameConfig.isGuide) {
                this.m_luckyAddDelay = 0
                this._CreateLuckyActor()
            }
        }

        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(actorElapsed)
            }

            for (let i = 0; i < this.m_spiderActors.length; i++) {
                this.m_spiderActors[i].Update(actorElapsed)
            }
        }

        if (GameManager.Instance.GameState == EGameState.Start) {
            for (let i = 0; i < this.m_bullets.length; i++) {
                this.m_bullets[i].Update(timeElapsed)
            }

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                this.m_luckyActors[i].Update(actorElapsed)
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                this.m_summonActors[i].Update(actorElapsed)
            }

            this.m_baby.update(timeElapsed)
        }
    }

    public RemoveMonster(a_monster:Monster) {
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i])
                this.m_monsters.splice(i, 1)
                // this._CreateMonster()
                break
            }
        }
        this._ChangeLevel()
    }

    public RemoveBullet(a_bullet:Bullet) {
        for (let i = 0; i < this.m_bullets.length; i++) {
            if (this.m_bullets[i] == a_bullet) {
                this.m_groupGameEffect.removeChild(this.m_bullets[i])
                this.m_bullets.splice(i, 1)
                break
            }
        }
    }

    public RemoveLuckyActor(a_lucky:LuckyActor) {
        for (let i = 0; i < this.m_luckyActors.length; i++) {
            if (this.m_luckyActors[i] == a_lucky) {
                this.m_groupGame.removeChild(this.m_luckyActors[i])
                this.m_luckyActors.splice(i, 1)
                break
            }
        }
    }

    public RemoveSummonActor(a_summon:SummonActor) {
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i] == a_summon) {
                this.m_groupGame.removeChild(this.m_summonActors[i])
                this.m_summonActors.splice(i, 1)
                break
            }
        }
        this._ChangeLevel()
    }

    public RemoveSpiderActor(a_spider:SpiderActor) {
        for (let i = 0; i < this.m_spiderActors.length; i++) {
            if (this.m_spiderActors[i] == a_spider) {
                this.m_groupGame.removeChild(this.m_spiderActors[i])
                this.m_spiderActors.splice(i, 1)
                break
            }
        }
        this._ChangeLevel()
    }

    public ClearAllActor() {
        while(this.m_monsters.length > 0) {
			let monster:Monster = this.m_monsters.pop()
			monster.Destroy()
			this.m_groupGame.removeChild(monster)
		}

        while(this.m_bullets.length > 0) {
            let bullet:Bullet = this.m_bullets.pop()
            bullet.Destroy()
            this.m_groupGameEffect.removeChild(bullet)
        }

        while(this.m_luckyActors.length > 0) {
            let lucky:LuckyActor = this.m_luckyActors.pop()
            lucky.Destroy()
            this.m_groupGame.removeChild(lucky)
        }

        while(this.m_summonActors.length > 0) {
            let summon:SummonActor  = this.m_summonActors.pop()
            summon.Destroy()
            this.m_groupGame.removeChild(summon)
        }

        while(this.m_spiderActors.length > 0) {
            let spider:SpiderActor = this.m_spiderActors.pop()
            spider.Destroy()
            this.m_groupGame.removeChild(spider)
        }
    }

    public GetAllActors() {
        this.m_data.allActors.length = 0
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].State == EMonsterState.Ready) {
                this.m_data.allActors.push(this.m_monsters[i])
            }
        }
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].State == EMonsterState.Ready) {
                this.m_data.allActors.push(this.m_summonActors[i])
            }
        }
        return this.m_data.allActors
    }

    /**是否没有生还的怪物或者召唤物 */
    public IsNoneAlive() {
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].State == EMonsterState.Ready) {
                return false
            }
        }
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].State == EMonsterState.Ready) {
                return false
            }
        }
        return true
    }

    public get Score() {
        return this.m_score
    }

    public set Score(value:number) {
        this.m_score = value
        this.m_bitLabScore.text = this.m_score.toString()
        if (this.m_score >= this.m_data.needScore * 0.5 && !this.m_isLuck) {
            //引导关没有
            this.m_isLuck = true
            GameConfig.gameSpeedPercent = GameConfig.gameSpeedPercent * 1.1
        }
    }

    public get Power() {
        return this.m_power
    }

    public set Power(value:number) {
        if (this.m_baby == null) return
        this.m_power = value
        this.m_angle = 180 + this.m_power * 2
        this.m_angle = Math.min(this.m_angle, 360)
        this.m_baby.updateProgress(this.m_angle)
        this.m_baby.ReleaseSkill(this.m_angle, ESkillReleaseType.Immediately)
    }

    public get GroundPos() {
        return this.m_imgGroundLine.y
    }

    public get GuidePos() {
        return this.m_imgGuide.y
    }

    public get WaterPos() {
        return this.m_imgGroundWater.y
    }

    public get WarningPos() {
        return this.m_imgGroundWarning.y
    }

    public get LevelStage() {
        return this.m_levelState
    }

    public ActorDeadHandle() {
        if (this.m_levelState == ELevelType.Normal && this.m_score >= this.m_data.needScore && this.IsNoneAlive()) {
            this.m_levelState = ELevelType.EliteWarning
        }
        // Common.log(this.m_levelState, this.m_score, this.m_currentLevel.normalCount, this.IsNoneAlive())
        if (this.m_levelState == ELevelType.EliteWarning) {
            if (GameConfig.isGuide) {
                this.Score = 0
                if (GameConfig.guideIndex == 0) {
                    this.Power = 90
                    GameConfig.guideIndex = 1
                    this.m_rectWarning.visible = false
                    this.m_guideArmatureContainer.stop()
                    this.m_guideArmatureContainer.visible = false
                    this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key)
                    this.GuideEnd()
                    // this.UpdeLevelData(1000)
                    // this.m_gesture.removeEvent()
                    // Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
                }else{
                    this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key)
                    this.GuideEnd()
                }
            }else{
                this.m_levelState = ELevelType.End
                this._EnterWarning()
            }
        }
    }

    public get Boom() {
        return this.m_isBoom
    }

    public set Boom(value:boolean) {
        this.m_isBoom = value
    }

    /**更新连击 */
    public UpdateBatter() {
        if (this.m_isBoom) {
            this.m_comboDelay = 0
            this.m_comboCount += 1
            this.m_isBoom = false
            if (this.m_comboCount >= 2) {
                this.m_fntCombo.visible = true
                this.m_fntComboCount.visible = true
                this.m_fntComboCount.text = "X" + this.m_comboCount
                this.m_comboArmatureContainer.y = 80
                this.m_comboArmatureContainer.visible = true
                if (this.m_comboCount < 6) {
                    this.m_fntCombo.font = RES.getRes("comboBlueFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboBlueFnt_fnt")
                    this.m_comboArmatureContainer.play("lan", 1)
                    GameVoice.combo2Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 6 && this.m_comboCount < 11) {
                    this.m_fntCombo.font = RES.getRes("comboYellowFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboYellowFnt_fnt")
                    this.m_comboArmatureContainer.play("lan", 1)
                    GameVoice.combo3Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 11 && this.m_comboCount < 16) {
                    this.m_fntCombo.font = RES.getRes("comboRedFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboRedFnt_fnt")
                    this.m_comboArmatureContainer.play("huang", 1)
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 16 && this.m_comboCount < 26) {
                    this.m_fntCombo.font = RES.getRes("comboPurpleFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboPurpleFnt_fnt")
                    this.m_comboArmatureContainer.play("hong", 1)
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }else{
                    this.m_fntCombo.font = RES.getRes("comboGreenFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboGreenFnt_fnt")
                    this.m_comboArmatureContainer.play("hong", 1)
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                this.comboBegin.play(0)

                if (this.m_comboCount <= 5) GameConfig.balloonScore += 2
                else if (this.m_comboCount > 5 && this.m_comboCount <= 10) GameConfig.balloonScore += 3
                else GameConfig.balloonScore += 4
                let addSpeed = Math.min(6, this.m_comboCount) * 0.02
                for (let i = 0; i < this.m_monsters.length; i++) {
                    let monster:Monster = this.m_monsters[i]
                    if (monster.Type == EMonsterDifficult.Normal) {
                        monster.SetVertical(addSpeed)
                    }
                }

                for (let i = 0; i < this.m_summonActors.length; i++) {
                    let summon:SummonActor = this.m_summonActors[i]
                    summon.SetVertical(addSpeed)
                }
            }
            if (this.m_comboCount <= 2) GameConfig.comboDelay = 1200
            else GameConfig.comboDelay = 1000
        }
        if (this.m_levelState == ELevelType.Normal) this.Score += GameConfig.balloonScore
        this.Score = Math.min(this.m_data.needScore, this.m_score)
        this.ActorDeadHandle()
    }

    private _Warning() {
        this.m_rectWarning.visible = true
        this.m_isWarning = true
        this.warning.play(0)
    }

    /**
     * 释放技能
     */
    public ReleaseSkill() {
        if (this.m_angle >= 360) {
            // this.m_imgEffectMask.visible = true
            // this.effectMask.play(0)
            // this._UpdateItemArmature(true)
            this.m_angle = 180
            this.m_power = 0
            this.m_baby.gotoAttack()
        }
    }

    /**
     * 进入下一关
     */
    private _ChangeLevel() {
        if (this.m_monsters.length <= 0 
            && this.m_summonActors.length <= 0 
            && this.m_spiderActors.length <= 0
            && this.m_levelState == ELevelType.Elite) 
        {
            if (GameConfig.gameMode == EBattleMode.Level) {
                GameManager.Instance.EndLevel()
            }else{
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key)
            }
        }
    }

    /**
     * 进入boss
     */
    private _EnterWarning() {
        this.m_imgBossWarning.visible = true
        this.bossWarning.play(0)
        GameVoice.bossWarning.play(0, 1)
        // egret.setTimeout(this._EnterBoss, this, 2000)
    }

    private _EnterBoss() {
        this.m_imgBossWarning.visible = false
        // 1.5s后BOSS创建
        egret.setTimeout(this._BossArrive, this, 1500)
    }

    private _BossArrive() {
        this.m_levelState = ELevelType.Elite
        let m_sumWeight = 0
		for (let i = 0; i < this.m_data.levelData.elite.length; i++) {
			m_sumWeight += this.m_data.levelData.elite[i].prob
			this.m_data.levelData.elite[i].weight = m_sumWeight
		}
		let random = MathUtils.getRandom(1, m_sumWeight)
		for (let i = 0; i < this.m_data.levelData.elite.length; i++) {
			if (random <= this.m_data.levelData.elite[i].weight) {
                this.m_bossData = this.m_data.levelData.elite[i]
				break
			}
		}
        if (this.m_bossData.id == 1006) {
            this.PlaySpiderWebArmature("arrive1", 1)
        }
        else this._CreateMonster()
    }

    public get Boss() {
        return this.m_bossData
    }

    private m_bossData:any

    private _OnGesture() {
        if (GameConfig.gestureType > 0) {
            GameConfig.balloonScore = 0
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.Balloons.length; j++) {
                    let balloon:Balloon = monster.Balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        monster.BallExplosion(balloon)
                    }
				}
            }

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                let lucky:LuckyActor = this.m_luckyActors[i]
                if (lucky.ballon.type == GameConfig.gestureType) {
                    lucky.UpdateGesture()
                }
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                if (summon.GestureType == GameConfig.gestureType) {
                    summon.GotoDead()
                }
            }

            for (let i = 0 ; i < this.m_spiderActors.length; i++) {
                let spider:SpiderActor = this.m_spiderActors[i]
                for (let j = 0; j < spider.Balloons.length; j++) {
                    let balloon:Balloon = spider.Balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        spider.BallExplosion(balloon)
                    }
				}
            }
            this.UpdateBatter()
        }
    }

    private _OnBtnPause() {
        GameManager.Instance.Pause()
    }

    private _OnReadyComplete() {
        this.touchChildren = true
        this.m_bitLabScore.visible = true
        GameManager.Instance.Start()
        this.m_baby.gotoRun()
    }

    private _OnWarningComplete() {
        this.m_isWarning = false
        this.m_rectWarning.visible = false
    }

    private _OnComboBeginComplete() {
        this.comboMove.play(0)
    }

    private _OnComboEndComplete() {
        this.m_fntCombo.visible = false
        this.m_fntComboCount.visible = false
    }

    private _OnComboMoveComplete() {
        this.comboMove.play(0)
    }

    public PlaySpiderWebArmature(action:string, a_stage:number) {
        this.m_spiderWebArmatureContainer.visible = true
        this.m_spiderWebArmatureContainer.play(action, 1)
        this.m_spiderStage = a_stage
    }

    private _OnSpiderWebArmatureComplete() {
        switch (this.m_spiderStage) {
            case 1:
                this._CreateSpiderActor()
                this.PlaySpiderWebArmature("arrive2", 2)
            break
            case 2:
                
            break
            case 5:
                for (let i = 0; i < this.m_spiderActors.length; i++) this.m_spiderActors[i].GotoMove()
            break
        }
    }

    private _OnSpiderWebArmatureFrame() {

    }

    private _ComboArmature() {
        this.m_comboArmatureContainer.visible = false
    }

	private onComplete() {
        this.m_comboArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupScore.addChild(this.m_comboArmatureContainer)
        let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("Detonationexplosion", "Detonationexplosion")
        let comboArmature = new DragonBonesArmature(armatureDisplay)
        comboArmature.ArmatureDisplay = armatureDisplay
        this.m_comboArmatureContainer.register(comboArmature, ["hong", "huang", "lan"])
        this.m_comboArmatureContainer.x = this.m_groupScore.width / 2
        this.m_comboArmatureContainer.addCompleteCallFunc(this._ComboArmature, this)
        
        this.m_spiderWebArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupGame.addChild(this.m_spiderWebArmatureContainer)
        let spiderWebDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("wang", "wang")
        let spiderArmature = new DragonBonesArmature(spiderWebDisplay)
        spiderArmature.ArmatureDisplay = spiderWebDisplay
        this.m_spiderWebArmatureContainer.register(spiderArmature, ["arrive1","arrive2","attack","dead","idle"])
        this.m_spiderWebArmatureContainer.x = Config.stageHalfWidth
        this.m_spiderWebArmatureContainer.y = 420
        this.m_spiderWebArmatureContainer.addCompleteCallFunc(this._OnSpiderWebArmatureComplete, this)
        this.m_spiderWebArmatureContainer.addFrameCallFunc(this._OnSpiderWebArmatureFrame, this)
        this.m_spiderWebArmatureContainer.scaleX = 2.2
        this.m_spiderWebArmatureContainer.scaleY = 2.2

        this.m_guideArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupFull.addChild(this.m_guideArmatureContainer)
        let guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao")
        let guideArmature = new DragonBonesArmature(guideDisplay)
        guideArmature.ArmatureDisplay = guideDisplay
        this.m_guideArmatureContainer.register(guideArmature, ["xinshouyindao"])
        this.m_guideArmatureContainer.x = 50
        this.m_guideArmatureContainer.y = -500

        this.m_baby = new Baby()
        this.m_groupGame.addChild(this.m_baby)
        this.m_baby.y = Config.stageHeight * 0.9
        
        this.addChild( this.m_gestureShape )
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this)
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this)
        this.warning.addEventListener('complete', this._OnWarningComplete, this)

        this.comboBegin.addEventListener('complete', this._OnComboBeginComplete, this)
        this.comboEnd.addEventListener('complete', this._OnComboEndComplete, this)
        this.comboMove.addEventListener('complete', this._OnComboMoveComplete, this)
        this.bossWarning.addEventListener('complete', this._EnterBoss, this)
        
        Common.addTouchBegin(this.m_btnPause)
		this._OnResize()
	}

    public SetParticle(a_visible:boolean, x:number, y:number) {
		// this._particle.visible = a_visible
		// if (a_visible) {
		// 	this._particle.start(1)
		// }
		// this._particle.emitterX = x
		// this._particle.emitterY = y
	}

    private _CreateMonster() {
        let monster:Monster = GameObjectPool.getInstance().createObject(Monster, "Monster")
        monster.Init(this.m_data.levelData, this.m_levelState)
        monster.UpdateEffectArmature(this.m_baby.skillData)
        this.m_monsters.push(monster)
        for (let i = this.m_monsters.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_monsters[i])
		}
    }

    private _CreateLuckyActor() {
        let lucky:LuckyActor = GameObjectPool.getInstance().createObject(LuckyActor, "LuckyActor")
        lucky.Init()
        this.m_luckyActors.push(lucky)
        this.m_groupGame.addChild(lucky)
    }

    private _CreateSpiderActor() {
        let spider:SpiderActor = GameObjectPool.getInstance().createObject(SpiderActor, "SpiderActor")
        spider.Init(this.m_data.levelData)
        this.m_spiderActors.push(spider)
        this.m_groupGame.addChild(spider)
    }

    public CreateSummonActor(a_data:any, a_x:number, a_y:number, a_count:number = 0, a_num:number = 0, isBoss:boolean = false) {
        let summon:SummonActor = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor")
        
        let posX = this.m_data.getSummonTargetX(EMonsterPos.Left, a_x, a_y, a_count, a_num, isBoss)

        let flag = MathUtils.getRandom(1, 2)
        let targetX = 0
        if (flag == 1) targetX = a_x + MathUtils.getRandom(-250, -100)
        else targetX = a_x + MathUtils.getRandom(100, 250)
        let targetY = a_y + MathUtils.getRandom(-20, 20)

        // summon.UpdateEffectArmature(effectData)

        summon.Init(a_data, targetX, targetY, a_x, a_y, a_count, a_num, isBoss)
        this.m_summonActors.push(summon)
        for (let i = this.m_summonActors.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_summonActors[i])
		}
    }

    protected _OnResize(event:egret.Event = null)
    {
		
    }

    private m_data:GameSceneData
    private _particleLayer:egret.Sprite
    // private _particle:particle.GravityParticleSystem
    /**生成怪物时间 */ 
    private m_monsterAddDelay:number
    /**生成幸运角色时间 */
    private m_luckyAddDelay:number
    private m_comboDelay:number
    private m_comboCount:number
    private m_isBoom:boolean

    private m_monsters:Array<Monster>
    private m_bullets:Array<Bullet>
    private m_luckyActors:Array<LuckyActor>
    private m_summonActors:Array<SummonActor>
    private m_spiderActors:Array<SpiderActor>
    

    private m_score:number
    private m_power:number
    private m_slowDelay:number
    private m_currentItemId:number

    /**关卡配置数据 */
    // private m_currentLevel:any
    /**当前关卡状态 */
    private m_levelState:ELevelType
    private m_normalCount:number
    private m_isWarning:boolean
    private m_isLuck:boolean
    ///////////////////////////////////////////////////////////////////////////

    private itemUnlockGroup:eui.Group
    private itemBg:eui.Image
    private itemIcon:eui.Image
    private itemUnlock:egret.tween.TweenGroup

	private m_bitLabScore:eui.BitmapLabel
    private m_imgEffectMask:eui.Image
    private m_imgGroundLine:eui.Image
    private m_imgGroundWater:eui.Image
    private m_imgGroundWarning:eui.Image
    private m_imgGuide:eui.Image
    private m_rectWarning:eui.Rect
    private m_btnPause:eui.Button

    private m_fntCombo:eui.BitmapLabel
    private m_fntComboCount:eui.BitmapLabel
    private combo:egret.tween.TweenGroup
    private comboBegin:egret.tween.TweenGroup
    private comboEnd:egret.tween.TweenGroup
    private comboMove:egret.tween.TweenGroup
    private bossWarning:egret.tween.TweenGroup
    private m_imgBossWarning:eui.Image

	private m_groupScore:eui.Group
	private m_groupBottom:eui.Group
    private m_groupGame:eui.Group
    private m_groupGameEffect:eui.Group
    private m_groupGesture:eui.Group
    private m_groupFull:eui.Group
    private m_gestureShape:egret.Shape
	private m_gesture:Gesture

    private readyAnimate:egret.tween.TweenGroup
    private effectMask:egret.tween.TweenGroup
    private warning:egret.tween.TweenGroup

	private m_angle:number

    private m_comboArmatureContainer:DragonBonesArmatureContainer
    private m_comboArmature:DragonBonesArmature

    private m_spiderWebArmatureContainer:DragonBonesArmatureContainer
    private m_spiderStage:number

    private m_guideArmatureContainer:DragonBonesArmatureContainer

    private m_baby:Baby
}