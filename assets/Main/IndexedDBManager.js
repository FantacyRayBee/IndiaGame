/**
 * Cocos Creator 2.4 IndexedDB 管理器
 * 提供简单的键值对读写功能
 *
 * 使用说明:
 * 1. 导入模块: const IndexedDBManager = require('IndexedDBManager');
 * 2. 初始化: IndexedDBManager.init({dbName: 'MyGameDB', version: 1, storeName: 'gameData'});
 * 3. 写入: 
 *    - Promise 方式: IndexedDBManager.set('playerName', 'xiaowei').then(...);
 *    - Async/Await 方式: await IndexedDBManager.set('playerName', 'xiaowei');
 *    - 回调方式: IndexedDBManager.set('playerName', 'xiaowei', (err) => {...});
 * 4. 读取: 
 *    - Promise 方式: IndexedDBManager.get('playerName').then(value => { ... });
 *    - Async/Await 方式: const value = await IndexedDBManager.get('playerName');
 *    - 回调方式: IndexedDBManager.get('playerName', (err, value) => {...});
 */

cc.Class({
    extends: cc.Component,

    statics: {
        _db: null,
        _dbName: 'DefaultDB',
        _version: 1,
        _storeName: 'defaultStore',
        _isInitialized: false,
        _initPromise: null,

        /**
         * 初始化 IndexedDB 管理器
         * @param {Object} options - 配置选项
         * @param {string} [options.dbName='DefaultDB'] - 数据库名称
         * @param {number} [options.version=1] - 数据库版本
         * @param {string} [options.storeName='defaultStore'] - 对象仓库名称
         * @param {Function} [callback] - 回调函数 (可选)
         * @returns {Promise<void>} 初始化完成的 Promise
         */
        init: function(options = {}, callback) {
            this._dbName = options.dbName || this._dbName;
            this._version = options.version || this._version;
            this._storeName = options.storeName || this._storeName;

            if (this._isInitialized && this._db) {
                cc.log("[IndexedDBManager] Already initialized.");
                if (callback) callback(null);
                return Promise.resolve();
            }

            // 如果已经在初始化中，则返回初始化的 Promise
            if (this._initPromise) {
                if (callback) {
                    this._initPromise.then(() => callback(null)).catch(callback);
                }
                return this._initPromise;
            }

            // 开始初始化过程
            this._initPromise = this._openDatabase()
                .then(db => {
                    this._db = db;
                    this._isInitialized = true;
                    cc.log(`[IndexedDBManager] Initialized with DB: ${this._dbName}, Store: ${this._storeName}`);
                    if (callback) callback(null);
                })
                .catch(err => {
                    cc.error("[IndexedDBManager] Initialization failed:", err);
                    this._initPromise = null; // 重置初始化状态，允许重试
                    if (callback) callback(err);
                    throw err; // Re-throw to allow caller to handle
                });
                
            return this._initPromise;
        },

        /**
         * 内部方法：打开或创建数据库
         * @private
         * @returns {Promise<IDBDatabase>}
         */
        _openDatabase: function() {
            return new Promise((resolve, reject) => {
                if (!window.indexedDB) {
                    const errMsg = "IndexedDB is not supported in this browser/environment.";
                    cc.error(`[IndexedDBManager] ${errMsg}`);
                    reject(new Error(errMsg));
                    return;
                }

                const request = indexedDB.open(this._dbName, this._version);

                request.onsuccess = (event) => {
                    const db = event.target.result;
                    cc.log(`[IndexedDBManager] Database '${this._dbName}' opened successfully.`);
                    resolve(db);
                };

                request.onerror = (event) => {
                    const errorMsg = `Failed to open database '${this._dbName}'. Error: ${event.target.errorCode}`;
                    cc.error(`[IndexedDBManager] ${errorMsg}`);
                    reject(new Error(errorMsg));
                };

                request.onupgradeneeded = (event) => {
                    const db = event.target.result;
                    cc.log(`[IndexedDBManager] Upgrading database '${this._dbName}' from version ${event.oldVersion} to ${event.newVersion}.`);

                    if (!db.objectStoreNames.contains(this._storeName)) {
                        // 创建对象仓库，使用 'key' 作为主键路径
                        db.createObjectStore(this._storeName, { keyPath: 'key' });
                        cc.log(`[IndexedDBManager] Object store '${this._storeName}' created.`);
                    } else {
                        cc.log(`[IndexedDBManager] Object store '${this._storeName}' already exists.`);
                    }
                };
            });
        },

        /**
         * 确保数据库已初始化
         * @private
         * @returns {Promise<void>}
         */
        _ensureInitialized: function() {
            if (this._isInitialized && this._db) {
                return Promise.resolve();
            }
            
            if (this._initPromise) {
                // 如果正在初始化中，等待初始化完成
                return this._initPromise;
            }
            
            // 如果未初始化且没有初始化Promise，说明还未调用init
            const errMsg = "IndexedDBManager not initialized. Call init() first.";
            cc.error(`[IndexedDBManager] ${errMsg}`);
            return Promise.reject(new Error(errMsg));
        },

        /**
         * 写入数据到 IndexedDB
         * @param {string} key - 数据的键
         * @param {*} value - 要存储的数据 (可以是字符串, 数字, 对象, 数组, ArrayBuffer 等)
         * @param {Function} [callback] - 回调函数 (可选)
         * @returns {Promise<void>} 操作完成的 Promise
         */
        set: function(key, value, callback) {
            const promise = this._ensureInitialized()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        const transaction = this._db.transaction([this._storeName], 'readwrite');
                        const objectStore = transaction.objectStore(this._storeName);

                        const dataToStore = {
                            key: key,
                            value: value,
                            timestamp: Date.now() // 可选：添加时间戳
                        };

                        const request = objectStore.put(dataToStore);

                        request.onsuccess = () => {
                            cc.log(`[IndexedDBManager] Data with key '${key}' written successfully.`);
                            resolve();
                        };

                        request.onerror = (event) => {
                            const errorMsg = `Failed to write data with key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };

                        transaction.onerror = (event) => {
                            const errorMsg = `Transaction error while writing key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };
                    });
                });
            
            if (callback) {
                promise.then(() => callback(null)).catch(callback);
            }
            
            return promise;
        },

        /**
         * 从 IndexedDB 读取数据
         * @param {string} key - 要读取的数据的键
         * @param {Function} [callback] - 回调函数 (可选)
         * @returns {Promise<*>} 一个 Promise，在 resolve 时传递读取到的 value，如果未找到则 resolve undefined
         */
        get: function(key, callback) {
            const promise = this._ensureInitialized()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        const transaction = this._db.transaction([this._storeName], 'readonly');
                        const objectStore = transaction.objectStore(this._storeName);

                        const request = objectStore.get(key);

                        request.onsuccess = (event) => {
                            const result = event.target.result;
                            if (result) {
                                cc.log(`[IndexedDBManager] Data with key '${key}' retrieved successfully.`);
                                resolve(result.value); // Return the actual stored value
                            } else {
                                cc.log(`[IndexedDBManager] Key '${key}' not found.`);
                                resolve(undefined); // Resolve with undefined if not found
                            }
                        };

                        request.onerror = (event) => {
                            const errorMsg = `Failed to retrieve data with key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };

                        transaction.onerror = (event) => {
                            const errorMsg = `Transaction error while reading key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };
                    });
                });
            
            if (callback) {
                promise.then((value) => callback(null, value)).catch(callback);
            }
            
            return promise;
        },

        /**
         * 从 IndexedDB 删除数据
         * @param {string} key - 要删除的数据的键
         * @param {Function} [callback] - 回调函数 (可选)
         * @returns {Promise<void>} 操作完成的 Promise
         */
        remove: function(key, callback) {
            const promise = this._ensureInitialized()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        const transaction = this._db.transaction([this._storeName], 'readwrite');
                        const objectStore = transaction.objectStore(this._storeName);

                        const request = objectStore.delete(key);

                        request.onsuccess = () => {
                            cc.log(`[IndexedDBManager] Data with key '${key}' deleted successfully.`);
                            resolve();
                        };

                        request.onerror = (event) => {
                            const errorMsg = `Failed to delete data with key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };

                        transaction.onerror = (event) => {
                            const errorMsg = `Transaction error while deleting key '${key}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };
                    });
                });
            
            if (callback) {
                promise.then(() => callback(null)).catch(callback);
            }
            
            return promise;
        },

        /**
         * 清空整个对象仓库
         * @param {Function} [callback] - 回调函数 (可选)
         * @returns {Promise<void>} 操作完成的 Promise
         */
        clear: function(callback) {
            const promise = this._ensureInitialized()
                .then(() => {
                    return new Promise((resolve, reject) => {
                        const transaction = this._db.transaction([this._storeName], 'readwrite');
                        const objectStore = transaction.objectStore(this._storeName);

                        const request = objectStore.clear();

                        request.onsuccess = () => {
                            cc.log(`[IndexedDBManager] Object store '${this._storeName}' cleared successfully.`);
                            resolve();
                        };

                        request.onerror = (event) => {
                            const errorMsg = `Failed to clear object store '${this._storeName}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };

                        transaction.onerror = (event) => {
                            const errorMsg = `Transaction error while clearing store '${this._storeName}'. Error: ${event.target.error}`;
                            cc.error(`[IndexedDBManager] ${errorMsg}`);
                            reject(new Error(errorMsg));
                        };
                    });
                });
            
            if (callback) {
                promise.then(() => callback(null)).catch(callback);
            }
            
            return promise;
        },

        /**
         * 关闭数据库连接
         */
        close: function() {
            if (this._db) {
                this._db.close();
                this._db = null;
                this._isInitialized = false;
                this._initPromise = null;
                cc.log(`[IndexedDBManager] Database connection closed.`);
            }
        }
    }
});

