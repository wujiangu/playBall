var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var DragonBonesAnimations = (function () {
    function DragonBonesAnimations() {
    }
    return DragonBonesAnimations;
}());
DragonBonesAnimations.Idle = "idle";
DragonBonesAnimations.Dead = "dead";
DragonBonesAnimations.Run = "run";
DragonBonesAnimations.Hurt = "hurt";
DragonBonesAnimations.Explore = "explore";
__reflect(DragonBonesAnimations.prototype, "DragonBonesAnimations");
