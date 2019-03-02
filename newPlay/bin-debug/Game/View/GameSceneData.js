var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameSceneData = (function () {
    function GameSceneData() {
        this.allActors = new Array();
    }
    // 获取召唤物目标X值
    GameSceneData.prototype.getSummonTargetX = function (e_pos, a_x, a_y, a_count, a_num, isBoss) {
        if (a_count === void 0) { a_count = 0; }
        if (a_num === void 0) { a_num = 0; }
        if (isBoss === void 0) { isBoss = false; }
        switch (e_pos) {
            case EMonsterPos.Left:
                break;
            case EMonsterPos.Middle:
                break;
            case EMonsterPos.Right:
                break;
            default:
                break;
        }
    };
    // 获取召唤物目标Y值
    GameSceneData.prototype.getSummonTargetY = function () {
    };
    Object.defineProperty(GameSceneData.prototype, "level", {
        /**
         * 获取挑战的关卡ID
         */
        get: function () {
            var level = 0;
            if (GameConfig.guideIndex == 0) {
                // 引导关
                level = 1000;
            }
            else {
                switch (GameConfig.gameMode) {
                    case EBattleMode.Level:
                        var selectChater = PanelManager.m_gameSelectLevel.selectChater;
                        var chapterData = GameConfig.chapterTable[selectChater.toString()];
                        if (selectChater >= GameConfig.curChpter) {
                            if (GameConfig.curLevel <= 0)
                                Common.UpdateCurLevel(10101);
                            level = GameConfig.curLevel;
                        }
                        else {
                            level = chapterData.begin;
                        }
                        break;
                    case EBattleMode.Endless:
                        level = 1001;
                        break;
                    case EBattleMode.Timelimite:
                        break;
                    default:
                        break;
                }
            }
            this.levelData = GameConfig.levelTable[level.toString()];
            return level;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GameSceneData.prototype, "levelData", {
        /**获取挑战的关卡数据 */
        get: function () {
            return this.m_levelData;
        },
        /**设置挑战的关卡数据 */
        set: function (value) {
            this.m_levelData = value;
            this.needScore = this.m_levelData.normalCount;
        },
        enumerable: true,
        configurable: true
    });
    /**获取当前关卡的上一关 */
    GameSceneData.prototype.GetLastLevel = function (a_level) {
        for (var i = 0; i < GameConfig.levelConfig.length; i++) {
            var data = GameConfig.levelConfig[i];
            if (data.next == a_level)
                return data.key;
        }
        return -1;
    };
    return GameSceneData;
}());
__reflect(GameSceneData.prototype, "GameSceneData");
//# sourceMappingURL=GameSceneData.js.map