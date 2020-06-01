/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = protobuf;

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.qysdk = (function() {

    /**
     * Namespace qysdk.
     * @exports qysdk
     * @namespace
     */
    var qysdk = {};

    /**
     * BaseConfigIDs enum.
     * @name qysdk.BaseConfigIDs
     * @enum {number}
     * @property {number} BC_NET_ADDR=1 BC_NET_ADDR value
     * @property {number} BC_SHOT_NAME=2 BC_SHOT_NAME value
     * @property {number} BC_HTTP_ADDR_OF_SERVER=3 BC_HTTP_ADDR_OF_SERVER value
     * @property {number} BC_HTTP_ADDR_OF_PATCH_PACKAGE=4 BC_HTTP_ADDR_OF_PATCH_PACKAGE value
     * @property {number} BC_APP_VERSION=5 BC_APP_VERSION value
     * @property {number} BC_PATCH_VERSION=6 BC_PATCH_VERSION value
     * @property {number} BC_MINI_PROGRAM_ID=7 BC_MINI_PROGRAM_ID value
     * @property {number} BC_MINI_PROGRAM_APP_ID=8 BC_MINI_PROGRAM_APP_ID value
     * @property {number} BC_MINI_PROGRAM_APP_SECRET=9 BC_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_QQ_MINI_PROGRAM_APP_ID=10 BC_QQ_MINI_PROGRAM_APP_ID value
     * @property {number} BC_QQ_MINI_PROGRAM_APP_SECRET=11 BC_QQ_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_OPPO_MINI_PROGRAM_APP_ID=12 BC_OPPO_MINI_PROGRAM_APP_ID value
     * @property {number} BC_OPPO_MINI_PROGRAM_APP_SECRET=13 BC_OPPO_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_VIVO_MINI_PROGRAM_APP_ID=14 BC_VIVO_MINI_PROGRAM_APP_ID value
     * @property {number} BC_VIVO_MINI_PROGRAM_APP_SECRET=15 BC_VIVO_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_TT_MINI_PROGRAM_APP_ID=16 BC_TT_MINI_PROGRAM_APP_ID value
     * @property {number} BC_TT_MINI_PROGRAM_APP_SECRET=17 BC_TT_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_QTT_MINI_PROGRAM_APP_ID=18 BC_QTT_MINI_PROGRAM_APP_ID value
     * @property {number} BC_QTT_MINI_PROGRAM_APP_SECRET=19 BC_QTT_MINI_PROGRAM_APP_SECRET value
     * @property {number} BC_QTT_MINI_PROGRAM_APP_NAME=20 BC_QTT_MINI_PROGRAM_APP_NAME value
     * @property {number} BC_MAX_ADV_TIMES_OF_ONE_DAY=25 BC_MAX_ADV_TIMES_OF_ONE_DAY value
     * @property {number} BC_BORN_COIN_NUM=101 BC_BORN_COIN_NUM value
     */
    qysdk.BaseConfigIDs = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "BC_NET_ADDR"] = 1;
        values[valuesById[2] = "BC_SHOT_NAME"] = 2;
        values[valuesById[3] = "BC_HTTP_ADDR_OF_SERVER"] = 3;
        values[valuesById[4] = "BC_HTTP_ADDR_OF_PATCH_PACKAGE"] = 4;
        values[valuesById[5] = "BC_APP_VERSION"] = 5;
        values[valuesById[6] = "BC_PATCH_VERSION"] = 6;
        values[valuesById[7] = "BC_MINI_PROGRAM_ID"] = 7;
        values[valuesById[8] = "BC_MINI_PROGRAM_APP_ID"] = 8;
        values[valuesById[9] = "BC_MINI_PROGRAM_APP_SECRET"] = 9;
        values[valuesById[10] = "BC_QQ_MINI_PROGRAM_APP_ID"] = 10;
        values[valuesById[11] = "BC_QQ_MINI_PROGRAM_APP_SECRET"] = 11;
        values[valuesById[12] = "BC_OPPO_MINI_PROGRAM_APP_ID"] = 12;
        values[valuesById[13] = "BC_OPPO_MINI_PROGRAM_APP_SECRET"] = 13;
        values[valuesById[14] = "BC_VIVO_MINI_PROGRAM_APP_ID"] = 14;
        values[valuesById[15] = "BC_VIVO_MINI_PROGRAM_APP_SECRET"] = 15;
        values[valuesById[16] = "BC_TT_MINI_PROGRAM_APP_ID"] = 16;
        values[valuesById[17] = "BC_TT_MINI_PROGRAM_APP_SECRET"] = 17;
        values[valuesById[18] = "BC_QTT_MINI_PROGRAM_APP_ID"] = 18;
        values[valuesById[19] = "BC_QTT_MINI_PROGRAM_APP_SECRET"] = 19;
        values[valuesById[20] = "BC_QTT_MINI_PROGRAM_APP_NAME"] = 20;
        values[valuesById[25] = "BC_MAX_ADV_TIMES_OF_ONE_DAY"] = 25;
        values[valuesById[101] = "BC_BORN_COIN_NUM"] = 101;
        return values;
    })();

    qysdk.BaseConfig = (function() {

        /**
         * Properties of a BaseConfig.
         * @memberof qysdk
         * @interface IBaseConfig
         * @property {number} id BaseConfig id
         * @property {number|null} [num] BaseConfig num
         * @property {number|null} [decimal] BaseConfig decimal
         * @property {string|null} [str] BaseConfig str
         */

        /**
         * Constructs a new BaseConfig.
         * @memberof qysdk
         * @classdesc Represents a BaseConfig.
         * @implements IBaseConfig
         * @constructor
         * @param {qysdk.IBaseConfig=} [properties] Properties to set
         */
        function BaseConfig(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * BaseConfig id.
         * @member {number} id
         * @memberof qysdk.BaseConfig
         * @instance
         */
        BaseConfig.prototype.id = 0;

        /**
         * BaseConfig num.
         * @member {number} num
         * @memberof qysdk.BaseConfig
         * @instance
         */
        BaseConfig.prototype.num = 0;

        /**
         * BaseConfig decimal.
         * @member {number} decimal
         * @memberof qysdk.BaseConfig
         * @instance
         */
        BaseConfig.prototype.decimal = 0;

        /**
         * BaseConfig str.
         * @member {string} str
         * @memberof qysdk.BaseConfig
         * @instance
         */
        BaseConfig.prototype.str = "";

        /**
         * Creates a new BaseConfig instance using the specified properties.
         * @function create
         * @memberof qysdk.BaseConfig
         * @static
         * @param {qysdk.IBaseConfig=} [properties] Properties to set
         * @returns {qysdk.BaseConfig} BaseConfig instance
         */
        BaseConfig.create = function create(properties) {
            return new BaseConfig(properties);
        };

        /**
         * Encodes the specified BaseConfig message. Does not implicitly {@link qysdk.BaseConfig.verify|verify} messages.
         * @function encode
         * @memberof qysdk.BaseConfig
         * @static
         * @param {qysdk.IBaseConfig} message BaseConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseConfig.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            if (message.num != null && Object.hasOwnProperty.call(message, "num"))
                writer.uint32(/* id 2, wireType 0 =*/16).uint32(message.num);
            if (message.decimal != null && Object.hasOwnProperty.call(message, "decimal"))
                writer.uint32(/* id 3, wireType 0 =*/24).uint32(message.decimal);
            if (message.str != null && Object.hasOwnProperty.call(message, "str"))
                writer.uint32(/* id 4, wireType 2 =*/34).string(message.str);
            return writer;
        };

        /**
         * Encodes the specified BaseConfig message, length delimited. Does not implicitly {@link qysdk.BaseConfig.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.BaseConfig
         * @static
         * @param {qysdk.IBaseConfig} message BaseConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        BaseConfig.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a BaseConfig message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.BaseConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.BaseConfig} BaseConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseConfig.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.BaseConfig();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.num = reader.uint32();
                    break;
                case 3:
                    message.decimal = reader.uint32();
                    break;
                case 4:
                    message.str = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            return message;
        };

        /**
         * Decodes a BaseConfig message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.BaseConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.BaseConfig} BaseConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        BaseConfig.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a BaseConfig message.
         * @function verify
         * @memberof qysdk.BaseConfig
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        BaseConfig.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.id))
                return "id: integer expected";
            if (message.num != null && message.hasOwnProperty("num"))
                if (!$util.isInteger(message.num))
                    return "num: integer expected";
            if (message.decimal != null && message.hasOwnProperty("decimal"))
                if (!$util.isInteger(message.decimal))
                    return "decimal: integer expected";
            if (message.str != null && message.hasOwnProperty("str"))
                if (!$util.isString(message.str))
                    return "str: string expected";
            return null;
        };

        /**
         * Creates a BaseConfig message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.BaseConfig
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.BaseConfig} BaseConfig
         */
        BaseConfig.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.BaseConfig)
                return object;
            var message = new $root.qysdk.BaseConfig();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.num != null)
                message.num = object.num >>> 0;
            if (object.decimal != null)
                message.decimal = object.decimal >>> 0;
            if (object.str != null)
                message.str = String(object.str);
            return message;
        };

        /**
         * Creates a plain object from a BaseConfig message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.BaseConfig
         * @static
         * @param {qysdk.BaseConfig} message BaseConfig
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        BaseConfig.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.num = 0;
                object.decimal = 0;
                object.str = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.num != null && message.hasOwnProperty("num"))
                object.num = message.num;
            if (message.decimal != null && message.hasOwnProperty("decimal"))
                object.decimal = message.decimal;
            if (message.str != null && message.hasOwnProperty("str"))
                object.str = message.str;
            return object;
        };

        /**
         * Converts this BaseConfig to JSON.
         * @function toJSON
         * @memberof qysdk.BaseConfig
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        BaseConfig.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return BaseConfig;
    })();

    qysdk.TBBaseConfig = (function() {

        /**
         * Properties of a TBBaseConfig.
         * @memberof qysdk
         * @interface ITBBaseConfig
         * @property {Array.<qysdk.IBaseConfig>|null} [list] TBBaseConfig list
         */

        /**
         * Constructs a new TBBaseConfig.
         * @memberof qysdk
         * @classdesc Represents a TBBaseConfig.
         * @implements ITBBaseConfig
         * @constructor
         * @param {qysdk.ITBBaseConfig=} [properties] Properties to set
         */
        function TBBaseConfig(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TBBaseConfig list.
         * @member {Array.<qysdk.IBaseConfig>} list
         * @memberof qysdk.TBBaseConfig
         * @instance
         */
        TBBaseConfig.prototype.list = $util.emptyArray;

        /**
         * Creates a new TBBaseConfig instance using the specified properties.
         * @function create
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {qysdk.ITBBaseConfig=} [properties] Properties to set
         * @returns {qysdk.TBBaseConfig} TBBaseConfig instance
         */
        TBBaseConfig.create = function create(properties) {
            return new TBBaseConfig(properties);
        };

        /**
         * Encodes the specified TBBaseConfig message. Does not implicitly {@link qysdk.TBBaseConfig.verify|verify} messages.
         * @function encode
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {qysdk.ITBBaseConfig} message TBBaseConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBBaseConfig.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.qysdk.BaseConfig.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TBBaseConfig message, length delimited. Does not implicitly {@link qysdk.TBBaseConfig.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {qysdk.ITBBaseConfig} message TBBaseConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBBaseConfig.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TBBaseConfig message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.TBBaseConfig} TBBaseConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBBaseConfig.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.TBBaseConfig();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.list && message.list.length))
                        message.list = [];
                    message.list.push($root.qysdk.BaseConfig.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TBBaseConfig message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.TBBaseConfig} TBBaseConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBBaseConfig.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TBBaseConfig message.
         * @function verify
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TBBaseConfig.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!Array.isArray(message.list))
                    return "list: array expected";
                for (var i = 0; i < message.list.length; ++i) {
                    var error = $root.qysdk.BaseConfig.verify(message.list[i]);
                    if (error)
                        return "list." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TBBaseConfig message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.TBBaseConfig} TBBaseConfig
         */
        TBBaseConfig.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.TBBaseConfig)
                return object;
            var message = new $root.qysdk.TBBaseConfig();
            if (object.list) {
                if (!Array.isArray(object.list))
                    throw TypeError(".qysdk.TBBaseConfig.list: array expected");
                message.list = [];
                for (var i = 0; i < object.list.length; ++i) {
                    if (typeof object.list[i] !== "object")
                        throw TypeError(".qysdk.TBBaseConfig.list: object expected");
                    message.list[i] = $root.qysdk.BaseConfig.fromObject(object.list[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TBBaseConfig message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.TBBaseConfig
         * @static
         * @param {qysdk.TBBaseConfig} message TBBaseConfig
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TBBaseConfig.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.list = [];
            if (message.list && message.list.length) {
                object.list = [];
                for (var j = 0; j < message.list.length; ++j)
                    object.list[j] = $root.qysdk.BaseConfig.toObject(message.list[j], options);
            }
            return object;
        };

        /**
         * Converts this TBBaseConfig to JSON.
         * @function toJSON
         * @memberof qysdk.TBBaseConfig
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TBBaseConfig.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TBBaseConfig;
    })();

    /**
     * UIWordIDs enum.
     * @name qysdk.UIWordIDs
     * @enum {number}
     * @property {number} UIWORD_ID_APP_NAME=1 UIWORD_ID_APP_NAME value
     * @property {number} UIWORD_ID_SYSTEM_ERROR_TITLE=2 UIWORD_ID_SYSTEM_ERROR_TITLE value
     * @property {number} UIWORD_ID_SYSTEM_ERROR_CONTENT=3 UIWORD_ID_SYSTEM_ERROR_CONTENT value
     * @property {number} UIWORD_ID_SYSTEM_ERROR_RELOAD_GAME=4 UIWORD_ID_SYSTEM_ERROR_RELOAD_GAME value
     * @property {number} UIWORD_ID_SYSTEM_ERROR_EXIT_GAME=5 UIWORD_ID_SYSTEM_ERROR_EXIT_GAME value
     * @property {number} UIWORD_ID_QQ_PLATFORM_NAME=6 UIWORD_ID_QQ_PLATFORM_NAME value
     * @property {number} UIWORD_ID_WX_PLATFORM_NAME=7 UIWORD_ID_WX_PLATFORM_NAME value
     * @property {number} UIWORD_ID_SDK_NOT_SUPPORT_FORMAT=8 UIWORD_ID_SDK_NOT_SUPPORT_FORMAT value
     * @property {number} UIWORD_ID_NOT_FINISHED_YET=9 UIWORD_ID_NOT_FINISHED_YET value
     * @property {number} UIWORD_ID_PLAYER_BLOCKED_TITLE=10 UIWORD_ID_PLAYER_BLOCKED_TITLE value
     * @property {number} UIWORD_ID_PLAYER_BLOCKED_CONTENT=11 UIWORD_ID_PLAYER_BLOCKED_CONTENT value
     * @property {number} UIWORD_ID_VIDEO_NOT_SUPPORT=12 UIWORD_ID_VIDEO_NOT_SUPPORT value
     * @property {number} UIWORD_ID_SHARE_SUCCESS=13 UIWORD_ID_SHARE_SUCCESS value
     * @property {number} UIWORD_ID_ADV_SUCCESS=14 UIWORD_ID_ADV_SUCCESS value
     * @property {number} UIWORD_ID_ADV_FAIL=15 UIWORD_ID_ADV_FAIL value
     * @property {number} UIWORD_ID_ADV_NOT_FINISH_CONTENT=16 UIWORD_ID_ADV_NOT_FINISH_CONTENT value
     * @property {number} UIWORD_ID_ADV_NOT_FINISH_CANCEL_TEXT=17 UIWORD_ID_ADV_NOT_FINISH_CANCEL_TEXT value
     * @property {number} UIWORD_ID_ADV_NOT_FINISH_CONFIRM_TEXT=18 UIWORD_ID_ADV_NOT_FINISH_CONFIRM_TEXT value
     * @property {number} UIWORD_ID_NO_MORE_REWARD=19 UIWORD_ID_NO_MORE_REWARD value
     * @property {number} UIWORD_ID_UNIT_DAY=20 UIWORD_ID_UNIT_DAY value
     * @property {number} UIWORD_ID_UNIT_WEEK=21 UIWORD_ID_UNIT_WEEK value
     * @property {number} UIWORD_ID_UNIT_HOUR=22 UIWORD_ID_UNIT_HOUR value
     * @property {number} UIWORD_ID_UNIT_MINUTE=23 UIWORD_ID_UNIT_MINUTE value
     * @property {number} UIWORD_ID_VIDEO_NOT_READY_YET=24 UIWORD_ID_VIDEO_NOT_READY_YET value
     * @property {number} UIWORD_ID_FORMAT_OF_VIDEO_NOT_READY_YET=25 UIWORD_ID_FORMAT_OF_VIDEO_NOT_READY_YET value
     * @property {number} UIWORD_ID_INSTALL_SHORTCUT_SUCCESS=26 UIWORD_ID_INSTALL_SHORTCUT_SUCCESS value
     * @property {number} UIWORD_ID_NOT_SUPPORT_ON_IOS_PLATFORM=27 UIWORD_ID_NOT_SUPPORT_ON_IOS_PLATFORM value
     * @property {number} UIWORD_ID_SHARE_FAIL_TIPS_ONE=1001 UIWORD_ID_SHARE_FAIL_TIPS_ONE value
     * @property {number} UIWORD_ID_SHARE_FAIL_TIPS_TWO=1002 UIWORD_ID_SHARE_FAIL_TIPS_TWO value
     * @property {number} UIWORD_ID_SHARE_FAIL_TIPS_THREE=1003 UIWORD_ID_SHARE_FAIL_TIPS_THREE value
     * @property {number} UIWORD_ID_LACK_OF_COIN=101 UIWORD_ID_LACK_OF_COIN value
     */
    qysdk.UIWordIDs = (function() {
        var valuesById = {}, values = Object.create(valuesById);
        values[valuesById[1] = "UIWORD_ID_APP_NAME"] = 1;
        values[valuesById[2] = "UIWORD_ID_SYSTEM_ERROR_TITLE"] = 2;
        values[valuesById[3] = "UIWORD_ID_SYSTEM_ERROR_CONTENT"] = 3;
        values[valuesById[4] = "UIWORD_ID_SYSTEM_ERROR_RELOAD_GAME"] = 4;
        values[valuesById[5] = "UIWORD_ID_SYSTEM_ERROR_EXIT_GAME"] = 5;
        values[valuesById[6] = "UIWORD_ID_QQ_PLATFORM_NAME"] = 6;
        values[valuesById[7] = "UIWORD_ID_WX_PLATFORM_NAME"] = 7;
        values[valuesById[8] = "UIWORD_ID_SDK_NOT_SUPPORT_FORMAT"] = 8;
        values[valuesById[9] = "UIWORD_ID_NOT_FINISHED_YET"] = 9;
        values[valuesById[10] = "UIWORD_ID_PLAYER_BLOCKED_TITLE"] = 10;
        values[valuesById[11] = "UIWORD_ID_PLAYER_BLOCKED_CONTENT"] = 11;
        values[valuesById[12] = "UIWORD_ID_VIDEO_NOT_SUPPORT"] = 12;
        values[valuesById[13] = "UIWORD_ID_SHARE_SUCCESS"] = 13;
        values[valuesById[14] = "UIWORD_ID_ADV_SUCCESS"] = 14;
        values[valuesById[15] = "UIWORD_ID_ADV_FAIL"] = 15;
        values[valuesById[16] = "UIWORD_ID_ADV_NOT_FINISH_CONTENT"] = 16;
        values[valuesById[17] = "UIWORD_ID_ADV_NOT_FINISH_CANCEL_TEXT"] = 17;
        values[valuesById[18] = "UIWORD_ID_ADV_NOT_FINISH_CONFIRM_TEXT"] = 18;
        values[valuesById[19] = "UIWORD_ID_NO_MORE_REWARD"] = 19;
        values[valuesById[20] = "UIWORD_ID_UNIT_DAY"] = 20;
        values[valuesById[21] = "UIWORD_ID_UNIT_WEEK"] = 21;
        values[valuesById[22] = "UIWORD_ID_UNIT_HOUR"] = 22;
        values[valuesById[23] = "UIWORD_ID_UNIT_MINUTE"] = 23;
        values[valuesById[24] = "UIWORD_ID_VIDEO_NOT_READY_YET"] = 24;
        values[valuesById[25] = "UIWORD_ID_FORMAT_OF_VIDEO_NOT_READY_YET"] = 25;
        values[valuesById[26] = "UIWORD_ID_INSTALL_SHORTCUT_SUCCESS"] = 26;
        values[valuesById[27] = "UIWORD_ID_NOT_SUPPORT_ON_IOS_PLATFORM"] = 27;
        values[valuesById[1001] = "UIWORD_ID_SHARE_FAIL_TIPS_ONE"] = 1001;
        values[valuesById[1002] = "UIWORD_ID_SHARE_FAIL_TIPS_TWO"] = 1002;
        values[valuesById[1003] = "UIWORD_ID_SHARE_FAIL_TIPS_THREE"] = 1003;
        values[valuesById[101] = "UIWORD_ID_LACK_OF_COIN"] = 101;
        return values;
    })();

    qysdk.UIWord = (function() {

        /**
         * Properties of a UIWord.
         * @memberof qysdk
         * @interface IUIWord
         * @property {number} id UIWord id
         * @property {string} word UIWord word
         */

        /**
         * Constructs a new UIWord.
         * @memberof qysdk
         * @classdesc Represents a UIWord.
         * @implements IUIWord
         * @constructor
         * @param {qysdk.IUIWord=} [properties] Properties to set
         */
        function UIWord(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * UIWord id.
         * @member {number} id
         * @memberof qysdk.UIWord
         * @instance
         */
        UIWord.prototype.id = 0;

        /**
         * UIWord word.
         * @member {string} word
         * @memberof qysdk.UIWord
         * @instance
         */
        UIWord.prototype.word = "";

        /**
         * Creates a new UIWord instance using the specified properties.
         * @function create
         * @memberof qysdk.UIWord
         * @static
         * @param {qysdk.IUIWord=} [properties] Properties to set
         * @returns {qysdk.UIWord} UIWord instance
         */
        UIWord.create = function create(properties) {
            return new UIWord(properties);
        };

        /**
         * Encodes the specified UIWord message. Does not implicitly {@link qysdk.UIWord.verify|verify} messages.
         * @function encode
         * @memberof qysdk.UIWord
         * @static
         * @param {qysdk.IUIWord} message UIWord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UIWord.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.word);
            return writer;
        };

        /**
         * Encodes the specified UIWord message, length delimited. Does not implicitly {@link qysdk.UIWord.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.UIWord
         * @static
         * @param {qysdk.IUIWord} message UIWord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        UIWord.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a UIWord message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.UIWord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.UIWord} UIWord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UIWord.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.UIWord();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.word = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("word"))
                throw $util.ProtocolError("missing required 'word'", { instance: message });
            return message;
        };

        /**
         * Decodes a UIWord message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.UIWord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.UIWord} UIWord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        UIWord.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a UIWord message.
         * @function verify
         * @memberof qysdk.UIWord
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        UIWord.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.id))
                return "id: integer expected";
            if (!$util.isString(message.word))
                return "word: string expected";
            return null;
        };

        /**
         * Creates a UIWord message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.UIWord
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.UIWord} UIWord
         */
        UIWord.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.UIWord)
                return object;
            var message = new $root.qysdk.UIWord();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.word != null)
                message.word = String(object.word);
            return message;
        };

        /**
         * Creates a plain object from a UIWord message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.UIWord
         * @static
         * @param {qysdk.UIWord} message UIWord
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        UIWord.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.word = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.word != null && message.hasOwnProperty("word"))
                object.word = message.word;
            return object;
        };

        /**
         * Converts this UIWord to JSON.
         * @function toJSON
         * @memberof qysdk.UIWord
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        UIWord.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return UIWord;
    })();

    qysdk.TBUIWord = (function() {

        /**
         * Properties of a TBUIWord.
         * @memberof qysdk
         * @interface ITBUIWord
         * @property {Array.<qysdk.IUIWord>|null} [list] TBUIWord list
         */

        /**
         * Constructs a new TBUIWord.
         * @memberof qysdk
         * @classdesc Represents a TBUIWord.
         * @implements ITBUIWord
         * @constructor
         * @param {qysdk.ITBUIWord=} [properties] Properties to set
         */
        function TBUIWord(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TBUIWord list.
         * @member {Array.<qysdk.IUIWord>} list
         * @memberof qysdk.TBUIWord
         * @instance
         */
        TBUIWord.prototype.list = $util.emptyArray;

        /**
         * Creates a new TBUIWord instance using the specified properties.
         * @function create
         * @memberof qysdk.TBUIWord
         * @static
         * @param {qysdk.ITBUIWord=} [properties] Properties to set
         * @returns {qysdk.TBUIWord} TBUIWord instance
         */
        TBUIWord.create = function create(properties) {
            return new TBUIWord(properties);
        };

        /**
         * Encodes the specified TBUIWord message. Does not implicitly {@link qysdk.TBUIWord.verify|verify} messages.
         * @function encode
         * @memberof qysdk.TBUIWord
         * @static
         * @param {qysdk.ITBUIWord} message TBUIWord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBUIWord.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.qysdk.UIWord.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TBUIWord message, length delimited. Does not implicitly {@link qysdk.TBUIWord.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.TBUIWord
         * @static
         * @param {qysdk.ITBUIWord} message TBUIWord message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBUIWord.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TBUIWord message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.TBUIWord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.TBUIWord} TBUIWord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBUIWord.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.TBUIWord();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.list && message.list.length))
                        message.list = [];
                    message.list.push($root.qysdk.UIWord.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TBUIWord message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.TBUIWord
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.TBUIWord} TBUIWord
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBUIWord.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TBUIWord message.
         * @function verify
         * @memberof qysdk.TBUIWord
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TBUIWord.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!Array.isArray(message.list))
                    return "list: array expected";
                for (var i = 0; i < message.list.length; ++i) {
                    var error = $root.qysdk.UIWord.verify(message.list[i]);
                    if (error)
                        return "list." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TBUIWord message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.TBUIWord
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.TBUIWord} TBUIWord
         */
        TBUIWord.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.TBUIWord)
                return object;
            var message = new $root.qysdk.TBUIWord();
            if (object.list) {
                if (!Array.isArray(object.list))
                    throw TypeError(".qysdk.TBUIWord.list: array expected");
                message.list = [];
                for (var i = 0; i < object.list.length; ++i) {
                    if (typeof object.list[i] !== "object")
                        throw TypeError(".qysdk.TBUIWord.list: object expected");
                    message.list[i] = $root.qysdk.UIWord.fromObject(object.list[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TBUIWord message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.TBUIWord
         * @static
         * @param {qysdk.TBUIWord} message TBUIWord
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TBUIWord.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.list = [];
            if (message.list && message.list.length) {
                object.list = [];
                for (var j = 0; j < message.list.length; ++j)
                    object.list[j] = $root.qysdk.UIWord.toObject(message.list[j], options);
            }
            return object;
        };

        /**
         * Converts this TBUIWord to JSON.
         * @function toJSON
         * @memberof qysdk.TBUIWord
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TBUIWord.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TBUIWord;
    })();

    qysdk.NetError = (function() {

        /**
         * Properties of a NetError.
         * @memberof qysdk
         * @interface INetError
         * @property {number} id NetError id
         * @property {string} word NetError word
         */

        /**
         * Constructs a new NetError.
         * @memberof qysdk
         * @classdesc Represents a NetError.
         * @implements INetError
         * @constructor
         * @param {qysdk.INetError=} [properties] Properties to set
         */
        function NetError(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * NetError id.
         * @member {number} id
         * @memberof qysdk.NetError
         * @instance
         */
        NetError.prototype.id = 0;

        /**
         * NetError word.
         * @member {string} word
         * @memberof qysdk.NetError
         * @instance
         */
        NetError.prototype.word = "";

        /**
         * Creates a new NetError instance using the specified properties.
         * @function create
         * @memberof qysdk.NetError
         * @static
         * @param {qysdk.INetError=} [properties] Properties to set
         * @returns {qysdk.NetError} NetError instance
         */
        NetError.create = function create(properties) {
            return new NetError(properties);
        };

        /**
         * Encodes the specified NetError message. Does not implicitly {@link qysdk.NetError.verify|verify} messages.
         * @function encode
         * @memberof qysdk.NetError
         * @static
         * @param {qysdk.INetError} message NetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetError.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).uint32(message.id);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.word);
            return writer;
        };

        /**
         * Encodes the specified NetError message, length delimited. Does not implicitly {@link qysdk.NetError.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.NetError
         * @static
         * @param {qysdk.INetError} message NetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        NetError.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a NetError message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.NetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.NetError} NetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetError.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.NetError();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.id = reader.uint32();
                    break;
                case 2:
                    message.word = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("id"))
                throw $util.ProtocolError("missing required 'id'", { instance: message });
            if (!message.hasOwnProperty("word"))
                throw $util.ProtocolError("missing required 'word'", { instance: message });
            return message;
        };

        /**
         * Decodes a NetError message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.NetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.NetError} NetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        NetError.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a NetError message.
         * @function verify
         * @memberof qysdk.NetError
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        NetError.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isInteger(message.id))
                return "id: integer expected";
            if (!$util.isString(message.word))
                return "word: string expected";
            return null;
        };

        /**
         * Creates a NetError message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.NetError
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.NetError} NetError
         */
        NetError.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.NetError)
                return object;
            var message = new $root.qysdk.NetError();
            if (object.id != null)
                message.id = object.id >>> 0;
            if (object.word != null)
                message.word = String(object.word);
            return message;
        };

        /**
         * Creates a plain object from a NetError message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.NetError
         * @static
         * @param {qysdk.NetError} message NetError
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        NetError.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.id = 0;
                object.word = "";
            }
            if (message.id != null && message.hasOwnProperty("id"))
                object.id = message.id;
            if (message.word != null && message.hasOwnProperty("word"))
                object.word = message.word;
            return object;
        };

        /**
         * Converts this NetError to JSON.
         * @function toJSON
         * @memberof qysdk.NetError
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        NetError.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return NetError;
    })();

    qysdk.TBNetError = (function() {

        /**
         * Properties of a TBNetError.
         * @memberof qysdk
         * @interface ITBNetError
         * @property {Array.<qysdk.INetError>|null} [list] TBNetError list
         */

        /**
         * Constructs a new TBNetError.
         * @memberof qysdk
         * @classdesc Represents a TBNetError.
         * @implements ITBNetError
         * @constructor
         * @param {qysdk.ITBNetError=} [properties] Properties to set
         */
        function TBNetError(properties) {
            this.list = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * TBNetError list.
         * @member {Array.<qysdk.INetError>} list
         * @memberof qysdk.TBNetError
         * @instance
         */
        TBNetError.prototype.list = $util.emptyArray;

        /**
         * Creates a new TBNetError instance using the specified properties.
         * @function create
         * @memberof qysdk.TBNetError
         * @static
         * @param {qysdk.ITBNetError=} [properties] Properties to set
         * @returns {qysdk.TBNetError} TBNetError instance
         */
        TBNetError.create = function create(properties) {
            return new TBNetError(properties);
        };

        /**
         * Encodes the specified TBNetError message. Does not implicitly {@link qysdk.TBNetError.verify|verify} messages.
         * @function encode
         * @memberof qysdk.TBNetError
         * @static
         * @param {qysdk.ITBNetError} message TBNetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBNetError.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.list != null && message.list.length)
                for (var i = 0; i < message.list.length; ++i)
                    $root.qysdk.NetError.encode(message.list[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified TBNetError message, length delimited. Does not implicitly {@link qysdk.TBNetError.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.TBNetError
         * @static
         * @param {qysdk.ITBNetError} message TBNetError message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        TBNetError.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a TBNetError message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.TBNetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.TBNetError} TBNetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBNetError.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.TBNetError();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.list && message.list.length))
                        message.list = [];
                    message.list.push($root.qysdk.NetError.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a TBNetError message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.TBNetError
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.TBNetError} TBNetError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        TBNetError.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a TBNetError message.
         * @function verify
         * @memberof qysdk.TBNetError
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        TBNetError.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.list != null && message.hasOwnProperty("list")) {
                if (!Array.isArray(message.list))
                    return "list: array expected";
                for (var i = 0; i < message.list.length; ++i) {
                    var error = $root.qysdk.NetError.verify(message.list[i]);
                    if (error)
                        return "list." + error;
                }
            }
            return null;
        };

        /**
         * Creates a TBNetError message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.TBNetError
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.TBNetError} TBNetError
         */
        TBNetError.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.TBNetError)
                return object;
            var message = new $root.qysdk.TBNetError();
            if (object.list) {
                if (!Array.isArray(object.list))
                    throw TypeError(".qysdk.TBNetError.list: array expected");
                message.list = [];
                for (var i = 0; i < object.list.length; ++i) {
                    if (typeof object.list[i] !== "object")
                        throw TypeError(".qysdk.TBNetError.list: object expected");
                    message.list[i] = $root.qysdk.NetError.fromObject(object.list[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a TBNetError message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.TBNetError
         * @static
         * @param {qysdk.TBNetError} message TBNetError
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        TBNetError.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.list = [];
            if (message.list && message.list.length) {
                object.list = [];
                for (var j = 0; j < message.list.length; ++j)
                    object.list[j] = $root.qysdk.NetError.toObject(message.list[j], options);
            }
            return object;
        };

        /**
         * Converts this TBNetError to JSON.
         * @function toJSON
         * @memberof qysdk.TBNetError
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        TBNetError.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return TBNetError;
    })();

    qysdk.SettingConfig = (function() {

        /**
         * Properties of a SettingConfig.
         * @memberof qysdk
         * @interface ISettingConfig
         * @property {boolean} isSoundOn SettingConfig isSoundOn
         * @property {boolean} isMuteOn SettingConfig isMuteOn
         */

        /**
         * Constructs a new SettingConfig.
         * @memberof qysdk
         * @classdesc Represents a SettingConfig.
         * @implements ISettingConfig
         * @constructor
         * @param {qysdk.ISettingConfig=} [properties] Properties to set
         */
        function SettingConfig(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * SettingConfig isSoundOn.
         * @member {boolean} isSoundOn
         * @memberof qysdk.SettingConfig
         * @instance
         */
        SettingConfig.prototype.isSoundOn = false;

        /**
         * SettingConfig isMuteOn.
         * @member {boolean} isMuteOn
         * @memberof qysdk.SettingConfig
         * @instance
         */
        SettingConfig.prototype.isMuteOn = false;

        /**
         * Creates a new SettingConfig instance using the specified properties.
         * @function create
         * @memberof qysdk.SettingConfig
         * @static
         * @param {qysdk.ISettingConfig=} [properties] Properties to set
         * @returns {qysdk.SettingConfig} SettingConfig instance
         */
        SettingConfig.create = function create(properties) {
            return new SettingConfig(properties);
        };

        /**
         * Encodes the specified SettingConfig message. Does not implicitly {@link qysdk.SettingConfig.verify|verify} messages.
         * @function encode
         * @memberof qysdk.SettingConfig
         * @static
         * @param {qysdk.ISettingConfig} message SettingConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SettingConfig.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 0 =*/8).bool(message.isSoundOn);
            writer.uint32(/* id 2, wireType 0 =*/16).bool(message.isMuteOn);
            return writer;
        };

        /**
         * Encodes the specified SettingConfig message, length delimited. Does not implicitly {@link qysdk.SettingConfig.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.SettingConfig
         * @static
         * @param {qysdk.ISettingConfig} message SettingConfig message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        SettingConfig.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a SettingConfig message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.SettingConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.SettingConfig} SettingConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SettingConfig.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.SettingConfig();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.isSoundOn = reader.bool();
                    break;
                case 2:
                    message.isMuteOn = reader.bool();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("isSoundOn"))
                throw $util.ProtocolError("missing required 'isSoundOn'", { instance: message });
            if (!message.hasOwnProperty("isMuteOn"))
                throw $util.ProtocolError("missing required 'isMuteOn'", { instance: message });
            return message;
        };

        /**
         * Decodes a SettingConfig message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.SettingConfig
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.SettingConfig} SettingConfig
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        SettingConfig.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a SettingConfig message.
         * @function verify
         * @memberof qysdk.SettingConfig
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        SettingConfig.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (typeof message.isSoundOn !== "boolean")
                return "isSoundOn: boolean expected";
            if (typeof message.isMuteOn !== "boolean")
                return "isMuteOn: boolean expected";
            return null;
        };

        /**
         * Creates a SettingConfig message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.SettingConfig
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.SettingConfig} SettingConfig
         */
        SettingConfig.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.SettingConfig)
                return object;
            var message = new $root.qysdk.SettingConfig();
            if (object.isSoundOn != null)
                message.isSoundOn = Boolean(object.isSoundOn);
            if (object.isMuteOn != null)
                message.isMuteOn = Boolean(object.isMuteOn);
            return message;
        };

        /**
         * Creates a plain object from a SettingConfig message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.SettingConfig
         * @static
         * @param {qysdk.SettingConfig} message SettingConfig
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        SettingConfig.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.isSoundOn = false;
                object.isMuteOn = false;
            }
            if (message.isSoundOn != null && message.hasOwnProperty("isSoundOn"))
                object.isSoundOn = message.isSoundOn;
            if (message.isMuteOn != null && message.hasOwnProperty("isMuteOn"))
                object.isMuteOn = message.isMuteOn;
            return object;
        };

        /**
         * Converts this SettingConfig to JSON.
         * @function toJSON
         * @memberof qysdk.SettingConfig
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        SettingConfig.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return SettingConfig;
    })();

    qysdk.PlayerInfo = (function() {

        /**
         * Properties of a PlayerInfo.
         * @memberof qysdk
         * @interface IPlayerInfo
         * @property {string} openID PlayerInfo openID
         * @property {string} sessID PlayerInfo sessID
         * @property {string} userID PlayerInfo userID
         * @property {number} lastSaveTime PlayerInfo lastSaveTime
         * @property {string} nickname PlayerInfo nickname
         * @property {number} sex PlayerInfo sex
         * @property {string} headUrl PlayerInfo headUrl
         * @property {number} shareTimesOfToday PlayerInfo shareTimesOfToday
         * @property {number} recordDayOfShareTimes PlayerInfo recordDayOfShareTimes
         * @property {number} advTimesOfToday PlayerInfo advTimesOfToday
         * @property {number} recordDayOfAdvTimes PlayerInfo recordDayOfAdvTimes
         * @property {qysdk.ISettingConfig} setting PlayerInfo setting
         * @property {string} coin PlayerInfo coin
         * @property {string} totalCoin PlayerInfo totalCoin
         */

        /**
         * Constructs a new PlayerInfo.
         * @memberof qysdk
         * @classdesc Represents a PlayerInfo.
         * @implements IPlayerInfo
         * @constructor
         * @param {qysdk.IPlayerInfo=} [properties] Properties to set
         */
        function PlayerInfo(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * PlayerInfo openID.
         * @member {string} openID
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.openID = "";

        /**
         * PlayerInfo sessID.
         * @member {string} sessID
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.sessID = "";

        /**
         * PlayerInfo userID.
         * @member {string} userID
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.userID = "";

        /**
         * PlayerInfo lastSaveTime.
         * @member {number} lastSaveTime
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.lastSaveTime = 0;

        /**
         * PlayerInfo nickname.
         * @member {string} nickname
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.nickname = "";

        /**
         * PlayerInfo sex.
         * @member {number} sex
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.sex = 0;

        /**
         * PlayerInfo headUrl.
         * @member {string} headUrl
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.headUrl = "";

        /**
         * PlayerInfo shareTimesOfToday.
         * @member {number} shareTimesOfToday
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.shareTimesOfToday = 0;

        /**
         * PlayerInfo recordDayOfShareTimes.
         * @member {number} recordDayOfShareTimes
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.recordDayOfShareTimes = 0;

        /**
         * PlayerInfo advTimesOfToday.
         * @member {number} advTimesOfToday
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.advTimesOfToday = 0;

        /**
         * PlayerInfo recordDayOfAdvTimes.
         * @member {number} recordDayOfAdvTimes
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.recordDayOfAdvTimes = 0;

        /**
         * PlayerInfo setting.
         * @member {qysdk.ISettingConfig} setting
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.setting = null;

        /**
         * PlayerInfo coin.
         * @member {string} coin
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.coin = "";

        /**
         * PlayerInfo totalCoin.
         * @member {string} totalCoin
         * @memberof qysdk.PlayerInfo
         * @instance
         */
        PlayerInfo.prototype.totalCoin = "";

        /**
         * Creates a new PlayerInfo instance using the specified properties.
         * @function create
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {qysdk.IPlayerInfo=} [properties] Properties to set
         * @returns {qysdk.PlayerInfo} PlayerInfo instance
         */
        PlayerInfo.create = function create(properties) {
            return new PlayerInfo(properties);
        };

        /**
         * Encodes the specified PlayerInfo message. Does not implicitly {@link qysdk.PlayerInfo.verify|verify} messages.
         * @function encode
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {qysdk.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            writer.uint32(/* id 1, wireType 2 =*/10).string(message.openID);
            writer.uint32(/* id 2, wireType 2 =*/18).string(message.sessID);
            writer.uint32(/* id 3, wireType 2 =*/26).string(message.userID);
            writer.uint32(/* id 4, wireType 0 =*/32).uint32(message.lastSaveTime);
            writer.uint32(/* id 5, wireType 2 =*/42).string(message.nickname);
            writer.uint32(/* id 6, wireType 0 =*/48).uint32(message.sex);
            writer.uint32(/* id 7, wireType 2 =*/58).string(message.headUrl);
            writer.uint32(/* id 8, wireType 0 =*/64).uint32(message.shareTimesOfToday);
            writer.uint32(/* id 9, wireType 0 =*/72).uint32(message.recordDayOfShareTimes);
            writer.uint32(/* id 10, wireType 0 =*/80).uint32(message.advTimesOfToday);
            writer.uint32(/* id 11, wireType 0 =*/88).uint32(message.recordDayOfAdvTimes);
            $root.qysdk.SettingConfig.encode(message.setting, writer.uint32(/* id 12, wireType 2 =*/98).fork()).ldelim();
            writer.uint32(/* id 13, wireType 2 =*/106).string(message.coin);
            writer.uint32(/* id 14, wireType 2 =*/114).string(message.totalCoin);
            return writer;
        };

        /**
         * Encodes the specified PlayerInfo message, length delimited. Does not implicitly {@link qysdk.PlayerInfo.verify|verify} messages.
         * @function encodeDelimited
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {qysdk.IPlayerInfo} message PlayerInfo message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        PlayerInfo.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer.
         * @function decode
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {qysdk.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.qysdk.PlayerInfo();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.openID = reader.string();
                    break;
                case 2:
                    message.sessID = reader.string();
                    break;
                case 3:
                    message.userID = reader.string();
                    break;
                case 4:
                    message.lastSaveTime = reader.uint32();
                    break;
                case 5:
                    message.nickname = reader.string();
                    break;
                case 6:
                    message.sex = reader.uint32();
                    break;
                case 7:
                    message.headUrl = reader.string();
                    break;
                case 8:
                    message.shareTimesOfToday = reader.uint32();
                    break;
                case 9:
                    message.recordDayOfShareTimes = reader.uint32();
                    break;
                case 10:
                    message.advTimesOfToday = reader.uint32();
                    break;
                case 11:
                    message.recordDayOfAdvTimes = reader.uint32();
                    break;
                case 12:
                    message.setting = $root.qysdk.SettingConfig.decode(reader, reader.uint32());
                    break;
                case 13:
                    message.coin = reader.string();
                    break;
                case 14:
                    message.totalCoin = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            if (!message.hasOwnProperty("openID"))
                throw $util.ProtocolError("missing required 'openID'", { instance: message });
            if (!message.hasOwnProperty("sessID"))
                throw $util.ProtocolError("missing required 'sessID'", { instance: message });
            if (!message.hasOwnProperty("userID"))
                throw $util.ProtocolError("missing required 'userID'", { instance: message });
            if (!message.hasOwnProperty("lastSaveTime"))
                throw $util.ProtocolError("missing required 'lastSaveTime'", { instance: message });
            if (!message.hasOwnProperty("nickname"))
                throw $util.ProtocolError("missing required 'nickname'", { instance: message });
            if (!message.hasOwnProperty("sex"))
                throw $util.ProtocolError("missing required 'sex'", { instance: message });
            if (!message.hasOwnProperty("headUrl"))
                throw $util.ProtocolError("missing required 'headUrl'", { instance: message });
            if (!message.hasOwnProperty("shareTimesOfToday"))
                throw $util.ProtocolError("missing required 'shareTimesOfToday'", { instance: message });
            if (!message.hasOwnProperty("recordDayOfShareTimes"))
                throw $util.ProtocolError("missing required 'recordDayOfShareTimes'", { instance: message });
            if (!message.hasOwnProperty("advTimesOfToday"))
                throw $util.ProtocolError("missing required 'advTimesOfToday'", { instance: message });
            if (!message.hasOwnProperty("recordDayOfAdvTimes"))
                throw $util.ProtocolError("missing required 'recordDayOfAdvTimes'", { instance: message });
            if (!message.hasOwnProperty("setting"))
                throw $util.ProtocolError("missing required 'setting'", { instance: message });
            if (!message.hasOwnProperty("coin"))
                throw $util.ProtocolError("missing required 'coin'", { instance: message });
            if (!message.hasOwnProperty("totalCoin"))
                throw $util.ProtocolError("missing required 'totalCoin'", { instance: message });
            return message;
        };

        /**
         * Decodes a PlayerInfo message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {qysdk.PlayerInfo} PlayerInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        PlayerInfo.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a PlayerInfo message.
         * @function verify
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        PlayerInfo.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (!$util.isString(message.openID))
                return "openID: string expected";
            if (!$util.isString(message.sessID))
                return "sessID: string expected";
            if (!$util.isString(message.userID))
                return "userID: string expected";
            if (!$util.isInteger(message.lastSaveTime))
                return "lastSaveTime: integer expected";
            if (!$util.isString(message.nickname))
                return "nickname: string expected";
            if (!$util.isInteger(message.sex))
                return "sex: integer expected";
            if (!$util.isString(message.headUrl))
                return "headUrl: string expected";
            if (!$util.isInteger(message.shareTimesOfToday))
                return "shareTimesOfToday: integer expected";
            if (!$util.isInteger(message.recordDayOfShareTimes))
                return "recordDayOfShareTimes: integer expected";
            if (!$util.isInteger(message.advTimesOfToday))
                return "advTimesOfToday: integer expected";
            if (!$util.isInteger(message.recordDayOfAdvTimes))
                return "recordDayOfAdvTimes: integer expected";
            {
                var error = $root.qysdk.SettingConfig.verify(message.setting);
                if (error)
                    return "setting." + error;
            }
            if (!$util.isString(message.coin))
                return "coin: string expected";
            if (!$util.isString(message.totalCoin))
                return "totalCoin: string expected";
            return null;
        };

        /**
         * Creates a PlayerInfo message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {qysdk.PlayerInfo} PlayerInfo
         */
        PlayerInfo.fromObject = function fromObject(object) {
            if (object instanceof $root.qysdk.PlayerInfo)
                return object;
            var message = new $root.qysdk.PlayerInfo();
            if (object.openID != null)
                message.openID = String(object.openID);
            if (object.sessID != null)
                message.sessID = String(object.sessID);
            if (object.userID != null)
                message.userID = String(object.userID);
            if (object.lastSaveTime != null)
                message.lastSaveTime = object.lastSaveTime >>> 0;
            if (object.nickname != null)
                message.nickname = String(object.nickname);
            if (object.sex != null)
                message.sex = object.sex >>> 0;
            if (object.headUrl != null)
                message.headUrl = String(object.headUrl);
            if (object.shareTimesOfToday != null)
                message.shareTimesOfToday = object.shareTimesOfToday >>> 0;
            if (object.recordDayOfShareTimes != null)
                message.recordDayOfShareTimes = object.recordDayOfShareTimes >>> 0;
            if (object.advTimesOfToday != null)
                message.advTimesOfToday = object.advTimesOfToday >>> 0;
            if (object.recordDayOfAdvTimes != null)
                message.recordDayOfAdvTimes = object.recordDayOfAdvTimes >>> 0;
            if (object.setting != null) {
                if (typeof object.setting !== "object")
                    throw TypeError(".qysdk.PlayerInfo.setting: object expected");
                message.setting = $root.qysdk.SettingConfig.fromObject(object.setting);
            }
            if (object.coin != null)
                message.coin = String(object.coin);
            if (object.totalCoin != null)
                message.totalCoin = String(object.totalCoin);
            return message;
        };

        /**
         * Creates a plain object from a PlayerInfo message. Also converts values to other types if specified.
         * @function toObject
         * @memberof qysdk.PlayerInfo
         * @static
         * @param {qysdk.PlayerInfo} message PlayerInfo
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        PlayerInfo.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.openID = "";
                object.sessID = "";
                object.userID = "";
                object.lastSaveTime = 0;
                object.nickname = "";
                object.sex = 0;
                object.headUrl = "";
                object.shareTimesOfToday = 0;
                object.recordDayOfShareTimes = 0;
                object.advTimesOfToday = 0;
                object.recordDayOfAdvTimes = 0;
                object.setting = null;
                object.coin = "";
                object.totalCoin = "";
            }
            if (message.openID != null && message.hasOwnProperty("openID"))
                object.openID = message.openID;
            if (message.sessID != null && message.hasOwnProperty("sessID"))
                object.sessID = message.sessID;
            if (message.userID != null && message.hasOwnProperty("userID"))
                object.userID = message.userID;
            if (message.lastSaveTime != null && message.hasOwnProperty("lastSaveTime"))
                object.lastSaveTime = message.lastSaveTime;
            if (message.nickname != null && message.hasOwnProperty("nickname"))
                object.nickname = message.nickname;
            if (message.sex != null && message.hasOwnProperty("sex"))
                object.sex = message.sex;
            if (message.headUrl != null && message.hasOwnProperty("headUrl"))
                object.headUrl = message.headUrl;
            if (message.shareTimesOfToday != null && message.hasOwnProperty("shareTimesOfToday"))
                object.shareTimesOfToday = message.shareTimesOfToday;
            if (message.recordDayOfShareTimes != null && message.hasOwnProperty("recordDayOfShareTimes"))
                object.recordDayOfShareTimes = message.recordDayOfShareTimes;
            if (message.advTimesOfToday != null && message.hasOwnProperty("advTimesOfToday"))
                object.advTimesOfToday = message.advTimesOfToday;
            if (message.recordDayOfAdvTimes != null && message.hasOwnProperty("recordDayOfAdvTimes"))
                object.recordDayOfAdvTimes = message.recordDayOfAdvTimes;
            if (message.setting != null && message.hasOwnProperty("setting"))
                object.setting = $root.qysdk.SettingConfig.toObject(message.setting, options);
            if (message.coin != null && message.hasOwnProperty("coin"))
                object.coin = message.coin;
            if (message.totalCoin != null && message.hasOwnProperty("totalCoin"))
                object.totalCoin = message.totalCoin;
            return object;
        };

        /**
         * Converts this PlayerInfo to JSON.
         * @function toJSON
         * @memberof qysdk.PlayerInfo
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        PlayerInfo.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return PlayerInfo;
    })();

    return qysdk;
})();

var qysdk = $root.qysdk;
export {qysdk as default};