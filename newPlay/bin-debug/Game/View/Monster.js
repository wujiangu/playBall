var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this.m_gesture = Common.createBitmap("gestureSheet_json.gesture001");
        return _this;
    }
    Monster.prototype.Init = function () {
        this.m_sumWeight = 0;
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            this.m_sumWeight += GameConfig.monsterConfig[i].Prob;
            GameConfig.monsterConfig[i].weight = this.m_sumWeight;
        }
        this.m_data = this._RandomMonsterData();
        if (this.m_data) {
            this.InitData();
            this.InitGraph();
        }
        else {
            Error("no wolf data");
        }
    };
    Monster.prototype.InitData = function () {
        var name = this.m_data.Animation;
        var armature = DragonBonesFactory.getInstance().buildArmature(name, name);
        var clock = DragonBonesFactory.getInstance().createWorldClock(10.0);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armature, clock);
        }
        this.m_armature.Armature = armature;
        this.m_armature.Clock = clock;
        // this.m_armatureContainer.scaleX = 0.5
        // this.m_armatureContainer.scaleY = 0.5
        this.m_armatureContainer.register(this.m_armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
        ]);
        this.m_state = EMonsterState.Ready;
        this.m_speedY = GameConfig.baseFallSpeed + this.m_data.Speed / 100;
        this.m_speedX = 0.2;
        this.m_gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            this.m_gestureData.push(GameConfig.gestureConfig[i]);
        }
    };
    Monster.prototype.InitGraph = function () {
        this.y = 0;
        this.filters = [this.m_dropShadowFilter];
        this.UpdateSignSlot();
        this.GotoIdle();
        this.x = MathUtils.getRandom(this.m_armatureContainer.width / 2, Config.stageWidth - this.m_armatureContainer.width / 2);
    };
    Monster.prototype.GotoIdle = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0);
    };
    Monster.prototype.GotoHurt = function () {
        if (this.m_type != EMonsterType.Normal) {
            this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0);
        }
    };
    Monster.prototype.GotoDead = function () {
        if (this.y >= 100) {
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveMonster(this);
            PanelManager.m_gameScenePanel.Power += this.m_data.Power;
        }
        // if (this.m_type != EMonsterType.Normal) {
        // 	this.m_armatureContainer.play(DragonBonesAnimations.Dead, 0)
        // }
    };
    Monster.prototype.GotoRun = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Run, 0);
    };
    Monster.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Ready) {
            this.y += timeElapsed * this.m_speedY;
            if (this.y >= Config.stageHeight - 120) {
                this.y = Config.stageHeight - 120;
                this.m_state = EMonsterState.Run;
                this.GotoRun();
            }
        }
        else if (this.m_state == EMonsterState.Run) {
            this.x -= timeElapsed * this.m_speedX;
            if (this.x <= -this.m_armatureContainer.width) {
                this.m_state = EMonsterState.Dead;
                this.Destroy();
                PanelManager.m_gameScenePanel.RemoveMonster(this);
            }
        }
    };
    Monster.prototype.Destroy = function () {
        this.m_armatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    /**
     * 更新符号槽位
     */
    Monster.prototype.UpdateSignSlot = function () {
        var random = MathUtils.getRandom(this.m_gestureData.length - 1);
        var slot = this.m_armature.Armature.getSlot("Sign");
        this.m_gesture.texture = RES.getRes(this.m_gestureData[random].path);
        this.m_gesture.x = slot.display.x;
        this.m_gesture.y = slot.display.y;
        this.m_gesture.anchorOffsetX = this.m_gesture.width / 2;
        this.m_gesture.anchorOffsetY = this.m_gesture.height / 2;
        slot.setDisplay(this.m_gesture);
        this.m_gestureType = this.m_gestureData[random].type;
    };
    Object.defineProperty(Monster.prototype, "GestureType", {
        get: function () {
            return this.m_gestureType;
        },
        set: function (value) {
            this.m_gestureType = value;
        },
        enumerable: true,
        configurable: true
    });
    Monster.prototype._RandomMonsterData = function () {
        var random = MathUtils.getRandom(1, this.m_sumWeight);
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            if (random <= GameConfig.monsterConfig[i].weight) {
                return GameConfig.monsterConfig[i];
            }
        }
        return null;
    };
    return Monster;
}(BaseActor));
__reflect(Monster.prototype, "Monster");
//# sourceMappingURL=Monster.js.map