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
        _this.m_balloons = new Array();
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
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_armature.ArmatureDisplay = armatureDisplay;
        this.m_armatureContainer.register(this.m_armature, [
            DragonBonesAnimations.Idle,
            DragonBonesAnimations.Dead,
            DragonBonesAnimations.Run,
            DragonBonesAnimations.Hurt,
            DragonBonesAnimations.Explore,
        ]);
        this.m_state = EMonsterState.Ready;
        this.m_speedY = GameConfig.baseFallSpeed + this.m_data.Speed / 100;
        this.m_speedX = 0.2;
        this.m_armatureContainer.scaleX = this.m_data.Scale;
        this.m_armatureContainer.scaleY = this.m_data.Scale;
        this.m_rect.width = this.m_data.Width;
        this.m_rect.height = this.m_data.Height;
        this.m_gestureData.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            this.m_gestureData.push(GameConfig.gestureConfig[i]);
        }
        this.m_sumBalloon = 0;
    };
    Monster.prototype.InitGraph = function () {
        this.y = 0;
        // this.filters = [this.m_dropShadowFilter]
        this.GotoIdle();
        this.UpdateSignSlot();
        this.x = MathUtils.getRandom(this.m_rect.width / 2, Config.stageWidth - this.m_rect.width / 2);
    };
    Monster.prototype.GotoIdle = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Idle, 0);
        // this.m_armature.ArmatureDisplay.getBounds(this.m_rect, true)
        // this.m_armature.ArmatureDisplay.getTransformedBounds(this.m_armatureContainer, this.m_rect)
        // this.m_rect.width *= this.m_data.Scale
        // this.m_rect.height *= this.m_data.Scale
        // this.m_shape.graphics.drawRect(0, 0, this.m_rect.width, this.m_rect.height)
        // this.m_shape.graphics.endFill()
        // Common.log("GotoIdle宽度", this.m_data.Name, this.m_rect.width, this.m_rect.height)
    };
    Monster.prototype.GotoHurt = function () {
        if (this.m_type != EMonsterType.Normal) {
            this.m_armatureContainer.play(DragonBonesAnimations.Hurt, 0);
        }
    };
    Monster.prototype.GotoDead = function () {
        this.m_armatureContainer.play(DragonBonesAnimations.Dead, 1);
        this.m_state = EMonsterState.Dead;
        this.m_armatureContainer.addCompleteCallFunc(this._OnArmatureComplet, this);
        PanelManager.m_gameScenePanel.Power += this.m_data.Power;
    };
    Monster.prototype.GotoRun = function () {
        this._DestroyBalloon();
        this.m_armatureContainer.play(DragonBonesAnimations.Run, 0);
        GameManager.Instance.Stop();
    };
    /**
     * 更新怪物身上的特效动画
     */
    Monster.prototype.UpdateEffectArmature = function (name) {
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_effectArmature == null) {
            this.m_effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_effectArmature.ArmatureDisplay = armatureDisplay;
        this.m_effectArmatureContainer.register(this.m_effectArmature, [name]);
    };
    Monster.prototype.BallExplosion = function (a_ball) {
        if (this.y >= 100) {
            this.m_exploreIndex = 0;
            for (var i = 0; i < this.m_balloons.length; i++) {
                var balloon = this.m_balloons[i];
                if (balloon == a_ball) {
                    balloon.BalloonExplore();
                    this.m_balloons.splice(i, 1);
                    this.m_exploreIndex = i;
                    break;
                }
            }
        }
    };
    Monster.prototype.AllBalloonExplosion = function () {
        while (this.m_balloons.length > 0) {
            var balloon = this.m_balloons.pop();
            balloon.BalloonExplore();
        }
    };
    Monster.prototype.RemoveBalloon = function (a_ball) {
        this.m_groupBalloon.removeChild(a_ball);
    };
    Monster.prototype.BalloonExploreHandle = function () {
        if (this.m_balloons.length <= 0) {
            this.m_sumBalloon = 0;
            this.GotoDead();
        }
        else {
            if (this.m_sumBalloon == 2 && this.m_balloons.length > 0) {
                var balloon = this.m_balloons[0];
                var posx = 0;
                egret.Tween.get(balloon).to({ x: posx }, 200, egret.Ease.circOut);
                egret.Tween.get(balloon.rop).to({ scaleY: 40, rotation: 0 }, 200, egret.Ease.circOut);
                this.m_sumBalloon = 1;
            }
            if (this.m_sumBalloon == 3 && this.m_balloons.length > 0) {
                this.m_sumBalloon = 2;
                if (this.m_exploreIndex == 2) {
                    this.m_balloons.reverse();
                }
                for (var i = 0; i < this.m_balloons.length; i++) {
                    var balloon = this.m_balloons[i];
                    var posX = i * balloon.width - this.m_rect.width / 2;
                    var posY = -this.m_rect.height * 0.8;
                    var rotation = 90 * i - 45;
                    egret.Tween.get(balloon).to({ x: posX, y: posY }, 200, egret.Ease.circOut);
                    egret.Tween.get(balloon.rop).to({ scaleY: 55, rotation: rotation }, 200, egret.Ease.circOut);
                }
            }
        }
    };
    Monster.prototype.Update = function (timeElapsed) {
        if (this.m_state == EMonsterState.Ready) {
            this.y += timeElapsed * this.m_speedY;
            if (this.y >= Config.stageHeight - 150) {
                this.y = Config.stageHeight - 150;
                this.m_state = EMonsterState.Run;
                this.GotoRun();
            }
        }
        // else if (this.m_state == EMonsterState.Run) {
        // 	this.x -= timeElapsed * this.m_speedX
        // 	if (this.x <= -this.m_rect.width) {
        // 		this.m_state = EMonsterState.Dead
        // 		this.Destroy()
        // 		PanelManager.m_gameScenePanel.RemoveMonster(this)
        // 		// this.Destroy()
        // 		// PanelManager.gamePanel.RemoveWolf(this)
        // 	}
        // }
    };
    Monster.prototype.Destroy = function () {
        this.m_armatureContainer.removeCompleteCallFunc(this._OnArmatureComplet, this);
        this._DestroyBalloon();
        this.m_armatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    /**
     * 更新符号槽位
     */
    Monster.prototype.UpdateSignSlot = function () {
        this._DestroyBalloon();
        this.m_sumBalloon = 1;
        for (var i = 0; i < this.m_sumBalloon; i++) {
            var balloon = GameObjectPool.getInstance().createObject(Balloon, "Balloon");
            balloon.Init(this.m_gestureData, this);
            this._SetBallonPosition(balloon, this.m_sumBalloon, i);
            this.m_groupBalloon.addChild(balloon);
            this.m_score += balloon.Score;
            this.m_balloons.push(balloon);
        }
    };
    Object.defineProperty(Monster.prototype, "State", {
        get: function () {
            return this.m_state;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "Score", {
        get: function () {
            return this.m_score;
        },
        set: function (value) {
            this.m_score = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Monster.prototype, "Balloons", {
        get: function () {
            return this.m_balloons;
        },
        enumerable: true,
        configurable: true
    });
    Monster.prototype._OnArmatureComplet = function () {
        if (this.m_state == EMonsterState.Dead) {
            this.Destroy();
            PanelManager.m_gameScenePanel.RemoveMonster(this);
        }
    };
    Monster.prototype._SetBallonPosition = function (balloon, count, value) {
        if (value === void 0) { value = 0; }
        if (count == 1) {
            balloon.x = 0;
            balloon.y = -this.m_rect.height * 0.8;
            balloon.SetLine();
        }
        else if (count == 2) {
            balloon.x = value * balloon.width - this.m_rect.width / 2;
            balloon.y = -this.m_rect.height * 0.8;
            balloon.SetLine(count, value);
        }
        else if (count == 3) {
            if (value == 0) {
                balloon.x = 0;
                balloon.y = -this.m_rect.height;
            }
            else {
                balloon.x = (value - 1) * (balloon.width + 66) - this.m_rect.width * 0.9;
                balloon.y = -this.m_rect.height * 0.7;
            }
            balloon.SetLine(count, value);
        }
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
    Monster.prototype._DestroyBalloon = function () {
        this.m_sumBalloon = 0;
        while (this.m_balloons.length > 0) {
            var balloon = this.m_balloons.pop();
            GameObjectPool.getInstance().destroyObject(balloon);
            this.m_groupBalloon.removeChild(balloon);
        }
    };
    return Monster;
}(BaseActor));
__reflect(Monster.prototype, "Monster");
//# sourceMappingURL=Monster.js.map