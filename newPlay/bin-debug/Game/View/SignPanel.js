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
var SignPanel = (function (_super) {
    __extends(SignPanel, _super);
    function SignPanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/qiandao.exml";
        return _this;
    }
    // 初始化面板
    SignPanel.prototype.initPanel = function () {
        this._signGroups = new Array();
    };
    // 初始化面板数据
    SignPanel.prototype.initData = function () {
    };
    // 进入面板
    SignPanel.prototype.onEnter = function () {
        this.m_imgMask.touchEnabled = false;
        this.show.play(0);
        this.m_imgMask7.visible = false;
        this.m_imgCheck7.visible = false;
        if (GameConfig.signCount >= 7) {
            this.m_imgMask7.visible = true;
            this.m_imgCheck7.visible = true;
        }
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    SignPanel.prototype.onExit = function () {
        Common.gameScene().uiLayer.removeChild(this);
    };
    SignPanel.prototype._onClose = function () {
        this.hide.play(0);
    };
    SignPanel.prototype._onShow = function () {
        this.m_imgMask.touchEnabled = true;
        // this.m_scroll.verticalScrollBar.visible = false
        // this.m_scroll.verticalScrollBar.autoVisibility = false
    };
    SignPanel.prototype._onHide = function () {
        Common.dispatchEvent(MainNotify.closeSignPanel);
    };
    SignPanel.prototype._onBtnSignIn = function () {
        if (GameConfig.sign == 0 && GameConfig.signCount <= 6) {
            if (GameConfig.signCount <= 5) {
                this._signGroups[GameConfig.signCount].sign();
            }
            else {
                this.m_imgMask7.visible = true;
                this.m_imgCheck7.visible = true;
                var config = GameConfig.signConfig[GameConfig.signCount];
                var data = GameConfig.signTable[config.id.toString()];
                data.isGet = true;
                Common.updateSign(1);
                GameConfig.signCount++;
                Common.updateSignCount(GameConfig.signCount);
                switch (data.rewardType) {
                    case EReward.Candy:
                        Common.updateCurCandy(data.reward);
                        Common.dispatchEvent(MainNotify.updateCandy);
                        GameConfig.rewardData = Common.cloneObj(data);
                        GameConfig.rewardCandy = data.reward;
                        GameConfig.rewardType = EReward.Candy;
                        Common.dispatchEvent(MainNotify.openGetRewardPanel);
                        break;
                    case EReward.AssignBaby:
                        // 判断是否在已解锁列表中
                        var index = GameConfig.babyUnlockList.indexOf(data.reward);
                        var baby = GameConfig.actorTable[data.reward.toString()];
                        if (index < 0) {
                            // 加入到解锁列表
                            GameConfig.babyUnlockList.push(data.reward);
                            Common.updateUnlockBaby();
                            GameConfig.rewardData = Common.cloneObj(baby);
                            GameConfig.rewardType = EReward.AssignBaby;
                        }
                        else {
                            // 转换成糖果
                            GameConfig.rewardCandy = baby.candy;
                            GameConfig.rewardType = EReward.Candy;
                            Common.updateCurCandy(baby.candy);
                            Common.dispatchEvent(MainNotify.updateCandy);
                        }
                        Common.dispatchEvent(MainNotify.openGetRewardPanel);
                        break;
                    default:
                        break;
                }
            }
        }
        else {
            TipsManager.show("today is signed!");
        }
    };
    SignPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._onHide, this);
        this._signGroups.length = 0;
        for (var i = 0; i < GameConfig.signConfig.length - 1; i++) {
            var config = GameConfig.signConfig[i];
            var data = GameConfig.signTable[config.id.toString()];
            var signIR = new SignIR();
            var row = Math.floor(i / 4);
            var col = i % 4;
            signIR.init(data, i);
            signIR.x = 165 * col - 40;
            signIR.y = 234 * row + 111;
            this.group.addChild(signIR);
            this._signGroups.push(signIR);
        }
        this.m_btnSignIn.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSignIn, this);
    };
    SignPanel.prototype._onResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return SignPanel;
}(BasePanel));
__reflect(SignPanel.prototype, "SignPanel");
var SignIR = (function (_super) {
    __extends(SignIR, _super);
    function SignIR() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/qiandaoIR.exml";
        return _this;
    }
    SignIR.prototype.init = function (data, day) {
        var signIndex = day + 1;
        this.m_imgTime.source = data.icon;
        this.m_labCount.text = "X" + 1;
        if (data.rewardType == EReward.Candy) {
            this.m_labCount.text = "X" + data.reward;
        }
        // this.m_imgReward.source = data.icon
        // this.m_imgBg.source = "qiandao2_png"
        // this.m_imgGou.visible = false
        this._hideMask();
        if (data.isGet) {
            // this.m_imgBg.source = "qiandao3_png"
            // this.m_imgGou.visible = true
            this._showMask();
        }
        // else
        // {
        // 	if (signIndex == GameConfig.signCount && GameConfig.sign == 1) {
        // 		this._showMask()
        // 		// this.m_imgBg.source = "qiandao3_png"
        // 		// this.m_imgGou.visible = true
        // 	}
        // 	if (signIndex == GameConfig.signCount + 1 && GameConfig.sign == 0) {
        // 		this._showMask()
        // 		// this.m_imgBg.source = "qiandao3_png"
        // 	}
        // 	Common.log(signIndex, GameConfig.signCount, GameConfig.sign)
        // }
        this.id = data.id;
        this.index = day;
        this.data = data;
    };
    SignIR.prototype.sign = function () {
        var data = GameConfig.signTable[this.id.toString()];
        if (!data.isGet && this.index == GameConfig.signCount && GameConfig.sign == 0) {
            Common.updateSign(1);
            GameConfig.signCount++;
            Common.updateSignCount(GameConfig.signCount);
            data.isGet = true;
            this._showMask();
            // this.m_imgGou.visible = true
            switch (this.data.rewardType) {
                case EReward.Candy:
                    Common.updateCurCandy(this.data.reward);
                    Common.dispatchEvent(MainNotify.updateCandy);
                    GameConfig.rewardData = Common.cloneObj(this.data);
                    GameConfig.rewardCandy = this.data.reward;
                    GameConfig.rewardType = EReward.Candy;
                    Common.dispatchEvent(MainNotify.openGetRewardPanel);
                    break;
                case EReward.AssignBaby:
                    // 判断是否在已解锁列表中
                    var index = GameConfig.babyUnlockList.indexOf(this.data.reward);
                    if (index < 0) {
                        // 加入到解锁列表
                        GameConfig.babyUnlockList.push(this.data.reward);
                        Common.updateUnlockBaby();
                    }
                    else {
                        // 转换成糖果
                    }
                    var baby = GameConfig.actorTable[this.data.reward.toString()];
                    GameConfig.rewardData = Common.cloneObj(baby);
                    GameConfig.rewardType = EReward.AssignBaby;
                    Common.dispatchEvent(MainNotify.openGetRewardPanel);
                    break;
                default:
                    break;
            }
        }
    };
    SignIR.prototype._hideMask = function () {
        this.m_imgMask.visible = false;
        this.m_imgCheckIn.visible = false;
    };
    SignIR.prototype._showMask = function () {
        this.m_imgMask.visible = true;
        this.m_imgCheckIn.visible = true;
    };
    SignIR.prototype._onBtnSign = function () {
        var data = GameConfig.signTable[this.id.toString()];
        if (!data.isGet && this.index == GameConfig.signCount && GameConfig.sign == 0) {
            Common.updateSign(1);
            GameConfig.signCount++;
            Common.updateSignCount(GameConfig.signCount);
            data.isGet = true;
            // this.m_imgGou.visible = true
            switch (this.data.rewardType) {
                case EReward.Candy:
                    Common.updateCurCandy(this.data.reward);
                    Common.dispatchEvent(MainNotify.updateCandy);
                    GameConfig.rewardData = Common.cloneObj(this.data);
                    GameConfig.rewardCandy = this.data.reward;
                    GameConfig.rewardType = EReward.Candy;
                    Common.dispatchEvent(MainNotify.openGetRewardPanel);
                    break;
                case EReward.AssignBaby:
                    // 判断是否在已解锁列表中
                    var index = GameConfig.babyUnlockList.indexOf(this.data.reward);
                    if (index < 0) {
                        // 加入到解锁列表
                        GameConfig.babyUnlockList.push(this.data.reward);
                        Common.updateUnlockBaby();
                    }
                    else {
                        // 转换成糖果
                    }
                    var baby = GameConfig.actorTable[this.data.reward.toString()];
                    GameConfig.rewardData = Common.cloneObj(baby);
                    GameConfig.rewardType = EReward.AssignBaby;
                    Common.dispatchEvent(MainNotify.openGetRewardPanel);
                    break;
                default:
                    break;
            }
        }
    };
    SignIR.prototype._onComplete = function () {
        // this.m_imgBg.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onBtnSign, this)
        // Common.addTouchBegin(this.m_imgBg)
    };
    return SignIR;
}(eui.Component));
__reflect(SignIR.prototype, "SignIR");
//# sourceMappingURL=SignPanel.js.map