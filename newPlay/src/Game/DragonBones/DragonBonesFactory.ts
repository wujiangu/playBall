/**
 * DragonBones工厂类
 */
class DragonBonesFactory {
    public constructor() {
        this._factory = new dragonBones.EgretFactory();
        this._clocks = new Array<dragonBones.WorldClock>();
        this._clockLen = 0;
    }

    public static getInstance():DragonBonesFactory {
        if (!this._instance) {
            this._instance = new DragonBonesFactory();
        }
        return this._instance;
    }


    /**
     * 添加动画所需要的资源
     * 
     */
    public addTextureAtlas(texture:egret.Texture, textureData:any):void {
        return this._factory.addTextureAtlas(new dragonBones.EgretTextureAtlas(texture, textureData));
    }

    /**
     * 初始化一个动画文件
     */
    public initDragonBonesArmatureFile(skeletonData:any, textureData:any, texture:egret.Texture):void {
        this._factory.parseDragonBonesData(skeletonData);
        this._factory.parseTextureAtlasData(textureData, texture);
        // this._factory.addSkeletonData(dragonBones.DataParser.parseDragonBonesData(skeletonData));
        // this.addTextureAtlas(texture, textureData);
    }

    /**
     * 创建一个动画
     */
    // public makeArmature(name:string, dragonBonesName?:string, playSpeed:number = -1):DragonBonesArmature {
    //     let armature:dragonBones.Armature = this._factory.buildArmature(name, dragonBonesName);
    //     if (!armature) {
    //         return null;
    //     }
    //     // let clock:dragonBones.WorldClock = this.createWorldClock(playSpeed);
    //     // let result:DragonBonesArmature = new DragonBonesArmature(armature, clock);
    //     return result;
    // }


    public buildArmature(name:string, dragonBonesName?:string) {
        return this._factory.buildArmature(name, dragonBonesName)
    }

    public buildArmatureDisplay(name:string, dragonBonesName?:string) {
        return this._factory.buildArmatureDisplay(name, dragonBonesName)
    }

    /**
     * 创建WorldClock
     */
    public createWorldClock(playSpeed:number):dragonBones.WorldClock {
        for (let i = 0; i < this._clockLen; i++) {
            if (this._clocks[i].timeScale == playSpeed) {
                return this._clocks[i]
            }
        }
        let clock:dragonBones.WorldClock = new dragonBones.WorldClock();
        clock.timeScale = playSpeed;
        this._clocks.push(clock);
        this._clockLen = this._clocks.length;
        return clock;
    }

    /**
     * 注册并启动一个定时器
     */
    public update(timeElapsed:number) {
        this.onStartTick(timeElapsed)
        // TimerManager.getInstance().doFrame(1, 0, this.onStartTick, this);
        // egret.startTick(this.onStartTick, this);
    }

    /**
     * 计时器回调
     */
    private onStartTick(timeStamp:number) {
        for (let i = 0; i < this._clocks.length; i++)
        {
            let clock:dragonBones.WorldClock = this._clocks[i];
            clock.advanceTime(0.001);
        }
        return false
    }

    /**
     * 停止计时器
     */
    public stopTimer() {
        // TimerManager.getInstance().removeAll();
        egret.stopTick(this.onStartTick, this);
    }

    /**
     * 清除计数器
     */
    // public removeTimer() {
    //     TimerManager.getInstance().removeAll();
    // }

    public static _instance:DragonBonesFactory;
    private _factory:dragonBones.EgretFactory;
    private _clocks:Array<dragonBones.WorldClock>;
    private _clockLen:number;
}