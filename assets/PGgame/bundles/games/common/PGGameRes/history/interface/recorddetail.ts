
export interface Tsymbol {
  id?: number;
  multi?: number;
}

// 奖励的具体详情
export interface TPrize {
  // 胜利位置, 给客户端做连线和消除用 @uint32
  win_pos_list?: number[];
  // 线路编号 @uint32
  index?: number;
  // 轴, 至少是3, 至多是5 @uint32
  level?: number;
  // 中奖麻将类型 @int32
  item_type?: number;
  // 图标倍数 @int32
  rate?: number;
  // 消除用的单线 @uint32
  win_item_list?: number[];
  // 翻倍倍数表, 1 2 3 5 还是  "6, 12, 18, 40"  # 免费游戏3  5次 @uint32
  multi_time?: number;
  // 玩家本轮中奖 @int64
  win?: number;
  // 轴, 至少是3, 至多是5
  level_s?: string;
  // 中奖麻将类型
  item_type_s?: string;
  // 中奖麻将类型
  rate_s?: string;
  // 奖金乘数
  multi_time_s?: string;
  // 玩家的输赢
  win_s?: string;
  //路数
  count?: number;
}
export interface HisLineAwardInfo {
  lineId?: number;
  win?: number;
  pos?: Tsymbol[];
}



export interface TRound {
  //二维数组结果
  col_symbol_list?: { list: number[] }[];
  // 本次所有卡牌, 0-14, @int32
  item_type_list?: number[];
  // 本次中奖的 @int32
  round_rate?: number;
  // 轮号 @uint32
  round?: number;
  // 翻倍倍数表, 1 2 3 5 还是  "6, 12, 18, 40"  # 免费游戏3  5次 @uint32
  multi_time?: number;
  // 奖励列表
  prize_list?: TPrize[];
  // 下一次要出的列表 @int32
  next_list?: number[];
  // 下落的列表
  drop_list?: TUintList[];
  // 胜利位置, 所有一起的胜利的位置 @uint32
  win_pos_list?: number[];
  // 当前的余额是多少 @int64
  balance?: number;
  // 获得几次免费次数 @uint32
  free_play?: number;
  // 玩家本轮中奖 @int64
  win?: number;
  // -1 是选择 0 普通,  1 , 2, 3 对应3个免费 @int32
  free_mode_type?: number;
  // 免费里面覆盖的盘面 @int32
  item_type_list_append?: number[];
  // 全屏消除且为同一个图标 @int32
  all_win_item?: number;
  // 当前的余额是多少
  balance_s?: string;
  // 玩家的输赢
  win_s?: string;
  //结果
  list?: { item_type_list: number[] }[]
}

// 展示用的二维数组
export interface TUintList {
  //  @uint32
  list?: number[];
}


export interface RecordDetailInfo {
  // 创建时间-时间
  create_time?: string;
  // 数据库索引-mongodb-obj-id
  order_id?: string;
  // 交易单号
  round_id?: string;
  bet_s?: string;
  prize_s?: string;
  // -1 是选择 0 普通,  1 , 2, 3 对应3个免费 @int32
  free_mode_type?: number;
  player_win_lose_s?: string;
  // 余额   整数string
  balance_s?: string;
  // 得分前，下注后的
  balance_before_score_s?: string;
  // 创建时间-时间戳-毫秒 @int64
  create_timestamp?: number;
  // 下注金额  整数int64 @int64
  bet?: number;
  // 中奖金额 @int64
  prize?: number;
  // 玩家输赢, 不中奖就是-bet @int64
  player_win_lose?: number;
  // 余额   整数int64 @int64
  balance?: number;
  // 得分前，下注后的 @int64
  balance_before_score?: number;
  // 是否免费游戏 @bool
  free?: boolean;
  // 免费总次数 @uint32
  free_total_times?: number;
  // 免费剩余次数 @uint32
  free_remain_times?: number;
  // 免费游戏总赢 @uint64
  free_game_total_win?: number;
  // 投注大小 @int64
  bet_size?: number;
  // 基础投注    -  这里固定20 @int32
  basic_bet?: number;
  // 投注倍数 @int32
  bet_multiple?: number;
  // round list 的数量 @int32
  round_list_count?: number;
  // 回合的详情
  round_list?: RoundDetailInfo[];

