const { ccclass, property } = cc._decorator;
import { initEnglishMap } from './i18nEnglishMap';
import { initHindiMap } from './i18nHindiMap';
import { initBengaliMap } from './i18nBengaliMap';
import { initUrduMap } from './i18nUrduMap';

export enum I18NLabelTransIdEnum {

    'default' = 0,
    /**
     * 登录
     */
    'Login_The Best Online Experience' = 1,
    'Login_Play instant online any time',
    'Login_Win cash prizes instantly',
    'Login_100% Secure 100% Legal',
    'Login_Register to get  ₹10 Bonus',
    'Login_Input phone number here',
    'Login_Please enter the correct phone number',
    'Login_Login',
    'Login_Login Via Facebook',
    'Login_Please be wait and check your phone!',
    'Login_Verify with OTP',
    'Login_Sent to',
    'Login_Input OTP here',
    'Login_X Invalid OTP. Please try again.',
    'Login_Resend OTP in',
    'Login_Not received. Resend',
    'Login_Resend',
    'Login_Back & Change Mobile',
    'Login_Guest Login',
    'Login_Quick Login',


    /**
     * 大厅
     */
    'Lobby_WITHDRAW' = 1000,
    'Lobby_ADD',
    'Lobby_ADDCASH',
    'Lobby_Mobile',
    'Lobby_Mobile 10 BONUS',
    'Lobby_Activity',
    'Lobby_REFER ＆ EARN',
    'Lobby_JHANDI MUNDA',
    'Lobby_WHACK-A-MOLE',
    'Lobby_HORSE RACING',
    'Lobby_FRUIT PARTY',
    'Lobby_LUCKY  LOTO',
    'Lobby_MESSAGE',
    'Lobby_NO MESSAGE',
    'Lobby_Only keep mails within 15 days',
    'Lobby_Deposit',
    'Lobby_Winning',
    'Lobby_Total Cash',
    'Lobby_Bonus',
    'Lobby_Bind',
    'Lobby_Modify',
    'Lobby_Email',
    'Lobby_Name',
    'Lobby_Input your new nickname below',
    'Lobby_No more than 12 character',
    'Lobby_Users can only modify if once within 24 hours',
    'Lobby_Nickname can not be Empty',
    'Lobby_Invalid nickname , please use common letters and numbers',
    'Lobby_OKay',
    'Lobby_Nickname modified successfully',
    'Lobby_CHANGE',
    'Lobby_Photograph',
    'Lobby_Select From Photos',
    'Lobby_Cancel',
    'Lobby_VERIFY MOBILE',
    'Lobby_FREE 10 BONUS',
    'Lobby_FREE',
    'Lobby_Please enter your Name',
    'Lobby_Input phone number here',
    'Lobby_Input OTP here',
    'Lobby_Input your Email',
    'Lobby_Name can not be Empty',
    'Lobby_X Invalid OTP .Please try again',
    'Lobby_Email cannot be empty',
    'Lobby_Please fill in the correct email',
    'Lobby_SETTINGS',
    'Lobby_English',
    'Lobby_Hindi',
    'Lobby_Urdu',
    'Lobby_Bengali',
    'Lobby_Background Music',
    'Lobby_Effect Sound',
    'Lobby_Version',
    'Lobby_Rate us',
    'Lobby_TAP on stars to Rate us',
    'Lobby_Thank you for your Rate us',
    'Lobby_Copy',
    'Lobby_Logout',
    'Lobby_Privacy Policy',
    'Lobby_Terms of Service',
    'Lobby_How to play',
    'Lobby_Please enter the correct phone number',
    'Lobby_Contact US',


    /**
     * 客服
     */
    'Customer_Customer System' = 2000,
    'Customer_Customer Service',
    'Customer_Due to working hours, sometimes customer service can`t reply in time, sorry！',
    'Customer_Copied successfully',
    'Customer_Fast feedback',
    'Customer_1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward',
    'Customer_2.Your feedback will be answered within 1-2 working days',
    'Customer_Please fill in your questions and suggestions here and send them to us.',
    'Customer_Send',
    'Customer_NOTICE',
    'Customer_Send successfully',
    'Customer_Please pay attention to Message',
    'Customer_Please contact us if you need help',




    /** 
     * 推广员
     */
    'Promoter_REFER ＆EARN' = 3000,
    'Promoter_Get a bonus every time they win',
    'Promoter_For every a ₹100 win , the system will reward ₹5',
    'Promoter_You can see the details at Bonus Table',
    'Promoter_Share With friend',
    'Promoter_all belong to your team',
    'Promoter_You`re going to be a',
    'Promoter_If your team has 1000 people a day',
    'Promoter_they each win ₹100 . You can get a bonus of ₹5000 every day<₹5000的奖金',
    'Promoter_If you have 10000 or 100000 people?',
    'Promoter_Share more',
    'Promoter_Copy Link',
    'Promoter_Team',
    'Promoter_The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.',
    'Promoter_History',
    'Promoter_Bonus Table',
    'Promoter_Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.',
    'Promoter_For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50',
    'Promoter_Total Bonus',
    'Promoter_The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.',
    'Promoter_GET BONUS',
    'Promoter_What is a team?',
    'Promoter_NAME',
    'Promoter_INVITED',
    'Promoter_Every reward you received will immediately enter your deposit',
    'Promoter_Total Output Value',
    'Promoter_TIME',
    'Promoter_OUTPUT INCOME',
    'Promoter_INVITED INCOME',
    'Promoter_The more people you invite , the more rewards you get for every 100 people in your team',
    'Promoter_winnings output value!!',
    'Promoter_NUMBER OF INVITEES',
    'Promoter_BONUS',
    'Promoter_Invite Friends',
    'Promoter_Operation',
    'Promoter_Invite All',
    'Promoter_Total Friends',
    'Promoter_Potential Bonus',
    'Promoter_search',



