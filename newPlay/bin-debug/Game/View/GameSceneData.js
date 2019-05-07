var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var GameSceneData = (function () {
    function GameSceneData() {
        /**过关需要的分值 */
        this.needScore = 0;
        /**上一关的分值 */
        this.lastScore = 0;
        this.midOffset = 120;
        this.leftRightOffset = 90;
        /**增加的能量值 */
        this.addPower = 0;
        /**糖果的获得数量 */
        this.addCandy = 0;
        /**无尽分数增加索引 */
        this.soreIndex = 1;
        /**无尽连击增加索引 */
        this.comboIndex = 1;
        /** */
        this.chapter = 0;
        /**继续次数 */
        this.continueCount = 0;
        /**分数奖励是否领取 */
        this.isScoreRewardGet = false;
        /**连击奖励是否领取 */
        this.isComboRewardGet = false;
        this.allActors = new Array();
        this.recordBabySource = new Array();
    }
    // 获取召唤物目标X值
    GameSceneData.prototype.getSummonTargetX = function (e_pos, a_x, a_count, a_num, type, isBoss) {
        if (a_count === void 0) { a_count = 0; }
        if (a_num === void 0) { a_num = 0; }
        if (type === void 0) { type = ESummonType.Balloon; }
        if (isBoss === void 0) { isBoss = false; }
        var target = a_x;
        switch (e_pos) {
            case EMonsterPos.Left:
                if (a_count == 1) {
                    if (type == ESummonType.Balloon)
                        target += this.leftRightOffset;
                }
                else if (a_count == 2) {
                    target += 2 * this.leftRightOffset * a_num - this.leftRightOffset;
                }
                else if (a_count == 3) {
                    if (type == ESummonType.Monster)
                        target += 80 * a_num - 80;
                    else {
                        if (a_num <= 0)
                            target -= this.leftRightOffset;
                        else
                            target += this.leftRightOffset * a_num;
                    }
                }
                else {
                    if (type == ESummonType.Monster)
                        target += 80 * a_num - 120;
                    else {
                        if (a_num <= 0)
                            target -= this.leftRightOffset;
                        else
                            target += this.leftRightOffset * a_num;
                    }
                }
                break;
            case EMonsterPos.Middle:
                if (a_count == 1) {
                    if (type == ESummonType.Balloon)
                        target += this.midOffset;
                }
                else if (a_count == 2) {
                    target += 2 * this.midOffset * a_num - this.midOffset;
                }
                else if (a_count == 3) {
                    if (type == ESummonType.Monster)
                        target += this.leftRightOffset * a_num - this.leftRightOffset;
                    else {
                        if (a_num <= 0)
                            target -= this.midOffset;
                        else
                            target += this.midOffset * a_num;
                    }
                }
                else {
                    if (type == ESummonType.Monster)
                        target += 80 * a_num - 120;
                    else {
                        if (a_num <= 1)
                            target += this.midOffset * a_num - 200;
                        else
                            target += this.midOffset * (a_num - 1);
                    }
                }
                break;
            case EMonsterPos.Right:
                if (a_count == 1) {
                    if (type == ESummonType.Balloon)
                        target -= this.leftRightOffset;
                }
                else if (a_count == 2) {
                    target += 2 * this.leftRightOffset * a_num - this.leftRightOffset;
                }
                else if (a_count == 3) {
                    if (type == ESummonType.Monster)
                        target += this.leftRightOffset * a_num - this.leftRightOffset;
                    else {
                        if (a_num <= 0)
                            target += this.leftRightOffset;
                        else
                            target -= this.leftRightOffset * a_num;
                    }
                }
                else {
                    if (type == ESummonType.Monster)
                        target += 80 * a_num - 120;
                    else {
                        if (a_num <= 0)
                            target += this.leftRightOffset;
                        else
                            target -= this.leftRightOffset * (a_num - 1);
                    }
                }
                break;
            default:
                break;
        }
        return target;
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
                this.chapter = 1001;
            }
            else {
                switch (GameConfig.gameMode) {
                    case EBattleMode.Level:
                        var selectChater = PanelManager.gameSelectLevel.selectChater;
                        var chapterData = GameConfig.chapterTable[selectChater.toString()];
                        if (selectChater >= GameConfig.curChpter) {
                            if (GameConfig.curLevel <= 0)
                                Common.updateCurLevel(10101);
                            level = GameConfig.curLevel;
                        }
                        else {
                            level = chapterData.begin;
                        }
                        GameConfig.curBattleChapter = selectChater;
                        this.chapter = selectChater;
                        break;
                    case EBattleMode.Endless:
                        level = 1001;
                        this.chapter = 1000;
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
            return this._levelData;
        },
        /**设置挑战的关卡数据 */
        set: function (value) {
            this._levelData = value;
            this.needScore = this._levelData.normalCount;
        },
        enumerable: true,
        configurable: true
    });
    /**获取当前关卡的上一关 */
    GameSceneData.prototype.getLastLevel = function (a_level) {
        for (var i = 0; i < GameConfig.levelConfig.length; i++) {
            var data = GameConfig.levelConfig[i];
            if (data.next == a_level)
                return data.key;
        }
        return -1;
    };
    /**更新糖果 */
    GameSceneData.prototype.updateCandy = function (value) {
        this.addCandy += value;
        Common.updateCurCandy(value);
    };
    /**判断是否本章最后一关 */
    GameSceneData.prototype.isChapterFinal = function () {
        var nextLevel = this._levelData.next;
        if (nextLevel != null && nextLevel > 0) {
            var levelData = GameConfig.levelTable[nextLevel.toString()];
            if (levelData.section == this.chapter) {
                return false;
            }
        }
        return true;
    };
    /**获取关卡奖励 */
    GameSceneData.prototype.getLevelReward = function (score, combo, isEnd) {
        if (isEnd === void 0) { isEnd = false; }
        var chapterData = GameConfig.chapterTable[this.chapter.toString()];
        if (chapterData.reward && chapterData.reward[0] > 0) {
            for (var i = 0; i < chapterData.reward.length; i++) {
                var rewardId = chapterData.reward[i];
                var rewardData = GameConfig.levelRewardTable[rewardId];
                switch (rewardData.condition) {
                    case ELevelRewardCondition.Finish:
                        if (isEnd == true && this.isChapterFinal() && this.chapter == GameConfig.curChpter) {
                            this._rewardHandle(rewardData.reward, rewardData.value);
                        }
                        break;
                    case ELevelRewardCondition.EnoughScore:
                        if (!this.isScoreRewardGet && score >= rewardData.count) {
                            this.isScoreRewardGet = true;
                            this._rewardHandle(rewardData.reward, rewardData.value);
                        }
                        break;
                    case ELevelRewardCondition.EnoughCombo:
                        if (!this.isComboRewardGet && combo >= rewardData.count) {
                            this.isComboRewardGet = true;
                            this._rewardHandle(rewardData.reward, rewardData.value);
                        }
                        break;
                    case ELevelRewardCondition.OnesFinish:
                        if (isEnd == true && this.isChapterFinal() && this.continueCount <= 0 && this.chapter == GameConfig.curChpter) {
                            this._rewardHandle(rewardData.reward, rewardData.value);
                        }
                        break;
                    case ELevelRewardCondition.RepeatFinish:
                        if (isEnd == true && this.isChapterFinal() && this.chapter < GameConfig.curChpter) {
                            this._rewardHandle(rewardData.reward, rewardData.value);
                        }
                        break;
                }
            }
        }
    };
    /**关卡奖励数据处理 */
    GameSceneData.prototype._rewardHandle = function (rewardId, value) {
        if (rewardId == 1000) {
            this.extra += value;
            this.updateCandy(value);
            PanelManager.gameScenePanel.updateExtarCandy(value);
        }
        else {
            if (rewardId > 0) {
                this.unlockBaby(rewardId);
                var data = GameConfig.actorTable[rewardId]; //保存奖励对应图片
                this.recordBabySource.push(data.recordIcon);
            }
        }
    };
    /**根据连击数获取糖果奖励
     * @param value 连击数
     */
    GameSceneData.prototype.comboRewardCandy = function (value) {
        if (value > 0 && value % 15 == 0) {
            var extra = Math.floor(value / 15);
            this.extra += extra;
            this.extra = Math.min(3, this.extra);
            // this.updateCandy(extra)
        }
    };
    /**解锁宝宝 */
    GameSceneData.prototype.unlockBaby = function (id) {
        var index = GameConfig.babyUnlockList.indexOf(id);
        if (index < 0) {
            // 未解锁
            GameConfig.babyUnlockList.push(id);
            Common.updateUnlockBaby();
            PanelManager.gameScenePanel.unlockEffect(id);
        }
    };
    /**分数解锁 */
    GameSceneData.prototype.scoreUnlock = function (value) {
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.getLevelReward(value, 0);
                break;
            case EBattleMode.Endless:
                this.extra = 0;
                var extra = Math.floor(value / 500);
                if (this.soreIndex == extra) {
                    this.soreIndex++;
                    this.extra += extra * 5;
                    this.updateCandy(this.extra);
                    PanelManager.gameScenePanel.updateExtarCandy(this.extra);
                }
                if (value >= 5000) {
                    this.unlockBaby(10110);
                }
                if (value >= 10000) {
                    this.unlockBaby(10120);
                }
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
    };
    /**连击解锁 */
    GameSceneData.prototype.comboUnlock = function (value) {
        switch (GameConfig.gameMode) {
            case EBattleMode.Level:
                this.getLevelReward(0, value);
                break;
            case EBattleMode.Endless:
                this.extra = 0;
                var extra = Math.floor(value / 10);
                if (this.comboIndex == extra) {
                    this.comboIndex++;
                    this.extra += extra;
                    this.updateCandy(this.extra);
                    PanelManager.gameScenePanel.updateExtarCandy(this.extra);
                }
                if (value >= 50) {
                    this.unlockBaby(10170);
                }
                break;
            case EBattleMode.Timelimite:
                break;
            default:
                break;
        }
    };
    return GameSceneData;
}());
__reflect(GameSceneData.prototype, "GameSceneData");
//# sourceMappingURL=GameSceneData.js.map