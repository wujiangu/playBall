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
var EliteActor = (function (_super) {
    __extends(EliteActor, _super);
    function EliteActor() {
        return _super.call(this) || this;
    }
    EliteActor.prototype.Init = function (data, type) {
        _super.prototype.Init.call(this, data, type);
        this._changeToUnknown();
        this._isArrive = true;
        this._speedY = 0.3;
    };
    EliteActor.prototype.update = function (timeElapsed) {
        if (this.y > this.actorTableData.Height && this.state == EMonsterState.Ready) {
            this._isArrive = false;
            this._speedY = this._baseSpeedY;
        }
        _super.prototype.update.call(this, timeElapsed);
        if (this._knownTime >= 0) {
            this._knownTime += timeElapsed;
            if (this._knownTime >= 3000) {
                this._changeToUnknown();
            }
        }
    };
    EliteActor.prototype.summonBeKill = function () {
        this._summonCount -= 1;
        if (this._knownTime < 0) {
            this._summonBeKillCount += 1;
        }
        this._summonCount = Math.max(0, this._summonCount);
        if (this._data.Difficult == EMonsterDifficult.SpecialElite1 && this._summonCount <= 0) {
            if (this._summonWave <= this._data.Wave) {
                this._changeToKnown();
            }
        }
        if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
            if (this._summonBeKillCount >= this._data.Count) {
                this._summonBeKillCount = 0;
                this._changeToKnown();
            }
        }
    };
    EliteActor.prototype.ballExplosion = function (a_ball) {
        _super.prototype.ballExplosion.call(this, a_ball);
        if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
            this._knownTime = -1;
        }
    };
    EliteActor.prototype._spide = function (data, posX, posY, count, i) {
        if (GameConfig.isPlaySound) {
            var channel = GameVoice.spideBall.play(0, 1);
            channel.volume = GameConfig.soundValue / 100;
        }
        PanelManager.gameScenePanel.createSummonActor(this, data, this._ePos, posX, posY, count, i);
    };
    EliteActor.prototype._eliteSummon = function () {
        if (GameManager.Instance.gameState == EGameState.Start && this._summonData != undefined) {
            var count = 0;
            if (this._summonData.count > 0)
                count = this._summonData.count;
            else
                count = MathUtils.getRandom(this._summonData.min, this._summonData.max);
            for (var i = 0; i < count; i++) {
                egret.setTimeout(this._spide, this, i * 200, this._summonData, this.x, this.y, count, i);
            }
        }
    };
    EliteActor.prototype._onArmatureFrame = function (event) {
        var evt = event.frameLabel;
        switch (evt) {
            case "vomit":
                if (this._isArrive)
                    return;
                if (this._data.Difficult == EMonsterDifficult.SpecialElite1) {
                    if (this._summonCount <= 0 && this._summonWave < this._data.Wave && !this._isExistKnown() && this.state == EMonsterState.Ready) {
                        this._summonWave += 1;
                        this._eliteSummon();
                    }
                }
                else {
                    if (this._knownTime > 0)
                        return;
                    this._eliteSummon();
                }
                break;
        }
    };
    EliteActor.prototype._changeToUnknown = function () {
        this._knownTime = -1;
        for (var i = 0; i < this.balloons.length; i++) {
            var ball = this.balloons[i];
            ball.changeToUnknown();
        }
    };
    EliteActor.prototype._changeToKnown = function () {
        if (this._data.Difficult == EMonsterDifficult.SpecialElite2) {
            this._knownTime = 0;
        }
        if (this._balloons[0] != null)
            this._balloons[0].changeToKnown();
    };
    EliteActor.prototype._isExistKnown = function () {
        for (var i = 0; i < this._balloons.length; i++) {
            if (this._balloons[i].type > 0) {
                return true;
            }
        }
        return false;
    };
    return EliteActor;
}(Monster));
__reflect(EliteActor.prototype, "EliteActor");
//# sourceMappingURL=EliteActor.js.map