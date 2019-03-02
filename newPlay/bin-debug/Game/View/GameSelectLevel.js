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
var GameSelectLevel = (function (_super) {
    __extends(GameSelectLevel, _super);
    function GameSelectLevel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/guankajiemian.exml";
        return _this;
    }
    // 初始化面板
    GameSelectLevel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameSelectLevel.prototype.initData = function () {
        this.m_curChapterIndex = GameConfig.curChpter % 1000;
        this.m_curSelectChapter = GameConfig.curChpter;
        this._updateChapterInfo();
    };
    // 进入面板
    GameSelectLevel.prototype.onEnter = function () {
        this.touchChildren = false;
        this.initData();
        this.show.play(0);
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    GameSelectLevel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    Object.defineProperty(GameSelectLevel.prototype, "selectChater", {
        get: function () {
            return this.m_curSelectChapter;
        },
        enumerable: true,
        configurable: true
    });
    GameSelectLevel.prototype._onShow = function () {
        this.touchChildren = true;
    };
    GameSelectLevel.prototype._OnHide = function () {
        Common.dispatchEvent(MainNotify.closeGameSelectLevel);
        if (this.m_status == 1) {
            // Common.dispatchEvent(MainNotify.closeGameStartPanel)
            Common.dispatchEvent(MainNotify.openGamePanel);
        }
        else {
            Common.dispatchEvent(MainNotify.openGameStartPanel);
        }
    };
    GameSelectLevel.prototype._onMaskClick = function () {
        this.touchEnabled = false;
        this.hide.play(0);
        this.m_status = 0;
    };
    GameSelectLevel.prototype._onChapterBegin = function () {
        this.m_imgChapter.alpha = 0.8;
    };
    GameSelectLevel.prototype._onChapterEnd = function () {
        this.m_imgChapter.alpha = 1;
    };
    GameSelectLevel.prototype._onChapterClick = function () {
        if (!this._isLock()) {
            this._beforeEnterBattle();
            GameConfig.gameMode = EBattleMode.Level;
        }
    };
    GameSelectLevel.prototype._onEndlessBegin = function () {
        this.m_imgEndlessBg.alpha = 0.8;
    };
    GameSelectLevel.prototype._onEndlessEnd = function () {
        this.m_imgEndlessBg.alpha = 1;
    };
    GameSelectLevel.prototype._onEndlessClick = function () {
        if (GameConfig.guideIndex >= 1) {
            this._beforeEnterBattle();
            GameConfig.gameMode = EBattleMode.Endless;
        }
    };
    GameSelectLevel.prototype._beforeEnterBattle = function () {
        this.touchEnabled = false;
        this.hide.play(0);
        this.m_status = 1;
    };
    GameSelectLevel.prototype._isLock = function () {
        if (this.m_curSelectChapter > GameConfig.curChpter) {
            return true;
        }
        return false;
    };
    GameSelectLevel.prototype._updateChapterInfo = function () {
        var chapterData = GameConfig.chapterTable[this.m_curSelectChapter.toString()];
        Common.log(this.m_curSelectChapter, this.m_curChapterIndex);
        this.m_imgChapter.source = chapterData.icon;
        this.m_labChapter.text = this.m_curChapterIndex.toString();
        this.m_imgIcon.source = "guankajiemian13_png";
        if (this._isLock()) {
            this.m_imgChapter.source = chapterData.unlockIcon;
            this.m_imgIcon.source = "guankajiemian14_png";
        }
    };
    GameSelectLevel.prototype._onNextClick = function () {
        if (this.m_curChapterIndex < 5) {
            this.m_curSelectChapter++;
            this.m_curChapterIndex++;
            this._updateChapterInfo();
        }
    };
    GameSelectLevel.prototype._onLastClick = function () {
        if (this.m_curChapterIndex > 1) {
            this.m_curChapterIndex--;
            this.m_curSelectChapter--;
            this._updateChapterInfo();
        }
    };
    GameSelectLevel.prototype._onComplete = function () {
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onMaskClick, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onChapterBegin, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_END, this._onChapterEnd, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onChapterEnd, this);
        this.m_imgChapter.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onChapterClick, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onEndlessBegin, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_END, this._onEndlessEnd, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onEndlessEnd, this);
        this.m_imgEndlessBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onEndlessClick, this);
        this.m_btnNext.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onNextClick, this);
        this.m_btnLast.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onLastClick, this);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._OnHide, this);
    };
    return GameSelectLevel;
}(BasePanel));
__reflect(GameSelectLevel.prototype, "GameSelectLevel");
//# sourceMappingURL=GameSelectLevel.js.map