var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this.m_armatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this.m_armatureContainer);
        return _this;
    }
    Bullet.prototype.Init = function (target, name) {
        this.m_target = target;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this.m_armature == null) {
            this.m_armature = new DragonBonesArmature(armatureDisplay);
        }
        this.m_armature.ArmatureDisplay = armatureDisplay;
        this.m_armatureContainer.register(this.m_armature, [name]);
        this.m_armatureContainer.play(name, 0);
    };
    Bullet.prototype.Destroy = function () {
    };
    Bullet.prototype.Update = function (timeElapsed) {
    };
    return Bullet;
}(egret.DisplayObjectContainer));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map