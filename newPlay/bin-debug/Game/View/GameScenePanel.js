var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var GameScenePanel = (function (_super) {
    __extends(GameScenePanel, _super);
    function GameScenePanel() {
        var _this = _super.call(this) || this;
        _this.test = false;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameScenePanel.exml";
        _this.m_monsters = new Array();
        _this.m_bullets = new Array();
        _this.m_luckyActors = new Array();
        _this.m_summonActors = new Array();
        return _this;
    }
    // 初始化面板
    GameScenePanel.prototype.initPanel = function () {
        this.m_gestureShape = new egret.Shape();
        this.m_gesture = new Gesture();
        this.m_gesture.Init();
        this.m_cloud1Speed = 0.6;
        this.m_cloud2Speed = 0.3;
        this.m_cloud3Speed = 0.1;
        this.m_currentItemId = 0;
        this.m_progress = new egret.Shape();
    };
    GameScenePanel.prototype.Init = function () {
        this.ClearAllActor();
        this.touchChildren = false;
        this.readyAnimate.play(0);
        this.initData();
        this.m_imgEffectMask.visible = false;
        this.m_rectWarning.visible = false;
        this.m_bitLabScore.visible = false;
        this.m_combo.visible = false;
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
    };
    GameScenePanel.prototype.Exit = function () {
        this.m_imgEffectMask.visible = false;
        this.touchChildren = false;
        this.m_gesture.removeEvent();
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this);
    };
    // 初始化面板数据
    GameScenePanel.prototype.initData = function () {
        GameConfig.gestureType = 0;
        this.m_monsterAddDelay = 0;
        this.m_luckyAddDelay = 0;
        this.m_angle = 180;
        this.Power = 0;
        this.m_score = 0;
        this.m_slowDelay = -1;
        this.m_comboDelay = -1;
        this.m_comboCount = 0;
        this.m_isBoom = false;
        // this.m_labScore.text = this.m_score.toString()
        this.m_bitLabScore.text = this.m_score.toString();
        this.UpdeLevelData(1001);
        ShakeTool.getInstance().setInitPos(this.m_imgScene.x, this.m_imgScene.y);
    };
    GameScenePanel.prototype.UpdeLevelData = function (a_levelId) {
        this.m_currentLevel = GameConfig.levelConfig[a_levelId.toString()];
        this.m_passTime = 0;
        this.m_monsterAddDelay = 0;
        this.m_allTime = this.m_currentLevel.normalTime + this.m_currentLevel.eliteTime;
        this.m_levelState = ELevelType.Normal;
        this.m_eliteCount = 0;
    };
    // 进入面板
    GameScenePanel.prototype.onEnter = function () {
        Common.curPanel = PanelManager.m_gameScenePanel;
        Common.gameScene().uiLayer.addChild(this);
        this.m_groupPower.visible = true;
        if (GameConfig.itemUseTable.length <= 0) {
            this.m_groupPower.visible = false;
            this.m_curItemData = null;
        }
        else {
            var index = GameConfig.itemUseTable.indexOf(this.m_currentItemId);
            var id = this.m_currentItemId;
            if (index < 0) {
                id = GameConfig.itemUseTable[0];
                this.m_currentItemId = id;
            }
            this.m_curItemData = GameConfig.itemTable[id.toString()];
            this._UpdateItemArmature();
            this._UpdateFullArmature();
        }
        this.Init();
        if (GameVoice.battleBGMChannel != null)
            GameVoice.battleBGMChannel.stop();
        GameVoice.battleBGMChannel = GameVoice.battleBGMSound.play(0);
        GameVoice.battleBGMChannel.volume = GameConfig.bgmValue / 100;
        // this._CreateMonster()
    };
    // 退出面板
    GameScenePanel.prototype.onExit = function () {
        this.ClearAllActor();
        this.m_itemArmatureContainer.clear();
        Common.gameScene().uiLayer.removeChild(this);
        this.Exit();
        GameVoice.battleBGMChannel.stop();
    };
    GameScenePanel.prototype.Update = function (timeElapsed) {
        var actorElapsed = timeElapsed;
        if (this.m_slowDelay >= 0 && GameManager.Instance.GameState == EGameState.Start) {
            this.m_slowDelay += timeElapsed;
            if (this.m_slowDelay >= GameConfig.slowDuration) {
                this.m_slowDelay = -1;
            }
        }
        if (GameManager.Instance.GameState == EGameState.Start) {
            this.m_monsterAddDelay += timeElapsed;
            this.m_luckyAddDelay += timeElapsed;
            this.m_passTime += timeElapsed;
            if (this.m_passTime < this.m_currentLevel.normalTime) {
                this.m_levelState = ELevelType.Normal;
            }
            else if (this.m_passTime >= this.m_currentLevel.normalTime && this.m_passTime < this.m_allTime) {
                this.m_levelState = ELevelType.Elite;
                if (this.m_eliteCount >= this.m_currentLevel.eliteCount)
                    this.m_levelState = ELevelType.Normal;
            }
            else {
                this.m_levelState = ELevelType.End;
            }
            if (this.m_slowDelay >= 0)
                actorElapsed *= 0.2;
            // 连击
            if (this.m_comboDelay >= 0) {
                this.m_comboDelay += actorElapsed;
                if (this.m_comboDelay >= GameConfig.comboDelay) {
                    this.m_comboDelay = -1;
                    this.m_comboCount = 0;
                    this.m_isBoom = false;
                    this.m_combo.visible = false;
                }
            }
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                if (monster.State == EMonsterState.Ready && monster.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this.m_rectWarning.visible = true;
                    this.m_isWarning = true;
                    this.warning.play(0);
                }
            }
            for (var i = 0; i < this.m_summonActors.length; i++) {
                var summon = this.m_summonActors[i];
                if (summon.State == EMonsterState.Ready && summon.y >= this.m_imgGroundWarning.y && !this.m_isWarning) {
                    this.m_rectWarning.visible = true;
                    this.m_isWarning = true;
                    this.warning.play(0);
                }
            }
        }
        if (this.m_levelState != ELevelType.End && GameManager.Instance.GameState == EGameState.Start && this.m_monsterAddDelay >= this.m_currentLevel.addTime) {
            this.m_monsterAddDelay = 0;
            this._CreateMonster();
        }
        if (GameManager.Instance.GameState == EGameState.Start && this.m_luckyAddDelay >= GameConfig.luckyActorAddDelay) {
            this.m_luckyAddDelay = 0;
            this._CreateLuckyActor();
        }
        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (var i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(actorElapsed);
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
        }
        if (this.m_cloud1.x >= -this.m_cloud1.width) {
            this.m_cloud1.x -= this.m_cloud1Speed;
        }
        else {
            this.m_cloud1.x = Config.stageWidth;
        }
        if (this.m_cloud2.x >= -this.m_cloud2.width) {
            this.m_cloud2.x -= this.m_cloud2Speed;
        }
        else {
            this.m_cloud2.x = Config.stageWidth;
        }
        if (this.m_cloud3.x <= Config.stageWidth + this.m_cloud3.width) {
            this.m_cloud3.x += this.m_cloud1Speed;
        }
        else {
            this.m_cloud3.x = -this.m_cloud3.width;
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
    };
    Object.defineProperty(GameScenePanel.prototype, "Score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
            // this.m_labScore.text = this.m_score.toString()
            this.m_bitLabScore.text = this.m_score.toString();
            // egret.Tween.get(this.m_labScore).to({scaleX:2.0, scaleY:2.0}, 100, egret.Ease.backIn).call(this._OnScoreBigger, this)
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "Power", {
        get: function () {
            return this.m_power;
        },
        set: function (value) {
            if (this.m_curItemData == null)
                return;
            this.m_power = value;
            this.m_angle = 180 + value * 2;
            this.m_angle = Math.min(this.m_angle, 360);
            if (this.m_angle >= 360) {
                this.m_imgEffectMask.visible = true;
                this.effectMask.play(0);
                this._UpdateItemArmature(true);
                this.m_angle = 180;
                this.m_power = 0;
            }
            this._UpdateProgress(this.m_angle);
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
    Object.defineProperty(GameScenePanel.prototype, "EliteCount", {
        get: function () {
            return this.m_eliteCount;
        },
        set: function (value) {
            this.m_eliteCount = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "MountBg", {
        get: function () {
            return this.m_imgScene;
        },
        enumerable: true,
        configurable: true
    });
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
    /**
     * 进入下一关
     */
    GameScenePanel.prototype._ChangeLevel = function () {
        if (this.m_monsters.length <= 0 && this.m_summonActors.length <= 0 && this.m_passTime > this.m_allTime && this.m_levelState == ELevelType.End) {
            this.UpdeLevelData(this.m_currentLevel.next);
        }
    };
    /**
     * 更新道具图标动画
     *
     */
    GameScenePanel.prototype._UpdateItemArmature = function (isRelease) {
        if (isRelease === void 0) { isRelease = false; }
        this.m_itemArmatureContainer.clear();
        var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
        var name = isRelease ? effectData.release : effectData.name;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_itemArmature == null) {
            this.m_itemArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_itemArmature.ArmatureDisplay = armatureDisplay;
        this.m_itemArmatureContainer.register(this.m_itemArmature, [name]);
        if (isRelease) {
            var channel = GameVoice.skillBeginSound.play(0, 1);
            channel.volume = GameConfig.soundValue / 100;
            this.m_itemArmatureContainer.play(name, 1);
            GameManager.Instance.Pause(true);
            this.m_itemArmatureContainer.addCompleteCallFunc(this._OnItemArmatureComplete, this);
        }
        else {
            this.m_itemArmatureContainer.play(name, 0);
        }
    };
    /**
     * 更新全屏特效动画
     */
    GameScenePanel.prototype._UpdateFullArmature = function () {
        this.m_fullArmatureContainer.clear();
        var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
        var name = effectData.step1;
        if (effectData.bullet == "" && name != "") {
            var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
            if (this.m_fullArmature == null) {
                this.m_fullArmature = new DragonBonesArmature(armatureDisplay);
            }
            this.m_fullArmature.ArmatureDisplay = armatureDisplay;
            this.m_fullArmatureContainer.visible = false;
            this.m_fullArmatureContainer.register(this.m_fullArmature, [name]);
            this.m_fullArmatureContainer.scaleX = 1.2;
        }
    };
    GameScenePanel.prototype._UpdateProgress = function (angle) {
        var r = this.m_imgPower.height / 2;
        this.m_progress.graphics.clear();
        this.m_progress.graphics.beginFill(0x00ffff);
        this.m_progress.graphics.moveTo(r, r);
        this.m_progress.graphics.lineTo(2 * r, r);
        this.m_progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this.m_progress.graphics.lineTo(r, r);
        this.m_progress.graphics.endFill();
        this.m_progress.x = 0;
        this.m_progress.y = 20;
    };
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
                    summon.GotoExplore();
                }
            }
            if (this.m_isBoom) {
                this.m_comboDelay = 0;
                this.m_comboCount += 1;
                this.m_isBoom = false;
                if (this.m_comboCount >= 2) {
                    this.m_combo.visible = true;
                    this.m_combo.text = "Combo X " + this.m_comboCount;
                    this.combo.play(0);
                    GameConfig.balloonScore *= this.m_comboCount;
                }
            }
            this.Score += GameConfig.balloonScore;
        }
    };
    GameScenePanel.prototype._OnBtnPause = function () {
        GameManager.Instance.Pause();
    };
    GameScenePanel.prototype._OnItemArmatureComplete = function () {
        if (this.m_curItemData != null) {
            var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
            var count = Math.min(this.m_monsters.length, effectData.count);
            if (count > 0) {
                var channel = GameVoice.fireBallSound.play(0, 1);
                channel.volume = GameConfig.soundValue / 100;
                var bulletCount = 0;
                for (var index = 0; index < this.m_monsters.length; index++) {
                    if (this.m_monsters[index].State == EMonsterState.Ready) {
                        this._CreateBullete(this.m_monsters[index]);
                        bulletCount++;
                    }
                    if (bulletCount >= count)
                        break;
                }
            }
            else {
                // 全屏
                var name_1 = effectData.step1;
                if (name_1 != "") {
                    this.m_fullArmatureContainer.visible = true;
                    this.m_fullArmatureContainer.play(name_1, 1);
                }
                switch (effectData.type) {
                    case EEffectType.Ice:
                        GameVoice.iceEffectSound.play(0, 1).volume = GameConfig.soundValue / 100;
                        this.m_slowDelay = 0;
                        break;
                    case EEffectType.ChangeGesture:
                        GameVoice.staffSound.play(0, 1).volume = GameConfig.soundValue / 100;
                        for (var i = 0; i < this.m_monsters.length; i++) {
                            this.m_monsters[i].ChangeToEasy();
                        }
                        break;
                    default:
                        break;
                }
            }
        }
        this.m_itemArmatureContainer.removeCompleteCallFunc(this._OnItemArmatureComplete, this);
        GameManager.Instance.Start();
        this._UpdateItemArmature();
    };
    GameScenePanel.prototype._OnReadyComplete = function () {
        this.touchChildren = true;
        // this.m_labScore.visible = true
        this.m_bitLabScore.visible = true;
        GameManager.Instance.Start();
    };
    GameScenePanel.prototype._OnFullArmatureComplete = function () {
    };
    GameScenePanel.prototype._ItemArmatureFadeIn = function () {
        this._UpdateItemArmature();
        egret.Tween.get(this.m_itemArmatureContainer).to({ alpha: 1 }, 300, egret.Ease.circOut);
    };
    GameScenePanel.prototype._OnChangeItem = function () {
        // this.m_imgEffectMask.visible = true
        // this.effectMask.play(0)
        // this._UpdateItemArmature(true)
        if (GameConfig.itemUseTable.length > 1) {
            var index = GameConfig.itemUseTable.indexOf(this.m_currentItemId);
            if (index >= 0) {
                if (index < GameConfig.itemUseTable.length - 1) {
                    index++;
                }
                else {
                    index = 0;
                }
                this.m_currentItemId = GameConfig.itemUseTable[index];
                this.m_curItemData = GameConfig.itemTable[this.m_currentItemId.toString()];
                egret.Tween.get(this.m_itemArmatureContainer).to({ alpha: 0 }, 300, egret.Ease.circIn).call(this._ItemArmatureFadeIn, this);
                this._UpdateFullArmature();
            }
        }
    };
    GameScenePanel.prototype._OnWaterComplete = function () {
        this.water.play(0);
    };
    GameScenePanel.prototype._OnWarningComplete = function () {
        this.m_isWarning = false;
        this.m_rectWarning.visible = false;
    };
    GameScenePanel.prototype.onComplete = function () {
        this.m_itemArmatureContainer = new DragonBonesArmatureContainer();
        this.m_itemArmatureContainer.x = this.m_groupIcon.width / 2;
        this.m_itemArmatureContainer.y = this.m_groupIcon.height;
        this.m_groupIcon.addChild(this.m_itemArmatureContainer);
        this.m_fullArmatureContainer = new DragonBonesArmatureContainer();
        this.m_groupFull.addChild(this.m_fullArmatureContainer);
        this.addChild(this.m_gestureShape);
        this.m_imgPower.mask = this.m_progress;
        this.m_groupPower.addChild(this.m_progress);
        this.water.play(0);
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this);
        this.m_groupIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeItem, this);
        this.m_fullArmatureContainer.addCompleteCallFunc(this._OnFullArmatureComplete, this);
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this);
        this.water.addEventListener('complete', this._OnWaterComplete, this);
        this.warning.addEventListener('complete', this._OnWarningComplete, this);
        Common.addTouchBegin(this.m_btnPause);
        this._OnResize();
    };
    /**
     * 创建子弹
     */
    GameScenePanel.prototype._CreateBullete = function (target) {
        var bullet = GameObjectPool.getInstance().createObject(Bullet, "Bullet");
        var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
        if (effectData.bullet != "") {
            bullet.Init(target, effectData.bullet, effectData.type);
            this.m_bullets.push(bullet);
            this.m_groupGameEffect.addChild(bullet);
            bullet.x = this.m_bulletGroup.x + this.m_bulletGroup.width / 2;
            bullet.y = this.m_bulletGroup.y;
        }
    };
    GameScenePanel.prototype._CreateMonster = function () {
        var monster = GameObjectPool.getInstance().createObject(Monster, "Monster");
        monster.Init(this.m_currentLevel, this.m_levelState);
        if (this.m_curItemData != null) {
            var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
            monster.UpdateEffectArmature(effectData);
        }
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
    GameScenePanel.prototype.CreateSummonActor = function (a_data, a_x, a_y, a_count, a_num) {
        if (a_count === void 0) { a_count = 0; }
        if (a_num === void 0) { a_num = 0; }
        var summon = GameObjectPool.getInstance().createObject(SummonActor, "SummonActor");
        var targetX = a_x + MathUtils.getRandom(-150, 150);
        var targetY = a_y + MathUtils.getRandom(-20, 20);
        summon.Init(a_data, targetX, targetY, a_x, a_y, a_count, a_num);
        this.m_summonActors.push(summon);
        for (var i = this.m_summonActors.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_summonActors[i]);
        }
    };
    GameScenePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
        this.m_fullArmatureContainer.width = Config.stageWidth;
        this.m_fullArmatureContainer.height = Config.stageHeight;
    };
    return GameScenePanel;
}(BasePanel));
__reflect(GameScenePanel.prototype, "GameScenePanel");
//# sourceMappingURL=GameScenePanel.js.map