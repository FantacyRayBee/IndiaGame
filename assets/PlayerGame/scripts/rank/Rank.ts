
//排名对象
export default class Rank{
   private _name: string;
   private _score: number;
   private _level: number;

   private _rankNumber: number;
   private _avatar: string;
   private _rankUp: boolean=true;

   public get level(): number {
        return this._level;
    }
    public set level(value: number) {
        this._level = value;
    }
    public get rankUp(): boolean {
        return this._rankUp;
    }
    public set rankUp(value: boolean) {
        this._rankUp = value;
    }

   public get score(): number {
       return this._score;
   }
   public set score(value: number) {
       this._score = value;
   }

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    } 
  
    public get rankNumber(): number {
        return this._rankNumber;
    }
    public set rankNumber(value: number) {
        this._rankNumber = value;
    }
   
    public get avatar(): string {
        return this._avatar;
    }
    public set avatar(value: string) {
        this._avatar = value;
    }
}