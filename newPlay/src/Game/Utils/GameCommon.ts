namespace Common{
    var curScene:GameScene;
	//当前游戏场景类
	export function gameScene():GameScene{ 
		if(this.curScene == null){
			this.curScene = new GameScene();
		}
		return this.curScene;
	}
    //当前面板
	export var curPanel:BasePanel
}