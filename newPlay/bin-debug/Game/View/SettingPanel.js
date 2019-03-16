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
        Common.gameScene().uiLayer.removeChild(this);
    };
    SettingPanel.prototype._onSoundSlider = function (e) {
        var slider = e.target;
        GameConfig.soundValue = slider.pendingValue;
    };
    SettingPanel.prototype._onBGMSlider = function (e) {
        var slider = e.target;
        GameConfig.bgmValue = slider.pendingValue;
        if (GameVoice.beginBGMChannel != null)
            GameVoice.beginBGMChannel.volume = GameConfig.bgmValue / 100;
    };
    SettingPanel.prototype._onClose = function () {
        this.hide.play(0);
    };
    SettingPanel.prototype._onShow = function () {
        this.m_imgMask.touchEnabled = true;
    };
    SettingPanel.prototype._onHide = function () {
        Common.dispatchEvent(MainNotify.closeSettingPanel);
    };
    SettingPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_sliderSound.addEventListener(egret.Event.CHANGE, this._onSoundSlider, this);
        this.m_sliderBGM.addEventListener(egret.Event.CHANGE, this._onBGMSlider, this);
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._onHide, this);
    };
    SettingPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return SettingPanel;
}(BasePanel));
__reflect(SettingPanel.prototype, "SettingPanel");
//# sourceMappingURL=SettingPanel.js.map