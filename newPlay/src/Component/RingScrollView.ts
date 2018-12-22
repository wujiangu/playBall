class RingScrollView extends egret.DisplayObjectContainer {
	public constructor() {
		super()
	}

	/**
	 * 创建环形滚动
	 * @param content {RingContent} 单个滚动对象
	 * @param count {number} 滚动数量(最小3个)
	 */
	public Init(content:RingContent, count:number, ) {
		if (count < 3) {
			console.error("the content at least 3 count")
			return
		}
		let scrollView = new egret.ScrollView()
		this.addChild(scrollView)
		scrollView.height = content.height

		for (let i = 0; i < count; i++) {
			
		}
	}
}


class RingContent extends egret.DisplayObjectContainer {
	public constructor() {
		super()
	}

	public Init() {
		// this.m_imgBase = new egret.Bitmap()
        // let texture:egret.Texture = RES.getRes(name)
        // this.m_imgBase.texture = texture
	}

	public Update() {

	}

	
	private m_imgBase:egret.Bitmap
}