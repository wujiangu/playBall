//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

     public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
        this.CreatLoadingUI()
    }

    private CreatLoadingUI():void {
        // this.createBgGradientFill()
        Animations.fadeOut(this)
        let bg = Common.createBitmap("loadBg_png")
        bg.width = Config.stageWidth
        bg.height = Config.stageHeight
        this.addChild(bg)
        

        GameConfig.initBattleDragonBones("huoyedoudong")
        this.armatureContainer = new DragonBonesArmatureContainer()
        this.addChild(this.armatureContainer)
        let armatureDisplay = DragonBonesFactory.getInstance().buildArmatureDisplay("huoyedoudong", "huoyedoudong")
        let armature = new DragonBonesArmature(armatureDisplay)
		armature.ArmatureDisplay = armatureDisplay
		this.armatureContainer.register(armature, ["huoyedoudong"])
        this.armatureContainer.x = bg.width / 2 - 15
        this.armatureContainer.y = Config.stageHalfHeight * 0.65
        this.armatureContainer.play("huoyedoudong", 0)



        var container:egret.Sprite=new egret.Sprite()
        this.addChild(container);
        var sw:number=Config.stageWidth
        var sh:number=Config.stageHeight
        var w:number=80;
        let loadbg = Common.createBitmap("loading_04_png")
        loadbg.x=(sw-loadbg.width)>>1;
        loadbg.y=(sh-loadbg.height)>>1;
        container.addChild(loadbg);

        let progress = Common.createBitmap("loading_02_png")
        progress.x=(sw-progress.width)>>1;
        progress.y=(sh-progress.height)>>1;
        container.addChild(progress);
        this.proWidth=progress.width;
        this.progress=progress;
        var txtbg:Common.MoonDisplayObject=new Common.MoonDisplayObject();
        txtbg.type=Common.Const.SHAPE_CIRCLE
        txtbg.data={r:w/2,c:0XE18E0D};
        txtbg.setBackground(0XFFFFFF,5);
        this.addChild(txtbg);
        txtbg.x=loadbg.x+loadbg.width-w/2;
        txtbg.y=loadbg.y+w/2 -10;
        this.txtLoadPos=new egret.Point(txtbg.x, txtbg.y);
        
        var txtExp:egret.TextField=Common.createText("", 0, 0, 40, 0x000000);
        this.txtLoad=txtExp;
        this.addChild(txtExp)
        this.createAirFan();
        this.airFan.x=this.txtLoadPos.x
        this.airFan.y=this.txtLoadPos.y

        this.update(0);
        this.play()
    }

    public updateName(name:string):void
    {
        // this.txtName.text=name;
        // this.txtName.x=(Config.stageWidth-this.txtName.width)>>1;
        // this.txtName.y=Config.stageHeight/2+this.txtName.height*2;
    }

    protected createLogo():void
    {
        var sw:number=Config.stageWidth
        var sh:number=Config.stageHeight
        var logo:Common.MoonDisplayObject=new Common.MoonDisplayObject();
        logo.type=Common.Const.SHAPE_CIRCLE;
        logo.data={r:50,c:0XE18E0D};
        logo.setBackground(0XFFFFFF,2);
        logo.x=sw>>1;
        logo.y=logo.height;
        this.addChild(logo);

        var txtName:egret.TextField=Common.createText("GALE", 0, 0);
        txtName.size=40;
        txtName.x=logo.x-(txtName.width>>1);
        txtName.y=logo.y-(txtName.height>>1)-15;
        this.addChild(txtName)

        txtName=Common.createText("GAME", 0, 0);
        txtName.size=30;
        txtName.x=logo.x-(txtName.width>>1);
        txtName.y=logo.y-(txtName.height>>1)+15;
        this.addChild(txtName)

        txtName=Common.createText("孢子游戏", 0, 0);
        txtName.size=40;
        txtName.textColor=0XE09F21;
        txtName.x=sw-txtName.width-10;
        txtName.y=sh-txtName.height-10;
        this.addChild(txtName)

    }

    private createAirFan():void
    {
        this.airFan=new egret.Sprite()
        this.addChild(this.airFan);
        for (var i:number=0; i<4; i++)  
        {  
            var shape:egret.Sprite=new egret.Sprite();  
            this.airFan.addChild(shape);  
            shape.graphics.lineStyle(0);  
            shape.graphics.beginFill(0xFFFFFF);  
            shape.graphics.cubicCurveTo(-29,-28,29,-28,0,0);  
            shape.graphics.endFill();  
            shape.rotation = i * 90;  
        }  
    }

    public update(value:number):void
    {
        if(value>=1) {
            return;
        }
        if(value>0.99) {
            this.stop();
            
        }
        this.progress.width = 500 * value
        var txtExp:egret.TextField=this.txtLoad;
        var pos:egret.Point=this.txtLoadPos;
        txtExp.text=Math.ceil(value*100)+"%";
        txtExp.x=(Config.stageWidth-txtExp.width)>>1;
        txtExp.y=pos.y-txtExp.height/2;
        var exp:egret.Sprite=Common.getCircle(5+Math.random()*5,this.color,pos.x,pos.y);
        exp.y=10-Math.random()*20;
        this.addChildAt(exp,2);
        egret.Tween.get(exp).to({x:-this.proWidth,alpha:0},1000);
    }

    protected play():void
    {
        this.stop();
        egret.startTick(this.loop, this);
    }

    protected stop():void
    {
        egret.stopTick(this.loop, this);
    }

    protected loop(n:number):boolean
    {
        this.airFan.rotation+=3;
        return true;
    }

    private addToStage():void {
        this.removeEventListener(egret.Event.ADDED_TO_STAGE,this.addToStage,this);
        
    }

    public onProgress(current: number, total: number): void {
        this.update(current/total)
        // this.gameLoad.update(current/total);
    }


    /**创建渐变色背景 */
    protected createBgGradientFill(c1:number=0XFDD559,c2:number=0XE09F21):egret.Sprite
    {
        var w:number=Config.stageWidth
        var h:number=Config.stageHeight
        var matrix:egret.Matrix = new egret.Matrix();
        matrix.createGradientBox(w*2,h*2,Math.PI/2);
        var sprite:egret.Sprite=new egret.Sprite()
        sprite.graphics.beginGradientFill(egret.GradientType.RADIAL,[c1,c2],[1,1],[0,255],matrix);
        sprite.graphics.drawRect(0,0,w,h);
        this.addChild(sprite);
        return sprite;
    }

    private armatureContainer:DragonBonesArmatureContainer
    private txtLoad:egret.TextField;
    // private txtName:egret.TextField;
    // private progress:egret.Sprite;
    private progress:egret.Bitmap;
    private txtLoadPos:egret.Point;
    private color:number=0XF9AB03;
    private proWidth:number;
    private airFan:egret.Sprite;

    
}
