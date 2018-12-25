class GameConfig {
	public static game = "HT"
	public static isWebView = true
	public static monsterConfig:Array<any>
	public static gestureConfig:Array<any>
	public static itemConfig:Array<any>


	public static itemTable:any
	public static itemUseTable:Array<number>

	public static gestureType:number
	public static baseFallSpeed:number = 0.1

	public static monsterAddDelay:number = 1500

	public static account:string
	public static curScore:number
	public static maxScore:number

	public static Init() {
		this.itemConfig = RES.getRes("itemConfig_json")
		this.itemTable = {}
		this.itemUseTable = new Array()

		for (let i = 0; i < this.itemConfig.length; i++) {
			let config = this.itemConfig[i]
			let data = {}
			data["ID"] = config.ID
			data["Name"] = config.Name
			data["Desc"] = config.Desc
			data["GrayIcon"] = config.GrayIcon
			data["Icon"] = config.Icon
			
			data["IsUse"] = 0
			this.itemTable[config.ID.toString()] = data
		}
	}
}