    /***
     * 选场
     */
    'Select_3 Patti' = 4000,
    'Select_Pot Blind',
    'Select_PRACTICE',
    'Select_CASH',
    'Select_Play Now',
    'Select_ADD',
    'Select_Boot',
    'Select_Min Buyin',
    'Select_Chaal limit',
    'Select_Pot limit',
    'Select_Total Players',
    'Select_MID',
    'Select_HIGH',
    'Select_Min bet',
    'Select_Max Bet',
    'Select_Max payout',
    'Select_2 player',
    'Select_6 player',
    'Select_Point Value',
    'Select_Max players',
    'Select_Join',
    'Select_LOW',
    'Select_Add Cash',


    /***
     * 运营活动
     */
    'Activity_DAILY FREE RUPEES' = 5000,
    'Activity_Get rewards',
    'Activity_REWARDS',
    'Activity_LUCKY TURNTABLE',
    'Activity_Tips',
    'Activity_1.You can get a luckdraw for every 50 games you play',
    'Activity_2.there is a freelottery every day',
    'Activity_Remaining times',
    'Activity_more cash bonus after the purchase',
    'Activity_ADD CASH',
    'Activity_Cash',
    'Activity_Bonus',
    'Activity_Total Get',
    'Activity_Only one chance . choose any one to buy',
    'Activity_Other Amount>>',
    'Activity_Bonus will be transferred into deposit when you lose in some games deposit',
    'Activity_GET FROM EVENTS',
    'Activity_GET IN GAMES',
    'Activity_Get more',
    'Activity_Collect',
    'Activity_All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash',
    'Activity_Bonus Card',
    'Activity_DAILY BONUS CARD',
    'Activity_Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration',
    'Activity_SILVER CARD',
    'Activity_GOLD CARD',
    'Activity_DIAMOND CARD',
    'Activity_Get 1000 right now',
    'Activity_20 Bonus x7 days',
    'Activity_NOTICE',
    'Activity_1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days',
    'Activity_2.You can only choose one type to purchase . On- ly one card is allowed at the same time',
    'Activity_3.You can buy the Daily Bonus Card only after the first deposit.',
    'Activity_GET YOUR BONUS',
    'Activity_Login every day can get rewards',



    /**
     * 投注类游戏
     */
    'Game_7UP 7DOWN' = 6000,
    'Game_Start Betting',
    'Game_Betting starts in 0 seconds',
    'Game_Betting ends in 11 seconds',
    'Game_Billing',
    'Game_ONLINE PLAYERS',
    'Game_Total online players:xxxx',
    'Game_Do you want to exit the VIP seat?',
    'Game_Are you sure you want to join the VIP seat?',
    'Game_There are other players in this VIP seat . Please choose again!',
    'Game_You can`t be a VIP if you carry less than 100 gold coins',
    'Game_On other VIP seats, are you sure you want to enter this VIP seat?',
    'Game_You`re not a VIP . You can`t send expressions',
    'Game_DRAGON VS TIGER',
    'Game_Repeat bets',
    'Game_WINNING HISTORY',
    'Game_Tiger',
    'Game_Dragon',
    'Game_Tie',
    'Game_Set',
    'Game_HORSE RACING',
    'Game_Odds',
    'Game_Horse',
    'Game_You won',
    'Game_THE GAME IS ABOUT TO START PLEASE SET THE BET.',
    'Game_Prev',
    'Game_Next',
    'Game_Stop Betting!',
    'Game_Fruit Party',
    'Game_MAX',
    'Game_BET AMOUNT',
    'Game_TOTAL WIN',
    'Game_FAST',
    'Game_AUTO',
    'Game_SPIN',
    'Game_Lucky Loto',
    'Game_JACKPOT',
    'Game_Interval after jackpot',
    'Game_Betting',
    'Game_BIG WINNER',
    'Game_SET',
    'Game_PURE',
    'Game_SEQ',
    'Game_COLOR',
    'Game_PAIR',
    'Game_HIGH',
    'Game_Waiting',
    'Game_Bet on HIGH CARD: Win=bet*3',
    'Game_Bet on PAIR: Win=bet*4',
    'Game_Bet on COLOR: Win=bet*5',
    'Game_Bet on SEQUENCE: Win= bet*6',
    'Game_Bet on PURE SEQUENCE: Win=bet*10',
    'Game_Bet on SET: Split the Jackpot*20%',
    'Game_MY HISTORY',
    'Game_Result',
    'Game_Total',
    'Game_Type',
    'Game_Time',
    'Game_Winner',
    'Game_Win',
    'Game_JACKPOT 1157 DRAWS LEFT',

