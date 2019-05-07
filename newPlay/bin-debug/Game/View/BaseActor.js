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
var BaseActor = (function (_super) {
    __extends(BaseActor, _super);
    function BaseActor() {
        var _this = _super.call(this) || this;
        _this._groupBalloon = new egret.DisplayObjectContainer();
        _this.addChild(_this._groupBalloon);
        _this._armatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._armatureContainer);
        _this._effectArmatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._effectArmatureContainer);
        _this._gestureData = new Array();
        _this._normalGesture = new Array();
        _this._centerGesture = new Array();
        _this._hardGesture = new Array();
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
                _this._normalGesture.push(GameConfig.gestureConfig[i]);
            }
            else {
                _this._hardGesture.push(GameConfig.gestureConfig[i]);
            }
        }
        // var distance:number = 20;           /// 阴影的偏移距离，以像素为单位
        // var angle:number = 45;              /// 阴影的角度，0 到 360 度
        // var color:number = 0x000000;        /// 阴影的颜色，不包含透明度
        // var alpha:number = 0.7;             /// 光晕的颜色透明度，是对 color 参数的透明度设定
        // var blurX:number = 16;              /// 水平模糊量。有效值为 0 到 255.0（浮点）
        // var blurY:number = 16;              /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        // var strength:number = 0.65;                /// 压印的强度，值越大，压印的颜色越深，而且阴影与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        // var quality:number = egret.BitmapFilterQuality.LOW;              /// 应用滤镜的次数，暂无实现
        // var inner:boolean = false;            /// 指定发光是否为内侧发光
        // var knockout:boolean = false;            /// 指定对象是否具有挖空效果
        // this.m_dropShadowFilter = new egret.DropShadowFilter(distance, angle, color, alpha, blurX, blurY,
        // strength, quality, inner, knockout)
        _this._rect = new egret.Rectangle();
        return _this;
        // this._shape = new egret.Shape()
        // this.addChild(this._shape)
        // this._shape.graphics.beginFill( 0xff0000, 0.5);
    }
    BaseActor.prototype.resetNormalGesture = function () {
        this._normalGesture.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Normal) {
                this._normalGesture.push(GameConfig.gestureConfig[i]);
            }
        }
    };
    BaseActor.prototype.resetCenterGesture = function () {
        this._centerGesture.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Center) {
                this._normalGesture.push(GameConfig.gestureConfig[i]);
            }
        }
    };
    BaseActor.prototype.resetHardGesture = function () {
        this._hardGesture.length = 0;
        for (var i = 0; i < GameConfig.gestureConfig.length; i++) {
            if (GameConfig.gestureConfig[i].difficult == EGestureDifficult.Hard) {
                this._hardGesture.push(GameConfig.gestureConfig[i]);
            }
        }
    };
    BaseActor.prototype.initData = function () {
        this._summonCount = 0;
        this._summonWave = 0;
        this._summonBeKillCount = 0;
        this._unusualDelay = 0;
    };
    BaseActor.prototype.gotoIdle = function () {
    };
    BaseActor.prototype.gotoHurt = function () {
    };
    BaseActor.prototype.gotoDead = function () {
    };
    BaseActor.prototype.gotoExplore = function () { };
    BaseActor.prototype.gotoRun = function () {
    };
    BaseActor.prototype.gotoSlow = function () { };
    Object.defineProperty(BaseActor.prototype, "w", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "h", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "balloons", {
        get: function () {
            return this._balloons;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "gestureData", {
        get: function () {
            return this._gestureData;
        },
        set: function (value) {
            this._gestureData = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "speedVertical", {
        set: function (value) {
            this._speedY = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "speedHorizon", {
        set: function (value) {
            this._speedX = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "ePos", {
        get: function () {
            return this._ePos;
        },
        set: function (value) {
            this._ePos = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "actorTableData", {
        get: function () {
            return this._data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    BaseActor.prototype.update = function (timeElapsed) {
        if (this._state == EMonsterState.Ready && this._speedY == 0) {
            this._unusualDelay += timeElapsed;
            if (this._unusualDelay >= PanelManager.gameScenePanel.baby.skillData.time) {
                this._unusualDelay = 0;
                this._effectArmatureContainer.visible = false;
                this._speedY = this._data.Speed / 100 * GameConfig.gameSpeedPercent;
            }
        }
    };
    BaseActor.prototype.resetGestureData = function () {
    };
    BaseActor.prototype.changeGestureType = function (a_gestureType) { };
    BaseActor.prototype.setVertical = function (addNum) {
        if (this._speedY <= 0)
            return;
        this.resetVertical();
        this._addNum += addNum;
        this._speedY += addNum;
    };
    BaseActor.prototype.resetVertical = function () {
        this._speedY -= this._addNum;
        this._addNum = 0;
        this._speedY = Math.max(this._speedY, 0);
    };
    /**
     * 更新怪物身上的特效动画
     */
    BaseActor.prototype.updateEffectArmature = function (data) {
        this._effectArmatureContainer.clear();
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(data.skillFile, data.skillFile);
        if (this._effectArmature == null) {
            this._effectArmature = new DragonBonesArmature(armatureDisplay);
        }
        this._effectData = data;
        this._effectResult = data.result;
        this._effectArmature.ArmatureDisplay = armatureDisplay;
        this._effectArmatureContainer.register(this._effectArmature, [data.skill]);
        this._effectArmatureContainer.visible = false;
        this._effectArmatureContainer.scaleX = data.scale;
        this._effectArmatureContainer.scaleY = data.scale;
        this._effectArmatureContainer.x = data.skillPosX;
        this._effectArmatureContainer.y = data.skillPosY;
        this._effectArmatureContainer.addCompleteCallFunc(this.onEffectArmatureComplete, this);
        this._effectArmatureContainer.addFrameCallFunc(this.onEffectArmatureFram, this);
        this._effectArmatureContainer.visible = false;
    };
    Object.defineProperty(BaseActor.prototype, "state", {
        get: function () {
            return this._state;
        },
        set: function (value) {
            this._state = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "master", {
        get: function () {
            return this._master;
        },
        set: function (value) {
            this._master = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BaseActor.prototype, "summonCount", {
        get: function () {
            return this._summonCount;
        },
        set: function (value) {
            this._summonCount = value;
        },
        enumerable: true,
        configurable: true
    });
    BaseActor.prototype.playEffect = function (data) { };
    BaseActor.prototype.ballExplosion = function (balloon) { };
    BaseActor.prototype.removeBalloon = function (balloon) { };
    BaseActor.prototype.onEffectArmatureComplete = function () {
        switch (this._state) {
            case EMonsterState.Dead:
                this.destroyAndRemove();
                break;
            case EMonsterState.Stop:
                switch (this._effectResult) {
                    case ESkillResult.Kill:
                        this._effectResult = ESkillResult.Invalid;
                        this.gotoDead();
                        this._destroyBalloon();
                        break;
                    case ESkillResult.StopSpeed:
                        this._speedY = 0;
                        this._state = EMonsterState.Ready;
                        break;
                    case ESkillResult.ChangeLucky:
                        if (this.type == EMonsterDifficult.Summon) {
                            this.master.summonBeKill();
                        }
                        PanelManager.gameScenePanel.createLuckyActor(this.x, this.y);
                        this.destroyAndRemove();
                        break;
                }
                break;
            case EMonsterState.Drown:
                this.destroyAndRemove();
                break;
            default:
                break;
        }
    };
    BaseActor.prototype.destroy = function () {
        // this._state = EMonsterState.Ready
    };
    BaseActor.prototype.destroyAndRemove = function () {
        this._effectArmatureContainer.visible = false;
    };
    BaseActor.prototype.onEffectArmatureFram = function (event) { };
    BaseActor.prototype.summonBeKill = function () { };
    BaseActor.prototype._destroyBalloon = function () {
        this._sumBalloon = 0;
        while (this._balloons.length > 0) {
            var balloon = this._balloons.pop();
            GameObjectPool.getInstance().destroyObject(balloon);
            if (this._groupBalloon.contains(balloon)) {
                this._groupBalloon.removeChild(balloon);
            }
            else {
                balloon.parent.removeChild(balloon);
            }
        }
    };
    BaseActor.prototype.isBoss = function () {
        if (this.type == EMonsterDifficult.Normal || this.type == EMonsterDifficult.Summon) {
            return false;
        }
        return true;
    };
    BaseActor.prototype.balloonExploreHandle = function () {
        if (this._balloons.length <= 0) {
            this._sumBalloon = 0;
            // this.gotoDead()
        }
        else {
            if (this._sumBalloon == 2 && this._balloons.length > 0) {
                var balloon = this._balloons[0];
                var posx = 0;
                egret.Tween.get(balloon).to({ x: posx }, 200, egret.Ease.circOut);
                egret.Tween.get(balloon.rop).to({ rotation: 0 }, 200, egret.Ease.circOut);
                this._sumBalloon = 1;
            }
            if (this._sumBalloon == 3 && this._balloons.length > 0) {
                this._sumBalloon = 2;
                if (this._exploreIndex == 2) {
                    this._balloons.reverse();
                }
                for (var i = 0; i < this._balloons.length; i++) {
                    var balloon = this._balloons[i];
                    var posX = i * (balloon.width + 5) - this._rect.width / 2;
                    var posY = -this._rect.height * 1.2;
                    balloon.calculateRop(posX, posY);
                    egret.Tween.get(balloon).to({ x: posX, y: posY }, 200, egret.Ease.circOut);
                    egret.Tween.get(balloon.rop).to({ rotation: balloon.ropRotation }, 200, egret.Ease.circOut);
                }
            }
        }
    };
    BaseActor.prototype._setBallonPosition = function (balloon, count, value) {
        if (value === void 0) { value = 0; }
        if (count == 1) {
            balloon.x = 0;
            balloon.y = -this._rect.height * 1.1;
        }
        else if (count == 2) {
            balloon.x = value * (balloon.width + 5) - this._rect.width / 2;
            balloon.y = -this._rect.height * 1.3;
        }
        else if (count == 3) {
            if (value == 0) {
                balloon.x = 0;
                balloon.y = -this._rect.height * 1.5;
            }
            else {
                balloon.x = (value - 1) * (balloon.width + this._rect.width / 2) - this._rect.width * 0.7;
                balloon.y = -this._rect.height * 1.2;
            }
        }
        balloon.setLine();
    };
    return BaseActor;
}(egret.DisplayObjectContainer));
__reflect(BaseActor.prototype, "BaseActor");
//# sourceMappingURL=BaseActor.js.map