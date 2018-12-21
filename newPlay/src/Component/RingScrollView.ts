class RingScrollView extends egret.DisplayObjectContainer {
	public constructor() {
		super()
	}

	/**
	 * 创建环形滚动
	 * @param content {egret.DisplayObject} 单个滚动对象
	 * @param count {number} 滚动数量(最小3个)
	 */
	public Init(content:egret.DisplayObject, count:number, ) {
		if (count < 3) {
			console.error("the content at least 3 count")
			return
		}
		let scrollView = new egret.ScrollView()
		this.addChild(scrollView)
		scrollView.height = content.height

		// for (let i = 0; i < count; i++) {
		// 	let newContent = new egret.DisplayObject()
		// 	newContent = content
		// 	scrollView.setContent(newContent)
		// 	newContent.x
		// }
	}

	private 
}