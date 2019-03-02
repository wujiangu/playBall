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
var SettingPanel = (function (_super) {
    __extends(SettingPanel, _super);
    function SettingPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/settingPanel.exml";
        return _this;
    }
    // 初始化面板
    SettingPanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    SettingPanel.prototype.initData = function () {
    };
    // 进入面板
    SettingPanel.prototype.onEnter = function () {
        Common.gameScene().uiLayer.addChild(this);
        this.m_sliderSound.maximum = 100;
        this.m_sliderBGM.maximum = 100;
        this.m_sliderSound.value = GameConfig.bgmValue;
        this.m_sliderBGM.value = GameConfig.soundValue;
        this.m_imgMask.touchEnabled = false;
        this.show.play(0);
    };
    // 退出面板
    SettingPanel.prototype.onExit = function () {
        Animations.popupIn(this.m_groupSetting, 300, function () {
            Common.gameScene().uiLayer.removeChild(this);
        }.bind(this));
    };
    SettingPanel.prototype._OnSoundSlider = function (e) {
        var slider = e.target;
        GameConfig.soundValue = slider.pendingValue;
    };
    SettingPanel.prototype._OnBGMSlider = function (e) {
        var slider = e.target;
        GameConfig.bgmValue = slider.pendingValue;
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100;
    };
    SettingPanel.prototype._OnClose = function () {
        this.hide.play(0);
    };
    SettingPanel.prototype._OnShow = function () {
        this.m_imgMask.touchEnabled = true;
    };
    SettingPanel.prototype._OnHide = function () {
        Common.dispatchEvent(MainNotify.closeSettingPanel);
    };
    SettingPanel.prototype.onComplete = function () {
        this._OnResize();
        this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._OnSoundSlider, this);
        this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._OnBGMSlider, this);
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._OnClose, this);
        this.show.addEventListener('complete', this._OnShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
    };
    SettingPanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return SettingPanel;
}(BasePanel));
__reflect(SettingPanel.prototype, "SettingPanel");
//# sourceMappingURL=SettingPanel.js.map