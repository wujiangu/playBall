var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * DragonBones工厂类
 */
var DragonBonesFactory = (function () {
    function DragonBonesFactory() {
        this.factory = new dragonBones.EgretFactory();
        this.clocks = new Array();
        this.clockLen = 0;
    }
    DragonBonesFactory.getInstance = function () {
        if (!this._instance) {
            this._instance = new DragonBonesFactory();
        }
        return this._instance;
    };
    /**
     * 添加动画所需要的资源
     *
     */
    DragonBonesFactory.prototype.addTextureAtlas = function (texture, textureData) {
        return this.factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    };
    /**
     * 初始化一个动画文件
     */
    DragonBonesFactory.prototype.initDragonBonesArmatureFile = function (skeletonData, textureData, texture) {
        this.factory.parseDragonBonesData(skeletonData);
        this.factory.parseTextureAtlasData(textureData, texture);
        // this.factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        // this.addTextureAtlas(texture, textureData);
    };
    /**
     * 创建一个动画
     */
    // public makeArmature(name:string, dragonBonesName?:string, playSpeed:number = -1):DragonBonesArmature {
    //     let armature:dragonBones.Armature = this.factory.buildArmature(name, dragonBonesName);
    //     if (!armature) {
    //         return null;
    //     }
    //     // let clock:dragonBones.WorldClock = this.createWorldClock(playSpeed);
    //     // let result:DragonBonesArmature = new DragonBonesArmature(armature, clock);
    //     return result;
    // }
    DragonBonesFactory.prototype.buildArmature = function (name, dragonBonesName) {
        return this.factory.buildArmature(name, dragonBonesName);
    };
    DragonBonesFactory.prototype.buildArmatureDisplay = function (name, dragonBonesName) {
        return this.factory.buildArmatureDisplay(name, dragonBonesName);
    };
    /**
     * 创建WorldClock
     */
    DragonBonesFactory.prototype.createWorldClock = function (playSpeed) {
        for (var i = 0; i < this.clockLen; i++) {
            if (this.clocks[i].timeScale == playSpeed) {
                return this.clocks[i];
            }
        }
        var clock = new dragonBones.WorldClock();
        clock.timeScale = playSpeed;
        this.clocks.push(clock);
        this.clockLen = this.clocks.length;
        return clock;
    };
    /**
     * 注册并启动一个定时器
     */
    DragonBonesFactory.prototype.Update = function (timeElapsed) {
        this.onStartTick(timeElapsed);
        // TimerManager.getInstance().doFrame(1, 0, this.onStartTick, this);
        // egret.startTick(this.onStartTick, this);
    };
    /**
     * 计时器回调
     */
    DragonBonesFactory.prototype.onStartTick = function (timeStamp) {
        for (var i = 0; i < this.clocks.length; i++) {
            var clock = this.clocks[i];
            clock.advanceTime(0.001);
        }
        return false;
    };
    /**
     * 停止计时器
     */
    DragonBonesFactory.prototype.stopTimer = function () {
        // TimerManager.getInstance().removeAll();
        egret.stopTick(this.onStartTick, this);
    };
    return DragonBonesFactory;
}());
__reflect(DragonBonesFactory.prototype, "DragonBonesFactory");
