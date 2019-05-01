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
        _this.signInBeforeColor_lblTime = 0xc8c07d; //签到之前天数的颜色
        _this.signInLaterColor_lblTime = 0xb4a686; //签到之后天数的颜色
        _this.signInBeforeColor_lblRecordNum = 0x94c401; //签到之前奖励数目的颜色
        _this.signInLaterColor_lblRecordNum = 0x8e8060; //签到之后奖励数目的颜色
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/qiandao.exml";
        return _this;
    }
    // 初始化面板
    SignPanel.prototype.initPanel = function () {
        this._signGroups = new Array();
        this._loopSignGroups = new Array();
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
            // this.m_imgCheck7.visible = true
        }
        Common.gameScene().uiLayer.addChild(this);
    };
    // 退出面板
    SignPanel.prototype.onExit = function () {
        Common.gameScene().uiLayer.removeChild(this);
    };
    SignPanel.prototype._onClose = function () {
        this.m_imgMask.touchEnabled = false;
        this.hide.play(0);
    };
    SignPanel.prototype._onShow = function () {
        this.m_imgMask.touchEnabled = true;
        this._sign(true);
        // this.m_scroll.verticalScrollBar.visible = false
        // this.m_scroll.verticalScrollBar.autoVisibility = false
    };
    SignPanel.prototype._onHide = function () {
        Common.dispatchEvent(MainNotify.closeSignPanel);
    };
    SignPanel.prototype._sign = function (isInit) {
        if (GameConfig.sign == 0 && GameConfig.signCount <= 6) {
            if (GameConfig.signCount <= 6) {
                this._signGroups[GameConfig.signCount].sign();
            }
            else {
                this.m_imgMask7.visible = true;
                this.m_Recordiconbg7.source = "signinrecordbg_png";
                this.m_Recordicon7.source = "actorIcon10100SignIn_png";
                this._lblTimeNum7.textColor = this.signInLaterColor_lblTime;
                this._lblRecordNum7.textColor = this.signInLaterColor_lblRecordNum;
                this._lblRecordName7.textColor = this.signInLaterColor_lblRecordNum;
                // this.m_imgCheck7.visible = true
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
            if (!isInit)
                TipsManager.show("today is signed!");
        }
    };
    SignPanel.prototype._onBtnSignIn = function () {
        this._sign(false);
    };
    SignPanel.prototype.onComplete = function () {
        this._onResize();
        this.m_imgMask.addEventListener(egret.TouchEvent.TOUCH_TAP, this._onClose, this);
        this.show.addEventListener('complete', this._onShow, this);
        this.hide.addEventListener('complete', this._onHide, this);
        this._signGroups.length = 0;
        this._loopSignGroups.length = 0;
        if (GameConfig.isSignData == 0) {
            for (var i = 0; i < GameConfig.signConfig.length - 7; i++) {
                var config = GameConfig.signConfig[i];
                var data = GameConfig.signTable[config.id.toString()];
                var signIR = new SignIR();
                // let row = Math.floor(i/4)
                // let col = i % 4
                // signIR.init(data, i)
                // signIR.x = 165 * col - 40 
                // signIR.y = 234 * row + 111
                signIR.init(data, i);
                signIR.x = 74;
                signIR.y = 140 * i + 110;
                this.group.addChild(signIR);
                this._signGroups.push(signIR);
            }
        }
        else {
            for (var i = 7; i < GameConfig.signConfig.length; i++) {
                var config = GameConfig.signConfig[i];
                var data = GameConfig.signTable[config.id.toString()];
                var signIR = new SignIR();
                signIR.init(data, i - 7);
                signIR.x = 74;
                signIR.y = 140 * (i - 7) + 110;
                this.group.addChild(signIR);
                this._signGroups.push(signIR);
            }
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
        _this.signInLaterColor_R = 112;
        _this.signInLaterColor_G = 98;
        _this.signInLaterColor_B = 66;
        _this.signInBeforeColor_lblTime = 0xc8c07d; //签到之前天数的颜色
        _this.signInLaterColor_lblTime = 0xb4a686; //签到之后天数的颜色
        _this.signInBeforeColor_lblRecordNum = 0x94c401; //签到之前奖励数目的颜色
        _this.signInLaterColor_lblRecordNum = 0x8e8060; //签到之后奖励数目的颜色
        _this.addEventListener(eui.UIEvent.COMPLETE, _this._onComplete, _this);
        _this.skinName = "resource/game_skins/qiandaoIR.exml";
        return _this;
    }
    SignIR.prototype.init = function (data, day) {
        var signIndex = day + 1;
        this.m_imgTime.source = data.icon;
        this.m_labCount.text = "+" + 1;
        this.m_timenum.text = signIndex + "DAY";
        if (data.rewardType == EReward.Candy) {
            this.m_labCount.text = "+" + data.reward;
            this.m_imgReward.source = "signinrecord1_png";
            this._lblRecordName.text = "Candy";
        }
        else {
            this.m_imgReward.source = "signinrecord4_png";
            this._lblRecordName.text = "Lucky Cat";
        }
        // this.m_imgReward.source = data.icon
        // this.m_imgBg.source = "qiandao2_png"
        // this.m_imgGou.visible = false
        this.id = data.id;
        this.index = day;
        this.data = data;
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
                    // // 判断是否在已解锁列表中
                    // let index = GameConfig.babyUnlockList.indexOf(this.data.reward)
                    // if (index < 0) {
                    // 	// 加入到解锁列表
                    // 	GameConfig.babyUnlockList.push(this.data.reward)
                    // 	Common.updateUnlockBaby()
                    // }else{
                    // 	// 转换成糖果
                    // }					
                    // let baby = GameConfig.actorTable[this.data.reward.toString()]
                    // GameConfig.rewardData = Common.cloneObj(baby)
                    // GameConfig.rewardType = EReward.AssignBaby
                    // Common.dispatchEvent(MainNotify.openGetRewardPanel)
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
        // this.m_imgCheckIn.visible = true
        if (this.data.rewardType == EReward.Candy) {
            this.m_imgReward.source = "candySignIn_png";
        }
        else {
            this.m_imgReward.source = "babySignIn_png";
        }
        this.m_recordiconbg.source = "signinrecordbg_png";
        this.m_timenum.textColor = this.signInLaterColor_lblTime;
        this.m_labCount.textColor = this.signInLaterColor_lblRecordNum;
        this._lblRecordName.textColor = this.signInLaterColor_lblRecordNum;
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