  /**结果 */
  result?: {
    free_play: number,
    origin_rate: number,
    rate: number,
    round_list: TRound[],
  }
}

export interface RecordListRsp {
  // 总下注
  bet_s?: string;
  // 总盈利
  win_s?: string;
  // 游戏记录
  list?: RecordInfo[];
  // 用来查询的ID @int64
  id?: number;
  // 数量 @uint32
  count?: number;
  // 总下注 @int64
  bet?: number;
  // 总盈利 @int64
  win?: number;
}

export interface RecordInfo {
  create_time?: string;
  // 数据库索引-mongodb-obj-id
  order_id?: string;
  // 交易单号
  round_id?: string;
  // 盈利
  win_s?: string;
  // 下注
  bet_s?: string;
  // 免费游戏次数 @int32
  free_times?: number;
  // -1 是选择 0 普通,  1 , 2, 3 对应3个免费 @int32
  free_mode_type?: number;
  // 创建时间-时间戳-毫秒 @int64
  create_timestamp?: number;
  // 是否免费游戏 @bool
  free?: boolean;
  // 普通游戏 @uint32
  normal_round_times?: number;
  // 免费游戏 @uint32
  free_round_times?: number;
  // 下注的额度 @int64
  bet?: number;
  // 盈利 @int64
  win?: number;
}

// 回合的详情
export interface RoundDetailInfo {
  groupId?: string;
  hits: HisLineAwardInfo[]
  bet_s?: string;
  // 中奖金额
  prize_s?: string;
  // 玩家的输赢
  player_win_lose_s?: string;
  // 余额
  balance_s?: string;
  // 投注大小
  bet_size_s?: string;
  // 轮号 @uint32
  round?: number;
  // 数据库索引-mongodb-obj-id
  order_id?: string;
  // 交易单号
  round_id?: string;
  // 投注 @int64
  bet?: number;
  // 中奖金额 @int64
  prize?: number;
  // 玩家的输赢 @int64
  player_win_lose?: number;
  // 余额 @int64
  balance?: number;
  // 投注大小 @int64
  bet_size?: number;
  // 投注倍数 @int32
  bet_multiple?: number;
  // 基础投注 @int32
  basic_bet?: number;
  // 翻倍倍数表 @uint32
  multi_time?: number;
  // 奖励数量 @int32
  prize_list_count?: number;
  // 奖励列表
  prize_list?: HisLineAwardInfo[];
  // 本次所有卡牌, 0-22, @int32
  screen?: Tsymbol[];
  //所有牌二维数组
  col_symbol_list?: { list: number[] }[];
  //订单号
  round_no: string;
  //中奖
  win: number;
  //中奖小数
  win_s: string;
}

export enum TItemtype {
  ITEM_TYPE_NIL = 0x00,  // 空
  ITEM_TYPE_WILD = 0x01,  // 百搭可代替所有图标，除了夺宝
  ITEM_TYPE_SCATTER = 0x02,  // 夺宝


  ITEM_TYPE_H1 = 0x03,  // 大盗
  ITEM_TYPE_H2 = 0x04,  // 吉他
  ITEM_TYPE_H3 = 0x05,  // 饮料
  ITEM_TYPE_H4 = 0x06,  // 彩球
  ITEM_TYPE_A = 0x07,  // A
  ITEM_TYPE_K = 0x08,  // K
  ITEM_TYPE_Q = 0x09,  // Q
  ITEM_TYPE_J = 0x0A,  // J
  ITEM_TYPE_10 = 0x0B,  // 10


  GOLD_MOD = 0x10,  // 金色模组取色用

  ITEM_TYPE_H1_GOLD = 0x13,  //
  ITEM_TYPE_H2_GOLD = 0x14,  //
  ITEM_TYPE_H3_GOLD = 0x15,  //
  ITEM_TYPE_H4_GOLD = 0x16,  //
  ITEM_TYPE_A_GOLD = 0x17,  // A
  ITEM_TYPE_K_GOLD = 0x18,  // K
  ITEM_TYPE_Q_GOLD = 0x19,  // Q
  ITEM_TYPE_J_GOLD = 0x1A,  // J
  ITEM_TYPE_10_GOLD = 0x1B,  // 10
}