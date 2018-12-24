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

	/**获取账号 */
	export function GetAccount() {
		egret.ExternalInterface.addCallback("sendToEgret", function (message) {
            GameConfig.account = message
        })
        egret.ExternalInterface.call("read", GameConfig.game+"account")
	}

	/**更新账号到本机 */
	export function UpdateAccount(value:string) {
		GameConfig.account = value
		egret.ExternalInterface.call("write", GameConfig.game+"account:" + value)
	}

	/**获取历史最高分数 */
	export function GetMaxScore() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.maxScore = parseInt(message)
				}else{
					GameConfig.maxScore = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"maxScore")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"maxScore")
			if (score == null) {
				GameConfig.maxScore = 0
			}else{
				GameConfig.maxScore = parseInt(score)
			}
		}
	}

	/**更新历史最高分
	 * @param {value} 当前分数
	 */
	export function UpdateMaxScore(value:number) {
		if (value > GameConfig.maxScore) {
			GameConfig.maxScore = value
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"maxScore:" + value)
			}else{
				NativeApi.setLocalData(GameConfig.game+"maxScore", value.toString())
			}
		}
	}
}