    'Game_name_Rummy',
    'Game_name_TeenPatti',
    'Game_name_AndarBahar',
    'Game_name_7up7down',
    'Game_name_DragonVsTiger',
    'Game_name_JhandiMunda',
    'Game_name_HorseRace',
    'Game_name_FruitParty',
    'Game_name_Baccarat3Patti',
    'Game_name_Crash',
    'Game_name_ZooRoulette',
    'Game_name_Cricket',
    'Game_name_Zeus',

    /**
     * MyVip
     */
    'MyVip_CURRENT LEVEL:' = 7000,
    'MyVip_ADD CASH',
    'MyVip_TO BET',
    'MyVip_RULES',
    'MyVip_Benefits',
    'MyVip_Only VIP players can use this feature',
    'MyVip_Add cash 200 now to become a VIP player.',
    'MyVip_VIP Rules',
    'MyVip_Level up gift',

    'MyVip_Daily Withdrawal Count',
    'MyVip_Withdrawal Limit',
    'MyVip_Monthly Allowance',
    'MyVip_Weekly Allowance',
    'MyVip_Daily Allowance',
    'MyVip_VIP Seats',
    'MyVip_VIP Customer Service',
    'MyVip_VIP Name Color',
    'MyVip_Level Up Gift',
    'MyVip_Lucky Draw',

    'MyVip_The maximum number of withdrawals a usercan make in a day.',
    'MyVip_The maximum withdrawal amount a user can withdraw.',
    'MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.',
    'MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.',
    'MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.',
    'MyVip_VIP players can occupy prominent positions in gambling games.',
    'MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.',
    'MyVip_Unique color of the VIP users name.',
    'MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.',
    'MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.',

    'MyVip_Your VIP level needs to be improved',
    'MyVip_Please go to upgrade your VIP level',
    'MyVip_Go Upgrade',


    /**
     * Shop
     */
    'Shop_Add Cash' = 8000,
    'Shop_Total Get',
    'Shop_Cash',
    'Shop_Bonus',
    'Shop_Select payment amount',
    'Shop_tips',
    'Shop_Select payment channel',
    'Shop_service title',

    /**
     * Withdraw
     */
    'Withdraw_title' = 9000,
    'Withdraw_Button',
    'Withdraw_Cash Balance',
    'Withdraw_Withdrawal history',
    'Withdraw_Add Cash',
    'Withdraw_Deposit Cash',
    'Withdraw_Winnings Cash',
    'Withdraw_Daily Withdrawal Count Left',
    'Withdraw_Withdrawal Amount',
    'Withdraw_Okay',
    'Withdraw_Tip',
    'Withdraw_desc',
    'Withdraw_Total Balance',
    'Withdraw_Withdrawable',
    'Withdraw_Bank Account',
    'Withdraw_no card account',
    'Withdraw_rule_info',
    'Withdraw_Input Account number',
    'Withdraw_Input User Name',
    'Withdraw_Input IFSC Code',
    'Withdraw_Input Bank Name',
    'Withdraw_Input Branch',
    'Withdraw_Input Email',
    'Withdraw_Input Mobile Number',

    'TransactionRecord_Record' = 10000,
    'TransactionRecord_Recharge',
    'TransactionRecord_Withdraw',
    'TransactionRecord_Order processing in',
    'TransactionRecord_NO DATA',
    'TransactionRecord_Amount',
    'TransactionRecord_Change amount',
    'TransactionRecord_Before',
    'TransactionRecord_After',
    'TransactionRecord_Okay',
    'TransactionRecord_Tip',
    'TransactionRecord_Processing',
    'TransactionRecord_Succeeded',
    'TransactionRecord_Failed',
    'TransactionRecord_Pending',
    'TransactionRecord_Rejected',
    'TransactionRecord_Experience Coins',

    'Invitation_friends' = 11000,
    'Invitation_winnings',
    'Invitation_state',
    'Invitation_Task',
    'Invitation_Spin',
    'Invitation_Schedule',
    'Invitation_Tips',
    'Invitation_Recharged friends',

    'BonusCardRule_desc' = 12000,

    'personal_edit' = 13000,

    'rule_andar_desc1'= 13100,
    'rule_andar_desc2',
    'rule_andar_desc3',
    'rule_andar_desc4',
    'rule_andar_desc5',
    
