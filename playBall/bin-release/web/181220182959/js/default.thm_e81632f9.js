window.skins={};
                function __extends(d, b) {
                    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
                        function __() {
                            this.constructor = d;
                        }
                    __.prototype = b.prototype;
                    d.prototype = new __();
                };
                window.generateEUI = {};
                generateEUI.paths = {};
                generateEUI.styles = undefined;
                generateEUI.skins = {"eui.Button":"resource/eui_skins/ButtonSkin.exml","eui.CheckBox":"resource/eui_skins/CheckBoxSkin.exml","eui.HScrollBar":"resource/eui_skins/HScrollBarSkin.exml","eui.HSlider":"resource/eui_skins/HSliderSkin.exml","eui.Panel":"resource/eui_skins/PanelSkin.exml","eui.TextInput":"resource/eui_skins/TextInputSkin.exml","eui.ProgressBar":"resource/eui_skins/ProgressBarSkin.exml","eui.RadioButton":"resource/eui_skins/RadioButtonSkin.exml","eui.Scroller":"resource/eui_skins/ScrollerSkin.exml","eui.ToggleSwitch":"resource/eui_skins/ToggleSwitchSkin.exml","eui.VScrollBar":"resource/eui_skins/VScrollBarSkin.exml","eui.VSlider":"resource/eui_skins/VSliderSkin.exml","eui.ItemRenderer":"resource/eui_skins/ItemRendererSkin.exml"};generateEUI.paths['resource/eui_skins/ButtonSkin.exml'] = window.skins.ButtonSkin = (function (_super) {
	__extends(ButtonSkin, _super);
	function ButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay","iconDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i(),this.iconDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
	}
	var _proto = ButtonSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	_proto.iconDisplay_i = function () {
		var t = new eui.Image();
		this.iconDisplay = t;
		t.horizontalCenter = 0;
		t.verticalCenter = 0;
		return t;
	};
	return ButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/CheckBoxSkin.exml'] = window.skins.CheckBoxSkin = (function (_super) {
	__extends(CheckBoxSkin, _super);
	function CheckBoxSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","checkbox_select_disabled_png")
				])
		];
	}
	var _proto = CheckBoxSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "checkbox_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return CheckBoxSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/gamePower.exml'] = window.gamePower = (function (_super) {
	__extends(gamePower, _super);
	function gamePower() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = gamePower.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "loading_04_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "loading_02_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		t.visible = false;
		return t;
	};
	return gamePower;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HScrollBarSkin.exml'] = window.skins.HScrollBarSkin = (function (_super) {
	__extends(HScrollBarSkin, _super);
	function HScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = HScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 8;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.verticalCenter = 0;
		t.width = 30;
		return t;
	};
	return HScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/HSliderSkin.exml'] = window.skins.HSliderSkin = (function (_super) {
	__extends(HSliderSkin, _super);
	function HSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 8;
		this.minWidth = 20;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = HSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.height = 6;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_sb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.source = "thumb_png";
		t.verticalCenter = 0;
		return t;
	};
	return HSliderSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ItemRendererSkin.exml'] = window.skins.ItemRendererSkin = (function (_super) {
	__extends(ItemRendererSkin, _super);
	function ItemRendererSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.minHeight = 50;
		this.minWidth = 100;
		this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","button_down_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
		];
		
		eui.Binding.$bindProperties(this, ["hostComponent.data"],[0],this.labelDisplay,"text");
	}
	var _proto = ItemRendererSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.bottom = 8;
		t.fontFamily = "Tahoma";
		t.left = 8;
		t.right = 8;
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0xFFFFFF;
		t.top = 8;
		t.verticalAlign = "middle";
		return t;
	};
	return ItemRendererSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/PanelSkin.exml'] = window.skins.PanelSkin = (function (_super) {
	__extends(PanelSkin, _super);
	function PanelSkin() {
		_super.call(this);
		this.skinParts = ["titleDisplay","moveArea","closeButton"];
		
		this.minHeight = 230;
		this.minWidth = 450;
		this.elementsContent = [this._Image1_i(),this.moveArea_i(),this.closeButton_i()];
	}
	var _proto = PanelSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.scale9Grid = new egret.Rectangle(2,2,12,12);
		t.source = "border_png";
		t.top = 0;
		return t;
	};
	_proto.moveArea_i = function () {
		var t = new eui.Group();
		this.moveArea = t;
		t.height = 45;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.elementsContent = [this._Image2_i(),this.titleDisplay_i()];
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "header_png";
		t.top = 0;
		return t;
	};
	_proto.titleDisplay_i = function () {
		var t = new eui.Label();
		this.titleDisplay = t;
		t.fontFamily = "Tahoma";
		t.left = 15;
		t.right = 5;
		t.size = 20;
		t.textColor = 0xFFFFFF;
		t.verticalCenter = 0;
		t.wordWrap = false;
		return t;
	};
	_proto.closeButton_i = function () {
		var t = new eui.Button();
		this.closeButton = t;
		t.bottom = 5;
		t.horizontalCenter = 0;
		t.label = "close";
		return t;
	};
	return PanelSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ProgressBarSkin.exml'] = window.skins.ProgressBarSkin = (function (_super) {
	__extends(ProgressBarSkin, _super);
	function ProgressBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb","labelDisplay"];
		
		this.minHeight = 18;
		this.minWidth = 30;
		this.elementsContent = [this._Image1_i(),this.thumb_i(),this.labelDisplay_i()];
	}
	var _proto = ProgressBarSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_pb_png";
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.percentHeight = 100;
		t.source = "thumb_pb_png";
		t.percentWidth = 100;
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.horizontalCenter = 0;
		t.size = 15;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		t.verticalCenter = 0;
		return t;
	};
	return ProgressBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/RadioButtonSkin.exml'] = window.skins.RadioButtonSkin = (function (_super) {
	__extends(RadioButtonSkin, _super);
	function RadioButtonSkin() {
		_super.call(this);
		this.skinParts = ["labelDisplay"];
		
		this.elementsContent = [this._Group1_i()];
		this.states = [
			new eui.State ("up",
				[
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","alpha",0.7)
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","alpha",0.5)
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_up_png")
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_down_png")
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image1","source","radiobutton_select_disabled_png")
				])
		];
	}
	var _proto = RadioButtonSkin.prototype;

	_proto._Group1_i = function () {
		var t = new eui.Group();
		t.percentHeight = 100;
		t.percentWidth = 100;
		t.layout = this._HorizontalLayout1_i();
		t.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
		return t;
	};
	_proto._HorizontalLayout1_i = function () {
		var t = new eui.HorizontalLayout();
		t.verticalAlign = "middle";
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.alpha = 1;
		t.fillMode = "scale";
		t.source = "radiobutton_unselect_png";
		return t;
	};
	_proto.labelDisplay_i = function () {
		var t = new eui.Label();
		this.labelDisplay = t;
		t.fontFamily = "Tahoma";
		t.size = 20;
		t.textAlign = "center";
		t.textColor = 0x707070;
		t.verticalAlign = "middle";
		return t;
	};
	return RadioButtonSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ScrollerSkin.exml'] = window.skins.ScrollerSkin = (function (_super) {
	__extends(ScrollerSkin, _super);
	function ScrollerSkin() {
		_super.call(this);
		this.skinParts = ["horizontalScrollBar","verticalScrollBar"];
		
		this.minHeight = 20;
		this.minWidth = 20;
		this.elementsContent = [this.horizontalScrollBar_i(),this.verticalScrollBar_i()];
	}
	var _proto = ScrollerSkin.prototype;

	_proto.horizontalScrollBar_i = function () {
		var t = new eui.HScrollBar();
		this.horizontalScrollBar = t;
		t.bottom = 0;
		t.percentWidth = 100;
		return t;
	};
	_proto.verticalScrollBar_i = function () {
		var t = new eui.VScrollBar();
		this.verticalScrollBar = t;
		t.percentHeight = 100;
		t.right = 0;
		return t;
	};
	return ScrollerSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/TextInputSkin.exml'] = window.skins.TextInputSkin = (function (_super) {
	__extends(TextInputSkin, _super);
	function TextInputSkin() {
		_super.call(this);
		this.skinParts = ["textDisplay","promptDisplay"];
		
		this.minHeight = 40;
		this.minWidth = 300;
		this.elementsContent = [this._Image1_i(),this._Rect1_i(),this.textDisplay_i()];
		this.promptDisplay_i();
		
		this.states = [
			new eui.State ("normal",
				[
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("textDisplay","textColor",0xff0000)
				])
			,
			new eui.State ("normalWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
			,
			new eui.State ("disabledWithPrompt",
				[
					new eui.AddItems("promptDisplay","",1,"")
				])
		];
	}
	var _proto = TextInputSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.percentHeight = 100;
		t.scale9Grid = new egret.Rectangle(1,3,8,8);
		t.source = "button_up_png";
		t.percentWidth = 100;
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.fillColor = 0xffffff;
		t.percentHeight = 100;
		t.percentWidth = 100;
		return t;
	};
	_proto.textDisplay_i = function () {
		var t = new eui.EditableText();
		this.textDisplay = t;
		t.height = 24;
		t.left = "10";
		t.right = "10";
		t.size = 20;
		t.textColor = 0x000000;
		t.verticalCenter = "0";
		t.percentWidth = 100;
		return t;
	};
	_proto.promptDisplay_i = function () {
		var t = new eui.Label();
		this.promptDisplay = t;
		t.height = 24;
		t.left = 10;
		t.right = 10;
		t.size = 20;
		t.textColor = 0xa9a9a9;
		t.touchEnabled = false;
		t.verticalCenter = 0;
		t.percentWidth = 100;
		return t;
	};
	return TextInputSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/ToggleSwitchSkin.exml'] = window.skins.ToggleSwitchSkin = (function (_super) {
	__extends(ToggleSwitchSkin, _super);
	function ToggleSwitchSkin() {
		_super.call(this);
		this.skinParts = [];
		
		this.elementsContent = [this._Image1_i(),this._Image2_i()];
		this.states = [
			new eui.State ("up",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("down",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("disabled",
				[
					new eui.SetProperty("_Image1","source","off_png")
				])
			,
			new eui.State ("upAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("downAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
			,
			new eui.State ("disabledAndSelected",
				[
					new eui.SetProperty("_Image2","horizontalCenter",18)
				])
		];
	}
	var _proto = ToggleSwitchSkin.prototype;

	_proto._Image1_i = function () {
		var t = new eui.Image();
		this._Image1 = t;
		t.source = "on_png";
		return t;
	};
	_proto._Image2_i = function () {
		var t = new eui.Image();
		this._Image2 = t;
		t.horizontalCenter = -18;
		t.source = "handle_png";
		t.verticalCenter = 0;
		return t;
	};
	return ToggleSwitchSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VScrollBarSkin.exml'] = window.skins.VScrollBarSkin = (function (_super) {
	__extends(VScrollBarSkin, _super);
	function VScrollBarSkin() {
		_super.call(this);
		this.skinParts = ["thumb"];
		
		this.minHeight = 20;
		this.minWidth = 8;
		this.elementsContent = [this.thumb_i()];
	}
	var _proto = VScrollBarSkin.prototype;

	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.height = 30;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(3,3,2,2);
		t.source = "roundthumb_png";
		t.width = 8;
		return t;
	};
	return VScrollBarSkin;
})(eui.Skin);generateEUI.paths['resource/eui_skins/VSliderSkin.exml'] = window.skins.VSliderSkin = (function (_super) {
	__extends(VSliderSkin, _super);
	function VSliderSkin() {
		_super.call(this);
		this.skinParts = ["track","thumb"];
		
		this.minHeight = 30;
		this.minWidth = 25;
		this.elementsContent = [this.track_i(),this.thumb_i()];
	}
	var _proto = VSliderSkin.prototype;

	_proto.track_i = function () {
		var t = new eui.Image();
		this.track = t;
		t.percentHeight = 100;
		t.horizontalCenter = 0;
		t.scale9Grid = new egret.Rectangle(1,1,4,4);
		t.source = "track_png";
		t.width = 7;
		return t;
	};
	_proto.thumb_i = function () {
		var t = new eui.Image();
		this.thumb = t;
		t.horizontalCenter = 0;
		t.source = "thumb_png";
		return t;
	};
	return VSliderSkin;
})(eui.Skin);generateEUI.paths['resource/game_skins/backpackPanel.exml'] = window.backpackPanel = (function (_super) {
	__extends(backpackPanel, _super);
	function backpackPanel() {
		_super.call(this);
		this.skinParts = ["m_imgBg","m_imgMaskBg","m_imgCurtain","m_imgLine","m_labItemName","m_labItemDesc","m_btnReturn","m_btnRight","m_btnLeft","m_btnUse","m_itemCenter","m_itemLeft","m_itemRight"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.m_imgBg_i(),this.m_imgMaskBg_i(),this.m_imgCurtain_i(),this.m_imgLine_i(),this.m_labItemName_i(),this.m_labItemDesc_i(),this.m_btnReturn_i(),this.m_btnRight_i(),this.m_btnLeft_i(),this.m_btnUse_i(),this.m_itemCenter_i(),this.m_itemLeft_i(),this.m_itemRight_i()];
	}
	var _proto = backpackPanel.prototype;

	_proto.m_imgBg_i = function () {
		var t = new eui.Image();
		this.m_imgBg = t;
		t.bottom = 0;
		t.height = 1394;
		t.horizontalCenter = 0;
		t.source = "backBg2_jpg";
		t.width = 640;
		return t;
	};
	_proto.m_imgMaskBg_i = function () {
		var t = new eui.Image();
		this.m_imgMaskBg = t;
		t.height = 1050;
		t.horizontalCenter = 0;
		t.source = "backBg2_png";
		t.top = 0;
		t.visible = false;
		t.width = 640;
		t.x = 10;
		t.y = 10;
		return t;
	};
	_proto.m_imgCurtain_i = function () {
		var t = new eui.Image();
		this.m_imgCurtain = t;
		t.bottom = 135;
		t.height = 1240;
		t.horizontalCenter = 0;
		t.source = "common1_png";
		t.width = 640;
		return t;
	};
	_proto.m_imgLine_i = function () {
		var t = new eui.Image();
		this.m_imgLine = t;
		t.height = 50;
		t.horizontalCenter = 0;
		t.source = "backBg5_png";
		t.top = -22;
		t.width = 840;
		t.x = 50;
		return t;
	};
	_proto.m_labItemName_i = function () {
		var t = new eui.Label();
		this.m_labItemName = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft JhengHei";
		t.height = 39;
		t.horizontalCenter = 3.5;
		t.text = "名字";
		t.textAlign = "center";
		t.verticalAlign = "middle";
		t.verticalCenter = -7.5;
		t.width = 363;
		return t;
	};
	_proto.m_labItemDesc_i = function () {
		var t = new eui.Label();
		this.m_labItemDesc = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft JhengHei";
		t.height = 108;
		t.horizontalCenter = 0.5;
		t.size = 20;
		t.text = "说明";
		t.textAlign = "left";
		t.verticalAlign = "top";
		t.verticalCenter = 66;
		t.width = 455;
		return t;
	};
	_proto.m_btnReturn_i = function () {
		var t = new eui.Button();
		this.m_btnReturn = t;
		t.label = "返回";
		t.right = 15;
		t.top = 24;
		return t;
	};
	_proto.m_btnRight_i = function () {
		var t = new eui.Button();
		this.m_btnRight = t;
		t.label = "右";
		t.right = 15;
		t.verticalCenter = -94;
		return t;
	};
	_proto.m_btnLeft_i = function () {
		var t = new eui.Button();
		this.m_btnLeft = t;
		t.label = "左";
		t.left = 20;
		t.verticalCenter = -94;
		return t;
	};
	_proto.m_btnUse_i = function () {
		var t = new eui.Button();
		this.m_btnUse = t;
		t.horizontalCenter = 0;
		t.label = "左";
		t.verticalCenter = 220;
		return t;
	};
	_proto.m_itemCenter_i = function () {
		var t = new eui.Image();
		this.m_itemCenter = t;
		t.height = 100;
		t.horizontalCenter = -11;
		t.verticalCenter = -94;
		t.width = 100;
		return t;
	};
	_proto.m_itemLeft_i = function () {
		var t = new eui.Image();
		this.m_itemLeft = t;
		t.height = 80;
		t.horizontalCenter = -138;
		t.verticalCenter = -94;
		t.width = 80;
		return t;
	};
	_proto.m_itemRight_i = function () {
		var t = new eui.Image();
		this.m_itemRight = t;
		t.height = 80;
		t.horizontalCenter = 115;
		t.verticalCenter = -94;
		t.width = 80;
		return t;
	};
	return backpackPanel;
})(eui.Skin);generateEUI.paths['resource/game_skins/bottomBtn.exml'] = window.bottomBtn = (function (_super) {
	__extends(bottomBtn, _super);
	var bottomBtn$Skin1 = 	(function (_super) {
		__extends(bottomBtn$Skin1, _super);
		function bottomBtn$Skin1() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","percentWidth",90),
						new eui.SetProperty("_Image1","percentHeight",90),
						new eui.SetProperty("_Image1","source","btnSheet_json.btn3")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = bottomBtn$Skin1.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.horizontalCenter = 0;
			t.source = "btnSheet_json.btn3";
			t.verticalCenter = 0;
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return bottomBtn$Skin1;
	})(eui.Skin);

	var bottomBtn$Skin2 = 	(function (_super) {
		__extends(bottomBtn$Skin2, _super);
		function bottomBtn$Skin2() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","percentWidth",90),
						new eui.SetProperty("_Image1","percentHeight",90),
						new eui.SetProperty("_Image1","source","btnSheet_json.btn2")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = bottomBtn$Skin2.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.horizontalCenter = 0;
			t.source = "btnSheet_json.btn2";
			t.verticalCenter = 0;
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return bottomBtn$Skin2;
	})(eui.Skin);

	var bottomBtn$Skin3 = 	(function (_super) {
		__extends(bottomBtn$Skin3, _super);
		function bottomBtn$Skin3() {
			_super.call(this);
			this.skinParts = ["labelDisplay"];
			
			this.elementsContent = [this._Image1_i(),this.labelDisplay_i()];
			this.states = [
				new eui.State ("up",
					[
					])
				,
				new eui.State ("down",
					[
						new eui.SetProperty("_Image1","percentWidth",90),
						new eui.SetProperty("_Image1","percentHeight",90),
						new eui.SetProperty("_Image1","source","btnSheet_json.btn3")
					])
				,
				new eui.State ("disabled",
					[
					])
			];
		}
		var _proto = bottomBtn$Skin3.prototype;

		_proto._Image1_i = function () {
			var t = new eui.Image();
			this._Image1 = t;
			t.percentHeight = 100;
			t.horizontalCenter = 0;
			t.source = "btnSheet_json.btn3";
			t.verticalCenter = 0;
			t.percentWidth = 100;
			return t;
		};
		_proto.labelDisplay_i = function () {
			var t = new eui.Label();
			this.labelDisplay = t;
			t.horizontalCenter = 0;
			t.verticalCenter = 0;
			return t;
		};
		return bottomBtn$Skin3;
	})(eui.Skin);

	function bottomBtn() {
		_super.call(this);
		this.skinParts = ["m_btnItem","m_btnAchieve","m_btnRank","m_groupBtn"];
		
		this.height = 124;
		this.width = 640;
		this.elementsContent = [this.m_groupBtn_i()];
	}
	var _proto = bottomBtn.prototype;

	_proto.m_groupBtn_i = function () {
		var t = new eui.Group();
		this.m_groupBtn = t;
		t.anchorOffsetY = 0;
		t.height = 124;
		t.left = 0;
		t.right = 0;
		t.y = 0;
		t.elementsContent = [this.m_btnItem_i(),this.m_btnAchieve_i(),this.m_btnRank_i()];
		return t;
	};
	_proto.m_btnItem_i = function () {
		var t = new eui.Button();
		this.m_btnItem = t;
		t.height = 110;
		t.label = "";
		t.width = 181;
		t.x = 0;
		t.y = 7;
		t.skinName = bottomBtn$Skin1;
		return t;
	};
	_proto.m_btnAchieve_i = function () {
		var t = new eui.Button();
		this.m_btnAchieve = t;
		t.height = 110;
		t.label = "";
		t.x = 230;
		t.y = 7;
		t.skinName = bottomBtn$Skin2;
		return t;
	};
	_proto.m_btnRank_i = function () {
		var t = new eui.Button();
		this.m_btnRank = t;
		t.height = 110;
		t.label = "";
		t.x = 460;
		t.y = 7;
		t.skinName = bottomBtn$Skin3;
		return t;
	};
	return bottomBtn;
})(eui.Skin);generateEUI.paths['resource/game_skins/gameScenePanel.exml'] = window.gameScenePanel = (function (_super) {
	__extends(gameScenePanel, _super);
	function gameScenePanel() {
		_super.call(this);
		this.skinParts = ["m_imgScene","m_groupGame","m_imgMask","m_imgCurtain","m_labScore","m_groupScore","m_proPower","m_groupGesture","m_btnPause","m_groupBottom"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.m_imgScene_i(),this.m_groupGame_i(),this.m_imgMask_i(),this.m_imgCurtain_i(),this.m_groupScore_i(),this.m_proPower_i(),this.m_groupGesture_i(),this.m_btnPause_i(),this.m_groupBottom_i()];
	}
	var _proto = gameScenePanel.prototype;

	_proto.m_imgScene_i = function () {
		var t = new eui.Image();
		this.m_imgScene = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "backBg2_jpg";
		t.top = 0;
		return t;
	};
	_proto.m_groupGame_i = function () {
		var t = new eui.Group();
		this.m_groupGame = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.m_imgMask_i = function () {
		var t = new eui.Image();
		this.m_imgMask = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.m_imgCurtain_i = function () {
		var t = new eui.Image();
		this.m_imgCurtain = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	_proto.m_groupScore_i = function () {
		var t = new eui.Group();
		this.m_groupScore = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.height = 60;
		t.left = 41;
		t.top = 45;
		t.width = 309.09;
		t.elementsContent = [this._Image1_i(),this.m_labScore_i()];
		return t;
	};
	_proto._Image1_i = function () {
		var t = new eui.Image();
		t.height = 60;
		t.source = "btnSheet_json.btn6";
		t.width = 70;
		t.x = 0;
		t.y = 0;
		return t;
	};
	_proto.m_labScore_i = function () {
		var t = new eui.Label();
		this.m_labScore = t;
		t.anchorOffsetX = 0;
		t.anchorOffsetY = 0;
		t.fontFamily = "Microsoft JhengHei";
		t.height = 60;
		t.size = 40;
		t.text = "9999";
		t.verticalAlign = "middle";
		t.width = 224;
		t.x = 80.55;
		t.y = 0;
		return t;
	};
	_proto.m_proPower_i = function () {
		var t = new eui.ProgressBar();
		this.m_proPower = t;
		t.anchorOffsetX = 0;
		t.height = 44;
		t.horizontalCenter = 0;
		t.scaleX = 0.6;
		t.scaleY = 0.5;
		t.skinName = "gamePower";
		t.value = 5;
		t.verticalCenter = 380;
		t.width = 500;
		return t;
	};
	_proto.m_groupGesture_i = function () {
		var t = new eui.Group();
		this.m_groupGesture = t;
		t.anchorOffsetY = 0;
		t.bottom = 172;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		t.touchChildren = true;
		t.touchEnabled = true;
		t.touchThrough = false;
		return t;
	};
	_proto.m_btnPause_i = function () {
		var t = new eui.Button();
		this.m_btnPause = t;
		t.label = "暂停";
		t.x = 515.67;
		t.y = 45.61;
		return t;
	};
	_proto.m_groupBottom_i = function () {
		var t = new eui.Group();
		this.m_groupBottom = t;
		t.anchorOffsetY = 0;
		t.height = 170;
		t.left = 0;
		t.right = 0;
		t.y = 966;
		t.elementsContent = [this._Rect1_i()];
		return t;
	};
	_proto._Rect1_i = function () {
		var t = new eui.Rect();
		t.bottom = 0;
		t.fillAlpha = 0.36;
		t.left = 0;
		t.right = 0;
		t.top = 0;
		return t;
	};
	return gameScenePanel;
})(eui.Skin);generateEUI.paths['resource/game_skins/gameStart.exml'] = window.gameStart = (function (_super) {
	__extends(gameStart, _super);
	function gameStart() {
		_super.call(this);
		this.skinParts = ["m_imgBg","m_imgCloth","m_imgCurtain","m_imgLine"];
		
		this.height = 1136;
		this.width = 640;
		this.elementsContent = [this.m_imgBg_i(),this.m_imgCloth_i(),this.m_imgCurtain_i(),this.m_imgLine_i()];
	}
	var _proto = gameStart.prototype;

	_proto.m_imgBg_i = function () {
		var t = new eui.Image();
		this.m_imgBg = t;
		t.bottom = 0;
		t.left = 0;
		t.right = 0;
		t.source = "bg_jpg";
		t.top = 0;
		return t;
	};
	_proto.m_imgCloth_i = function () {
		var t = new eui.Image();
		this.m_imgCloth = t;
		t.anchorOffsetY = 0;
		t.height = 1240;
		t.horizontalCenter = 0;
		t.source = "backBg4_png";
		t.width = 640;
		t.y = -239;
		return t;
	};
	_proto.m_imgCurtain_i = function () {
		var t = new eui.Image();
		this.m_imgCurtain = t;
		t.bottom = 135;
		t.height = 1240;
		t.horizontalCenter = 0;
		t.source = "common1_png";
		t.touchEnabled = false;
		t.width = 640;
		return t;
	};
	_proto.m_imgLine_i = function () {
		var t = new eui.Image();
		this.m_imgLine = t;
		t.horizontalCenter = 0;
		t.source = "backBg5_png";
		t.top = -22;
		return t;
	};
	return gameStart;
})(eui.Skin);