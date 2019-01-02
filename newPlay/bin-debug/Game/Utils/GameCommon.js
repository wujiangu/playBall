var Common;
(function (Common) {
    var curScene;
    //当前游戏场景类
    function gameScene() {
        if (this.curScene == null) {
            this.curScene = new GameScene();
        }
        return this.curScene;
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
     * @param {value} 当前分数
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
                }
                else {
                    GameConfig.itemUseTable = new Array();
                }
            });
            egret.ExternalInterface.call("read", GameConfig.game + "itemUseTable");
        }
        else {
            var itemUseTable = NativeApi.getLocalData(GameConfig.game + "itemUseTable");
            if (itemUseTable == null) {
                GameConfig.itemUseTable = new Array();
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
})(Common || (Common = {}));
//# sourceMappingURL=GameCommon.js.map