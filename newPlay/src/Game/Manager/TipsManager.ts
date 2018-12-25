enum ETipsType {
    None = 1,
    DownToUp,
}

namespace TipsManager {
    let _tips:Array<Tips> = []

    export function Show(a_str:string, a_color:number = Common.TextColors.red, a_type:ETipsType = ETipsType.DownToUp, a_size:number = 40, a_bg:string = "", a_x:number = Config.stageHalfWidth, a_y:number = Config.stageHalfHeight) {
        let tips:Tips = GameObjectPool.getInstance().createObject(Tips, "Tips")
        tips.data.desc = a_str
        tips.data.descColor = a_color
        tips.data.descSize = a_size
        tips.data.tipsBg = a_bg
        tips.Init()

        tips.anchorOffsetX = tips.width / 2
        tips.anchorOffsetY = tips.height / 2
        tips.x = a_x
        tips.y = a_y - 200

        _tips.push(tips)
        Common.gameScene().tipsLayer.addChild(tips)


        switch (a_type) {
            case ETipsType.None: {
                // TODO: Implement case content
                tips.alpha = 0;
                egret.Tween.get(tips).to({alpha:1},300).call(this.removeTips, this);  
                break;
            }
            case ETipsType.DownToUp: {
                tips.alpha = 0;
                tips.y += tips.height;
                egret.Tween.get(tips).to({alpha:1,y:tips.y - tips.height},500,egret.Ease.backOut).call(this.removeTips, this); 	                
                break;
            }
            // case 2: {
            // 	tip.alpha = 0;
            // 	tip.x -= tip.width;
            //     egret.Tween.get(tip).to({alpha:1,x:tip.x + tip.width},500,egret.Ease.backOut).call(this.removeTips, this); 
            //     break;
            // }
            // case 3: {
            // 	tip.alpha = 0;
            // 	tip.x += tip.width;
            //     egret.Tween.get(tip).to({alpha:1,x:tip.x - tip.width},500,egret.Ease.backOut).call(this.removeTips, this); 
            //     break;
            // }
            // default: {
            // }
        }
    }

    /**
    * 移除tips方法
    */
	export function removeTips():void{ 
		if(_tips != null && _tips.length > 0){
	        var onComplete:Function = function(){
				var tip = _tips.pop()
		        if(Common.gameScene().tipsLayer.contains(tip)){
					Common.gameScene().tipsLayer.removeChild(tip);
					GameObjectPool.getInstance().destroyObject(tip)
		        }
	        }; 
			egret.Tween.get(_tips).to({alpha:0},300).call(onComplete,this);      
		}	
	}
}