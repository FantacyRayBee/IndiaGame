import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace slot_fortune_rabbit. */
export namespace slot_fortune_rabbit {

    /** FortuneRabbitCmd enum. */
    enum FortuneRabbitCmd {
        CMD_INVALID = 0,
        CMD_GAME_ENTER_REQ = 1,
        CMD_GAME_ENTER_RESP = 2,
        CMD_GAME_GET_TABLE_STATUS_REQ = 3,
        CMD_GAME_GET_TABLE_STATUS_RESP = 4,
        CMD_GAME_SPIN_REQ = 7,
        CMD_GAME_SPIN_RESP = 8,
        CMD_GAME_LEAVE_REQ = 11,
        CMD_GAME_LEAVE_RESP = 12
    }

    /** Properties of a User. */
    interface IUser {

        /** User userId */
        userId?: (number | null);

        /** User balance */
        balance?: (number | null);

        /** User nickname */
        nickname?: (string | null);

        /** User avatar */
        avatar?: (string | null);
    }

    /** Represents a User. */
    class User implements IUser {

        /**
         * Constructs a new User.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IUser);

        /** User userId. */
        public userId: number;

        /** User balance. */
        public balance: number;

        /** User nickname. */
        public nickname: string;

        /** User avatar. */
        public avatar: string;

        /**
         * Creates a new User instance using the specified properties.
         * @param [properties] Properties to set
         * @returns User instance
         */
        public static create(properties?: slot_fortune_rabbit.IUser): slot_fortune_rabbit.User;

        /**
         * Encodes the specified User message. Does not implicitly {@link slot_fortune_rabbit.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified User message, length delimited. Does not implicitly {@link slot_fortune_rabbit.User.verify|verify} messages.
         * @param message User message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a User message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.User;

        /**
         * Decodes a User message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.User;

        /**
         * Verifies a User message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a User message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns User
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.User;

        /**
         * Creates a plain object from a User message. Also converts values to other types if specified.
         * @param message User
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this User to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for User
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a FortuneRabbitSlotLevelDesc. */
    interface IFortuneRabbitSlotLevelDesc {

        /** FortuneRabbitSlotLevelDesc roomId */
        roomId?: (number | null);

        /** FortuneRabbitSlotLevelDesc gameType */
        gameType?: (number | null);

        /** FortuneRabbitSlotLevelDesc chips */
        chips?: (number[] | null);
    }

    /** Represents a FortuneRabbitSlotLevelDesc. */
    class FortuneRabbitSlotLevelDesc implements IFortuneRabbitSlotLevelDesc {

        /**
         * Constructs a new FortuneRabbitSlotLevelDesc.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc);

        /** FortuneRabbitSlotLevelDesc roomId. */
        public roomId: number;

        /** FortuneRabbitSlotLevelDesc gameType. */
        public gameType: number;

        /** FortuneRabbitSlotLevelDesc chips. */
        public chips: number[];

        /**
         * Creates a new FortuneRabbitSlotLevelDesc instance using the specified properties.
         * @param [properties] Properties to set
         * @returns FortuneRabbitSlotLevelDesc instance
         */
        public static create(properties?: slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc): slot_fortune_rabbit.FortuneRabbitSlotLevelDesc;

        /**
         * Encodes the specified FortuneRabbitSlotLevelDesc message. Does not implicitly {@link slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.verify|verify} messages.
         * @param message FortuneRabbitSlotLevelDesc message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified FortuneRabbitSlotLevelDesc message, length delimited. Does not implicitly {@link slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.verify|verify} messages.
         * @param message FortuneRabbitSlotLevelDesc message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a FortuneRabbitSlotLevelDesc message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns FortuneRabbitSlotLevelDesc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.FortuneRabbitSlotLevelDesc;

        /**
         * Decodes a FortuneRabbitSlotLevelDesc message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns FortuneRabbitSlotLevelDesc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.FortuneRabbitSlotLevelDesc;

        /**
         * Verifies a FortuneRabbitSlotLevelDesc message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a FortuneRabbitSlotLevelDesc message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns FortuneRabbitSlotLevelDesc
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.FortuneRabbitSlotLevelDesc;

        /**
         * Creates a plain object from a FortuneRabbitSlotLevelDesc message. Also converts values to other types if specified.
         * @param message FortuneRabbitSlotLevelDesc
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.FortuneRabbitSlotLevelDesc, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this FortuneRabbitSlotLevelDesc to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for FortuneRabbitSlotLevelDesc
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Hit. */
    interface IHit {

        /** Hit lineId */
        lineId?: (number | null);

        /** Hit win */
        win?: (number | null);

        /** Hit pos */
        pos?: (number[] | null);

