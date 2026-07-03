cc.Class({
    extends: cc.Component,

    properties: {
        btn_back: cc.Button,
        btn_history: cc.Button,
        btn_rule: cc.Button,
        btn_last: cc.Button,
        btn_next: cc.Button,
        btn_goUpgrade: cc.Button,

        lab_reward_upgrade: cc.Label,
        lab_need_upgrade: cc.Label,
        lab_progress: cc.Label,

        node_root_myLevel: cc.Node,
        node_root_reward_week: cc.Node,
        node_root_reward_month: cc.Node,
        node_root_reward_upgrade: cc.Node,
        node_root_vipinfo: cc.Node,
        node_root_requirements: cc.Node,

        atlas_vip: cc.SpriteAtlas,
        
    },

    ctor() {
        this.vipInfo = null;
        this.levelConfigData = null;
        this.vipLevelCurrentIndex = 0;
        this.vipAnimatingTargetIndex = -1;
        this.vipLevelTweenDuration = 0.22;
        this.isVipListAnimating = false;
        this.btnRefs = {};
        this.labelRefs = {};
        this.vipItemSlots = [];
        this.vipItemBasePositions = [];
        this.vipTrackStepX = 300;
        this.vipTrackHiddenLeftX = -600;
        this.vipTrackHiddenRightX = 900;
        this.vipTrackDisplayX = [-300, 0, 300, 600];
        this.vipTrackY = 0;
        this.vipItemNormalColor = new cc.Color(255, 255, 255, 255);
        this.vipItemGrayColor = new cc.Color(135, 135, 135, 255);
    },

    onLoad: function() {
        this.cacheNodeRefs();
        this.bindEvents();
        this.customMsgHandle = ClientNotify.register(GlobalCfg.MSG_TYPE.clientMsg, this.onEventMsg, this);
    },

    start: function() {
        this.applySideNodeScaleForSmallDevice();
        this.loadCachedData();
        if (this.vipInfo && this.levelConfigData) {
            this.resetVipLevelIndex();
            this.refreshView();
            return;
        }

        this.refreshAllData();
    },

    onDestroy: function() {
        ClientNotify.removeByHandle(GlobalCfg.MSG_TYPE.clientMsg, this.customMsgHandle);
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_INFO_UPDATE,
            msgData: {}
        });
    },

    onEventMsg: function(webData, target) {
        let self = target;
        if (!webData) {
            return;
        }

        if (webData.msgCode == GlobalCfg.CLIENT_MSG_ID.CHANGE_LANGUAGE) {
            self.refreshView();
        }
    },

    cacheNodeRefs: function() {
        this.labelRefs.lab_cur_level = this.getLabelByName(this.node_root_myLevel, 'lab_cur_level');
        this.labelRefs.lab_remainTime = this.getLabelByName(this.node_root_myLevel, 'lab_remainTime');
        this.labelRefs.lab_deposit_total = this.getLabelByName(this.findChildByName(this.node_root_requirements, 'root1'), 'lab_deposit');
        this.labelRefs.lab_bet_total = this.getLabelByName(this.findChildByName(this.node_root_requirements, 'root2'), 'lab_totalbet');

        this.btnRefs.btn_upgrade_collect = this.getButtonByName(this.node_root_reward_upgrade, 'btn_collect_upgrade');
        this.btnRefs.btn_upgrade_uncollect = this.getButtonByName(this.node_root_reward_upgrade, 'btn_uncollect_upgrade');
        this.btnRefs.btn_week_collect = this.getButtonByName(this.node_root_reward_week, 'btn_collect_week');
        this.btnRefs.btn_week_uncollect = this.getButtonByName(this.node_root_reward_week, 'btn_uncollect_week');
        this.btnRefs.btn_month_collect = this.getButtonByName(this.node_root_reward_month, 'btn_collect_month');
        this.btnRefs.btn_month_uncollect = this.getButtonByName(this.node_root_reward_month, 'btn_uncollect_month');
        this.btnRefs.btn_test_weekly = this.getButtonByName(this.node, 'btn_test_weekly');
        this.btnRefs.btn_test_monthly = this.getButtonByName(this.node, 'btn_test_monthly');

        this.labelRefs.lab_upgrade_collect = this.getButtonLabel(this.btnRefs.btn_upgrade_collect);
        this.labelRefs.lab_upgrade_uncollect = this.getButtonLabel(this.btnRefs.btn_upgrade_uncollect);
        this.labelRefs.lab_week_collect = this.getButtonLabel(this.btnRefs.btn_week_collect);
        this.labelRefs.lab_week_uncollect = this.getButtonLabel(this.btnRefs.btn_week_uncollect);
        this.labelRefs.lab_month_collect = this.getButtonLabel(this.btnRefs.btn_month_collect);
        this.labelRefs.lab_month_uncollect = this.getButtonLabel(this.btnRefs.btn_month_uncollect);

        this.vipContent = this.findChildByName(this.node_root_vipinfo, 'content');
        this.imgVip = this.findChildByName(this.node_root_myLevel, 'img_vip');
        let progressRoot = this.findChildByName(this.leftNode || this.findChildByName(this.node, 'left'), 'progress_root');
        this.progressBar = this.findChildByName(progressRoot, 'progress');
        if (!this.lab_progress) {
            this.lab_progress = this.getLabelByName(progressRoot, 'lab_progress');
        }
        this.leftNode = this.findChildByName(this.node, 'left');
        this.rightNode = this.findChildByName(this.node, 'right');

        this.cacheVipItemSlots();
        this.applySideNodeScaleForSmallDevice();
    },

    bindEvents: function() {
        let normalButtons = [
            this.btnRefs.btn_upgrade_collect,
            this.btnRefs.btn_week_collect,
            this.btnRefs.btn_month_collect,
            this.btnRefs.btn_test_weekly,
            this.btnRefs.btn_test_monthly,
        ];

        for (let i = 0; i < normalButtons.length; i++) {
            if (normalButtons[i] && normalButtons[i].node) {
                normalButtons[i].node.on('click', CommonFun.getInstance().debounce(this.btnClick, 1), this);
            }
        }
        this.btn_last.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_next.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_back.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_history.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_rule.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);
        this.btn_goUpgrade.node.on('click', CommonFun.getInstance().debounce(this.btnClick, 0), this);

    },

    btnClick: function(btn) {
        if (!btn || !btn.node) {
            return;
        }
        let btnName = btn.node.name;
        switch (btnName) {
            case this.btn_back.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playBack();
                this.node.destroy();
                return;
            case this.btn_history.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                CommonFun.getInstance().showVipHistory();
                return;
            case this.btn_rule.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                CommonFun.getInstance().showVipRule();
                return;
            case this.btn_last.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.changeVipLevelPage(-1);
                return;
            case this.btn_next.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.changeVipLevelPage(1);
                return;
            case this.btn_goUpgrade.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                CommonFun.getInstance().showNewShop(true, GlobalCfg.SHOP_RECHARGE_FROM.MyVipAddCash);
                return;
            case this.btnRefs.btn_week_collect.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.claimWeeklyReward();
                return;
            case this.btnRefs.btn_test_weekly.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.claimTestWeeklyReward();
                return;
            case this.btnRefs.btn_test_monthly.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.claimTestMonthlyReward();
                return;
            case this.btnRefs.btn_upgrade_collect.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.claimUpgradeReward();
                return;
            case this.btnRefs.btn_month_collect.node.name:
                GlobalCfg.G_COMPONENTS.Audio.playButton();
                this.claimMonthlyReward();
                return;
        }
    },

    applySideNodeScaleForSmallDevice: function() {
        let sideScale = this.isSmallIPhoneResolution() ? 0.85 : 1;
        if (this.leftNode) {
            this.leftNode.scale = sideScale;
        }
        if (this.rightNode) {
            this.rightNode.scale = sideScale;
        }

        this.scheduleOnce(() => {
            this.applySideNodeScaleByOverlap();
        }, 0);
    },

    isSmallIPhoneResolution: function() {
        let visibleSize = cc.view.getVisibleSize();
        let shortSide = Math.min(Number(visibleSize.width || 0), Number(visibleSize.height || 0));
        let longSide = Math.max(Number(visibleSize.width || 0), Number(visibleSize.height || 0));
        let range = shortSide / longSide;
        return range > 0.52;
    },

    applySideNodeScaleByOverlap: function() {
        if (!this.leftNode || !this.rightNode || !cc.isValid(this.leftNode) || !cc.isValid(this.rightNode)) {
            return;
        }

        this.leftNode.scale = 1;
        this.rightNode.scale = 1;

        let leftBox = this.leftNode.getBoundingBoxToWorld();
        let rightBox = this.rightNode.getBoundingBoxToWorld();
        if (!leftBox || !rightBox) {
            return;
        }

        let isOverlap = leftBox.intersects(rightBox) || leftBox.xMax > rightBox.xMin;
        if (!isOverlap) {
            return;
        }

        this.leftNode.scale = 0.85;
        this.rightNode.scale = 0.85;
    },

    refreshAllData: function() {
        this.fetchVipInfo();
        this.fetchVipLevels();
    },

    loadCachedData: function() {
        this.vipInfo = GlobalCfg.USER_DATAS.vip1InfoData || null;
        this.levelConfigData = GlobalCfg.USER_DATAS.vip1LevelConfigData || null;
    },

    fetchVipInfo: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/info`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (!msg || msg.result != 0 || !msg.data) {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'vip info error');
                return;
            }

            this.vipInfo = msg.data;
            GlobalCfg.USER_DATAS.myVipLevel = msg.data.current_level < 0 ? 0 : msg.data.current_level;
            GlobalCfg.USER_DATAS.vip1InfoData = msg.data;
            this.refreshView();
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    fetchVipLevels: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/levels`;
        CommonFun.getInstance().httpGet(httpUrl, (msg) => {
            if (!msg || msg.result != 0 || !msg.data) {
                CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'vip levels error');
                return;
            }

            this.levelConfigData = msg.data;
            GlobalCfg.USER_DATAS.vip1LevelConfigData = msg.data;
            this.resetVipLevelIndex();
            this.refreshView();
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    refreshView: function() {
        this.refreshStaticText();
        this.refreshMyLevelSection();
        this.refreshRewardSection();
        this.refreshVipLevelList();
        this.refreshRequirements();
    },

    refreshStaticText: function() {
        if (this.labelRefs.lab_week_collect) {
            this.labelRefs.lab_week_collect.string = this.getVipRewardActionText('Collect');
        }
        if (this.labelRefs.lab_month_collect) {
            this.labelRefs.lab_month_collect.string = this.getVipRewardActionText('Collect');
        }
        if (this.labelRefs.lab_upgrade_collect) {
            this.labelRefs.lab_upgrade_collect.string = this.getVipRewardActionText('Collect');
        }
    },

    refreshMyLevelSection: function() {
        if (!this.vipInfo) {
            return;
        }

        let currentLevel = Math.max(Number(this.vipInfo.current_level || 0), 0);
        if (this.labelRefs.lab_cur_level) {
            this.labelRefs.lab_cur_level.string = `VIP${currentLevel}`;
        }

        this.updateVipSprite(this.imgVip, currentLevel);

        if (this.labelRefs.lab_remainTime) {
            this.labelRefs.lab_remainTime.string = this.getNeedUpgradeText();
        }

        if (this.lab_need_upgrade) {
            this.lab_need_upgrade.string = this.getNeedUpgradeBetProgressText();
        }
    },

    refreshRewardSection: function() {
        this.refreshWeeklyReward();
        this.refreshMonthlyReward();
        this.refreshUpgradeReward();
    },

    refreshWeeklyReward: function() {
        let reward = this.vipInfo && this.vipInfo.weekly_reward ? this.vipInfo.weekly_reward : null;
        this.setRewardButtonsState(
            this.btnRefs.btn_week_collect,
            this.btnRefs.btn_week_uncollect,
            this.labelRefs.lab_week_collect,
            this.labelRefs.lab_week_uncollect,
            reward
        );
    },

    refreshMonthlyReward: function() {
        let reward = this.vipInfo && this.vipInfo.monthly_reward ? this.vipInfo.monthly_reward : null;
        this.setRewardButtonsState(
            this.btnRefs.btn_month_collect,
            this.btnRefs.btn_month_uncollect,
            this.labelRefs.lab_month_collect,
            this.labelRefs.lab_month_uncollect,
            reward
        );
    },

    refreshUpgradeReward: function() {
        let currentLevel = Math.max(Number(this.vipInfo && this.vipInfo.current_level || 0), 0);
        let reward = this.getFirstUpgradeReward();
        let hasUnclaimedReward = this.hasUnclaimedUpgradeReward();
        if (this.node_root_reward_upgrade) {
            this.node_root_reward_upgrade.active = currentLevel < 30 || hasUnclaimedReward;
        }

        if (currentLevel >= 30 && !hasUnclaimedReward) {
            return;
        }

        if (this.lab_reward_upgrade) {
            let targetLevel = currentLevel + 1;
            if (currentLevel >= 30) {
                targetLevel = reward && reward.level !== undefined && reward.level !== null
                    ? Number(reward.level || 0) + 1
                    : currentLevel;
            }
            this.lab_reward_upgrade.string = this.getUpgradeRewardTipsText(targetLevel);
        }

        this.setRewardButtonsState(
            this.btnRefs.btn_upgrade_collect,
            this.btnRefs.btn_upgrade_uncollect,
            this.labelRefs.lab_upgrade_collect,
            this.labelRefs.lab_upgrade_uncollect,
            reward
        );
    },

    setRewardButtonsState: function(collectBtn, uncollectBtn, collectLabel, uncollectLabel, reward) {
        if (!collectBtn || !uncollectBtn) {
            return;
        }

        let canClaim = !!(reward && reward.claimable && !reward.claimed);
        collectBtn.node.active = canClaim;
        uncollectBtn.node.active = !canClaim;

        if (collectLabel) {
            collectLabel.string = reward && Number(reward.status) == 2
                ? this.getVipRewardActionText('Retry')
                : this.getVipRewardActionText('Collect');
        }

        if (!uncollectLabel) {
            return;
        }

        if (reward && (reward.claimed || Number(reward.status) == 1)) {
            uncollectLabel.string = this.getVipRewardStatusText('Claimed');
            return;
        }

        if (reward && Number(reward.status) == 3) {
            uncollectLabel.string = this.getVipRewardStatusText('Expired');
            return;
        }

        if (reward && Number(reward.status) == 2 && !reward.claimable) {
            uncollectLabel.string = this.getVipRewardStatusText('Retry');
        }
    },

    refreshVipLevelList: function() {
        if (!this.vipItemSlots || this.vipItemSlots.length <= 0) {
            return;
        }

        this.renderVipLevelSlots();
        this.updateVipLevelPageState();
    },

    refreshRequirements: function() {
        let centerLevelConfig = this.getPreviewVipLevelConfig();
        this.refreshRequirementsByLevelConfig(centerLevelConfig);
    },

    refreshRequirementsByLevelConfig: function(centerLevelConfig) {
        if (!centerLevelConfig) {
            return;
        }

        if (this.labelRefs.lab_deposit_total) {
            this.labelRefs.lab_deposit_total.string = this.getVipConditionDepositText(centerLevelConfig);
        }
        if (this.labelRefs.lab_bet_total) {
            this.labelRefs.lab_bet_total.string = this.getVipConditionProgressText(centerLevelConfig);
        }

        this.refreshProgressBarByLevelConfig(centerLevelConfig);
    },

    refreshProgressBar: function() {
        this.refreshProgressBarByLevelConfig(this.getPreviewVipLevelConfig());
    },

    refreshProgressBarByLevelConfig: function(centerLevelConfig) {
        if (!this.progressBar) {
            return;
        }

        let progressSprite = this.progressBar.getComponent(cc.Sprite);
        if (!progressSprite) {
            return;
        }

        let progressValue = this.getNeedUpgradeBetProgressValue();
        progressSprite.fillRange = progressValue;
        if (this.lab_progress) {
            this.lab_progress.string = `${Math.min(100, Math.floor(progressValue * 100))}%`;
        }
    },

    resetVipLevelIndex: function() {
        let list = this.getVipLevelList();
        let currentLevel = Number(this.vipInfo && this.vipInfo.current_level || 0);
        let targetLevel = Math.max(1, Math.min(30, currentLevel + 1));
        this.vipLevelCurrentIndex = this.findVipLevelIndexByLevel(targetLevel);
        if (this.vipLevelCurrentIndex < 0) {
            this.vipLevelCurrentIndex = 0;
        }
        if (this.vipLevelCurrentIndex >= list.length) {
            this.vipLevelCurrentIndex = Math.max(list.length - 1, 0);
        }
    },

    changeVipLevelPage: function(delta) {
        LoggerUtil.getInstance().log(`changeVipLevelPage delta=${delta}`);
        if (this.isVipListAnimating) {
            return;
        }

        if (delta > 0) {
            this.playVipLevelSwitchAnimation(1);
            return;
        }

        if (delta < 0) {
            this.playVipLevelSwitchAnimation(-1);
        }
    },

    claimUpgradeReward: function() {
        let reward = this.getFirstUpgradeReward();
        if (!reward || !reward.claimable || reward.claimed) {
            CommonFun.getInstance().showTips('Reward is not available');
            return;
        }

        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/claim/upgrade`;
        CommonFun.getInstance().httpPost(httpUrl, { level: Number(reward.level || 0) }, (msg) => {
            this.handleClaimResponse(msg);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    claimWeeklyReward: function() {
        let reward = this.vipInfo && this.vipInfo.weekly_reward ? this.vipInfo.weekly_reward : null;
        if (!reward || !reward.claimable || reward.claimed) {
            CommonFun.getInstance().showTips('Reward is not available');
            return;
        }

        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/claim/weekly`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            this.handleClaimResponse(msg);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    claimMonthlyReward: function() {
        let reward = this.vipInfo && this.vipInfo.monthly_reward ? this.vipInfo.monthly_reward : null;
        if (!reward || !reward.claimable || reward.claimed) {
            CommonFun.getInstance().showTips('Reward is not available');
            return;
        }

        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/claim/monthly`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            this.handleClaimResponse(msg);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    claimTestWeeklyReward: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/test/claim/weekly`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            this.handleClaimResponse(msg);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    claimTestMonthlyReward: function() {
        let httpUrl = `${GlobalCfg.HTTP_SERVER}/v1/vip1/test/claim/monthly`;
        CommonFun.getInstance().httpPost(httpUrl, {}, (msg) => {
            this.handleClaimResponse(msg);
        }, null, GlobalCfg.USER_DATAS.BearerToken);
    },

    handleClaimResponse: function(msg) {
        if (!msg || msg.result != 0 || !msg.data) {
            CommonFun.getInstance().showTips(msg && msg.msg ? msg.msg : 'Reward is not available');
            return;
        }

        this.applyTakeRewards(msg.data.take || []);
        this.fetchVipInfo();
    },

    applyTakeRewards: function(takeList) {
        for (let i = 0; i < takeList.length; i++) {
            let item = takeList[i];
            let amount = Number(item.amount || 0);
            if (Number(item.id) == 10) {
                GlobalCfg.USER_DATAS.deposit += amount;
                GlobalCfg.USER_DATAS.userDiamond += amount;
                CommonFun.getInstance().showVipRewardToast(amount / 100, false);
            }
            else if (Number(item.id) == 11) {
                GlobalCfg.USER_DATAS.winnings += amount;
                GlobalCfg.USER_DATAS.userDiamond += amount;
                CommonFun.getInstance().showVipRewardToast(amount / 100, false);
            }
            else if (Number(item.id) == 12) {
                GlobalCfg.USER_DATAS.bonus += amount;
                CommonFun.getInstance().showVipRewardToast(amount / 100, true);
            }
        }

        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.VIP_REWARD,
            msgData: {}
        });
        ClientNotify.send(GlobalCfg.MSG_TYPE.clientMsg, {
            msgCode: GlobalCfg.CLIENT_MSG_ID.GET_MAIL_REWARD,
            msgData: {}
        });
    },

    getNeedUpgradeText: function() {
        if (!this.vipInfo || Number(this.vipInfo.next_level) < 0) {
            return 'Max Level';
        }

        let needDeposit = Number(this.vipInfo.need_deposit_count || 0);
        let needBet = this.formatAmount(this.vipInfo.need_bet_amount || 0);
        return `Deposit ${needDeposit}  Bet ${needBet}`;
    },

    getNeedUpgradeBetProgressText: function() {
        let currentLevel = Number(this.vipInfo && this.vipInfo.current_level || 0);
        if (!this.vipInfo || currentLevel >= 30 || Number(this.vipInfo.next_level) < 0) {
            return '--';
        }

        let currentBet = Number(this.vipInfo.total_bet || 0);
        let needBet = Number(this.vipInfo.need_bet_amount || 0);
        let targetBet = currentBet + needBet;
        return `${currentBet / 100}/${targetBet / 100}`;
    },

    getNeedUpgradeBetProgressValue: function() {
        let currentLevel = Number(this.vipInfo && this.vipInfo.current_level || 0);
        if (!this.vipInfo || currentLevel >= 30 || Number(this.vipInfo.next_level) < 0) {
            return 1;
        }

        let currentBet = Number(this.vipInfo.total_bet || 0);
        let needBet = Number(this.vipInfo.need_bet_amount || 0);
        let targetBet = currentBet + needBet;
        if (targetBet <= 0) {
            return 1;
        }

        return Math.max(0, Math.min(1, currentBet / targetBet));
    },

    getFirstUpgradeReward: function() {
        let list = this.vipInfo && this.vipInfo.upgrade_rewards ? this.vipInfo.upgrade_rewards : [];
        if (!list || list.length <= 0) {
            return null;
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i] && list[i].claimable && !list[i].claimed) {
                return list[i];
            }
        }

        return list[0];
    },

    hasUnclaimedUpgradeReward: function() {
        let list = this.vipInfo && this.vipInfo.upgrade_rewards ? this.vipInfo.upgrade_rewards : [];
        if (!list || list.length <= 0) {
            return false;
        }

        for (let i = 0; i < list.length; i++) {
            if (list[i] && !list[i].claimed) {
                return true;
            }
        }

        return false;
    },

    getNextLevelConfig: function() {
        let list = this.levelConfigData && this.levelConfigData.list ? this.levelConfigData.list : [];
        let nextLevel = this.vipInfo ? Number(this.vipInfo.next_level || -1) : -1;
        for (let i = 0; i < list.length; i++) {
            if (Number(list[i].level) == nextLevel) {
                return list[i];
            }
        }

        return null;
    },

    formatAmount: function(amount) {
        return `${CommonFun.getInstance().numberToShow(Number(amount || 0) / 100, 1)}`;
    },

    cacheVipItemSlots: function() {
        this.vipItemSlots = [];
        this.vipItemBasePositions = [];

        if (!this.vipContent) {
            return;
        }

        let slots = [];
        for (let i = 0; i < this.vipContent.childrenCount; i++) {
            let child = this.vipContent.children[i];
            if (child.name.indexOf('item') !== 0) {
                continue;
            }

            slots.push({
                node: child,
                label: this.getLabelByName(child, 'lab_lv'),
                sprite: child.getComponent(cc.Sprite),
            });
        }

        slots.sort((a, b) => {
            let aIndex = Number((a.node.name || '').replace('item', '')) || 0;
            let bIndex = Number((b.node.name || '').replace('item', '')) || 0;
            return aIndex - bIndex;
        });

        this.vipItemSlots = slots;
        this.vipItemBasePositions = this.buildVipItemBasePositions(slots);
        this.applyVipItemBasePositions();
    },

    buildVipItemBasePositions: function(slots) {
        let centerY = 0;
        if (slots.length > 0 && slots[0].node) {
            centerY = slots[0].node.y;
        }

        this.vipTrackY = centerY;
        return this.vipTrackDisplayX.map((x) => cc.v2(x, centerY));
    },

    applyVipItemBasePositions: function() {
        for (let i = 0; i < this.vipItemSlots.length && i < this.vipItemBasePositions.length; i++) {
            this.vipItemSlots[i].node.setPosition(this.vipItemBasePositions[i]);
        }
    },

    getVipLevelList: function() {
        let list = this.levelConfigData && this.levelConfigData.list ? this.levelConfigData.list : [];
        return list.filter((item) => Number(item && item.level || 0) >= 1);
    },

    findVipLevelIndexByLevel: function(level) {
        let list = this.getVipLevelList();
        for (let i = 0; i < list.length; i++) {
            if (Number(list[i].level || 0) === Number(level || 0)) {
                return i;
            }
        }

        return -1;
    },

    getVipLevelDataByOffset: function(offset) {
        let list = this.getVipLevelList();
        let targetIndex = this.vipLevelCurrentIndex + offset;
        if (targetIndex < 0 || targetIndex >= list.length) {
            return null;
        }

        return list[targetIndex];
    },

    getCenterVipLevelConfig: function() {
        let centerSlot = this.getVipItemSlotByX(0);
        if (!centerSlot) {
            return this.getVipLevelDataByOffset(0);
        }

        let centerLevel = Number(centerSlot.currentLevel || 0);
        if (centerLevel <= 0) {
            return this.getVipLevelDataByOffset(0);
        }

        let list = this.getVipLevelList();
        for (let i = 0; i < list.length; i++) {
            if (Number(list[i].level || 0) == centerLevel) {
                return list[i];
            }
        }

        return this.getVipLevelDataByOffset(0);
    },

    getPreviewVipLevelConfig: function() {
        let list = this.getVipLevelList();
        if (this.vipAnimatingTargetIndex >= 0 && this.vipAnimatingTargetIndex < list.length) {
            return list[this.vipAnimatingTargetIndex];
        }

        return this.getCenterVipLevelConfig();
    },

    getVipConditionDepositText: function(item) {
        let currentDepositCount = Number(this.vipInfo && this.vipInfo.deposit_count || 0);
        let requiredDepositCount = this.getVipConditionDepositValue(item);
        return `${currentDepositCount}/${requiredDepositCount}`;
    },

    getVipConditionBetText: function(item) {
        return this.formatAmount(this.getVipConditionBetAmount(item));
    },

    getVipConditionProgressText: function(item) {
        let currentBet = `${Number(this.vipInfo && this.vipInfo.total_bet || 0) / 100}`;
        let targetBet = `${Number(this.getVipConditionBetAmount(item) || 0) / 100}`;
        return `${currentBet} / ${targetBet}`;
    },

    getVipConditionProgressValue: function(item) {
        let currentBet = Number(this.vipInfo && this.vipInfo.total_bet || 0);
        let targetBet = this.getVipConditionBetAmount(item);
        if (targetBet <= 0) {
            return 1;
        }

        return currentBet / targetBet;
    },

    getVipConditionProgressFillRange: function() {
        if (!this.labelRefs.lab_bet_total) {
            return 1;
        }

        let text = `${this.labelRefs.lab_bet_total.string || ''}`;
        let valueArr = text.split('/');
        if (valueArr.length < 2) {
            return 1;
        }

        let currentValue = this.parseVipProgressNumber(valueArr[0]);
        let targetValue = this.parseVipProgressNumber(valueArr[1]);
        if (targetValue <= 0) {
            return 1;
        }

        return Math.max(0, Math.min(1, currentValue / targetValue));
    },

    parseVipProgressNumber: function(text) {
        let cleanText = `${text || ''}`.replace(/,/g, '').trim();
        let value = Number(cleanText);
        if (isNaN(value)) {
            return 0;
        }

        return value;
    },

    getVipConditionDepositValue: function(item) {
        if (!item) {
            return 0;
        }

        if (item.recharge !== undefined && item.recharge !== null) {
            return Number(item.recharge || 0);
        }
        if (item.deposit_amount_required !== undefined && item.deposit_amount_required !== null) {
            return Number(item.deposit_amount_required || 0);
        }
        if (item.deposit_required !== undefined && item.deposit_required !== null) {
            return Number(item.deposit_required || 0);
        }
        if (item.deposit_count_required !== undefined && item.deposit_count_required !== null) {
            return Number(item.deposit_count_required || 0);
        }
        if (item.deposit_count !== undefined && item.deposit_count !== null) {
            return Number(item.deposit_count || 0);
        }
        return 0;
    },

    isVipConditionCurrencyDeposit: function(item) {
        if (!item) {
            return false;
        }

        return item.recharge !== undefined && item.recharge !== null
            || item.deposit_amount_required !== undefined && item.deposit_amount_required !== null
            || item.deposit_required !== undefined && item.deposit_required !== null;
    },

    getVipConditionBetAmount: function(item) {
        if (!item) {
            return 0;
        }

        if (item.bet_amount_required !== undefined && item.bet_amount_required !== null) {
            return Number(item.bet_amount_required || 0);
        }
        if (item.need_bet_amount !== undefined && item.need_bet_amount !== null) {
            return Number(item.need_bet_amount || 0);
        }
        return 0;
    },

    renderVipLevelSlots: function() {
        for (let i = 0; i < this.vipItemSlots.length; i++) {
            this.renderVipItemSlotByPosition(this.vipItemSlots[i]);
        }
        this.refreshVipItemColors();
    },

    renderVipItemSlotByPosition: function(slot) {
        if (!slot || !slot.node) {
            return;
        }

        let offset = this.getVipLevelOffsetByX(slot.node.x);
        let itemData = this.getVipLevelDataByOffset(offset);
        this.renderVipItemSlot(slot, itemData);
    },

    renderVipItemSlot: function(slot, itemData) {
        if (!slot || !slot.node) {
            return;
        }

        slot.node.active = !!itemData;
        slot.currentLevel = itemData ? Number(itemData.level || 0) : 0;
        if (!itemData) {
            return;
        }

        if (slot.label) {
            slot.label.string = `VIP${Number(itemData.level || 0)}`;
        }

        this.updateVipSprite(slot.sprite, itemData.level);
    },

    refreshVipItemColors: function() {
        for (let i = 0; i < this.vipItemSlots.length; i++) {
            let slot = this.vipItemSlots[i];
            if (!slot || !slot.node) {
                continue;
            }

            if (!slot.node.active) {
                continue;
            }

            let isCenterItem = Math.abs(slot.node.x) <= 1;
            slot.node.color = isCenterItem ? this.vipItemNormalColor : this.vipItemGrayColor;
        }
    },

    updateVipLevelPageState: function() {
        let list = this.getVipLevelList();
        let hasPrev = this.vipLevelCurrentIndex > 0;
        let hasNext = this.vipLevelCurrentIndex < list.length - 1;

        if (this.btn_last) {
            this.btn_last.interactable = hasPrev;
            this.btn_last.enableAutoGrayEffect = true;
        }
        if (this.btn_next) {
            this.btn_next.interactable = hasNext;
            this.btn_next.enableAutoGrayEffect = true;
        }

        for (let i = 0; i < this.vipItemSlots.length; i++) {
            this.renderVipItemSlotByPosition(this.vipItemSlots[i]);
        }

        this.updateVipEdgeItemVisibleByCenter();
    },

    playVipLevelSwitchAnimation: function(direction) {
        let list = this.getVipLevelList();
        if (this.vipItemSlots.length !== 4 || list.length <= 0) {
            return;
        }

        let nextIndex = this.vipLevelCurrentIndex + direction;
        if (nextIndex < 0 || nextIndex >= list.length) {
            this.vipAnimatingTargetIndex = -1;
            this.updateVipLevelPageState();
            return;
        }

        this.vipAnimatingTargetIndex = nextIndex;
        this.refreshRequirementsByLevelConfig(list[nextIndex]);

        this.isVipListAnimating = true;
        cc.Tween.stopAllByTarget(this.vipContent);
        for (let i = 0; i < this.vipItemSlots.length; i++) {
            this.vipItemSlots[i].node.active = true;
            cc.Tween.stopAllByTarget(this.vipItemSlots[i].node);
        }

        let duration = this.vipLevelTweenDuration;
        this.prepareVipRecycleNode(direction);

        if (direction > 0) {
            this.playVipNextTween(duration, nextIndex);
            return;
        }

        this.playVipPrevTween(duration, nextIndex);
    },

    playVipNextTween: function(duration, nextIndex) {
        this.playVipShiftTween(-this.vipTrackStepX, duration, nextIndex);
    },

    playVipPrevTween: function(duration, nextIndex) {
        this.playVipShiftTween(this.vipTrackStepX, duration, nextIndex);
    },

    playVipShiftTween: function(deltaX, duration, nextIndex) {
        for (let i = 0; i < this.vipItemSlots.length; i++) {
            let node = this.vipItemSlots[i].node;
            let targetX = node.x + deltaX;
            let targetY = this.vipTrackY;
            node.stopAllActions();
            let moveAction = cc.moveTo(duration, targetX, targetY).easing(cc.easeSineInOut());
            node.runAction(moveAction);
        }

        this.node.stopAllActions();
        this.node.runAction(
            cc.sequence(
                cc.delayTime(duration),
                cc.callFunc(() => {
                    this.vipLevelCurrentIndex = nextIndex;
                    this.vipAnimatingTargetIndex = -1;
                    this.sortVipItemSlotsByX();
                    this.applyVipItemBasePositions();
                    this.renderVipLevelSlots();
                    this.updateVipLevelPageState();
                    this.refreshRequirements();
                    this.isVipListAnimating = false;
                })
            )
        );
    },

    prepareVipRecycleNode: function(direction) {
        if (direction > 0) {
            let leftVisibleSlot = this.getVipItemSlotByX(this.vipTrackDisplayX[0]);
            if (!leftVisibleSlot) {
                return;
            }

            leftVisibleSlot.node.setPosition(this.vipTrackHiddenRightX, this.vipTrackY);
            this.renderVipItemSlot(leftVisibleSlot, this.getVipLevelDataByOffset(3));
            return;
        }

        let rightVisibleSlot = this.getVipItemSlotByX(this.vipTrackDisplayX[this.vipTrackDisplayX.length - 1]);
        if (!rightVisibleSlot) {
            return;
        }

        rightVisibleSlot.node.setPosition(this.vipTrackHiddenLeftX, this.vipTrackY);
        this.renderVipItemSlot(rightVisibleSlot, this.getVipLevelDataByOffset(-2));
    },

    sortVipItemSlotsByX: function() {
        this.vipItemSlots.sort((a, b) => a.node.x - b.node.x);
    },

    getVipItemSlotByX: function(targetX) {
        for (let i = 0; i < this.vipItemSlots.length; i++) {
            if (Math.abs(this.vipItemSlots[i].node.x - targetX) <= 1) {
                return this.vipItemSlots[i];
            }
        }

        return null;
    },

    updateVipEdgeItemVisibleByCenter: function() {
        let list = this.getVipLevelList();
        if (list.length <= 0) {
            return;
        }

        let leftSlot = this.getVipItemSlotByX(-300);
        let centerSlot = this.getVipItemSlotByX(0);
        let midRightSlot = this.getVipItemSlotByX(300);
        let rightSlot = this.getVipItemSlotByX(600);

        // 姣忔鏍规嵁褰撳墠浣嶇疆鍜岀粦瀹氱殑 level 寮哄埗鎭㈠鏄剧ず鐘舵€侊紝閬垮厤鏌愪釜 item 琚殣钘忓悗娌℃湁琚噸鏂版媺璧锋潵銆?
        if (leftSlot) {
            leftSlot.node.active = !!leftSlot.currentLevel;
        }
        if (centerSlot) {
            centerSlot.node.active = !!centerSlot.currentLevel;
        }
        if (midRightSlot) {
            midRightSlot.node.active = !!midRightSlot.currentLevel;
        }
        if (rightSlot) {
            rightSlot.node.active = !!rightSlot.currentLevel;
        }

        if (!centerSlot) {
            return;
        }

        let firstLevel = Number(list[0].level || 0);
        let lastLevel = Number(list[list.length - 1].level || 0);
        let centerLevel = Number(centerSlot.currentLevel || 0);

        if (leftSlot && centerLevel == firstLevel) {
            leftSlot.node.active = false;
        }

        if (rightSlot && centerLevel == lastLevel) {
            rightSlot.node.active = false;
        }
    },

    getVipLevelOffsetByX: function(posX) {
        let roundedX = Math.round(posX / this.vipTrackStepX) * this.vipTrackStepX;
        switch (roundedX) {
            case -600:
                return -2;
            case -300:
                return -1;
            case 0:
                return 0;
            case 300:
                return 1;
            case 600:
                return 2;
            case 900:
                return 3;
            default:
                return Math.round(posX / this.vipTrackStepX);
        }
    },

    updateVipSprite: function(target, level) {
        if (!target || !this.atlas_vip) {
            return;
        }

        let sprite = target instanceof cc.Sprite ? target : target.getComponent(cc.Sprite);
        if (!sprite) {
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

    getComponentByNodeName: function(name, componentType) {
        let child = this.findChildByName(this.node, name);
        return child ? child.getComponent(componentType) : null;
    },

    getButtonByName: function(root, name) {
        let child = this.findChildByName(root, name);
        return child ? child.getComponent(cc.Button) : null;
    },

    getLabelByName: function(root, name) {
        let child = this.findChildByName(root, name);
        return child ? child.getComponent(cc.Label) : null;
    },

    getButtonLabel: function(button) {
        if (!button || !button.node) {
            return null;
        }

        let labelNode = this.findChildByName(button.node, 'Label');
        return labelNode ? labelNode.getComponent(cc.Label) : null;
    },

    getUpgradeRewardTipsText: function(nextLevel) {
        let languageIndex = Number(window.language || 1);
        let textMap = {
            1: `Claimable at VIP${nextLevel}`,
            2: `VIP${nextLevel} पर दावा किया जा सकता है`,
            3: `VIP${nextLevel} پر کلیم کیا جا سکتا ہے`,
            4: `VIP${nextLevel} এ ক্লেইম করা যাবে`,
        };

        return textMap[languageIndex] || textMap[1];
    },

    getVipRewardStatusText: function(textKey) {
        let languageIndex = Number(window.language || 1);
        let textMap = {
            Claimed: {
                1: 'Claimed',
                2: 'क्लेम किया गया',
                3: 'کلیم کر لیا گیا',
                4: 'দাবি করা হয়েছে',
            },
            Expired: {
                1: 'Expired',
                2: 'समाप्त',
                3: 'میعاد ختم',
                4: 'মেয়াদ শেষ',
            },
            Retry: {
                1: 'Retry',
                2: 'पुनः प्रयास करें',
                3: 'دوبارہ کوشش کریں',
                4: 'আবার চেষ্টা করুন',
            },
        };

        let config = textMap[textKey] || {};
        return config[languageIndex] || config[1] || '';
    },

    getVipRewardActionText: function(textKey) {
        let languageIndex = Number(window.language || 1);
        let textMap = {
            Collect: {
                1: 'Collect',
                2: 'क्लेम',
                3: 'کلیم',
                4: 'দাবি',
            },
            Retry: {
                1: 'Retry',
                2: 'पुनः प्रयास करें',
                3: 'دوبارہ کوشش کریں',
                4: 'আবার চেষ্টা করুন',
            },
        };

        let config = textMap[textKey] || {};
        return config[languageIndex] || config[1] || '';
    },

    getChildrenByPrefix: function(root, prefix) {
        if (!root) {
            return [];
        }

        let result = [];
        for (let i = 0; i < root.childrenCount; i++) {
            let child = root.children[i];
            if (child.name.indexOf(prefix) === 0) {
                result.push(child);
            }
        }

        result.sort((a, b) => a.x - b.x);
        return result;
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
