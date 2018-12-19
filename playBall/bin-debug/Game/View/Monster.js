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
var Monster = (function (_super) {
    __extends(Monster, _super);
    function Monster() {
        var _this = _super.call(this) || this;
        _this.m_gesture = Common.createBitmap("gestureSheet_json.gesture001");
        return _this;
        // this.addChild(this.m_gesture)
    }
    Monster.prototype.Init = function () {
        this.m_sumWeight = 0;
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            this.m_sumWeight += GameConfig.monsterConfig[i].prob;
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
        var name = this.m_data.name;
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
        this.m_speedY = GameConfig.baseFallSpeed + this.m_data.speed;
        this.m_speedX = 0.2;
    };
    Monster.prototype.InitGraph = function () {
        this.y = 0;
        this.x = MathUtils.getRandom(Config.stageWidth - this.width);
        this.filters = [this.m_dropShadowFilter];
        var slot = this.m_armature.Armature.getSlot("小怪1_06");
        this.m_gesture.texture = RES.getRes("gestureSheet_json.gesture001");
        this.m_gesture.x = slot.display.x;
        this.m_gesture.y = slot.display.y;
        this.m_gesture.anchorOffsetX = this.m_gesture.width / 2;
        this.m_gesture.anchorOffsetY = this.m_gesture.height / 2;
        slot.setDisplay(this.m_gesture);
        // slot.display.texture = RES.getRes("gestureSheet_json.gesture001")
        // this.m_gesture.anchorOffsetX = this.m_gesture.width / 2
        // this.m_gesture.anchorOffsetY = this.m_gesture.height / 2
        // this.m_gesture.x = -50
        // this.m_gesture.y = -75
        this.GotoIdle();
    };
    Monster.prototype.GotoIdle = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0);
        Common.log("播放", DragonBonesAnimations.Idle, this.m_armatureContainer.width);
    };
    Monster.prototype.GotoHurt = function () {
        if (this.m_type != EMonsterType.Normal) {
            this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0);
        }
    };
    Monster.prototype.GotoDead = function () {
        if (this.m_type != EMonsterType.Normal) {
            this.m_armatureContainer.play(DragonBonesAnimations.Dead, 0);
        }
    };
    Monster.prototype.GotoRun = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Run, 0);
        Common.log("播放", DragonBonesAnimations.Run, this.m_armatureContainer.width);
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
                // this.Destroy()
                // PanelManager.gamePanel.RemoveWolf(this)
            }
        }
    };
    Monster.prototype.Destroy = function () {
        this.m_armatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
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