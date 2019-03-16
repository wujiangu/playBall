var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var GameScenePanel = (function (_super) {
    __extends(GameScenePanel, _super);
    function GameScenePanel() {
        var _this = _super.call(this) || this;
        _this._arrayProgress = new Array();
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameScenePanel.exml";
        _this.m_monsters = new Array();
        _this.m_luckyActors = new Array();
        _this.m_summonActors = new Array();
        _this.m_spiderActors = new Array();
        _this._data = new GameSceneData();
        return _this;
    }
    // 初始化面板
    GameScenePanel.prototype.initPanel = function () {
        this.m_gestureShape = new egret.Shape();
        this.m_gesture = new Gesture();
        this.m_gesture.init();
        this.m_currentItemId = 0;
        this._particleLayer = new egret.Sprite();
        this.addChild(this._particleLayer);
        // //获取纹理
        // let image = RES.getRes("putParticle_png")
        // //获取配置
        // var config = RES.getRes("putParticle_json")
        // this._particle = new particle.GravityParticleSystem(image, config)
        // this._particleLayer.addChild(this._particle)
    };
    GameScenePanel.prototype.init = function () {
        this.clearAllActor();
        this.touchChildren = false;
        this.readyAnimate.play(0);
        GameVoice.readyGoSound.play(0, 1).volume = GameConfig.soundValue / 100;
        this.m_imgEffectMask.visible = false;
        this.m_rectWarning.visible = false;
        this.m_bitLabScore.visible = false;
        this.m_fntCombo.visible = false;
        this.m_fntComboCount.visible = false;
        this.m_spiderWebArmatureContainer.visible = false;
        this.m_imgBossWarning.visible = false;
        this.itemUnlockGroup.visible = false;
        this._imgGuide.visible = false;
        this._imgGuideTip.visible = false;
        this.m_normalCount = 0;
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._onGesture, this);
        this.initData();
        if (GameVoice.battleBGMChannel != null)
            GameVoice.battleBGMChannel.stop();
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                var chapterData = GameConfig.chapterTable[this._data.levelData.section.toString()];
                var voice = RES.getRes(chapterData.bgm);
                GameVoice.battleBGMChannel = voice.play(0);
                this.m_groupGrogress.visible = true;
                this._curLevel.visible = true;
                break;
            case EBattleMode.Endless:
                GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0);
                this.m_groupGrogress.visible = false;
                this._curLevel.visible = false;
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
        GameVoice.battleBGMChannel.volume = 0.8 * GameConfig.bgmValue / 100;
    };
    GameScenePanel.prototype.continueLevel = function () {
        var nextId = this._data.levelData.next;
        var nextData = GameConfig.levelTable[nextId.toString()];
        if (nextId == null || nextId < 0 || nextData == null) {
            this.returnSelectLevel();
            console.error("没有下一关卡数据");
            return;
        }
        else {
            if (nextData.section != this._data.levelData.section) {
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key);
                this.returnSelectLevel();
            }
            else {
                this.touchChildren = true;
                this.m_baby.gotoRun();
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key);
                this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
                Common.addEventListener(MainNotify.gestureAction, this._onGesture, this);
                this.score = 0;
                this.SetRealScore(0);
                GameManager.Instance.start();
            }
        }
    };
    GameScenePanel.prototype.returnSelectLevel = function () {
        GameManager.Instance.gameState = EGameState.Ready;
        GameConfig.isOpenNewChapter = false;
        if (PanelManager.gameSelectLevel.selectChater + 1 == GameConfig.curChpter) {
            GameConfig.isOpenNewChapter = true;
        }
        Common.dispatchEvent(MainNotify.closeGamePanel);
        Common.dispatchEvent(MainNotify.openGameSelectLevel);
    };
    GameScenePanel.prototype.exit = function () {
        this.m_imgEffectMask.visible = false;
        this.touchChildren = false;
        this.m_gesture.removeEvent();
        Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this);
        this.m_baby.gotoIdle();
    };
    // 初始化面板数据
    GameScenePanel.prototype.initData = function () {
        GameConfig.gestureType = 0;
        this.m_monsterAddDelay = 0;
        this.m_luckyAddDelay = 0;
        this.power = 0;
        this.m_skillDuration = -1;
        this.m_comboDelay = -1;
        this.m_comboCount = 0;
        GameConfig.curCombo = 0;
        this.m_isBoom = false;
        this.m_baby.initData();
        this._data.addCandy = 0;
        this._data.extra = 0;
        var level = this._data.level;
        this.score = 0;
        this.SetRealScore(0);
        this.updeLevelData(level, null);
    };
    GameScenePanel.prototype.updeLevelData = function (a_levelId, a_curId) {
        this.m_monsterAddDelay = 0;
        this.m_levelState = ELevelType.Normal;
        this.m_isLuck = false;
        this.m_rectWarning.fillColor = 0xff0000;
        this._data.levelData = GameConfig.levelTable[a_levelId.toString()];
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                var chapterId = this._data.levelData.section;
                var chapterData = GameConfig.chapterTable[chapterId.toString()];
                if (this._data.levelData.section >= GameConfig.curChpter) {
                    if (a_levelId > chapterData.begin) {
                        var lastLevel = a_curId;
                        if (a_curId == null)
                            lastLevel = this._data.getLastLevel(a_levelId);
                        var lastLevelData = GameConfig.levelTable[lastLevel.toString()];
                        this._data.lastScore = lastLevelData.normalCount;
                        // this.score = lastLevelData.normalCount
                    }
                    Common.updateCurLevel(a_levelId);
                    Common.updateCurChpter(this._data.levelData.section);
                }
                if (a_levelId > chapterData.begin) {
                    var lastLevel = a_curId;
                    if (a_curId == null)
                        lastLevel = this._data.getLastLevel(a_levelId);
                    var lastLevelData = GameConfig.levelTable[lastLevel.toString()];
                    this._data.lastScore = lastLevelData.normalCount;
                }
                this._curLevel.text = this._data.levelData.level.toString();
                GameManager.Instance.updateSceneBg(chapterData.bg, chapterData.water);
                GameManager.Instance.updateSceneCloud(chapterData.cloud1, chapterData.cloud2);
                GameManager.Instance.updateSceneSun(chapterData.sun);
                break;
            case EBattleMode.Endless:
                this.score = 0;
                // GameManager.Instance.updateSceneBg("Bg1_png")
                if (a_levelId == this._data.levelData.next) {
                    // this._data.needScore += this.m_normalCount * 200
                    // this.m_normalCount++
                }
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
        GameConfig.gameSpeedPercent = this._data.levelData.speed;
        if (a_levelId == 1000) {
            GameConfig.isGuide = true;
            this.m_rectWarning.fillColor = 0x000000;
            this.m_isLuck = true;
            this.m_gesture.removeEvent();
            Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this);
        }
    };
    GameScenePanel.prototype.guideStart = function () {
        this.m_rectWarning.visible = true;
        this.m_guideArmatureContainer.visible = true;
        this._imgGuideTip.visible = true;
        if (GameConfig.guideIndex == 0) {
            this.m_guideArmatureContainer.play("xinshouyindao", 0);
        }
        else if (GameConfig.guideIndex == 1) {
            this.m_guideArmatureContainer.play("xinshouyindao4", 0);
        }
        else {
            this.m_guideArmatureContainer.play("xinshouyindao", 0);
        }
        for (var i = 0; i < this.m_monsters.length; i++) {
            var monster = this.m_monsters[i];
            for (var j = 0; j < monster.balloons.length; j++) {
                var balloon = monster.balloons[j];
                balloon.guideStart();
            }
        }
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._onGesture, this);
    };
    GameScenePanel.prototype.guideEnd = function () {
        this._imgGuideTip.visible = false;
        this.m_rectWarning.visible = false;
        GameConfig.isGuide = false;
        this.power = 0;
        Common.updateGuide(3);
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._onGesture, this);
    };
    // 进入面板
    GameScenePanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.gameScenePanel;
        Common.gameScene().uiLayer.addChild(this);
        this.init();
    };
    // 退出面板
    GameScenePanel.prototype.onExit = function () {
        this.clearAllActor();
        Common.gameScene().uiLayer.removeChild(this);
        this.exit();
        GameVoice.battleBGMChannel.stop();
    };
    GameScenePanel.prototype.setSkillDuration = function () {
        if (this.m_baby.skillData.time > 0) {
            this.m_skillDuration = 0;
        }
    };
    GameScenePanel.prototype.update = function (timeElapsed) {
        var actorElapsed = timeElapsed;
        if (this.m_skillDuration >= 0 && GameManager.Instance.gameState == EGameState.Start) {
            this.m_skillDuration += timeElapsed;
            if (this.m_skillDuration >= this.m_baby.skillData.time) {
                this.m_skillDuration = -1;
            }
        }
        if (GameManager.Instance.gameState == EGameState.Start) {
            if (this.m_skillDuration >= 0) {
                switch (this.m_baby.skillData.result) {
                    case ESkillResult.ContinuedKill:
                        var range = this.m_baby.skillData.range * Config.stageHeight;
                        // 全体范围内持续消除
                        for (var i = 0; i < this.m_monsters.length; i++) {
                            var monster = this.m_monsters[i];
                            if (monster.state == EMonsterState.Ready && monster.y >= range) {
                                monster.gotoDead();
                            }
                        }
                        for (var i = 0; i < this.m_summonActors.length; i++) {
                            var summon = this.m_summonActors[i];
                            if (summon.state == EMonsterState.Ready && summon.y >= range) {
                                summon.gotoDead();
                            }
                        }
                        break;
                    case ESkillResult.SlowSpeed:
                        // 全体减速
                        actorElapsed *= 0.2;
                        break;
                }
            }
            if (this.m_levelState == ELevelType.Normal) {
                this.m_monsterAddDelay += actorElapsed;
            }
            else {
                this.m_monsterAddDelay = 0;
            }
            this.m_luckyAddDelay += timeElapsed;
            // 连击
            if (this.m_comboDelay >= 0) {
                this.m_comboDelay += actorElapsed;
                if (this.m_comboDelay >= GameConfig.comboDelay) {
                    this.m_comboDelay = -1;
                    GameConfig.curCombo = Math.max(this.m_comboCount, GameConfig.curCombo);
                    this.m_comboCount = 0;
                    this.m_isBoom = false;
                    this.comboMove.stop();
                    this.comboEnd.play(0);
                    for (var i = 0; i < this.m_monsters.length; i++) {
                        var monster = this.m_monsters[i];
                        if (monster.type == EMonsterDifficult.Normal) {
                            monster.resetVertical();
                        }
                    }
                    for (var i = 0; i < this.m_summonActors.length; i++) {
                        var summon = this.m_summonActors[i];
                        summon.resetVertical();
                    }
                }
            }
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                if (monster.state == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._warning();
                }
                this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Range, monster);
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                var summon = this.m_summonActors[i];
                if (summon.state == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._warning();
                }
                this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Range, summon);
            }
            if (this.m_score < this._data.needScore && this.m_monsterAddDelay >= this._data.levelData.addTime) {
                this.m_monsterAddDelay = 0;
                this._createMonster();
                if (GameConfig.isGuide)
                    this.m_score++;
            }
            if (this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay && !GameConfig.isGuide) {
                this.m_luckyAddDelay = 0;
                this.createLuckyActor();
            }
        }
        if (GameManager.Instance.gameState == EGameState.Start || GameManager.Instance.gameState == EGameState.End) {
            for (var i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].update(actorElapsed);
            }
            for (var i = 0; i < this.m_spiderActors.length; i++) {
                this.m_spiderActors[i].update(actorElapsed);
            }
        }
        if (GameManager.Instance.gameState == EGameState.Start) {
            for (var i = 0; i < this.m_luckyActors.length; i++) {
                this.m_luckyActors[i].update(actorElapsed);
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                this.m_summonActors[i].update(actorElapsed);
                this._summonActorHit(this.m_summonActors[i]);
            }
            this.m_baby.update(timeElapsed);
        }
    };
    GameScenePanel.prototype._summonActorHit = function (summon) {
        for (var j = 0; j < this.m_summonActors.length; j++) {
            var summonActor = this.m_summonActors[j];
            if (summonActor != summon) {
                var distance = MathUtils.getDistance(summon.x, summon.y, summonActor.x, summonActor.y);
                var offset = (summon.w + summonActor.w) / 2;
                if (distance <= offset) {
                    if (summon.x < summonActor.x) {
                        summon.x -= 1;
                    }
                    else {
                        summon.x += 1;
                    }
                    if (summon.x >= Config.stageWidth - summon.w)
                        summon.x = Config.stageWidth - summon.w;
                    if (summon.y < summonActor.y) {
                        summon.y -= 1;
                    }
                }
            }
        }
    };
    GameScenePanel.prototype.removeMonster = function (a_monster) {
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i]);
                this.m_monsters.splice(i, 1);
                // this._createMonster()
                break;
            }
        }
        this._changeLevel();
    };
    GameScenePanel.prototype.removeBullet = function (a_bullet) {
    };
    GameScenePanel.prototype.removeLuckyActor = function (a_lucky) {
        for (var i = 0; i < this.m_luckyActors.length; i++) {
            if (this.m_luckyActors[i] == a_lucky) {
                this.m_groupGame.removeChild(this.m_luckyActors[i]);
                this.m_luckyActors.splice(i, 1);
                break;
            }
        }
    };
    GameScenePanel.prototype.removeSummonActor = function (a_summon) {
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i] == a_summon) {
                this.m_groupGame.removeChild(this.m_summonActors[i]);
                this.m_summonActors.splice(i, 1);
                break;
            }
        }
        this._changeLevel();
    };
    GameScenePanel.prototype.removeSpiderActor = function (a_spider) {
        for (var i = 0; i < this.m_spiderActors.length; i++) {
            if (this.m_spiderActors[i] == a_spider) {
                this.m_groupGame.removeChild(this.m_spiderActors[i]);
                this.m_spiderActors.splice(i, 1);
                break;
            }
        }
        this._changeLevel();
    };
    GameScenePanel.prototype.clearAllActor = function () {
        while (this.m_monsters.length > 0) {
            var monster = this.m_monsters.pop();
            monster.destroy();
            this.m_groupGame.removeChild(monster);
        }
        while (this.m_luckyActors.length > 0) {
            var lucky = this.m_luckyActors.pop();
            lucky.destroy();
            this.m_groupGame.removeChild(lucky);
        }
        while (this.m_summonActors.length > 0) {
            var summon = this.m_summonActors.pop();
            summon.destroy();
            this.m_groupGame.removeChild(summon);
        }
        while (this.m_spiderActors.length > 0) {
            var spider = this.m_spiderActors.pop();
            spider.destroy();
            this.m_groupGame.removeChild(spider);
        }
    };
    GameScenePanel.prototype.getAllActors = function () {
        this._data.allActors.length = 0;
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].state == EMonsterState.Ready) {
                this._data.allActors.push(this.m_monsters[i]);
            }
        }
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].state == EMonsterState.Ready) {
                this._data.allActors.push(this.m_summonActors[i]);
            }
        }
        return this._data.allActors;
    };
    /**是否没有生还的怪物或者召唤物 */
    GameScenePanel.prototype.isNoneAlive = function () {
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].state == EMonsterState.Ready) {
                return false;
            }
        }
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].state == EMonsterState.Ready) {
                return false;
            }
        }
        return true;
    };
    GameScenePanel.prototype.SetRealScore = function (value) {
        this._data.realScore = value;
        this.m_bitLabScore.text = this._data.realScore.toString();
    };
    Object.defineProperty(GameScenePanel.prototype, "score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
            // 计算进度条的单位增量
            // let step = 260 / (this._data.needScore - this._data.lastScore)
            // this.m_imgProgress.width = (this.m_score - this._data.lastScore) * step
            // this._setProgress()
            // let score = Math.min(value, this._data.needScore - this._data.lastScore)
            // if (this._data.needScore - this._data.lastScore <= 0) {
            //     score = Math.min(value, this._data.needScore)
            // }
            // Common.log("分数:", value)
            this._setProgress(value);
            // if (this.m_score >= this._data.needScore * 0.5 && !this.m_isLuck) {
            //     //引导关没有
            //     this.m_isLuck = true
            //     GameConfig.gameSpeedPercent = GameConfig.gameSpeedPercent * 1.1
            // }
        },
        enumerable: true,
        configurable: true
    });
    GameScenePanel.prototype._setProgress = function (score) {
        var width = this._imgProgressBg.width;
        // let everySlotValue = (this._data.needScore - this._data.lastScore) / 5
        var everySlotValue = this._data.needScore / 5;
        if (this._data.needScore - this._data.lastScore <= 0) {
            everySlotValue = this._data.needScore / 5;
        }
        everySlotValue = Math.floor(everySlotValue);
        var step = width / everySlotValue;
        var slotWidthPersent = score % everySlotValue;
        var slotCount = Math.floor(score / everySlotValue);
        for (var i = 0; i < this._arrayProgress.length; i++) {
            this._arrayProgress[i].visible = false;
            if (i < slotCount) {
                this._arrayProgress[i].visible = true;
                this._arrayProgress[i].width = width;
            }
            if (i == slotCount) {
                this._arrayProgress[i].visible = true;
                this._arrayProgress[i].width = step * slotWidthPersent;
            }
        }
        this._imgBossIcon.source = "battleBg08_png";
        if (this.m_score >= this._data.needScore)
            this._imgBossIcon.source = "battleBg07_png";
    };
    GameScenePanel.prototype.updatePower = function (persent) {
        var r = this._imgPower.height + 10;
        var height = 0.8 * r;
        persent = Math.min(1, persent);
        this._progress.graphics.clear();
        this._progress.graphics.beginFill(0x00ffff);
        // this._progress.graphics.moveTo(this._imgPower.x, this._imgPower.y + r)
        this._progress.graphics.drawRect(this._imgPower.x, this._imgPower.y + r, r, -persent * 110);
        // this._progress.graphics.lineTo(this._imgPower.x, this._imgPower.y + r);
        this._progress.graphics.endFill();
        this._progress.y = -24;
    };
    Object.defineProperty(GameScenePanel.prototype, "power", {
        get: function () {
            return this.m_power;
        },
        set: function (value) {
            if (this.m_baby == null)
                return;
            this.m_power = value;
            this.updatePower(this.m_power / 100);
            this.m_baby.releaseSkill(this.m_power, ESkillReleaseType.Immediately);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "groundPos", {
        get: function () {
            return this.m_imgGroundLine.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "guidePos", {
        get: function () {
            return this.m_imgGuide.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "waterPos", {
        get: function () {
            return this.m_imgGroundWater.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "warningPos", {
        get: function () {
            return this.m_imgGroundWarning.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "levelStage", {
        get: function () {
            return this.m_levelState;
        },
        enumerable: true,
        configurable: true
    });
    GameScenePanel.prototype.actorDeadHandle = function () {
        if (this.m_levelState == ELevelType.Normal && this.m_score >= this._data.needScore && this.isNoneAlive()) {
            this.m_levelState = ELevelType.EliteWarning;
        }
        // Common.log(this.m_levelState, this.m_score, this.m_currentLevel.normalCount, this.isNoneAlive())
        if (this.m_levelState == ELevelType.EliteWarning) {
            if (GameConfig.isGuide) {
                this.score = 0;
                this.SetRealScore(0);
                this._imgGuide.visible = true;
                if (GameConfig.guideIndex <= 1) {
                    // this.power = 90
                    GameConfig.guideIndex++;
                    this._imgGuide.source = "imgGuide" + GameConfig.guideIndex + "_png";
                    this.yindao.play(0);
                    this.m_rectWarning.visible = false;
                    // this.m_guideArmatureContainer.stop()
                    this.m_guideArmatureContainer.visible = false;
                    this.updeLevelData(this._data.levelData.next, this._data.levelData.key);
                    // this.guideEnd()
                    // this.updeLevelData(1000)
                    this.m_rectWarning.fillColor = 0x000000;
                    this.m_gesture.removeEvent();
                    Common.removeEventListener(MainNotify.gestureAction, this._onGesture, this);
                }
                else {
                    this.m_guideArmatureContainer.stop();
                    this.m_guideArmatureContainer.visible = false;
                    this.updeLevelData(this._data.levelData.next, this._data.levelData.key);
                    this._imgGuide.source = "imgGuide3_png";
                    this.yindao.play(0);
                    this.guideEnd();
                }
            }
            else {
                this.m_levelState = ELevelType.End;
                this._enterWarning();
            }
        }
    };
    Object.defineProperty(GameScenePanel.prototype, "boom", {
        get: function () {
            return this.m_isBoom;
        },
        set: function (value) {
            this.m_isBoom = value;
        },
        enumerable: true,
        configurable: true
    });
    /**更新连击 */
    GameScenePanel.prototype.updateBatter = function () {
        var batterScore = 0;
        if (this.m_isBoom) {
            if (GameConfig.isGuide) {
                GameVoice.gestureVoice.play(0, 1).volume = GameConfig.soundValue / 100;
            }
            this.m_comboDelay = 0;
            this.m_comboCount += 1;
            this.m_isBoom = false;
            if (this.m_comboCount >= 2) {
                this.m_fntCombo.visible = true;
                this.m_fntComboCount.visible = true;
                this.m_fntComboCount.text = "X" + this.m_comboCount;
                this.m_comboArmatureContainer.y = 80;
                this.m_comboArmatureContainer.visible = true;
                if (this.m_comboCount < 6) {
                    this.m_fntCombo.font = RES.getRes("comboBlueFnt_fnt");
                    this.m_fntComboCount.font = RES.getRes("comboBlueFnt_fnt");
                    this.m_comboArmatureContainer.play("lan", 1);
                    GameVoice.combo2Sound.play(0, 1).volume = GameConfig.soundValue / 100;
                }
                else if (this.m_comboCount >= 6 && this.m_comboCount < 11) {
                    this.m_fntCombo.font = RES.getRes("comboYellowFnt_fnt");
                    this.m_fntComboCount.font = RES.getRes("comboYellowFnt_fnt");
                    this.m_comboArmatureContainer.play("lan", 1);
                    GameVoice.combo3Sound.play(0, 1).volume = GameConfig.soundValue / 100;
                }
                else if (this.m_comboCount >= 11 && this.m_comboCount < 16) {
                    this.m_fntCombo.font = RES.getRes("comboRedFnt_fnt");
                    this.m_fntComboCount.font = RES.getRes("comboRedFnt_fnt");
                    this.m_comboArmatureContainer.play("huang", 1);
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100;
                }
                else if (this.m_comboCount >= 16 && this.m_comboCount < 26) {
                    this.m_fntCombo.font = RES.getRes("comboPurpleFnt_fnt");
                    this.m_fntComboCount.font = RES.getRes("comboPurpleFnt_fnt");
                    this.m_comboArmatureContainer.play("hong", 1);
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100;
                }
                else {
                    this.m_fntCombo.font = RES.getRes("comboGreenFnt_fnt");
                    this.m_fntComboCount.font = RES.getRes("comboGreenFnt_fnt");
                    this.m_comboArmatureContainer.play("hong", 1);
                    GameVoice.combo4Sound.play(0, 1).volume = GameConfig.soundValue / 100;
                }
                this.comboBegin.play(0);
                // if (this.m_comboCount <= 5) batterScore = 2
                // else if (this.m_comboCount > 5 && this.m_comboCount <= 10) batterScore = 3
                // else batterScore = 4
                batterScore = this.m_comboCount;
                GameConfig.balloonScore += batterScore;
                var addSpeed = Math.min(6, this.m_comboCount) * 0.02;
                for (var i = 0; i < this.m_monsters.length; i++) {
                    var monster = this.m_monsters[i];
                    if (monster.type == EMonsterDifficult.Normal) {
                        monster.setVertical(addSpeed);
                    }
                }
                for (var i = 0; i < this.m_summonActors.length; i++) {
                    var summon = this.m_summonActors[i];
                    summon.setVertical(addSpeed);
                }
                this._data.comboRewardCandy(this.m_comboCount);
            }
            if (this.m_comboCount <= 2)
                GameConfig.comboDelay = 1200;
            else
                GameConfig.comboDelay = 1000;
        }
        if (this.m_levelState == ELevelType.Normal)
            this.score += (GameConfig.balloonScore - batterScore);
        this._data.realScore += GameConfig.balloonScore;
        this.SetRealScore(this._data.realScore);
        this.actorDeadHandle();
    };
    GameScenePanel.prototype._warning = function () {
        this.m_rectWarning.visible = true;
        this.m_isWarning = true;
        this.warning.play(0);
    };
    GameScenePanel.prototype._beginSkill = function () {
        GameManager.Instance.start();
        this.m_baby.releaseResult();
    };
    /**
     * 释放技能
     */
    GameScenePanel.prototype.releaseSkill = function () {
        if (this.m_power >= 100) {
            this.m_imgEffectMask.visible = true;
            this.effectMask.play(0);
            GameManager.Instance.pause(true);
            var channel = GameVoice.skillBeginSound.play(0, 1);
            channel.volume = GameConfig.soundValue / 100;
            this.power = 0;
            this.m_baby.gotoAttack();
        }
    };
    /**
     * 进入下一关
     */
    GameScenePanel.prototype._changeLevel = function () {
        if (this.m_monsters.length <= 0
            && this.m_summonActors.length <= 0
            && this.m_spiderActors.length <= 0
            && this.m_levelState == ELevelType.Elite) {
            if (GameConfig.gameMode == EBattleMode.Level) {
                this._data.updateCandy(this._data.levelData.candy + this._data.extra);
                this._data.extra = 0;
                GameManager.Instance.endLevel();
            }
            else {
                this.updeLevelData(this._data.levelData.next, this._data.levelData.key);
            }
        }
    };
    /**
     * 进入boss
     */
    GameScenePanel.prototype._enterWarning = function () {
        this.m_imgBossWarning.visible = true;
        this.bossWarning.play(0);
        GameVoice.bossWarning.play(0, 1);
        // egret.setTimeout(this._enterBoss, this, 2000)
    };
    GameScenePanel.prototype._enterBoss = function () {
        this.m_imgBossWarning.visible = false;
        // 1.5s后BOSS创建
        egret.setTimeout(this._bossArrive, this, 1500);
    };
    GameScenePanel.prototype._bossArrive = function () {
        this.m_levelState = ELevelType.Elite;
        var m_sumWeight = 0;
        for (var i = 0; i < this._data.levelData.elite.length; i++) {
            m_sumWeight += this._data.levelData.elite[i].prob;
            this._data.levelData.elite[i].weight = m_sumWeight;
        }
        var random = MathUtils.getRandom(1, m_sumWeight);
        for (var i = 0; i < this._data.levelData.elite.length; i++) {
            if (random <= this._data.levelData.elite[i].weight) {
                this.m_bossData = this._data.levelData.elite[i];
                break;
            }
        }
        if (this.m_bossData.id == 1006) {
            this.playSpiderWebArmature("arrive1", 1);
        }
        else
            this._createMonster();
    };
    Object.defineProperty(GameScenePanel.prototype, "boss", {
        get: function () {
            return this.m_bossData;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "sceneData", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "baby", {
        get: function () {
            return this.m_baby;
        },
        enumerable: true,
        configurable: true
    });
    GameScenePanel.prototype._onGesture = function () {
        if (GameConfig.gestureType > 0) {
            GameConfig.balloonScore = 0;
            this._data.addPower = 0;
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                for (var j = 0; j < monster.balloons.length; j++) {
                    var balloon = monster.balloons[j];
                    if (balloon.type == GameConfig.gestureType) {
                        monster.ballExplosion(balloon);
                        // this.boom = true
                    }
                }
            }
            for (var i = 0; i < this.m_luckyActors.length; i++) {
                var lucky = this.m_luckyActors[i];
                if (lucky.ballon.type == GameConfig.gestureType) {
                    lucky.updateGesture();
                }
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                var summon = this.m_summonActors[i];
                if (summon.gestureType == GameConfig.gestureType) {
                    summon.gotoDead();
                    // this.boom = true
                }
            }
            for (var i = 0; i < this.m_spiderActors.length; i++) {
                var spider = this.m_spiderActors[i];
                for (var j = 0; j < spider.balloons.length; j++) {
                    var balloon = spider.balloons[j];
                    if (balloon.type == GameConfig.gestureType) {
                        spider.ballExplosion(balloon);
                        // this.boom = true
                    }
                }
            }
            this.power += this._data.addPower;
            this.updateBatter();
        }
    };
    GameScenePanel.prototype._onBtnPause = function () {
        GameManager.Instance.pause();
    };
    GameScenePanel.prototype._onReadyComplete = function () {
        this.touchChildren = true;
        this.m_bitLabScore.visible = true;
        GameManager.Instance.start();
        this.m_baby.gotoRun();
    };
    GameScenePanel.prototype._onWarningComplete = function () {
        this.m_isWarning = false;
        this.m_rectWarning.visible = false;
    };
    GameScenePanel.prototype._onComboBeginComplete = function () {
        this.comboMove.play(0);
    };
    GameScenePanel.prototype._onComboEndComplete = function () {
        this.m_fntCombo.visible = false;
        this.m_fntComboCount.visible = false;
    };
    GameScenePanel.prototype._onComboMoveComplete = function () {
        this.comboMove.play(0);
    };
    GameScenePanel.prototype.playSpiderWebArmature = function (action, a_stage) {
        this.m_spiderWebArmatureContainer.visible = true;
        this.m_spiderWebArmatureContainer.play(action, 1);
        this.m_spiderStage = a_stage;
    };
    GameScenePanel.prototype._onSpiderWebArmatureComplete = function () {
        switch (this.m_spiderStage) {
            case 1:
                this._createSpiderActor();
                this.playSpiderWebArmature("arrive2", 2);
                break;
            case 2:
                break;
            case 5:
                for (var i = 0; i < this.m_spiderActors.length; i++)
                    this.m_spiderActors[i].gotoMove();
                break;
        }
    };
    GameScenePanel.prototype._onSpiderWebArmatureFrame = function () {
    };
    GameScenePanel.prototype._comboArmature = function () {
        this.m_comboArmatureContainer.visible = false;
    };
    GameScenePanel.prototype.onComplete = function () {
        this.m_comboArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupScore.addChild(this.m_comboArmatureContainer);
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("Detonationexplosion", "Detonationexplosion");
        var comboArmature = new DragonBonesArmature(armatureDisplay);
        comboArmature.ArmatureDisplay = armatureDisplay;
        this.m_comboArmatureContainer.register(comboArmature, ["hong", "huang", "lan"]);
        this.m_comboArmatureContainer.x = this.m_groupScore.width / 2;
        this.m_comboArmatureContainer.addCompleteCallFunc(this._comboArmature, this);
        this.m_spiderWebArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupGame.addChild(this.m_spiderWebArmatureContainer);
        var spiderWebDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("wang", "wang");
        var spiderArmature = new DragonBonesArmature(spiderWebDisplay);
        spiderArmature.ArmatureDisplay = spiderWebDisplay;
        this.m_spiderWebArmatureContainer.register(spiderArmature, ["arrive1", "arrive2", "attack", "dead", "idle"]);
        this.m_spiderWebArmatureContainer.x = Config.stageHalfWidth;
        this.m_spiderWebArmatureContainer.y = 420;
        this.m_spiderWebArmatureContainer.addCompleteCallFunc(this._onSpiderWebArmatureComplete, this);
        this.m_spiderWebArmatureContainer.addFrameCallFunc(this._onSpiderWebArmatureFrame, this);
        this.m_spiderWebArmatureContainer.scaleX = 2.2;
        this.m_spiderWebArmatureContainer.scaleY = 2.2;
        this.m_guideArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupFull.addChild(this.m_guideArmatureContainer);
        var guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao");
        var guideArmature = new DragonBonesArmature(guideDisplay);
        guideArmature.ArmatureDisplay = guideDisplay;
        this.m_guideArmatureContainer.register(guideArmature, ["xinshouyindao", "xinshouyindao4"]);
        this.m_guideArmatureContainer.x = 50;
        this.m_guideArmatureContainer.y = -520;
        this.m_baby = new Baby();
        this.m_groupGame.addChild(this.m_baby);
        this.m_baby.y = Config.stageHeight * 0.9;
        this.addChild(this.m_gestureShape);
        this.readyAnimate.addEventListener('complete', this._onReadyComplete, this);
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnPause, this);
        this.warning.addEventListener('complete', this._onWarningComplete, this);
        this.comboBegin.addEventListener('complete', this._onComboBeginComplete, this);
        this.comboEnd.addEventListener('complete', this._onComboEndComplete, this);
        this.comboMove.addEventListener('complete', this._onComboMoveComplete, this);
        this.bossWarning.addEventListener('complete', this._enterBoss, this);
        this.effectMask.addEventListener('complete', this._beginSkill, this);
        Common.addTouchBegin(this.m_btnPause);
        this._progress = new egret.Shape();
        this._imgPower.mask = this._progress;
        this._powerGroup.addChild(this._progress);
        this._arrayProgress.push(this._imgProgress0);
        this._arrayProgress.push(this._imgProgress1);
        this._arrayProgress.push(this._imgProgress2);
        this._arrayProgress.push(this._imgProgress3);
        this._arrayProgress.push(this._imgProgress4);
        this._onResize();
    };
    GameScenePanel.prototype.setParticle = function (a_visible, x, y) {
        // this._particle.visible = a_visible
        // if (a_visible) {
        // 	this._particle.start(1)
        // }
        // this._particle.emitterX = x
        // this._particle.emitterY = y
    };
    GameScenePanel.prototype._createMonster = function () {
        var monster = GameObjectPool.getInstance().createObject(Monster, "Monster");
        monster.Init(this._data.levelData, this.m_levelState);
        monster.updateEffectArmature(this.m_baby.skillData);
        this.m_monsters.push(monster);
        for (var i = this.m_monsters.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_monsters[i]);
        }
    };
    GameScenePanel.prototype.createLuckyActor = function (x, y) {
        if (x === void 0) { x = null; }
        if (y === void 0) { y = null; }
        var lucky = GameObjectPool.getInstance().createObject(LuckyActor, "LuckyActor");
        lucky.init(x, y);
        this.m_luckyActors.push(lucky);
        this.m_groupGame.addChild(lucky);
    };
    GameScenePanel.prototype._createSpiderActor = function () {
        var spider = GameObjectPool.getInstance().createObject(SpiderActor, "SpiderActor");
        spider.Init(this._data.levelData);
        this.m_spiderActors.push(spider);
        this.m_groupGame.addChild(spider);
    };
    GameScenePanel.prototype.createSummonActor = function (a_data, pos, a_x, a_y, a_count, a_num, isBoss) {
        if (a_count === void 0) { a_count = 0; }
        if (a_num === void 0) { a_num = 0; }
        if (isBoss === void 0) { isBoss = false; }
        var summon = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor");
        var summonData = GameConfig.summonTable[a_data.id.toString()];
        var posX = this._data.getSummonTargetX(pos, a_x, a_count, a_num, summonData.Type, isBoss);
        var posY = a_y + MathUtils.getRandom(-20, 20);
        summon.init(a_data, posX, posY, a_x, a_y);
        this.m_summonActors.push(summon);
        for (var i = this.m_summonActors.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_summonActors[i]);
        }
    };
    GameScenePanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameScenePanel;
}(BasePanel));
__reflect(GameScenePanel.prototype, "GameScenePanel");
//# sourceMappingURL=GameScenePanel.js.map