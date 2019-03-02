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
var Baby = (function (_super) {
    __extends(Baby, _super);
    function Baby() {
        var _this = _super.call(this) || this;
        _this.m_tiredTime = 0;
        _this.m_actorArmatureContainer = new DragonBonesArmatureContainer();
        _this.m_actorArmatureContainer.scaleX = 0.5;
        _this.m_actorArmatureContainer.scaleY = 0.5;
        _this.addChild(_this.m_actorArmatureContainer);
        _this.m_powerGroup = new egret.Sprite();
        _this.addChild(_this.m_powerGroup);
        var bg = Common.createBitmap("gameProgressBg_png");
        _this.m_powerGroup.addChild(bg);
        var img = Common.createBitmap("power_Pro_png");
        _this.m_powerGroup.addChild(img);
        _this.m_progress = new egret.Shape();
        img.mask = _this.m_progress;
        _this.m_powerGroup.addChild(_this.m_progress);
        _this.m_powerGroup.scaleX = 0.5;
        _this.m_powerGroup.scaleY = 0.5;
        _this.m_influenceActors = new Array();
        _this.m_influenceBalls = new Array();
        _this.m_actorsIndex = new Array();
        return _this;
    }
    Baby.prototype.initData = function () {
        this.m_actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action);
        if (this.m_actorArmature == null) {
            this.m_actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_actorArmature.ArmatureDisplay = armatureDisplay;
        this.m_actorArmatureContainer.register(this.m_actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this.gotoIdle();
        this.m_actorSpeed = 0.5;
        this.m_actorArmatureContainer.scaleX = 0.5;
        this.x = Config.stageHalfWidth;
        this.m_actorArmatureContainer.addCompleteCallFunc(this._OnArmatureComplete, this);
        this.m_powerGroup.x = -this.width / 2;
        this.m_powerGroup.y = -3.5 * this.height;
        // this.m_powerGroup.visible = true
        var skillId = GameConfig.curBabyData.skillId;
        if (skillId != null && skillId > 0) {
            this.skillData = GameConfig.babySkillTable[skillId.toString()];
        }
        else {
            console.error("不存在技能ID");
            this.skillData = null;
        }
    };
    Baby.prototype.gotoIdle = function () {
        this.m_state = EBabyState.Idle;
        this.m_actorArmatureContainer.play("idle", 0);
    };
    Baby.prototype.gotoRun = function () {
        this.m_state = EBabyState.Run;
        this.m_actorArmatureContainer.play("zoulu", 0);
    };
    Baby.prototype.gotoAttack = function () {
        this.m_state = EBabyState.Attack;
        this.m_actorArmatureContainer.play("fangdazhao", 1);
    };
    Baby.prototype.gotoTired = function () {
        this.m_state = EBabyState.Tired;
        this.m_actorArmatureContainer.play("idle", 0);
        this.m_tiredTime = 0;
    };
    /////////////////////////////////////////////////////////////////////////////////////////
    Baby.prototype.ReleaseSkill = function (a_power, a_method, a_monster) {
        if (a_monster === void 0) { a_monster = null; }
        if (a_power >= 360 && this.skillData.method == a_method) {
            switch (this.skillData.method) {
                case ESkillReleaseType.Immediately:
                    this.ReleaseImmediately();
                    break;
                case ESkillReleaseType.Range:
                    this.ReleaseRange(a_monster);
                    break;
                default:
                    break;
            }
        }
    };
    Baby.prototype.ReleaseRange = function (a_monster) {
        var range = this.skillData.range * Config.stageHeight;
        if (this.skillData.range > 0 && a_monster.State == EMonsterState.Ready && a_monster.y >= range) {
            PanelManager.m_gameScenePanel.ReleaseSkill();
            if (this.skillData.sceneEffect && this.skillData.sceneEffect != "") {
                // 全屏动画
            }
            // a_monster.PlayEffect()
        }
    };
    Baby.prototype.ReleaseImmediately = function () {
        PanelManager.m_gameScenePanel.ReleaseSkill();
        this.ReleaseResult();
    };
    Baby.prototype.ReleaseResult = function () {
        var actors = PanelManager.m_gameScenePanel.GetAllActors();
        this.m_influenceActors.length = 0;
        this.m_influenceBalls.length = 0;
        this.m_actorsIndex.length = 0;
        // 筛选
        switch (this.skillData.rangeType) {
            case ESkillRange.All:
                this.SelectRangeAll();
                break;
            case ESkillRange.Random:
                this.SelectRangeRandom(actors);
                break;
            case ESkillRange.FrontToBack:
                this.SelectRangeFrontToBack(actors);
                break;
            default:
                break;
        }
        // 影响的结果
        for (var i = 0; i < this.m_influenceActors.length; i++) {
            var actor = this.m_influenceActors[i];
            actor.UpdateEffectArmature(this.skillData);
            actor.PlayEffect(this.skillData);
        }
        for (var i = 0; i < this.m_influenceBalls.length; i++) {
            var ball = this.m_influenceBalls[i];
            ball.UpdateEffectArmature(this.skillData);
            ball.PlayEffect(this.skillData);
        }
    };
    Baby.prototype.SelectRangeAll = function () {
        switch (this.skillData.result) {
            case ESkillResult.ContinuedKill:
                // 全体范围内持续
                break;
            case ESkillResult.SlowSpeed:
                // 全体减速
                break;
        }
    };
    Baby.prototype.SelectRangeRandom = function (actors) {
        for (var i = 0; i < actors.length; i++) {
            this.m_actorsIndex.push(i);
        }
        MathUtils.shuffle(this.m_actorsIndex);
        if (this.skillData.param && this.skillData.param.length > 0) {
            var count = this.skillData.param[0];
            if (this.skillData.param.lenght > 1)
                count = parseInt(this.skillData.param[0]);
            count = Math.min(count, actors.length);
            if (this.skillData.skillHang == ESkillHand.Ballon) {
                for (var i = 0; i < this.m_actorsIndex.length; i++) {
                    var random = this.m_actorsIndex[i];
                    var actor = actors[random];
                    if (actor.Balloons.length > 0 && actor.State == EMonsterState.Ready) {
                        for (var j = 0; j < actor.Balloons.length; j++) {
                            if (this.m_influenceBalls.length >= count)
                                break;
                            this.m_influenceBalls.push(actor.Balloons[j]);
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < count; i++) {
                    var random = this.m_actorsIndex[i];
                    var actor = actors[random];
                    if (actor.State == EMonsterState.Ready && actor.y >= 100)
                        this.m_influenceActors.push(actor);
                }
            }
        }
    };
    Baby.prototype.SelectRangeFrontToBack = function (actors) {
        // 对所有的敌人进行排序
        actors.sort(function (a, b) {
            return b.y - a.y;
        });
        if (this.skillData.param && this.skillData.param.length > 0) {
            var count = this.skillData.param[0];
            if (this.skillData.param.lenght > 1)
                count = parseInt(this.skillData.param[0]);
            count = Math.min(count, actors.length);
            var value = 0;
            for (var i = 0; i < actors.length; i++) {
                var actor = actors[i];
                if (actor.State == EMonsterState.Ready && actor.y >= 100) {
                    if (this.skillData.skillHang == ESkillHand.Ballon) {
                        for (var j = 0; j < actor.Balloons.length; j++) {
                            if (value >= count)
                                break;
                            this.m_influenceBalls.push(actor.Balloons[j]);
                            value++;
                        }
                    }
                    else {
                        if (value >= count)
                            break;
                        this.m_influenceActors.push(actor);
                        value++;
                    }
                }
            }
        }
    };
    Baby.prototype.SkillResultKill = function () {
    };
    ////////////////////////////////////////////////////////////////////////////////////////
    Baby.prototype.update = function (timeElapsed) {
        if (this.m_state == EBabyState.Run) {
            this.x += this.m_actorSpeed;
            if (this.x >= 600) {
                this.m_actorSpeed = -0.5;
                this.m_actorArmatureContainer.scaleX = -0.5;
                this.gotoTired();
            }
            if (this.x <= 130) {
                this.m_actorSpeed = 0.5;
                this.m_actorArmatureContainer.scaleX = 0.5;
                this.gotoTired();
            }
        }
        if (this.m_state == EBabyState.Tired) {
            this.m_tiredTime += timeElapsed;
            if (this.m_tiredTime >= 2000) {
                this.gotoRun();
                this.m_tiredTime = 0;
            }
        }
    };
    Baby.prototype.updateProgress = function (angle) {
        var r = this.m_powerGroup.height;
        this.m_progress.graphics.clear();
        this.m_progress.graphics.beginFill(0x00ffff);
        this.m_progress.graphics.moveTo(r, r);
        this.m_progress.graphics.lineTo(2 * r, r);
        this.m_progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this.m_progress.graphics.lineTo(r, r);
        this.m_progress.graphics.endFill();
        // this.m_progress.x = 0
        this.m_progress.y = -5;
    };
    Baby.prototype._OnArmatureComplete = function () {
        if (this.m_state == EBabyState.Attack) {
            this.gotoRun();
        }
    };
    return Baby;
}(egret.DisplayObjectContainer));
__reflect(Baby.prototype, "Baby");
//# sourceMappingURL=Baby.js.map