        /** Hit symbol */
        symbol?: (number | null);
    }

    /** Represents a Hit. */
    class Hit implements IHit {

        /**
         * Constructs a new Hit.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IHit);

        /** Hit lineId. */
        public lineId: number;

        /** Hit win. */
        public win: number;

        /** Hit pos. */
        public pos: number[];

        /** Hit symbol. */
        public symbol: number;

        /**
         * Creates a new Hit instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Hit instance
         */
        public static create(properties?: slot_fortune_rabbit.IHit): slot_fortune_rabbit.Hit;

        /**
         * Encodes the specified Hit message. Does not implicitly {@link slot_fortune_rabbit.Hit.verify|verify} messages.
         * @param message Hit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IHit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Hit message, length delimited. Does not implicitly {@link slot_fortune_rabbit.Hit.verify|verify} messages.
         * @param message Hit message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IHit, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Hit message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Hit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.Hit;

        /**
         * Decodes a Hit message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Hit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.Hit;

        /**
         * Verifies a Hit message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a Hit message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Hit
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.Hit;

        /**
         * Creates a plain object from a Hit message. Also converts values to other types if specified.
         * @param message Hit
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.Hit, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Hit to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Hit
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a Symbol. */
    interface ISymbol {

        /** Symbol id */
        id?: (number | null);

        /** Symbol multi */
        multi?: (number | null);
    }

    /** Represents a Symbol. */
    class Symbol implements ISymbol {

        /**
         * Constructs a new Symbol.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.ISymbol);

        /** Symbol id. */
        public id: number;

        /** Symbol multi. */
        public multi: number;

        /**
         * Creates a new Symbol instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Symbol instance
         */
        public static create(properties?: slot_fortune_rabbit.ISymbol): slot_fortune_rabbit.Symbol;

        /**
         * Encodes the specified Symbol message. Does not implicitly {@link slot_fortune_rabbit.Symbol.verify|verify} messages.
         * @param message Symbol message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.ISymbol, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Symbol message, length delimited. Does not implicitly {@link slot_fortune_rabbit.Symbol.verify|verify} messages.
         * @param message Symbol message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.ISymbol, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Symbol message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Symbol
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.Symbol;

        /**
         * Decodes a Symbol message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Symbol
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.Symbol;

        /**
         * Verifies a Symbol message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a Symbol message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Symbol
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.Symbol;

        /**
         * Creates a plain object from a Symbol message. Also converts values to other types if specified.
         * @param message Symbol
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.Symbol, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Symbol to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for Symbol
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a LastScreen. */
    interface ILastScreen {

        /** LastScreen win */
        win?: (number | null);

        /** LastScreen amount */
        amount?: (number | null);

        /** LastScreen betSize */
        betSize?: (number | null);

        /** LastScreen betMul */
        betMul?: (number | null);

        /** LastScreen screen */
        screen?: (slot_fortune_rabbit.ISymbol[] | null);

        /** LastScreen hits */
        hits?: (slot_fortune_rabbit.IHit[] | null);

        /** LastScreen leftTimes */
        leftTimes?: (number | null);

        /** LastScreen feature */
        feature?: (boolean | null);

        /** LastScreen rabbitWin */
        rabbitWin?: (number | null);
    }

    /** Represents a LastScreen. */
    class LastScreen implements ILastScreen {

        /**
         * Constructs a new LastScreen.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.ILastScreen);

        /** LastScreen win. */
        public win: number;

        /** LastScreen amount. */
        public amount: number;

        /** LastScreen betSize. */
        public betSize: number;

        /** LastScreen betMul. */
        public betMul: number;

        /** LastScreen screen. */
        public screen: slot_fortune_rabbit.ISymbol[];

        /** LastScreen hits. */
        public hits: slot_fortune_rabbit.IHit[];

        /** LastScreen leftTimes. */
        public leftTimes: number;

        /** LastScreen feature. */
        public feature: boolean;

        /** LastScreen rabbitWin. */
        public rabbitWin: number;

        /**
         * Creates a new LastScreen instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LastScreen instance
         */
        public static create(properties?: slot_fortune_rabbit.ILastScreen): slot_fortune_rabbit.LastScreen;

        /**
         * Encodes the specified LastScreen message. Does not implicitly {@link slot_fortune_rabbit.LastScreen.verify|verify} messages.
         * @param message LastScreen message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.ILastScreen, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LastScreen message, length delimited. Does not implicitly {@link slot_fortune_rabbit.LastScreen.verify|verify} messages.
         * @param message LastScreen message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.ILastScreen, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LastScreen message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LastScreen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.LastScreen;

        /**
         * Decodes a LastScreen message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LastScreen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.LastScreen;

        /**
         * Verifies a LastScreen message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a LastScreen message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LastScreen
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.LastScreen;

        /**
         * Creates a plain object from a LastScreen message. Also converts values to other types if specified.
         * @param message LastScreen
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.LastScreen, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LastScreen to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for LastScreen
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameGetTableInfoResp. */
    interface IGameGetTableInfoResp {

