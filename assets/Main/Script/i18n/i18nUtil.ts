const {ccclass, property} = cc._decorator;

export enum I18NLabelTransIdEnum {

    'default' = 0,
    /**
     * 登录
     */
    'Login_The Best Online Experience' = 1,
    'Login_Play instant online any time' ,
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

    /**
     * Withdraw
     */
    'Withdraw_Withdraw' = 9000,
    'Withdraw_Cash Balance',
    'Withdraw_Withdrawal history',
    'Withdraw_Add Cash',
    'Withdraw_Deposit Cash',
    'Withdraw_Winnings Cash',
    'Withdraw_Daily Withdrawal Count Left',
    'Withdraw_Withdrawal Amount',
    'Withdraw_Okay',
    'Withdraw_Tip',


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
}; 


export enum I18NSpriteTransIdEnum {
    'default' = 0,

    'Setting_title' = 1,
    'Setting_music',
    'Setting_sound',
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

    'Promoter_getABonus' = 1100,
    'Promoter_millionaire',

    'RateUs_title01' = 1200,
    'RateUs_title02',

    'Rule_title' = 1300,

    'SmallAddExperience_title' = 1400,

    'UserHead_title' = 1500,

    'LobbyBanner_addCash' = 1600,
    'LobbyBanner_friend',
    'LobbyBanner_getNow',
    'LobbyBanner_quickRecharge',
    'LobbyBanner_refer',
    'LobbyBanner_rewards',

    'CommActivity_activity' = 1700,
    'CommActivity_bonusCard',
    'CommActivity_mobile',

    'LobbyIcons_luckyLoto' = 1800,

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


    'Login_text' = 2300,
    'Login_bonus',
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

    private static _instance: I18NUtil = null;

    public static getInstance(): I18NUtil {
        if (!I18NUtil._instance) {
            I18NUtil._instance = new I18NUtil();
            I18NUtil._instance._initLanguageMap();
            I18NUtil._instance._initSpriteFramePathMap();
        };
        return I18NUtil._instance;
    };

