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
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameScenePanel.exml";
        GameConfig.monsterConfig = RES.getRes("monsterConfig_json");
        GameConfig.gestureConfig = RES.getRes("gesture_json");
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            var data = GameConfig.monsterConfig[i];
            GameConfig.InitBattleDragonBones(data.Animation);
        }
        _this.m_monsters = new Array();
        return _this;
    }
    // 初始化面板
    GameScenePanel.prototype.initPanel = function () {
        this.m_gestureShape = new egret.Shape();
        this.m_gesture = new Gesture();
        this.m_gesture.Init();
        this.m_cloud1Speed = 1;
        this.m_cloud2Speed = 0.6;
        this.m_cloud3Speed = 0.3;
        this.m_imgWaters = new Array();
        this.m_progress = new egret.Shape();
    };
    GameScenePanel.prototype.Init = function () {
        this.ClearAllActor();
        this.touchChildren = false;
        this.readyAnimate.play(0);
        this.initData();
        this.m_gesture.addEvent(this.m_gestureShape, this.m_groupGesture);
        Common.addEventListener(MainNotify.gestureAction, this._OnGesture, this);
    };
    GameScenePanel.prototype.Exit = function () {
        this.touchChildren = false;
        this.m_gesture.removeEvent();
        Common.removeEventListener(MainNotify.gestureAction, this._OnGesture, this);
    };
    // 初始化面板数据
    GameScenePanel.prototype.initData = function () {
        GameConfig.gestureType = 0;
        this.m_monsterAddDelay = 0;
        this.m_angle = 180;
        this.Power = 0;
        this.m_score = 0;
        this.m_labScore.text = this.m_score.toString();
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
            if (this.m_curItemData == null) {
                var id = GameConfig.itemUseTable[0].toString();
                this.m_curItemData = GameConfig.itemTable[id];
            }
            var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
            var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(effectData.name, effectData.name);
            if (this.m_itemArmature == null) {
                this.m_itemArmature = new DragonBonesArmature(armatureDisplay);
            }
            this.m_itemArmature.ArmatureDisplay = armatureDisplay;
            this.m_itemArmatureContainer.register(this.m_itemArmature, [
                effectData.name
            ]);
            this.m_itemArmatureContainer.play(effectData.name, 0);
        }
        this.Init();
        // this._CreateMonster()
    };
    // 退出面板
    GameScenePanel.prototype.onExit = function () {
        this.ClearAllActor();
        this.m_itemArmatureContainer.clear();
        Common.gameScene().uiLayer.removeChild(this);
        this.Exit();
    };
    GameScenePanel.prototype.Update = function (timeElapsed) {
        if (GameManager.Instance.GameState != EGameState.Pause) {
            this.m_monsterAddDelay += timeElapsed;
        }
        if (GameManager.Instance.GameState == EGameState.Start && this.m_monsterAddDelay >= GameConfig.monsterAddDelay) {
            this.m_monsterAddDelay = 0;
            this._CreateMonster();
        }
        if (GameManager.Instance.GameState == EGameState.Start || GameManager.Instance.GameState == EGameState.End) {
            for (var i = 0; i < this.m_monsters.length; i++) {
                this.m_monsters[i].Update(timeElapsed);
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
    };
    GameScenePanel.prototype.ClearAllActor = function () {
        while (this.m_monsters.length > 0) {
            var monster = this.m_monsters.pop();
            monster.Destroy();
            this.m_groupGame.removeChild(monster);
        }
    };
    Object.defineProperty(GameScenePanel.prototype, "Score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
            this.m_labScore.text = this.m_score.toString();
            this.m_labScore.anchorOffsetX = this.m_labScore.width / 2;
            this.m_labScore.anchorOffsetY = this.m_labScore.height / 2;
            this.m_labScore.x = 81 + this.m_labScore.anchorOffsetX;
            this.m_labScore.y = this.m_groupScore.height / 2;
            egret.Tween.get(this.m_labScore).to({ scaleX: 2.0, scaleY: 2.0 }, 100, egret.Ease.backIn).call(this._OnScoreBigger, this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameScenePanel.prototype, "Power", {
        get: function () {
            return this.m_power;
        },
        set: function (value) {
            this.m_power = value;
            this.m_angle = 180 + value * 2;
            this.m_angle = Math.min(this.m_angle, 360);
            this._UpdateProgress(this.m_angle);
        },
        enumerable: true,
        configurable: true
    });
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
    GameScenePanel.prototype._OnScoreBigger = function () {
        egret.Tween.get(this.m_labScore).to({ scaleX: 1.0, scaleY: 1.0 }, 100, egret.Ease.backOut);
    };
    GameScenePanel.prototype._OnGesture = function () {
        if (GameConfig.gestureType > 0 && (this.m_monsters.length > 0)) {
            for (var i = 0; i < this.m_monsters.length; i++) {
                var monster = this.m_monsters[i];
                for (var j = 0; j < monster.Balloons.length; j++) {
                    var balloon = monster.Balloons[j];
                    if (balloon.type == GameConfig.gestureType) {
                        monster.BallExplosion(balloon);
                    }
                }
            }
        }
    };
    GameScenePanel.prototype._OnBtnPause = function () {
    };
    GameScenePanel.prototype._WaterAnimate = function (target) {
        Animations.floatUpDown(target, 2000, 10, 0);
    };
    GameScenePanel.prototype._OnReadyComplete = function () {
        this.touchChildren = true;
        GameManager.Instance.Start();
    };
    GameScenePanel.prototype._OnChangeItem = function () {
        Common.log("切换道具");
        // for (let i = 0; i < this.m_monsters.length; i++) {
        //     let monster:Monster = this.m_monsters[i]
        //     if (monster.State == EMonsterState.Ready && monster.y >= 100) {
        //         this._CreateBullete(monster)
        //     }
        // }
    };
    GameScenePanel.prototype.onComplete = function () {
        this.m_imgWaters.push(this.m_imgWater0);
        this.m_imgWaters.push(this.m_imgWater1);
        this.m_imgWaters.push(this.m_imgWater2);
        this.m_imgWaters.push(this.m_imgWater3);
        this.m_imgWaters.push(this.m_imgWater4);
        this.m_imgWaters.push(this.m_imgWater5);
        this.m_imgWaters.push(this.m_imgWater6);
        for (var i = 0; i < this.m_imgWaters.length; i++) {
            this.m_imgWaters[i].y = 10;
            egret.setTimeout(this._WaterAnimate, this, i * 200, this.m_imgWaters[i]);
        }
        this.m_itemArmatureContainer = new DragonBonesArmatureContainer();
        this.m_itemArmatureContainer.x = this.m_groupIcon.width / 2;
        this.m_itemArmatureContainer.y = this.m_groupIcon.height;
        this.m_groupIcon.addChild(this.m_itemArmatureContainer);
        this.addChild(this.m_gestureShape);
        this.m_imgPower.mask = this.m_progress;
        this.m_groupPower.addChild(this.m_progress);
        this.m_btnPause.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnBtnPause, this);
        this.readyAnimate.addEventListener('complete', this._OnReadyComplete, this);
        this.m_groupIcon.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnChangeItem, this);
        this._OnResize();
    };
    GameScenePanel.prototype._CreateBullete = function (target) {
        var bullet = GameObjectPool.getInstance().createObject(Bullet, "Bullet");
        var effectData = GameConfig.effectTable[this.m_curItemData.Effect.toString()];
        if (effectData.bullet.length != "") {
            bullet.Init(target, effectData.bullet);
        }
    };
    GameScenePanel.prototype._CreateMonster = function () {
        var monster = GameObjectPool.getInstance().createObject(Monster, "Monster");
        monster.Init();
        this.m_monsters.push(monster);
        for (var i = this.m_monsters.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_monsters[i]);
        }
    };
    GameScenePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameScenePanel;
}(BasePanel));
__reflect(GameScenePanel.prototype, "GameScenePanel");
//# sourceMappingURL=GameScenePanel.js.map