        /** GameGetTableInfoResp desc */
        desc?: (slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc | null);

        /** GameGetTableInfoResp roundId */
        roundId?: (string | null);

        /** GameGetTableInfoResp self */
        self?: (slot_fortune_rabbit.IUser | null);

        /** GameGetTableInfoResp lastScreen */
        lastScreen?: (slot_fortune_rabbit.ILastScreen | null);

        /** GameGetTableInfoResp winLevel */
        winLevel?: (number[] | null);
    }

    /** Represents a GameGetTableInfoResp. */
    class GameGetTableInfoResp implements IGameGetTableInfoResp {

        /**
         * Constructs a new GameGetTableInfoResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameGetTableInfoResp);

        /** GameGetTableInfoResp desc. */
        public desc?: (slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc | null);

        /** GameGetTableInfoResp roundId. */
        public roundId: string;

        /** GameGetTableInfoResp self. */
        public self?: (slot_fortune_rabbit.IUser | null);

        /** GameGetTableInfoResp lastScreen. */
        public lastScreen?: (slot_fortune_rabbit.ILastScreen | null);

        /** GameGetTableInfoResp winLevel. */
        public winLevel: number[];

        /**
         * Creates a new GameGetTableInfoResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameGetTableInfoResp instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameGetTableInfoResp): slot_fortune_rabbit.GameGetTableInfoResp;

        /**
         * Encodes the specified GameGetTableInfoResp message. Does not implicitly {@link slot_fortune_rabbit.GameGetTableInfoResp.verify|verify} messages.
         * @param message GameGetTableInfoResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameGetTableInfoResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameGetTableInfoResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetTableInfoResp.verify|verify} messages.
         * @param message GameGetTableInfoResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameGetTableInfoResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameGetTableInfoResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameGetTableInfoResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameGetTableInfoResp;

        /**
         * Decodes a GameGetTableInfoResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameGetTableInfoResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameGetTableInfoResp;

        /**
         * Verifies a GameGetTableInfoResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameGetTableInfoResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameGetTableInfoResp
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameGetTableInfoResp;

        /**
         * Creates a plain object from a GameGetTableInfoResp message. Also converts values to other types if specified.
         * @param message GameGetTableInfoResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameGetTableInfoResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameGetTableInfoResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameGetTableInfoResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a SpinResp. */
    interface ISpinResp {

        /** SpinResp hits */
        hits?: (slot_fortune_rabbit.IHit[] | null);

        /** SpinResp screen */
        screen?: (slot_fortune_rabbit.ISymbol[] | null);

        /** SpinResp trigger */
        trigger?: (boolean | null);

        /** SpinResp bet */
        bet?: (number | null);

        /** SpinResp balance */
        balance?: (number | null);

        /** SpinResp totalWin */
        totalWin?: (number | null);

        /** SpinResp leftTimes */
        leftTimes?: (number | null);

        /** SpinResp priseTrigger */
        priseTrigger?: (boolean | null);

        /** SpinResp rabbitWin */
        rabbitWin?: (number | null);

        /** SpinResp isWish */
        isWish?: (boolean | null);
    }

    /** Represents a SpinResp. */
    class SpinResp implements ISpinResp {

        /**
         * Constructs a new SpinResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.ISpinResp);

        /** SpinResp hits. */
        public hits: slot_fortune_rabbit.IHit[];

        /** SpinResp screen. */
        public screen: slot_fortune_rabbit.ISymbol[];

        /** SpinResp trigger. */
        public trigger: boolean;

        /** SpinResp bet. */
        public bet: number;

        /** SpinResp balance. */
        public balance: number;

        /** SpinResp totalWin. */
        public totalWin: number;

        /** SpinResp leftTimes. */
        public leftTimes: number;

        /** SpinResp priseTrigger. */
        public priseTrigger: boolean;

        /** SpinResp rabbitWin. */
        public rabbitWin: number;

        /** SpinResp isWish. */
        public isWish: boolean;

        /**
         * Creates a new SpinResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SpinResp instance
         */
        public static create(properties?: slot_fortune_rabbit.ISpinResp): slot_fortune_rabbit.SpinResp;

