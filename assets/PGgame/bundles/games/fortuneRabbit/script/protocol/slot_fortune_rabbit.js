/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.slot_fortune_rabbit = (function () {

    /**
     * Namespace slot_fortune_rabbit.
     * @exports slot_fortune_rabbit
     * @namespace
     */
    var slot_fortune_rabbit = {};

    /**
     * FortuneRabbitCmd enum.
     * @name slot_fortune_rabbit.FortuneRabbitCmd
     * @enum {number}
     * @property {number} CMD_INVALID=0 CMD_INVALID value
     * @property {number} CMD_GAME_ENTER_REQ=1 CMD_GAME_ENTER_REQ value
     * @property {number} CMD_GAME_ENTER_RESP=2 CMD_GAME_ENTER_RESP value
     * @property {number} CMD_GAME_GET_TABLE_STATUS_REQ=3 CMD_GAME_GET_TABLE_STATUS_REQ value
     * @property {number} CMD_GAME_GET_TABLE_STATUS_RESP=4 CMD_GAME_GET_TABLE_STATUS_RESP value
     * @property {number} CMD_GAME_SPIN_REQ=7 CMD_GAME_SPIN_REQ value
     * @property {number} CMD_GAME_SPIN_RESP=8 CMD_GAME_SPIN_RESP value
     * @property {number} CMD_GAME_LEAVE_REQ=11 CMD_GAME_LEAVE_REQ value
     * @property {number} CMD_GAME_LEAVE_RESP=12 CMD_GAME_LEAVE_RESP value
     */
    slot_fortune_rabbit.FortuneRabbitCmd = (function () {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[0] = "CMD_INVALID"] = 0;
        values[valuesById[1] = "CMD_GAME_ENTER_REQ"] = 1;
        values[valuesById[2] = "CMD_GAME_ENTER_RESP"] = 2;
        values[valuesById[3] = "CMD_GAME_GET_TABLE_STATUS_REQ"] = 3;
        values[valuesById[4] = "CMD_GAME_GET_TABLE_STATUS_RESP"] = 4;
        values[valuesById[7] = "CMD_GAME_SPIN_REQ"] = 7;
        values[valuesById[8] = "CMD_GAME_SPIN_RESP"] = 8;
        values[valuesById[11] = "CMD_GAME_LEAVE_REQ"] = 11;
        values[valuesById[12] = "CMD_GAME_LEAVE_RESP"] = 12;
        return values;
    })();

    slot_fortune_rabbit.User = (function () {

        /**
         * Properties of a User.
         * @memberof slot_fortune_rabbit
         * @interface IUser
         * @property {number|null} [userId] User userId
         * @property {number|null} [balance] User balance
         * @property {string|null} [nickname] User nickname
         * @property {string|null} [avatar] User avatar
         */

        /**
         * Constructs a new User.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a User.
         * @implements IUser
         * @constructor
         * @param {slot_fortune_rabbit.IUser=} [properties] Properties to set
         */
        function User(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * User userId.
         * @member {number} userId
         * @memberof slot_fortune_rabbit.User
         * @instance
         */
        User.prototype.userId = 0;

        /**
         * User balance.
         * @member {number} balance
         * @memberof slot_fortune_rabbit.User
         * @instance
         */
        User.prototype.balance = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * User nickname.
         * @member {string} nickname
         * @memberof slot_fortune_rabbit.User
         * @instance
         */
        User.prototype.nickname = "";

        /**
         * User avatar.
         * @member {string} avatar
         * @memberof slot_fortune_rabbit.User
         * @instance
         */
        User.prototype.avatar = "";

        /**
         * Creates a new User instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {slot_fortune_rabbit.IUser=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.User} User instance
         */
        User.create = function create(properties) {
            return new User(properties);
        };

        /**
         * Encodes the specified User message. Does not implicitly {@link slot_fortune_rabbit.User.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {slot_fortune_rabbit.IUser} message User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.userId != null && Object.hasOwnProperty.call(message, "userId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.userId);
            if (message.balance != null && Object.hasOwnProperty.call(message, "balance"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.balance);
            if (message.nickname != null && Object.hasOwnProperty.call(message, "nickname"))
                writer.uint32(/* id 3, wireType 2 =*/26).string(message.nickname);
            if (message.avatar != null && Object.hasOwnProperty.call(message, "avatar"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.avatar);
            return writer;
        };

        /**
         * Encodes the specified User message, length delimited. Does not implicitly {@link slot_fortune_rabbit.User.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {slot_fortune_rabbit.IUser} message User message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        User.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a User message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.User} User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.User();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.userId = reader.uint32();
                        break;
                    }
                    case 2: {
                        message.balance = reader.int64();
                        break;
                    }
                    case 3: {
                        message.nickname = reader.string();
                        break;
                    }
                    case 4: {
                        message.avatar = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a User message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.User} User
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        User.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a User message.
         * @function verify
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        User.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.userId != null && message.hasOwnProperty("userId"))
                if (!$util.isInteger(message.userId))
                    return "userId: integer expected";
            if (message.balance != null && message.hasOwnProperty("balance"))
                if (!$util.isInteger(message.balance) && !(message.balance && $util.isInteger(message.balance.low) && $util.isInteger(message.balance.high)))
                    return "balance: integer|Long expected";
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                if (!$util.isString(message.nickname))
                    return "nickname: string expected";
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                if (!$util.isString(message.avatar))
                    return "avatar: string expected";
            return null;
        };

        /**
         * Creates a User message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.User} User
         */
        User.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.User)
                return object;
            var message = new $root.slot_fortune_rabbit.User();
            if (object.userId != null)
                message.userId = object.userId >>> 0;
            if (object.balance != null)
                if ($util.Long)
                    (message.balance = $util.Long.fromValue(object.balance)).unsigned = false;
                else if (typeof object.balance === "string")
                    message.balance = parseInt(object.balance, 10);
                else if (typeof object.balance === "number")
                    message.balance = object.balance;
                else if (typeof object.balance === "object")
                    message.balance = new $util.LongBits(object.balance.low >>> 0, object.balance.high >>> 0).toNumber();
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.avatar != null)
                message.avatar = String(object.avatar);
            return message;
        };

        /**
         * Creates a plain object from a User message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {slot_fortune_rabbit.User} message User
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        User.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.userId = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.balance = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.balance = options.longs === String ? "0" : 0;
                object.nickname = "";
                object.avatar = "";
            }
            if (message.userId != null && message.hasOwnProperty("userId"))
                object.userId = message.userId;
            if (message.balance != null && message.hasOwnProperty("balance"))
                if (typeof message.balance === "number")
                    object.balance = options.longs === String ? String(message.balance) : message.balance;
                else
                    object.balance = options.longs === String ? $util.Long.prototype.toString.call(message.balance) : options.longs === Number ? new $util.LongBits(message.balance.low >>> 0, message.balance.high >>> 0).toNumber() : message.balance;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.avatar != null && message.hasOwnProperty("avatar"))
                object.avatar = message.avatar;
            return object;
        };

        /**
         * Converts this User to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.User
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        User.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for User
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.User
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        User.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.User";
        };

        return User;
    })();

    slot_fortune_rabbit.FortuneRabbitSlotLevelDesc = (function () {

        /**
         * Properties of a FortuneRabbitSlotLevelDesc.
         * @memberof slot_fortune_rabbit
         * @interface IFortuneRabbitSlotLevelDesc
         * @property {number|null} [roomId] FortuneRabbitSlotLevelDesc roomId
         * @property {number|null} [gameType] FortuneRabbitSlotLevelDesc gameType
         * @property {Array.<number>|null} [chips] FortuneRabbitSlotLevelDesc chips
         */

        /**
         * Constructs a new FortuneRabbitSlotLevelDesc.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a FortuneRabbitSlotLevelDesc.
         * @implements IFortuneRabbitSlotLevelDesc
         * @constructor
         * @param {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc=} [properties] Properties to set
         */
        function FortuneRabbitSlotLevelDesc(properties) {
            this.chips = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * FortuneRabbitSlotLevelDesc roomId.
         * @member {number} roomId
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @instance
         */
        FortuneRabbitSlotLevelDesc.prototype.roomId = 0;

        /**
         * FortuneRabbitSlotLevelDesc gameType.
         * @member {number} gameType
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @instance
         */
        FortuneRabbitSlotLevelDesc.prototype.gameType = 0;

        /**
         * FortuneRabbitSlotLevelDesc chips.
         * @member {Array.<number>} chips
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @instance
         */
        FortuneRabbitSlotLevelDesc.prototype.chips = $util.emptyArray;

        /**
         * Creates a new FortuneRabbitSlotLevelDesc instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.FortuneRabbitSlotLevelDesc} FortuneRabbitSlotLevelDesc instance
         */
        FortuneRabbitSlotLevelDesc.create = function create(properties) {
            return new FortuneRabbitSlotLevelDesc(properties);
        };

        /**
         * Encodes the specified FortuneRabbitSlotLevelDesc message. Does not implicitly {@link slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc} message FortuneRabbitSlotLevelDesc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FortuneRabbitSlotLevelDesc.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.roomId != null && Object.hasOwnProperty.call(message, "roomId"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.roomId);
            if (message.gameType != null && Object.hasOwnProperty.call(message, "gameType"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.gameType);
            if (message.chips != null && message.chips.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.chips.length; ++i)
                    writer.uint32(message.chips[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified FortuneRabbitSlotLevelDesc message, length delimited. Does not implicitly {@link slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc} message FortuneRabbitSlotLevelDesc message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        FortuneRabbitSlotLevelDesc.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a FortuneRabbitSlotLevelDesc message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.FortuneRabbitSlotLevelDesc} FortuneRabbitSlotLevelDesc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FortuneRabbitSlotLevelDesc.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.roomId = reader.uint32();
                        break;
                    }
                    case 2: {
                        message.gameType = reader.uint32();
                        break;
                    }
                    case 3: {
                        if (!(message.chips && message.chips.length))
                            message.chips = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.chips.push(reader.uint32());
                        } else
                            message.chips.push(reader.uint32());
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a FortuneRabbitSlotLevelDesc message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.FortuneRabbitSlotLevelDesc} FortuneRabbitSlotLevelDesc
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        FortuneRabbitSlotLevelDesc.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a FortuneRabbitSlotLevelDesc message.
         * @function verify
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        FortuneRabbitSlotLevelDesc.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                if (!$util.isInteger(message.roomId))
                    return "roomId: integer expected";
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                if (!$util.isInteger(message.gameType))
                    return "gameType: integer expected";
            if (message.chips != null && message.hasOwnProperty("chips")) {
                if (!Array.isArray(message.chips))
                    return "chips: array expected";
                for (var i = 0; i < message.chips.length; ++i)
                    if (!$util.isInteger(message.chips[i]))
                        return "chips: integer[] expected";
            }
            return null;
        };

        /**
         * Creates a FortuneRabbitSlotLevelDesc message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.FortuneRabbitSlotLevelDesc} FortuneRabbitSlotLevelDesc
         */
        FortuneRabbitSlotLevelDesc.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc)
                return object;
            var message = new $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc();
            if (object.roomId != null)
                message.roomId = object.roomId >>> 0;
            if (object.gameType != null)
                message.gameType = object.gameType >>> 0;
            if (object.chips) {
                if (!Array.isArray(object.chips))
                    throw TypeError(".slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.chips: array expected");
                message.chips = [];
                for (var i = 0; i < object.chips.length; ++i)
                    message.chips[i] = object.chips[i] >>> 0;
            }
            return message;
        };

        /**
         * Creates a plain object from a FortuneRabbitSlotLevelDesc message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {slot_fortune_rabbit.FortuneRabbitSlotLevelDesc} message FortuneRabbitSlotLevelDesc
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        FortuneRabbitSlotLevelDesc.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.chips = [];
            if (options.defaults) {
                object.roomId = 0;
                object.gameType = 0;
            }
            if (message.roomId != null && message.hasOwnProperty("roomId"))
                object.roomId = message.roomId;
            if (message.gameType != null && message.hasOwnProperty("gameType"))
                object.gameType = message.gameType;
            if (message.chips && message.chips.length) {
                object.chips = [];
                for (var j = 0; j < message.chips.length; ++j)
                    object.chips[j] = message.chips[j];
            }
            return object;
        };

        /**
         * Converts this FortuneRabbitSlotLevelDesc to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        FortuneRabbitSlotLevelDesc.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for FortuneRabbitSlotLevelDesc
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.FortuneRabbitSlotLevelDesc
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        FortuneRabbitSlotLevelDesc.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.FortuneRabbitSlotLevelDesc";
        };

        return FortuneRabbitSlotLevelDesc;
    })();

    slot_fortune_rabbit.Hit = (function () {

        /**
         * Properties of a Hit.
         * @memberof slot_fortune_rabbit
         * @interface IHit
         * @property {number|null} [lineId] Hit lineId
         * @property {number|null} [win] Hit win
         * @property {Array.<number>|null} [pos] Hit pos
         * @property {number|null} [symbol] Hit symbol
         */

        /**
         * Constructs a new Hit.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a Hit.
         * @implements IHit
         * @constructor
         * @param {slot_fortune_rabbit.IHit=} [properties] Properties to set
         */
        function Hit(properties) {
            this.pos = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Hit lineId.
         * @member {number} lineId
         * @memberof slot_fortune_rabbit.Hit
         * @instance
         */
        Hit.prototype.lineId = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Hit win.
         * @member {number} win
         * @memberof slot_fortune_rabbit.Hit
         * @instance
         */
        Hit.prototype.win = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Hit pos.
         * @member {Array.<number>} pos
         * @memberof slot_fortune_rabbit.Hit
         * @instance
         */
        Hit.prototype.pos = $util.emptyArray;

        /**
         * Hit symbol.
         * @member {number} symbol
         * @memberof slot_fortune_rabbit.Hit
         * @instance
         */
        Hit.prototype.symbol = 0;

        /**
         * Creates a new Hit instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {slot_fortune_rabbit.IHit=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.Hit} Hit instance
         */
        Hit.create = function create(properties) {
            return new Hit(properties);
        };

        /**
         * Encodes the specified Hit message. Does not implicitly {@link slot_fortune_rabbit.Hit.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {slot_fortune_rabbit.IHit} message Hit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Hit.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.lineId != null && Object.hasOwnProperty.call(message, "lineId"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.lineId);
            if (message.win != null && Object.hasOwnProperty.call(message, "win"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.win);
            if (message.pos != null && message.pos.length) {
                writer.uint32(/* id 3, wireType 2 =*/26).fork();
                for (var i = 0; i < message.pos.length; ++i)
                    writer.uint32(message.pos[i]);
                writer.ldelim();
            }
            if (message.symbol != null && Object.hasOwnProperty.call(message, "symbol"))
                writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.symbol);
            return writer;
        };

        /**
         * Encodes the specified Hit message, length delimited. Does not implicitly {@link slot_fortune_rabbit.Hit.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {slot_fortune_rabbit.IHit} message Hit message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Hit.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Hit message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.Hit} Hit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Hit.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.Hit();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.lineId = reader.int64();
                        break;
                    }
                    case 2: {
                        message.win = reader.int64();
                        break;
                    }
                    case 3: {
                        if (!(message.pos && message.pos.length))
                            message.pos = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.pos.push(reader.uint32());
                        } else
                            message.pos.push(reader.uint32());
                        break;
                    }
                    case 4: {
                        message.symbol = reader.uint32();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a Hit message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.Hit} Hit
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Hit.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Hit message.
         * @function verify
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Hit.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.lineId != null && message.hasOwnProperty("lineId"))
                if (!$util.isInteger(message.lineId) && !(message.lineId && $util.isInteger(message.lineId.low) && $util.isInteger(message.lineId.high)))
                    return "lineId: integer|Long expected";
            if (message.win != null && message.hasOwnProperty("win"))
                if (!$util.isInteger(message.win) && !(message.win && $util.isInteger(message.win.low) && $util.isInteger(message.win.high)))
                    return "win: integer|Long expected";
            if (message.pos != null && message.hasOwnProperty("pos")) {
                if (!Array.isArray(message.pos))
                    return "pos: array expected";
                for (var i = 0; i < message.pos.length; ++i)
                    if (!$util.isInteger(message.pos[i]))
                        return "pos: integer[] expected";
            }
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                if (!$util.isInteger(message.symbol))
                    return "symbol: integer expected";
            return null;
        };

        /**
         * Creates a Hit message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.Hit} Hit
         */
        Hit.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.Hit)
                return object;
            var message = new $root.slot_fortune_rabbit.Hit();
            if (object.lineId != null)
                if ($util.Long)
                    (message.lineId = $util.Long.fromValue(object.lineId)).unsigned = false;
                else if (typeof object.lineId === "string")
                    message.lineId = parseInt(object.lineId, 10);
                else if (typeof object.lineId === "number")
                    message.lineId = object.lineId;
                else if (typeof object.lineId === "object")
                    message.lineId = new $util.LongBits(object.lineId.low >>> 0, object.lineId.high >>> 0).toNumber();
            if (object.win != null)
                if ($util.Long)
                    (message.win = $util.Long.fromValue(object.win)).unsigned = false;
                else if (typeof object.win === "string")
                    message.win = parseInt(object.win, 10);
                else if (typeof object.win === "number")
                    message.win = object.win;
                else if (typeof object.win === "object")
                    message.win = new $util.LongBits(object.win.low >>> 0, object.win.high >>> 0).toNumber();
            if (object.pos) {
                if (!Array.isArray(object.pos))
                    throw TypeError(".slot_fortune_rabbit.Hit.pos: array expected");
                message.pos = [];
                for (var i = 0; i < object.pos.length; ++i)
                    message.pos[i] = object.pos[i] >>> 0;
            }
            if (object.symbol != null)
                message.symbol = object.symbol >>> 0;
            return message;
        };

        /**
         * Creates a plain object from a Hit message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {slot_fortune_rabbit.Hit} message Hit
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Hit.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.pos = [];
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.lineId = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.lineId = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.win = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.win = options.longs === String ? "0" : 0;
                object.symbol = 0;
            }
            if (message.lineId != null && message.hasOwnProperty("lineId"))
                if (typeof message.lineId === "number")
                    object.lineId = options.longs === String ? String(message.lineId) : message.lineId;
                else
                    object.lineId = options.longs === String ? $util.Long.prototype.toString.call(message.lineId) : options.longs === Number ? new $util.LongBits(message.lineId.low >>> 0, message.lineId.high >>> 0).toNumber() : message.lineId;
            if (message.win != null && message.hasOwnProperty("win"))
                if (typeof message.win === "number")
                    object.win = options.longs === String ? String(message.win) : message.win;
                else
                    object.win = options.longs === String ? $util.Long.prototype.toString.call(message.win) : options.longs === Number ? new $util.LongBits(message.win.low >>> 0, message.win.high >>> 0).toNumber() : message.win;
            if (message.pos && message.pos.length) {
                object.pos = [];
                for (var j = 0; j < message.pos.length; ++j)
                    object.pos[j] = message.pos[j];
            }
            if (message.symbol != null && message.hasOwnProperty("symbol"))
                object.symbol = message.symbol;
            return object;
        };

        /**
         * Converts this Hit to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.Hit
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Hit.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Hit
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.Hit
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Hit.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.Hit";
        };

        return Hit;
    })();

    slot_fortune_rabbit.Symbol = (function () {

        /**
         * Properties of a Symbol.
         * @memberof slot_fortune_rabbit
         * @interface ISymbol
         * @property {number|null} [id] Symbol id
         * @property {number|null} [multi] Symbol multi
         */

        /**
         * Constructs a new Symbol.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a Symbol.
         * @implements ISymbol
         * @constructor
         * @param {slot_fortune_rabbit.ISymbol=} [properties] Properties to set
         */
        function Symbol(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Symbol id.
         * @member {number} id
         * @memberof slot_fortune_rabbit.Symbol
         * @instance
         */
        Symbol.prototype.id = 0;

        /**
         * Symbol multi.
         * @member {number} multi
         * @memberof slot_fortune_rabbit.Symbol
         * @instance
         */
        Symbol.prototype.multi = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Creates a new Symbol instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {slot_fortune_rabbit.ISymbol=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.Symbol} Symbol instance
         */
        Symbol.create = function create(properties) {
            return new Symbol(properties);
        };

        /**
         * Encodes the specified Symbol message. Does not implicitly {@link slot_fortune_rabbit.Symbol.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {slot_fortune_rabbit.ISymbol} message Symbol message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Symbol.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.id != null && Object.hasOwnProperty.call(message, "id"))
                writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.multi != null && Object.hasOwnProperty.call(message, "multi"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.multi);
            return writer;
        };

        /**
         * Encodes the specified Symbol message, length delimited. Does not implicitly {@link slot_fortune_rabbit.Symbol.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {slot_fortune_rabbit.ISymbol} message Symbol message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Symbol.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Symbol message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.Symbol} Symbol
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Symbol.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.Symbol();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.id = reader.uint32();
                        break;
                    }
                    case 2: {
                        message.multi = reader.int64();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a Symbol message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.Symbol} Symbol
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Symbol.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Symbol message.
         * @function verify
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Symbol.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.id != null && message.hasOwnProperty("id"))
                if (!$util.isInteger(message.id))
                    return "id: integer expected";
            if (message.multi != null && message.hasOwnProperty("multi"))
                if (!$util.isInteger(message.multi) && !(message.multi && $util.isInteger(message.multi.low) && $util.isInteger(message.multi.high)))
                    return "multi: integer|Long expected";
            return null;
        };

        /**
         * Creates a Symbol message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.Symbol} Symbol
         */
        Symbol.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.Symbol)
                return object;
            var message = new $root.slot_fortune_rabbit.Symbol();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.multi != null)
                if ($util.Long)
                    (message.multi = $util.Long.fromValue(object.multi)).unsigned = false;
                else if (typeof object.multi === "string")
                    message.multi = parseInt(object.multi, 10);
                else if (typeof object.multi === "number")
                    message.multi = object.multi;
                else if (typeof object.multi === "object")
                    message.multi = new $util.LongBits(object.multi.low >>> 0, object.multi.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a Symbol message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {slot_fortune_rabbit.Symbol} message Symbol
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Symbol.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.multi = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.multi = options.longs === String ? "0" : 0;
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.multi != null && message.hasOwnProperty("multi"))
                if (typeof message.multi === "number")
                    object.multi = options.longs === String ? String(message.multi) : message.multi;
                else
                    object.multi = options.longs === String ? $util.Long.prototype.toString.call(message.multi) : options.longs === Number ? new $util.LongBits(message.multi.low >>> 0, message.multi.high >>> 0).toNumber() : message.multi;
            return object;
        };

        /**
         * Converts this Symbol to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.Symbol
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Symbol.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for Symbol
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.Symbol
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        Symbol.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.Symbol";
        };

        return Symbol;
    })();

    slot_fortune_rabbit.LastScreen = (function () {

        /**
         * Properties of a LastScreen.
         * @memberof slot_fortune_rabbit
         * @interface ILastScreen
         * @property {number|null} [win] LastScreen win
         * @property {number|null} [amount] LastScreen amount
         * @property {number|null} [betSize] LastScreen betSize
         * @property {number|null} [betMul] LastScreen betMul
         * @property {Array.<slot_fortune_rabbit.ISymbol>|null} [screen] LastScreen screen
         * @property {Array.<slot_fortune_rabbit.IHit>|null} [hits] LastScreen hits
         * @property {number|null} [leftTimes] LastScreen leftTimes
         * @property {boolean|null} [feature] LastScreen feature
         * @property {number|null} [rabbitWin] LastScreen rabbitWin
         */

        /**
         * Constructs a new LastScreen.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a LastScreen.
         * @implements ILastScreen
         * @constructor
         * @param {slot_fortune_rabbit.ILastScreen=} [properties] Properties to set
         */
        function LastScreen(properties) {
            this.screen = [];
            this.hits = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * LastScreen win.
         * @member {number} win
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.win = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * LastScreen amount.
         * @member {number} amount
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.amount = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * LastScreen betSize.
         * @member {number} betSize
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.betSize = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * LastScreen betMul.
         * @member {number} betMul
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.betMul = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * LastScreen screen.
         * @member {Array.<slot_fortune_rabbit.ISymbol>} screen
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.screen = $util.emptyArray;

        /**
         * LastScreen hits.
         * @member {Array.<slot_fortune_rabbit.IHit>} hits
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.hits = $util.emptyArray;

        /**
         * LastScreen leftTimes.
         * @member {number} leftTimes
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.leftTimes = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * LastScreen feature.
         * @member {boolean} feature
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.feature = false;

        /**
         * LastScreen rabbitWin.
         * @member {number} rabbitWin
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         */
        LastScreen.prototype.rabbitWin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Creates a new LastScreen instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {slot_fortune_rabbit.ILastScreen=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.LastScreen} LastScreen instance
         */
        LastScreen.create = function create(properties) {
            return new LastScreen(properties);
        };

        /**
         * Encodes the specified LastScreen message. Does not implicitly {@link slot_fortune_rabbit.LastScreen.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {slot_fortune_rabbit.ILastScreen} message LastScreen message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LastScreen.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.win != null && Object.hasOwnProperty.call(message, "win"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.win);
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 2, wireType 0 =*/16).int64(message.amount);
            if (message.betSize != null && Object.hasOwnProperty.call(message, "betSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.betSize);
            if (message.betMul != null && Object.hasOwnProperty.call(message, "betMul"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.betMul);
            if (message.screen != null && message.screen.length)
                for (var i = 0; i < message.screen.length; ++i)
                    $root.slot_fortune_rabbit.Symbol.encode(message.screen[i], writer.uint32(/* id 5, wireType 2 =*/42).fork()).ldelim();
            if (message.hits != null && message.hits.length)
                for (var i = 0; i < message.hits.length; ++i)
                    $root.slot_fortune_rabbit.Hit.encode(message.hits[i], writer.uint32(/* id 6, wireType 2 =*/50).fork()).ldelim();
            if (message.leftTimes != null && Object.hasOwnProperty.call(message, "leftTimes"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.leftTimes);
            if (message.feature != null && Object.hasOwnProperty.call(message, "feature"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.feature);
            if (message.rabbitWin != null && Object.hasOwnProperty.call(message, "rabbitWin"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.rabbitWin);
            return writer;
        };

        /**
         * Encodes the specified LastScreen message, length delimited. Does not implicitly {@link slot_fortune_rabbit.LastScreen.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {slot_fortune_rabbit.ILastScreen} message LastScreen message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        LastScreen.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a LastScreen message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.LastScreen} LastScreen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LastScreen.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.LastScreen();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.win = reader.int64();
                        break;
                    }
                    case 2: {
                        message.amount = reader.int64();
                        break;
                    }
                    case 3: {
                        message.betSize = reader.int64();
                        break;
                    }
                    case 4: {
                        message.betMul = reader.int64();
                        break;
                    }
                    case 5: {
                        if (!(message.screen && message.screen.length))
                            message.screen = [];
                        message.screen.push($root.slot_fortune_rabbit.Symbol.decode(reader, reader.uint32()));
                        break;
                    }
                    case 6: {
                        if (!(message.hits && message.hits.length))
                            message.hits = [];
                        message.hits.push($root.slot_fortune_rabbit.Hit.decode(reader, reader.uint32()));
                        break;
                    }
                    case 7: {
                        message.leftTimes = reader.int64();
                        break;
                    }
                    case 8: {
                        message.feature = reader.bool();
                        break;
                    }
                    case 9: {
                        message.rabbitWin = reader.int64();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a LastScreen message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.LastScreen} LastScreen
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        LastScreen.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a LastScreen message.
         * @function verify
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        LastScreen.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.win != null && message.hasOwnProperty("win"))
                if (!$util.isInteger(message.win) && !(message.win && $util.isInteger(message.win.low) && $util.isInteger(message.win.high)))
                    return "win: integer|Long expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            if (message.betSize != null && message.hasOwnProperty("betSize"))
                if (!$util.isInteger(message.betSize) && !(message.betSize && $util.isInteger(message.betSize.low) && $util.isInteger(message.betSize.high)))
                    return "betSize: integer|Long expected";
            if (message.betMul != null && message.hasOwnProperty("betMul"))
                if (!$util.isInteger(message.betMul) && !(message.betMul && $util.isInteger(message.betMul.low) && $util.isInteger(message.betMul.high)))
                    return "betMul: integer|Long expected";
            if (message.screen != null && message.hasOwnProperty("screen")) {
                if (!Array.isArray(message.screen))
                    return "screen: array expected";
                for (var i = 0; i < message.screen.length; ++i) {
                    var error = $root.slot_fortune_rabbit.Symbol.verify(message.screen[i]);
                    if (error)
                        return "screen." + error;
                }
            }
            if (message.hits != null && message.hasOwnProperty("hits")) {
                if (!Array.isArray(message.hits))
                    return "hits: array expected";
                for (var i = 0; i < message.hits.length; ++i) {
                    var error = $root.slot_fortune_rabbit.Hit.verify(message.hits[i]);
                    if (error)
                        return "hits." + error;
                }
            }
            if (message.leftTimes != null && message.hasOwnProperty("leftTimes"))
                if (!$util.isInteger(message.leftTimes) && !(message.leftTimes && $util.isInteger(message.leftTimes.low) && $util.isInteger(message.leftTimes.high)))
                    return "leftTimes: integer|Long expected";
            if (message.feature != null && message.hasOwnProperty("feature"))
                if (typeof message.feature !== "boolean")
                    return "feature: boolean expected";
            if (message.rabbitWin != null && message.hasOwnProperty("rabbitWin"))
                if (!$util.isInteger(message.rabbitWin) && !(message.rabbitWin && $util.isInteger(message.rabbitWin.low) && $util.isInteger(message.rabbitWin.high)))
                    return "rabbitWin: integer|Long expected";
            return null;
        };

        /**
         * Creates a LastScreen message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.LastScreen} LastScreen
         */
        LastScreen.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.LastScreen)
                return object;
            var message = new $root.slot_fortune_rabbit.LastScreen();
            if (object.win != null)
                if ($util.Long)
                    (message.win = $util.Long.fromValue(object.win)).unsigned = false;
                else if (typeof object.win === "string")
                    message.win = parseInt(object.win, 10);
                else if (typeof object.win === "number")
                    message.win = object.win;
                else if (typeof object.win === "object")
                    message.win = new $util.LongBits(object.win.low >>> 0, object.win.high >>> 0).toNumber();
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            if (object.betSize != null)
                if ($util.Long)
                    (message.betSize = $util.Long.fromValue(object.betSize)).unsigned = false;
                else if (typeof object.betSize === "string")
                    message.betSize = parseInt(object.betSize, 10);
                else if (typeof object.betSize === "number")
                    message.betSize = object.betSize;
                else if (typeof object.betSize === "object")
                    message.betSize = new $util.LongBits(object.betSize.low >>> 0, object.betSize.high >>> 0).toNumber();
            if (object.betMul != null)
                if ($util.Long)
                    (message.betMul = $util.Long.fromValue(object.betMul)).unsigned = false;
                else if (typeof object.betMul === "string")
                    message.betMul = parseInt(object.betMul, 10);
                else if (typeof object.betMul === "number")
                    message.betMul = object.betMul;
                else if (typeof object.betMul === "object")
                    message.betMul = new $util.LongBits(object.betMul.low >>> 0, object.betMul.high >>> 0).toNumber();
            if (object.screen) {
                if (!Array.isArray(object.screen))
                    throw TypeError(".slot_fortune_rabbit.LastScreen.screen: array expected");
                message.screen = [];
                for (var i = 0; i < object.screen.length; ++i) {
                    if (typeof object.screen[i] !== "object")
                        throw TypeError(".slot_fortune_rabbit.LastScreen.screen: object expected");
                    message.screen[i] = $root.slot_fortune_rabbit.Symbol.fromObject(object.screen[i]);
                }
            }
            if (object.hits) {
                if (!Array.isArray(object.hits))
                    throw TypeError(".slot_fortune_rabbit.LastScreen.hits: array expected");
                message.hits = [];
                for (var i = 0; i < object.hits.length; ++i) {
                    if (typeof object.hits[i] !== "object")
                        throw TypeError(".slot_fortune_rabbit.LastScreen.hits: object expected");
                    message.hits[i] = $root.slot_fortune_rabbit.Hit.fromObject(object.hits[i]);
                }
            }
            if (object.leftTimes != null)
                if ($util.Long)
                    (message.leftTimes = $util.Long.fromValue(object.leftTimes)).unsigned = false;
                else if (typeof object.leftTimes === "string")
                    message.leftTimes = parseInt(object.leftTimes, 10);
                else if (typeof object.leftTimes === "number")
                    message.leftTimes = object.leftTimes;
                else if (typeof object.leftTimes === "object")
                    message.leftTimes = new $util.LongBits(object.leftTimes.low >>> 0, object.leftTimes.high >>> 0).toNumber();
            if (object.feature != null)
                message.feature = Boolean(object.feature);
            if (object.rabbitWin != null)
                if ($util.Long)
                    (message.rabbitWin = $util.Long.fromValue(object.rabbitWin)).unsigned = false;
                else if (typeof object.rabbitWin === "string")
                    message.rabbitWin = parseInt(object.rabbitWin, 10);
                else if (typeof object.rabbitWin === "number")
                    message.rabbitWin = object.rabbitWin;
                else if (typeof object.rabbitWin === "object")
                    message.rabbitWin = new $util.LongBits(object.rabbitWin.low >>> 0, object.rabbitWin.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a LastScreen message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {slot_fortune_rabbit.LastScreen} message LastScreen
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        LastScreen.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.screen = [];
                object.hits = [];
            }
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.win = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.win = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.betSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.betSize = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.betMul = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.betMul = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.leftTimes = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.leftTimes = options.longs === String ? "0" : 0;
                object.feature = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.rabbitWin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.rabbitWin = options.longs === String ? "0" : 0;
            }
            if (message.win != null && message.hasOwnProperty("win"))
                if (typeof message.win === "number")
                    object.win = options.longs === String ? String(message.win) : message.win;
                else
                    object.win = options.longs === String ? $util.Long.prototype.toString.call(message.win) : options.longs === Number ? new $util.LongBits(message.win.low >>> 0, message.win.high >>> 0).toNumber() : message.win;
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            if (message.betSize != null && message.hasOwnProperty("betSize"))
                if (typeof message.betSize === "number")
                    object.betSize = options.longs === String ? String(message.betSize) : message.betSize;
                else
                    object.betSize = options.longs === String ? $util.Long.prototype.toString.call(message.betSize) : options.longs === Number ? new $util.LongBits(message.betSize.low >>> 0, message.betSize.high >>> 0).toNumber() : message.betSize;
            if (message.betMul != null && message.hasOwnProperty("betMul"))
                if (typeof message.betMul === "number")
                    object.betMul = options.longs === String ? String(message.betMul) : message.betMul;
                else
                    object.betMul = options.longs === String ? $util.Long.prototype.toString.call(message.betMul) : options.longs === Number ? new $util.LongBits(message.betMul.low >>> 0, message.betMul.high >>> 0).toNumber() : message.betMul;
            if (message.screen && message.screen.length) {
                object.screen = [];
                for (var j = 0; j < message.screen.length; ++j)
                    object.screen[j] = $root.slot_fortune_rabbit.Symbol.toObject(message.screen[j], options);
            }
            if (message.hits && message.hits.length) {
                object.hits = [];
                for (var j = 0; j < message.hits.length; ++j)
                    object.hits[j] = $root.slot_fortune_rabbit.Hit.toObject(message.hits[j], options);
            }
            if (message.leftTimes != null && message.hasOwnProperty("leftTimes"))
                if (typeof message.leftTimes === "number")
                    object.leftTimes = options.longs === String ? String(message.leftTimes) : message.leftTimes;
                else
                    object.leftTimes = options.longs === String ? $util.Long.prototype.toString.call(message.leftTimes) : options.longs === Number ? new $util.LongBits(message.leftTimes.low >>> 0, message.leftTimes.high >>> 0).toNumber() : message.leftTimes;
            if (message.feature != null && message.hasOwnProperty("feature"))
                object.feature = message.feature;
            if (message.rabbitWin != null && message.hasOwnProperty("rabbitWin"))
                if (typeof message.rabbitWin === "number")
                    object.rabbitWin = options.longs === String ? String(message.rabbitWin) : message.rabbitWin;
                else
                    object.rabbitWin = options.longs === String ? $util.Long.prototype.toString.call(message.rabbitWin) : options.longs === Number ? new $util.LongBits(message.rabbitWin.low >>> 0, message.rabbitWin.high >>> 0).toNumber() : message.rabbitWin;
            return object;
        };

        /**
         * Converts this LastScreen to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.LastScreen
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        LastScreen.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for LastScreen
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.LastScreen
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        LastScreen.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.LastScreen";
        };

        return LastScreen;
    })();

    slot_fortune_rabbit.GameGetTableInfoResp = (function () {

        /**
         * Properties of a GameGetTableInfoResp.
         * @memberof slot_fortune_rabbit
         * @interface IGameGetTableInfoResp
         * @property {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc|null} [desc] GameGetTableInfoResp desc
         * @property {string|null} [roundId] GameGetTableInfoResp roundId
         * @property {slot_fortune_rabbit.IUser|null} [self] GameGetTableInfoResp self
         * @property {slot_fortune_rabbit.ILastScreen|null} [lastScreen] GameGetTableInfoResp lastScreen
         * @property {Array.<number>|null} [winLevel] GameGetTableInfoResp winLevel
         */

        /**
         * Constructs a new GameGetTableInfoResp.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameGetTableInfoResp.
         * @implements IGameGetTableInfoResp
         * @constructor
         * @param {slot_fortune_rabbit.IGameGetTableInfoResp=} [properties] Properties to set
         */
        function GameGetTableInfoResp(properties) {
            this.winLevel = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameGetTableInfoResp desc.
         * @member {slot_fortune_rabbit.IFortuneRabbitSlotLevelDesc|null|undefined} desc
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         */
        GameGetTableInfoResp.prototype.desc = null;

        /**
         * GameGetTableInfoResp roundId.
         * @member {string} roundId
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         */
        GameGetTableInfoResp.prototype.roundId = "";

        /**
         * GameGetTableInfoResp self.
         * @member {slot_fortune_rabbit.IUser|null|undefined} self
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         */
        GameGetTableInfoResp.prototype.self = null;

        /**
         * GameGetTableInfoResp lastScreen.
         * @member {slot_fortune_rabbit.ILastScreen|null|undefined} lastScreen
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         */
        GameGetTableInfoResp.prototype.lastScreen = null;

        /**
         * GameGetTableInfoResp winLevel.
         * @member {Array.<number>} winLevel
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         */
        GameGetTableInfoResp.prototype.winLevel = $util.emptyArray;

        /**
         * Creates a new GameGetTableInfoResp instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableInfoResp=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameGetTableInfoResp} GameGetTableInfoResp instance
         */
        GameGetTableInfoResp.create = function create(properties) {
            return new GameGetTableInfoResp(properties);
        };

        /**
         * Encodes the specified GameGetTableInfoResp message. Does not implicitly {@link slot_fortune_rabbit.GameGetTableInfoResp.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableInfoResp} message GameGetTableInfoResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetTableInfoResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.desc != null && Object.hasOwnProperty.call(message, "desc"))
                $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.encode(message.desc, writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.roundId != null && Object.hasOwnProperty.call(message, "roundId"))
                writer.uint32(/* id 2, wireType 2 =*/18).string(message.roundId);
            if (message.self != null && Object.hasOwnProperty.call(message, "self"))
                $root.slot_fortune_rabbit.User.encode(message.self, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            if (message.lastScreen != null && Object.hasOwnProperty.call(message, "lastScreen"))
                $root.slot_fortune_rabbit.LastScreen.encode(message.lastScreen, writer.uint32(/* id 4, wireType 2 =*/34).fork()).ldelim();
            if (message.winLevel != null && message.winLevel.length) {
                writer.uint32(/* id 5, wireType 2 =*/42).fork();
                for (var i = 0; i < message.winLevel.length; ++i)
                    writer.int64(message.winLevel[i]);
                writer.ldelim();
            }
            return writer;
        };

        /**
         * Encodes the specified GameGetTableInfoResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetTableInfoResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableInfoResp} message GameGetTableInfoResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetTableInfoResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameGetTableInfoResp message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameGetTableInfoResp} GameGetTableInfoResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetTableInfoResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameGetTableInfoResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.desc = $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.decode(reader, reader.uint32());
                        break;
                    }
                    case 2: {
                        message.roundId = reader.string();
                        break;
                    }
                    case 3: {
                        message.self = $root.slot_fortune_rabbit.User.decode(reader, reader.uint32());
                        break;
                    }
                    case 4: {
                        message.lastScreen = $root.slot_fortune_rabbit.LastScreen.decode(reader, reader.uint32());
                        break;
                    }
                    case 5: {
                        if (!(message.winLevel && message.winLevel.length))
                            message.winLevel = [];
                        if ((tag & 7) === 2) {
                            var end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2)
                                message.winLevel.push(reader.int64());
                        } else
                            message.winLevel.push(reader.int64());
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameGetTableInfoResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameGetTableInfoResp} GameGetTableInfoResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetTableInfoResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameGetTableInfoResp message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameGetTableInfoResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.desc != null && message.hasOwnProperty("desc")) {
                var error = $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.verify(message.desc);
                if (error)
                    return "desc." + error;
            }
            if (message.roundId != null && message.hasOwnProperty("roundId"))
                if (!$util.isString(message.roundId))
                    return "roundId: string expected";
            if (message.self != null && message.hasOwnProperty("self")) {
                var error = $root.slot_fortune_rabbit.User.verify(message.self);
                if (error)
                    return "self." + error;
            }
            if (message.lastScreen != null && message.hasOwnProperty("lastScreen")) {
                var error = $root.slot_fortune_rabbit.LastScreen.verify(message.lastScreen);
                if (error)
                    return "lastScreen." + error;
            }
            if (message.winLevel != null && message.hasOwnProperty("winLevel")) {
                if (!Array.isArray(message.winLevel))
                    return "winLevel: array expected";
                for (var i = 0; i < message.winLevel.length; ++i)
                    if (!$util.isInteger(message.winLevel[i]) && !(message.winLevel[i] && $util.isInteger(message.winLevel[i].low) && $util.isInteger(message.winLevel[i].high)))
                        return "winLevel: integer|Long[] expected";
            }
            return null;
        };

        /**
         * Creates a GameGetTableInfoResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameGetTableInfoResp} GameGetTableInfoResp
         */
        GameGetTableInfoResp.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameGetTableInfoResp)
                return object;
            var message = new $root.slot_fortune_rabbit.GameGetTableInfoResp();
            if (object.desc != null) {
                if (typeof object.desc !== "object")
                    throw TypeError(".slot_fortune_rabbit.GameGetTableInfoResp.desc: object expected");
                message.desc = $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.fromObject(object.desc);
            }
            if (object.roundId != null)
                message.roundId = String(object.roundId);
            if (object.self != null) {
                if (typeof object.self !== "object")
                    throw TypeError(".slot_fortune_rabbit.GameGetTableInfoResp.self: object expected");
                message.self = $root.slot_fortune_rabbit.User.fromObject(object.self);
            }
            if (object.lastScreen != null) {
                if (typeof object.lastScreen !== "object")
                    throw TypeError(".slot_fortune_rabbit.GameGetTableInfoResp.lastScreen: object expected");
                message.lastScreen = $root.slot_fortune_rabbit.LastScreen.fromObject(object.lastScreen);
            }
            if (object.winLevel) {
                if (!Array.isArray(object.winLevel))
                    throw TypeError(".slot_fortune_rabbit.GameGetTableInfoResp.winLevel: array expected");
                message.winLevel = [];
                for (var i = 0; i < object.winLevel.length; ++i)
                    if ($util.Long)
                        (message.winLevel[i] = $util.Long.fromValue(object.winLevel[i])).unsigned = false;
                    else if (typeof object.winLevel[i] === "string")
                        message.winLevel[i] = parseInt(object.winLevel[i], 10);
                    else if (typeof object.winLevel[i] === "number")
                        message.winLevel[i] = object.winLevel[i];
                    else if (typeof object.winLevel[i] === "object")
                        message.winLevel[i] = new $util.LongBits(object.winLevel[i].low >>> 0, object.winLevel[i].high >>> 0).toNumber();
            }
            return message;
        };

        /**
         * Creates a plain object from a GameGetTableInfoResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {slot_fortune_rabbit.GameGetTableInfoResp} message GameGetTableInfoResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameGetTableInfoResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.winLevel = [];
            if (options.defaults) {
                object.desc = null;
                object.roundId = "";
                object.self = null;
                object.lastScreen = null;
            }
            if (message.desc != null && message.hasOwnProperty("desc"))
                object.desc = $root.slot_fortune_rabbit.FortuneRabbitSlotLevelDesc.toObject(message.desc, options);
            if (message.roundId != null && message.hasOwnProperty("roundId"))
                object.roundId = message.roundId;
            if (message.self != null && message.hasOwnProperty("self"))
                object.self = $root.slot_fortune_rabbit.User.toObject(message.self, options);
            if (message.lastScreen != null && message.hasOwnProperty("lastScreen"))
                object.lastScreen = $root.slot_fortune_rabbit.LastScreen.toObject(message.lastScreen, options);
            if (message.winLevel && message.winLevel.length) {
                object.winLevel = [];
                for (var j = 0; j < message.winLevel.length; ++j)
                    if (typeof message.winLevel[j] === "number")
                        object.winLevel[j] = options.longs === String ? String(message.winLevel[j]) : message.winLevel[j];
                    else
                        object.winLevel[j] = options.longs === String ? $util.Long.prototype.toString.call(message.winLevel[j]) : options.longs === Number ? new $util.LongBits(message.winLevel[j].low >>> 0, message.winLevel[j].high >>> 0).toNumber() : message.winLevel[j];
            }
            return object;
        };

        /**
         * Converts this GameGetTableInfoResp to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameGetTableInfoResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameGetTableInfoResp
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameGetTableInfoResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameGetTableInfoResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameGetTableInfoResp";
        };

        return GameGetTableInfoResp;
    })();

    slot_fortune_rabbit.SpinResp = (function () {

        /**
         * Properties of a SpinResp.
         * @memberof slot_fortune_rabbit
         * @interface ISpinResp
         * @property {Array.<slot_fortune_rabbit.IHit>|null} [hits] SpinResp hits
         * @property {Array.<slot_fortune_rabbit.ISymbol>|null} [screen] SpinResp screen
         * @property {boolean|null} [trigger] SpinResp trigger
         * @property {number|null} [bet] SpinResp bet
         * @property {number|null} [balance] SpinResp balance
         * @property {number|null} [totalWin] SpinResp totalWin
         * @property {number|null} [leftTimes] SpinResp leftTimes
         * @property {boolean|null} [priseTrigger] SpinResp priseTrigger
         * @property {number|null} [rabbitWin] SpinResp rabbitWin
         * @property {boolean|null} [isWish] SpinResp isWish
         */

        /**
         * Constructs a new SpinResp.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a SpinResp.
         * @implements ISpinResp
         * @constructor
         * @param {slot_fortune_rabbit.ISpinResp=} [properties] Properties to set
         */
        function SpinResp(properties) {
            this.hits = [];
            this.screen = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SpinResp hits.
         * @member {Array.<slot_fortune_rabbit.IHit>} hits
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.hits = $util.emptyArray;

        /**
         * SpinResp screen.
         * @member {Array.<slot_fortune_rabbit.ISymbol>} screen
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.screen = $util.emptyArray;

        /**
         * SpinResp trigger.
         * @member {boolean} trigger
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.trigger = false;

        /**
         * SpinResp bet.
         * @member {number} bet
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.bet = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * SpinResp balance.
         * @member {number} balance
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.balance = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * SpinResp totalWin.
         * @member {number} totalWin
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.totalWin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * SpinResp leftTimes.
         * @member {number} leftTimes
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.leftTimes = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * SpinResp priseTrigger.
         * @member {boolean} priseTrigger
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.priseTrigger = false;

        /**
         * SpinResp rabbitWin.
         * @member {number} rabbitWin
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.rabbitWin = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * SpinResp isWish.
         * @member {boolean} isWish
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         */
        SpinResp.prototype.isWish = false;

        /**
         * Creates a new SpinResp instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {slot_fortune_rabbit.ISpinResp=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.SpinResp} SpinResp instance
         */
        SpinResp.create = function create(properties) {
            return new SpinResp(properties);
        };

        /**
         * Encodes the specified SpinResp message. Does not implicitly {@link slot_fortune_rabbit.SpinResp.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {slot_fortune_rabbit.ISpinResp} message SpinResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpinResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.hits != null && message.hits.length)
                for (var i = 0; i < message.hits.length; ++i)
                    $root.slot_fortune_rabbit.Hit.encode(message.hits[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            if (message.screen != null && message.screen.length)
                for (var i = 0; i < message.screen.length; ++i)
                    $root.slot_fortune_rabbit.Symbol.encode(message.screen[i], writer.uint32(/* id 2, wireType 2 =*/18).fork()).ldelim();
            if (message.trigger != null && Object.hasOwnProperty.call(message, "trigger"))
                writer.uint32(/* id 3, wireType 0 =*/24).bool(message.trigger);
            if (message.bet != null && Object.hasOwnProperty.call(message, "bet"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.bet);
            if (message.balance != null && Object.hasOwnProperty.call(message, "balance"))
                writer.uint32(/* id 5, wireType 0 =*/40).int64(message.balance);
            if (message.totalWin != null && Object.hasOwnProperty.call(message, "totalWin"))
                writer.uint32(/* id 6, wireType 0 =*/48).int64(message.totalWin);
            if (message.leftTimes != null && Object.hasOwnProperty.call(message, "leftTimes"))
                writer.uint32(/* id 7, wireType 0 =*/56).int64(message.leftTimes);
            if (message.priseTrigger != null && Object.hasOwnProperty.call(message, "priseTrigger"))
                writer.uint32(/* id 8, wireType 0 =*/64).bool(message.priseTrigger);
            if (message.rabbitWin != null && Object.hasOwnProperty.call(message, "rabbitWin"))
                writer.uint32(/* id 9, wireType 0 =*/72).int64(message.rabbitWin);
            if (message.isWish != null && Object.hasOwnProperty.call(message, "isWish"))
                writer.uint32(/* id 10, wireType 0 =*/80).bool(message.isWish);
            return writer;
        };

        /**
         * Encodes the specified SpinResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.SpinResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {slot_fortune_rabbit.ISpinResp} message SpinResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SpinResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SpinResp message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.SpinResp} SpinResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpinResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.SpinResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        if (!(message.hits && message.hits.length))
                            message.hits = [];
                        message.hits.push($root.slot_fortune_rabbit.Hit.decode(reader, reader.uint32()));
                        break;
                    }
                    case 2: {
                        if (!(message.screen && message.screen.length))
                            message.screen = [];
                        message.screen.push($root.slot_fortune_rabbit.Symbol.decode(reader, reader.uint32()));
                        break;
                    }
                    case 3: {
                        message.trigger = reader.bool();
                        break;
                    }
                    case 4: {
                        message.bet = reader.int64();
                        break;
                    }
                    case 5: {
                        message.balance = reader.int64();
                        break;
                    }
                    case 6: {
                        message.totalWin = reader.int64();
                        break;
                    }
                    case 7: {
                        message.leftTimes = reader.int64();
                        break;
                    }
                    case 8: {
                        message.priseTrigger = reader.bool();
                        break;
                    }
                    case 9: {
                        message.rabbitWin = reader.int64();
                        break;
                    }
                    case 10: {
                        message.isWish = reader.bool();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a SpinResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.SpinResp} SpinResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SpinResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SpinResp message.
         * @function verify
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SpinResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.hits != null && message.hasOwnProperty("hits")) {
                if (!Array.isArray(message.hits))
                    return "hits: array expected";
                for (var i = 0; i < message.hits.length; ++i) {
                    var error = $root.slot_fortune_rabbit.Hit.verify(message.hits[i]);
                    if (error)
                        return "hits." + error;
                }
            }
            if (message.screen != null && message.hasOwnProperty("screen")) {
                if (!Array.isArray(message.screen))
                    return "screen: array expected";
                for (var i = 0; i < message.screen.length; ++i) {
                    var error = $root.slot_fortune_rabbit.Symbol.verify(message.screen[i]);
                    if (error)
                        return "screen." + error;
                }
            }
            if (message.trigger != null && message.hasOwnProperty("trigger"))
                if (typeof message.trigger !== "boolean")
                    return "trigger: boolean expected";
            if (message.bet != null && message.hasOwnProperty("bet"))
                if (!$util.isInteger(message.bet) && !(message.bet && $util.isInteger(message.bet.low) && $util.isInteger(message.bet.high)))
                    return "bet: integer|Long expected";
            if (message.balance != null && message.hasOwnProperty("balance"))
                if (!$util.isInteger(message.balance) && !(message.balance && $util.isInteger(message.balance.low) && $util.isInteger(message.balance.high)))
                    return "balance: integer|Long expected";
            if (message.totalWin != null && message.hasOwnProperty("totalWin"))
                if (!$util.isInteger(message.totalWin) && !(message.totalWin && $util.isInteger(message.totalWin.low) && $util.isInteger(message.totalWin.high)))
                    return "totalWin: integer|Long expected";
            if (message.leftTimes != null && message.hasOwnProperty("leftTimes"))
                if (!$util.isInteger(message.leftTimes) && !(message.leftTimes && $util.isInteger(message.leftTimes.low) && $util.isInteger(message.leftTimes.high)))
                    return "leftTimes: integer|Long expected";
            if (message.priseTrigger != null && message.hasOwnProperty("priseTrigger"))
                if (typeof message.priseTrigger !== "boolean")
                    return "priseTrigger: boolean expected";
            if (message.rabbitWin != null && message.hasOwnProperty("rabbitWin"))
                if (!$util.isInteger(message.rabbitWin) && !(message.rabbitWin && $util.isInteger(message.rabbitWin.low) && $util.isInteger(message.rabbitWin.high)))
                    return "rabbitWin: integer|Long expected";
            if (message.isWish != null && message.hasOwnProperty("isWish"))
                if (typeof message.isWish !== "boolean")
                    return "isWish: boolean expected";
            return null;
        };

        /**
         * Creates a SpinResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.SpinResp} SpinResp
         */
        SpinResp.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.SpinResp)
                return object;
            var message = new $root.slot_fortune_rabbit.SpinResp();
            if (object.hits) {
                if (!Array.isArray(object.hits))
                    throw TypeError(".slot_fortune_rabbit.SpinResp.hits: array expected");
                message.hits = [];
                for (var i = 0; i < object.hits.length; ++i) {
                    if (typeof object.hits[i] !== "object")
                        throw TypeError(".slot_fortune_rabbit.SpinResp.hits: object expected");
                    message.hits[i] = $root.slot_fortune_rabbit.Hit.fromObject(object.hits[i]);
                }
            }
            if (object.screen) {
                if (!Array.isArray(object.screen))
                    throw TypeError(".slot_fortune_rabbit.SpinResp.screen: array expected");
                message.screen = [];
                for (var i = 0; i < object.screen.length; ++i) {
                    if (typeof object.screen[i] !== "object")
                        throw TypeError(".slot_fortune_rabbit.SpinResp.screen: object expected");
                    message.screen[i] = $root.slot_fortune_rabbit.Symbol.fromObject(object.screen[i]);
                }
            }
            if (object.trigger != null)
                message.trigger = Boolean(object.trigger);
            if (object.bet != null)
                if ($util.Long)
                    (message.bet = $util.Long.fromValue(object.bet)).unsigned = false;
                else if (typeof object.bet === "string")
                    message.bet = parseInt(object.bet, 10);
                else if (typeof object.bet === "number")
                    message.bet = object.bet;
                else if (typeof object.bet === "object")
                    message.bet = new $util.LongBits(object.bet.low >>> 0, object.bet.high >>> 0).toNumber();
            if (object.balance != null)
                if ($util.Long)
                    (message.balance = $util.Long.fromValue(object.balance)).unsigned = false;
                else if (typeof object.balance === "string")
                    message.balance = parseInt(object.balance, 10);
                else if (typeof object.balance === "number")
                    message.balance = object.balance;
                else if (typeof object.balance === "object")
                    message.balance = new $util.LongBits(object.balance.low >>> 0, object.balance.high >>> 0).toNumber();
            if (object.totalWin != null)
                if ($util.Long)
                    (message.totalWin = $util.Long.fromValue(object.totalWin)).unsigned = false;
                else if (typeof object.totalWin === "string")
                    message.totalWin = parseInt(object.totalWin, 10);
                else if (typeof object.totalWin === "number")
                    message.totalWin = object.totalWin;
                else if (typeof object.totalWin === "object")
                    message.totalWin = new $util.LongBits(object.totalWin.low >>> 0, object.totalWin.high >>> 0).toNumber();
            if (object.leftTimes != null)
                if ($util.Long)
                    (message.leftTimes = $util.Long.fromValue(object.leftTimes)).unsigned = false;
                else if (typeof object.leftTimes === "string")
                    message.leftTimes = parseInt(object.leftTimes, 10);
                else if (typeof object.leftTimes === "number")
                    message.leftTimes = object.leftTimes;
                else if (typeof object.leftTimes === "object")
                    message.leftTimes = new $util.LongBits(object.leftTimes.low >>> 0, object.leftTimes.high >>> 0).toNumber();
            if (object.priseTrigger != null)
                message.priseTrigger = Boolean(object.priseTrigger);
            if (object.rabbitWin != null)
                if ($util.Long)
                    (message.rabbitWin = $util.Long.fromValue(object.rabbitWin)).unsigned = false;
                else if (typeof object.rabbitWin === "string")
                    message.rabbitWin = parseInt(object.rabbitWin, 10);
                else if (typeof object.rabbitWin === "number")
                    message.rabbitWin = object.rabbitWin;
                else if (typeof object.rabbitWin === "object")
                    message.rabbitWin = new $util.LongBits(object.rabbitWin.low >>> 0, object.rabbitWin.high >>> 0).toNumber();
            if (object.isWish != null)
                message.isWish = Boolean(object.isWish);
            return message;
        };

        /**
         * Creates a plain object from a SpinResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {slot_fortune_rabbit.SpinResp} message SpinResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SpinResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults) {
                object.hits = [];
                object.screen = [];
            }
            if (options.defaults) {
                object.trigger = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.bet = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.bet = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.balance = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.balance = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.totalWin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.totalWin = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.leftTimes = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.leftTimes = options.longs === String ? "0" : 0;
                object.priseTrigger = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.rabbitWin = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.rabbitWin = options.longs === String ? "0" : 0;
                object.isWish = false;
            }
            if (message.hits && message.hits.length) {
                object.hits = [];
                for (var j = 0; j < message.hits.length; ++j)
                    object.hits[j] = $root.slot_fortune_rabbit.Hit.toObject(message.hits[j], options);
            }
            if (message.screen && message.screen.length) {
                object.screen = [];
                for (var j = 0; j < message.screen.length; ++j)
                    object.screen[j] = $root.slot_fortune_rabbit.Symbol.toObject(message.screen[j], options);
            }
            if (message.trigger != null && message.hasOwnProperty("trigger"))
                object.trigger = message.trigger;
            if (message.bet != null && message.hasOwnProperty("bet"))
                if (typeof message.bet === "number")
                    object.bet = options.longs === String ? String(message.bet) : message.bet;
                else
                    object.bet = options.longs === String ? $util.Long.prototype.toString.call(message.bet) : options.longs === Number ? new $util.LongBits(message.bet.low >>> 0, message.bet.high >>> 0).toNumber() : message.bet;
            if (message.balance != null && message.hasOwnProperty("balance"))
                if (typeof message.balance === "number")
                    object.balance = options.longs === String ? String(message.balance) : message.balance;
                else
                    object.balance = options.longs === String ? $util.Long.prototype.toString.call(message.balance) : options.longs === Number ? new $util.LongBits(message.balance.low >>> 0, message.balance.high >>> 0).toNumber() : message.balance;
            if (message.totalWin != null && message.hasOwnProperty("totalWin"))
                if (typeof message.totalWin === "number")
                    object.totalWin = options.longs === String ? String(message.totalWin) : message.totalWin;
                else
                    object.totalWin = options.longs === String ? $util.Long.prototype.toString.call(message.totalWin) : options.longs === Number ? new $util.LongBits(message.totalWin.low >>> 0, message.totalWin.high >>> 0).toNumber() : message.totalWin;
            if (message.leftTimes != null && message.hasOwnProperty("leftTimes"))
                if (typeof message.leftTimes === "number")
                    object.leftTimes = options.longs === String ? String(message.leftTimes) : message.leftTimes;
                else
                    object.leftTimes = options.longs === String ? $util.Long.prototype.toString.call(message.leftTimes) : options.longs === Number ? new $util.LongBits(message.leftTimes.low >>> 0, message.leftTimes.high >>> 0).toNumber() : message.leftTimes;
            if (message.priseTrigger != null && message.hasOwnProperty("priseTrigger"))
                object.priseTrigger = message.priseTrigger;
            if (message.rabbitWin != null && message.hasOwnProperty("rabbitWin"))
                if (typeof message.rabbitWin === "number")
                    object.rabbitWin = options.longs === String ? String(message.rabbitWin) : message.rabbitWin;
                else
                    object.rabbitWin = options.longs === String ? $util.Long.prototype.toString.call(message.rabbitWin) : options.longs === Number ? new $util.LongBits(message.rabbitWin.low >>> 0, message.rabbitWin.high >>> 0).toNumber() : message.rabbitWin;
            if (message.isWish != null && message.hasOwnProperty("isWish"))
                object.isWish = message.isWish;
            return object;
        };

        /**
         * Converts this SpinResp to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.SpinResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SpinResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for SpinResp
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.SpinResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        SpinResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.SpinResp";
        };

        return SpinResp;
    })();

    slot_fortune_rabbit.GameGetTableEmptyResp = (function () {

        /**
         * Properties of a GameGetTableEmptyResp.
         * @memberof slot_fortune_rabbit
         * @interface IGameGetTableEmptyResp
         */

        /**
         * Constructs a new GameGetTableEmptyResp.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameGetTableEmptyResp.
         * @implements IGameGetTableEmptyResp
         * @constructor
         * @param {slot_fortune_rabbit.IGameGetTableEmptyResp=} [properties] Properties to set
         */
        function GameGetTableEmptyResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new GameGetTableEmptyResp instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableEmptyResp=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameGetTableEmptyResp} GameGetTableEmptyResp instance
         */
        GameGetTableEmptyResp.create = function create(properties) {
            return new GameGetTableEmptyResp(properties);
        };

        /**
         * Encodes the specified GameGetTableEmptyResp message. Does not implicitly {@link slot_fortune_rabbit.GameGetTableEmptyResp.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableEmptyResp} message GameGetTableEmptyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetTableEmptyResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified GameGetTableEmptyResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetTableEmptyResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {slot_fortune_rabbit.IGameGetTableEmptyResp} message GameGetTableEmptyResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetTableEmptyResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameGetTableEmptyResp message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameGetTableEmptyResp} GameGetTableEmptyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetTableEmptyResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameGetTableEmptyResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameGetTableEmptyResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameGetTableEmptyResp} GameGetTableEmptyResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetTableEmptyResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameGetTableEmptyResp message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameGetTableEmptyResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a GameGetTableEmptyResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameGetTableEmptyResp} GameGetTableEmptyResp
         */
        GameGetTableEmptyResp.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameGetTableEmptyResp)
                return object;
            return new $root.slot_fortune_rabbit.GameGetTableEmptyResp();
        };

        /**
         * Creates a plain object from a GameGetTableEmptyResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {slot_fortune_rabbit.GameGetTableEmptyResp} message GameGetTableEmptyResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameGetTableEmptyResp.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this GameGetTableEmptyResp to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameGetTableEmptyResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameGetTableEmptyResp
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameGetTableEmptyResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameGetTableEmptyResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameGetTableEmptyResp";
        };

        return GameGetTableEmptyResp;
    })();

    slot_fortune_rabbit.GameEnterReq = (function () {

        /**
         * Properties of a GameEnterReq.
         * @memberof slot_fortune_rabbit
         * @interface IGameEnterReq
         */

        /**
         * Constructs a new GameEnterReq.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameEnterReq.
         * @implements IGameEnterReq
         * @constructor
         * @param {slot_fortune_rabbit.IGameEnterReq=} [properties] Properties to set
         */
        function GameEnterReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new GameEnterReq instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {slot_fortune_rabbit.IGameEnterReq=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameEnterReq} GameEnterReq instance
         */
        GameEnterReq.create = function create(properties) {
            return new GameEnterReq(properties);
        };

        /**
         * Encodes the specified GameEnterReq message. Does not implicitly {@link slot_fortune_rabbit.GameEnterReq.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {slot_fortune_rabbit.IGameEnterReq} message GameEnterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEnterReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified GameEnterReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameEnterReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {slot_fortune_rabbit.IGameEnterReq} message GameEnterReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEnterReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameEnterReq message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameEnterReq} GameEnterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEnterReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameEnterReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameEnterReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameEnterReq} GameEnterReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEnterReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameEnterReq message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameEnterReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a GameEnterReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameEnterReq} GameEnterReq
         */
        GameEnterReq.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameEnterReq)
                return object;
            return new $root.slot_fortune_rabbit.GameEnterReq();
        };

        /**
         * Creates a plain object from a GameEnterReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {slot_fortune_rabbit.GameEnterReq} message GameEnterReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameEnterReq.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this GameEnterReq to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameEnterReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameEnterReq
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameEnterReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameEnterReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameEnterReq";
        };

        return GameEnterReq;
    })();

    slot_fortune_rabbit.GameEnterResp = (function () {

        /**
         * Properties of a GameEnterResp.
         * @memberof slot_fortune_rabbit
         * @interface IGameEnterResp
         */

        /**
         * Constructs a new GameEnterResp.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameEnterResp.
         * @implements IGameEnterResp
         * @constructor
         * @param {slot_fortune_rabbit.IGameEnterResp=} [properties] Properties to set
         */
        function GameEnterResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new GameEnterResp instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {slot_fortune_rabbit.IGameEnterResp=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameEnterResp} GameEnterResp instance
         */
        GameEnterResp.create = function create(properties) {
            return new GameEnterResp(properties);
        };

        /**
         * Encodes the specified GameEnterResp message. Does not implicitly {@link slot_fortune_rabbit.GameEnterResp.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {slot_fortune_rabbit.IGameEnterResp} message GameEnterResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEnterResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified GameEnterResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameEnterResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {slot_fortune_rabbit.IGameEnterResp} message GameEnterResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameEnterResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameEnterResp message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameEnterResp} GameEnterResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEnterResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameEnterResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameEnterResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameEnterResp} GameEnterResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameEnterResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameEnterResp message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameEnterResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a GameEnterResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameEnterResp} GameEnterResp
         */
        GameEnterResp.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameEnterResp)
                return object;
            return new $root.slot_fortune_rabbit.GameEnterResp();
        };

        /**
         * Creates a plain object from a GameEnterResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {slot_fortune_rabbit.GameEnterResp} message GameEnterResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameEnterResp.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this GameEnterResp to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameEnterResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameEnterResp
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameEnterResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameEnterResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameEnterResp";
        };

        return GameEnterResp;
    })();

    slot_fortune_rabbit.GameSpinReq = (function () {

        /**
         * Properties of a GameSpinReq.
         * @memberof slot_fortune_rabbit
         * @interface IGameSpinReq
         * @property {number|null} [amount] GameSpinReq amount
         * @property {boolean|null} [mode] GameSpinReq mode
         * @property {number|null} [betSize] GameSpinReq betSize
         * @property {number|null} [betMultiple] GameSpinReq betMultiple
         */

        /**
         * Constructs a new GameSpinReq.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameSpinReq.
         * @implements IGameSpinReq
         * @constructor
         * @param {slot_fortune_rabbit.IGameSpinReq=} [properties] Properties to set
         */
        function GameSpinReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameSpinReq amount.
         * @member {number} amount
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @instance
         */
        GameSpinReq.prototype.amount = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * GameSpinReq mode.
         * @member {boolean} mode
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @instance
         */
        GameSpinReq.prototype.mode = false;

        /**
         * GameSpinReq betSize.
         * @member {number} betSize
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @instance
         */
        GameSpinReq.prototype.betSize = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * GameSpinReq betMultiple.
         * @member {number} betMultiple
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @instance
         */
        GameSpinReq.prototype.betMultiple = $util.Long ? $util.Long.fromBits(0, 0, false) : 0;

        /**
         * Creates a new GameSpinReq instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {slot_fortune_rabbit.IGameSpinReq=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameSpinReq} GameSpinReq instance
         */
        GameSpinReq.create = function create(properties) {
            return new GameSpinReq(properties);
        };

        /**
         * Encodes the specified GameSpinReq message. Does not implicitly {@link slot_fortune_rabbit.GameSpinReq.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {slot_fortune_rabbit.IGameSpinReq} message GameSpinReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSpinReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.amount != null && Object.hasOwnProperty.call(message, "amount"))
                writer.uint32(/* id 1, wireType 0 =*/8).int64(message.amount);
            if (message.mode != null && Object.hasOwnProperty.call(message, "mode"))
                writer.uint32(/* id 2, wireType 0 =*/16).bool(message.mode);
            if (message.betSize != null && Object.hasOwnProperty.call(message, "betSize"))
                writer.uint32(/* id 3, wireType 0 =*/24).int64(message.betSize);
            if (message.betMultiple != null && Object.hasOwnProperty.call(message, "betMultiple"))
                writer.uint32(/* id 4, wireType 0 =*/32).int64(message.betMultiple);
            return writer;
        };

        /**
         * Encodes the specified GameSpinReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameSpinReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {slot_fortune_rabbit.IGameSpinReq} message GameSpinReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameSpinReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameSpinReq message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameSpinReq} GameSpinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSpinReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameSpinReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.amount = reader.int64();
                        break;
                    }
                    case 2: {
                        message.mode = reader.bool();
                        break;
                    }
                    case 3: {
                        message.betSize = reader.int64();
                        break;
                    }
                    case 4: {
                        message.betMultiple = reader.int64();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameSpinReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameSpinReq} GameSpinReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameSpinReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameSpinReq message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameSpinReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (!$util.isInteger(message.amount) && !(message.amount && $util.isInteger(message.amount.low) && $util.isInteger(message.amount.high)))
                    return "amount: integer|Long expected";
            if (message.mode != null && message.hasOwnProperty("mode"))
                if (typeof message.mode !== "boolean")
                    return "mode: boolean expected";
            if (message.betSize != null && message.hasOwnProperty("betSize"))
                if (!$util.isInteger(message.betSize) && !(message.betSize && $util.isInteger(message.betSize.low) && $util.isInteger(message.betSize.high)))
                    return "betSize: integer|Long expected";
            if (message.betMultiple != null && message.hasOwnProperty("betMultiple"))
                if (!$util.isInteger(message.betMultiple) && !(message.betMultiple && $util.isInteger(message.betMultiple.low) && $util.isInteger(message.betMultiple.high)))
                    return "betMultiple: integer|Long expected";
            return null;
        };

        /**
         * Creates a GameSpinReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameSpinReq} GameSpinReq
         */
        GameSpinReq.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameSpinReq)
                return object;
            var message = new $root.slot_fortune_rabbit.GameSpinReq();
            if (object.amount != null)
                if ($util.Long)
                    (message.amount = $util.Long.fromValue(object.amount)).unsigned = false;
                else if (typeof object.amount === "string")
                    message.amount = parseInt(object.amount, 10);
                else if (typeof object.amount === "number")
                    message.amount = object.amount;
                else if (typeof object.amount === "object")
                    message.amount = new $util.LongBits(object.amount.low >>> 0, object.amount.high >>> 0).toNumber();
            if (object.mode != null)
                message.mode = Boolean(object.mode);
            if (object.betSize != null)
                if ($util.Long)
                    (message.betSize = $util.Long.fromValue(object.betSize)).unsigned = false;
                else if (typeof object.betSize === "string")
                    message.betSize = parseInt(object.betSize, 10);
                else if (typeof object.betSize === "number")
                    message.betSize = object.betSize;
                else if (typeof object.betSize === "object")
                    message.betSize = new $util.LongBits(object.betSize.low >>> 0, object.betSize.high >>> 0).toNumber();
            if (object.betMultiple != null)
                if ($util.Long)
                    (message.betMultiple = $util.Long.fromValue(object.betMultiple)).unsigned = false;
                else if (typeof object.betMultiple === "string")
                    message.betMultiple = parseInt(object.betMultiple, 10);
                else if (typeof object.betMultiple === "number")
                    message.betMultiple = object.betMultiple;
                else if (typeof object.betMultiple === "object")
                    message.betMultiple = new $util.LongBits(object.betMultiple.low >>> 0, object.betMultiple.high >>> 0).toNumber();
            return message;
        };

        /**
         * Creates a plain object from a GameSpinReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {slot_fortune_rabbit.GameSpinReq} message GameSpinReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameSpinReq.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.amount = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.amount = options.longs === String ? "0" : 0;
                object.mode = false;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.betSize = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.betSize = options.longs === String ? "0" : 0;
                if ($util.Long) {
                    var long = new $util.Long(0, 0, false);
                    object.betMultiple = options.longs === String ? long.toString() : options.longs === Number ? long.toNumber() : long;
                } else
                    object.betMultiple = options.longs === String ? "0" : 0;
            }
            if (message.amount != null && message.hasOwnProperty("amount"))
                if (typeof message.amount === "number")
                    object.amount = options.longs === String ? String(message.amount) : message.amount;
                else
                    object.amount = options.longs === String ? $util.Long.prototype.toString.call(message.amount) : options.longs === Number ? new $util.LongBits(message.amount.low >>> 0, message.amount.high >>> 0).toNumber() : message.amount;
            if (message.mode != null && message.hasOwnProperty("mode"))
                object.mode = message.mode;
            if (message.betSize != null && message.hasOwnProperty("betSize"))
                if (typeof message.betSize === "number")
                    object.betSize = options.longs === String ? String(message.betSize) : message.betSize;
                else
                    object.betSize = options.longs === String ? $util.Long.prototype.toString.call(message.betSize) : options.longs === Number ? new $util.LongBits(message.betSize.low >>> 0, message.betSize.high >>> 0).toNumber() : message.betSize;
            if (message.betMultiple != null && message.hasOwnProperty("betMultiple"))
                if (typeof message.betMultiple === "number")
                    object.betMultiple = options.longs === String ? String(message.betMultiple) : message.betMultiple;
                else
                    object.betMultiple = options.longs === String ? $util.Long.prototype.toString.call(message.betMultiple) : options.longs === Number ? new $util.LongBits(message.betMultiple.low >>> 0, message.betMultiple.high >>> 0).toNumber() : message.betMultiple;
            return object;
        };

        /**
         * Converts this GameSpinReq to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameSpinReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameSpinReq
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameSpinReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameSpinReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameSpinReq";
        };

        return GameSpinReq;
    })();

    slot_fortune_rabbit.GameGetConfigReq = (function () {

        /**
         * Properties of a GameGetConfigReq.
         * @memberof slot_fortune_rabbit
         * @interface IGameGetConfigReq
         */

        /**
         * Constructs a new GameGetConfigReq.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameGetConfigReq.
         * @implements IGameGetConfigReq
         * @constructor
         * @param {slot_fortune_rabbit.IGameGetConfigReq=} [properties] Properties to set
         */
        function GameGetConfigReq(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Creates a new GameGetConfigReq instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {slot_fortune_rabbit.IGameGetConfigReq=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameGetConfigReq} GameGetConfigReq instance
         */
        GameGetConfigReq.create = function create(properties) {
            return new GameGetConfigReq(properties);
        };

        /**
         * Encodes the specified GameGetConfigReq message. Does not implicitly {@link slot_fortune_rabbit.GameGetConfigReq.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {slot_fortune_rabbit.IGameGetConfigReq} message GameGetConfigReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetConfigReq.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            return writer;
        };

        /**
         * Encodes the specified GameGetConfigReq message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameGetConfigReq.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {slot_fortune_rabbit.IGameGetConfigReq} message GameGetConfigReq message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameGetConfigReq.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameGetConfigReq message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameGetConfigReq} GameGetConfigReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetConfigReq.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameGetConfigReq();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameGetConfigReq message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameGetConfigReq} GameGetConfigReq
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameGetConfigReq.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameGetConfigReq message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameGetConfigReq.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            return null;
        };

        /**
         * Creates a GameGetConfigReq message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameGetConfigReq} GameGetConfigReq
         */
        GameGetConfigReq.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameGetConfigReq)
                return object;
            return new $root.slot_fortune_rabbit.GameGetConfigReq();
        };

        /**
         * Creates a plain object from a GameGetConfigReq message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {slot_fortune_rabbit.GameGetConfigReq} message GameGetConfigReq
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameGetConfigReq.toObject = function toObject() {
            return {};
        };

        /**
         * Converts this GameGetConfigReq to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameGetConfigReq.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameGetConfigReq
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameGetConfigReq
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameGetConfigReq.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameGetConfigReq";
        };

        return GameGetConfigReq;
    })();

    slot_fortune_rabbit.GameConfigResp = (function () {

        /**
         * Properties of a GameConfigResp.
         * @memberof slot_fortune_rabbit
         * @interface IGameConfigResp
         * @property {string|null} [config] GameConfigResp config
         */

        /**
         * Constructs a new GameConfigResp.
         * @memberof slot_fortune_rabbit
         * @classdesc Represents a GameConfigResp.
         * @implements IGameConfigResp
         * @constructor
         * @param {slot_fortune_rabbit.IGameConfigResp=} [properties] Properties to set
         */
        function GameConfigResp(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * GameConfigResp config.
         * @member {string} config
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @instance
         */
        GameConfigResp.prototype.config = "";

        /**
         * Creates a new GameConfigResp instance using the specified properties.
         * @function create
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {slot_fortune_rabbit.IGameConfigResp=} [properties] Properties to set
         * @returns {slot_fortune_rabbit.GameConfigResp} GameConfigResp instance
         */
        GameConfigResp.create = function create(properties) {
            return new GameConfigResp(properties);
        };

        /**
         * Encodes the specified GameConfigResp message. Does not implicitly {@link slot_fortune_rabbit.GameConfigResp.verify|verify} messages.
         * @function encode
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {slot_fortune_rabbit.IGameConfigResp} message GameConfigResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameConfigResp.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.config != null && Object.hasOwnProperty.call(message, "config"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.config);
            return writer;
        };

        /**
         * Encodes the specified GameConfigResp message, length delimited. Does not implicitly {@link slot_fortune_rabbit.GameConfigResp.verify|verify} messages.
         * @function encodeDelimited
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {slot_fortune_rabbit.IGameConfigResp} message GameConfigResp message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        GameConfigResp.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a GameConfigResp message from the specified reader or buffer.
         * @function decode
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {slot_fortune_rabbit.GameConfigResp} GameConfigResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameConfigResp.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.slot_fortune_rabbit.GameConfigResp();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                    case 1: {
                        message.config = reader.string();
                        break;
                    }
                    default:
                        reader.skipType(tag & 7);
                        break;
                }
            }
            return message;
        };

        /**
         * Decodes a GameConfigResp message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {slot_fortune_rabbit.GameConfigResp} GameConfigResp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        GameConfigResp.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a GameConfigResp message.
         * @function verify
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        GameConfigResp.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.config != null && message.hasOwnProperty("config"))
                if (!$util.isString(message.config))
                    return "config: string expected";
            return null;
        };

        /**
         * Creates a GameConfigResp message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {slot_fortune_rabbit.GameConfigResp} GameConfigResp
         */
        GameConfigResp.fromObject = function fromObject(object) {
            if (object instanceof $root.slot_fortune_rabbit.GameConfigResp)
                return object;
            var message = new $root.slot_fortune_rabbit.GameConfigResp();
            if (object.config != null)
                message.config = String(object.config);
            return message;
        };

        /**
         * Creates a plain object from a GameConfigResp message. Also converts values to other types if specified.
         * @function toObject
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {slot_fortune_rabbit.GameConfigResp} message GameConfigResp
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        GameConfigResp.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults)
                object.config = "";
            if (message.config != null && message.hasOwnProperty("config"))
                object.config = message.config;
            return object;
        };

        /**
         * Converts this GameConfigResp to JSON.
         * @function toJSON
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        GameConfigResp.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        /**
         * Gets the default type url for GameConfigResp
         * @function getTypeUrl
         * @memberof slot_fortune_rabbit.GameConfigResp
         * @static
         * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
         * @returns {string} The default type url
         */
        GameConfigResp.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
            if (typeUrlPrefix === undefined) {
                typeUrlPrefix = "type.googleapis.com";
            }
            return typeUrlPrefix + "/slot_fortune_rabbit.GameConfigResp";
        };

        return GameConfigResp;
    })();

    return slot_fortune_rabbit;
})();

module.exports = $root;
