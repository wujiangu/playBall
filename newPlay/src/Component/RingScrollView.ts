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
// [
//     {"difficult":-1, "type":1001,"path":"gestureSheet1_json.gesture1001","data":["3", "7"], "count":1, "balloon":"lv", "color":"0x1c5b52"},
//     {"difficult":-1, "type":1002,"path":"gestureSheet1_json.gesture1002","data":["1", "5"], "count":1, "balloon":"lv", "color":"0xcd4a81"},
//     {"difficult":1, "type":1003,"path":"gestureSheet1_json.gesture1003","data":["543218765"], "count":1, "balloon":"lan", "color":"0x877a5d"},
//     {"difficult":1, "type":1004,"path":"gestureSheet1_json.gesture1004","data":["321", "567"], "count":1, "balloon":"huang", "color":"0x877a5d"},
//     {"difficult":1, "type":1005,"path":"gestureSheet1_json.gesture1005","data":["187", "345"], "count":1, "balloon":"hong", "color":"0x877a5d"},
//     {"difficult":1, "type":1006,"path":"gestureSheet1_json.gesture1006","data":["781", "543"], "count":1, "balloon":"hong", "color":"0x877a5d"},
//     {"difficult":2, "type":1007,"path":"gestureSheet_json.gesture005","data":["141", "585"], "count":1, "balloon":"hong", "color":"0x877a5d"},
//     {"difficult":1, "type":1008,"path":"gestureSheet1_json.gesture1008","data":["123", "765"], "count":1, "balloon":"hong", "color":"0x877a5d"},
//     {"difficult":2, "type":2001,"path":"gestureSheet1_json.gesture2001","data":["2345678"], "count":2, "balloon":"lan", "color":"0xaa69e9"},
//     {"difficult":2, "type":2002,"path":"gestureSheet1_json.gesture2002","data":["78123", "76543"], "count":2, "balloon":"lan", "color":"0xaa69e9"},
//     {"difficult":2, "type":2003,"path":"gestureSheet1_json.gesture2003","data":["3456781"], "count":2, "balloon":"lan", "color":"0xaa69e9"},
//     {"difficult":2, "type":2005,"path":"gestureSheet1_json.gesture2005","data":["7812345", "1876543"], "count":2, "balloon":"lan", "color":"0xaa69e9"},
//     {"difficult":2, "type":2006,"path":"gestureSheet1_json.gesture2006","data":["7654321", "5678123"], "count":2, "balloon":"lan", "color":"0xaa69e9"},
//     {"difficult":3, "type":3001,"path":"gestureSheet_json.gesture102","data":["1875431345681"], "count":2, "balloon":"hong", "color":"0xaa69e9"},
//     {"difficult":3, "type":3002,"path":"gestureSheet_json.gesture103","data":["764321876543"], "count":2, "balloon":"zi", "color":"0xaa69e9"},
//     {"difficult":3, "type":3003,"path":"gestureSheet_json.gesture105","data":["3456781876543"], "count":2, "balloon":"zi", "color":"0xaa69e9"},
//     {"difficult":3, "type":3004,"path":"gestureSheet_json.gesture106","data":["1234567812345"], "count":2, "balloon":"zi", "color":"0xaa69e9"}
// ]