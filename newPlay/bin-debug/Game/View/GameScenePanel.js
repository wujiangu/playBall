var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var GameScenePanel = (function (_super) {
    __extends(GameScenePanel, _super);
    function GameScenePanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameScenePanel.exml";
        _this.m_monsters = new Array();
        _this.m_bullets = new Array();
        _this.m_luckyActors = new Array();
        _this.m_summonActors = new Array();
        _this.m_spiderActors = new Array();
        _this.m_data = new GameSceneData();
        return _this;
    }
    // 初始化面板
    GameScenePanel.prototype.initPanel = function () {
        this.m_gestureShape = new egret.Shape();
        this.m_gesture = new Gesture();
        this.m_gesture.Init();
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
    GameScenePanel.prototype.Init = function () {
        this.ClearAllActor();
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
        this.m_normalCount = 0;
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
        this.initData();
        if (GameVoice.battleBGMChannel != null)
            GameVoice.battleBGMChannel.stop();
        GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0);
        GameVoice.battleBGMChannel.volume = 0.8 * GameConfig.bgmValue / 100;
    };
    GameScenePanel.prototype.ContinueLevel = function () {
        var nextId = this.m_data.levelData.next;
        var nextData = GameConfig.levelTable[nextId.toString()];
        if (nextId == null || nextId < 0 || nextData == null) {
            this.ReturnSelectLevel();
            console.error("没有下一关卡数据");
            return;
        }
        else {
            if (nextData.section != this.m_data.levelData.section) {
                this.ReturnSelectLevel();
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key);
            }
            else {
                this.touchChildren = true;
                this.m_baby.gotoRun();
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key);
                this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
                Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
                GameManager.Instance.Start();
            }
        }
    };
    GameScenePanel.prototype.ReturnSelectLevel = function () {
        GameManager.Instance.GameState = EGameState.Ready;
        Common.dispatchEvent(MainNotify.closeGamePanel);
        Common.dispatchEvent(MainNotify.openGameSelectLevel);
    };
    GameScenePanel.prototype.Exit = function () {
        this.m_imgEffectMask.visible = false;
        this.touchChildren = false;
        this.m_gesture.removeEvent();
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this);
        this.m_baby.gotoIdle();
    };
    // 初始化面板数据
    GameScenePanel.prototype.initData = function () {
        GameConfig.gestureType = 0;
        this.m_monsterAddDelay = 0;
        this.m_luckyAddDelay = 0;
        this.m_angle = 180;
        this.Power = 89;
        this.m_slowDelay = -1;
        this.m_comboDelay = -1;
        this.m_comboCount = 0;
        GameConfig.curCombo = 0;
        this.m_isBoom = false;
        this.m_baby.initData();
        var level = this.m_data.level;
        this.Score = 0;
        this.UpdeLevelData(level, null);
    };
    GameScenePanel.prototype.UpdeLevelData = function (a_levelId, a_curId) {
        this.m_monsterAddDelay = 0;
        this.m_levelState = ELevelType.Normal;
        this.m_isLuck = false;
        this.m_rectWarning.fillColor = 0xff0000;
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.m_data.levelData = GameConfig.levelTable[a_levelId.toString()];
                var chapterId = this.m_data.levelData.section;
                var chapterData = GameConfig.chapterTable[chapterId.toString()];
                // Common.log("UpdeLevelData", a_levelId, chapterId)
                if (this.m_data.levelData.section >= GameConfig.curChpter) {
                    if (a_levelId > chapterData.begin) {
                        var lastLevel = a_curId;
                        if (a_curId == null)
                            lastLevel = this.m_data.GetLastLevel(a_levelId);
                        var lastLevelData = GameConfig.levelTable[lastLevel.toString()];
                        this.Score = lastLevelData.normalCount;
                    }
                    Common.UpdateCurLevel(a_levelId);
                    Common.UpdateCurChpter(this.m_data.levelData.section);
                }
                GameManager.Instance.updateSceneBg(chapterData.bg);
                break;
            case EBattleMode.Endless:
                GameManager.Instance.updateSceneBg("Bg1_png");
                this.m_data.levelData = GameConfig.levelTable[a_levelId.toString()];
                if (a_levelId == this.m_data.levelData.next) {
                    this.m_data.needScore += this.m_normalCount * 200;
                    this.m_normalCount++;
                }
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
        GameConfig.gameSpeedPercent = this.m_data.levelData.speed;
        if (a_levelId == 1000) {
            GameConfig.isGuide = true;
            this.m_rectWarning.fillColor = 0x000000;
            this.m_isLuck = true;
            this.m_gesture.removeEvent();
            Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this);
        }
    };
    GameScenePanel.prototype.GuideStart = function () {
        this.m_rectWarning.visible = true;
        if (GameConfig.guideIndex == 0) {
            this.m_guideArmatureContainer.play("xinshouyindao", 0);
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                for (var j = 0; j < monster.Balloons.length; j++) {
                    var balloon = monster.Balloons[j];
                    balloon.GuideStart();
                }
            }
            this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
            Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
        }
        else {
        }
    };
    GameScenePanel.prototype.GuideEnd = function () {
        this.m_rectWarning.visible = false;
        // this.m_guideArmatureContainer.stop()
        // this.m_guideArmatureContainer.visible = false
        GameConfig.isGuide = false;
        this.Power = 0;
        Common.UpdateGuide(2);
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
    };
    // 进入面板
    GameScenePanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_gameScenePanel;
        Common.gameScene().uiLayer.addChild(this);
        this.Init();
    };
    // 退出面板
    GameScenePanel.prototype.onExit = function () {
        this.ClearAllActor();
        Common.gameScene().uiLayer.removeChild(this);
        this.Exit();
        GameVoice.battleBGMChannel.stop();
    };
    GameScenePanel.prototype.Update = function (timeElapsed) {
        var actorElapsed = timeElapsed;
        if (this.m_slowDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
            this.m_slowDelay += timeElapsed;
            if (this.m_slowDelay >= this.m_baby.skillData.time) {
                this.m_slowDelay = -1;
            }
        }
        if (GameManager.Instance.GameState == EGameState.Start) {
            if (this.m_slowDelay >= 0)
                actorElapsed *= 0.2;
            if (this.m_levelState == ELevelType.Normal) {
                this.m_monsterAddDelay += timeElapsed;
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
                        if (monster.Type == EMonsterDifficult.Normal) {
                            monster.ResetVertical();
                        }
                    }
                    for (var i = 0; i < this.m_summonActors.length; i++) {
                        var summon = this.m_summonActors[i];
                        summon.ResetVertical();
                    }
                }
            }
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                if (monster.State == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._Warning();
                }
                this.m_baby.ReleaseSkill(this.m_score, ESkillReleaseType.Range, monster);
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                var summon = this.m_summonActors[i];
                if (summon.State == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this._Warning();
                }
                this.m_baby.ReleaseSkill(this.m_score, ESkillReleaseType.Range, summon);
            }
            if (this.m_score < this.m_data.needScore && this.m_monsterAddDelay >= this.m_data.levelData.addTime) {
                this.m_monsterAddDelay = 0;
                this._CreateMonster();
                if (GameConfig.isGuide)
                    this.m_score++;
            }
            if (this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay && !GameConfig.isGuide) {
                this.m_luckyAddDelay = 0;
                this._CreateLuckyActor();
            }
        }
        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (var i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(actorElapsed);
            }
            for (var i = 0; i < this.m_spiderActors.length; i++) {
                this.m_spiderActors[i].Update(actorElapsed);
            }
        }
        if (GameManager.Instance.GameState == EGameState.Start) {
            for (var i = 0; i < this.m_bullets.length; i++) {
                this.m_bullets[i].Update(timeElapsed);
            }
            for (var i = 0; i < this.m_luckyActors.length; i++) {
                this.m_luckyActors[i].Update(actorElapsed);
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                this.m_summonActors[i].Update(actorElapsed);
            }
            this.m_baby.update(timeElapsed);
        }
    };
    GameScenePanel.prototype.RemoveMonster = function (a_monster) {
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i]);
                this.m_monsters.splice(i, 1);
                // this._CreateMonster()
                break;
            }
        }
        this._ChangeLevel();
    };
    GameScenePanel.prototype.RemoveBullet = function (a_bullet) {
        for (var i = 0; i < this.m_bullets.length; i++) {
            if (this.m_bullets[i] == a_bullet) {
                this.m_groupGameEffect.removeChild(this.m_bullets[i]);
                this.m_bullets.splice(i, 1);
                break;
            }
        }
    };
    GameScenePanel.prototype.RemoveLuckyActor = function (a_lucky) {
        for (var i = 0; i < this.m_luckyActors.length; i++) {
            if (this.m_luckyActors[i] == a_lucky) {
                this.m_groupGame.removeChild(this.m_luckyActors[i]);
                this.m_luckyActors.splice(i, 1);
                break;
            }
        }
    };
    GameScenePanel.prototype.RemoveSummonActor = function (a_summon) {
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i] == a_summon) {
                this.m_groupGame.removeChild(this.m_summonActors[i]);
                this.m_summonActors.splice(i, 1);
                break;
            }
        }
        this._ChangeLevel();
    };
    GameScenePanel.prototype.RemoveSpiderActor = function (a_spider) {
        for (var i = 0; i < this.m_spiderActors.length; i++) {
            if (this.m_spiderActors[i] == a_spider) {
                this.m_groupGame.removeChild(this.m_spiderActors[i]);
                this.m_spiderActors.splice(i, 1);
                break;
            }
        }
        this._ChangeLevel();
    };
    GameScenePanel.prototype.ClearAllActor = function () {
        while (this.m_monsters.length > 0) {
            var monster = this.m_monsters.pop();
            monster.Destroy();
            this.m_groupGame.removeChild(monster);
        }
        while (this.m_bullets.length > 0) {
            var bullet = this.m_bullets.pop();
            bullet.Destroy();
            this.m_groupGameEffect.removeChild(bullet);
        }
        while (this.m_luckyActors.length > 0) {
            var lucky = this.m_luckyActors.pop();
            lucky.Destroy();
            this.m_groupGame.removeChild(lucky);
        }
        while (this.m_summonActors.length > 0) {
            var summon = this.m_summonActors.pop();
            summon.Destroy();
            this.m_groupGame.removeChild(summon);
        }
        while (this.m_spiderActors.length > 0) {
            var spider = this.m_spiderActors.pop();
            spider.Destroy();
            this.m_groupGame.removeChild(spider);
        }
    };
    GameScenePanel.prototype.GetAllActors = function () {
        this.m_data.allActors.length = 0;
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].State == EMonsterState.Ready) {
                this.m_data.allActors.push(this.m_monsters[i]);
            }
        }
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].State == EMonsterState.Ready) {
                this.m_data.allActors.push(this.m_summonActors[i]);
            }
        }
        return this.m_data.allActors;
    };
    /**是否没有生还的怪物或者召唤物 */
    GameScenePanel.prototype.IsNoneAlive = function () {
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i].State == EMonsterState.Ready) {
                return false;
            }
        }
        for (var i = 0; i < this.m_summonActors.length; i++) {
            if (this.m_summonActors[i].State == EMonsterState.Ready) {
                return false;
            }
        }
        return true;
    };
    Object.defineProperty(GameScenePanel.prototype, "Score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
            this.m_bitLabScore.text = this.m_score.toString();
            if (this.m_score >= this.m_data.needScore * 0.5 && !this.m_isLuck) {
                //引导关没有
                this.m_isLuck = true;
                GameConfig.gameSpeedPercent = GameConfig.gameSpeedPercent * 1.1;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "Power", {
        get: function () {
            return this.m_power;
        },
        set: function (value) {
            if (this.m_baby == null)
                return;
            this.m_power = value;
            this.m_angle = 180 + this.m_power * 2;
            this.m_angle = Math.min(this.m_angle, 360);
            this.m_baby.updateProgress(this.m_angle);
            this.m_baby.ReleaseSkill(this.m_angle, ESkillReleaseType.Immediately);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "GroundPos", {
        get: function () {
            return this.m_imgGroundLine.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "GuidePos", {
        get: function () {
            return this.m_imgGuide.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "WaterPos", {
        get: function () {
            return this.m_imgGroundWater.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "WarningPos", {
        get: function () {
            return this.m_imgGroundWarning.y;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "LevelStage", {
        get: function () {
            return this.m_levelState;
        },
        enumerable: true,
        configurable: true
    });
    GameScenePanel.prototype.ActorDeadHandle = function () {
        if (this.m_levelState == ELevelType.Normal && this.m_score >= this.m_data.needScore && this.IsNoneAlive()) {
            this.m_levelState = ELevelType.EliteWarning;
        }
        // Common.log(this.m_levelState, this.m_score, this.m_currentLevel.normalCount, this.IsNoneAlive())
        if (this.m_levelState == ELevelType.EliteWarning) {
            if (GameConfig.isGuide) {
                this.Score = 0;
                if (GameConfig.guideIndex == 0) {
                    this.Power = 90;
                    GameConfig.guideIndex = 1;
                    this.m_rectWarning.visible = false;
                    this.m_guideArmatureContainer.stop();
                    this.m_guideArmatureContainer.visible = false;
                    this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key);
                    this.GuideEnd();
                    // this.UpdeLevelData(1000)
                    // this.m_gesture.removeEvent()
                    // Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this)
                }
                else {
                    this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key);
                    this.GuideEnd();
                }
            }
            else {
                this.m_levelState = ELevelType.End;
                this._EnterWarning();
            }
        }
    };
    Object.defineProperty(GameScenePanel.prototype, "Boom", {
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
    GameScenePanel.prototype.UpdateBatter = function () {
        if (this.m_isBoom) {
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
                if (this.m_comboCount <= 5)
                    GameConfig.balloonScore += 2;
                else if (this.m_comboCount > 5 && this.m_comboCount <= 10)
                    GameConfig.balloonScore += 3;
                else
                    GameConfig.balloonScore += 4;
                var addSpeed = Math.min(6, this.m_comboCount) * 0.02;
                for (var i = 0; i < this.m_monsters.length; i++) {
                    var monster = this.m_monsters[i];
                    if (monster.Type == EMonsterDifficult.Normal) {
                        monster.SetVertical(addSpeed);
                    }
                }
                for (var i = 0; i < this.m_summonActors.length; i++) {
                    var summon = this.m_summonActors[i];
                    summon.SetVertical(addSpeed);
                }
            }
            if (this.m_comboCount <= 2)
                GameConfig.comboDelay = 1200;
            else
                GameConfig.comboDelay = 1000;
        }
        if (this.m_levelState == ELevelType.Normal)
            this.Score += GameConfig.balloonScore;
        this.Score = Math.min(this.m_data.needScore, this.m_score);
        this.ActorDeadHandle();
    };
    GameScenePanel.prototype._Warning = function () {
        this.m_rectWarning.visible = true;
        this.m_isWarning = true;
        this.warning.play(0);
    };
    /**
     * 释放技能
     */
    GameScenePanel.prototype.ReleaseSkill = function () {
        if (this.m_angle >= 360) {
            // this.m_imgEffectMask.visible = true
            // this.effectMask.play(0)
            // this._UpdateItemArmature(true)
            this.m_angle = 180;
            this.m_power = 0;
            this.m_baby.gotoAttack();
        }
    };
    /**
     * 进入下一关
     */
    GameScenePanel.prototype._ChangeLevel = function () {
        if (this.m_monsters.length <= 0
            && this.m_summonActors.length <= 0
            && this.m_spiderActors.length <= 0
            && this.m_levelState == ELevelType.Elite) {
            if (GameConfig.gameMode == EBattleMode.Level) {
                GameManager.Instance.EndLevel();
            }
            else {
                this.UpdeLevelData(this.m_data.levelData.next, this.m_data.levelData.key);
            }
        }
    };
    /**
     * 进入boss
     */
    GameScenePanel.prototype._EnterWarning = function () {
        this.m_imgBossWarning.visible = true;
        this.bossWarning.play(0);
        GameVoice.bossWarning.play(0, 1);
        // egret.setTimeout(this._EnterBoss, this, 2000)
    };
    GameScenePanel.prototype._EnterBoss = function () {
        this.m_imgBossWarning.visible = false;
        // 1.5s后BOSS创建
        egret.setTimeout(this._BossArrive, this, 1500);
    };
    GameScenePanel.prototype._BossArrive = function () {
        this.m_levelState = ELevelType.Elite;
        var m_sumWeight = 0;
        for (var i = 0; i < this.m_data.levelData.elite.length; i++) {
            m_sumWeight += this.m_data.levelData.elite[i].prob;
            this.m_data.levelData.elite[i].weight = m_sumWeight;
        }
        var random = MathUtils.getRandom(1, m_sumWeight);
        for (var i = 0; i < this.m_data.levelData.elite.length; i++) {
            if (random <= this.m_data.levelData.elite[i].weight) {
                this.m_bossData = this.m_data.levelData.elite[i];
                break;
            }
        }
        if (this.m_bossData.id == 1006) {
            this.PlaySpiderWebArmature("arrive1", 1);
        }
        else
            this._CreateMonster();
    };
    Object.defineProperty(GameScenePanel.prototype, "Boss", {
        get: function () {
            return this.m_bossData;
        },
        enumerable: true,
        configurable: true
    });
    GameScenePanel.prototype._OnGesture = function () {
        if (GameConfig.gestureType > 0) {
            GameConfig.balloonScore = 0;
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                for (var j = 0; j < monster.Balloons.length; j++) {
                    var balloon = monster.Balloons[j];
                    if (balloon.type == GameConfig.gestureType) {
                        monster.BallExplosion(balloon);
                    }
                }
            }
            for (var i = 0; i < this.m_luckyActors.length; i++) {
                var lucky = this.m_luckyActors[i];
                if (lucky.ballon.type == GameConfig.gestureType) {
                    lucky.UpdateGesture();
                }
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                var summon = this.m_summonActors[i];
                if (summon.GestureType == GameConfig.gestureType) {
                    summon.GotoDead();
                }
            }
            for (var i = 0; i < this.m_spiderActors.length; i++) {
                var spider = this.m_spiderActors[i];
                for (var j = 0; j < spider.Balloons.length; j++) {
                    var balloon = spider.Balloons[j];
                    if (balloon.type == GameConfig.gestureType) {
                        spider.BallExplosion(balloon);
                    }
                }
            }
            this.UpdateBatter();
        }
    };
    GameScenePanel.prototype._OnBtnPause = function () {
        GameManager.Instance.Pause();
    };
    GameScenePanel.prototype._OnReadyComplete = function () {
        this.touchChildren = true;
        this.m_bitLabScore.visible = true;
        GameManager.Instance.Start();
        this.m_baby.gotoRun();
    };
    GameScenePanel.prototype._OnWarningComplete = function () {
        this.m_isWarning = false;
        this.m_rectWarning.visible = false;
    };
    GameScenePanel.prototype._OnComboBeginComplete = function () {
        this.comboMove.play(0);
    };
    GameScenePanel.prototype._OnComboEndComplete = function () {
        this.m_fntCombo.visible = false;
        this.m_fntComboCount.visible = false;
    };
    GameScenePanel.prototype._OnComboMoveComplete = function () {
        this.comboMove.play(0);
    };
    GameScenePanel.prototype.PlaySpiderWebArmature = function (action, a_stage) {
        this.m_spiderWebArmatureContainer.visible = true;
        this.m_spiderWebArmatureContainer.play(action, 1);
        this.m_spiderStage = a_stage;
    };
    GameScenePanel.prototype._OnSpiderWebArmatureComplete = function () {
        switch (this.m_spiderStage) {
            case 1:
                this._CreateSpiderActor();
                this.PlaySpiderWebArmature("arrive2", 2);
                break;
            case 2:
                break;
            case 5:
                for (var i = 0; i < this.m_spiderActors.length; i++)
                    this.m_spiderActors[i].GotoMove();
                break;
        }
    };
    GameScenePanel.prototype._OnSpiderWebArmatureFrame = function () {
    };
    GameScenePanel.prototype._ComboArmature = function () {
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
        this.m_comboArmatureContainer.addCompleteCallFunc(this._ComboArmature, this);
        this.m_spiderWebArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupGame.addChild(this.m_spiderWebArmatureContainer);
        var spiderWebDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("wang", "wang");
        var spiderArmature = new DragonBonesArmature(spiderWebDisplay);
        spiderArmature.ArmatureDisplay = spiderWebDisplay;
        this.m_spiderWebArmatureContainer.register(spiderArmature, ["arrive1", "arrive2", "attack", "dead", "idle"]);
        this.m_spiderWebArmatureContainer.x = Config.stageHalfWidth;
        this.m_spiderWebArmatureContainer.y = 420;
        this.m_spiderWebArmatureContainer.addCompleteCallFunc(this._OnSpiderWebArmatureComplete, this);
        this.m_spiderWebArmatureContainer.addFrameCallFunc(this._OnSpiderWebArmatureFrame, this);
        this.m_spiderWebArmatureContainer.scaleX = 2.2;
        this.m_spiderWebArmatureContainer.scaleY = 2.2;
        this.m_guideArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupFull.addChild(this.m_guideArmatureContainer);
        var guideDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("xinshouyindao", "xinshouyindao");
        var guideArmature = new DragonBonesArmature(guideDisplay);
        guideArmature.ArmatureDisplay = guideDisplay;
        this.m_guideArmatureContainer.register(guideArmature, ["xinshouyindao"]);
        this.m_guideArmatureContainer.x = 50;
        this.m_guideArmatureContainer.y = -500;
        this.m_baby = new Baby();
        this.m_groupGame.addChild(this.m_baby);
        this.m_baby.y = Config.stageHeight * 0.9;
        this.addChild(this.m_gestureShape);
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this);
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this);
        this.warning.addEventListener('complete', this._OnWarningComplete, this);
        this.comboBegin.addEventListener('complete', this._OnComboBeginComplete, this);
        this.comboEnd.addEventListener('complete', this._OnComboEndComplete, this);
        this.comboMove.addEventListener('complete', this._OnComboMoveComplete, this);
        this.bossWarning.addEventListener('complete', this._EnterBoss, this);
        Common.addTouchBegin(this.m_btnPause);
        this._OnResize();
    };
    GameScenePanel.prototype.SetParticle = function (a_visible, x, y) {
        // this._particle.visible = a_visible
        // if (a_visible) {
        // 	this._particle.start(1)
        // }
        // this._particle.emitterX = x
        // this._particle.emitterY = y
    };
    GameScenePanel.prototype._CreateMonster = function () {
        var monster = GameObjectPool.getInstance().createObject(Monster, "Monster");
        monster.Init(this.m_data.levelData, this.m_levelState);
        monster.UpdateEffectArmature(this.m_baby.skillData);
        this.m_monsters.push(monster);
        for (var i = this.m_monsters.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_monsters[i]);
        }
    };
    GameScenePanel.prototype._CreateLuckyActor = function () {
        var lucky = GameObjectPool.getInstance().createObject(LuckyActor, "LuckyActor");
        lucky.Init();
        this.m_luckyActors.push(lucky);
        this.m_groupGame.addChild(lucky);
    };
    GameScenePanel.prototype._CreateSpiderActor = function () {
        var spider = GameObjectPool.getInstance().createObject(SpiderActor, "SpiderActor");
        spider.Init(this.m_data.levelData);
        this.m_spiderActors.push(spider);
        this.m_groupGame.addChild(spider);
    };
    GameScenePanel.prototype.CreateSummonActor = function (a_data, a_x, a_y, a_count, a_num, isBoss) {
        if (a_count === void 0) { a_count = 0; }
        if (a_num === void 0) { a_num = 0; }
        if (isBoss === void 0) { isBoss = false; }
        var summon = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor");
        var posX = this.m_data.getSummonTargetX(EMonsterPos.Left, a_x, a_y, a_count, a_num, isBoss);
        var flag = MathUtils.getRandom(1, 2);
        var targetX = 0;
        if (flag == 1)
            targetX = a_x + MathUtils.getRandom(-250, -100);
        else
            targetX = a_x + MathUtils.getRandom(100, 250);
        var targetY = a_y + MathUtils.getRandom(-20, 20);
        // summon.UpdateEffectArmature(effectData)
        summon.Init(a_data, targetX, targetY, a_x, a_y, a_count, a_num, isBoss);
        this.m_summonActors.push(summon);
        for (var i = this.m_summonActors.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_summonActors[i]);
        }
    };
    GameScenePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameScenePanel;
}(BasePanel));
__reflect(GameScenePanel.prototype, "GameScenePanel");
//# sourceMappingURL=GameScenePanel.js.map