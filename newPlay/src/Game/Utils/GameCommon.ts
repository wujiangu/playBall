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


	export function isTowDataSame(date:string) {
		var isSame = false
		var curDate = new Date()
		var lastDate = new Date(date)
		if (curDate != null && lastDate != null) {
			let curYear = curDate.getFullYear()
			let lastYear = lastDate.getFullYear()
			let curMonth = curDate.getMonth()
			let lastMonth = lastDate.getMonth()
			let curDay = curDate.getDate()
			let lastDay = lastDate.getDate()
			if (curYear == lastYear && curMonth == lastMonth && curDay == lastDay) isSame = true
			let loginTime = getCurDateString(curDate)
			Common.updatelastLoginTime(loginTime)
		}
		return isSame
	}

	export function getCurDateString(date:Date) {
		let year = date.getFullYear()
		let month = date.getMonth() + 1
		let day = date.getDate()
		return year + "/" + month + "/" + day
	}

	/**获取账号 */
	export function getAccount() {
		egret.ExternalInterface.addCallback("sendToEgret", function (message) {
            GameConfig.account = message
        })
        egret.ExternalInterface.call("read", GameConfig.game+"account")
	}

	/**更新账号到本机 */
	export function updateAccount(value:string) {
		GameConfig.account = value
		egret.ExternalInterface.call("write", GameConfig.game+"account:" + value)
	}

	/**获取历史最高分数 */
	export function getMaxScore() {
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
	export function updateMaxScore(value:number) {
		if (value > GameConfig.maxScore) {
			GameConfig.maxScore = value
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"maxScore:" + value)
			}else{
				NativeApi.setLocalData(GameConfig.game+"maxScore", value.toString())
			}
		}
	}

	export function getGuide() {
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

	export function updateGuide(value:number) {
		GameConfig.guideIndex = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"guideIndex:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"guideIndex", value.toString())
		}
	}

	/**获取历史最高分数 */
	export function getMaxCombo() {
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
	export function updateMaxCombo(value:number) {
		if (value > GameConfig.maxCombo) {
			GameConfig.maxCombo = value
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"maxCombo:" + value)
			}else{
				NativeApi.setLocalData(GameConfig.game+"maxCombo", value.toString())
			}
		}
	}


	/**更新分数 */
	export function updateCurrentScore(value:number) {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("gameScore", value.toString())
		}else{
			// NativeApi.setLocalData(GameConfig.game+"itemUseTable", str)
		}
	}

	/**获取解锁宝宝表 */
	export function getUnlockBaby() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.babyUnlockList = JSON.parse(message)
				}else{
					GameConfig.babyUnlockList = new Array()
					GameConfig.babyUnlockList.push(10010)
					Common.updateUnlockBaby()
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"babyUnlockList")
		}
		else {
			let babyUnlockList = NativeApi.getLocalData(GameConfig.game+"babyUnlockList")
			if (babyUnlockList == null) {
				GameConfig.babyUnlockList = new Array()
				GameConfig.babyUnlockList.push(10010)
				Common.updateUnlockBaby()
			}else{
				GameConfig.babyUnlockList = JSON.parse(babyUnlockList)
			}
		}
	}

	/**更新解锁表 */
	export function updateUnlockBaby() {
		if (GameConfig.babyUnlockList.length > 0) {
			let str = JSON.stringify(GameConfig.babyUnlockList)
			if (!GameConfig.isWebView) {
				egret.ExternalInterface.call("write", GameConfig.game+"babyUnlockList:" + str)
			}else{
				NativeApi.setLocalData(GameConfig.game+"babyUnlockList", str)
			}
		}
	}

	/**获取当前的宝宝 */
	export function getCurBaby() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.curBaby = parseInt(message)
				}else{
					GameConfig.curBaby = 10010
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"curBaby")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"curBaby")
			if (score == null) {
				GameConfig.curBaby = 10010
			}else{
				GameConfig.curBaby = parseInt(score)
			}
		}
	}

	/**更新当前的宝宝 */
	export function updateCurBaby(value:number) {
		GameConfig.curBaby = value
		GameConfig.curBabyData = GameConfig.actorTable[value.toString()]
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"curBaby:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"curBaby", value.toString())
		}
	}

	/**获取当前的挑战章节进度 */
	export function getCurChpter() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.curChpter = parseInt(message)
				}else{
					GameConfig.curChpter = 1001
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"curChpter")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"curChpter")
			if (score == null) {
				GameConfig.curChpter = 1001
			}else{
				GameConfig.curChpter = parseInt(score)
			}
		}
	}

	/**更新当前的挑战章节进度 */
	export function updateCurChpter(value:number) {
		GameConfig.curChpter = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"curChpter:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"curChpter", value.toString())
		}
	}

	/**获取当前的挑战关卡进度 */
	export function getCurLevel() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.curLevel = parseInt(message)
				}else{
					GameConfig.curLevel = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"curLevel")
		}
		else {
			let score = NativeApi.getLocalData(GameConfig.game+"curLevel")
			if (score == null) {
				GameConfig.curLevel = 0
			}else{
				GameConfig.curLevel = parseInt(score)
			}
		}
	}

	/**更新当前的挑战关卡进度 */
	export function updateCurLevel(value:number) {
		GameConfig.curLevel = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"curLevel:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"curLevel", value.toString())
		}
	}

	/**获取当前的糖果 */
	export function getCurCandy() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.candy = parseInt(message)
				}else{
					GameConfig.candy = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"candy")
		}
		else {
			let candy = NativeApi.getLocalData(GameConfig.game+"candy")
			if (candy == null) {
				GameConfig.candy = 0
			}else{
				GameConfig.candy = parseInt(candy)
			}
		}
	}

	/**更新当前的糖果 */
	export function updateCurCandy(value:number) {
		GameConfig.candy += value
		GameConfig.candy = Math.max(0, GameConfig.candy)
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"candy:" + GameConfig.candy)
		}else{
			NativeApi.setLocalData(GameConfig.game+"candy", GameConfig.candy.toString())
		}
	}

	/**更新当前的糖果 */
	export function updateAfterBuyCurCandy(value:number) {
		GameConfig.candy = value
		GameConfig.candy = Math.max(0, GameConfig.candy)
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"candy:" + GameConfig.candy)
		}else{
			NativeApi.setLocalData(GameConfig.game+"candy", GameConfig.candy.toString())
		}
	}

	/**获取上次的登录时间 */
	export function getlastLoginTime() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.lastLoginTime = message
				}else{
					let date = new Date()
					GameConfig.lastLoginTime = getCurDateString(date)
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"lastLoginTime")
		}
		else {
			let lastLoginTime = NativeApi.getLocalData(GameConfig.game+"lastLoginTime")
			if (lastLoginTime == null) {
				let date = new Date()
				GameConfig.lastLoginTime = getCurDateString(date)
			}else{
				GameConfig.lastLoginTime = lastLoginTime
			}
		}
	}

	/**更新上次登录时间 */
	export function updatelastLoginTime(value:string) {
		GameConfig.lastLoginTime = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"lastLoginTime:" + value)
		}else{
			NativeApi.setLocalData(GameConfig.game+"lastLoginTime", value)
		}
	}


	/**获取签到标识 */
	export function getSign() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.sign = parseInt(message)
				}else{
					GameConfig.sign = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"sign")
		}
		else {
			let sign = NativeApi.getLocalData(GameConfig.game+"sign")
			if (sign == null) {
				GameConfig.sign = 0
			}else{
				GameConfig.sign = parseInt(sign)
			}
		}
	}

	/**更新当前签到标识 */
	export function updateSign(value:number) {
		GameConfig.sign = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"sign:" + GameConfig.sign)
		}else{
			NativeApi.setLocalData(GameConfig.game+"sign", GameConfig.sign.toString())
		}
	}


	/**获取签到标识 */
	export function getBabylistIndex() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.babylistIndex = parseInt(message)
				}else{
					GameConfig.babylistIndex = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"babylistIndex")
		}
		else {
			let babylistIndex = NativeApi.getLocalData(GameConfig.game+"babylistIndex")
			if (babylistIndex == null) {
				GameConfig.babylistIndex = 0
			}else{
				GameConfig.babylistIndex = parseInt(babylistIndex)
			}
		}
	}

	/**更新当前签到标识 */
	export function updateBabylistIndex(value:number) {
		GameConfig.babylistIndex = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"babylistIndex:" + GameConfig.babylistIndex)
		}else{
			NativeApi.setLocalData(GameConfig.game+"babylistIndex", GameConfig.babylistIndex.toString())
		}
	}


	/**获取签到天数 */
	export function getSignCount() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.signCount = parseInt(message)
				}else{
					GameConfig.signCount = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"signCount")
		}
		else {
			let signCount = NativeApi.getLocalData(GameConfig.game+"signCount")
			if (signCount == null) {
				GameConfig.signCount = 0
			}else{
				GameConfig.signCount = parseInt(signCount)
			}
		}
	}

	/**更新当前签到天数 */
	export function updateSignCount(value:number) {
		GameConfig.signCount = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"signCount:" + GameConfig.signCount)
		}else{
			NativeApi.setLocalData(GameConfig.game+"signCount", GameConfig.signCount.toString())
		}
	}

	/**是否刷新签到数据 */
	export function getIsSignData() {
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.addCallback("sendToEgret", function (message) {
				if (message != null && message.length > 0) {
					GameConfig.isSignData = parseInt(message)
				}else{
					GameConfig.isSignData = 0
				}
        	})
        	egret.ExternalInterface.call("read", GameConfig.game+"IsSignData")
		}
		else {
			let isSignData = NativeApi.getLocalData(GameConfig.game+"IsSignData")
			if (isSignData == null) {
				GameConfig.isSignData = 0
			}else{
				GameConfig.isSignData = parseInt(isSignData)
			}
		}
	}

	/**更新是否刷新签到数据 */
	export function updateIsSignData(value:number) {
		GameConfig.isSignData = value
		if (!GameConfig.isWebView) {
			egret.ExternalInterface.call("write", GameConfig.game+"IsSignData:" + GameConfig.isSignData)
		}else{
			NativeApi.setLocalData(GameConfig.game+"IsSignData", GameConfig.isSignData.toString())
		}
	}

}