    private _initLanguageMap() {
        
        /**
         * 英语
         */
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_The Best Online Experience'], 'The Best Online Experience');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Play instant online any time'], 'Play instant online any time');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Win cash prizes instantly'], 'Win cash prizes instantly');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_100% Secure 100% Legal'], '100% Secure 100% Legal');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Register to get  ₹10 Bonus'], 'Register to get  ₹10 Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Input phone number here'], 'Input phone number here');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Please enter the correct phone number'], 'Please enter the correct phone number');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Login'], 'Login');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Login Via Facebook'], 'Login Via Facebook');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Please be wait and check your phone!'], 'Please be wait and check your phone!');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Verify with OTP'], 'Verify with OTP'); 
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Sent to'], 'Sent to');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Input OTP here'], 'Input OTP here');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_X Invalid OTP. Please try again.'], 'X Invalid OTP. Please try again.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Resend OTP in'], 'Resend OTP in');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Not received. Resend'], 'Not received. Resend');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Resend'], 'Resend');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Back & Change Mobile'], 'Back & Change Mobile');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Guest Login'], 'Guest Login');
        this.EnglishMap.set(I18NLabelTransIdEnum['Login_Quick Login'], 'Quick Login');

        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_WITHDRAW'], 'WITHDRAW');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_ADD'], 'ADD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_ADDCASH'], 'ADD CASH');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Mobile'], 'Mobile');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Mobile 10 BONUS'], 'Mobile 10 BONUS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Activity'], 'Activity');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_REFER ＆ EARN'], 'REFER ＆ EARN');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_JHANDI MUNDA'], 'JHANDI MUNDA');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_WHACK-A-MOLE'], 'WHACK-A-MOLE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_HORSE RACING'], 'HORSE RACING');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_FRUIT PARTY'], 'FRUIT PARTY');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_LUCKY  LOTO'], 'LUCKY  LOTO');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_MESSAGE'], 'MESSAGE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_NO MESSAGE'], 'NO MESSAGE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Only keep mails within 15 days'], 'Only keep mails within 15 days');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Deposit'], 'Deposit');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Winning'], 'Winning');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Total Cash'], 'Total Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Bonus'], 'Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Bind'], 'Bind');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Modify'], 'Modify');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Email'], 'Email');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Name'], 'Name');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Input your new nickname below'], 'Input your new nickname below');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_No more than 12 character'], 'No more than 12 character');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Users can only modify if once within 24 hours'], 'Users can only modify if once within 24 hours');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Nickname can not be Empty'], 'Nickname can not be Empty');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Invalid nickname , please use common letters and numbers'], 'Invalid nickname , please use common letters and numbers');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_OKay'], 'Okay');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Nickname modified successfully'], 'Nickname modified successfully');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_CHANGE'], 'CHANGE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Photograph'], 'Photograph');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Select From Photos'], 'Select From Photos');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Cancel'], 'Cancel');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_VERIFY MOBILE'], 'VERIFY MOBILE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_FREE 10 BONUS'], 'FREE 10 BONUS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_FREE'], 'FREE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Please enter your Name'], 'Please enter your Name');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Input phone number here'], 'Input phone number here');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Input OTP here'], 'Input OTP here');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Input your Email'], 'Input your Email');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Name can not be Empty'], 'Name can not be Empty');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Please enter the correct phone number'], 'Please enter the correct phone number');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_X Invalid OTP .Please try again'], 'X Invalid OTP .Please try again');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Email cannot be empty'], 'Email cannot be empty');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Please fill in the correct email'], 'Please fill in the correct email');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_SETTINGS'], 'SETTINGS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_English'], 'English');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Hindi'], 'Hindi');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Urdu'], 'Urdu');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Bengali'], 'Bengali');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Background Music'], 'Bg Music');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Effect Sound'], 'Effect Sound');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Version'], 'Version');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Rate us'], 'Rate us');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_TAP on stars to Rate us'], 'TAP on stars to Rate us');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Thank you for your Rate us'], 'Thank you for your Rate us');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Copy'], 'Copy');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Logout'], 'Logout');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Privacy Policy'], 'Privacy Policy');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Terms of Service'], 'Terms of Service');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_How to play'], 'How to play');
        this.EnglishMap.set(I18NLabelTransIdEnum['Lobby_Contact US'], 'Contact US');

        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Customer System'], 'Customer System');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Customer Service'], 'Customer Service');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Due to working hours, sometimes customer service can`t reply in time, sorry！'], 'Due to working hours, sometimes customer service can`t reply in time, sorry！');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Copied successfully'], 'Copied successfully');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Fast feedback'], 'Fast feedback');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward'], '1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_2.Your feedback will be answered within 1-2 working days'], '2.Your feedback will be answered within 1-2 working days');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Please fill in your questions and suggestions here and send them to us.'], 'Please fill in your questions and suggestions here and send them to us.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Send'], 'Send');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_NOTICE'], 'NOTICE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Send successfully'], 'Send successfully！');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Please pay attention to Message'], 'Please pay attention to Message');
        this.EnglishMap.set(I18NLabelTransIdEnum['Customer_Please contact us if you need help'], 'Please contact us if you need help!');

        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_REFER ＆EARN'], 'REFER ＆EARN');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Get a bonus every time they win'], 'Get a bonus every time they win');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_For every a ₹100 win , the system will reward ₹5'], 'For every a ₹100 win , the system will reward ₹5');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_You can see the details at Bonus Table'], 'You can see the details at "Bonus Table"');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Share With friend'], 'Share \nWith \nfriend');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_all belong to your team'], 'all belong to your team');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_You`re going to be a'], 'You`re going to be a');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_If your team has 1000 people a day'], 'If your team has 1000 people a day');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_they each win ₹100 . You can get a bonus of ₹5000 every day<₹5000的奖金'], 'they each win ₹100 . You can get a bonus of ₹5000 every day');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_If you have 10000 or 100000 people?'], 'If you have 10000 or 100000 people?');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Share more'], 'Share More');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Copy Link'], 'Copy Link');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Team'], 'Team');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.'], 'The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_History'], 'History');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Bonus Table'], 'Bonus Table');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.'], 'Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50'], 'For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Total Bonus'], 'Total Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.'], 'The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_GET BONUS'], 'Get Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_What is a team?'], 'What is a team?');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_NAME'], 'Name');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_INVITED'], 'Invited');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Every reward you received will immediately enter your deposit'], 'Every reward you received will immediately enter your deposit');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Total Output Value'], 'Total Output Value');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_TIME'], 'Time');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_OUTPUT INCOME'], 'Output Income');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_INVITED INCOME'], 'Invited Income');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_The more people you invite , the more rewards you get for every 100 people in your team'], 'The more people you invite , the more rewards you get for every 100 people in your team');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_winnings output value!!'], 'winnings output value!');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_NUMBER OF INVITEES'], 'Number Of Inviters');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_BONUS'], 'Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Invite Friends'], 'Invite Friends');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Operation'], 'Operation');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Invite All'], 'Invite All');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Total Friends'], 'Total Friends');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_Potential Bonus'], 'Potential Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Promoter_search'], 'search');

        this.EnglishMap.set(I18NLabelTransIdEnum['Select_3 Patti'], '3 Patti');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Pot Blind'], 'Pot Blind');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_PRACTICE'], 'Practice');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_CASH'], 'Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Play Now'], 'Play Now');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_ADD'], 'ADD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Boot'], 'Boot');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Min Buyin'], 'Min Buyin');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Chaal limit'], 'Chaal limit');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Pot limit'], 'Pot limit');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Total Players'], 'Total Players');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Join'], 'Join');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_LOW'], 'LOW');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_MID'], 'MID');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_HIGH'], 'HIGH');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Min bet'], 'Min bet');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Max Bet'], 'Max Bet');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Max payout'], 'Max payout');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_2 player'], '2 player');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_6 player'], '6 player');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Point Value'], 'Point Value');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Max players'], 'Max players');
        this.EnglishMap.set(I18NLabelTransIdEnum['Select_Add Cash'], 'Add Cash');

        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_DAILY FREE RUPEES'], 'DAILY\nFREE RUPEES');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Get rewards'], 'Get rewards');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_REWARDS'], 'REWARDS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_LUCKY TURNTABLE'], 'LUCKY\nTURNTABLE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Tips'], 'Tips');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_1.You can get a luckdraw for every 50 games you play'], '1.You can get a luckdraw for every 50 games you play');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_2.there is a freelottery every day'], '2.there is a freelottery every day');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Remaining times'], 'Remaining times');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_GET YOUR BONUS'], 'GET YOUR BONUS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Login every day can get rewards'], 'Login every day can get rewards');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_more cash bonus after the purchase'], 'more cash bonus after the purchase');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_ADD CASH'], 'ADD CASH');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Cash'], 'Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Bonus'], 'Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Total Get'], 'Total Get');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Only one chance . choose any one to buy'], 'Only one chance . choose any one to buy');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Other Amount>>'], 'Other Amount>>');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Bonus will be transferred into deposit when you lose in some games deposit'], 'Bonus will be transferred into deposit when you lose in some games deposit');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_GET FROM EVENTS'], 'GET FROM EVENTS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_GET IN GAMES'], 'GET IN GAMES');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Get more'], 'Get more');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Collect'], 'Collect');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash'], 'All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Bonus Card'], 'Bonus Card');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_DAILY BONUS CARD'], 'DAILY BONUS CARD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration'], 'Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_SILVER CARD'], 'SILVER CARD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_GOLD CARD'], 'GOLD CARD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_DIAMOND CARD'], 'DIAMOND CARD');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_Get 1000 right now'], 'Get 1000 right now');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_20 Bonus x7 days'], '20 Bonus x7 days');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_NOTICE'], 'NOTICE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days'], '1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_2.You can only choose one type to purchase . On- ly one card is allowed at the same time'], '2.You can only choose one type to purchase . On- ly one card is allowed at the same time');
        this.EnglishMap.set(I18NLabelTransIdEnum['Activity_3.You can buy the Daily Bonus Card only after the first deposit.'], '3.You can buy the Daily Bonus Card only after the first deposit.');

        this.EnglishMap.set(I18NLabelTransIdEnum['Game_7UP 7DOWN'], '7UP 7DOWN');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Start Betting'], 'Start Betting');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Betting starts in 0 seconds'], 'Betting starts in 0 seconds');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Betting ends in 11 seconds'], 'Betting ends in 11 seconds');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Billing'], 'Billing');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_ONLINE PLAYERS'], 'ONLINE PLAYERS');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Total online players:xxxx'], 'Total online players:xxxx');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Do you want to exit the VIP seat?'], 'Do you want to exit the VIP seat?');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Are you sure you want to join the VIP seat?'], 'Are you sure you want to join the VIP seat?');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_There are other players in this VIP seat . Please choose again!'], 'There are other players in this VIP seat. Please choose again!');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_You can`t be a VIP if you carry less than 100 gold coins'], 'You can`t be a VIP if you carry less than 100 gold coins');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_On other VIP seats, are you sure you want to enter this VIP seat?'], 'On other VIP seats, are you sure you want to enter this VIP seat?');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_You`re not a VIP . You can`t send expressions'], 'You`re not a VIP . You can`t send expressions');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_DRAGON VS TIGER'], 'DRAGON VS TIGER');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Repeat bets'], 'Repeat bets');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_WINNING HISTORY'], 'WINNING HISTORY');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Tiger'], 'Tiger');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Dragon'], 'Dragon');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Tie'], 'Tie');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Set'], 'Set');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_HORSE RACING'], 'HORSE RACING');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Odds'], 'Odds');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Horse'], 'Horse');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_You won'], 'You won');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_THE GAME IS ABOUT TO START PLEASE SET THE BET.'], 'THE GAME IS ABOUT TO START PLEASE SET THE BET.');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Prev'], 'Prev');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Next'], 'Next');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Stop Betting!'], 'Stop Betting!');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Fruit Party'], 'Fruit Party');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_MAX'], 'MAX');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_BET AMOUNT'], 'BET AMOUNT');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_TOTAL WIN'], 'TOTAL WIN');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_FAST'], 'FAST');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_AUTO'], 'AUTO');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_SPIN'], 'SPIN');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Lucky Loto'], 'Lucky Loto');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_JACKPOT'], 'JACKPOT');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Interval after jackpot'], 'Interval after jackpot');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Betting'], 'Betting');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_BIG WINNER'], 'BIG WINNER');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_SET'], 'SET');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_PURE'], 'PURE');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_SEQ'], 'SEQ');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_COLOR'], 'COLOR');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_PAIR'], 'PAIR');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_HIGH'], 'HIGH');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Waiting'], 'Waiting');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on HIGH CARD: Win=bet*3'], 'Bet on HIGH CARD: Win=bet*3');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on PAIR: Win=bet*4'], 'Bet on PAIR: Win=bet*4');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on COLOR: Win=bet*5'], 'Bet on COLOR: Win=bet*5');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on SEQUENCE: Win= bet*6'], 'Bet on SEQUENCE: Win= bet*6');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on PURE SEQUENCE: Win=bet*10'], 'Bet on PURE SEQUENCE: Win=bet*10');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Bet on SET: Split the Jackpot*20%'], 'Bet on SET: Split the Jackpot*20%');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_MY HISTORY'], 'MY HISTORY');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Result'], 'Result');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Total'], 'Total');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Type'], 'Type');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Time'], 'Time');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Winner'], 'Winner');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_Win'], 'Win');
        this.EnglishMap.set(I18NLabelTransIdEnum['Game_JACKPOT 1157 DRAWS LEFT'], 'JACKPOT 1157 DRAWS LEFT');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_CURRENT LEVEL:'], 'CURRENT LEVEL:');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_ADD CASH'], 'Add Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_TO BET'], 'To Bet');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Benefits'], 'Benefits');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_RULES'], 'Rules');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Only VIP players can use this feature'], 'Only VIP players can use this feature');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Add cash 200 now to become a VIP player.'], 'Add cash 200 now to become a VIP player.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP Rules'], 'VIP Rules');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Level up gift'], 'Level up gift');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count'], 'Daily \nWithdrawal Count');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Withdrawal Limit'], 'Withdrawal Limit');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Monthly Allowance'], 'Monthly Allowance');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance'], 'Weekly Allowance');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance'], 'Daily Allowance');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP Seats'], 'VIP Seats');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP Customer Service'], 'VIP \nCustomer Service');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP Name Color'], 'VIP Name Color');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Level Up Gift'], 'Level Up Gift');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Lucky Draw'], 'Lucky Draw');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_The maximum number of withdrawals a usercan make in a day.'], 'The maximum number of withdrawals a usercan make in a day.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_The maximum withdrawal amount a user can withdraw.'], 'The maximum withdrawal amount a user can withdraw.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP players can occupy prominent positions in gambling games.'], 'VIP players can occupy prominent positions in gambling games.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.'], 'VIP customer service with faster response speed and higher service quality will only offer to VIP users.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Unique color of the VIP users name.'], 'Unique color of the VIP users name.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.'], 'Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.'], 'Each VIP level increase corresponds to an increase in the number of lucky draws.');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Your VIP level needs to be improved'], 'Your VIP level needs to be improved');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Please go to upgrade your VIP level'], 'Please go to upgrade your VIP level');
        this.EnglishMap.set(I18NLabelTransIdEnum['MyVip_Go Upgrade'], 'Go Upgrade');

        this.EnglishMap.set(I18NLabelTransIdEnum['Shop_Add Cash'], 'Add Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Shop_Total Get'], 'Total Get');
        this.EnglishMap.set(I18NLabelTransIdEnum['Shop_Cash'], 'Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Shop_Bonus'], 'Bonus');
        this.EnglishMap.set(I18NLabelTransIdEnum['Shop_Select payment amount'], 'Select payment amount');

        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Withdraw'], 'Withdraw');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Cash Balance'], 'Cash Balance');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal history'], 'Withdrawal history');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Add Cash'], 'Add Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Deposit Cash'], 'Deposit Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Winnings Cash'], 'Winnings Cash');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Daily Withdrawal Count Left'], 'Daily Withdrawal Count Left');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal Amount'], 'Withdrawal Amount');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Okay'], 'Okay');
        this.EnglishMap.set(I18NLabelTransIdEnum['Withdraw_Tip'], 'Tip');

        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Record'], 'Record');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Recharge'], 'Recharge');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Withdraw'], 'Withdraw');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Order processing in'], 'Order processing in 1-7 working dayslease be patient');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_NO DATA'], 'NO DATA');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Amount'], 'Amount: ');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Change amount'], 'Change amount: ');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Before'], 'Before: ');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_After'], 'After: ');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Okay'], 'Okay');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Tip'], 'Tip');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Processing'], 'Processing');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Succeeded'], 'Succeeded');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Failed'], 'Failed');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Pending'], 'Pending');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Rejected'], 'Rejected');
        this.EnglishMap.set(I18NLabelTransIdEnum['TransactionRecord_Experience Coins'], 'Experience Coins');






        /**
         * 印度语
         */
        this.HindiMap.set(I18NLabelTransIdEnum['Login_The Best Online Experience'], 'सबसे अच्छा ऑनलाइन अनुभव');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Play instant online any time'], 'किसी भी समय तत्काल ऑनलाइन खेलें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Win cash prizes instantly'], 'तुरंत नकद जीत');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_100% Secure 100% Legal'], '१oo% सुरक्षा, १oo% कानूनी');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Register to get  ₹10 Bonus'], 'मोबाइल ₹10 बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Input phone number here'], 'यहां फोन नंबर डालें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Please enter the correct phone number'], 'कृपया सही फोन नंबर दर्ज');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Login'], 'लॉग इन करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Login Via Facebook'], 'फेसबुक लॉग इन');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Please be wait and check your phone!'], 'कृपया प्रतीक्षा करें और अपना फोन जांचें!');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Verify with OTP'], 'ओटीपी के साथ सत्यापित करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Sent to'], 'को भेजा');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Input OTP here'], 'यहां ओटीपी डालें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_X Invalid OTP. Please try again.'], 'एक्स अवैध ओटीपरी। कृपया दोबारा प्रयास करें।');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Resend OTP in'], 'में ओटीपी फिर से भेजें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Not received. Resend'], 'नही मिला। दोबारा भेजें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Resend'], 'दोबारा भेजें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Back & Change Mobile'], 'वापस करें और मोबाइल बदलें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Guest Login'], 'मेहमान लॉगइन करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Login_Quick Login'], 'त्वरित लॉगिन');

        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_WITHDRAW'], 'वापसी');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_ADD'], 'जोड़');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_ADDCASH'], 'कैश जोड़े');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Mobile'], 'मोबाइल');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Mobile 10 BONUS'], 'मोबाइल 10 बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Activity'], 'गतिविधि');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_REFER ＆ EARN'], 'दोस्त को सूचित करें और कमाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_JHANDI MUNDA'], 'झंडी मुंडा');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_WHACK-A-MOLE'], 'व्हैक अ मोल');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_HORSE RACING'], 'घुड़दौड़');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_FRUIT PARTY'], 'फ्रूट पार्टव्');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_LUCKY  LOTO'], 'लकी लोटो');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_MESSAGE'], 'संदेश');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_NO MESSAGE'], 'ना संदेश');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Only keep mails within 15 days'], 'सिर्फ 15 दिनों के भीतर मेल रखें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Deposit'], 'जमा');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Winning'], 'जीत');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Total Cash'], 'कुल सिक्का');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Bonus'], 'बोनास');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Bind'], 'बिंदो');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Modify'], 'संशोधित');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Email'], 'ईमेल');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Name'], 'नाम');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Input your new nickname below'], 'अपना नया उपनाम नीचे दर्ज करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_No more than 12 character'], '12 से अधिक वर्ण नहीं');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Users can only modify if once within 24 hours'], 'उपयोगकर्ता केवल 24 घंटे के लिए इसे संशोधित कर सकते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Nickname can not be Empty'], 'पनाम खाली नहीं हो सकता');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Invalid nickname , please use common letters and numbers'], 'अवैध उपनाम, कृपया सामान्य शब्दों और संख्याओं का इस्तेमाल करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_OKay'], 'अच्छा');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Nickname modified successfully'], 'उपनाम सफलतापूर्वक संशोधित किया गया');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_CHANGE'], 'परिवर्तन');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Photograph'], 'तस्वीर');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Select From Photos'], 'तस्वीरों में से चुनें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Cancel'], 'रद्द करना');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_VERIFY MOBILE'], 'मोबाइल सत्यापित करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_FREE 10 BONUS'], 'मुफ्त 10 बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_FREE'], 'मुफ्त');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Please enter your Name'], 'अपना नाम दर्ज करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Input phone number here'], 'यहां फोन नंबर डालें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Input OTP here'], 'यहां ओटीपी डालें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Input your Email'], 'अपना ईमेल इनपुट करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Name can not be Empty'], 'नाम की जगह खाली नहीं रह सकती !');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Please enter the correct phone number'], 'कृपया सही फोन नंबर दर्ज करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_X Invalid OTP .Please try again'], 'एक्स अवैध ओटीपी। कृपया दोबारा प्रयास करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Email cannot be empty'], 'इनपुट जानकारी खाली नहीं हो सकती');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Please fill in the correct email'], 'कृपया सही ईमेल भरें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_SETTINGS'], 'समायोजन');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_English'], 'अंग्रेजी');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Hindi'], 'हिंदी');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Urdu'], '');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Bengali'], '');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Background Music'], 'बैकग्राउड संगीत');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Effect Sound'], 'प्रभाव ध्वनि');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Version'], 'संस्करण');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Rate us'], 'हमें रेटिंग दें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_TAP on stars to Rate us'], 'हमें रेट करने के लिए सितारों पर टैप करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Thank you for your Rate us'], 'हमें रेट करने के लिए धन्यवाद');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Copy'], 'कॉपी');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Logout'], 'लॉग आउट');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Privacy Policy'], 'गोपनीयता नीति');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Terms of Service'], 'सेवा की शर्तें');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_How to play'], 'कैसे खेलने के लिए');
        this.HindiMap.set(I18NLabelTransIdEnum['Lobby_Contact US'], 'संपर्क करें');

        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Customer System'], 'ग्राहक सेवा');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Customer Service'], 'ग्राहक सेवा');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Due to working hours, sometimes customer service can`t reply in time, sorry！'], 'काम के घंटों के कारण, कभी-कभी ग्राहक सेवा समय पर जवाब नहीं दे पाती है, क्षमा करें！');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Copied successfully'], 'सफलतापूर्वक कॉपी किया गया');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Fast feedback'], 'तेज़ फीडबैक');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward'], '1.हमें अपने प्रश्नों और सुझावों पर प्रतिक्रिया दें। सत्यापन के बाद, आपको विशेष नकद इनाम मिलेगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_2.Your feedback will be answered within 1-2 working days'], '2.आपकी प्रतिक्रिया का जवाब  1-2 कार्य दिवसों के भीतर दिया जाएगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Please fill in your questions and suggestions here and send them to us.'], 'कृपया अपने प्रश्नों और सुझावों को यहां भरें और हमें भेजें।');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Send'], 'भेजना');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_NOTICE'], 'नोटिस');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Send successfully'], 'सफलतापूर्वक भेजें!');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Please pay attention to Message'], 'कृपया संदेश पर ध्यान दें');
        this.HindiMap.set(I18NLabelTransIdEnum['Customer_Please contact us if you need help'], 'अगर आपको मदद चाहिए तो कृपया हमसे संपर्क करें!');

        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_REFER ＆EARN'], 'दोस्तों को सूचित करें और कमाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Get a bonus every time they win'], 'हर बार उनके जीतने पर बोनस प्राप्त करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_For every a ₹100 win , the system will reward ₹5'], 'प्रत्येक ₹100 की जीत पर, सिस्टम ₹ 5 का इनाम देगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_You can see the details at "Bonus Table"'], 'आप "बोनस टेबल" पर विवरण देख सकते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Share \nWith \nfriend'], 'दोस्त के साथ साझा करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_all belong to your team'], 'सभी आपकी टीम के हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_You`re going to be a'], 'आप करोड़पति बनने जा रहे हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_If your team has 1000 people a day'], 'अगर आपकी टीम में एक दिन में 1000 लोग हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_they each win ₹100 . You can get a bonus of ₹5000 every day<₹5000的奖金'], 'वे प्रत्येक <₹100 जीतते हैं। आप हर दिन <₹5000 का बोनस प्राप्त कर सकते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_If you have 10000 or 100000 people?'], 'अगर आपके पास 10000 या 100000 लोग हैं?');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Share more'], 'अधिक साझा करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Copy Link'], 'प्रतिरूप जोड़ना');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Team'], 'टीम');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.'], 'जिन दोस्तों को आप आमंत्रित करते हैं, साथ ही जिन दोस्तों को वे आमंत्रित करते हैं, वे अनिश्चित काल तक लूप कर सकते हैं। सभी आपकी टीम के हैं।');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_History'], 'इतिहास');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Bonus Table'], 'बोनस तालिका');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.'], 'आपकी टीम में कोई भी, जब तक वे पैसा जीतते हैं, आपको एक निश्चित इनाम मिलेगा। आप जितने अधिक लोगों को आमंत्रित करेंगे, आपको उतने ही अधिक पुरस्कार मिलेंगे।');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50'], 'आपके द्वारा आमंत्रित किसी भी व्यक्ति के लिए, अगर वह पहली बार <₹100 का रिचार्ज करते हैं, तो आपको <₹5 का इनाम मिलेगा। अगर वह पहली बार <₹1000 का रिचार्ज करते हैं, तो आपको ₹50 का इनाम मिलेगा। ');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Total Bonus'], 'कुल बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.'], 'सिस्टम सुबह 00: 00 बजे आउटपुट मूल्य के आधार पर बोनस की गणना करेगा, इसलिए किसी दिन के लिए आपका बोनस अगले दिन प्राप्त होगा।');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_GET BONUS'], 'बोनस प्राप्त करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_What is a team?'], 'एक टीम क्या है?');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_NAME'], 'नाम');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_INVITED'], 'आमंत्रित');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Every reward you received will immediately enter your deposit'], 'आपके द्वारा प्राप्त किया गया हर एक पुरस्कार तुरंत आपकी जमा राशि में प्रवेश करेगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Total Output Value'], 'कुल उत्पादन मूल्य');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_TIME'], 'समय');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_OUTPUT INCOME'], 'आउटपुट आय');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_INVITED INCOME'], 'आमंत्रित आय');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_The more people you invite , the more rewards you get for every 100 people in your team'], 'आप जितने अधिक लोगों को आमंत्रित करेंगे , आपकी टीम में प्रत्येक 100 लोगों के लिए आपको उतने ही अधिक पुरस्कार मिलेंगे');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_winnings output value!!'], 'जीत उत्पादन मूल्य!');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_NUMBER OF INVITEES'], 'आमंत्रितों की संख्या');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_BONUS'], 'बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Invite Friends'], 'दोस्तों को आमंत्रित करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Operation'], 'कार्यवाही');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Invite All'], 'सबको आमंत्रित करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Total Friends'], 'कुल दोस्त');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_Potential Bonus'], 'संभावित बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Promoter_search'], 'खोज');

        this.HindiMap.set(I18NLabelTransIdEnum['Select_3 Patti'], '३ पट्टी');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Pot Blind'], 'पॉट ब्लाइंड');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_PRACTICE'], 'अभ्यास');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_CASH'], 'नकद');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Play Now'], 'अब खेलते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_ADD'], 'जोड़');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Boot'], 'मबूट');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Min Buyin'], 'मिन बायिन');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Chaal limit'], 'चल सीमा');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Pot limit'], 'पॉट सीमा');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Total Players'], 'कुल खिलाड़ी');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Join'], 'जोड़ें');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_LOW'], 'कम');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_MID'], 'मिड');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_HIGH'], 'हिगो');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Min bet'], 'मिन बेट');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Max Bet'], 'अधिकतम शर्त');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Max payout'], 'अधिकतम भुगतान');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_2 player'], '2 खिलाड़ी');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_6 player'], '6 खिलाड़ी');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Point Value'], 'बूट मूल्य');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Max players'], 'अधिकतम खिलाड़ी');
        this.HindiMap.set(I18NLabelTransIdEnum['Select_Add Cash'], 'कैश जोड़े');

        this.HindiMap.set(I18NLabelTransIdEnum['Activity_DAILY FREE RUPEES'], 'दैनिक मुफ्त रुपये');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Get rewards'], 'पुरस्कार पाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_REWARDS'], 'पुरस्कार');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_LUCKY TURNTABLE'], 'लकी टर्नटेबल');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Tips'], 'टिप्स');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_1.You can get a luckdraw for every 50 games you play'], '1.आपको अपने द्वारा खेले गए हर 50 खेल के लिए एक लकड्रा मिलेगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_2.there is a freelottery every day'], '2.हर दिन एक मुफ्त लॉटरी होती है');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Remaining times'], 'बचा हुआ समय');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_GET YOUR BONUS'], 'आप बोनस प्राप्त करो');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Login every day can get rewards'], 'पुरस्कार पाने के लिए हर दिन लॉगिन करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_more cash bonus after the purchase'], 'खरीद के बाद अधिक नकद बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_ADD CASH'], 'कैश जोड़े');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Cash'], 'जमा');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Bonus'], 'बोनस');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Total Get'], 'कुल सिक्का');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Only one chance . choose any one to buy'], 'सिर्फ एक मौका। खरीदने के लिए कोई एक चुनें');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Other Amount>>'], 'अन्य राशि');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Bonus will be transferred into deposit when you lose in some games deposit'], 'जब आप कुछ खेल में हार जाते हैं तो जमा में बोनस स्थानांतरित कर दिया जाएगा');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_GET FROM EVENTS'], 'घटनाओं से प्राप्त करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_GET IN GAMES'], 'खेलों में शर्त लगाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Get more'], 'ज्यादा पाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Collect'], 'जुटायें');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash'], 'आपको मिलने वाले सभी बोनस यहां रखे जाएंगे जब भी आप खेल में पैसे खो देंगे, बोनस आपके द्वारा खोए गए धन के 10% पर नकद में परिवर्तित हो जाएगा। इस समय आप नकद ले सकते हैं।');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Bonus Card'], 'बोनस कार्ड');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_DAILY BONUS CARD'], 'दैनिक बोनस कार्ड');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration'], 'हर बार खरीदने के लिए 1 दैनिक बोनस कार्ड चुनें, समाप्ति के बाद आप दूसरे कार्ड का चयन कर सकते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_SILVER CARD'], 'रजत कार्ड');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_GOLD CARD'], 'स्वर्ण कार्ड');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_DIAMOND CARD'], 'डायमंड कार्ड');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_Get 1000 right now'], 'अभी 1000 प्राप्त करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_20 Bonus x7 days'], '20 बोनस x7 दिन');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_NOTICE'], 'सूचना');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days'], '1.आप दैनिक बोनस कार्ड खरीदने के लिए रिचार्ज कर सकते हैं， आप अभी रिचार्ज की गई राशि प्राप्त कर सकते हैं, और अतिरिक्त बोनस पुरस्कार कुछ दिनों में दिए जाएंगे');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_2.You can only choose one type to purchase . On- ly one card is allowed at the same time'], '2.आप खरीदने के लिए सिर्फ एक प्रकार का चयन कर सकते हैं। एक ही समय में सिर्फ एक कार्ड की अनुमति है');
        this.HindiMap.set(I18NLabelTransIdEnum['Activity_3.You can buy the Daily Bonus Card only after the first deposit.'], '3.आप पहली जमा राशि के बाद ही दैनिक बोनस कार्ड खरीद सकते हैं।');

        this.HindiMap.set(I18NLabelTransIdEnum['Game_7UP 7DOWN'], '7ऊपर 7नीचे');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Start Betting'], 'सट्टेबाजी शुरू करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Betting starts in 0 seconds'], 'बेटिंग 0 सेकंड में शुरू होती है');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Betting ends in 11 seconds'], 'बेटिंग 11 सेकंड में समाप्त होती है');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Billing'], 'बिलिंग');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_ONLINE PLAYERS'], 'ऑनलाइन खिलाड़ी');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Total online players:xxxx'], 'कुल ऑनलाइन खिलाड़ी: xxxx');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Do you want to exit the VIP seat?'], 'क्या आप वीआईपी सीट से बाहर निकलना चाहते हैं？');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Are you sure you want to join the VIP seat?'], 'क्या आप वाकई वीआईपी सीट से जुड़ना चाहते हैं?');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_There are other players in this VIP seat . Please choose again!'], 'वीआईपी सीट पर अन्य खिलाड़ी हैंहै!');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_You can`t be a VIP if you carry less than 100 gold coins'], 'अगर आपके पास 100 से कम सोने के सिक्के हैं तो आप वीआईपी नहीं हो सकते');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_On other VIP seats, are you sure you want to enter this VIP seat?'], 'अन्य वीआईपी सीटों पर, क्या आप वाकई इस वीआईपी सीट में प्रवेश करना चाहते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_You`re not a VIP . You can`t send expressions'], 'आप एक वीआईपी नहीं हैं। अब भाव नहीं भेज सकते');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_DRAGON VS TIGER'], 'ड्रगैन बनाम बाघ');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Repeat bets'], 'शर्तों को दोहराएं');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_WINNING HISTORY'], 'जीतने का इतिहास');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Tiger'], 'बाघ');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Dragon'], 'ड्रैगन');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Tie'], 'बंधना');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Set'], 'सेट');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_HORSE RACING'], 'घुड़दौड़');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Odds'], 'अंतर');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Horse'], 'घोड़ा');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_You won'], 'आप जीते');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_THE GAME IS ABOUT TO START PLEASE SET THE BET.'], 'खेल शुरू होने वाला कृपया शर्त तय कर लें।');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Prev'], 'पिछला');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Next'], 'अगला');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Stop Betting!'], 'शर्त लगाना बंदर करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Fruit Party'], 'फ्रूट पार्टी');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_MAX'], 'अधिकतम');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_BET AMOUNT'], 'शर्त की रकम');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_TOTAL WIN'], 'कुल जीतें');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_FAST'], 'तेज़');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_AUTO'], 'स्वत');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_SPIN'], 'घुमाना');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Lucky Loto'], 'लकी लोटो');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_JACKPOT'], 'जैकपॉट');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Interval after jackpot'], 'जैकपॉट के बाद अंतराल');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Betting'], 'शर्त लगाना');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_BIG WINNER'], 'बड़ा विजेता');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_SET'], 'सेट');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_PURE'], 'शुद्ध');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_SEQ'], 'अनुक्रम');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_COLOR'], 'रंग');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_PAIR'], 'जोड़ा');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_HIGH'], 'ऊंचा');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Waiting'], 'प्रतीक्षारत');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on HIGH CARD: Win=bet*3'], 'हाई कार्ड पर शर्त लगाएं: जीत= शर्त*3');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on PAIR: Win=bet*4'], 'जोड़े पर शर्त लगाएं: जीत= शर्त*4');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on COLOR: Win=bet*5'], 'रंग पर शर्त लगाएं: जीत= शर्त*5');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on SEQUENCE: Win= bet*6'], 'अनुक्रम पर शर्त लगाएं: जीत= शर्त*6');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on PURE SEQUENCE: Win=bet*10'], 'शुद्ध अनुक्रम पर शर्त लगाएं: जीत= शर्त*10');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Bet on SET: Split the Jackpot*20%'], 'सेट पर शर्त लगाएं: जैकपॉट को विभाजित करें*20%');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_MY HISTORY'], 'मेरा इतिहास');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Result'], 'परिणाम');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Total'], 'कुल');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Type'], 'प्रकार');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Time'], 'समय');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Winner'], 'विजेता');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_Win'], 'जीत');
        this.HindiMap.set(I18NLabelTransIdEnum['Game_JACKPOT 1157 DRAWS LEFT'], 'जैकपॉट 1157 ड्रॉ बाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_CURRENT LEVEL:'], 'वर्तमान स्तर:');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_ADD CASH'], 'कैश जोड़े');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_TO BET'], 'शर्त लगाने के लिए');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Benefits'], 'फ़ायदे');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_RULES'], 'नियम');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Only VIP players can use this feature'], 'इस सुविधा का उपयोग केवल वीआईपी खिलाड़ी ही कर सकते हैं');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Add cash 200 now to become a VIP player.'], 'वीआईपी खिलाड़ी बनने के लिए अभी नकद 200 जोड़ें।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP Rules'], 'वीआईपी नियम');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Level up gift'], 'उपहार का स्तर बढ़ाएँ');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count'], 'दैनिक \nनिकासी गणना');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Withdrawal Limit'], 'आहरण सीमा');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Monthly Allowance'], 'मासिक भत्ता');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance'], 'साप्ताहिक भत्ता');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance'], 'दैनिक भत्ता');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP Seats'], 'वीआईपी सीटें');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP Customer Service'], 'वीआईपी \nग्राहक सेवा');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP Name Color'], 'वीआईपी नाम का रंग');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Level Up Gift'], 'लेवल अप उपहार');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Lucky Draw'], 'लकी ड्रा');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_The maximum number of withdrawals a usercan make in a day.'], 'एक उपयोगकर्ता एक दिन में अधिकतम निकासी कर सकता है।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_The maximum withdrawal amount a user can withdraw.'], 'एक उपयोगकर्ता अधिकतम निकासी राशि निकाल सकता है।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'वीआईपी उपयोगकर्ताओं के लिए प्रत्येक स्तर का मासिक भत्ता उपलब्ध है। इसे वीआईपी पेज पर एकत्रित करें।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'वीआईपी उपयोगकर्ताओं के लिए प्रत्येक स्तर का साप्ताहिक भत्ता उपलब्ध है। इसे वीआईपी पेज पर एकत्रित करें।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'वीआईपी उपयोगकर्ताओं के लिए प्रत्येक स्तर का दैनिक भत्ता उपलब्ध है। इसे वीआईपी पेज पर एकत्रित करें।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP players can occupy prominent positions in gambling games.'], 'वीआईपी खिलाड़ी जुए के खेल में प्रमुख स्थान पर कब्जा कर सकते हैं।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.'], 'तेज़ प्रतिक्रिया गति और उच्च सेवा गुणवत्ता वाली वीआईपी ग्राहक सेवा केवल वीआईपी उपयोगकर्ताओं को प्रदान की जाएगी।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Unique color of the VIP users name.'], 'वीआईपी उपयोगकर्ता नाम का अनोखा रंग.');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.'], 'वीआईपी सुपर गिफ्ट पैक के प्रत्येक स्तर को केवल एक बार खरीदा जा सकता है, जिसका उपयोग वर्तमान स्तर को शीघ्रता से अपग्रेड करने के लिए किया जा सकता है।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.'], 'प्रत्येक वीआईपी स्तर की वृद्धि लकी ड्रा की संख्या में वृद्धि से मेल खाती है।');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Your VIP level needs to be improved'], 'आपके वीआईपी स्तर में सुधार की जरूरत है');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Please go to upgrade your VIP level'], 'कृपया अपने वीआईपी स्तर को अपग्रेड करने के लिए जाएं');
        this.HindiMap.set(I18NLabelTransIdEnum['MyVip_Go Upgrade'], 'अपग्रेड करें');

        this.HindiMap.set(I18NLabelTransIdEnum['Shop_Add Cash'], 'कैश जोड़े');
        this.HindiMap.set(I18NLabelTransIdEnum['Shop_Total Get'], 'कुल प्राप्त');
        this.HindiMap.set(I18NLabelTransIdEnum['Shop_Cash'], 'नकद');
        this.HindiMap.set(I18NLabelTransIdEnum['Shop_Bonus'], 'बक्शीश');
        this.HindiMap.set(I18NLabelTransIdEnum['Shop_Select payment amount'], 'भुगतान राशि चुनें');

        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Withdraw'], 'निकालना');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Cash Balance'], 'नकदी संतुलन');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal history'], 'निकासी का इतिहास');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Add Cash'], 'कैश जोड़े');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Deposit Cash'], 'नकद जमा करें');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Winnings Cash'], 'जीत नकद');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Daily Withdrawal Count Left'], 'दैनिक निकासी गणना शेष');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal Amount'], 'निकाली गयी राशि');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Okay'], 'ठीक है');
        this.HindiMap.set(I18NLabelTransIdEnum['Withdraw_Tip'], 'बख्शीश');

        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Record'], 'अभिलेख');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Recharge'], 'फिर से दाम लगाना');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Withdraw'], 'निकालना');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Order processing in'], '1-7 कार्य दिवसों में ऑर्डर प्रोसेसिंग, धैर्य रखें');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_NO DATA'], 'कोई डेटा नहीं');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Amount'], 'मात्रा: ');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Change amount'], 'परिवर्तन राशि: ');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Before'], 'पहले: ');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_After'], 'बाद में: ');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Okay'], 'ठीक है');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Tip'], 'बख्शीश');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Processing'], 'प्रसंस्करण');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Succeeded'], 'सफल हुए');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Failed'], 'असफल');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Pending'], 'लंबित');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Rejected'], 'अस्वीकार कर दिया');
        this.HindiMap.set(I18NLabelTransIdEnum['TransactionRecord_Experience Coins'], 'सिक्कों का अनुभव करें');







        /**
         * 孟加拉语
         */
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_The Best Online Experience'], 'সেরা অনলাইন অভিজ্ঞতা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Play instant online any time'], 'যেকোনো সময় তৎক্ষণাৎ অনলাইনে খেলুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Win cash prizes instantly'], 'অবিলম্বে ক্যাশ প্রাইজ জিতুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_100% Secure 100% Legal'], '100% সুরক্ষিত 100% আইনসম্মত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Register to get  ₹10 Bonus'], '₹10 বোনাস পেতে নিবন্ধন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Input phone number here'], 'এখানে ফোন নম্বর লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Please enter the correct phone number'], 'অনুগ্রহ করে সঠিক ফোন নম্বর লিখুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Login'], 'লগইন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Login Via Facebook'], 'Facebook দিয়ে লগইন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Please be wait and check your phone!'], 'অনুগ্রহ করে অপেক্ষা করে আপনার ফোন চেক করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Verify with OTP'], 'OTP যাচাই করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Sent to'], 'এখানে পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Input OTP here'], 'OTP এখানে লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_X Invalid OTP. Please try again.'], 'X অবৈধ OTP। অনুগ্রহ করে আবার চেষ্টা করুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Resend OTP in'], 'এ OTP আবার পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Not received. Resend'], 'পাওয়া হয়নি। আবার পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Resend'], 'আবার পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Back & Change Mobile'], 'ফিরে যান ও মোবাইল নম্বর পরিবর্তন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Guest Login'], 'গেস্ট লগইন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Login_Quick Login'], 'দ্রুত লগইন');

        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_WITHDRAW'], 'ফেরত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_ADD'], 'যোগ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_ADDCASH'], 'ক্যাশ যোগ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Mobile'], 'মোবাইল');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Mobile 10 BONUS'], 'মোবাইল 10 বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Activity'], 'গতিবিধি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_REFER ＆ EARN'], 'রেফার করুন ও জিতুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_JHANDI MUNDA'], 'JHANDI MUNDA');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_WHACK-A-MOLE'], 'WHACK-A-MOLE');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_HORSE RACING'], 'HORSE RACING');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_FRUIT PARTY'], 'FRUIT PARTV');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_LUCKY  LOTO'], 'LUCKY  LOTO');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_MESSAGE'], 'বার্তা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_NO MESSAGE'], 'কোনো বার্তা নেই');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Only keep mails within 15 days'], 'শুধু 15 দিনের মেল রাখুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Deposit'], 'জমা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Winning'], 'জয়লাভ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Total Cash'], 'মোট ক্যাশ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Bonus'], 'বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Bind'], 'বাইন্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Modify'], 'সংশোধিত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Email'], 'ইমেল');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Name'], 'নাম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Input your new nickname below'], 'আপনার নতুন ডাকনাম নীচে লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_No more than 12 character'], '12 এর চেয়ে বেশি অক্ষর নয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Users can only modify if once within 24 hours'], 'ব্যবহারকারীরা শুধু 24 ঘন্টার জন্য এটি সংশোধন করতে পারেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Nickname can not be Empty'], 'ডাকনাম খালি রাখা যাবে না');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Invalid nickname , please use common letters and numbers'], 'অবৈধ ডাকনাম, অনুগ্রহ করে প্রচলিত বর্ণ ও সংখ্যাগুলি ব্যবহার করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_OKay'], 'আচ্ছা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Nickname modified successfully'], 'ডাকনাম সফলভাবে সংশোধন করা হয়েছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_CHANGE'], 'পরিবর্তন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Photograph'], 'ফোটোগ্রাফ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Select From Photos'], 'ছবিগুলির থেকে বেছে নিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Cancel'], 'বাতিল করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_VERIFY MOBILE'], 'মোবাইল যাচাই করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_FREE 10 BONUS'], 'ফ্রি 10 বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Please enter your Name'], 'অনুগ্রহ করে আপনার নাম লিখুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Input phone number here'], 'এখানে ফোন নম্বর লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Input OTP here'], 'OTP এখানে লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Input your Email'], 'আপনার ইমেল লিপিবদ্ধ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Name can not be Empty'], 'নাম খালি রাখা যাবেন না!');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Please enter the correct phone number'], 'অনুগ্রহ করে সথ্জিক ফোন নম্বর লিখুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_X Invalid OTP .Please try again'], 'X অবৈধ OTP। অনুগ্রহ করে আবার চেষ্টা করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Email cannot be empty'], 'ইমেল খালি রাখা যাবে না');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Please fill in the correct email'], 'অনুগ্রহ করে সঠিক ইমেল পূরণ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_SETTINGS'], 'বিন্যাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_English'], 'ইংরেজি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Hindi'], '');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Urdu'], '');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Bengali'], 'বাংলা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Background Music'], 'ব্যাকগ্রাউন্ড সঙ্গীত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Effect Sound'], 'প্রভাব ধ্বনি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Version'], 'সংস্করণ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Rate us'], 'আমাদের রেটিং দিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_TAP on stars to Rate us'], 'আমাদের রেটিং দেওয়ার জন্য স্টারে টোকা দিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Thank you for your Rate us'], 'আমাদের রেট করার জন্য ধন্যবাদ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Copy'], 'কপি করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Logout'], 'লগআউট করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Privacy Policy'], 'গোপনীয়তা নীতি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Terms of Service'], 'পরিষেবার শর্তাবলী');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_How to play'], 'কিভাবে খেলবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Lobby_Contact US'], 'আমাদের সাথে');

        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Customer System'], 'গ্রাহক পরিষেবা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Customer Service'], 'গ্রাহক পরিষেবা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Due to working hours, sometimes customer service can`t reply in time, sorry！'], 'কাজের সময়ের কারণে, কখনও কখনও গ্রাহক পরিষেবা সময়মতো উত্তর দিতে পারে না, দুঃখিত!');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Copied successfully'], 'সফলভাবে কপি করা হয়েছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Fast feedback'], 'দ্রুত প্রতিক্রিয়া');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward'], '1.আপনার প্রশ্ন ও পরামর্শজনিত প্রতিক্রিয়া আমাদের জানান। যাচাইকরণের পরে, আপনি একচেটিয়া ক্যাশ পুরস্কার পাবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_2.Your feedback will be answered within 1-2 working days'], '2.আপনার প্রতিক্রিয়ার উত্তর 1-2 কর্মদিবসের মধ্যে দেওয়া হবে ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Please fill in your questions and suggestions here and send them to us.'], 'অনুগ্রহ করে এখানে আপনার প্রশ্ন ও পরামর্শগুলি এখানে পূরণ করুন এবং তাদেরকে আমাদের কাছে পাঠান।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Send'], 'পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_NOTICE'], 'নোটিস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Send successfully'], 'সফলভাবে পাঠান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Please pay attention to Message'], 'অনুগ্রহ করে বার্তায় মনোযোগ দিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Customer_Please contact us if you need help'], 'আপনার সাহায্য লাগলে অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন!');

        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_REFER ＆EARN'], 'রেফার করুন ও জিতুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Get a bonus every time they win'], 'প্রতিবার তারা জিতলে একটি বোনাস পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_For every a ₹100 win , the system will reward ₹5'], 'প্রতি ₹100 জয়ে, সিস্টেম ₹5 পুরস্কার দেবে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_You can see the details at "Bonus Table"'], 'আপনি "বোনাস টেবিল" এ বিস্তারিত দেখতে পাবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Share \nWith \nfriend'], 'বন্ধুদের সাথে শেয়ার করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_all belong to your team'], 'সবগুলিই আপনার টিমের');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_You`re going to be a'], 'আপনি একজন কোটিপতি হতে চলেছেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_If your team has 1000 people a day'], 'আপনার টিমের এক দিনে 1000 জন থাকলে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_they each win ₹100 . You can get a bonus of ₹5000 every day<₹5000的奖金'], 'তারা প্রত্যেকে < ₹100 টাকা জিতবে। আপনি প্রতিদিন < ₹5000 এর একটি বোনাস পেতে পারেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_If you have 10000 or 100000 people?'], 'আপনার কাছে 10000 বা 100000 জন থাকলে?');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Share more'], 'আরও শেয়ার করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Copy Link'], 'লিঙ্ক কপি করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Team'], 'টিম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.'], 'আপনার আমন্ত্রণ জানানো বন্ধু, সেইসাথে তাদের আমন্ত্রণ জানানো বন্ধুরা, অনির্দিষ্টকালব্যাপী লুপ করতে পারেন। সবগুলিই আপনার টিমের।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_History'], 'ইতিহাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Bonus Table'], 'বোনাস টেবিল');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.'], 'আপনার টিমে যে কেউ, যতক্ষণ পর্যন্ত টাকা জিতবেন, ততক্ষণ আপনি একটি নির্দিষ্ট পুরস্কার পাবেন। আপনি যত বেশি লোককে আমন্ত্রণ জানাবেন, তত বেশি পুরস্কার পাবেন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50'], 'আপনার আমন্ত্রণ জানানো যে কেউ, প্রথমবারের জন্য < ₹100 এর রিচার্জ করলে, আপনি ₹5 এর একটি পুরস্কার পাবেন। তারা প্রথমবারের জন্য < ₹1000 রিচার্জ করলে, আপনি ₹50 এর একটি পুরস্কার পাবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Total Bonus'], 'মোট বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.'], 'সিস্টেম am00 : 00 এ আউটপুট মূল্যের ভিত্তিতে বোনাসের হিসাব করবে, তাই আপনার সেই দিনের বোনাস পরের দিন পাবেন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_GET BONUS'], 'বোনাস পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_What is a team?'], 'একটি টিম কি?');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_NAME'], 'নাম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_INVITED'], 'আমন্ত্রিত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Every reward you received will immediately enter your deposit'], 'আপনার পাওয়া প্রতিটি পুরস্কার অবিলম্বে আপনার জমা দেওয়ায় যোগ করা হবে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Total Output Value'], 'মোট আউটপুট মূল্য');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_TIME'], 'সময়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_OUTPUT INCOME'], 'আউটপুট আয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_INVITED INCOME'], 'আমন্ত্রিত আয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_The more people you invite , the more rewards you get for every 100 people in your team'], 'আপনি যত বেশিজনকে আমন্ত্রণ জানাবেন, আপনার টিমে প্রতি 100 জনের জন্য আপনি আরও বেশি পুরস্কার পাবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_winnings output value!!'], 'জয়লাভ আউটপুট মূল্যের');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_NUMBER OF INVITEES'], 'আমন্ত্রিতদের সংখ্যা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_BONUS'], 'বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Invite Friends'], 'বন্ধুদের আমন্ত্রণ জানান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Operation'], 'কাজকর্ম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Invite All'], 'সবাইকে আমন্ত্রণ জানান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Total Friends'], 'মোট বন্ধু');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_Potential Bonus'], 'সম্ভাব্য বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Promoter_search'], 'সন্ধান করুন');

        this.BengaliMap.set(I18NLabelTransIdEnum['Select_3 Patti'], '3 পাত্তি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Pot Blind'], 'পট ব্লাইন্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_PRACTICE'], 'অনুশীলন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_CASH'], 'নগদ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Play Now'], 'এখনই খেলুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_ADD'], 'যোগ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Boot'], 'বুট');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Min Buyin'], 'মিন বাইইন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Chaal limit'], 'চালের সীমা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Pot limit'], 'পটের সীমা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Total Players'], 'মোট খেলোয়াড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Join'], 'যোগ দিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_LOW'], 'কম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_MID'], 'মিড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_HIGH'], 'বড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Min bet'], 'ন্যূনতম বাজি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Max Bet'], 'সর্বাধিক বাজি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Max payout'], 'সর্বাধিক পাওয়া টাকা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_2 player'], '2 জন খেলোয়াড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_6 player'], '6 জন খেলোয়াড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Point Value'], 'পয়েন্ট মূল্য');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Max players'], 'সর্বাধিক প্রবেশ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Select_Add Cash'], 'নগদ যোগ করুন');

        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_DAILY FREE RUPEES'], 'প্রতিদিনের ফ্রি টাকা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Get rewards'], 'পুরস্কার পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_REWARDS'], 'পুরস্কার');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_LUCKY TURNTABLE'], 'ভাগ্যের চাকা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Tips'], 'পরামর্শ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_1.You can get a luckdraw for every 50 games you play'], '1.আপনি আপনার খেলা প্রতি 50টি গেমের জন্য একটি লাকিড্র পেতে পারেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_2.there is a freelottery every day'], '2.প্রতিদিন একটি ফ্রি লটারি আছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Remaining times'], 'অবশিষ্ট সময়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_GET YOUR BONUS'], 'আপনার বোনাস পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Login every day can get rewards'], 'পুরষ্কার পেতে প্রতিদিন লগইন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_more cash bonus after the purchase'], 'ক্রয়ের পরে আরও ক্যাশ বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_ADD CASH'], 'নগদ যোগ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Cash'], 'নগদ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Bonus'], 'বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Total Get'], 'মোট প্রাপ্তি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Only one chance . choose any one to buy'], 'শুধু একটি সুযোগ। ক্রয় করার জন্য যেকোনো একটি বেছে নিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Other Amount>>'], 'অন্যান্য পরিমাণ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Bonus will be transferred into deposit when you lose in some games deposit'], 'খেলার জমা থাকা টাকার কিছুটা আপনি হারালে বোনাস আপনার জমাতে ট্রান্সফার করা হবে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_GET FROM EVENTS'], 'অনুষ্ঠানগুলির থেকে পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_GET IN GAMES'], 'খেলায় বাজি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Get more'], 'আরও পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Collect'], 'সংগ্রহ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash'], 'আপনার পাওয়া সব বোনাস এখানে রাখা থাকবে আপনি যখনই খেলায় টাকা হারাবেন, বোনাস আপনার হারানো টাকার 10% এ নগদে রূপান্তর করা হবে। সেই সময় আপনি নগদ সংগ্রহ করতে পারেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Bonus Card'], 'বোনাস কার্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_DAILY BONUS CARD'], 'প্রতিদিনের বোনাস কার্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration'], 'প্রতিবার ক্রয় করার জন্য 1 প্রতিদিনের বোনাস কার্ড বেছে নিন, আপনি মেয়াদ শেষ হয়ে যাওয়ার পরে অন্য কার্ড বেচার নিতে পারেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_SILVER CARD'], 'সিলভার কার্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_GOLD CARD'], 'গোল্ড কার্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_DIAMOND CARD'], 'ডায়মন্ড কার্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_Get 1000 right now'], 'এখনই 1000 পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_20 Bonus x7 days'], '20 বোনাস x 7 দিন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_NOTICE'], 'নোটিস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days'], '1.আপনি প্রতিদিনের বোনাস কার্ড ক্রয় করার জন্য রিচার্জ করতে পারেন, আপনি এখনই রিচার্জ করা পরিমাণ পেতে পারেন, এবং অতিরিক্ত বোনাস পুরস্কারগুলি কিছু দিনে দেওয়া হবে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_2.You can only choose one type to purchase . On- ly one card is allowed at the same time'], '2.আপনি ক্রয় করার জন্য শুধু একটি প্রকারই বেছে নিতে পারেন। এক সময়ে শুধু একটি কার্ডই অনুমোদিত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Activity_3.You can buy the Daily Bonus Card only after the first deposit.'], '3.আপনি প্রতিদিনের বোনাস কার্ড শুধু প্রথমবার জমা দেওয়ার পরেই ক্রয় করতে পারবেন।');

        this.BengaliMap.set(I18NLabelTransIdEnum['Game_7UP 7DOWN'], '7UP 7DOWN');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Start Betting'], 'বাজি ধরা শুরু করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Betting starts in 0 seconds'], 'বাজি ধরা 0 সেকেন্ডে শুরু হচ্ছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Betting ends in 11 seconds'], 'বাজি ধরা 11 সেকেন্ডে শেষ হচ্ছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Billing'], 'বিলিং');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_ONLINE PLAYERS'], 'অনলাইন খেলোয়াড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Total online players:xxxx'], 'মোট অনলাইন খেলোয়াড়: xxxx');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Do you want to exit the VIP seat?'], 'আপনি কি ভিআইপি সীটের থেকে বেরিয়ে আসতে চান?');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Are you sure you want to join the VIP seat?'], 'আপনি কি নিশ্চিত যে আপনি ভিআইপি সীটে যোগ দিতে চান?');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_There are other players in this VIP seat . Please choose again!'], 'এই ভিআইপি সীটে অন্য খেলোয়াড়রাও আছেন। অনুগ্রহ করে আবার বেছে নিন!');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_You can`t be a VIP if you carry less than 100 gold coins'], 'যদি আপনার কাছে 100 এর চেয়ে কম সোনার কয়েন থাকে তাহলে আপনি ভিআইপি হতে পারবেন না');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_On other VIP seats, are you sure you want to enter this VIP seat?'], 'অন্য ভিআইপি সীটে, আপনি কি নিশ্চিত অপি এই ভিআইপি সীটে প্রবেশ করতে চান?');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_You`re not a VIP . You can`t send expressions'], 'আপনি একজন ভিআইপি নন। আপনি অভিব্যক্তি পাঠাতে পারবেন না');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_DRAGON VS TIGER'], 'DRAGON VS TIGER');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Repeat bets'], 'আবার বাজি ধরুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_WINNING HISTORY'], 'জেতার ইতিহাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Tiger'], 'টাইগার');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Dragon'], 'ড্রাগন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Tie'], 'টাই');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Set'], 'সেট');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_HORSE RACING'], 'ঘোড়দৌড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Odds'], 'বিরূপতা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Horse'], 'ঘোড়া');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_You won'], 'আপনি জিতেছেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_THE GAME IS ABOUT TO START PLEASE SET THE BET.'], 'খেলা শুরু হতে যাচ্ছে অনুগ্রহ করে বাজি ধরুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Prev'], 'পূর্বের');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Next'], 'পরবর্তী');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Stop Betting!'], 'বাজি ধরা বন্ধ করুন!');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Fruit Party'], 'Fruit Party');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_MAX'], 'সর্বাধিক');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_BET AMOUNT'], 'বাজির পরিমাণ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_TOTAL WIN'], 'মোট জয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_FAST'], 'দ্রুত');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_AUTO'], 'অটো');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_SPIN'], 'স্পিন করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Lucky Loto'], 'Lucky Loto');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_JACKPOT'], 'জ্যাকপট');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Interval after jackpot'], 'জ্যাকপটের পরের বিরতি');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Betting'], 'বাজি ধরুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_BIG WINNER'], 'বড় জয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_SET'], 'সেট');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_PURE'], 'শুদ্ধ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_SEQ'], 'ক্রম');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_COLOR'], 'রং');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_PAIR'], 'জোড়া');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_HIGH'], 'বড়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Waiting'], 'অপেক্ষা করছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on HIGH CARD: Win=bet*3'], 'বড় তাসে বাজি ধরুন: জিতুন=বাজি*3');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on PAIR: Win=bet*4'], 'জোড়ায় বাজি ধরুন: জিতুন=বাজি*4');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on COLOR: Win=bet*5'], 'রংয়ে বাজি ধরুন: জিতুন=বাজি*5');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on SEQUENCE: Win= bet*6'], 'ক্রমে বাজি ধরুন: জিতুন=বাজি*6');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on PURE SEQUENCE: Win=bet*10'], 'শুদ্ধ ক্রমে বাজি ধরুন: জিতুন=বাজি*10');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Bet on SET: Split the Jackpot*20%'], 'সেটে বাজি ধরুন: জিতুন= জ্যাকপট ভাগ করুন*20');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_MY HISTORY'], 'আমার ইতিহাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Result'], 'ফলাফল');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Total'], 'মোট');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Type'], 'প্রকার');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Time'], 'সময়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Winner'], 'বিজয়ী');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_Win'], 'জয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Game_JACKPOT 1157 DRAWS LEFT'], 'জ্যাকপট 1157 ড্র বাকি আছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_CURRENT LEVEL:'], 'বর্তমান স্তর:');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_ADD CASH'], 'নগদ যোগ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_TO BET'], 'বাজি ধরা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Benefits'], 'সুবিধা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_RULES'], 'নিয়ম');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Only VIP players can use this feature'], 'শুধুমাত্র ভিআইপি খেলোয়াড়রাই এই বৈশিষ্ট্যটি ব্যবহার করতে পারবেন');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Add cash 200 now to become a VIP player.'], 'ভিআইপি প্লেয়ার হতে এখন নগদ 200 যোগ করুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP Rules'], 'ভিআইপি নিয়ম');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Level up gift'], 'লেভেল আপ উপহার');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count'], 'দৈনিক \nউত্তোলনের গণনা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Withdrawal Limit'], 'প্রত্যাহারের সীমা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Monthly Allowance'], 'মাসিক ভাতা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance'], 'সাপ্তাহিক ভাতা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance'], 'দৈনিক ভাতা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP Seats'], 'ভিআইপি আসন');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP Customer Service'], 'ভিআইপি \nগ্রাহক পরিষেবা');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP Name Color'], 'ভিআইপি নামের রঙ');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Level Up Gift'], 'লেভেল আপ উপহার');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Lucky Draw'], 'লাকি ড্র');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_The maximum number of withdrawals a usercan make in a day.'], 'একজন ব্যবহারকারী একদিনে সর্বোচ্চ যত সংখ্যক টাকা তুলতে পারবেন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_The maximum withdrawal amount a user can withdraw.'], 'সর্বাধিক উত্তোলনের পরিমাণ একজন ব্যবহারকারী প্রত্যাহার করতে পারেন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'ভিআইপি ব্যবহারকারীদের জন্য প্রতিটি স্তরের মাসিক ভাতা উপলব্ধ। ভিআইপি পৃষ্ঠায় এটি সংগ্রহ করুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'ভিআইপি ব্যবহারকারীদের জন্য প্রতিটি স্তরের সাপ্তাহিক ভাতা উপলব্ধ। ভিআইপি পৃষ্ঠায় এটি সংগ্রহ করুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'ভিআইপি ব্যবহারকারীদের জন্য প্রতিটি স্তরের দৈনিক ভাতা উপলব্ধ। ভিআইপি পৃষ্ঠায় এটি সংগ্রহ করুন।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP players can occupy prominent positions in gambling games.'], 'ভিআইপি খেলোয়াড়রা জুয়া খেলায় বিশিষ্ট অবস্থানে থাকতে পারে।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.'], 'দ্রুত প্রতিক্রিয়ার গতি এবং উচ্চতর পরিষেবার মানের সাথে ভিআইপি গ্রাহক পরিষেবা শুধুমাত্র ভিআইপি ব্যবহারকারীদের অফার করবে।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Unique color of the VIP users name.'], 'ভিআইপি ব্যবহারকারীদের নামের অনন্য রঙ।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.'], 'VIP সুপার গিফট প্যাকের প্রতিটি স্তর শুধুমাত্র একবার কেনা যাবে, বর্তমান স্তর দ্রুত আপগ্রেড করতে ব্যবহার করা হয়।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.'], 'প্রতিটি ভিআইপি স্তরের বৃদ্ধি ভাগ্যবান ড্রয়ের সংখ্যা বৃদ্ধির সাথে মিলে যায়।');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Your VIP level needs to be improved'], 'আপনার ভিআইপি স্তর উন্নত করা প্রয়োজন');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Please go to upgrade your VIP level'], 'আপনার ভিআইপি স্তর আপগ্রেড করতে যান');
        this.BengaliMap.set(I18NLabelTransIdEnum['MyVip_Go Upgrade'], 'আপগ্রেড করতে যান');

        this.BengaliMap.set(I18NLabelTransIdEnum['Shop_Add Cash'], 'নগদ যোগ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Shop_Total Get'], 'মোট পান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Shop_Cash'], 'নগদ');
        this.BengaliMap.set(I18NLabelTransIdEnum['Shop_Bonus'], 'বোনাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Shop_Select payment amount'], 'অর্থপ্রদানের পরিমাণ নির্বাচন করুন');

        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Withdraw'], 'প্রত্যাহার');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Cash Balance'], 'নগদ ভারসাম্য');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal history'], 'প্রত্যাহারের ইতিহাস');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Add Cash'], 'নগদ যোগ করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Deposit Cash'], 'নগদ জমা করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Winnings Cash'], 'নগদ জয়');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Daily Withdrawal Count Left'], 'দৈনিক প্রত্যাহার বাম গণনা');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal Amount'], 'তোলা টাকার পরিমান');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Okay'], 'ঠিক আছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['Withdraw_Tip'], 'টিপ');

        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Record'], 'রেকর্ড');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Recharge'], 'রিচার্জ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Withdraw'], 'প্রত্যাহার করুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Order processing in'], '1-7 কার্যদিবসের মধ্যে অর্ডার প্রক্রিয়াকরণ, ধৈর্য ধরুন');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_NO DATA'], 'কোনো ডেটা নেই');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Amount'], 'পরিমাণ: ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Change amount'], 'পরিমাণ পরিবর্তন করুন: ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Before'], 'আগে: ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_After'], 'পরে: ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Okay'], 'ঠিক আছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Tip'], 'টিপ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Processing'], 'প্রক্রিয়াকরণ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Succeeded'], 'সফল হয়েছে');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Failed'], 'ব্যর্থ');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Pending'], 'বিচারাধীন');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Rejected'], 'প্রত্যাখ্যাত');
        this.BengaliMap.set(I18NLabelTransIdEnum['TransactionRecord_Experience Coins'], 'অভিজ্ঞতা কয়েন');









        /**
         * 乌尔都语
         */
        this.UrduMap.set(I18NLabelTransIdEnum['Login_The Best Online Experience'], 'بہترین آن لائن تجربہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Play instant online any time'], 'کسی بھی وقت فوری طور پر آن لائن کھیلیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Win cash prizes instantly'], 'فوری طور پر کیش انعامات جیتیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_100% Secure 100% Legal'], '100 فیصد محفوظ 100 فیصد قانونی');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Register to get  ₹10 Bonus'], '10₹ بونس حاصل کرنے کے لیے رجسٹر ہوجائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Input phone number here'], 'یہاں فون نمبر درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Please enter the correct phone number'], 'براہِ کرم درست فون نمبر درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Login'], 'لاگ ان کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Login Via Facebook'], 'فیس بک کے ذریعے لاگ ان کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Please be wait and check your phone!'], 'براہِ کرم انتظار کریں اور اپنا فون چیک کریں !');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Verify with OTP'], 'OTP کے ساتھ تصدیق کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Sent to'], 'کو ارسال کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Input OTP here'], 'یہاں OTP درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_X Invalid OTP. Please try again.'], 'X غلط OTP۔ براہِ کرم دوبارہ کوشش کریں.');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Resend OTP in'], 'میں OTP دوبارہ بھیجیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Not received. Resend'], 'موصول نہیں ہوا۔   دوبارہ بھیجیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Resend'], 'دوبارہ بھیجیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Back & Change Mobile'], 'پیچھے جائیں اور موبائل تبدیل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Guest Login'], 'مہمان لاگ ان');
        this.UrduMap.set(I18NLabelTransIdEnum['Login_Quick Login'], 'فوری لاگ ان');

        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_WITHDRAW'], 'رقم نکالیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_ADD'], 'اضافہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_ADDCASH'], 'کیش شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Mobile'], 'موبائل');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Mobile 10 BONUS'], 'موبائل 10 بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Activity'], 'سرگرمی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_REFER ＆ EARN'], 'ریفر کریں اور جیتیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_JHANDI MUNDA'], 'جھنڈی منڈا');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_WHACK-A-MOLE'], 'وہیک اے مول');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_HORSE RACING'], 'گھڑ دوڑ');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_FRUIT PARTY'], 'فروٹ پارٹی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_LUCKY  LOTO'], 'لکی لوٹو');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_MESSAGE'], 'پیغام');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_NO MESSAGE'], 'کوئی پیغام نہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Only keep mails within 15 days'], 'صرف 15 دن کے اندر اندر میلز محفوظ رکھی جاتی ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Deposit'], 'ڈپازٹ کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Winning'], 'جیت');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Total Cash'], 'مجموعی کیش');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Bonus'], 'بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Bind'], 'باندھنا');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Modify'], 'ترمیم کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Email'], 'ای میل');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Name'], 'نام');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Input your new nickname below'], 'اپنی نئی عرفیت ذیل میں درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_No more than 12 character'], '12 حروف سے زیادہ نہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Users can only modify if once within 24 hours'], 'یوزرز 24 گھنٹے میں صرف ایک مرتبہ ہی ترمیم کرسکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Nickname can not be Empty'], 'عرفیت کا خانہ خالی نہیں چھوڑا جاسکتا');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Invalid nickname , please use common letters and numbers'], 'غلط عرفیت، براہِ کرم عام حروفِ تہجی اور اعداد استعمال کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_OKay'], 'ٹھیک ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Nickname modified successfully'], 'عرفیت میں کامیابی سے ترمیم کر دی گئی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_CHANGE'], 'تبدیل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Photograph'], 'فوٹوگراف');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Select From Photos'], 'تصاویر میں سے منتخب کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Cancel'], 'منسوخ کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_VERIFY MOBILE'], 'موبائل کی تصدیق کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_FREE 10 BONUS'], 'مفت 10 بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Please enter your Name'], 'براہِ کرم اپنا نام درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Input phone number here'], 'فون نمبر یہاں درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Input OTP here'], 'OTP یہاں درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Input your Email'], 'اپنا ای میل درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Name can not be Empty'], 'نام کا خانہ خالی نہیں چھوڑا جاسکتا!');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Please enter the correct phone number'], 'براہِ کرم درست فون نمبر درج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_X Invalid OTP .Please try again'], 'X غلط OTP۔ براہِ کرم دوبارہ کوشش کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Email cannot be empty'], 'ای میل کا خانہ خالی نہیں چھوڑا جاسکتا');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Please fill in the correct email'], 'براہِ کرم درست ای میل پُر کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_SETTINGS'], 'ترتیبات');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_English'], 'انگریزی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Hindi'], '');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Urdu'], 'اردو');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Bengali'], '');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Background Music'], 'پس منظر کی موسیقی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Effect Sound'], 'صوتی اثر');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Version'], 'ورژن');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Rate us'], 'ہمیں درجہ بندی دیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_TAP on stars to Rate us'], 'ہمیں درجہ بندی دینے کے لیے اسٹارز کو دبائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Thank you for your Rate us'], 'ہمیں درجہ بندی دینے پر آپ کا شکریہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Copy'], 'کاپی کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Logout'], 'لاگ آؤٹ کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Privacy Policy'], 'رازداری کی پالیسی');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Terms of Service'], 'شرائطِ استعمال');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_How to play'], 'کھیلنے کا طریقہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Lobby_Contact US'], 'ہم سے رابطہ کریں');

        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Customer System'], 'کسٹمر سروس');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Customer Service'], 'کسٹمر سروس');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Due to working hours, sometimes customer service can`t reply in time, sorry！'], 'دفتری اوقاتِ کار کے باعث، بعض اوقات کسٹمر سروس کا جواب بروقت موصول نہیں ہو پاتا، معذرت !');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Copied successfully'], 'کامیابی سے کاپی کر لیا گیا');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Fast feedback'], 'تیز رفتار فیڈ بیک');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_1.Feedback your questions and suggestions to us. After verification, you will receive exclusive cash reward'], '1.اپنے سوالات اور تجاویز فیڈ بیک کی شکل میں ہمیں بھیجیں۔ تصدیق کے بعد، آپ کو خصوصی کیش انعام ارسال کیا جائے گا');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_2.Your feedback will be answered within 1-2 working days'], '2.آپ کے فیڈ بیک پر 1 سے 2 کاروباری دنوں کے اندر اندر جواب دے دیا جائے گا');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Please fill in your questions and suggestions here and send them to us.'], 'براہِ کرم اپنے سوالات اور تجاویز یہاں لکھیں اور ہمیں بھیج دیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Send'], 'بھیجیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_NOTICE'], 'اعلامیہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Send successfully'], 'کامیابی سے بھیجیں !');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Please pay attention to Message'], 'براہِ کرم پیغام پر دھیان دیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Customer_Please contact us if you need help'], 'اگر آپ کو مدد درکار ہو تو براہِ کرم ہم سے رابطہ کریں!');

        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_REFER ＆EARN'], 'ریفر کریں اور جیتیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Get a bonus every time they win'], 'ان کے جیتنے پر ہر مرتبہ بونس حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_For every a ₹100 win , the system will reward ₹5'], 'ہر ₹100 جیت پر، سسٹم ₹5 انعام دے گا');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_You can see the details at "Bonus Table"'], 'آپ ’’بونس ٹیبل‘‘ پر تفصیلات دیکھ سکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Share \nWith \nfriend'], 'دوست کے ساتھ اشتراک کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_all belong to your team'], 'سب آپ کی ٹیم سے متعلقہ ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_You`re going to be a'], 'آپ لکھ پتی بننے والے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_If your team has 1000 people a day'], 'اگر آپ کی ٹیم کے پاس یومیہ 1000 افراد ہو جاتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_they each win ₹100 . You can get a bonus of ₹5000 every day<₹5000的奖金'], 'ان میں سے ہر ایک ₹100 سے کم جیتے۔ آپ ₹5000 سے کم کا بونس روزانہ حاصل کرسکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_If you have 10000 or 100000 people?'], 'اگر آپ کے پاس 10000 یا 100000 افراد ہوئے تو ؟');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Share more'], 'مزید کا اشتراک کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Copy Link'], 'لنک کاپی کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Team'], 'ٹیم');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_The friends you invite , as well as the friends they invite , Can loop indefinitely . All belong to your team.'], 'آپ کے مدعو کردہ دوست، اس کے ساتھ ساتھ ان کے مدعو کردہ دوست، غیر محدود طور پر لوپ کرسکتے ہیں۔ سب آپ کی ٹیم سے متعلقہ ہیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_History'], 'سابقہ ریکارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Bonus Table'], 'بونس کا ٹیبل');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Anyone in your team , as long as they win money , you will get a certain reward . The more people you invite , the more rewards you get.'], 'آپ کی ٹیم میں کوئی بھی، جب تک کہ وہ رقم جیتتا رہے، آپ کو ایک یقینی انعام دلواتا رہے گا۔ آپ جتنے زیادہ لوگوں کو مدعو کریں گے، اتنے ہی زیادہ انعامات آپ جیت پائیں گے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_For anyone you invite , if they recharge < ₹100 for the firs time , you will receive a reward of <₹5 . If they recharge< ₹1000 for the first time , you will receive a reward of ₹50'], 'آپ کو مدعو کردہ کوئی بھی فرد، اگر پہلی مرتبہ ₹100 سے کم رقم ریچارج کرے گا، تو آپ کو ₹5 سے کم کا انعام ملے گا۔ اگر وہ پہلی مرتبہ ₹1000 سے کم ریچارج کرے گا، تو آپ کو ₹50 کا انعام حاصل ہوگا۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Total Bonus'], 'مجموعی بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_The system will calculate the bonus basedon the output value at am00 : 00 , So your bonus for the day will be received the next day.'], 'سسٹم رات 00 : 00 بجے حاصل شدہ ویلیو کی بنیاد پر بونس کا تخمینہ لگائے گا، لہٰذا اُس دن کا آپ کا بونس اگلے دن موصول ہوگا۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_GET BONUS'], 'بونس حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_What is a team?'], 'ٹیم کیا ہے ؟');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_NAME'], 'نام');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_INVITED'], 'مدعو کردہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Every reward you received will immediately enter your deposit'], 'آپ کو وصول کردہ ہر انعام فوری طور پر آپ کے ڈپازٹ میں داخل ہوجائے گا');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Total Output Value'], 'مجموعی آؤٹ پٹ ویلیو');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_TIME'], 'وقت');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_OUTPUT INCOME'], 'آؤٹ پٹ آمدنی');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_INVITED INCOME'], 'مدعو کردہ آمدنی');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_The more people you invite , the more rewards you get for every 100 people in your team'], 'آپ جتنے زیادہ لوگوں کو مدعو کرتے ہیں، آپ کو اپنی ٹیم میں ہر 100 افراد پر اتنے ہی زیادہ انعامات ملتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_winnings output value!!'], 'کامیابیوں کی آؤٹ پٹ ویلیو !');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_NUMBER OF INVITEES'], 'مدعو کیے گئے افراد کی تعداد');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_BONUS'], 'بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Invite Friends'], 'دوستوں کو مدعو کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Operation'], 'آپریشن');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Invite All'], 'سب کو مدعو کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Total Friends'], 'مجموعی دوست');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_Potential Bonus'], 'ممکنہ بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Promoter_search'], 'تلاش کریں');

        this.UrduMap.set(I18NLabelTransIdEnum['Select_3 Patti'], '3 پتی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Pot Blind'], 'پوٹ بلائنڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_PRACTICE'], 'مشق کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_CASH'], 'کیش');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Play Now'], 'ابھی کھیلیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_ADD'], 'شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Boot'], 'بوٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Min Buyin'], 'کم سے کم خریداری');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Chaal limit'], 'چال کی حد');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Pot limit'], 'پوٹ کی حد');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Total Players'], 'مجموعی کھلاڑی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Join'], 'شامل ہوجائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_LOW'], 'کم');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_MID'], 'درمیانہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_HIGH'], 'بلند');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Min bet'], 'کم سے کم بیٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Max Bet'], 'زیادہ سے زیادہ بیٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Max payout'], 'زیادہ سے زیادہ ادائیگی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_2 player'], '2 کھلاڑی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_6 player'], '6 کھلاڑی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Point Value'], 'پوائنٹ ویلیو');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Max players'], 'زیادہ سے زیادہ کھلاڑی');
        this.UrduMap.set(I18NLabelTransIdEnum['Select_Add Cash'], 'کیش شامل کریں');
 
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_DAILY FREE RUPEES'], 'روزانہ مفت روپے');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Get rewards'], 'انعامات پائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_REWARDS'], 'انعامات');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_LUCKY TURNTABLE'], 'لکی ٹرن ٹیبل');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Tips'], 'مشورے');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_1.You can get a luckdraw for every 50 games you play'], '1.آپ اپنے کھیلے جانے والے ہر 50 گیمز کے لیے لکی ڈرا حاصل کرسکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_2.there is a freelottery every day'], '2.روزانہ مفت لاٹری بھی ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Remaining times'], 'باقی ماندہ وقت');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_GET YOUR BONUS'], 'اپنا بونس حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Login every day can get rewards'], ' انعامات حاصل کرنے کے لیے ہر روز لاگ ان کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_more cash bonus after the purchase'], 'خریداری کے بعد مزید کیش بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_ADD CASH'], 'کیش شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Cash'], 'کیش');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Bonus'], 'بونس');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Total Get'], 'مجموعی حصول');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Only one chance . choose any one to buy'], 'صرف ایک موقع ۔ خریداری کے لیے کوئی بھی ایک منتخب کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Other Amount>>'], 'دیگر رقم');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Bonus will be transferred into deposit when you lose in some games deposit'], 'جب آپ کچھ گیمز کا ڈپازٹ کھو دیں تو بونس ڈپازٹ میں منتقل ہو جائے گا');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_GET FROM EVENTS'], 'ایونٹس سے حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_GET IN GAMES'], 'گیمز میں بیٹ لگائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Get more'], 'مزید حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Collect'], 'وصول کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_All the bonuses you get will be placedhere Whenever you lose money in thegame , the bonus will be converted intocash at 10% of the money you lose . At this time you can collect cash'], 'آپ کے حاصل کردہ تمام بونسز یہاں رکھے جائیں گے جب بھی آپ گیم میں رقم کھو دیں گے، تو آپ کی کھوئی ہوئی رقم کے 10 فیصد پر بونس کیش میں تبدیل ہو جائے گا۔ اس موقع پر آپ کیش وصول کرسکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Bonus Card'], 'بونس کارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_DAILY BONUS CARD'], 'یومیہ بونس کارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Choose 1 Daily Bonus Card to purchase each time , you can select other card after expiration'], 'ہر مرتبہ خریداری کے لیے 1 یومیہ بونس کارڈ منتخب کریں، آپ کارڈ کی میعاد ختم ہونے کے بعد کوئی دوسرا کارڈ منتخب کرسکتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_SILVER CARD'], 'سلور کارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_GOLD CARD'], 'گولڈ کارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_DIAMOND CARD'], 'ڈائمنڈ کارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_Get 1000 right now'], 'ابھی اور اسی وقت 1000 حاصل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_20 Bonus x7 days'], '20 بونس x 7 دن');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_NOTICE'], 'نوٹس');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_1.You can recharge to buy the Daily Bonus Card，you can get the recharged amount right now , and extra bonus rewards will be given out a few days'], '1.آپ یومیہ بونس کارڈ خریدنے کے لیے ریچارج کرسکتے ہیں، آپ ابھی اور اسی وقت ریچارج کردہ رقم حاصل کرسکتے ہیں، اور چند ہی دنوں میں اضافی بونس کے انعامات دے دیے جائیں گے');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_2.You can only choose one type to purchase . On- ly one card is allowed at the same time'], '2.آپ خریداری کے لیے صرف ایک قسم کو منتخب کرسکتے ہیں۔ ایک وقت میں صرف ایک کارڈ کی اجازت ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Activity_3.You can buy the Daily Bonus Card only after the first deposit.'], '3.آپ صرف پہلے ڈپازٹ کے بعد ہی یومیہ بونس کارڈ خرید سکتے ہیں۔');

        this.UrduMap.set(I18NLabelTransIdEnum['Game_7UP 7DOWN'], '7 اپ 7 ڈاؤن');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Start Betting'], 'بیٹنگ شروع کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Betting starts in 0 seconds'], 'بیٹنگ 0 سیکنڈز میں شروع ہو رہی ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Betting ends in 11 seconds'], 'بیٹنگ 11 سیکنڈز میں شروع ہو رہی ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Billing'], 'بلنگ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_ONLINE PLAYERS'], 'آن لائن کھلاڑی');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Total online players:xxxx'], 'مجموعی آن لائن کھلاڑی:xxxx');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Do you want to exit the VIP seat?'], 'کیا آپ VIP نشست سے باہر نکلنا چاہتے ہیں ؟');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Are you sure you want to join the VIP seat?'], 'کیا آپ واقعی VIP نشست میں شامل ہونا چاہتے ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_There are other players in this VIP seat . Please choose again!'], 'اس VIP نشست میں دیگر کھلاڑی موجود ہیں۔ براہِ کرم دوبارہ منتخب کریں !');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_You can`t be a VIP if you carry less than 100 gold coins'], 'اگر آپ کے پاس سونے کے سکے 100 سے کم ہیں تو آپ VIP نہیں بن سکتے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_On other VIP seats, are you sure you want to enter this VIP seat?'], 'دیگر VIP نشستوں پر، کیا آپ واقعی اس VIP نشست میں داخل ہونا چاہتے ہیں؟');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_You`re not a VIP . You can`t send expressions'], 'آپ VIP نہیں ہیں۔ آپ تاثرات نہیں بھیج سکتے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_DRAGON VS TIGER'], 'ڈریگن بمقابلہ ٹائیگر');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Repeat bets'], 'بیٹس دہرائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_WINNING HISTORY'], 'کامیابی کا سابقہ ریکارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Tiger'], 'ٹائیگر');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Dragon'], 'ڈریگن');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Tie'], 'ٹائی');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Set'], 'سیٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_HORSE RACING'], 'گھڑ دوڑ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Odds'], 'اوڈز');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Horse'], 'گھوڑا');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_You won'], 'آپ جیت گئے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_THE GAME IS ABOUT TO START PLEASE SET THE BET.'], 'گیم شروع ہونے ہی والا ہے براہِ کرم بیٹ سیٹ کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Prev'], 'گزشتہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Next'], 'اگلا');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Stop Betting!'], 'بیٹنگ روکیں!');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Fruit Party'], 'فروٹ پارٹی');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_MAX'], 'زیادہ سے زیادہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_BET AMOUNT'], 'بیٹ کی رقم');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_TOTAL WIN'], 'مجموعی کامیابیاں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_FAST'], 'تیز رفتار');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_AUTO'], 'خودکار');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_SPIN'], 'گھمائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Lucky Loto'], 'لکی لوٹو');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_JACKPOT'], 'جیک پوٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Interval after jackpot'], 'جیک پوٹ کے بعد وقفہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Betting'], 'بیٹنگ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_BIG WINNER'], 'بڑا جیتنے والا');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_SET'], 'سیٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_PURE'], 'خالص');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_SEQ'], 'ترتیب');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_COLOR'], 'رنگ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_PAIR'], 'جوڑا');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_HIGH'], 'بلند');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Waiting'], 'انتظار کیا جا رہا ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on HIGH CARD: Win=bet*3'], 'بلند کارڈ پر بیٹ لگائیں : کامیابی=بیٹ * 3');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on PAIR: Win=bet*4'], 'جوڑے پر بیٹ لگائیں : کامیابی=بیٹ * 4');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on COLOR: Win=bet*5'], 'رنگ پر بیٹ لگائیں : کامیابی=بیٹ * 5');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on SEQUENCE: Win= bet*6'], 'ترتیب پر بیٹ لگائیں : کامیابی=بیٹ * 6');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on PURE SEQUENCE: Win=bet*10'], 'خالص ترتیب پر بیٹ لگائیں : کامیابی=بیٹ * 10');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Bet on SET: Split the Jackpot*20%'], 'سیٹ پر بیٹ: جیک پوٹ کو منقسم کریں * 20 فیصد');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_MY HISTORY'], 'میرا سابقہ ریکارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Result'], 'نتیجہ');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Total'], 'مجموعی');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Type'], 'قسم');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Time'], 'وقت');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Winner'], 'جیتنے والا');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_Win'], 'جیتیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Game_JACKPOT 1157 DRAWS LEFT'], 'جیک پوٹ 1157 قرعہ اندازیاں باقی ہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_CURRENT LEVEL:'], 'موجودہ سطح:');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_ADD CASH'], 'کیش شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_TO BET'], 'شرط لگانا');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Benefits'], 'فوائد');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_RULES'], 'قواعد');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Only VIP players can use this feature'], 'صرف VIP کھلاڑی ہی اس فیچر کو استعمال کر سکتے ہیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Add cash 200 now to become a VIP player.'], 'VIP کھلاڑی بننے کے لیے ابھی 200 کیش شامل کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP Rules'], 'VIP رولز');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Level up gift'], 'لیول اپ گفٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Daily Withdrawal Count'], 'روزانہ \nواپسی کی گنتی');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Withdrawal Limit'], 'واپسی کی حد');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Monthly Allowance'], 'ماہانہ الاؤنس');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance'], 'ہفتہ وار الاؤنس');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance'], 'یومیہ الاؤنس');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP Seats'], 'وی آئی پی سیٹیں');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP Customer Service'], 'VIP \nکسٹمر سروس');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP Name Color'], 'VIP نام کا رنگ');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Level Up Gift'], 'لیول اپ گفٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Lucky Draw'], 'قرعہ اندازی');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_The maximum number of withdrawals a usercan make in a day.'], 'ایک صارف ایک دن میں نکالنے کی زیادہ سے زیادہ تعداد کر سکتا ہے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_The maximum withdrawal amount a user can withdraw.'], 'زیادہ سے زیادہ رقم نکلوانے کی رقم جو صارف نکال سکتا ہے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Monthly allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'VIP صارفین کے لیے ہر سطح کا ماہانہ الاؤنس دستیاب ہے۔ اسے VIP صفحہ پر جمع کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Weekly Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'VIP صارفین کے لیے ہر سطح کا ہفتہ وار الاؤنس دستیاب ہے۔ اسے VIP صفحہ پر جمع کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Daily Allowance of each level is available for the VIP users. Collect it on the VIP page.'], 'VIP صارفین کے لیے ہر سطح کا روزانہ الاؤنس دستیاب ہے۔ اسے VIP صفحہ پر جمع کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP players can occupy prominent positions in gambling games.'], 'VIP کھلاڑی جوئے کے کھیلوں میں نمایاں پوزیشنوں پر فائز ہو سکتے ہیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_VIP customer service with faster response speed and higher service quality will only offer to VIP users.'], 'تیز تر رسپانس سپیڈ اور اعلیٰ سروس کے معیار کے ساتھ VIP کسٹمر سروس صرف VIP صارفین کو پیش کرے گی۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Unique color of the VIP users name.'], 'VIP صارفین کے نام کا منفرد رنگ۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Each level of VIP Super Gift Pack can only be purchased once, used to quickly upgrade the current level.'], 'VIP سپر گفٹ پیک کی ہر سطح کو صرف ایک بار خریدا جا سکتا ہے، موجودہ سطح کو تیزی سے اپ گریڈ کرنے کے لیے استعمال کیا جاتا ہے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Each VIP level increase corresponds to an increase in the number of lucky draws.'], 'ہر VIP لیول میں اضافہ لکی ڈراز کی تعداد میں اضافے کے مساوی ہے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Your VIP level needs to be improved'], 'آپ کے VIP لیول کو بہتر کرنے کی ضرورت ہے۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Please go to upgrade your VIP level'], 'براہ کرم اپنے VIP لیول کو اپ گریڈ کرنے کے لیے جائیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['MyVip_Go Upgrade'], 'اپ گریڈ پر جائیں۔');

        this.UrduMap.set(I18NLabelTransIdEnum['Shop_Add Cash'], 'کیش شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Shop_Total Get'], 'ٹوٹل گیٹ');
        this.UrduMap.set(I18NLabelTransIdEnum['Shop_Cash'], 'نقد');
        this.UrduMap.set(I18NLabelTransIdEnum['Shop_Bonus'], 'اضافی انعام');
        this.UrduMap.set(I18NLabelTransIdEnum['Shop_Select payment amount'], 'ادائیگی کی رقم منتخب کریں۔');

        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Withdraw'], 'واپس لے لو');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Cash Balance'], 'بقایا رقم');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal history'], 'واپسی کی تاریخ');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Add Cash'], 'کیش شامل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Deposit Cash'], 'کیش جمع کروائیں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Winnings Cash'], 'جیت کیش');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Daily Withdrawal Count Left'], 'روزانہ کی واپسی کی گنتی بائیں');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Withdrawal Amount'], 'واپسی کی رقم');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Okay'], 'ٹھیک ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['Withdraw_Tip'], 'ٹپ');

        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Record'], 'ریکارڈ');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Recharge'], 'ریچارج کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Withdraw'], 'واپس لینا');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Order processing in'], '1-7 کام کے دنوں میں آرڈر پروسیسنگ، صبر کریں۔');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_NO DATA'], 'کوئی مواد نہیں');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Amount'], `رقم`);
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Change amount'], 'رقم تبدیل کریں');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Before'], 'پہلے');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_After'], 'بعد');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Okay'], 'ٹھیک ہے');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Tip'], 'ٹپ');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Processing'], 'پروسیسنگ');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Succeeded'], 'کامیاب ہو گیا۔');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Failed'], 'ناکام');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Pending'], 'زیر التواء');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Rejected'], 'مسترد');
        this.UrduMap.set(I18NLabelTransIdEnum['TransactionRecord_Experience Coins'], 'سککوں کا تجربہ کریں۔');



    };

    private _initSpriteFramePathMap() {
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_title'], 'Setting/wenzi_01');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_music'], 'Setting/wenzi_02');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_sound'], 'Setting/wenzi_03');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_howToPlay'], 'Setting/wenzi_04');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_rateUs'], 'Setting/wenzi_05');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_contactUs'], 'Setting/wenzi_06');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_privacy'], 'Setting/wenzi_07');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_terms'], 'Setting/wenzi_08');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Setting_logOut'], 'Setting/wenzi_09');

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

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Promoter_getABonus'], 'Promoter/getABonus');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Promoter_millionaire'], 'Promoter/millionaire');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['RateUs_title01'], 'RateUs/title_01');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['RateUs_title02'], 'RateUs/title_02');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Rule_title'], 'Rule/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['SmallAddExperience_title'], 'SmallAddExperience/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['UserHead_title'], 'UserHead/title');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_addCash'], 'LobbyBanner/addCash');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_friend'], 'LobbyBanner/friend');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_getNow'], 'LobbyBanner/getNow');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_quickRecharge'], 'LobbyBanner/quickRecharge');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_refer'], 'LobbyBanner/refer');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyBanner_rewards'], 'LobbyBanner/rewards');


        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_activity'], 'CommActivity/activity');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_bonusCard'], 'CommActivity/bonusCard');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['CommActivity_mobile'], 'CommActivity/mobile');

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['LobbyIcons_luckyLoto'], 'LobbyIcons/luckyLoto');

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

        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_text'], 'Login/text');
        this.SpriteFramePathMap.set(I18NSpriteTransIdEnum['Login_bonus'], 'Login/bonus');
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
        let curLanguagesType = I18NLanguagesEnum.English;
        let languagesType = cc.sys.localStorage.getItem("LanguageTypeStorage");
        if (!languagesType) {
            curLanguagesType = I18NLanguagesEnum.English;
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
                    curLanguagesType = I18NLanguagesEnum.English;
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
        window["ClientNotify"].send(window["GlobalCfg"].MSG_TYPE.clientMsg, {msgCode: window["GlobalCfg"].CLIENT_MSG_ID.CHANGE_LANGUAGE, msgData: {languagesType: curLanguagesType}});
    };
};

window["I18NUtil"] = I18NUtil;
window["I18NLanguagesEnum"] = I18NLanguagesEnum;
window["I18NLabelTransIdEnum"] = I18NLabelTransIdEnum;
window["I18NSpriteTransIdEnum"] = I18NSpriteTransIdEnum;