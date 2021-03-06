class GameScenePanel extends BasePanel {
	public constructor() {
		super()
        this._arrayProgress = new Array()
        this.addEventListener(eui.UIEvent.COMPLETE, this.onComplete, this)
        this.skinName = "resource/game_skins/gameScenePanel.exml"
        this.m_monsters = new Array()
        this.m_luckyActors = new Array()
        this.m_summonActors = new Array()
        this.m_spiderActors = new Array()
        this.m_eliteActors = new Array()
        
        this._data = new GameSceneData()
	}

	// 初始化面板
    public initPanel():void{
        this.m_gestureShape = new egret.Shape()
        this.m_gesture = new Gesture()
		this.m_gesture.init()
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

    public init() {
        this.clearAllActor()
        this.touchChildren = false
        this.readyAnimate.play(0)
        if(GameConfig.isPlaySound)   GameVoice.readyGoSound.play(0, 1).volume = GameConfig.soundValue / 100
        this.m_imgEffectMask.visible = false
        this.m_rectWarning.visible = false
        this.m_bitLabScore.visible = false
        this.m_fntCombo.visible = false
        this.m_fntComboCount.visible = false
        this._commbGrop.visible = false
        this.m_spiderWebArmatureContainer.visible = false
        this.m_imgBossWarning.visible = false
        this.itemUnlockGroup.visible = false
        this._imgGuide.visible = false
        this._imgGuideTip.visible = false        
        this._imgGuideTip.source = "imgGuide4_png";
        this._groupCandy.visible = false
        this.m_normalCount = 0
        this._data.soreIndex = 1
        this._data.comboIndex = 1
        this.m_exSkillEffect.hide()
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._onGesture, this)
        this.initData()
        if (GameVoice.battleBGMChannel != null) GameVoice.battleBGMChannel.stop()
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                let chapterData = GameConfig.chapterTable[this._data.levelData.section.toString()]
                let voice:egret.Sound = RES.getRes(chapterData.bgm)
                if(GameConfig.isPlaySound)  GameVoice.battleBGMChannel = voice.play(0)
                this.m_groupGrogress.visible = true
                this._curLevel.visible = true
                if(this._data.levelData.level < 7){//显示关卡信息
                    this._nextLevel.visible = true
                    this.m_nextBg.visible = true
                    this.m_nextBg.source = "battleBg02_png";
                    this._imgBossIcon.visible = false
                    this._nextLevel.text = (this._data.levelData.level + 1).toString()                    
                }else{
                    this.m_nextBg.visible = false
                    this._nextLevel.visible = false
                    this._imgBossIcon.visible = true                    
                }                
            break
            case EBattleMode.Endless:
                if(GameConfig.isPlaySound)  GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0)
                this.m_groupGrogress.visible = false
                this._curLevel.visible = false
                this._nextLevel.visible = false
                this.m_nextBg.visible = false
            break
            case EBattleMode.Timelimite:
            break
            default:
            break
        }        
        if(GameConfig.isPlaySound)     GameVoice.battleBGMChannel.volume = 0.8 * GameConfig.bgmValue / 100
    }

    public continueLevel() {
        let nextId:number = this._data.levelData.next
        let nextData = GameConfig.levelTable[nextId.toString()]
        if (nextId == null || nextId < 0 || nextData == null) {
            this.returnSelectLevel()
            console.error("没有下一关卡数据")
            return
        }else{
            if (nextData.section != this._data.levelData.section) {
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                this.returnSelectLevel()
            }else{
                this.touchChildren = true
                this.m_baby.gotoRun()
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
                Common.addEventListener(MainNotify.gestureAction, this._onGesture, this)
                this.score = 0
                this.SetRealScore(0)
                GameManager.Instance.start()
            }
        }
    }

    public playExSkillEffect(a_id:number) {
        this.m_exSkillEffect.playEffect(a_id)
    }

    public returnSelectLevel() {
        GameManager.Instance.gameState = EGameState.Ready
        GameConfig.isOpenNewChapter = false
        if (PanelManager.gameSelectLevel.selectChater + 1 == GameConfig.curChpter) {
            GameConfig.isOpenNewChapter = true
        }
		Common.dispatchEvent(MainNotify.closeGamePanel)
		Common.dispatchEvent(MainNotify.openGameSelectLevel)
    }

    public exit() {
        this.m_imgEffectMask.visible = false
        this.touchChildren = false
        this.m_gesture.removeEvent()
        Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this)
        this.m_baby.gotoIdle()
    }

    // 初始化面板数据
    public initData():void{
        GameConfig.gestureType = 0
        this.m_monsterAddDelay = 0
        this.m_luckyAddDelay = 0
        this.power = 0
        this.m_skillDuration = -1
        this.m_comboDelay = -1
        this.m_comboCount = 0
        GameConfig.curCombo = 0
        this.m_isBoom = false
        this.m_baby.initData()
        this._data.addCandy = 0
        this._data.extra = 0
        let result = this.m_baby.skillData.result
        if (result == ESkillResult.ExtraCandy || result == ESkillResult.ExtraCombo || result == ESkillResult.ExtraScore) {
            this._powerGroup.visible = false
            this.m_btnPower.visible = false
        }else{
            this._powerGroup.visible = true
            this.m_btnPower.visible = true
        }

        let level = this._data.level
        this.score = 0
        this.SetRealScore(GameConfig.chapterLastScore[this._data.chapter.toString()])
        if (this._data.isChapterBegin()) {
            this.SetRealScore(0)
        }
        this.updeLevelData(level, null)
    }

    public updeLevelData(a_levelId:number, a_curId:number) {
        this.m_monsterAddDelay = 0
        this.m_levelState = ELevelType.Normal
        this.m_isLuck = false
        this.m_rectWarning.fillColor = 0xff0000
        this._data.levelData = GameConfig.levelTable[a_levelId.toString()]
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                let chapterId:number = this._data.levelData.section
                let chapterData = GameConfig.chapterTable[chapterId.toString()]
                if (this._data.levelData.section >= GameConfig.curChpter) {
                    if (a_levelId > chapterData.begin) {
                        let lastLevel = a_curId
                        if (a_curId == null) lastLevel = this._data.getLastLevel(a_levelId)
                        let lastLevelData = GameConfig.levelTable[lastLevel.toString()]
                        this._data.lastScore = lastLevelData.normalCount
                        // this.score = lastLevelData.normalCount
                    }
                    Common.updateCurLevel(a_levelId)
                    Common.updateCurChpter(this._data.levelData.section)
                }
                if (a_levelId > chapterData.begin) {
                    let lastLevel = a_curId
                    if (a_curId == null) lastLevel = this._data.getLastLevel(a_levelId)
                    let lastLevelData = GameConfig.levelTable[lastLevel.toString()]
                    this._data.lastScore = lastLevelData.normalCount
                }
                this._curLevel.text = this._data.levelData.level.toString()
                if(this._data.levelData.level < 7){//显示关卡信息
                    this.m_nextBg.source = "battleBg02_png";
                    this._nextLevel.text = (this._data.levelData.level + 1).toString()                    
                }else{
                    this.m_nextBg.visible = false
                    this._nextLevel.visible = false
                    this._imgBossIcon.visible = true                    
                }
                GameManager.Instance.updateSceneBg(chapterData.bg, chapterData.water)
                GameManager.Instance.updateSceneCloud(chapterData.cloud1, chapterData.cloud2)
                GameManager.Instance.updateSceneSun(chapterData.sun)
            break
            case EBattleMode.Endless:
                this.score = 0
                // GameManager.Instance.updateSceneBg("Bg1_png")
                if (a_levelId == this._data.levelData.next) {
                    // this._data.needScore += this.m_normalCount * 200
                    // this.m_normalCount++
                }
            break
            case EBattleMode.Timelimite:
            break
            default:
            break
        }
        GameConfig.gameSpeedPercent = this._data.levelData.speed
        //新手引导
        if (a_levelId == 1000) {
            GameConfig.isGuide = true
            this.m_rectWarning.fillColor = 0x000000
            this.m_isLuck = true
            this.m_gesture.removeEvent()
            Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this)
        }
    }

    //开始引导
    public guideStart() {
        this.m_rectWarning.visible = true
        this.m_guideArmatureContainer.visible = true //手指引导
        this._imgGuideTip.visible = true
        if (GameConfig.guideIndex == 0) {
            this.m_guideArmatureContainer.play("xinshouyindao", 0)
        }
        else if (GameConfig.guideIndex == 1) {
            this.m_guideArmatureContainer.play("xinshouyindao4", 0)
        }
        else if(GameConfig.guideIndex == 3){
            this._imgGuideTip.source = "imgGuide5_png";
            this.m_guideArmatureContainer.play("xinshouyindao3", 0)
            this.m_guideArmatureContainer.x = 350
            this.m_guideArmatureContainer.y = -110
            this.power = 100            
        }
        else{
            this.m_guideArmatureContainer.play("xinshouyindao", 0)
        }

        if (GameConfig.guideIndex < 3) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.balloons.length; j++) {
                    let balloon:Balloon = monster.balloons[j]
                    balloon.guideStart()
                }
            }
            this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
            Common.addEventListener(MainNotify.gestureAction, this._onGesture, this)
        }
    }

    public guideEnd() {
        this._imgGuideTip.visible = false
        this.m_rectWarning.visible = false
        GameConfig.isGuide = false
        this.power = 0
        Common.updateGuide(4)
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
        Common.addEventListener(MainNotify.gestureAction, this._onGesture, this)
    }

    // 进入面板
    public onEnter():void{
        Common.curPanel = PanelManager.gameScenePanel
        Common.gameScene().uiLayer.addChild(this)
        this.init()
    }

    // 退出面板
    public onExit():void{
        this.clearAllActor()
		Common.gameScene().uiLayer.removeChild(this)
        this.exit()
        if(GameConfig.isPlaySound)    GameVoice.battleBGMChannel.stop()

        // Common.log("怪物数量", GameObjectPool.getInstance().count, GameObjectPool.getInstance().balloon)
    }

    public setSkillDuration() {
        if (this.m_baby.skillData.time > 0) {
            this.m_skillDuration = 0
        }
    }

    public update(timeElapsed:number) {
        let actorElapsed = timeElapsed
        if (this.m_skillDuration >= 0 && GameManager.Instance.gameState == EGameState.Start) {
            this.m_skillDuration += timeElapsed
            if (this.m_skillDuration >= this.m_baby.skillData.time) {
                this.m_skillDuration = -1
            }
        }

        if (GameManager.Instance.gameState == EGameState.Start) {
            if (this.m_skillDuration >= 0) {
                switch (this.m_baby.skillData.result) {
                    case ESkillResult.ContinuedKill:
                        let range = this.m_baby.skillData.range * Config.stageHeight
                        // 全体范围内持续消除
                        for (let i = 0; i < this.m_monsters.length; i++) {
                            let monster:Monster = this.m_monsters[i]
                            if (monster.state == EMonsterState.Ready && monster.y >= range) {
                                monster.gotoDead()
                            }
                        }

                        for (let i = 0; i < this.m_summonActors.length; i++) {
                            let summon:SummonActor = this.m_summonActors[i]
                            if (summon.state == EMonsterState.Ready && summon.y >= range) {
                                summon.gotoDead()
                            }
                        }
                    break
                    case ESkillResult.SlowSpeed:
                        // 全体减速
                        actorElapsed *= 0.2
                    break
                }
            }

            if (this.m_levelState == ELevelType.Normal) {
                this.m_monsterAddDelay += actorElapsed
            }else{
                this.m_monsterAddDelay = 0
            }
            
            this.m_luckyAddDelay += timeElapsed

            // 连击
            if (this.m_comboDelay >= 0) {
                this.m_comboDelay += actorElapsed
                if (this.m_comboDelay >= GameConfig.comboDelay) {
                    this.m_comboDelay = -1
                    // GameConfig.curCombo = Math.max(this.m_comboCount, GameConfig.curCombo)
                    // this.m_comboCount = 0
                    // this.m_isBoom = false
                    this.comboMove.stop()
                    this.comboEnd.play(0)
                    
                    for (let i = 0; i < this.m_monsters.length; i++) {
                        let monster:Monster = this.m_monsters[i]
                        if (monster.type == EMonsterDifficult.Normal) {
                            monster.resetVertical()
                        }
                    }

                    for (let i = 0; i < this.m_summonActors.length; i++) {
                        let summon:SummonActor = this.m_summonActors[i]
                        summon.resetVertical()
                    }
                }
            }


            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                if (monster.state == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._warning()
                }
                this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Range, monster)
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                if (summon.state == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._warning()
                }
                this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Range, summon)
            }

            

            if (this.m_score < this._data.needScore && this.m_monsterAddDelay >= this._data.levelData.addTime) {
                this.m_monsterAddDelay = 0
                this._createMonster()
                if (GameConfig.isGuide) this.m_score++
            }

            if (this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay && !GameConfig.isGuide) {
                this.m_luckyAddDelay = 0
                this.createLuckyActor()
            }
        }

        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.End) {
            for (let i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].update(actorElapsed)
            }

            for (let i = 0; i < this.m_spiderActors.length; i++) {
                this.m_spiderActors[i].update(actorElapsed)
            }
        }

        if (GameManager.Instance.gameState == EGameState.Start) {

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                this.m_luckyActors[i].update(actorElapsed)
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                this.m_summonActors[i].update(actorElapsed)
                this._summonActorHit(this.m_summonActors[i])
            }

            this.m_baby.update(timeElapsed)
        }
    }

    private _summonActorHit(summon:SummonActor) {
        for (let j = 0; j < this.m_summonActors.length; j++) {
            let summonActor:SummonActor = this.m_summonActors[j]
            if (summonActor != summon) {
                let distance:number = MathUtils.getDistance(summon.x, summon.y, summonActor.x, summonActor.y)
                let offset:number = (summon.w + summonActor.w) / 2
                if (distance <= offset) {
                    if (summon.x < summonActor.x) {
                        summon.x -= 1
                    }else{
                        summon.x += 1
                    }
                    if (summon.x >= Config.stageWidth - summon.w) summon.x = Config.stageWidth - summon.w

                    if (summon.y < summonActor.y) {
                        summon.y -= 1
                    }
                }
            }
        }
    }

    public removeMonster(a_monster:Monster) {
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i])
                this.m_monsters.splice(i, 1)
                // this._createMonster()
                break
            }
        }
        this._changeLevel()
    }

    public removeEliteActor(a_eliteActor:EliteActor) {
        
    }

    public removeLuckyActor(a_lucky:LuckyActor) {
        for (let i = 0; i < this.m_luckyActors.length; i++) {
            if (this.m_luckyActors[i] == a_lucky) {
                this.m_groupGame.removeChild(this.m_luckyActors[i])
                this.m_luckyActors.splice(i, 1)
                break
            }
        }
    }

    public removeSummonActor(a_summon:SummonActor) {
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i] == a_summon) {
                this.m_groupGame.removeChild(this.m_summonActors[i])
                this.m_summonActors.splice(i, 1)
                break
            }
        }
        this._changeLevel()
    }

    public removeSpiderActor(a_spider:SpiderActor) {
        for (let i = 0; i < this.m_spiderActors.length; i++) {
            if (this.m_spiderActors[i] == a_spider) {
                this.m_groupGame.removeChild(this.m_spiderActors[i])
                this.m_spiderActors.splice(i, 1)
                break
            }
        }
        this._changeLevel()
    }

    public clearAllActor() {
        while(this.m_monsters.length > 0) {
			let monster:Monster = this.m_monsters.pop()
			monster.destroy()
			this.m_groupGame.removeChild(monster)
		}

        while(this.m_luckyActors.length > 0) {
            let lucky:LuckyActor = this.m_luckyActors.pop()
            lucky.destroy()
            this.m_groupGame.removeChild(lucky)
        }

        while(this.m_summonActors.length > 0) {
            let summon:SummonActor  = this.m_summonActors.pop()
            summon.destroy()
            this.m_groupGame.removeChild(summon)
        }

        while(this.m_spiderActors.length > 0) {
            let spider:SpiderActor = this.m_spiderActors.pop()
            spider.destroy()
            this.m_groupGame.removeChild(spider)
        }

        while(this.m_eliteActors.length > 0) {
            let elite:EliteActor = this.m_eliteActors.pop()
            elite.destroy()
            this.m_groupGame.removeChild(elite)
        }
    }

    public getAllActors() {
        this._data.allActors.length = 0
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (GameConfig.isGuide && this.m_monsters[i].state == EMonsterState.Stop) {
                this.m_monsters[i].state = EMonsterState.Ready
            }
            if (this.m_monsters[i].state == EMonsterState.Ready) {
                this._data.allActors.push(this.m_monsters[i])
            }
        }
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].state == EMonsterState.Ready) {
                this._data.allActors.push(this.m_summonActors[i])
            }
        }
        return this._data.allActors
    }

    /**是否没有生还的怪物或者召唤物 */
    public isNoneAlive() {
        for (let i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].state == EMonsterState.Ready) {
                return false
            }
        }
        for (let i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].state == EMonsterState.Ready) {
                return false
            }
        }
        return true
    }

    public SetRealScore(value:number) {
        this._data.realScore = value
        this.m_bitLabScore.text = this._data.realScore.toString()
        this._data.scoreUnlock(value)
    }

    public get score() {
        return this.m_score
    }

    public set score(value:number) {
        this.m_score = value
        this._setProgress(value)
    }

    private _setProgress(score:number) {
        let width = this._imgProgressBg.width
        // let everySlotValue = (this._data.needScore - this._data.lastScore) / 5
        let everySlotValue = this._data.needScore / 5
        if (this._data.needScore - this._data.lastScore <= 0) {
            everySlotValue = this._data.needScore / 5
        }
        everySlotValue = Math.floor(everySlotValue)
        let step = width / everySlotValue
        let slotWidthPersent = score % everySlotValue
        let slotCount = Math.floor(score / everySlotValue)
        for (let i = 0; i < this._arrayProgress.length; i++) {
            this._arrayProgress[i].visible = false
            if (i < slotCount) {
                this._arrayProgress[i].visible = true
                this._arrayProgress[i].width = width
            }
            if (i == slotCount) {
                this._arrayProgress[i].visible = true
                this._arrayProgress[i].width = step * slotWidthPersent
            }
        }
        this._imgBossIcon.source = "battleBg08_png"
        if (this.m_score >= this._data.needScore) this._imgBossIcon.source = "battleBg07_png"
    }

    public updatePower(persent:number) {
        let r = this._imgPower.height + 10
        let height = 0.8 * r
        persent = Math.min(1, persent)
        this._progress.graphics.clear()
        this._progress.graphics.beginFill(0x00ffff)
        // this._progress.graphics.moveTo(this._imgPower.x, this._imgPower.y + r)
        this._progress.graphics.drawRect(this._imgPower.x, this._imgPower.y + r, r, -persent * 110);
        // this._progress.graphics.lineTo(this._imgPower.x, this._imgPower.y + r);
        this._progress.graphics.endFill()
        this._progress.y = -24
    }

    public get power() {
        return this.m_power
    }

    public set power(value:number) {
        if (this.m_baby == null) return
        this.m_power = value
        if(GameConfig.isGuide){
            this.updatePower(this.m_power / 15)
        }else{
            this.updatePower(this.m_power / 100)
        }        
        this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Immediately)
        
    }

    public get groundPos() {
        return this.m_imgGroundLine.y
    }

    public get guidePos() {
        return this.m_imgGuide.y
    }

    public get waterPos() {
        return this.m_imgGroundWater.y
    }

    public get warningPos() {
        return this.m_imgGroundWarning.y
    }

    public get levelStage() {
        return this.m_levelState
    }

    //怪死亡调用
    public actorDeadHandle() {
        if (this.m_levelState == ELevelType.Normal && this.m_score >= this._data.needScore && this.isNoneAlive()) {
            this.m_levelState = ELevelType.EliteWarning
        }
        // Common.log(this.m_levelState, this.m_score, this.m_currentLevel.normalCount, this.isNoneAlive())
        if (this.m_levelState == ELevelType.EliteWarning) {
            if (GameConfig.isGuide) {
                this.score = 0
                this.SetRealScore(0)
                this._imgGuide.visible = true
                if (GameConfig.guideIndex <= 2) {//玩法引导
                    // this.power = 90
                    GameConfig.guideIndex++
                    this._imgGuide.source = "imgGuide" + GameConfig.guideIndex+"_png"
                    this.yindao.play(0)
                    this.m_rectWarning.visible = false
                    // this.m_guideArmatureContainer.stop()
                    this.m_guideArmatureContainer.visible = false
                    this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                    // this.guideEnd()
                    // this.updeLevelData(1000)
                    this.m_rectWarning.fillColor = 0x000000
                    this.m_gesture.removeEvent()
                    Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this)
                }else{
                    // this.m_guideArmatureContainer.stop() //手指骨骼引导动画
                    // this.m_guideArmatureContainer.visible = false
                    // this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                    // // this._imgGuide.source = "imgGuide3_png"
                    // // this.yindao.play(0)  
                    // this.guideEnd();//引导结束                                      
                }
                // else{
                //     //第三个引导怪物死掉之后，开始引导玩家点击技能按钮  
                //     GameConfig.guideIndex = 3;
                //     this.m_guideArmatureContainer.x = 350;
                //     this.m_guideArmatureContainer.y = -110;
                //     this.m_guideArmatureContainer.touchEnabled = false;
                // }


            }else{
                this.m_levelState = ELevelType.End
                this._enterWarning()
                // if (this._data.isChapterFinal()) {
                //     this._enterWarning()
                // }else{
                //     this._bossArrive()
                // }
                
            }
        }
    }

    public get boom() {
        return this.m_isBoom
    }

    public set boom(value:boolean) {
        this.m_isBoom = value
    }

    /**更新连击 */
    public updateBatter() {
        let batterScore = 0
        if (this.m_isBoom) {
            if (GameConfig.isGuide) {
                 if(GameConfig.isPlaySound)   GameVoice.gestureVoice.play(0, 1).volume = GameConfig.soundValue / 100
            }
            this.m_comboDelay = 0
            this.m_comboCount += 1
            this.m_isBoom = false
            if (this.m_comboCount >= 2) {
                if (this.baby.skillData.result == ESkillResult.ExtraCombo) {
                    Common.log("befor combo", this.m_comboCount)
                    this.m_comboCount = Common.extraReward(this.baby.skillData, this.m_comboCount)
                    Common.log("after combo", this.m_comboCount)
                }
                this.m_fntComboCount.visible = false
                this.m_fntCombo.visible = true
                // this.m_fntComboCount.text = "X" + this.m_comboCount
                this.m_fntCombo.text = "COMBOX" + this.m_comboCount
                this._commbGrop.visible = true
                this.lianjitexiao.play(0)
                this.m_comboArmatureContainer.y = 80
                this.m_comboArmatureContainer.visible = true
                if (this.m_comboCount < 6) {
                    this.m_fntCombo.font = RES.getRes("comboBlueFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboBlueFnt_fnt")
                    this.m_comboArmatureContainer.play("lan", 1)
                    if(GameConfig.isPlaySound)   GameVoice.combo2Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 6 && this.m_comboCount < 11) {
                    this.m_fntCombo.font = RES.getRes("comboYellowFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboYellowFnt_fnt")
                    this.m_comboArmatureContainer.play("lan", 1)
                    if(GameConfig.isPlaySound)   GameVoice.combo3Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 11 && this.m_comboCount < 16) {
                    this.m_fntCombo.font = RES.getRes("comboRedFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboRedFnt_fnt")
                    this.m_comboArmatureContainer.play("huang", 1)
                    if(GameConfig.isPlaySound)   GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }
                else if (this.m_comboCount >= 16 && this.m_comboCount < 26) {
                    this.m_fntCombo.font = RES.getRes("comboPurpleFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboPurpleFnt_fnt")
                    this.m_comboArmatureContainer.play("hong", 1)
                    if(GameConfig.isPlaySound)   GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }else{
                    this.m_fntCombo.font = RES.getRes("comboGreenFnt_fnt")
                    this.m_fntComboCount.font = RES.getRes("comboGreenFnt_fnt")
                    this.m_comboArmatureContainer.play("hong", 1)
                    if(GameConfig.isPlaySound)   GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100
                }


                this.comboMove.stop()
                this.comboEnd.stop()
                this.comboBegin.play(0)

                // if (this.m_comboCount <= 5) batterScore = 2
                // else if (this.m_comboCount > 5 && this.m_comboCount <= 10) batterScore = 3
                // else batterScore = 4
                batterScore = this.m_comboCount
                GameConfig.balloonScore += batterScore
                let addSpeed = Math.min(6, this.m_comboCount) * 0.01
                for (let i = 0; i < this.m_monsters.length; i++) {
                    let monster:Monster = this.m_monsters[i]
                    if (monster.type == EMonsterDifficult.Normal) {
                        monster.setVertical(addSpeed)
                    }
                }

                for (let i = 0; i < this.m_summonActors.length; i++) {
                    let summon:SummonActor = this.m_summonActors[i]
                    summon.setVertical(addSpeed)
                }

                this._data.comboRewardCandy(this.m_comboCount)

                this._data.comboUnlock(this.m_comboCount)
            }
            if (this.m_comboCount <= 2) GameConfig.comboDelay = 1200
            else GameConfig.comboDelay = 1000

            if (this.m_levelState == ELevelType.Normal) this.score += (GameConfig.balloonScore - batterScore)
            if (this.baby.skillData.result == ESkillResult.ExtraScore) {
                GameConfig.balloonScore = Common.extraReward(this.baby.skillData, GameConfig.balloonScore)
            }
            this._data.realScore += GameConfig.balloonScore
            this.SetRealScore(this._data.realScore)
            this.actorDeadHandle()

            GameConfig.curCombo = Math.max(this.m_comboCount, GameConfig.curCombo)

            if (this.m_comboCount > GameConfig.chapterMaxCombo[this._data.chapter.toString()]) {
                GameConfig.chapterMaxCombo[this._data.chapter.toString()] = this.m_comboCount
                Common.updateChapterCombo(GameConfig.chapterMaxCombo)
            }
        }else{
            this.m_comboCount = 0
            this.m_isBoom = false
        }
        
    }

    public unlockEffect(id:number) {
        let data = GameConfig.actorTable[id]
        this.itemIcon.source = data.icon
        this.itemUnlockGroup.visible = true
        this.itemUnlock.play(0)
    }

    public updateExtarCandy(value:number) {
        this._labCandy.text = "X"+value
        this._data.updateCandy(value);
        this._groupCandy.visible = true
        this.candyAnimate.play(0)
    }


    private _warning() {
        this.m_rectWarning.visible = true
        this.m_isWarning = true
        this.warning.play(0)
    }

    private _beginSkill() {
        GameManager.Instance.start()
        this.m_baby.releaseResult()
    }

    /**
     * 释放技能
     */
    public releaseSkill() {
        if (this.m_power >= 100) {
            if (this.baby.skillData.sceneEffect != undefined && this.baby.skillData.sceneEffect > 0) {
                this.playExSkillEffect(this.baby.skillData.sceneEffect)
            }
            this.m_imgEffectMask.visible = true
            this.effectMask.play(0)
            GameManager.Instance.pause(true)
            if(GameConfig.isPlaySound){
                let channel = GameVoice.skillBeginSound.play(0, 1)
		        channel.volume = GameConfig.soundValue / 100
            }            
            this.power = 0
            this.m_baby.gotoAttack()
        }
    }

    private _onItemUnlock() {
        if (GameConfig.gameMode == EBattleMode.Level) {
            this.itemUnlockGroup.visible = false
            // GameManager.Instance.endLevel()
        }
    }

    /**
     * 进入下一关
     */
    private _changeLevel() {
        // Common.log("进入下一关_changeLevel", this.m_monsters.length, this.m_summonActors.length, this.m_spiderActors.length, this.m_levelState)
        if (this.m_monsters.length <= 0 
            && this.m_summonActors.length <= 0 
            && this.m_spiderActors.length <= 0
            && this.m_levelState == ELevelType.Elite) 
        {
            if (GameConfig.gameMode == EBattleMode.Level) {
                this._data.updateCandy(this._data.levelData.candy + this._data.extra)
                this._data.extra = 0
                if (this._data.isChapterFinal()) {
                    this._data.getLevelReward(0, 0, true)
                    GameManager.Instance.endLevel()

                    let nextLevel = this._data.levelData.next
                    if (nextLevel != null && nextLevel > 0) {
                        let levelData = GameConfig.levelTable[nextLevel.toString()]
                        Common.updateCurLevel(nextLevel)
                        Common.updateCurChpter(levelData.section)
                    }

                    //一章结束，记录该章过关
                    GameConfig.isChapterPass[this._data.chapter.toString()] = 1;
                    Common.updateIsChapterPass(GameConfig.isChapterPass)
                    if (this._data.realScore > GameConfig.chapterMaxScore[this._data.chapter.toString()]) {
                        GameConfig.chapterMaxScore[this._data.chapter.toString()] = this._data.realScore
                        Common.updateChapterScore(GameConfig.chapterMaxScore)
                    }
                }else{
                    this.touchChildren = true
                    this.m_baby.gotoRun()
                    this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                    this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture)
                    Common.addEventListener(MainNotify.gestureAction, this._onGesture, this)
                    this.score = 0
                    GameConfig.chapterLastScore[this._data.chapter.toString()] = this._data.realScore
                    Common.updateLastScore(GameConfig.chapterLastScore)
                    // this._data.updateCandy(this._data.levelData.candy)
                    // this.SetRealScore(0)
                    GameManager.Instance.start()
                    // this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                }
            }else{
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
            }
        }
    }



    /**
     * 进入boss
     */
    private _enterWarning() {
        this.m_imgBossWarning.visible = true
        this.bossWarning.play(0)
        this.m_nextBg.source = "battleBg01_png";
        if(GameConfig.isPlaySound)   GameVoice.bossWarning.play(0, 1)
        // egret.setTimeout(this._enterBoss, this, 2000)
    }

    private _enterBoss() {
        this.m_imgBossWarning.visible = false
        // 1.5s后BOSS创建
        egret.setTimeout(this._bossArrive, this, 1500)
    }

    private _bossArrive() {
        this.m_levelState = ELevelType.Elite
        let m_sumWeight = 0
		for (let i = 0; i < this._data.levelData.elite.length; i++) {
			m_sumWeight += this._data.levelData.elite[i].prob
			this._data.levelData.elite[i].weight = m_sumWeight
		}
		let random = MathUtils.getRandom(1, m_sumWeight)
		for (let i = 0; i < this._data.levelData.elite.length; i++) {
			if (random <= this._data.levelData.elite[i].weight) {
                this.m_bossData = this._data.levelData.elite[i]
				break
			}
		}
        if (this.m_bossData.id == 1006) {
            this.playSpiderWebArmature("arrive1", 1)
        }
        else this._createMonster()
    }

    public get boss() {
        return this.m_bossData
    }

    public get sceneData() {
        return this._data
    }

    public get baby() {
        return this.m_baby
    }

    private m_bossData:any

    private _onGesture() {
        if (GameConfig.gestureType > 0) {
            GameConfig.balloonScore = 0
            this._data.addPower = 0
            for (let i = 0; i < this.m_monsters.length; i++) {
                let monster:Monster = this.m_monsters[i]
                for (let j = 0; j < monster.balloons.length; j++) {
                    let balloon:Balloon = monster.balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        monster.ballExplosion(balloon)
                        // this.boom = true
                    }
				}
            }

            for (let i = 0; i < this.m_luckyActors.length; i++) {
                let lucky:LuckyActor = this.m_luckyActors[i]
                if (lucky.ballon.type == GameConfig.gestureType) {
                    lucky.updateGesture()
                }
            }

            for (let i = 0; i < this.m_summonActors.length; i++) {
                let summon:SummonActor = this.m_summonActors[i]
                // for (let j = 0; j < summon.balloons.length; j++) {
                //     let balloon:Balloon = summon.balloons[j]
                //     if (balloon.type == GameConfig.gestureType) {
                //         summon.gotoDead()
                //         // this.boom = true
                //     }
				// }
                if (summon.gestureType == GameConfig.gestureType) {
                    summon.gotoDead()
                    // this.boom = true
                }
            }

            for (let i = 0 ; i < this.m_spiderActors.length; i++) {
                let spider:SpiderActor = this.m_spiderActors[i]
                for (let j = 0; j < spider.balloons.length; j++) {
                    let balloon:Balloon = spider.balloons[j]
                    if (balloon.type == GameConfig.gestureType) {
                        spider.ballExplosion(balloon)
                        // this.boom = true
                    }
				}
            }
            this.power += this._data.addPower
            this.updateBatter()
        }
    }

    private _onBtnPause() {
        GameManager.Instance.pause()
    }

    private _onPowerClick()
    {
        if(this.power >= 100)
        {
            // let actors:Array<BaseActor> = this.getAllActors()
            // this.m_baby.selectRangeFrontToBack(actors)
            this.m_baby.canRelease()
            this.releaseSkill()
            if (GameConfig.isGuide) {
                this.m_guideArmatureContainer.stop() //手指骨骼引导动画
                this.m_guideArmatureContainer.visible = false
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key)
                this.guideEnd();//引导结束
            }         
        }     
    }

    private _onReadyComplete() {
        this.touchChildren = true
        this.m_bitLabScore.visible = true
        GameManager.Instance.start()
        this.m_baby.gotoRun()
    }

    private _onWarningComplete() {
        this.m_isWarning = false
        this.m_rectWarning.visible = false
    }

    private _onComboBeginComplete() {
        this.comboMove.play(0)
    }

    private _onComboEndComplete() {
        this.m_fntCombo.visible = false
        this.m_fntComboCount.visible = false
    }

    private _onComboMoveComplete() {
        this.comboMove.play(0)
    }

    public playSpiderWebArmature(action:string, a_stage:number) {
        this.m_spiderWebArmatureContainer.visible = true
        this.m_spiderWebArmatureContainer.play(action, 1)
        this.m_spiderStage = a_stage
    }

    private _onSpiderWebArmatureComplete() {
        switch (this.m_spiderStage) {
            case 1:
                this._createSpiderActor()
                this.playSpiderWebArmature("arrive2", 2)
            break
            case 2:
                
            break
            case 5:
                for (let i = 0; i < this.m_spiderActors.length; i++) this.m_spiderActors[i].gotoMove()
            break
        }
    }

    private _onSpiderWebArmatureFrame() {

    }

    private _comboArmature() {
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
        this.m_comboArmatureContainer.addCompleteCallFunc(this._comboArmature, this)
        
        this.m_spiderWebArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupGame.addChild(this.m_spiderWebArmatureContainer)
        let spiderWebDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("wang", "wang")
        let spiderArmature = new DragonBonesArmature(spiderWebDisplay)
        spiderArmature.ArmatureDisplay = spiderWebDisplay
        this.m_spiderWebArmatureContainer.register(spiderArmature, ["arrive1","arrive2","attack","dead","idle"])
        this.m_spiderWebArmatureContainer.x = Config.stageHalfWidth
        this.m_spiderWebArmatureContainer.y = 420
        this.m_spiderWebArmatureContainer.addCompleteCallFunc(this._onSpiderWebArmatureComplete, this)
        this.m_spiderWebArmatureContainer.addFrameCallFunc(this._onSpiderWebArmatureFrame, this)
        this.m_spiderWebArmatureContainer.scaleX = 2.2
        this.m_spiderWebArmatureContainer.scaleY = 2.2

        this.m_guideArmatureContainer = new DragonBonesArmatureContainer()
        this.m_groupFull.addChild(this.m_guideArmatureContainer)
        let guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao")
        let guideArmature = new DragonBonesArmature(guideDisplay)
        guideArmature.ArmatureDisplay = guideDisplay
        this.m_guideArmatureContainer.register(guideArmature, ["xinshouyindao", "xinshouyindao4", "xinshouyindao2", "xinshouyindao3"])
        this.m_guideArmatureContainer.x = 50
        this.m_guideArmatureContainer.y = -520

        this.m_baby = new Baby()
        this.m_groupGame.addChild(this.m_baby)
        this.m_baby.y = Config.stageHeight * 0.9
        
        this.addChild( this.m_gestureShape )
        this.readyAnimate.addEventListener('complete', this._onReadyComplete, this)
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnPause, this)
        this.warning.addEventListener('complete', this._onWarningComplete, this)

        this.comboBegin.addEventListener('complete', this._onComboBeginComplete, this)
        this.comboEnd.addEventListener('complete', this._onComboEndComplete, this)
        this.comboMove.addEventListener('complete', this._onComboMoveComplete, this)
        this.bossWarning.addEventListener('complete', this._enterBoss, this)
        this.effectMask.addEventListener('complete', this._beginSkill, this)
        this.itemUnlock.addEventListener('complete', this._onItemUnlock,this)
        this.m_btnPower.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onPowerClick, this)
        
        Common.addTouchBegin(this.m_btnPause)

        this._progress = new egret.Shape()
		this._imgPower.mask = this._progress
		this._powerGroup.addChild(this._progress)

        this._arrayProgress.push(this._imgProgress0)
        this._arrayProgress.push(this._imgProgress1)
        this._arrayProgress.push(this._imgProgress2)
        this._arrayProgress.push(this._imgProgress3)
        this._arrayProgress.push(this._imgProgress4)

		this._onResize()
	}

    public setParticle(a_visible:boolean, x:number, y:number) {
		// this._particle.visible = a_visible
		// if (a_visible) {
		// 	this._particle.start(1)
		// }
		// this._particle.emitterX = x
		// this._particle.emitterY = y
	}

    private _createMonster() {
        let monsterData = null
        let data = null
		switch (this.m_levelState) {
			case ELevelType.Normal:
				monsterData = this._data.levelData.normal
				let sumWeight = 0
				for (let i = 0; i < monsterData.length; i++) {
					sumWeight += monsterData[i].prob
					monsterData[i].weight = sumWeight
				}
				let random = MathUtils.getRandom(1, sumWeight)
				for (let i = 0; i < monsterData.length; i++) {
					if (random <= monsterData[i].weight) {
                        data = monsterData[i]
						break
					}
				}
			break
			case ELevelType.Elite:
                data = this.m_bossData
			break
		}
        let monsterTableData = GameConfig.monsterTable[data.id.toString()]
        if (monsterTableData.Difficult == EMonsterDifficult.Normal || monsterTableData.Difficult == EMonsterDifficult.Elite) {
            let monster:Monster = GameObjectPool.getInstance().createObject(Monster, "Monster")
            monster.Init(data, this.m_levelState)
            monster.updateEffectArmature(this.m_baby.skillData)
            this.m_monsters.push(monster)
        }else{
            let monster:EliteActor = GameObjectPool.getInstance().createObject(EliteActor, "EliteActor")
            monster.Init(data, this.m_levelState)
            monster.updateEffectArmature(this.m_baby.skillData)
            this.m_monsters.push(monster)
        }
        
        for (let i = this.m_monsters.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_monsters[i])
		}
    }

    public createLuckyActor(x:number = null, y:number = null) {
        let lucky:LuckyActor = GameObjectPool.getInstance().createObject(LuckyActor, "LuckyActor")
        lucky.init(x, y)
        this.m_luckyActors.push(lucky)
        this.m_groupGame.addChild(lucky)
    }

    private _createSpiderActor() {
        let spider:SpiderActor = GameObjectPool.getInstance().createObject(SpiderActor, "SpiderActor")
        spider.Init(this._data.levelData)
        this.m_spiderActors.push(spider)
        this.m_groupGame.addChild(spider)
    }

    public createSummonActor(a_master:BaseActor, a_data:any, pos:EMonsterPos, a_x:number, a_y:number, a_count:number = 0, a_num:number = 0, isBoss:boolean = false) {
        let summon:SummonActor = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor")
        summon.master = a_master
        a_master.summonCount += 1
        let summonData = GameConfig.summonTable[a_data.id.toString()]
        let posX = this._data.getSummonTargetX(pos, a_x, a_count, a_num, summonData.Type, isBoss)
        let posY = a_y + MathUtils.getRandom(-20, 20)
        summon.init(a_data, posX, posY, a_x, a_y)
        this.m_summonActors.push(summon)
        for (let i = this.m_summonActors.length-1; i >= 0; i--) {
			this.m_groupGame.addChild(this.m_summonActors[i])
		}
    }

    protected _onResize(event:egret.Event = null)
    {
		
    }

    public _data:GameSceneData
    private _particleLayer:egret.Sprite
    private m_exSkillEffect:GameExSkillEffect
    
    // private _particle:particle.GravityParticleSystem
    /**生成怪物时间 */ 
    private m_monsterAddDelay:number
    /**生成幸运角色时间 */
    private m_luckyAddDelay:number
    private m_comboDelay:number
    private m_comboCount:number
    private m_isBoom:boolean

    private m_monsters:Array<Monster>
    private m_luckyActors:Array<LuckyActor>
    private m_summonActors:Array<SummonActor>
    private m_spiderActors:Array<SpiderActor>
    private m_eliteActors:Array<EliteActor>
    

    private m_score:number
    private m_power:number
    private m_skillDuration:number
    private m_currentItemId:number

    /**关卡配置数据 */
    // private m_currentLevel:any
    /**当前关卡状态 */
    private m_levelState:ELevelType
    private m_normalCount:number
    private m_isWarning:boolean
    private m_isLuck:boolean
    private _imgGuide:eui.Image
    ///////////////////////////////////////////////////////////////////////////    
    private m_btnPower:eui.Button
    private _powerGroup:eui.Group
    private _progress:egret.Shape
    private _imgPower:eui.Image
    private itemUnlockGroup:eui.Group
    private m_groupGrogress:eui.Group
    // private m_imgProgress:eui.Image
    private _imgProgressBg:eui.Image
    private _imgProgress0:eui.Image
    private _imgProgress1:eui.Image
    private _imgProgress2:eui.Image
    private _imgProgress3:eui.Image
    private _imgProgress4:eui.Image
    private _imgBossIcon:eui.Image
    private _arrayProgress:Array<eui.Image>
    private itemBg:eui.Image
    private itemIcon:eui.Image
    private itemUnlock:egret.tween.TweenGroup
    private _curLevel:eui.Label
    private m_nextBg:eui.Image
    private _nextLevel:eui.Label

	private m_bitLabScore:eui.BitmapLabel
    private m_imgEffectMask:eui.Image
    private m_imgGroundLine:eui.Image
    private m_imgGroundWater:eui.Image
    private m_imgGroundWarning:eui.Image
    private m_imgGuide:eui.Image
    private m_rectWarning:eui.Rect
    private m_btnPause:eui.Button
    private _imgGuideTip:eui.Image

    private m_fntCombo:eui.BitmapLabel
    private m_fntComboCount:eui.BitmapLabel
    private combo:egret.tween.TweenGroup
    private comboBegin:egret.tween.TweenGroup
    private comboEnd:egret.tween.TweenGroup
    private comboMove:egret.tween.TweenGroup
    private bossWarning:egret.tween.TweenGroup
    private lianjitexiao:egret.tween.TweenGroup
    private m_imgBossWarning:eui.Image

	private m_groupScore:eui.Group
	private m_groupBottom:eui.Group
    private m_groupGame:eui.Group
    private m_groupGameEffect:eui.Group
    private m_groupGesture:eui.Group
    private m_groupFull:eui.Group
    private m_gestureShape:egret.Shape
	private m_gesture:Gesture
    private _groupCandy:eui.Group
    private _commbGrop:eui.Group
    private _labCandy:eui.Label

    private candyAnimate:egret.tween.TweenGroup
    private readyAnimate:egret.tween.TweenGroup
    private effectMask:egret.tween.TweenGroup
    private warning:egret.tween.TweenGroup
    private yindao:egret.tween.TweenGroup

    private m_comboArmatureContainer:DragonBonesArmatureContainer
    private m_comboArmature:DragonBonesArmature

    private m_spiderWebArmatureContainer:DragonBonesArmatureContainer
    private m_spiderStage:number
    private m_guideArmatureContainer:DragonBonesArmatureContainer
    private m_baby:Baby
}