namespace Common{
    export var curScene:GameScene;
	//当前游戏场景类
	export function gameScene():GameScene{ 
		if(curScene == null){
			curScene = new GameScene();
		}
		return curScene
	}
    //当前面板
	export var curPanel:BasePanel

	function onTouchBegin() {
		GameVoice.btnSound.play(0, 1).volume = GameConfig.soundValue / 100
	}

	export function addTouchBegin(target:eui.Button) {
		target.addEventListener(egret.TouchEvent.TOUCH_BEGIN, onTouchBegin, Common)
	}


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
	 * @param value 当前分数
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

	export function GetGuide() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.guideIndex = parseInt(message)
				}else{
					GameConfig.guideIndex = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"guideIndex")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"guideIndex")
			if (score == null) {
				GameConfig.guideIndex = 0
			}else{
				GameConfig.guideIndex = parseInt(score)
			}
		}
	}

	export function UpdateGuide(value:number) {
		GameConfig.guideIndex = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"guideIndex:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"guideIndex", value.toString())
		}
	}

	/**获取历史最高分数 */
	export function GetMaxCombo() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.maxCombo = parseInt(message)
				}else{
					GameConfig.maxCombo = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"maxCombo")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"maxCombo")
			if (score == null) {
				GameConfig.maxCombo = 0
			}else{
				GameConfig.maxCombo = parseInt(score)
			}
		}
	}

	/**更新历史最高分
	 * @param value 当前分数
	 */
	export function UpdateMaxCombo(value:number) {
		if (value > GameConfig.maxCombo) {
			GameConfig.maxCombo = value
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"maxCombo:" + value)
			}else{
				NativeApi.setLocalData(GameConfig.game+"maxCombo", value.toString())
			}
		}
	}

	/**获取当前使用道具 */
	export function GetItem() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.itemUse = parseInt(message)
				}else{
					GameConfig.itemUse = -1
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"itemUse")
		}
		else {
			let itemUse = NativeApi.getLocalData(GameConfig.game+"itemUse")
			if (itemUse == null) {
				GameConfig.itemUse = -1
			}else{
				// GameConfig.maxScore = parseInt(score)
				GameConfig.itemUse = parseInt(itemUse)
			}
		}
	}

	/**更新当前使用道具 */
	export function UpdateItem(value:number) {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"itemUse:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"itemUse", value.toString())
		}
	}

	/**
	 * 获取使用道具表
	 */
	export function GetUseItem() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.itemUseTable = JSON.parse(message)
					// GameConfig.maxScore = parseInt(message)
				}else{
					GameConfig.itemUseTable = new Array()
					GameConfig.itemUseTable.push(1003)
					Common.UpdateUseItem()
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"itemUseTable")
		}
		else {
			let itemUseTable = NativeApi.getLocalData(GameConfig.game+"itemUseTable")
			if (itemUseTable == null) {
				GameConfig.itemUseTable = new Array()
				GameConfig.itemUseTable.push(1003)
				Common.UpdateUseItem()
			}else{
				// GameConfig.maxScore = parseInt(score)
				GameConfig.itemUseTable = JSON.parse(itemUseTable)
			}
		}
	}

	/**更新道具列表 */
	export function UpdateUseItem() {
		if (GameConfig.itemUseTable.length > 0) {
			let str = JSON.stringify(GameConfig.itemUseTable)
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"itemUseTable:" + str)
			}else{
				NativeApi.setLocalData(GameConfig.game+"itemUseTable", str)
			}
		}
	}


	/**
	 * 获取解锁道具表
	 */
	export function GetUnlockItem() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.itemUnlockList = JSON.parse(message)
					// GameConfig.maxScore = parseInt(message)
				}else{
					GameConfig.itemUnlockList = new Array()
					GameConfig.itemUnlockList.push(1003)
					Common.UpdateUnlockItem()
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"itemUnlockList")
		}
		else {
			let itemUnlockList = NativeApi.getLocalData(GameConfig.game+"itemUnlockList")
			if (itemUnlockList == null) {
				GameConfig.itemUnlockList = new Array()
				GameConfig.itemUnlockList.push(1003)
				Common.UpdateUnlockItem()
			}else{
				// GameConfig.maxScore = parseInt(score)
				GameConfig.itemUnlockList = JSON.parse(itemUnlockList)
			}
		}
	}

	/**更新解锁道具列表 */
	export function UpdateUnlockItem() {
		if (GameConfig.itemUnlockList.length > 0) {
			let str = JSON.stringify(GameConfig.itemUnlockList)
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"itemUnlockList:" + str)
			}else{
				NativeApi.setLocalData(GameConfig.game+"itemUnlockList", str)
			}
		}
	}

	/**更新分数 */
	export function UpdateCurrentScore(value:number) {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("gameScore", value.toString())
		}else{
			// NativeApi.setLocalData(GameConfig.game+"itemUseTable", str)
		}
	}
}