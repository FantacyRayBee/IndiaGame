# 超强图片压缩 for 2.x

## 一 简介
压缩比最高、画质最好、不限次数/数量、无需注册、无限使用的全自动图片压缩插件，基于TinyPNG，业内公认的最佳图片压缩方案。

## 二 功能特点
- 没有次数/数量限制，无限使用，无需注册，打开即用。
- 压缩比高，压缩后大小平均仅为原图的25%。
- 无损压缩，和原图几乎一样。（对少数要求高的图片，可设置为排除文件，即可跳过压缩保持原图）
- 全自动批量压缩。1）可设置为构建完成后自动开始压缩；2）也可手动一键压缩指定目录下的所有图片；在压缩完成后会自动替换原图。（需要的话，本插件还支持对全硬盘的图片进行压缩）
- 支持缓存，压缩过的图片不会再次压缩，节省90%以上时间，在设置的缓存目录下可以看到所有压缩过的图片。（建议在Creator构建中打开 MD5 选项）
- 详细的进度和耗时提示，压缩日志输出在Creator编辑器的控制台，随时知道当前压缩状态。
- 压缩时需稳定联网，根据网络状况和不同文件的大小，每张图片的首次压缩时间约3-10秒，第2次就不花时间了。
- 受不同网络状况影响，偶有文件上传不成功会导致压缩失败（不影响原文件），这时只要再执行一次压缩就好了。

## 三 使用教程
1、插件包解压后，放在Creator工程项目的`packages`目录下，然后重启Creator；（本插件为`Creator 2.x` 版本专用，如果需要`Creator 3.x`版本请搜索同作者另一插件）

2、点击Creator顶部菜单栏“扩展” -> “超强图片压缩” -> “打开设置面板”，如下图所示：
![06.jpg](https://download.cocos.com/CocosStore/resource/b3a0942cf6c64b4a8c4ba3a765b8f2a2/b3a0942cf6c64b4a8c4ba3a765b8f2a2.jpg)

第一次使用需进行设置，如下图所示：
![03.jpg](https://download.cocos.com/CocosStore/resource/051d454e00e7452380442e10efeadca0/051d454e00e7452380442e10efeadca0.jpg)

- 1）是否开启自动压缩。开启后，将在Creator工程构建完成后自动开始压缩图片；
- 2）要压缩的图片目录。为方便使用，默认为项目的构建后目录，例如：工程中 build 下的 wechatgame 目录，压缩后将会覆盖原图；
- 3）输出缓存目录。默认为 build 目录下的 imageCache 目录，下次再压缩相同文件，将直接从这个缓存中复制；
- 4）要压缩的单个文件大小限制。此项可不填，主要作用是让太小或太大的图避免被压缩；
- 5）要排除的文件名。此项可不填，主要作用是有些UI图片对画质要求非常高，希望保持原图，那么就可以在此输入文件名的关键字，之后在压缩过程中会自动跳过此类文件；
- 6）点击“保存”；

3、点击Creator顶部菜单栏“扩展” -> “超强图片压缩” -> “开始压缩”，如下图所示：
![05.jpg](https://download.cocos.com/CocosStore/resource/aff7749082c14985b6cda7f799f2c725/aff7749082c14985b6cda7f799f2c725.jpg)

压缩过程和结果会输出到Creator编辑器的控制台中，如下图所示：
![042.jpg](https://download.cocos.com/CocosStore/markdown/c7a1bf377dee42be977c69b51ac759c8/c7a1bf377dee42be977c69b51ac759c8.jpg)

## 四 联系作者
- 微信：w50353438 
- 公众号：楚游香
- 个人博客：https://www.chuyouxiang.com/

作者的公众号和博客会不定期分享一些游戏开发技巧和上线实战经验，欢迎关注，共同进步！

作者同时创建了一个**游戏开发交流群**，供朋友们问题求助、技术交流学习等，感兴趣的朋友可以添加我微信，并留言`加群`。

## 五 推荐插件
**超强图片压缩（Creator 3.x版本）**  [https://store.cocos.com/app/detail/5438](https://store.cocos.com/app/detail/5438)

**资源优化助手（免费）** 
[https://store.cocos.com/app/detail/5575](https://store.cocos.com/app/detail/5575)

**H5分开部署**  [https://store.cocos.com/app/detail/5709](https://store.cocos.com/app/detail/5709)
 
**videoTexture视频播放**  [https://store.cocos.com/app/detail/4711](https://store.cocos.com/app/detail/4711)

**仅1M大小的引擎裁剪版**  [https://store.cocos.com/app/detail/4795](https://store.cocos.com/app/detail/4795)
