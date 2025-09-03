import Rank from "./Rank";

//排名对象集合
export default class RankListClass{
     
    private _rankList: Rank[] = [];
    private _currentRank: Rank;
    //第一名
    private _firstRank: Rank;
    //第二名
    private _secondRank: Rank;
    //第三名
    private _thirdRank: Rank;

    //排名类型
    private _rankType: string;   
    //最低上榜分数
    private _rankScoreLine: number;
    //是否上榜
    private _isRank: boolean;


    public get isRank(): boolean {
        return this._isRank;
    }
    public set isRank(value: boolean) {
        this._isRank = value;
    }


    public get rankType(): string {
        return this._rankType;
    }
    public set rankType(value: string) {
        this._rankType = value;
    }


    public get rankScoreLine(): number {
        return this._rankScoreLine;
    }
    public set rankScoreLine(value: number) {
        this._rankScoreLine = value;
    }

    public get firstRank(): Rank {
        return this._firstRank;
    }
    public set firstRank(value: Rank) {
        this._firstRank = value;
    }

    public get secondRank(): Rank {
        return this._secondRank;
    }
    public set secondRank(value: Rank) {
        this._secondRank = value;
    }

    public get thirdRank(): Rank {
        return this._thirdRank;
    }
    public set thirdRank(value: Rank) {
        this._thirdRank = value;
    }

    public get rankList(): Rank[] {
        return this._rankList;
    }
    public set rankList(value: Rank[]) {
        this._rankList = value;
    }

    public get currentRank(): Rank {
        return this._currentRank;
    }
    public set currentRank(value: Rank) {
        this._currentRank = value;
    }

    public setTopThreeRanks(value: Rank){

        if(value==null||value.rankNumber>3){
            return;
        }
        if(value.rankNumber==1){
            this.firstRank=value
        }else  if(value.rankNumber==2){
            this.secondRank=value
        } if(value.rankNumber==3){
            this.thirdRank=value
        }

    }

 }