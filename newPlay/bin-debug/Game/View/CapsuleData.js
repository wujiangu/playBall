var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var CapsuleData = (function () {
    function CapsuleData() {
        /** 抽奖消耗糖果数量 */
        this.consume = 50;
        /** 抽奖的结果 */
        this.resultType = 0;
        /** 糖果不够 */
        this.isEnough = false;
    }
    Object.defineProperty(CapsuleData.prototype, "result", {
        get: function () {
            var capsuleRandom = MathUtils.getRandom(1, this._capsuleWeight);
            var capsuleData = null;
            for (var i = 0; i < GameConfig.capsuleConfig.length; i++) {
                var config = GameConfig.capsuleConfig[i];
                var capsule = GameConfig.capsuleTable[config.id.toString()];
                if (capsuleRandom <= capsule.range) {
                    capsuleData = capsule;
                    break;
                }
            }
            if (GameConfig.babyUnlockList.length == 1) {
                capsuleData.type = ECapsule.BlueBaby;
            }
            switch (capsuleData.type) {
                case ECapsule.Candy:
                    this._capsuleCandy(capsuleData.value);
                    break;
                case ECapsule.GreenBaby:
                    this._capsuleBaby(EBabyQuality.Green);
                    break;
                case ECapsule.BlueBaby:
                    this._capsuleBaby(EBabyQuality.Blue);
                    break;
                case ECapsule.PurpleBaby:
                    this._capsuleBaby(EBabyQuality.Purple);
                    break;
            }
            if (capsuleData.type != ECapsule.Candy) {
                // 判断是否在已解锁列表中
                var index = GameConfig.babyUnlockList.indexOf(this._result.id);
                if (index < 0) {
                    // 加入到解锁列表
                    GameConfig.rewardType = EReward.AssignBaby;
                    GameConfig.babyUnlockList.push(this._result.id);
                    Common.updateUnlockBaby();
                }
                else {
                    // 转换成糖果
                    this._capsuleCandy(this._result.candy);
                }
            }
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    CapsuleData.prototype.init = function () {
        this._capsuleWeight = 0;
        this._babys = new Array();
        for (var i = 0; i < GameConfig.capsuleConfig.length; i++) {
            var id = GameConfig.capsuleConfig[i].id;
            var capsule = GameConfig.capsuleTable[id.toString()];
            this._capsuleWeight += capsule.weight;
            capsule.range = this._capsuleWeight;
        }
    };
    CapsuleData.prototype._capsuleCandy = function (value) {
        GameConfig.rewardCandy = value;
        GameConfig.rewardType = EReward.Candy;
        Common.updateCurCandy(value);
        Common.dispatchEvent(MainNotify.updateCandy);
    };
    CapsuleData.prototype._capsuleBaby = function (quality) {
        this._babys.length = 0;
        var range = 0;
        for (var i = 0; i < GameConfig.actorConfig.length; i++) {
            var config = GameConfig.actorConfig[i];
            if (config.quality == quality) {
                this._babys.push(config);
            }
        }
        for (var i = 0; i < this._babys.length; i++) {
            var id = this._babys[i].id;
            var baby = GameConfig.actorTable[id.toString()];
            range += baby.weight;
            baby.range = range;
        }
        var random = MathUtils.getRandom(1, range);
        for (var i = 0; i < this._babys.length; i++) {
            var config = this._babys[i];
            var baby = GameConfig.actorTable[config.id.toString()];
            if (random <= baby.range) {
                this._result = baby;
                break;
            }
        }
    };
    return CapsuleData;
}());
__reflect(CapsuleData.prototype, "CapsuleData");
//# sourceMappingURL=CapsuleData.js.map