    'rule_3patti_desc1',
    'rule_3patti_desc2',
    'rule_3patti_desc3',
    'rule_3patti_desc4',
    'rule_3patti_desc5',
    'rule_3patti_desc6',
    'rule_cricket_desc1',
    'rule_cricket_desc2',
    'rule_cricket_desc3',
    'rule_cricket_desc4',
    'rule_cricket_desc5',
    'rule_cricket_desc6',
    'rule_cricket_desc7',
    'rule_cricket_desc8',
    'rule_cricket_desc9',
    'rule_cricket_desc10',
    'rule_fruit_desc1',
    'rule_fruit_desc2',
    'rule_fruit_desc3',
    'rule_fruit_desc4',
    'rule_fruit_desc5',
    'rule_fruit_desc6',
    'rule_fruit_desc7',
    'rule_fruit_desc8',
    'rule_fruit_desc9',
    'rule_fruit_desc10',
    'rule_fruit_title1',
    'rule_fruit_title2',
    'rule_fruit_title3',
    'rule_fruit_title4',
    'rule_fruit_title5',
    'rule_horse_desc1',
    'rule_horse_desc2',
    'rule_horse_desc3',
    'rule_horse_desc4',
    'rule_lhd_desc1',
    'rule_lhd_desc2',
    'rule_lhd_desc3',
    'rule_lhd_desc4',
    'rule_lhd_desc5',
    'rule_lhd_desc6',
    'rule_munda_desc1',
    'rule_munda_desc2',
    'rule_munda_desc3',
    'rule_munda_desc4',
    'rule_munda_desc5',
    'rule_rocket_desc1',
    'rule_rocket_desc2',
    'rule_rocket_desc3',
    'rule_rocket_desc4',
    'rule_rummy_desc1',
    'rule_rummy_desc2',
    'rule_rummy_desc3',
    'rule_rummy_desc4',
    'rule_rummy_desc5',
    'rule_rummy_desc6',
    'rule_rummy_desc7',
    'rule_rummy_desc8',
    'rule_rummy_desc9',
    'rule_rummy_desc10',
    'rule_rummy_desc11',
    'rule_rummy_desc12',
    'rule_rummy_title1',
    'rule_rummy_title2',
    'rule_rummy_title3',
    'rule_rummy_title4',
    'rule_rummy_title5',
    'rule_rummy_title6',
    'rule_rummy_title7',
    'rule_rummy_title8',
    'rule_rummy_title9',
    'rule_rummy_title10',
    'rule_teenpatti_title1',
    'rule_teenpatti_title2',
    'rule_teenpatti_title3',
    'rule_teenpatti_title4',
    'rule_teenpatti_title5',
    'rule_teenpatti_title6',
    'rule_teenpatti_desc1',
    'rule_updown_desc1',
    'rule_updown_desc2',
    'rule_zoo_desc1',

    //游戏
    'bull_balance' = 20000,
    'bull_bet',
    'bull_win',

    'cat_rule_1' = 21000,
    'cat_rule_2',
    'cat_rule_3',
    'cat_rule_4',
    'cat_rule_5',
    'cat_rule_6',
    'cat_rule_7',
    'cat_rule_8',
    'cat_totalbet',
    'cat_collect',

    'lhd_bet_tip' = 22000,
    'lhd_repeat bets',
    'lhd_total online players',
};


export enum I18NSpriteTransIdEnum {
    'default' = 0,

    'Setting_title' = 1,
    'Setting_on',
    'Setting_off',
    'Setting_howToPlay',
    'Setting_rateUs',
    'Setting_contactUs',
    'Setting_privacy',
    'Setting_terms',
    'Setting_logOut',


    'Activity_title' = 100,
    'Activity_bonus_title',
    'Activity_signIn_title',
    'Activity_turnTable_title',


    'RewardsTips_title' = 200,

    'BindPhone_title' = 300,

    'BindPhoneRewards_title' = 400,
    'BindPhoneRewards_free',
    'BindPhoneRewards_get10',
    'BindPhoneRewards_btn_verify',

    'BonusTransfer_title' = 500,
    'BonusTransfer_getFromEvents',
    'BonusTransfer_betInGames',

    'ContactUs_title' = 600,

    'CustomerService_title' = 700,

    'FastFeedBack_title' = 800,

    'FirstGiftDiamond_title' = 900,
    'FirstGiftDiamond_content',

    'Personal_title' = 1000,
    'Personal_bind',

    'Promoter_getABonus' = 1100,
    'Promoter_millionaire',

    'RateUs_title01' = 1200,
    'RateUs_title02',

    'Rule_title' = 1300,
    'Rule_zeus_desc1',
    'Rule_zeus_desc2',
    'Rule_zeus_desc3',
    'Rule_zeus_desc4',

    'SmallAddExperience_title' = 1400,

    'UserHead_title' = 1500,

    'LobbyBanner_addCash' = 1600,
    'LobbyBanner_friend',
    'LobbyBanner_getNow',
    'LobbyBanner_quickRecharge',
    'LobbyBanner_refer',
    'LobbyBanner_Group 206',
    'LobbyBanner_Group 207',
    'LobbyBanner_Group 208',
    'LobbyBanner_Group 209',
    'LobbyBanner_Group 210',
    'LobbyBanner_Group 211',
    'LobbyBanner_Group 212',
    'LobbyBanner_Group 213',
    'LobbyBanner_Group 214',
    'LobbyBanner_Group 215',
    'LobbyBanner_Group 216',
    'LobbyBanner_Group 217',

    'CommActivity_activity' = 1700,
    'CommActivity_bonusCard',
    'CommActivity_mobile',
    'CommActivity_gift',
    'CommActivity_re',
    'CommActivity_super discount',

