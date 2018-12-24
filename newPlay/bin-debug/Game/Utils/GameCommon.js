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
})(Common || (Common = {}));
