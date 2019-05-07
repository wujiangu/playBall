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
var GameExSkillEffect = (function (_super) {
    __extends(GameExSkillEffect, _super);
    function GameExSkillEffect() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/dazhaotexiao.exml";
        return _this;
    }
    GameExSkillEffect.prototype.playEffect = function (a_id) {
        switch (a_id) {
            case 1:
                this.leidian.play(0);
                break;
            case 2:
                this.jiansu.play(0);
                break;
            case 3:
                this.shuizhu.play(0);
                break;
            default:
                break;
        }
    };
    GameExSkillEffect.prototype.hide = function () {
        this.groupIce.alpha = 0;
        this.groupWater.alpha = 0;
        this.groupSunder.alpha = 0;
    };
    GameExSkillEffect.prototype.show = function () {
        this.groupIce.alpha = 1;
        this.groupWater.alpha = 1;
        this.groupSunder.alpha = 1;
    };
    GameExSkillEffect.prototype._onComboBeginComplete = function () {
        this.leidian.stop();
        Common.log("ddsfdsfdsfdsf");
    };
    GameExSkillEffect.prototype.onComplete = function () {
        this.hide();
        this.leidian.addEventListener('complete', this._onComboBeginComplete, this);
    };
    return GameExSkillEffect;
}(BasePanel));
__reflect(GameExSkillEffect.prototype, "GameExSkillEffect");
//# sourceMappingURL=GameExSkillEffect.js.map