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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet() {
        var _this = _super.call(this) || this;
        _this._armatureContainer = new DragonBonesArmatureContainer();
        _this.addChild(_this._armatureContainer);
        return _this;
    }
    Bullet.prototype.Init = function (target, name, type) {
        this.m_target = target;
        var armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay(name, name);
        if (this._armature == null) {
            this._armature = new DragonBonesArmature(armatureDisplay);
        }
        this._armature.ArmatureDisplay = armatureDisplay;
        this._armatureContainer.register(this._armature, [name]);
        this._armatureContainer.play(name, 0);
        this.m_isDead = false;
        this._type = type;
    };
    Bullet.prototype.destroy = function () {
        this.m_isDead = true;
        this._armatureContainer.clear();
        GameObjectPool.getInstance().destroyObject(this);
    };
    Bullet.prototype.update = function (timeElapsed) {
        if (this.m_isDead)
            return;
        var endY = this.m_target.y - this.m_target.h / 2;
        this.m_radian = MathUtils.getRadian2(this.x, this.y, this.m_target.x, endY);
        this.rotation = MathUtils.getAngle(this.m_radian) + 90;
        var distance = MathUtils.getDistance(this.m_target.x, endY, this.x, this.y);
        // Common.log(this.m_radian, this.rotation, distance)
        if (distance <= 140) {
            this.destroy();
            // PanelManager.gameScenePanel.removeBullet(this)
            if (this._type == EEffectType.Fire) {
                // this.m_target.playEffect()
                if (GameConfig.isPlaySound) {
                    var channel = GameVoice.burnSound.play(0, 1);
                    channel.volume = GameConfig.soundValue / 100;
                }
            }
            return;
        }
        var speed = timeElapsed * 2;
        var tempX = Math.cos(this.m_radian) * speed;
        var tempY = Math.sin(this.m_radian) * speed;
        var deltaX = parseFloat(tempX.toFixed(2));
        var deltaY = parseFloat(tempY.toFixed(2));
        this.x += deltaX;
        this.y += deltaY;
    };
    return Bullet;
}(egret.DisplayObjectContainer));
__reflect(Bullet.prototype, "Bullet");
//# sourceMappingURL=Bullet.js.map