        /**
         * Encodes the specified SpinResp message. Does not implicitly {@link slot_fortune_rabbit.SpinResp.verify|verify} messages.
         * @param message SpinResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.ISpinResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SpinResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.SpinResp.verify|verify} messages.
         * @param message SpinResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.ISpinResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SpinResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SpinResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.SpinResp;

        /**
         * Decodes a SpinResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SpinResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.SpinResp;

        /**
         * Verifies a SpinResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a SpinResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SpinResp
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.SpinResp;

        /**
         * Creates a plain object from a SpinResp message. Also converts values to other types if specified.
         * @param message SpinResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.SpinResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SpinResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for SpinResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameGetTableEmptyResp. */
    interface IGameGetTableEmptyResp {
    }

    /** Represents a GameGetTableEmptyResp. */
    class GameGetTableEmptyResp implements IGameGetTableEmptyResp {

        /**
         * Constructs a new GameGetTableEmptyResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameGetTableEmptyResp);

        /**
         * Creates a new GameGetTableEmptyResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameGetTableEmptyResp instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameGetTableEmptyResp): slot_fortune_rabbit.GameGetTableEmptyResp;

        /**
         * Encodes the specified GameGetTableEmptyResp message. Does not implicitly {@link slot_fortune_rabbit.GameGetTableEmptyResp.verify|verify} messages.
         * @param message GameGetTableEmptyResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameGetTableEmptyResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameGetTableEmptyResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetTableEmptyResp.verify|verify} messages.
         * @param message GameGetTableEmptyResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameGetTableEmptyResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameGetTableEmptyResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameGetTableEmptyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameGetTableEmptyResp;

        /**
         * Decodes a GameGetTableEmptyResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameGetTableEmptyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameGetTableEmptyResp;

        /**
         * Verifies a GameGetTableEmptyResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameGetTableEmptyResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameGetTableEmptyResp
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameGetTableEmptyResp;

        /**
         * Creates a plain object from a GameGetTableEmptyResp message. Also converts values to other types if specified.
         * @param message GameGetTableEmptyResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameGetTableEmptyResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameGetTableEmptyResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameGetTableEmptyResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameEnterReq. */
    interface IGameEnterReq {
    }

    /** Represents a GameEnterReq. */
    class GameEnterReq implements IGameEnterReq {

        /**
         * Constructs a new GameEnterReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameEnterReq);

        /**
         * Creates a new GameEnterReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameEnterReq instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameEnterReq): slot_fortune_rabbit.GameEnterReq;

        /**
         * Encodes the specified GameEnterReq message. Does not implicitly {@link slot_fortune_rabbit.GameEnterReq.verify|verify} messages.
         * @param message GameEnterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameEnterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameEnterReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameEnterReq.verify|verify} messages.
         * @param message GameEnterReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameEnterReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameEnterReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameEnterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameEnterReq;

        /**
         * Decodes a GameEnterReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameEnterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameEnterReq;

        /**
         * Verifies a GameEnterReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameEnterReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameEnterReq
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameEnterReq;

        /**
         * Creates a plain object from a GameEnterReq message. Also converts values to other types if specified.
         * @param message GameEnterReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameEnterReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameEnterReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameEnterReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameEnterResp. */
    interface IGameEnterResp {
    }

    /** Represents a GameEnterResp. */
    class GameEnterResp implements IGameEnterResp {

        /**
         * Constructs a new GameEnterResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameEnterResp);

        /**
         * Creates a new GameEnterResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameEnterResp instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameEnterResp): slot_fortune_rabbit.GameEnterResp;

        /**
         * Encodes the specified GameEnterResp message. Does not implicitly {@link slot_fortune_rabbit.GameEnterResp.verify|verify} messages.
         * @param message GameEnterResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameEnterResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameEnterResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameEnterResp.verify|verify} messages.
         * @param message GameEnterResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameEnterResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameEnterResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameEnterResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameEnterResp;

        /**
         * Decodes a GameEnterResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameEnterResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameEnterResp;

        /**
         * Verifies a GameEnterResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameEnterResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameEnterResp
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameEnterResp;

        /**
         * Creates a plain object from a GameEnterResp message. Also converts values to other types if specified.
         * @param message GameEnterResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameEnterResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameEnterResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameEnterResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameSpinReq. */
    interface IGameSpinReq {

        /** GameSpinReq amount */
        amount?: (number | null);

        /** GameSpinReq mode */
        mode?: (boolean | null);

        /** GameSpinReq betSize */
        betSize?: (number | null);

