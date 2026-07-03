cc.Class({
    extends: cc.Component,

    properties: {
        atlas_vip: cc.SpriteAtlas,
    },

    ctor() {
        this.page = 1;
        this.pageSize = 6;
        this.levelList = [];
        this.levelConfigData = null;
        this.rowList = [];
    },

    onLoad: function() {
        this.autoBindPrefabNodes();
        this.cacheNodeRefs();
        this.bindEvents();
        this.initLevelRulesData();
    },

    autoBindPrefabNodes: function() {
        this.btn_back = this.getComponentByNodeName('btnBcak', cc.Button);
        this.btn_last = this.getComponentByNodeName('btn_last', cc.Button);
        this.btn_next = this.getComponentByNodeName('btn_next', cc.Button);
        this.lab_page = this.getComponentByNodeName('lab_page', cc.Label);
        this.content = this.findChildByName(this.node, 'content');
        this.node_bottom = this.findChildByName(this.node, 'bottom');
    },

    cacheNodeRefs: function() {
        this.rowList = this.getFixedRowList();
        this.pageSize = this.rowList.length || this.pageSize;

        if (this.node_bottom) {
            this.node_bottom.active = true;
        }
    },

    bindEvents: function() {
        if (this.btn_back && this.btn_back.node) {
            this.btn_back.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
        }

        if (this.btn_last && this.btn_last.node) {
            this.btn_last.node.on('click', this.btnClick, this);
        }

        if (this.btn_next && this.btn_next.node) {
            this.btn_next.node.on('click', this.btnClick, this);
        }
    },

    btnClick: function(btn) {
        if (!btn || !btn.node) {
            return;
        }

        if (this.btn_back && btn.node == this.btn_back.node) {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }

        GlobalCfg.G_COMPONENTS.Audio.playButton();

        if (this.btn_last && btn.node == this.btn_last.node) {
            this.changePage(-1);
            return;
        }

        if (this.btn_next && btn.node == this.btn_next.node) {
            this.changePage(1);
        }
    },

    initLevelRulesData: function() {
        this.levelConfigData = this.getCachedLevelConfigData();
        this.levelList = this.getDisplayLevelList(this.levelConfigData && this.levelConfigData.list ? this.levelConfigData.list : []);
        if (this.levelList.length > 0) {
            this.renderCurrentPage();
            return;
        }

        this.fetchLevelRules();
    },

    fetchLevelRules: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/levels`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (!msg || msg.result != 0 || !msg.data) {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'vip rules error');
                return;
            }

            this.levelConfigData = msg.data;
            this.levelList = this.getDisplayLevelList(msg.data.list || []);
            GlobalCfg.USER_DATAS.vip1LevelConfigData = msg.data;
            this.renderCurrentPage();
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    changePage: function(delta) {
        let totalPage = Math.max(Math.ceil(this.levelList.length / this.pageSize), 1);
        let nextPage = Math.max(1, Math.min(totalPage, this.page + delta));
        if (nextPage == this.page) {
            return;
        }

        this.page = nextPage;
        this.renderCurrentPage();
    },

    renderCurrentPage: function() {
        let startIndex = (this.page - 1) * this.pageSize;
        if (this.node_bottom) {
            this.node_bottom.active = true;
        }

        for (let i = 0; i < this.rowList.length; i++) {
            let rowNode = this.rowList[i];
            let item = this.levelList[startIndex + i];
            rowNode.active = !!item;
            if (!item) {
                continue;
            }

            let labLevel = this.getLabelByName(rowNode, 'lab_level');
            let labBet = this.getLabelByName(rowNode, 'lab_bet');
            let labUpgrade = this.getLabelByName(rowNode, 'lab_reward_upgrade');
            let labWeek = this.getLabelByName(rowNode, 'lab_reward_week');
            let labMonth = this.getLabelByName(rowNode, 'lab_reward_month');
            let imgLevel = this.getSpriteByName(rowNode, 'img_level');

            if (labLevel) {
                labLevel.string = `VIP${Number(item.level || 0)}`;
            }
            if (imgLevel) {
                this.updateVipLevelSprite(imgLevel, item.level);
            }
            if (labBet) {
                labBet.string = this.getBetThresholdText(item);
            }
            if (labUpgrade) {
                labUpgrade.string = this.formatAmount(item.upgrade_reward || 0);
            }
            if (labWeek) {
                labWeek.string = `${this.formatAmount(item.weekly_bonus_min || 0)}-${this.formatAmount(item.weekly_bonus_max || 0)}`;
            }
            if (labMonth) {
                labMonth.string = `${this.formatAmount(item.monthly_bonus_min || 0)}-${this.formatAmount(item.monthly_bonus_max || 0)}`;
            }
        }

        this.refreshCurrentLevelIcon();
        this.refreshPageState();
    },

    refreshPageState: function() {
        let totalPage = Math.max(Math.ceil(this.levelList.length / this.pageSize), 1);
        if (this.lab_page) {
            this.lab_page.string = `${this.page}/${totalPage}`;
        }

        if (this.btn_last) {
            this.btn_last.interactable = this.page > 1;
            this.btn_last.enableAutoGrayEffect = true;
        }
        if (this.btn_next) {
            this.btn_next.interactable = this.page < totalPage;
            this.btn_next.enableAutoGrayEffect = true;
        }
    },

    getBetThresholdText: function(item) {
        return this.formatCurrencyValue(item ? item.bet_amount_required : 0);
    },

    formatAmount: function(amount) {
        return this.formatCurrencyValue(amount);
    },

    formatCurrencyValue: function(amount) {
        let symbol = CommonFun.getInstance().getCurrencySymbol();
        let value = amount === null || amount === undefined ? 0 : Number(amount) / 100;
        return `${symbol}${value}`;
    },

    refreshCurrentLevelIcon: function() {
        if (!this.node_bottom || !this.node_bottom.active) {
            return;
        }

        let imgCurrentLevel = this.getSpriteByName(this.node_bottom, 'img_current_level');
        if (!imgCurrentLevel) {
            return;
        }

        let currentLevel = this.levelConfigData ? Number(this.levelConfigData.current_level || 0) : 0;
        this.updateVipLevelSprite(imgCurrentLevel, currentLevel);
    },

    updateVipLevelSprite: function(sprite, level) {
        if (!sprite || !this.atlas_vip) {
            return;
        }

        let targetLevel = Number(level);
        if (isNaN(targetLevel) || targetLevel < 0) {
            targetLevel = 0;
        }

        let spriteFrame = this.atlas_vip.getSpriteFrame(`vip_${targetLevel}`);
        if (spriteFrame) {
            sprite.spriteFrame = spriteFrame;
        }
    },

    getCachedLevelConfigData: function() {
        return GlobalCfg.USER_DATAS.vip1LevelConfigData || null;
    },

    getDisplayLevelList: function(list) {
        let sourceList = Array.isArray(list) ? list : [];
        return sourceList.filter((item) => Number(item && item.level || 0) >= 1);
    },

    getComponentByNodeName: function(name, componentType) {
        let child = this.findChildByName(this.node, name);
        return child ? child.getComponent(componentType) : null;
    },

    getLabelByName: function(root, name) {
        let child = this.findChildByName(root, name);
        return child ? child.getComponent(cc.Label) : null;
    },

    getSpriteByName: function(root, name) {
        let child = this.findChildByName(root, name);
        return child ? child.getComponent(cc.Sprite) : null;
    },

    getFixedRowList: function() {
        if (!this.content) {
            return [];
        }

        let rowNameList = [
            'item',
            'item copy',
            'item copy',
            'item copy',
            'item copy',
            'item copy',
        ];

        let rowList = [];
        let searchStartIndex = 0;
        for (let i = 0; i < rowNameList.length; i++) {
            let targetName = rowNameList[i];
            for (let j = searchStartIndex; j < this.content.childrenCount; j++) {
                let child = this.content.children[j];
                if (child && child.name == targetName) {
                    rowList.push(child);
                    searchStartIndex = j + 1;
                    break;
                }
            }
        }

        return rowList;
    },

    findChildByName: function(root, targetName) {
        if (!root || !targetName) {
            return null;
        }

        if (root.name == targetName) {
            return root;
        }

        for (let i = 0; i < root.childrenCount; i++) {
            let result = this.findChildByName(root.children[i], targetName);
            if (result) {
                return result;
            }
        }

        return null;
    },
});
