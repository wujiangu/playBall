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
var Baby = (function (_super) {
    __extends(Baby, _super);
    function Baby() {
        var _this = _super.call(this) || this;
        _this._tiredTime = 0;
        _this._actorArmatureContainer = new DragonBonesArmatureContainer();
        _this._actorArmatureContainer.scaleX = 0.5;
        _this._actorArmatureContainer.scaleY = 0.5;
        _this.addChild(_this._actorArmatureContainer);
        _this._powerGroup = new egret.Sprite();
        _this.addChild(_this._powerGroup);
        var bg = Common.createBitmap("gameProgressBg_png");
        _this._powerGroup.addChild(bg);
        var img = Common.createBitmap("power_Pro_png");
        _this._powerGroup.addChild(img);
        _this._progress = new egret.Shape();
        img.mask = _this._progress;
        _this._powerGroup.addChild(_this._progress);
        _this._powerGroup.scaleX = 0.5;
        _this._powerGroup.scaleY = 0.5;
        _this._influenceActors = new Array();
        _this._influenceBalls = new Array();
        _this._actorsIndex = new Array();
        return _this;
    }
    Baby.prototype.initData = function () {
        this._actorArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(GameConfig.curBabyData.action, GameConfig.curBabyData.action);
        if (this._actorArmature == null) {
            this._actorArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._actorArmature.ArmatureDisplay = armatureDisplay;
        this._actorArmatureContainer.register(this._actorArmature, ["fangdazhao", "idle", "zoulu"]);
        this.gotoIdle();
        this._actorSpeed = 0.5;
        this._actorArmatureContainer.scaleX = 0.5 * GameConfig.curBabyData.direction;
        this.x = Config.stageHalfWidth;
        this._actorArmatureContainer.addCompleteCallFunc(this._onArmatureComplete, this);
        this._powerGroup.x = -this.width / 2;
        this._powerGroup.y = -1 * this.height;
        this._powerGroup.visible = false;
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
        this._state = EBabyState.Idle;
        this._actorArmatureContainer.play("idle", 0);
    };
    Baby.prototype.gotoRun = function () {
        this._state = EBabyState.Run;
        this._actorArmatureContainer.play("zoulu", 0);
    };
    Baby.prototype.gotoAttack = function () {
        this._state = EBabyState.Attack;
        this._actorArmatureContainer.play("fangdazhao", 1);
        var voice = RES.getRes(this.skillData.music);
        if (GameConfig.isPlaySound) {
            var channel = voice.play(0, 1);
            channel.volume = GameConfig.soundValue / 100;
        }
    };
    Baby.prototype.gotoTired = function () {
        this._state = EBabyState.Tired;
        this._actorArmatureContainer.play("idle", 0);
        this._tiredTime = 0;
    };
    /////////////////////////////////////////////////////////////////////////////////////////
    Baby.prototype.releaseSkill = function (a_power, a_method, a_monster) {
        if (a_monster === void 0) { a_monster = null; }
        if (a_power >= 100 && this.skillData.method == a_method) {
            switch (this.skillData.method) {
                case ESkillReleaseType.Immediately:
                    // this.releaseImmediately()
                    break;
                case ESkillReleaseType.Range:
                    // this.releaseRange(a_monster)
                    break;
                default:
                    break;
            }
        }
    };
    Baby.prototype.releaseRange = function (a_monster) {
        var range = this.skillData.range * Config.stageHeight;
        if (this.skillData.range > 0 && a_monster.state == EMonsterState.Ready && a_monster.y >= range && this.canRelease()) {
            PanelManager.gameScenePanel.releaseSkill();
            if (this.skillData.sceneEffect && this.skillData.sceneEffect != "") {
                // 全屏动画
            }
            // a_monster.playEffect()
            // this.ReleaseResult()
        }
    };
    Baby.prototype.releaseImmediately = function () {
        if (this.canRelease()) {
            PanelManager.gameScenePanel.releaseSkill();
        }
        // this.ReleaseResult()
    };
    Baby.prototype.canRelease = function () {
        var isRelease = false;
        var actors = PanelManager.gameScenePanel.getAllActors();
        this._influenceActors.length = 0;
        this._influenceBalls.length = 0;
        this._actorsIndex.length = 0;
        // 筛选
        switch (this.skillData.rangeType) {
            case ESkillRange.All:
                this.selectRangeAll();
                isRelease = true;
                break;
            case ESkillRange.Random:
                this.selectRangeRandom(actors);
                break;
            case ESkillRange.FrontToBack:
                this.selectRangeFrontToBack(actors);
                break;
            default:
                break;
        }
        if (!isRelease && (this._influenceActors.length > 0 || this._influenceBalls.length > 0)) {
            isRelease = true;
        }
        return isRelease;
    };
    Baby.prototype.releaseResult = function () {
        // 影响的结果
        for (var i = 0; i < this._influenceActors.length; i++) {
            var actor = this._influenceActors[i];
            actor.updateEffectArmature(this.skillData);
            actor.playEffect(this.skillData);
        }
        for (var i = 0; i < this._influenceBalls.length; i++) {
            var ball = this._influenceBalls[i];
            ball.updateEffectArmature(this.skillData);
            ball.playEffect(this.skillData);
        }
    };
    Baby.prototype.selectRangeAll = function () {
        var actors = PanelManager.gameScenePanel.getAllActors();
        for (var i = 0; i < actors.length; i++) {
            if (actors[i].state == EMonsterState.Ready)
                this._influenceActors.push(actors[i]);
        }
        switch (this.skillData.result) {
            case ESkillResult.ContinuedKill:
                // 全体范围内持续
                PanelManager.gameScenePanel.setSkillDuration();
                break;
            case ESkillResult.SlowSpeed:
                // 全体减速
                PanelManager.gameScenePanel.setSkillDuration();
                break;
        }
    };
    Baby.prototype.isInfluence = function (a_actor) {
        if (!a_actor.isBoss())
            return true;
        if (a_actor.isBoss() && this.skillData.boss)
            return true;
        return false;
    };
    Baby.prototype.selectRangeRandom = function (actors) {
        for (var i = 0; i < actors.length; i++) {
            this._actorsIndex.push(i);
        }
        MathUtils.shuffle(this._actorsIndex);
        if (this.skillData.param && this.skillData.param.length > 0) {
            var count = this.skillData.param[0];
            if (this.skillData.param.lenght > 1)
                count = parseInt(this.skillData.param[0]);
            count = Math.min(count, actors.length);
            if (this.skillData.skillHang == ESkillHand.Ballon) {
                for (var i = 0; i < this._actorsIndex.length; i++) {
                    var random = this._actorsIndex[i];
                    var actor = actors[random];
                    // xiugaiwu
                    if (this.isInfluence(actor) && actor.balloons.length > 0 && actor.state == EMonsterState.Ready && actor.y >= 100) {
                        for (var j = 0; j < actor.balloons.length; j++) {
                            if (this._influenceBalls.length >= count)
                                break;
                            if (actor.balloons[j].type > 0) {
                                this._influenceBalls.push(actor.balloons[j]);
                            }
                        }
                    }
                }
            }
            else {
                for (var i = 0; i < count; i++) {
                    var random = this._actorsIndex[i];
                    var actor = actors[random];
                    // xiugaiwu
                    if (this.isInfluence(actor) && actor.state == EMonsterState.Ready && actor.y >= 100)
                        this._influenceActors.push(actor);
                }
            }
        }
    };
    Baby.prototype.selectRangeFrontToBack = function (actors) {
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
                if (this.isInfluence(actor) && actor.state == EMonsterState.Ready && actor.y >= 100) {
                    if (this.skillData.skillHang == ESkillHand.Ballon) {
                        for (var j = 0; j < actor.balloons.length; j++) {
                            if (value >= count)
                                break;
                            if (actor.balloons[j].type > 0) {
                                this._influenceBalls.push(actor.balloons[j]);
                                value++;
                            }
                        }
                    }
                    else {
                        if (value >= count)
                            break;
                        this._influenceActors.push(actor);
                        value++;
                    }
                }
            }
        }
    };
    Baby.prototype.skillResultKill = function () {
    };
    ////////////////////////////////////////////////////////////////////////////////////////
    Baby.prototype.update = function (timeElapsed) {
        if (this._state == EBabyState.Run) {
            this.x += this._actorSpeed;
            if (this.x >= 600) {
                this._actorSpeed = -0.5;
                this._actorArmatureContainer.scaleX = -0.5 * GameConfig.curBabyData.direction;
                this.gotoTired();
            }
            if (this.x <= 130) {
                this._actorSpeed = 0.5;
                this._actorArmatureContainer.scaleX = 0.5 * GameConfig.curBabyData.direction;
                this.gotoTired();
            }
        }
        if (this._state == EBabyState.Tired) {
            this._tiredTime += timeElapsed;
            if (this._tiredTime >= 2000) {
                this.gotoRun();
                this._tiredTime = 0;
            }
        }
    };
    // 弃用
    Baby.prototype.updateProgress = function (angle) {
        var r = this._powerGroup.height;
        this._progress.graphics.clear();
        this._progress.graphics.beginFill(0x00ffff);
        this._progress.graphics.moveTo(r, r);
        this._progress.graphics.lineTo(2 * r, r);
        this._progress.graphics.drawArc(r, r, r, Math.PI, angle * Math.PI / 180, false);
        this._progress.graphics.lineTo(r, r);
        this._progress.graphics.endFill();
        // this._progress.x = 0
        this._progress.y = -5;
    };
    Baby.prototype._onArmatureComplete = function () {
        if (this._state == EBabyState.Attack) {
            this.gotoRun();
        }
    };
    return Baby;
}(egret.DisplayObjectContainer));
__reflect(Baby.prototype, "Baby");
//# sourceMappingURL=Baby.js.map