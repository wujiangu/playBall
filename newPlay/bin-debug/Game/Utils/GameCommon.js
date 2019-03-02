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
        GameVoice.btnSound.play(0, 1).volume = GameConfig.soundValue / 100;
    }
    function addTouchBegin(target) {
        target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, onTouchBegin, Common);
    }
    Common.addTouchBegin = addTouchBegin;
    /**获取账号 */
    function GetAccount() {
        egret.ExternalInterface.addCallback("sendToEgret", function (message) {
            GameConfig.account = message;
        });
        egret.ExternalInterface.call("read", GameConfig.game + "account");
    }
    Common.GetAccount = GetAccount;
    /**更新账号到本机 */
    function UpdateAccount(value) {
        GameConfig.account = value;
        egret.ExternalInterface.call("write", GameConfig.game + "account:" + value);
    }
    Common.UpdateAccount = UpdateAccount;
    /**获取历史最高分数 */
    function GetMaxScore() {
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
    Common.GetMaxScore = GetMaxScore;
    /**更新历史最高分
     * @param value 当前分数
     */
    function UpdateMaxScore(value) {
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
    Common.UpdateMaxScore = UpdateMaxScore;
    function GetGuide() {
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
    Common.GetGuide = GetGuide;
    function UpdateGuide(value) {
        GameConfig.guideIndex = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "guideIndex:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "guideIndex", value.toString());
        }
    }
    Common.UpdateGuide = UpdateGuide;
    /**获取历史最高分数 */
    function GetMaxCombo() {
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
    Common.GetMaxCombo = GetMaxCombo;
    /**更新历史最高分
     * @param value 当前分数
     */
    function UpdateMaxCombo(value) {
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
    Common.UpdateMaxCombo = UpdateMaxCombo;
    /**获取当前使用道具 */
    function GetItem() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.itemUse = parseInt(message);
                }
                else {
                    GameConfig.itemUse = -1;
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "itemUse");
        }
        else {
            var itemUse = NativeApi.getLocalData(GameConfig.game + "itemUse");
            if (itemUse == null) {
                GameConfig.itemUse = -1;
            }
            else {
                // GameConfig.maxScore = parseInt(score)
                GameConfig.itemUse = parseInt(itemUse);
            }
        }
    }
    Common.GetItem = GetItem;
    /**更新当前使用道具 */
    function UpdateItem(value) {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "itemUse:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "itemUse", value.toString());
        }
    }
    Common.UpdateItem = UpdateItem;
    /**
     * 获取使用道具表
     */
    function GetUseItem() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.itemUseTable = JSON.parse(message);
                    // GameConfig.maxScore = parseInt(message)
                }
                else {
                    GameConfig.itemUseTable = new Array();
                    GameConfig.itemUseTable.push(1003);
                    Common.UpdateUseItem();
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "itemUseTable");
        }
        else {
            var itemUseTable = NativeApi.getLocalData(GameConfig.game + "itemUseTable");
            if (itemUseTable == null) {
                GameConfig.itemUseTable = new Array();
                GameConfig.itemUseTable.push(1003);
                Common.UpdateUseItem();
            }
            else {
                // GameConfig.maxScore = parseInt(score)
                GameConfig.itemUseTable = JSON.parse(itemUseTable);
            }
        }
    }
    Common.GetUseItem = GetUseItem;
    /**更新道具列表 */
    function UpdateUseItem() {
        if (GameConfig.itemUseTable.length > 0) {
            var str = JSON.stringify(GameConfig.itemUseTable);
            if (!GameConfig.isWebView) {
                egret.ExternalInterface.call("write", GameConfig.game + "itemUseTable:" + str);
            }
            else {
                NativeApi.setLocalData(GameConfig.game + "itemUseTable", str);
            }
        }
    }
    Common.UpdateUseItem = UpdateUseItem;
    /**
     * 获取解锁道具表
     */
    function GetUnlockItem() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.itemUnlockList = JSON.parse(message);
                    // GameConfig.maxScore = parseInt(message)
                }
                else {
                    GameConfig.itemUnlockList = new Array();
                    GameConfig.itemUnlockList.push(1003);
                    Common.UpdateUnlockItem();
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "itemUnlockList");
        }
        else {
            var itemUnlockList = NativeApi.getLocalData(GameConfig.game + "itemUnlockList");
            if (itemUnlockList == null) {
                GameConfig.itemUnlockList = new Array();
                GameConfig.itemUnlockList.push(1003);
                Common.UpdateUnlockItem();
            }
            else {
                // GameConfig.maxScore = parseInt(score)
                GameConfig.itemUnlockList = JSON.parse(itemUnlockList);
            }
        }
    }
    Common.GetUnlockItem = GetUnlockItem;
    /**更新解锁道具列表 */
    function UpdateUnlockItem() {
        if (GameConfig.itemUnlockList.length > 0) {
            var str = JSON.stringify(GameConfig.itemUnlockList);
            if (!GameConfig.isWebView) {
                egret.ExternalInterface.call("write", GameConfig.game + "itemUnlockList:" + str);
            }
            else {
                NativeApi.setLocalData(GameConfig.game + "itemUnlockList", str);
            }
        }
    }
    Common.UpdateUnlockItem = UpdateUnlockItem;
    /**更新分数 */
    function UpdateCurrentScore(value) {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("gameScore", value.toString());
        }
        else {
            // NativeApi.setLocalData(GameConfig.game+"itemUseTable", str)
        }
    }
    Common.UpdateCurrentScore = UpdateCurrentScore;
    /**获取解锁宝宝表 */
    function GetUnlockBaby() {
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.addCallback("sendToEgret", function (message) {
                if (message != null && message.length > 0) {
                    GameConfig.babyUnlockList = JSON.parse(message);
                }
                else {
                    GameConfig.babyUnlockList = new Array();
                    GameConfig.babyUnlockList.push(10010);
                    Common.UpdateUnlockBaby();
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "babyUnlockList");
        }
        else {
            var babyUnlockList = NativeApi.getLocalData(GameConfig.game + "babyUnlockList");
            if (babyUnlockList == null) {
                GameConfig.babyUnlockList = new Array();
                GameConfig.babyUnlockList.push(10010);
                Common.UpdateUnlockBaby();
            }
            else {
                GameConfig.babyUnlockList = JSON.parse(babyUnlockList);
            }
        }
    }
    Common.GetUnlockBaby = GetUnlockBaby;
    /**更新解锁表 */
    function UpdateUnlockBaby() {
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
    Common.UpdateUnlockBaby = UpdateUnlockBaby;
    /**获取当前的宝宝 */
    function GetCurBaby() {
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
    Common.GetCurBaby = GetCurBaby;
    /**更新当前的宝宝 */
    function UpdateCurBaby(value) {
        GameConfig.curBaby = value;
        GameConfig.curBabyData = GameConfig.actorTable[value.toString()];
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curBaby:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curBaby", value.toString());
        }
    }
    Common.UpdateCurBaby = UpdateCurBaby;
    /**获取当前的挑战章节进度 */
    function GetCurChpter() {
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
    Common.GetCurChpter = GetCurChpter;
    /**更新当前的挑战章节进度 */
    function UpdateCurChpter(value) {
        GameConfig.curChpter = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curChpter:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curChpter", value.toString());
        }
    }
    Common.UpdateCurChpter = UpdateCurChpter;
    /**获取当前的挑战关卡进度 */
    function GetCurLevel() {
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
    Common.GetCurLevel = GetCurLevel;
    /**更新当前的挑战关卡进度 */
    function UpdateCurLevel(value) {
        GameConfig.curLevel = value;
        if (!GameConfig.isWebView) {
            egret.ExternalInterface.call("write", GameConfig.game + "curLevel:" + value);
        }
        else {
            NativeApi.setLocalData(GameConfig.game + "curLevel", value.toString());
        }
    }
    Common.UpdateCurLevel = UpdateCurLevel;
})(Common || (Common = {}));
//# sourceMappingURL=GameCommon.js.map