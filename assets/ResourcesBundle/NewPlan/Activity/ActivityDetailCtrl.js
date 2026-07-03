cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        tog_all: cc.Toggle,
        content: cc.Node,
        item: cc.Node,
    },

    ctor: function() {
        this.activityList = [];
        this.activityItemNodeMap = {};
        this.activityTypes = [];
        this.dynamicToggleNodes = [];
        this.spriteFrameCache = {};
        this.closeItemHeight = 300;
    },

    onLoad: function() {
        this.btn_back.node.on("click", CommonFun.getInstance().debounce(this.onBtnBackClick, 1), this);
        this.tog_all.node.on("toggle", this.onToggleClick, this);
        this.tog_all.node._activityTypeFilter = "all";

        this.item.active = false;
        if (this.tog_1 && this.tog_1.node) {
            this.tog_1.node.active = false;
        };
        if (this.tog_2 && this.tog_2.node) {
            this.tog_2.node.active = false;
        };

        this.toggleContainerNode = this.getToggleContainerNode();
        this.toggleTemplateNode = this.tog_all.node;
    },

    start: function() {
        
    },

    onBtnBackClick: function() {
        this.node.destroy();
    },

    onToggleClick: function(toggle) {
        if (!toggle.isChecked) {
            return;
        };

        let type = toggle.node && toggle.node._activityTypeFilter ? toggle.node._activityTypeFilter : "all";
        this.refreshActivityList(type);
    },

    initWithActivityList: function(activityList) {
        this.activityList = Array.isArray(activityList) ? activityList : [];
        this.activityTypes = Array.from(new Set(this.activityList.map((item) => item.type).filter((type) => !!type)));
        LoggerUtil.getInstance().log("ActivityDetail raw activityList:", cc.sys.isNative ? JSON.stringify(this.activityList) : this.activityList);
        LoggerUtil.getInstance().log("ActivityDetail parsed activityTypes:", cc.sys.isNative ? JSON.stringify(this.activityTypes) : this.activityTypes, "count:", this.activityTypes.length);
        this.resetActivityItems();
        this.rebuildTypeToggles();
        this.buildActivityItems();
        this.tog_all.isChecked = true;
        this.refreshActivityList("all");
    },

    refreshActivityList: function(type) {
        if (!this.content || !this.item) {
            return;
        };

        this.activityList.forEach((activityData) => {
            let itemNode = this.activityItemNodeMap[activityData.id];
            if (!cc.isValid(itemNode)) {
                return;
            };

            let isShow = type == "all" || activityData.type == type;
            itemNode.active = isShow;
        });

        this.refreshLayout();
        this.scheduleOnce(() => {
            this.relayoutAllActivityItems();
        }, 0);
    },

    resetActivityItems: function() {
        if (!cc.isValid(this.content)) {
            return;
        };

        this.content.children.forEach((child) => {
            if (!this.isPersistentContentChild(child)) {
                child.destroy();
            };
        });
        this.activityItemNodeMap = {};
    },

    buildActivityItems: function() {
        if (!this.content || !this.item) {
            return;
        };

        this.activityList.forEach((activityData) => {
            let itemNode = this.activityItemNodeMap[activityData.id];
            if (cc.isValid(itemNode)) {
                return;
            };

            itemNode = cc.instantiate(this.item);
            itemNode._activityDataId = activityData.id;
            this.content.addChild(itemNode);
            this.setItemHeight(itemNode, this.closeItemHeight);
            itemNode.active = false;
            this.initItemOpenButton(itemNode);
            this.setItemImage(itemNode, activityData.imgUrl);
            this.activityItemNodeMap[activityData.id] = itemNode;
        });
    },

    rebuildTypeToggles: function() {
        this.clearDynamicToggles();
        this.setToggleLabel(this.tog_all.node, "ALL");
        this.tog_all.node._activityTypeFilter = "all";
        this.tog_all.isChecked = true;

        let toggleContainer = this.toggleContainerNode || this.getToggleContainerNode();
        if (!cc.isValid(toggleContainer)) {
            return;
        };

        let baseToggleNode = this.tog_all && this.tog_all.node ? this.tog_all.node : null;
        let templateNode = this.toggleTemplateNode && cc.isValid(this.toggleTemplateNode)
            ? this.toggleTemplateNode
            : baseToggleNode;
        if (!cc.isValid(baseToggleNode) || !cc.isValid(templateNode)) {
            LoggerUtil.getInstance().warn("ActivityDetail rebuildTypeToggles missing base/template node");
            return;
        };

        LoggerUtil.getInstance().log("ActivityDetail rebuildTypeToggles start:", {
            activityTypes: this.activityTypes,
            count: this.activityTypes.length,
            baseWidth: baseToggleNode.width,
            containerWidth: toggleContainer.width,
        });

        this.activityTypes.forEach((type, index) => {
            let toggleNode = cc.instantiate(templateNode);
            toggleNode.name = `toggle_dynamic_${index}`;
            toggleNode.active = true;
            toggleNode._activityTypeFilter = type;
            toggleContainer.addChild(toggleNode);
            this.setToggleLabel(toggleNode, type);
            this.disableToggleI18n(toggleNode);

            let toggleComp = toggleNode.getComponent(cc.Toggle);
            if (toggleComp) {
                toggleComp.isChecked = false;
                toggleNode.on("toggle", this.onToggleClick, this);
            };
            this.dynamicToggleNodes.push(toggleNode);
            LoggerUtil.getInstance().log("ActivityDetail created toggle:", {
                index: index,
                type: type,
                nodeName: toggleNode.name,
                x: toggleNode.x,
                y: toggleNode.y,
                width: toggleNode.width,
                active: toggleNode.active,
            });
        });
        let layout = toggleContainer.getComponent(cc.Layout);
        if (layout) {
            layout.updateLayout();
        };
        let widget = toggleContainer.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        };
        LoggerUtil.getInstance().log("ActivityDetail rebuildTypeToggles end:", {
            dynamicToggleCount: this.dynamicToggleNodes.length,
            containerChildrenCount: toggleContainer.childrenCount,
            containerWidth: toggleContainer.width,
            childNames: toggleContainer.children.map((child) => child.name),
        });
    },

    clearDynamicToggles: function() {
        LoggerUtil.getInstance().log("ActivityDetail clearDynamicToggles count:", this.dynamicToggleNodes.length);
        this.dynamicToggleNodes.forEach((toggleNode) => {
            if (cc.isValid(toggleNode)) {
                toggleNode.targetOff(this);
                toggleNode.destroy();
            };
        });
        this.dynamicToggleNodes = [];
    },

    getToggleContainerNode: function() {
        return this.tog_all && this.tog_all.node ? this.tog_all.node.parent : null;
    },

    setToggleLabel: function(toggleNode, text) {
        if (!cc.isValid(toggleNode)) {
            return;
        };
        let label = this.findFirstLabel(toggleNode);
        if (label) {
            label.string = text;
        };
    },

    disableToggleI18n: function(toggleNode) {
        if (!cc.isValid(toggleNode)) {
            return;
        };
        let walk = (node) => {
            if (!cc.isValid(node)) {
                return;
            };
            let components = node.getComponents(cc.Component);
            components.forEach((comp) => {
                if (comp && comp !== node.getComponent(cc.Label) && Reflect.has(comp, "labelTransId")) {
                    comp.enabled = false;
                }
            });
            node.children.forEach((child) => walk(child));
        };
        walk(toggleNode);
    },

    isPersistentContentChild: function(child) {
        if (!child) {
            return false;
        };
        return child == this.item || child.name == "top_item";
    },

    setItemImage: function(itemNode, imgUrl) {
        let bgNode = this.getItemBgNode(itemNode);
        let sprite = bgNode ? bgNode.getComponent(cc.Sprite) : itemNode.getComponent(cc.Sprite);
        if (!sprite) {
            LoggerUtil.getInstance().warn("ActivityDetail item bg sprite is missing");
            return;
        };

        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        if (this.spriteFrameCache[imgUrl]) {
            this.applyItemSpriteFrame(itemNode, bgNode || itemNode, sprite, this.spriteFrameCache[imgUrl]);
            this.refreshLayout();
            this.scheduleOnce(() => {
                this.relayoutItemNode(itemNode);
                this.refreshLayout();
            }, 0);
            return;
        };

        cc.assetManager.loadRemote(imgUrl, { ext: ".png" }, (err, texture) => {
            if (err) {
                LoggerUtil.getInstance().warn("ActivityDetail load image failed", imgUrl, err);
                return;
            };
            if (!cc.isValid(itemNode) || !cc.isValid(this)) {
                return;
            };

            let spriteFrame = new cc.SpriteFrame(texture);
            this.spriteFrameCache[imgUrl] = spriteFrame;
            this.applyItemSpriteFrame(itemNode, bgNode || itemNode, sprite, spriteFrame);
            LoggerUtil.getInstance().log("ActivityDetail load image success", imgUrl, texture.width, texture.height);
            this.refreshLayout();
            this.scheduleOnce(() => {
                this.relayoutItemNode(itemNode);
                this.refreshLayout();
            }, 0);
        });
    },

    applyItemSpriteFrame: function(itemNode, bgNode, sprite, spriteFrame) {
        sprite.spriteFrame = spriteFrame;

        let rect = spriteFrame.getRect ? spriteFrame.getRect() : null;
        let imgWidth = rect ? rect.width : itemNode.width;
        let imgHeight = rect ? rect.height : this.item.height;
        let maskNode = this.findChildByName(itemNode, "mask");
        let showWidth = maskNode ? maskNode.width : itemNode.width;
        let scale = imgWidth > 0 ? showWidth / imgWidth : 1;
        let showHeight = imgHeight * scale;

        itemNode._activityDetailOriginHeight = showHeight;
        itemNode._activityDetailIsOpen = false;
        itemNode._activityDetailImageRatio = imgHeight > 0 ? imgWidth / imgHeight : 1;

        bgNode.setContentSize(showWidth, showHeight);
        bgNode.setPosition(0, 0);
        this.setItemHeight(itemNode, this.closeItemHeight);
        this.setItemArrowOpenStatus(itemNode, false);
    },

    initItemOpenButton: function(itemNode) {
        itemNode._activityDetailIsOpen = false;
        itemNode._activityDetailOriginHeight = this.item.height;

        let btnOpenNode = this.findChildByName(itemNode, "btn_open");
        this.setItemHeight(itemNode, this.closeItemHeight);
        this.setItemArrowOpenStatus(itemNode, false);

        if (!btnOpenNode) {
            return;
        };

        btnOpenNode.targetOff(this);
        btnOpenNode.on("click", () => {
            this.toggleItemOpen(itemNode);
        }, this);
    },

    toggleItemOpen: function(itemNode) {
        if (!cc.isValid(itemNode)) {
            return;
        };

        let isOpen = itemNode._activityDetailIsOpen == true;
        let targetHeight = isOpen ? this.closeItemHeight : (itemNode._activityDetailOriginHeight || this.item.height);
        itemNode._activityDetailIsOpen = !isOpen;
        this.setItemHeight(itemNode, targetHeight);
        this.setItemArrowOpenStatus(itemNode, itemNode._activityDetailIsOpen);
        this.refreshLayout();
    },

    getItemBgNode: function(itemNode) {
        let maskNode = this.findChildByName(itemNode, "mask");
        if (!maskNode) {
            return null;
        };
        return maskNode.getChildByName("bg") || this.findChildByName(maskNode, "bg");
    },

    setItemHeight: function(itemNode, height) {
        let itemWidth = this.getAdaptiveItemWidth(itemNode);
        itemNode.setContentSize(itemWidth, height);

        let maskNode = this.findChildByName(itemNode, "mask");
        if (maskNode) {
            maskNode.setContentSize(itemWidth, height - 5);
            let bgNode = maskNode.getChildByName("bg") || this.findChildByName(maskNode, "bg");
            if (bgNode && itemNode._activityDetailImageRatio > 0) {
                bgNode.setContentSize(itemWidth, itemWidth / itemNode._activityDetailImageRatio);
                bgNode.setPosition(0, 0);
                if (itemNode._activityDetailIsOpen == true) {
                    itemNode._activityDetailOriginHeight = bgNode.height;
                    itemNode.setContentSize(itemWidth, bgNode.height);
                    maskNode.setContentSize(itemWidth, bgNode.height - 5);
                    height = bgNode.height;
                };
            };
        };

        let kuangNode = this.findChildByName(itemNode, "kuang");
        if (kuangNode) {
            kuangNode.setContentSize(itemWidth, height);
        };
    },

    getAdaptiveItemWidth: function(itemNode) {
        let viewNode = this.content && this.content.parent;
        let viewWidth = viewNode ? viewNode.width : 0;
        let contentWidth = this.content ? this.content.width : 0;
        let itemWidth = itemNode && itemNode.width ? itemNode.width : this.item.width;
        let targetWidth = viewWidth > 0 ? viewWidth : (contentWidth > 0 ? contentWidth : itemWidth);
        return Math.min(itemWidth, targetWidth);
    },

    setItemArrowOpenStatus: function(itemNode, isOpen) {
        let btnOpenNode = this.findChildByName(itemNode, "btn_open");
        let arrowNode = btnOpenNode ? btnOpenNode.getChildByName("Background") : null;
        if (arrowNode) {
            arrowNode.angle = isOpen ? 180 : 0;
        };
    },

    findChildByName: function(rootNode, childName) {
        if (!rootNode) {
            return null;
        };
        if (rootNode.name == childName) {
            return rootNode;
        };
        for (let i = 0; i < rootNode.children.length; i++) {
            let target = this.findChildByName(rootNode.children[i], childName);
            if (target) {
                return target;
            };
        };
        return null;
    },

    findFirstLabel: function(rootNode) {
        if (!rootNode) {
            return null;
        };
        let label = rootNode.getComponent(cc.Label);
        if (label) {
            return label;
        };
        for (let i = 0; i < rootNode.children.length; i++) {
            let target = this.findFirstLabel(rootNode.children[i]);
            if (target) {
                return target;
            };
        };
        return null;
    },

    relayoutAllActivityItems: function() {
        if (!cc.isValid(this.content)) {
            return;
        };

        this.content.children.forEach((child) => {
            if (!this.isPersistentContentChild(child)) {
                this.relayoutItemNode(child);
            };
        });
        this.refreshLayout();
    },

    relayoutItemNode: function(itemNode) {
        if (!cc.isValid(itemNode)) {
            return;
        };

        let targetHeight = itemNode._activityDetailIsOpen == true
            ? (itemNode._activityDetailOriginHeight || this.item.height)
            : this.closeItemHeight;
        this.setItemHeight(itemNode, targetHeight);
    },

    refreshLayout: function() {
        if (!cc.isValid(this.content)) {
            return;
        };

        let layout = this.content.getComponent(cc.Layout);
        if (layout) {
            layout.updateLayout();
        };
    },
});
