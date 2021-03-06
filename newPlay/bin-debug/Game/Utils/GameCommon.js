var Common;
(function (Common) {
    //当前游戏场景类
    function gameScene() {
        if (Common.curScene == null) {
            Common.curScene = new GameScene();
        }
        return Common.curScene;
    }
    Common.gameScene = gameScene;
    function onTouchBegin() {
        if (GameConfig.isPlaySound)
            GameVoice.btnSound.play(0, 1).volume = GameConfig.soundValue / 100;
    }
    function addTouchBegin(target) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, onTouchBegin, Common);
    }
    Common.addTouchBegin = addTouchBegin;
    function isTowDataSame(date) {
        var isSame = false;
        var curDate = new Date();
        var lastDate = new Date(date);
        if (curDate != null && lastDate != null) {
            var curYear = curDate.getFullYear();
            var lastYear = lastDate.getFullYear();
            var curMonth = curDate.getMonth();
            var lastMonth = lastDate.getMonth();
            var curDay = curDate.getDate();
            var lastDay = lastDate.getDate();
            if (curYear == lastYear && curMonth == lastMonth && curDay == lastDay)
                isSame = true;
            var loginTime = getCurDateString(curDate);
            Common.updatelastLoginTime(loginTime);
        }
        return isSame;
    }
    Common.isTowDataSame = isTowDataSame;
    function getCurDateString(date) {
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        return year + "/" + month + "/" + day;
    }
    Common.getCurDateString = getCurDateString;
    /**获取账号 */
    function getAccount() {
        egret.ExternalInterface.addCallback("sendToEgret", function (message) {
            GameConfig.account = message;
        });
        egret.ExternalInterface.call("read", GameConfig.game + "account");
    }
    Common.getAccount = getAccount;
    /**更新账号到本机 */
    function updateAccount(value) {
        GameConfig.account = value;
        egret.ExternalInterface.call("write", GameConfig.game + "account:" + value);
    }
    Common.updateAccount = updateAccount;
    /**获取历史最高分数 */
    function getMaxScore() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.maxScore = parseInt(message);
                }
                else {
                    GameConfig.maxScore = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "maxScore");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "maxScore");
            if (score == null) {
                GameConfig.maxScore = 0;
            }
            else {
                GameConfig.maxScore = parseInt(score);
            }
        }
    }
    Common.getMaxScore = getMaxScore;
    /**更新历史最高分
     * @param value 当前分数
     */
    function updateMaxScore(value) {
        if (value > GameConfig.maxScore) {
            GameConfig.maxScore = value;
            if (!GameConfig.isWebView) {
                egret.ExternalInterface.call("write", GameConfig.game + "maxScore:" + value);
            }
            else {
                NativeApi.setLocalData(GameConfig.game + "maxScore", value.toString());
            }
        }
    }
    Common.updateMaxScore = updateMaxScore;
    function getGuide() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.guideIndex = parseInt(message);
                }
                else {
                    GameConfig.guideIndex = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "guideIndex");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "guideIndex");
            if (score == null) {
                GameConfig.guideIndex = 0;
            }
            else {
                GameConfig.guideIndex = parseInt(score);
            }
        }
    }
    Common.getGuide = getGuide;
    function updateGuide(value) {
        GameConfig.guideIndex = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "guideIndex:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "guideIndex", value.toString());
        }
    }
    Common.updateGuide = updateGuide;
    /**获取历史最高分数 */
    function getMaxCombo() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.maxCombo = parseInt(message);
                }
                else {
                    GameConfig.maxCombo = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "maxCombo");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "maxCombo");
            if (score == null) {
                GameConfig.maxCombo = 0;
            }
            else {
                GameConfig.maxCombo = parseInt(score);
            }
        }
    }
    Common.getMaxCombo = getMaxCombo;
    /**更新历史最高分
     * @param value 当前分数
     */
    function updateMaxCombo(value) {
        if (value > GameConfig.maxCombo) {
            GameConfig.maxCombo = value;
            if (!GameConfig.isWebView) {
                egret.ExternalInterface.call("write", GameConfig.game + "maxCombo:" + value);
            }
            else {
                NativeApi.setLocalData(GameConfig.game + "maxCombo", value.toString());
            }
        }
    }
    Common.updateMaxCombo = updateMaxCombo;
    /**更新分数 */
    function updateCurrentScore(value) {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("gameScore", value.toString());
        }
        else {
            // NativeApi.setLocalData(GameConfig.game+"itemUseTable", str)
        }
    }
    Common.updateCurrentScore = updateCurrentScore;
    /**获取解锁宝宝表 */
    function getUnlockBaby() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.babyUnlockList = JSON.parse(message);
                }
                else {
                    GameConfig.babyUnlockList = new Array();
                    GameConfig.babyUnlockList.push(10010);
                    Common.updateUnlockBaby();
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "babyUnlockList");
        }
        else {
            var babyUnlockList = NativeApi.getLocalData(GameConfig.game + "babyUnlockList");
            if (babyUnlockList == null) {
                GameConfig.babyUnlockList = new Array();
                GameConfig.babyUnlockList.push(10010);
                Common.updateUnlockBaby();
            }
            else {
                GameConfig.babyUnlockList = JSON.parse(babyUnlockList);
            }
        }
    }
    Common.getUnlockBaby = getUnlockBaby;
    /**更新解锁表 */
    function updateUnlockBaby() {
        if (GameConfig.babyUnlockList.length > 0) {
            var str = JSON.stringify(GameConfig.babyUnlockList);
            if (!GameConfig.isWebView) {
                egret.ExternalInterface.call("write", GameConfig.game + "babyUnlockList:" + str);
            }
            else {
                NativeApi.setLocalData(GameConfig.game + "babyUnlockList", str);
            }
        }
    }
    Common.updateUnlockBaby = updateUnlockBaby;
    /**获取当前的宝宝 */
    function getCurBaby() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.curBaby = parseInt(message);
                }
                else {
                    GameConfig.curBaby = 10010;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "curBaby");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "curBaby");
            if (score == null) {
                GameConfig.curBaby = 10010;
            }
            else {
                GameConfig.curBaby = parseInt(score);
            }
        }
    }
    Common.getCurBaby = getCurBaby;
    /**更新当前的宝宝 */
    function updateCurBaby(value) {
        GameConfig.curBaby = value;
        GameConfig.curBabyData = GameConfig.actorTable[value.toString()];
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curBaby:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curBaby", value.toString());
        }
    }
    Common.updateCurBaby = updateCurBaby;
    /**获取当前的挑战章节进度 */
    function getCurChpter() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.curChpter = parseInt(message);
                }
                else {
                    GameConfig.curChpter = 1001;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "curChpter");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "curChpter");
            if (score == null) {
                GameConfig.curChpter = 1001;
            }
            else {
                GameConfig.curChpter = parseInt(score);
            }
        }
    }
    Common.getCurChpter = getCurChpter;
    /**更新当前的挑战章节进度 */
    function updateCurChpter(value) {
        GameConfig.curChpter = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curChpter:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curChpter", value.toString());
        }
    }
    Common.updateCurChpter = updateCurChpter;
    /**获取当前的挑战关卡进度 */
    function getCurLevel() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.curLevel = parseInt(message);
                }
                else {
                    GameConfig.curLevel = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "curLevel");
        }
        else {
            var score = NativeApi.getLocalData(GameConfig.game + "curLevel");
            if (score == null) {
                GameConfig.curLevel = 0;
            }
            else {
                GameConfig.curLevel = parseInt(score);
            }
        }
    }
    Common.getCurLevel = getCurLevel;
    /**更新当前的挑战关卡进度 */
    function updateCurLevel(value) {
        GameConfig.curLevel = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curLevel:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curLevel", value.toString());
        }
    }
    Common.updateCurLevel = updateCurLevel;
    /**获取当前的糖果 */
    function getCurCandy() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.candy = parseInt(message);
                }
                else {
                    GameConfig.candy = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "candy");
        }
        else {
            var candy = NativeApi.getLocalData(GameConfig.game + "candy");
            if (candy == null) {
                GameConfig.candy = 0;
            }
            else {
                GameConfig.candy = parseInt(candy);
            }
        }
    }
    Common.getCurCandy = getCurCandy;
    /**更新当前的糖果 */
    function updateCurCandy(value) {
        GameConfig.candy += value;
        GameConfig.candy = Math.max(0, GameConfig.candy);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "candy:" + GameConfig.candy);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "candy", GameConfig.candy.toString());
        }
    }
    Common.updateCurCandy = updateCurCandy;
    /**更新当前的糖果 */
    function updateAfterBuyCurCandy(value) {
        GameConfig.candy = value;
        GameConfig.candy = Math.max(0, GameConfig.candy);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "candy:" + GameConfig.candy);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "candy", GameConfig.candy.toString());
        }
    }
    Common.updateAfterBuyCurCandy = updateAfterBuyCurCandy;
    /**获取上次的登录时间 */
    function getlastLoginTime() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.lastLoginTime = message;
                }
                else {
                    var date = new Date();
                    GameConfig.lastLoginTime = getCurDateString(date);
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "lastLoginTime");
        }
        else {
            var lastLoginTime = NativeApi.getLocalData(GameConfig.game + "lastLoginTime");
            if (lastLoginTime == null) {
                var date = new Date();
                GameConfig.lastLoginTime = getCurDateString(date);
            }
            else {
                GameConfig.lastLoginTime = lastLoginTime;
            }
        }
    }
    Common.getlastLoginTime = getlastLoginTime;
    /**更新上次登录时间 */
    function updatelastLoginTime(value) {
        GameConfig.lastLoginTime = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "lastLoginTime:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "lastLoginTime", value);
        }
    }
    Common.updatelastLoginTime = updatelastLoginTime;
    /**获取签到标识 */
    function getSign() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.sign = parseInt(message);
                }
                else {
                    GameConfig.sign = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "sign");
        }
        else {
            var sign = NativeApi.getLocalData(GameConfig.game + "sign");
            if (sign == null) {
                GameConfig.sign = 0;
            }
            else {
                GameConfig.sign = parseInt(sign);
            }
        }
    }
    Common.getSign = getSign;
    /**更新当前签到标识 */
    function updateSign(value) {
        GameConfig.sign = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "sign:" + GameConfig.sign);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "sign", GameConfig.sign.toString());
        }
    }
    Common.updateSign = updateSign;
    /**获取签到标识 */
    function getBabylistIndex() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.babylistIndex = parseInt(message);
                }
                else {
                    GameConfig.babylistIndex = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "babylistIndex");
        }
        else {
            var babylistIndex = NativeApi.getLocalData(GameConfig.game + "babylistIndex");
            if (babylistIndex == null) {
                GameConfig.babylistIndex = 0;
            }
            else {
                GameConfig.babylistIndex = parseInt(babylistIndex);
            }
        }
    }
    Common.getBabylistIndex = getBabylistIndex;
    /**更新当前签到标识 */
    function updateBabylistIndex(value) {
        GameConfig.babylistIndex = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "babylistIndex:" + GameConfig.babylistIndex);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "babylistIndex", GameConfig.babylistIndex.toString());
        }
    }
    Common.updateBabylistIndex = updateBabylistIndex;
    /**获取签到天数 */
    function getSignCount() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.signCount = parseInt(message);
                }
                else {
                    GameConfig.signCount = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "signCount");
        }
        else {
            var signCount = NativeApi.getLocalData(GameConfig.game + "signCount");
            if (signCount == null) {
                GameConfig.signCount = 0;
            }
            else {
                GameConfig.signCount = parseInt(signCount);
            }
        }
    }
    Common.getSignCount = getSignCount;
    /**更新当前签到天数 */
    function updateSignCount(value) {
        GameConfig.signCount = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "signCount:" + GameConfig.signCount);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "signCount", GameConfig.signCount.toString());
        }
    }
    Common.updateSignCount = updateSignCount;
    /**是否刷新签到数据 */
    function getIsSignData() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.isSignData = parseInt(message);
                }
                else {
                    GameConfig.isSignData = 0;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "IsSignData");
        }
        else {
            var isSignData = NativeApi.getLocalData(GameConfig.game + "IsSignData");
            if (isSignData == null) {
                GameConfig.isSignData = 0;
            }
            else {
                GameConfig.isSignData = parseInt(isSignData);
            }
        }
    }
    Common.getIsSignData = getIsSignData;
    /**更新是否刷新签到数据 */
    function updateIsSignData(value) {
        GameConfig.isSignData = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "IsSignData:" + GameConfig.isSignData);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "IsSignData", GameConfig.isSignData.toString());
        }
    }
    Common.updateIsSignData = updateIsSignData;
    /**获取章节分数 */
    function getChapterScore() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.chapterMaxScore = JSON.parse(message);
                }
                else {
                    GameConfig.chapterMaxScore = {};
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "chapterMaxScore");
        }
        else {
            var chapterMaxScore = NativeApi.getLocalData(GameConfig.game + "chapterMaxScore");
            if (chapterMaxScore == null) {
                GameConfig.chapterMaxScore = {};
            }
            else {
                GameConfig.chapterMaxScore = JSON.parse(chapterMaxScore);
            }
        }
    }
    Common.getChapterScore = getChapterScore;
    /**更新章节分数 */
    function updateChapterScore(value) {
        GameConfig.chapterMaxScore = value;
        var strScore = JSON.stringify(value);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "chapterMaxScore:" + strScore);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "chapterMaxScore", strScore);
        }
    }
    Common.updateChapterScore = updateChapterScore;
    /**获取章节最高连击 */
    function getChapterCombo() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.chapterMaxCombo = JSON.parse(message);
                }
                else {
                    GameConfig.chapterMaxCombo = {};
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "chapterMaxCombo");
        }
        else {
            var chapterMaxCombo = NativeApi.getLocalData(GameConfig.game + "chapterMaxCombo");
            if (chapterMaxCombo == null) {
                GameConfig.chapterMaxCombo = {};
            }
            else {
                GameConfig.chapterMaxCombo = JSON.parse(chapterMaxCombo);
            }
        }
    }
    Common.getChapterCombo = getChapterCombo;
    /**更新章节连击 */
    function updateChapterCombo(value) {
        GameConfig.chapterMaxCombo = value;
        var strScore = JSON.stringify(value);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "chapterMaxCombo:" + strScore);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "chapterMaxCombo", strScore);
        }
    }
    Common.updateChapterCombo = updateChapterCombo;
    /**获取章节是否通过**/
    function getIsChapterPass() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.isChapterPass = JSON.parse(message);
                }
                else {
                    GameConfig.isChapterPass = {};
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "isChapterPass");
        }
        else {
            var isChapterPass = NativeApi.getLocalData(GameConfig.game + "isChapterPass");
            if (isChapterPass == null) {
                GameConfig.isChapterPass = {};
            }
            else {
                GameConfig.isChapterPass = JSON.parse(isChapterPass);
            }
        }
    }
    Common.getIsChapterPass = getIsChapterPass;
    /**更新章节是否通过**/
    function updateIsChapterPass(value) {
        GameConfig.isChapterPass = value;
        var isChapterPass = JSON.stringify(value);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "isChapterPass:" + isChapterPass);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "isChapterPass", isChapterPass);
        }
    }
    Common.updateIsChapterPass = updateIsChapterPass;
    /**获取章节奖励是否领取**/
    function getIsGetChapterRecord() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.isGetChapterRecord = JSON.parse(message);
                }
                else {
                    GameConfig.isGetChapterRecord = {};
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "isGetChapterRecord");
        }
        else {
            var isGetChapterRecord = NativeApi.getLocalData(GameConfig.game + "isGetChapterRecord");
            if (isGetChapterRecord == null) {
                GameConfig.isGetChapterRecord = {};
            }
            else {
                GameConfig.isGetChapterRecord = JSON.parse(isGetChapterRecord);
            }
        }
    }
    Common.getIsGetChapterRecord = getIsGetChapterRecord;
    /**更新章节奖励是否领取**/
    function updateIsGetChapterRecord(value) {
        GameConfig.isGetChapterRecord = value;
        var isGetChapterRecord = JSON.stringify(value);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "isGetChapterRecord:" + isGetChapterRecord);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "isGetChapterRecord", isGetChapterRecord);
        }
    }
    Common.updateIsGetChapterRecord = updateIsGetChapterRecord;
    /**额外奖励 */
    function extraReward(skillData, value) {
        var type = parseInt(skillData.param[0]);
        var count = parseInt(skillData.param[1]);
        if (value > 0) {
            switch (type) {
                case EExtraType.Plus:
                    value = value + count;
                    break;
                case EExtraType.Mul:
                    value *= count;
                    break;
                default:
                    break;
            }
        }
        return value;
    }
    Common.extraReward = extraReward;
    /**获取章节上次分数 */
    function getLastScore() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.chapterLastScore = JSON.parse(message);
                }
                else {
                    GameConfig.chapterLastScore = {};
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "chapterLastScore");
        }
        else {
            var chapterLastScore = NativeApi.getLocalData(GameConfig.game + "chapterLastScore");
            if (chapterLastScore == null) {
                GameConfig.chapterLastScore = {};
            }
            else {
                GameConfig.chapterLastScore = JSON.parse(chapterLastScore);
            }
        }
    }
    Common.getLastScore = getLastScore;
    /**更新章节上次分数 */
    function updateLastScore(value) {
        GameConfig.chapterLastScore = value;
        var strScore = JSON.stringify(value);
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "chapterLastScore:" + strScore);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "chapterLastScore", strScore);
        }
    }
    Common.updateLastScore = updateLastScore;
})(Common || (Common = {}));
//# sourceMappingURL=GameCommon.js.map