cc.Class({
    extends: cc.Component,

    properties: {
        toggleContainerLang: cc.ToggleContainer,
        lab_linksTips: cc.Label,
        lab_btnOtherSupport: cc.Label,
        btn_close: cc.Button,
        btn_othersSupport: cc.Button,
        scrollView_itemParent: cc.ScrollView,
        prefab_enumItem: cc.Prefab,
        prefab_answerItem: cc.Prefab,
        node_enumMain: cc.Node,

        node_text: cc.Node,
        lab_textTitle: cc.Label,
        lab_textMain: cc.Label,
        lab_textPS: cc.Label,
    },

    ctor: function() {
        this.hindi = {
            "lab_linksTips": "jaldi Sampark Kare",
            "lab_btnOtherSupport": "<<Dusra koi sahayata sir",

            "enum_rechargeTips": "recharge ke liye help",
            "enum_withdrawalTips": "withdraw ke liye help",
            "enum_rewardTips": "welcome reward",
            "enum_winningsTips": "jeet ke baare mein",
            "enum_depositTips": "jama nakad ke baare mein",

            "answer_rechargeTips": {
                0: "aap kish tarah se recharge kare?",
                1: "paise nahin receive hua hai",
            },
            "answer_withdrawalTips": {
                0: "paise kaise withdraw kare game se?",
                1: "withdraw ka minimum amount kya hai?",
                2: "paise withdraw mein kitana samay lagata hai?",
                3: "withdraw fill kare",
                4: "withdraw status finished lekin paise recieve na hua",
            },
            "answer_rewardTips": {
                0: "welcome reward",
            },
            "answer_winningsTips": {
                0: "jeet ke baare mein",
                1: "vining kaish kaise praapt karen?",
            },
            "answer_depositTips": {
                0: "jama nakad kya hai?",
                1: "jama nakad kaise praapt karen",
            },


            "text_rechargeTips": {
                0: "kripya khel mein aavashyak raashi aur payment method choose karein, payment ke baad kripya apne paise kelie apne game khaate mein aane ke lie 3-10 minuts wait karen, main aapke sukhad khel ka kamna karta hoon.",
                1: "kripya 3-10 minut wait kareinshaayad arrival mein delay ho sakta hai. yadi game ko refresh karne ke baad bhi aapkap aise nahin milta hainto kripya apna sucessfull payment screenshot upload karne ke lie“abhi bhi madad ki zaroorat hai",
            },
            "text_withdrawalTips": {
                0: "Hello, 200 recharge karne ke bad aur agar apki jeetne ki rashi 500 rs ho jati hai toh apko kyc karna jaruri hai… kripya correct bank account number、Email、Mobile and IFSC/UPI id ko fill kare..thanks",
                1: "Minimum withdraw 500 haimaximum withdraw amount10000rs hai,aur number of withdraw ka koi sheema nahi hai.",
                2: "Withdraw kee sameeksha mein 30-60 minuts lagate hain aur bank ka processing timing mein 3-7 working days lagate hain. kripya dhairya poorvak wait karein,usually72 hrs ke bheetar poora kiya jaata hai.pratyekwithdraw bank ka alag-alag processing time hota haiaapka paisa bahut surakshit haichinta na karein.",
                3: "1 banking system mein utaar-chadhaav ke karan aapkee withdraw amount aapke khel mein vaapas aa jaatee hai, aap phir se vaapas le sakate hainya kripya bank account number ko change ka prayaas karen. \n2 aapke bank account card ki information galat bhare gayi hai,kripya apne bank account number ki information check karewithdraw ke baad bank ki information sahee tarike se bhari gayi hai. \n3 system yah pata lagata hai ki aapke haath mein user dhokha de rahe hainaapka paisa handling charge deduct karke wapas kar diya gaya hai,aapko phir se game khelne ke baad withdraw lene ki aavashykta hai. \n4.aapaka eemel aur phon kol vaastavik hona chaahie",
                4: "withdraw pura hone ke baadkripya 24 ghante wait karein, account me transfer hone mein thoda late ho sakta hai. yadi apko 24 hrs ke baad bhi money receive nahin hua haito kripya apne withdraw status ka screenshot upload karne ke lie \"abhi bhi help ki aavashyakata hai\" ka select kareinaur kripya ush screenshot mein withdraw ko mark karein jo amount abhi tak receive nahi kiya hai..thanks",
            },
            "text_rewardTips": {
                0: "Hello, welcome reward ke liye 500ra ka recharge karna hai aur total amount 800rs. \n500Cash + 300Bonus",
            },
            "text_winningsTips": {
                0: "gem jeeten aur paisa vingings ko traansaphar kar diya jaega.",
                1: "jeetana nakad vah nakad hai jise aapane nakad khelon mein jeeta hai aap nakad khel khelane ke lie jeet nakad aur jama nakad ka upayog kar sakate hain.",
            },
            "text_depositTips": {
                0: "jama nakad vah nakad hai jise aap apane batue mein jodate hain kaish gem ke lie bhugataan karane ke lie aap dipozit kaish vith vining kaish ka upayog kar sakate hain.",
                1: "aap richaarj, ivent kalekshan aur bonas rivord kalekshan ke maadhyam se adhik dipojit kaish praapt kar sakate hain.",
            },

            "ps_rechargeTips": {
                0: "",
                1: "",
            },
            "ps_withdrawalTips": {
                0: "",
                1: "",
                2: "",
                3: "",
                4: "",
            },
            "ps_rewardTips": {
                0: "",
            },
            "ps_winningsTips": {
                0: "",
                1: "Note: aap apanee jeetee huee nakadee nikaal sakate hain nakad nikaalane se pahale aapako apane khaate ko richaarj aur sakriy karana hoga.",
            },
            "ps_depositTips": {
                0: "Note: aap apana jama nakad vaapas nahin le sakate.",
                1: "",
            },
        };
        this.english = {
            "lab_linksTips": "Quick Links",
            "lab_btnOtherSupport": "<<Others Support",

            "enum_rechargeTips": "Recharge help",
            "enum_withdrawalTips": "Withdrawal help",
            "enum_rewardTips": "Welcome reward",
            "enum_winningsTips": "About Winnings",
            "enum_depositTips": "About Deposit Cash",

            "answer_rechargeTips": {
                0: "How to add cash?",
                1: "Add not receive",
            },
            "answer_withdrawalTips": {
                0: "How to withdraw cash?",
                1: "What is the minimum withdrawal amount?",
                2: "How long does it take to withdraw money?",
                3: "Withdraw filed",
                4: "Withdraw finsh but not receive money",
            },
            "answer_rewardTips": {
                0: "Welcome reward",
            },
            "answer_winningsTips": {
                0: "About Winnings",
                1: "How to get Winnings Cash?",
            },
            "answer_depositTips": {
                0: "What is Deposit Cash?",
                1: "How to get Deposit Cash",
            },

            "text_rechargeTips": {
                0: "Pease choose the amount and payment method youneed in the game, after payment please wait 3-10 minutes for your money to arive in your game account, I wish you a pleasant game.",
                1: "Please wait 3-10 minutes, maybe the arrival delay. If you still do not receive money after refreshing the game please click \"Whatsapp Service\" to upload your successful payment voucher which needs to contain the payment time, payment amount payee information,UTR or UPI payment number or upi transcation number",
            },
            "text_withdrawalTips": {
                0: "Hello, after you recharge 200 and the amount you win reaches 500,you need to KYC first, fill in your correct bank card、 Email、Mobile and IFSC/UPI information to withdraw.",
                1: "The minimum withdrawal amount is 500, the maximum withdrawal amount is 10000and there is no limit to the number of withdrawals.",
                2: "The withdrawal review takes 30-60 minutesand the bank processing period takes 3-7workdays. Please wait patiently. Usually completed within 72 hours Each withdrawal bank has different processing time, your money is very safe, don't worry.",
                3: "1 Due to fluctuations in the banking system your withdrawal amount is all returned to your gameyou can withdraw again, or please try to replace the bank card. \n2 Your bank card information is filled in incorrectly please check your bank card informationthe bank information is filled in correctly after the withdrawal. \n3 The system detects that there are users cheating in your hand, your money is returned after deducting the handling fee,you need to withdraw after playing the game again. \n4.Your email and phone calls must be real",
                4: "After the withdrawal is completedplease wait 24 hours there may be a delay in arriving.If you have not received money after 24 hoursplease select \"Whatsapp Service\" to upload a screenshot of your withdrawal pageand please mark the withdrawal in the screenshot which one you have not received money.",
            },
            "text_rewardTips": {
                0: "Hello,the welcome reward is to recharge 500 and the total amount is 800. 500Cash + 300Bonus",
            },
            "text_winningsTips": {
                0: "Win the game and the money will be transferred to Wingnings.",
                1: "Winnings Cash is the Cash that you have won in cash gamesYou can use Winnings Cash and DepositCash to play for cash games.",
            },
            "text_depositTips": {
                0: "Deposit Cash is the Cash that you add to your wallet. You can use Deposit Cash with Winnings Cash to pay for cash games",
                1: "You can get more Deposit Cash through recharge, event collection, and Bonus reward collection.",
            },


            "ps_rechargeTips": {
                0: "Note: You can get more cash by selecting recharge activities",
                1: "",
            },
            "ps_withdrawalTips": {
                0: "",
                1: "",
                2: "",
                3: "",
                4: "",
            },
            "ps_rewardTips": {
                0: "",
            },
            "ps_winningsTips": {
                0: "",
                1: "Note: You can withdraw you Winnings Cash You must recharge andactivate your account beforeou can withdraw cash.",
            },
            "ps_depositTips": {
                0: "Note: You can not withdraw your Deposit Cash.",
                1: "",
            },
        };
        this.bengali = {
            "lab_linksTips": "দ্রুত যোগাযোগ করুন",
            "lab_btnOtherSupport": "<<অন্য কোনো সহায়তা",

            "enum_rechargeTips": "রিচার্জের সহায়তা",
            "enum_withdrawalTips": "উত্তোলনের সহায়তা",
            "enum_rewardTips": "স্বাগতম পুরস্কার",
            "enum_winningsTips": "জয়ের সম্পর্কে",
            "enum_depositTips": "জমা নগদ সম্পর্কে",

            "answer_rechargeTips": {
                0: "আপনি কীভাবে রিচার্জ করবেন?",
                1: "টাকা এখনও পাইনি",
            },
            "answer_withdrawalTips": {
                0: "গেম থেকে কীভাবে টাকা উত্তোলন করবেন?",
                1: "উত্তোলনের ন্যূনতম পরিমাণ কত?",
                2: "উত্তোলনে কত সময় লাগে?",
                3: "উত্তোলন ফর্ম পূরণ করুন",
                4: "উত্তোলনের স্ট্যাটাস সম্পন্ন, কিন্তু টাকা পাইনি",
            },
            "answer_rewardTips": {
                0: "স্বাগতম পুরস্কার",
            },
            "answer_winningsTips": {
                0: "জয়ের সম্পর্কে",
                1: "জেতা নগদ কীভাবে পাওয়া যায়?",
            },
            "answer_depositTips": {
                0: "জমা নগদ কী?",
                1: "জমা নগদ কীভাবে পাওয়া যায়?",
            },

            "text_rechargeTips": {
                0: "অনুগ্রহ করে গেমে প্রয়োজনীয় পরিমাণ এবং পেমেন্ট পদ্ধতি নির্বাচন করুন। পেমেন্টের পরে আপনার গেম অ্যাকাউন্টে টাকা আসার জন্য 3-10 মিনিট অপেক্ষা করুন। আপনার সুখকর খেলা কামনা করি।",
                1: "অনুগ্রহ করে 3-10 মিনিট অপেক্ষা করুন, হয়তো টাকা পৌঁছাতে দেরি হচ্ছে। গেম রিফ্রেশ করার পরও যদি টাকা না পান, তাহলে সফল পেমেন্টের স্ক্রিনশট আপলোড করতে “এখনও সহায়তা প্রয়োজন” নির্বাচন করুন।",
            },
            "text_withdrawalTips": {
                0: "হ্যালো, 200 রিচার্জ করার পরে যদি আপনার জেতা টাকার পরিমাণ 500 রুপি হয়, তাহলে KYC করা জরুরি। অনুগ্রহ করে সঠিক ব্যাংক অ্যাকাউন্ট নম্বর, ইমেল, মোবাইল এবং IFSC/UPI ID পূরণ করুন। ধন্যবাদ।",
                1: "ন্যূনতম উত্তোলন 500 এবং সর্বোচ্চ উত্তোলনের পরিমাণ 10000 রুপি। উত্তোলনের সংখ্যার কোনো সীমা নেই।",
                2: "উত্তোলন পর্যালোচনায় 30-60 মিনিট লাগে এবং ব্যাংকের প্রসেসিং সময়ে 3-7 কর্মদিবস লাগতে পারে। অনুগ্রহ করে ধৈর্য ধরে অপেক্ষা করুন, সাধারণত 72 ঘণ্টার মধ্যে সম্পন্ন হয়। প্রতিটি ব্যাংকের প্রসেসিং সময় ভিন্ন হতে পারে। আপনার টাকা সম্পূর্ণ নিরাপদ, চিন্তা করবেন না।",
                3: "1. ব্যাংকিং সিস্টেমের ওঠানামার কারণে আপনার উত্তোলনের টাকা আবার গেমে ফিরে আসতে পারে। আপনি আবার উত্তোলন করতে পারেন অথবা ব্যাংক অ্যাকাউন্ট নম্বর পরিবর্তন করে চেষ্টা করুন। \n2. আপনার ব্যাংক অ্যাকাউন্ট কার্ডের তথ্য ভুল দেওয়া হয়েছে। অনুগ্রহ করে আপনার ব্যাংক অ্যাকাউন্টের তথ্য যাচাই করুন এবং উত্তোলনের পরে ব্যাংকের তথ্য সঠিকভাবে পূরণ হয়েছে কিনা দেখুন। \n3. সিস্টেম যদি সনাক্ত করে যে ব্যবহারকারী প্রতারণা করছে, তাহলে হ্যান্ডলিং চার্জ কেটে টাকা ফেরত দেওয়া হবে। আপনাকে আবার গেম খেলার পরে উত্তোলন করতে হবে। \n4. আপনার ইমেল এবং ফোন নম্বর অবশ্যই বাস্তব হতে হবে।",
                4: "উত্তোলন সম্পন্ন হওয়ার পরে অনুগ্রহ করে 24 ঘণ্টা অপেক্ষা করুন, অ্যাকাউন্টে টাকা পৌঁছাতে সামান্য দেরি হতে পারে। 24 ঘণ্টার পরও যদি টাকা না পান, তাহলে আপনার উত্তোলনের স্ট্যাটাসের স্ক্রিনশট আপলোড করতে “এখনও সহায়তা প্রয়োজন” নির্বাচন করুন এবং যে উত্তোলনের টাকা এখনও পাননি তা স্ক্রিনশটে চিহ্নিত করুন। ধন্যবাদ।",
            },
            "text_rewardTips": {
                0: "হ্যালো, স্বাগতম পুরস্কারের জন্য 500 রুপি রিচার্জ করতে হবে এবং মোট পরিমাণ 800 রুপি। \n500 নগদ + 300 বোনাস",
            },
            "text_winningsTips": {
                0: "গেমে জিতলে টাকা জয়ের ব্যালেন্সে স্থানান্তর করা হবে।",
                1: "জেতা নগদ হল সেই টাকা যা আপনি নগদ গেমে জিতেছেন। আপনি নগদ গেম খেলতে জেতা নগদ এবং জমা নগদ ব্যবহার করতে পারেন।",
            },
            "text_depositTips": {
                0: "জমা নগদ হল সেই টাকা যা আপনি আপনার ওয়ালেটে যোগ করেন। নগদ গেমের জন্য পেমেন্ট করতে আপনি জমা নগদ ও জেতা নগদ ব্যবহার করতে পারেন।",
                1: "আপনি রিচার্জ, ইভেন্ট সংগ্রহ এবং বোনাস পুরস্কার সংগ্রহের মাধ্যমে আরও জমা নগদ পেতে পারেন।",
            },

            "ps_rechargeTips": {
                0: "",
                1: "",
            },
            "ps_withdrawalTips": {
                0: "",
                1: "",
                2: "",
                3: "",
                4: "",
            },
            "ps_rewardTips": {
                0: "",
            },
            "ps_winningsTips": {
                0: "",
                1: "নোট: আপনি আপনার জেতা নগদ উত্তোলন করতে পারেন। নগদ উত্তোলনের আগে আপনাকে আপনার অ্যাকাউন্ট রিচার্জ ও সক্রিয় করতে হবে।",
            },
            "ps_depositTips": {
                0: "নোট: আপনি আপনার জমা নগদ ফেরত তুলতে পারবেন না।",
                1: "",
            },
        };

        this.curLang = "bengali";
        this.enumItemNodeArr = [];
        this.answerItemNodeArr = [];
        this.curLevelTagArr = [];
        this.curTextTagArr = [];
    },

    onLoad: function() {
        let w = cc.view.getVisibleSize().width;
        let h = cc.view.getVisibleSize().height;
        this.node.setContentSize(w, h);
        this.node.setPosition(cc.v2(w/2, h/2));

        this.btn_close.node.on('click', this.clickCallback, this);
        this.btn_othersSupport.node.on('click', this.clickCallback, this);

        let toggleItems = this.toggleContainerLang.toggleItems;
        for (let i = 0, len = toggleItems.length; i < len; i++) {
            let toggleItem = toggleItems[i];
            toggleItem.node.on('toggle', this.toggleCallback, this);
        };

        if (toggleItems[0].isChecked == true) {
            this.curLang = "hindi";
        }
        else if (toggleItems[1].isChecked == true) {
            this.curLang = "bengali";
        }
        else {
            this.curLang = "english";
        };
        this.setLangByCurLang();

        this.node_enumMain.active = true;
        this.node_text.active = false;
        this.btn_othersSupport.node.active = false;
    },

    start: function() {
        let curLang = this.curLang;
        let enumItemTypeArr = ["rechargeTips", "withdrawalTips", "rewardTips", "winningsTips", "depositTips"];
        let len = enumItemTypeArr.length;
        let index = 0;
        let addEnumItem = function() {
            let enumItemType = enumItemTypeArr[index];
            let enumItemNode = cc.instantiate(this.prefab_enumItem);
            let enumItemCtrl = enumItemNode.getComponent("ShopInstructionsEnumItemCtrl");
            enumItemCtrl.setZhuKeFuCtrl(this);
            enumItemCtrl.setBtnTipsLanguageType(curLang);
            enumItemCtrl.setBtnTipsEumeType(enumItemType);
            enumItemCtrl.showBtnTipsStr();
            this.enumItemNodeArr.push(enumItemNode);
            this.scrollView_itemParent.content.addChild(enumItemNode);

            index += 1;
            if (index == len) {
                this.unschedule(addEnumItem);
                return;
            };
        };
        this.schedule(addEnumItem, 0.1, len - 1, 0);

        let len1 = 5;
        let index1 = 0;
        let addAnswerItem = function() {
            let answerItemNode = cc.instantiate(this.prefab_answerItem);
            answerItemNode.active = false;
            let answerItemCtrl = answerItemNode.getComponent("ShopInstructionsAnswerItemCtrl");
            answerItemCtrl.setZhuKeFuCtrl(this);
            this.answerItemNodeArr.push(answerItemNode);
            this.scrollView_itemParent.content.addChild(answerItemNode);

            index1 += 1;
            if (index1 == len1) {
                this.unschedule(addAnswerItem);
                return;
            };
        };
        this.schedule(addAnswerItem, 0.2, len1 - 1, 0);
    },

    setLangByCurLang: function() {
        let curLang = this.curLang;
        this.lab_linksTips.string = this[curLang]["lab_linksTips"];
        this.lab_btnOtherSupport.string = this[curLang]["lab_btnOtherSupport"];
        
        for (let i = 0, len = this.enumItemNodeArr.length; i < len; i++) {
            let enumItemNode = this.enumItemNodeArr[i];
            let enumItemCtrl = enumItemNode.getComponent("ShopInstructionsEnumItemCtrl");
            enumItemCtrl.setBtnTipsLanguageType(curLang);
            enumItemCtrl.showBtnTipsStr();
        };

        for (let i = 0, len = this.answerItemNodeArr.length; i < len; i++) {
            let answerItemNode = this.answerItemNodeArr[i];
            if (answerItemNode.active == true) {
                let answerItemCtrl = answerItemNode.getComponent("ShopInstructionsAnswerItemCtrl");
                answerItemCtrl.setAnswerLanguageType(curLang);
                answerItemCtrl.showAnswerTitle();
            };
        };

        if (this.curTextTagArr.length != 0) {
            let enumType = this.curTextTagArr[0];
            let itemIndex = this.curTextTagArr[1];
            this.lab_textTitle.string = this[curLang]["answer_" + enumType][itemIndex];
            this.lab_textMain.string = this[curLang]["text_" + enumType][itemIndex];
            this.lab_textPS.string = this[curLang]["ps_" + enumType][itemIndex];
        };
    },

    clickCallback: function(btn) {
        let btnName = btn.node.name;
        if (btnName === "btn_close") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.node.destroy();
            return;
        }
        if (btnName === "btn_othersSupport") {
            GlobalCfg.G_COMPONENTS.Audio.playBack();
            this.curTextTagArr = [];
            this.node_enumMain.active = true;
            this.node_text.active = false;
            let enumType = this.curLevelTagArr[0];
            let level2 = this.curLevelTagArr[1];
            if (level2) {
                this.curLevelTagArr.splice(1, 1);
                this.showAnswerItem(enumType);
                return;
            };

            this.curLevelTagArr.splice(0, 1);
            this.btn_othersSupport.node.active = false;
            for (let i = 0, len = this.enumItemNodeArr.length; i < len; i++) {
                let enumItemNode = this.enumItemNodeArr[i];
                enumItemNode.active = true;
            };
            for (let i = 0, len = this.answerItemNodeArr.length; i < len; i++) {
                let answerItemNode = this.answerItemNodeArr[i];
                answerItemNode.active = false;
            };
        };
    },

    toggleCallback: function(toggle) {
        GlobalCfg.G_COMPONENTS.Audio.playButton();
        let toggleName = toggle.node.name;
        if (toggleName === "toggle_hindi") {
            this.curLang = "hindi";
            this.setLangByCurLang();
        }
        else if (toggleName === "toggle_bengali") {
            this.curLang = "bengali";
            this.setLangByCurLang();
        }
        else if (toggleName === "toggle_english") {
            this.curLang = "english";
            this.setLangByCurLang();
        };
    },

    clickEnumItemCall: function(enumType) {
        if (!enumType) {
            return;
        };

        this.curLevelTagArr.push(enumType);

        this.btn_othersSupport.node.active = true;

        for (let i = 0, len = this.enumItemNodeArr.length; i < len; i++) {
            let enumItemNode = this.enumItemNodeArr[i];
            enumItemNode.active = false;
        };

        this.showAnswerItem(enumType);
    },

    showAnswerItem: function(enumType) {
        let answerItemLen = {
            "rechargeTips": 2, 
            "withdrawalTips": 5, 
            "rewardTips": 1,
            "winningsTips": 2,
            "depositTips": 2
        }[enumType];
        let curLang = this.curLang;
        for (let i = 0, len = this.answerItemNodeArr.length; i < len; i++) {
            let answerItemNode = this.answerItemNodeArr[i];
            if (i < answerItemLen) {
                let answerItemCtrl = answerItemNode.getComponent("ShopInstructionsAnswerItemCtrl");
                answerItemCtrl.setAnswerItemEnumType(enumType);
                answerItemCtrl.setAnswerLanguageType(curLang);
                answerItemCtrl.setAnswerItemIndex(i);
                answerItemCtrl.showAnswerTitle();
                answerItemNode.active = true;
            }
            else {
                answerItemNode.active = false;
            };
        };
    },

    clickAnswerItemCall: function(enumType, itemIndex) {
        this.curLevelTagArr.push("itemIndex" + itemIndex);
        this.node_enumMain.active = false;
        this.node_text.active = true;

        let curLang = this.curLang;
        this.curTextTagArr[0] = enumType;
        this.curTextTagArr[1] = itemIndex;
        this.lab_textTitle.string = this[curLang]["answer_" + enumType][itemIndex];
        this.lab_textMain.string = this[curLang]["text_" + enumType][itemIndex];
        this.lab_textPS.string = this[curLang]["ps_" + enumType][itemIndex];
    },
});
