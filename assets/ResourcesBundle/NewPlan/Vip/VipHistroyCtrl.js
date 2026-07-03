cc.Class({
    extends: cc.Component,

    properties: {
    },

    ctor() {
        this.page = 1;
        this.pageSize = 7;
        this.total = 0;
        this.rowList = [];
    },

    onLoad: function() {
        this.autoBindPrefabNodes();
        this.cacheNodeRefs();
        this.bindEvents();
        this.loadCachedHistory();
        this.refreshPageState();
    },

    autoBindPrefabNodes: function() {
        this.btn_back = this.getComponentByNodeName('btnBcak', cc.Button);
        this.btn_last = this.getComponentByNodeName('btn_last', cc.Button);
        this.btn_next = this.getComponentByNodeName('btn_next', cc.Button);
        this.lab_page = this.getComponentByNodeName('lab_page', cc.Label);
        this.content = this.findChildByName(this.node, 'content');
    },

    cacheNodeRefs: function() {
        if (this.content) {
            this.rowList = this.content.children
                .filter((child) => child && child.name == 'item')
                .sort((a, b) => b.y - a.y);
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

    fetchHistory: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/history?page=${this.page}&size=${this.pageSize}`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            CommonFun.getInstance().hidProgress();
            if (!msg || msg.result != 0 || !msg.data) {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'vip history error');
                return;
            }

            this.total = Number(msg.data.total || 0);
            let list = msg.data.list || [];
            let cacheData = GlobalCfg.USER_DATAS.vip1HistoryData || {};
            let pageKey = this.getHistoryPageCacheKey(this.page, this.pageSize);
            cacheData.total = this.total;
            cacheData.page = this.page;
            cacheData.pageSize = this.pageSize;
            cacheData.pages = cacheData.pages || {};
            cacheData.pages[pageKey] = {
                page: this.page,
                pageSize: this.pageSize,
                total: this.total,
                list: list,
            };
            GlobalCfg.USER_DATAS.vip1HistoryData = cacheData;
            this.renderHistory(list);
            this.refreshPageState();
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    loadCachedHistory: function() {
        let cacheData = GlobalCfg.USER_DATAS.vip1HistoryData || null;
        if (!cacheData) {
            return false;
        }

        this.total = Number(cacheData.total || 0);
        let pageKey = this.getHistoryPageCacheKey(this.page, this.pageSize);
        let pageCacheData = cacheData.pages && cacheData.pages[pageKey] ? cacheData.pages[pageKey] : null;
        if (!pageCacheData) {
            if (Number(cacheData.page || 0) != this.page || Number(cacheData.pageSize || 0) != this.pageSize) {
                return false;
            }

            pageCacheData = cacheData;
        }

        if (!pageCacheData) {
            return false;
        }

        this.renderHistory(pageCacheData.list || []);
        return true;
    },

    changePage: function(delta) {
        let totalPage = Math.max(Math.ceil(this.total / this.pageSize), 1);
        let nextPage = Math.max(1, Math.min(totalPage, this.page + delta));
        if (nextPage == this.page) {
            return;
        }

        this.page = nextPage;
        if (this.loadCachedHistory()) {
            this.refreshPageState();
            return;
        }

        CommonFun.getInstance().showProgress();
        this.fetchHistory();
    },

    getHistoryPageCacheKey: function(page, pageSize) {
        return `${Number(page || 0)}_${Number(pageSize || 0)}`;
    },

    renderHistory: function(list) {
        for (let i = 0; i < this.rowList.length; i++) {
            let rowNode = this.rowList[i];
            let item = list[i];
            let labReward = this.getLabelByName(rowNode, 'lab_reward');
            let labCollect = this.getLabelByName(rowNode, 'lab_collect');
            let labTime = this.getLabelByName(rowNode, 'lab_time');
            rowNode.active = true;

            if (!item) {
                if (labReward) {
                    labReward.string = '';
                }
                if (labCollect) {
                    labCollect.string = '';
                }
                if (labTime) {
                    labTime.string = '';
                }
                continue;
            }

            if (labReward) {
                labReward.string = this.getRewardText(item);
            }
            if (labCollect) {
                labCollect.string = this.getStatusText(item);
            }
            if (labTime) {
                labTime.string = this.formatTimestamp(item.claimed_at || item.created_at || 0);
            }
        }
    },

    refreshPageState: function() {
        let totalPage = Math.max(Math.ceil(this.total / this.pageSize), 1);
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

    getRewardText: function(item) {
        let typeText = this.getClaimTypeText(item.claim_type);
        let levelText = `VIP${Number(item.reward_level || 0)}`;
        let amountText = this.formatAmount(item.reward_amount || item.reward_max || 0);
        return `${typeText} ${levelText}  ${amountText}`;
    },

    getStatusText: function(item) {
        let status = Number(item.status || 0);
        if (status == 1) {
            return this.getLocalizedHistoryText('Claimed');
        }
        if (status == 2) {
            return item.fail_reason || this.getLocalizedHistoryText('Failed');
        }
        if (status == 3) {
            return this.getLocalizedHistoryText('Expired');
        }
        return this.getLocalizedHistoryText('Pending');
    },

    getClaimTypeText: function(type) {
        if (type == 'upgrade') {
            return this.getLocalizedHistoryText('Upgrade');
        }
        if (type == 'weekly') {
            return this.getLocalizedHistoryText('Weekly');
        }
        if (type == 'monthly') {
            return this.getLocalizedHistoryText('Monthly');
        }
        return type || '';
    },

    getLocalizedHistoryText: function(textKey) {
        let languageIndex = Number(window.language || 1);
        let textMap = {
            Upgrade: {
                1: 'Upgrade',
                2: 'अपग्रेड',
                3: 'اپ گریڈ',
                4: 'আপগ্রেড',
            },
            Weekly: {
                1: 'Weekly',
                2: 'साप्ताहिक',
                3: 'ہفتہ وار',
                4: 'সাপ্তাহিক',
            },
            Monthly: {
                1: 'Monthly',
                2: 'मासिक',
                3: 'ماہانہ',
                4: 'মাসিক',
            },
            Claimed: {
                1: 'Claimed',
                2: 'क्लेम किया गया',
                3: 'کلیم کر لیا گیا',
                4: 'দাবি করা হয়েছে',
            },
            Failed: {
                1: 'Failed',
                2: 'विफल',
                3: 'ناکام',
                4: 'ব্যর্থ',
            },
            Expired: {
                1: 'Expired',
                2: 'समाप्त',
                3: 'میعاد ختم',
                4: 'মেয়াদ শেষ',
            },
            Pending: {
                1: 'Pending',
                2: 'लंबित',
                3: 'زیر التواء',
                4: 'অপেক্ষমাণ',
            },
        };

        let config = textMap[textKey] || {};
        return config[languageIndex] || config[1] || '';
    },

    formatAmount: function(amount) {
        return `${CommonFun.getInstance().numberToShow(Number(amount || 0) / 100, 1)}`;
    },

    formatTimestamp: function(timestamp) {
        timestamp = Number(timestamp || 0);
        if (timestamp <= 0) {
            return '--';
        }

        let date = new Date(timestamp * 1000);
        let y = date.getFullYear();
        let m = (`0${date.getMonth() + 1}`).slice(-2);
        let d = (`0${date.getDate()}`).slice(-2);
        let h = (`0${date.getHours()}`).slice(-2);
        let min = (`0${date.getMinutes()}`).slice(-2);
        return `${y}-${m}-${d} ${h}:${min}`;
    },

    getComponentByNodeName: function(name, componentType) {
        let child = this.findChildByName(this.node, name);
        return child ? child.getComponent(componentType) : null;
    },

    getLabelByName: function(root, name) {
        let child = this.findChildByName(root, name);
        return child ? child.getComponent(cc.Label) : null;
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
