
class Tips extends egret.DisplayObjectContainer {
	public constructor() {
		super()

		this.m_imgBg = new egret.Bitmap()
		this.addChild(this.m_imgBg)

		this.m_labDesc = new egret.TextField()
		this.addChild(this.m_labDesc)

		this.m_data = new TipsData()
	}

	public Init() {
		this.m_imgBg.visible = false
		if (this.m_data.tipsBg.length > 0) {
			this.m_imgBg.texture = RES.getRes(this.m_data.tipsBg)
			this.m_imgBg.visible = true
		}

        this.m_labDesc.textColor = this.m_data.descColor
        this.m_labDesc.size = this.m_data.descSize
        
        this.m_labDesc.textAlign = "center";
        this.m_labDesc.text = this.m_data.desc
        this.m_labDesc.bold = true
	}

	public get data():TipsData {
		return this.m_data
	}


	private m_data:TipsData
	private m_imgBg:egret.Bitmap
	private m_labDesc:egret.TextField
}

class TipsData {
	public constructor(){}

	public tipsBg:string = ""
    public desc:string = ""
    public descSize:number = 40
    public descColor:number = Common.TextColors.red
}