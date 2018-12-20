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
})(Common || (Common = {}));