    'LobbyIcons_luckyLoto' = 1800,
    'LobbyIcons_rocket',
    'LobbyIcons_3patti',
    'LobbyIcons_77',
    'LobbyIcons_andar',
    'LobbyIcons_aviator',
    'LobbyIcons_bez',
    'LobbyIcons_buffalo',
    'LobbyIcons_cat',
    'LobbyIcons_chicken',
    'LobbyIcons_cricket',
    'LobbyIcons_dancegirl',
    'LobbyIcons_dragon',
    'LobbyIcons_fruit',
    'LobbyIcons_horse',
    'LobbyIcons_maya',
    'LobbyIcons_mtp',
    'LobbyIcons_munda',
    'LobbyIcons_rummy',
    'LobbyIcons_teenpatti',
    'LobbyIcons_vampire',
    'LobbyIcons_zeus',
    'LobbyIcons_zoo',
    'LobbyIcons_refer&earn',
    'LobbyIcons_addcash',
    'LobbyIcons_go Betting',
    'LobbyIcons_earnMoney',
    'LobbyIcons_OncePay',
    'LobbyIcons_vip',
    'LobbyIcons_email',


    'GameSetting_title' = 1900,

    'GameMenu_title' = 2000,
    'GameMenu_exitToLobby',
    'GameMenu_howToPlay',
    'GameMenu_setting',
    'GameMenu_switchTable',

    'PopUpWithDraw_title' = 2100,
    'PopUpWithDraw_onYourChance',
    'PopUpWithDraw_yourWinningAmount',

    'MyVip_levelUpGiftMark' = 2200,
    'MyVip_levelUpGiftTitle',
    'MyVip_limitedTimeOffer',
    'MyVip_luckyDraw',
    'MyVip_myVip',
    'MyVip_nowGet',
    'MyVip_onlyOnceChance',
    'MyVip_recharge',
    'MyVip_more',
    'MyVip_cashout',


    'Login_or' = 2300,
    'Login_title',
    'Login_text',
    'Login_bonus',

    'DailyBonusCard_title' = 2400,
    'DailyBonusCard_01',
    'DailyBonusCard_02',
    'DailyBonusCard_03',
    'DailyBonusCard_04',

    'invitation_bg' = 2500,
    'invitation_yes',
    'invitation_collect',
    'invitation_spin',


    'withdraw_bankcard' = 2600,
    'withdraw_btn_ba',
    'withdraw_logo',
    'withdraw_tips',
    'withdraw_rule',
    'withdraw_ruletips',
    'withdraw_bg',
    'withdraw_save',

    'servicew_bg' = 2700,
    'servicew_service',
    'servicew_Fast feedback',
    'servicew_Twitter',
    'servicew_Telegram',
    'servicew_button',

    //游戏
    'game_shop_cz' = 9000,
    'game_shop_free',
    'game_machine_add',
    'game_machine_add2',
    'game_machine_add3',
    'game_machine_fast1',
    'game_machine_fast2',
    'game_machine_max',
    'game_machine_spin',
    'game_machine_spin2',
    'game_machine_gold',
    'game_machine_total',


    'bullMachine_spin_label' = 10000,
    'bullMachine_tips1',
    'bullMachine_tips2',
    'bullMachine_tips3',
    'bullMachine_tips4',
    'bullMachine_tips5',

    'catMachine_tips1' = 11000,
    'catMachine_tips2',
    'catMachine_tips3',
    'catMachine_goldbg',
    'catMachine_win',
    'catMachine_goodluck',
    'catMachine_totalwin',
    'catMachine_spin',
    'catMachine_line9',
    'catMachine_jpInfo_bg',
    'catMachine_jpInfo_title',
    'catMachine_rule_mulitiples',
    'catMachine_rule_lines',
    'catMachine_rule_rules',
    'catMachine_rule_jackpot',
    'catMachine_rule_4',

    'lhd_stopbetting',

};

export enum I18NSpineTransIdEnum {
    'default' = 0,
};


/**
 * 语言的种类
 */
export enum I18NLanguagesEnum {
    English = "English",
    Hindi = "Hindi",
    Bengali = "Bengali",
    Urdu = "Urdu",
};


/**
 * 组件类型
 */
export enum componentTypeEnum {
    Label = 0,
    RichText
};




export class I18NUtil {

    private EnglishMap = new Map()

    private HindiMap = new Map();

    private BengaliMap = new Map();

    private UrduMap = new Map();

    private SpriteFramePathMap = new Map();

    private SpinePathMap = new Map();

    private static _instance: I18NUtil = null;

    public static getInstance(): I18NUtil {
        if (!I18NUtil._instance) {
            I18NUtil._instance = new I18NUtil();
            I18NUtil._instance._initLanguageMap();
            I18NUtil._instance._initSpriteFramePathMap();
            I18NUtil._instance._initSpinePathMap();
        };
        return I18NUtil._instance;
    };

    private _initLanguageMap() {
        initEnglishMap(this.EnglishMap, I18NLabelTransIdEnum);
        initHindiMap(this.HindiMap, I18NLabelTransIdEnum);
        initBengaliMap(this.BengaliMap, I18NLabelTransIdEnum);
        initUrduMap(this.UrduMap, I18NLabelTransIdEnum);
    };

