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
var GameScenePanel = (function (_super) {
    __extends(GameScenePanel, _super);
    function GameScenePanel() {
        var _this = _super.call(this) || this;
        _this.addEventListener(eui.UIEvent.COMPLETE, _this.onComplete, _this);
        _this.skinName = "resource/game_skins/gameScenePanel.exml";
        GameConfig.monsterConfig = RES.getRes("monsterConfig_json");
        for (var i = 0; i < GameConfig.monsterConfig.length; i++) {
            var data = GameConfig.monsterConfig[i];
            _this._InitBattleDragonBones(data.name);
        }
        _this.m_monsters = new Array();
        return _this;
    }
    // 初始化面板
    GameScenePanel.prototype.initPanel = function () {
    };
    // 初始化面板数据
    GameScenePanel.prototype.initData = function () {
        this.m_monsterAddDelay = 0;
    };
    // 进入面板
    GameScenePanel.prototype.onEnter = function () {
        this.touchChildren = true;
        Common.gameScene().uiLayer.addChild(this);
        this.initData();
        this._CreateMonster();
    };
    // 退出面板
    GameScenePanel.prototype.onExit = function () {
        this.touchChildren = false;
        Common.gameScene().uiLayer.removeChild(this);
    };
    GameScenePanel.prototype.Update = function (timeElapsed) {
        if (GameManager.Instance.GameState != EGameState.Pause) {
            this.m_monsterAddDelay += timeElapsed;
        }
        if (this.m_monsterAddDelay >= GameConfig.monsterAddDelay) {
            this.m_monsterAddDelay = 0;
            // this._CreateMonster()
        }
        for (var i = 0; i < this.m_monsters.length; i++) {
            this.m_monsters[i].Update(timeElapsed);
        }
    };
    GameScenePanel.prototype.RemoveMonster = function (a_monster) {
        for (var i = 0; i < this.m_monsters.length; i++) {
            if (this.m_monsters[i] == a_monster) {
                this.m_groupGame.removeChild(this.m_monsters[i]);
                this.m_monsters.splice(i, 1);
                this._CreateMonster();
                break;
            }
        }
    };
    GameScenePanel.prototype.onComplete = function () {
        this._OnResize();
    };
    GameScenePanel.prototype._CreateMonster = function () {
        var monster = GameObjectPool.getInstance().createObject(Monster, "Monster");
        monster.Init();
        this.m_monsters.push(monster);
        for (var i = this.m_monsters.length - 1; i >= 0; i--) {
            this.m_groupGame.addChild(this.m_monsters[i]);
        }
    };
    /**
     * 初始化骨骼的动画数据
     */
    GameScenePanel.prototype._InitBattleDragonBones = function (name) {
        var skeletonData = RES.getRes(name + "_ske_dbbin");
        var textureData = RES.getRes(name + "_tex_json");
        var texture = RES.getRes(name + "_tex_png");
        DragonBonesFactory.getInstance().initDragonBonesArmatureFile(skeletonData, textureData, texture);
    };
    GameScenePanel.prototype._OnResize = function (event) {
        if (event === void 0) { event = null; }
    };
    return GameScenePanel;
}(BasePanel));
__reflect(GameScenePanel.prototype, "GameScenePanel");
//# sourceMappingURL=GameScenePanel.js.map