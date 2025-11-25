window.IndexedDBManager = require('IndexedDBManager');
window.IndexedDBManager.init({dbName: 'MyGameDB', version: 1, storeName: 'gameData'}).then(() => {
    console.log("IndexedDBManager OK")
}).catch((err) => {
    console.log("IndexedDBManager Error: ", err)
})

cc.assetManager.downloader.register('.json', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache JSON from:", url);
            const decoder = new TextDecoder('utf-8');
            const str = decoder.decode(buffer);
            onComplete(null, JSON.parse(str))
        } else {
            fetchAndCacheJson(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheJson(url, onComplete)
    })
});

cc.assetManager.downloader.register('.png', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            // console.log("Cache PNG from:", url);
            const blob = new Blob([data], {type: 'image/png'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});

cc.assetManager.downloader.register('.jpg', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache JPG from:", url);
            const blob = new Blob([data], {type: 'image/jpg'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});

cc.assetManager.downloader.register('.atlas', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache ATLAS from:", url);
            const blob = new Blob([data], {type: 'image/atlas'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});


cc.assetManager.downloader.register('.mp3', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache MP3 from:", url);
            const blob = new Blob([data], {type: 'audio/mpeg'});
            onComplete(null, blob)
        } else {
            fetchAndCacheBlob(url, onComplete)
        }
    }).catch((err) => {
        fetchAndCacheBlob(url, onComplete)
    })
});

// cc.assetManager.downloader.register('.ttf', (url, options, onComplete) => {
//     //尝试缓存获取
//     window.IndexedDBManager.get(url).then((data) => {
//         if (data) {
//             const font = new cc.TTFFont();
//             font._nativeAsset = data;
//             onComplete(null, font)
//         } else {
//             fetchAndCacheBlob(url, onComplete)
//         }
//     }).catch((err) => {
//         fetchAndCacheBlob(url, onComplete)
//     })
// });

cc.assetManager.downloader.register('.bin', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache BIN from:", url);
            onComplete(null, data)
        } else {
            fetchArrayBuffer(url, onComplete)
        }
    }).catch((err) => {
        fetchArrayBuffer(url, onComplete)
    })
});

cc.assetManager.downloader.register('.spine', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            console.log("Cache SPINE from:", url);
            onComplete(null, data)
        } else {
            fetchArrayBuffer(url, onComplete)
        }
    }).catch((err) => {
        fetchArrayBuffer(url, onComplete)
    })
});

cc.assetManager.downloader.register('.wav', (url, options, onComplete) => {
    //尝试缓存获取
    window.IndexedDBManager.get(url).then((data) => {
        if (data) {
            // console.log("Cache WAV from:", url);
            // const blob = new Blob([data], {type: 'audio/wav'});
            onComplete(null, data)
        } else {
            fetchArrayBuffer(url, onComplete)
        }
    }).catch((err) => {
        fetchArrayBuffer(url, onComplete)
    })
});


// 从网络获取图片并缓存
function fetchAndCacheBlob(url, onComplete) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.blob();
        })
        .then(data => {
            // 即使缓存失败也返回数据
            onComplete(null, data);
        })
        .catch(err => {
            console.error("从网络获取图片失败:", url, err);
            onComplete(err, null);
        });
}


// 从网络获取图片并缓存
function fetchAndCacheJson(url, onComplete) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            // 即使缓存失败也返回数据
            onComplete(null, data);
        })
        .catch(err => {
            console.error("从网络获取图片失败:", url, err);
            onComplete(err, null);
        });
}

// 从网络获取图片并缓存
function fetchArrayBuffer(url, onComplete) {
    fetch(url)
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.arrayBuffer();
        })
        .then(data => {
            // 即使缓存失败也返回数据
            onComplete(null, data);
        })
        .catch(err => {
            console.error("从网络获取图片失败:", url, err);
            onComplete(err, null);
        });
}