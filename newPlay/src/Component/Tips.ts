
class Tips extends egret.DisplayObjectContainer {
	public constructor() {
		super()

		this._imgBg = new egret.Bitmap()
		this.addChild(this._imgBg)

		this._labDesc = new egret.TextField()
		this.addChild(this._labDesc)

		this._data = new TipsData()
	}

	public init() {
		this._imgBg.visible = false
		if (this._data.tipsBg.length > 0) {
			this._imgBg.texture = RES.getRes(this._data.tipsBg)
			this._imgBg.visible = true
		}

        this._labDesc.textColor = this._data.descColor
        this._labDesc.size = this._data.descSize
        
        this._labDesc.textAlign = "center";
        this._labDesc.text = this._data.desc
        this._labDesc.bold = true
	}

	public get data():TipsData {
		return this._data
	}


	private _data:TipsData
	private _imgBg:egret.Bitmap
	private _labDesc:egret.TextField
}

class TipsData {
	public constructor(){}

	public tipsBg:string = ""
    public desc:string = ""
    public descSize:number = 40
    public descColor:number = Common.TextColors.red
}