    private _initSpriteFramePathMap() {
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_or'], 'Login/or');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_title'], 'Login/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_text'], 'Login/text');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_bonus'], 'Login/bonus');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_title'], 'Setting/img_set_bg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_on'], 'Setting/btn_on');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_off'], 'Setting/btn_off');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_howToPlay'], 'Setting/btn_htp');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_rateUs'], 'Setting/btn_rus');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_contactUs'], 'Setting/btn_cus');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_privacy'], 'Setting/btn_pp');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_terms'], 'Setting/btn_tos');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_logOut'], 'Setting/btn_logout');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Activity_title'], 'Activity/Base/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Activity_bonus_title'], 'Activity/Bonus/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Activity_signIn_title'], 'Activity/SignIn/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Activity_turnTable_title'], 'Activity/TurnTable/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['RewardsTips_title'], 'RewardsTips/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BindPhone_title'], 'BindPhone/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BindPhoneRewards_title'], 'BindPhoneRewards/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BindPhoneRewards_free'], 'BindPhoneRewards/free');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BindPhoneRewards_get10'], 'BindPhoneRewards/get10');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BindPhoneRewards_btn_verify'], 'BindPhoneRewards/btn_verify');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BonusTransfer_title'], 'BonusTransfer/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BonusTransfer_getFromEvents'], 'BonusTransfer/getFromEvents');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['BonusTransfer_betInGames'], 'BonusTransfer/betInGames');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['ContactUs_title'], 'ContactUs/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CustomerService_title'], 'CustomerService/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['FastFeedBack_title'], 'FastFeedBack/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['FirstGiftDiamond_title'], 'FirstGiftDiamond/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['FirstGiftDiamond_content'], 'FirstGiftDiamond/content');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Personal_title'], 'Personal/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['personal_bind'], 'personal/bind');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Promoter_getABonus'], 'Promoter/getABonus');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Promoter_millionaire'], 'Promoter/millionaire');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['RateUs_title01'], 'RateUs/title_01');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['RateUs_title02'], 'RateUs/title_02');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_title'], 'Rule/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_zeus_desc1'], 'Rule/gates_oly_rules_img1');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_zeus_desc2'], 'Rule/gates_oly_rules_img2');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_zeus_desc3'], 'Rule/gates_oly_rules_img3');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_zeus_desc4'], 'Rule/gates_oly_rules_img4');


        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['SmallAddExperience_title'], 'SmallAddExperience/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['UserHead_title'], 'UserHead/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_addCash'], 'LobbyBanner/addCash');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_friend'], 'LobbyBanner/friend');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_getNow'], 'LobbyBanner/getNow');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_quickRecharge'], 'LobbyBanner/quickRecharge');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_refer'], 'LobbyBanner/refer');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 206'], 'LobbyBanner/Group 206');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 207'], 'LobbyBanner/Group 207');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 208'], 'LobbyBanner/Group 208');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 209'], 'LobbyBanner/Group 209');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 210'], 'LobbyBanner/Group 210');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 211'], 'LobbyBanner/Group 211');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 212'], 'LobbyBanner/Group 212');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 213'], 'LobbyBanner/Group 213');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 214'], 'LobbyBanner/Group 214');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 215'], 'LobbyBanner/Group 215');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 216'], 'LobbyBanner/Group 216');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_Group 217'], 'LobbyBanner/Group 217');



        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_activity'], 'CommActivity/activity');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_bonusCard'], 'CommActivity/bonusCard');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_gift'], 'CommActivity/gift');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_mobile'], 'CommActivity/mobile');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_re'], 'CommActivity/re');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_super discount'], 'CommActivity/super discount');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_luckyLoto'], 'LobbyIcons/lucky loto');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_rocket'], 'LobbyIcons/rocket');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_3patti'], 'LobbyIcons/3patti');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_77'], 'LobbyIcons/77');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_andar'], 'LobbyIcons/andar');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_aviator'], 'LobbyIcons/aviator');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_bez'], 'LobbyIcons/bez');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_buffalo'], 'LobbyIcons/buffalo');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_cat'], 'LobbyIcons/cat');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_chicken'], 'LobbyIcons/chicken');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_cricket'], 'LobbyIcons/cricket');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_dancegirl'], 'LobbyIcons/dancegirl');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_dragon'], 'LobbyIcons/dragon');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_fruit'], 'LobbyIcons/fruit');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_horse'], 'LobbyIcons/horse');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_maya'], 'LobbyIcons/maya');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_mtp'], 'LobbyIcons/mtp');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_munda'], 'LobbyIcons/munda');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_rocket'], 'LobbyIcons/rocket');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_rummy'], 'LobbyIcons/rummy');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_teenpatti'], 'LobbyIcons/teenpatti');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_vampire'], 'LobbyIcons/vampire');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_zeus'], 'LobbyIcons/zeus');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_zoo'], 'LobbyIcons/zoo');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_refer&earn'], 'LobbyIcons/refer&earn');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_addcash'], 'LobbyIcons/addCash');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_go Betting'], 'LobbyIcons/go betting');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_earnMoney'], 'LobbyIcons/earnmoney');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_OncePay'], 'LobbyIcons/once pay');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_vip'], 'LobbyIcons/vip');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_email'], 'LobbyIcons/Email');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameSetting_title'], 'GameSetting/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameMenu_title'], 'GameMenu/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameMenu_exitToLobby'], 'GameMenu/exitToLobby');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameMenu_howToPlay'], 'GameMenu/howToPlay');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameMenu_setting'], 'GameMenu/setting');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['GameMenu_switchTable'], 'GameMenu/switchTable');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['PopUpWithDraw_title'], 'PopUpWithDraw/title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['PopUpWithDraw_onYourChance'], 'PopUpWithDraw/onYourChance');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['PopUpWithDraw_yourWinningAmount'], 'PopUpWithDraw/yourWinningAmount');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_levelUpGiftMark'], 'MyVip/levelUpGiftMark');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_levelUpGiftTitle'], 'MyVip/levelUpGiftTitle');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_limitedTimeOffer'], 'MyVip/limitedTimeOffer');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_luckyDraw'], 'MyVip/luckyDraw');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_myVip'], 'MyVip/myVip');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_nowGet'], 'MyVip/nowGet');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_onlyOnceChance'], 'MyVip/onlyOneChance');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_recharge'], 'MyVip/recharge');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_more'], 'MyVip/more');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['MyVip_cashout'], 'MyVip/cashout');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['DailyBonusCard_title'], 'DailyBonusCard/daily bonus card');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['DailyBonusCard_01'], 'DailyBonusCard/01');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['DailyBonusCard_02'], 'DailyBonusCard/02');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['DailyBonusCard_03'], 'DailyBonusCard/03');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['DailyBonusCard_04'], 'DailyBonusCard/04');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['invitation_bg'], 'invitation/bg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['invitation_yes'], 'invitation/yes');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['invitation_collect'], 'invitation/collect');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['invitation_spin'], 'invitation/spin');


        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_bankcard'], 'withdraw/bankcard');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_btn_ba'], 'withdraw/btn_ba');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_logo'], 'withdraw/logo_withdraw');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_tips'], 'withdraw/Please');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_rule'], 'withdraw/rule');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_ruletips'], 'withdraw/ruletips');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_bg'], 'withdraw/bg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['withdraw_save'], 'withdraw/save');


        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_bg'], 'service/bg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_service'], 'service/customer service');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_Fast feedback'], 'service/Fast feedback');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_Twitter'], 'service/Twitter');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_Telegram'], 'service/Telegram');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['servicew_button'], 'service/btn_GO');

        //游戏
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_shop_cz'], 'game/btn_cz');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_shop_free'], 'game/btn_mfjf');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_add'], 'game/fruitMachine/btn_addcash');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_add2'], 'game/fruitMachine/btn_add2');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_add3'], 'game/fruitMachine/btn_addcash_SHOP');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_fast1'], 'game/fruitMachine/btn_fast_01');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_fast2'], 'game/fruitMachine/btn_fast_02');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_max'], 'game/fruitMachine/btn_max');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_spin'], 'game/fruitMachine/btn_spin');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_spin2'], 'game/fruitMachine/btn_spin_grey');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_gold'], 'game/fruitMachine/jinbi');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['game_machine_total'], 'game/fruitMachine/btn_total');

        //野牛
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_spin_label'], 'game/bullMachine/spin');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_tips1'], 'game/bullMachine/tips1');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_tips2'], 'game/bullMachine/tips2');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_tips3'], 'game/bullMachine/tips3');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_tips4'], 'game/bullMachine/tips4');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['bullMachine_tips5'], 'game/bullMachine/tips5');
        //猫
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_tips1'], 'game/catMachine/jackpot_title_1');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_tips2'], 'game/catMachine/jackpot_title_2');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_tips3'], 'game/catMachine/jackpot_title_3');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_goldbg'], 'game/catMachine/goldbg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_win'], 'game/catMachine/win');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_goodluck'], 'game/catMachine/good luck');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_totalwin'], 'game/catMachine/total win');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_spin'], 'game/catMachine/spin');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_line9'], 'game/catMachine/line9');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_jpInfo_bg'], 'game/catMachine/jpInfo_bg');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_jpInfo_title'], 'game/catMachine/jpInfo_title');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_rule_mulitiples'], 'game/catMachine/btn_multiples');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_rule_lines'], 'game/catMachine/btn_lines');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_rule_rules'], 'game/catMachine/btn_rules');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_rule_jackpot'], 'game/catMachine/btn_jackpot');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['catMachine_rule_4'], 'game/catMachine/rule4');

        //龙虎斗
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['lhd_stopbetting'], 'game/lhdGame/stopbetting');

    };

    private _initSpinePathMap() {

    };

    /**
     * 动态加载 Spine SkeletonData 资源
     * @param languages 语言类型 I18NLanguagesEnum
     * @param spineTransId spine关键字 I18NSpineTransIdEnum
     * @param callFun 加载成功后的回调
     * @returns
     */
    public loadSpineSkeletonData(languages: I18NLanguagesEnum, spineTransId: I18NSpineTransIdEnum, callFun: (skeletonData: sp.SkeletonData) => void) {
        let spinePath = this.SpinePathMap.get(spineTransId);
        if (!spinePath) {
            window["LoggerUtil"].getInstance().error("请先配置 spine 的路径");
            return;
        };
        window["CommonFun"].getInstance().loadBundle(`Language${languages}`, (bundle) => {
            bundle.load(spinePath, sp.SkeletonData, (err, skeletonData: sp.SkeletonData) => {
                if (!err) {
                    callFun(skeletonData);
                }
                else {
                    window["LoggerUtil"].getInstance().error(`${err}`);
                };
            });
        }, (err) => {
            window["LoggerUtil"].getInstance().error(err);
        });
    };

    /**
     * 动态加载SpriteFrame资源
     * @param languages 语言类型 I18NLanguagesEnum
     * @param spriteTransId sprite关键字 I18NSpriteTransIdEnum
     * @param callFun 加载成功后的回调
     * @returns 
     */
    public loadSpriteFrame(languages: I18NLanguagesEnum, spriteTransId: I18NSpriteTransIdEnum, callFun: (spriteFrame: cc.SpriteFrame) => void) {
        let spriteFramePath = this.SpriteFramePathMap.get(spriteTransId);
        if (!spriteFramePath) {
            window["LoggerUtil"].getInstance().error("请先配置图片的路径");
            return;
        };
        window["CommonFun"].getInstance().loadBundle(`Language${languages}`, (bundle) => {
            bundle.load(spriteFramePath, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
                if (!err) {
                    callFun(spriteFrame);
                }
                else {
                    window["LoggerUtil"].getInstance().error(`${err}`);
                };
            });
        }, (err) => {
            window["LoggerUtil"].getInstance().error(err);
        });
    };

    /**
     * 获取某个关键字的某种语言 
     * @param languages 语言类型 I18NLanguagesEnum
     * @param label label关键字 I18NLabelTransIdEnum
     * @returns 
     */
    public getLanguageStr(languages: I18NLanguagesEnum, labelTransId: I18NLabelTransIdEnum): string {
        let str = "";
        switch (languages) {
            case I18NLanguagesEnum.English:
                if (this.EnglishMap.has(labelTransId)) {
                    str = this.EnglishMap.get(labelTransId);
                };
                break;
            case I18NLanguagesEnum.Hindi:
                if (this.HindiMap.has(labelTransId)) {
                    str = this.HindiMap.get(labelTransId);
                };
                break;
            case I18NLanguagesEnum.Bengali:
                if (this.BengaliMap.has(labelTransId)) {
                    str = this.BengaliMap.get(labelTransId);
                };
                break;
            case I18NLanguagesEnum.Urdu:
                if (this.UrduMap.has(labelTransId)) {
                    str = this.UrduMap.get(labelTransId);
                };
                break;
            default:
                break;
        };
        return str;
    };

    /**
     * 获取当前语言类型 I18NLanguagesEnum
     * @returns 
     */
    public getLanguageType(): I18NLanguagesEnum {
        let curLanguagesType = I18NLanguagesEnum.Bengali;
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (!languagesType) {
            curLanguagesType = I18NLanguagesEnum.Bengali;
        }
        else {
            switch (languagesType) {
                case I18NLanguagesEnum.English:
                    curLanguagesType = I18NLanguagesEnum.English;
                    break;
                case I18NLanguagesEnum.Hindi:
                    curLanguagesType = I18NLanguagesEnum.Hindi;
                    break;
                case I18NLanguagesEnum.Bengali:
                    curLanguagesType = I18NLanguagesEnum.Bengali;
                    break;
                case I18NLanguagesEnum.Urdu:
                    curLanguagesType = I18NLanguagesEnum.Urdu;
                    break;
                default:
                    curLanguagesType = I18NLanguagesEnum.Bengali;
                    break;
            };
        };

        return curLanguagesType;
    };

    /**
     * 设置当前语言类型
     * @param languagesType 语言类型 I18NLanguagesEnum
     */
    public setLanguageType(languagesType: I18NLanguagesEnum) {
        let curLanguagesType = "";
        switch (languagesType) {
            case I18NLanguagesEnum.English:
                curLanguagesType = I18NLanguagesEnum.English;
                break;
            case I18NLanguagesEnum.Hindi:
                curLanguagesType = I18NLanguagesEnum.Hindi;
                break;
            case I18NLanguagesEnum.Bengali:
                curLanguagesType = I18NLanguagesEnum.Bengali;
                break;
            case I18NLanguagesEnum.Urdu:
                curLanguagesType = I18NLanguagesEnum.Urdu;
                break;
            default:
                curLanguagesType = I18NLanguagesEnum.English;
                break;
        };

        let beforeLanguagesType = this.getLanguageType();
        if (beforeLanguagesType === curLanguagesType) {
            return;
        };

        cc.sys.localStorage.setItem("LanguageTypeStorage", curLanguagesType);
        window["ClientNotify"].send(window["GlobalCfg"].MSG_TYPE.clientMsg, { msgCode: window["GlobalCfg"].CLIENT_MSG_ID.CHANGE_LANGUAGE, msgData: { languagesType: curLanguagesType } });
    };
};

window["I18NUtil"] = I18NUtil;
window["I18NLanguagesEnum"] = I18NLanguagesEnum;
window["I18NLabelTransIdEnum"] = I18NLabelTransIdEnum;
window["I18NSpriteTransIdEnum"] = I18NSpriteTransIdEnum;