        /** GameSpinReq betMultiple */
        betMultiple?: (number | null);
    }

    /** Represents a GameSpinReq. */
    class GameSpinReq implements IGameSpinReq {

        /**
         * Constructs a new GameSpinReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameSpinReq);

        /** GameSpinReq amount. */
        public amount: number;

        /** GameSpinReq mode. */
        public mode: boolean;

        /** GameSpinReq betSize. */
        public betSize: number;

        /** GameSpinReq betMultiple. */
        public betMultiple: number;

        /**
         * Creates a new GameSpinReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameSpinReq instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameSpinReq): slot_fortune_rabbit.GameSpinReq;

        /**
         * Encodes the specified GameSpinReq message. Does not implicitly {@link slot_fortune_rabbit.GameSpinReq.verify|verify} messages.
         * @param message GameSpinReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameSpinReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameSpinReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameSpinReq.verify|verify} messages.
         * @param message GameSpinReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameSpinReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameSpinReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameSpinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameSpinReq;

        /**
         * Decodes a GameSpinReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameSpinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameSpinReq;

        /**
         * Verifies a GameSpinReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameSpinReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameSpinReq
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameSpinReq;

        /**
         * Creates a plain object from a GameSpinReq message. Also converts values to other types if specified.
         * @param message GameSpinReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameSpinReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameSpinReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameSpinReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameGetConfigReq. */
    interface IGameGetConfigReq {
    }

    /** Represents a GameGetConfigReq. */
    class GameGetConfigReq implements IGameGetConfigReq {

        /**
         * Constructs a new GameGetConfigReq.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameGetConfigReq);

        /**
         * Creates a new GameGetConfigReq instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameGetConfigReq instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameGetConfigReq): slot_fortune_rabbit.GameGetConfigReq;

        /**
         * Encodes the specified GameGetConfigReq message. Does not implicitly {@link slot_fortune_rabbit.GameGetConfigReq.verify|verify} messages.
         * @param message GameGetConfigReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameGetConfigReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameGetConfigReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetConfigReq.verify|verify} messages.
         * @param message GameGetConfigReq message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameGetConfigReq, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameGetConfigReq message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameGetConfigReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameGetConfigReq;

        /**
         * Decodes a GameGetConfigReq message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameGetConfigReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameGetConfigReq;

        /**
         * Verifies a GameGetConfigReq message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameGetConfigReq message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameGetConfigReq
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameGetConfigReq;

        /**
         * Creates a plain object from a GameGetConfigReq message. Also converts values to other types if specified.
         * @param message GameGetConfigReq
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameGetConfigReq, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameGetConfigReq to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameGetConfigReq
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }

    /** Properties of a GameConfigResp. */
    interface IGameConfigResp {

        /** GameConfigResp config */
        config?: (string | null);
    }

    /** Represents a GameConfigResp. */
    class GameConfigResp implements IGameConfigResp {

        /**
         * Constructs a new GameConfigResp.
         * @param [properties] Properties to set
         */
        constructor(properties?: slot_fortune_rabbit.IGameConfigResp);

        /** GameConfigResp config. */
        public config: string;

        /**
         * Creates a new GameConfigResp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GameConfigResp instance
         */
        public static create(properties?: slot_fortune_rabbit.IGameConfigResp): slot_fortune_rabbit.GameConfigResp;

        /**
         * Encodes the specified GameConfigResp message. Does not implicitly {@link slot_fortune_rabbit.GameConfigResp.verify|verify} messages.
         * @param message GameConfigResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: slot_fortune_rabbit.IGameConfigResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GameConfigResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameConfigResp.verify|verify} messages.
         * @param message GameConfigResp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: slot_fortune_rabbit.IGameConfigResp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GameConfigResp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GameConfigResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader | Uint8Array), length?: number): slot_fortune_rabbit.GameConfigResp;

        /**
         * Decodes a GameConfigResp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GameConfigResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader | Uint8Array)): slot_fortune_rabbit.GameConfigResp;

        /**
         * Verifies a GameConfigResp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string | null);

        /**
         * Creates a GameConfigResp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GameConfigResp
         */
        public static fromObject(object: { [k: string]: any }): slot_fortune_rabbit.GameConfigResp;

        /**
         * Creates a plain object from a GameConfigResp message. Also converts values to other types if specified.
         * @param message GameConfigResp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: slot_fortune_rabbit.GameConfigResp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GameConfigResp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };

        /**
         * Gets the default type url for GameConfigResp
         * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns The default type url
         */
        public static getTypeUrl(typeUrlPrefix?: string): string;
    }
}
