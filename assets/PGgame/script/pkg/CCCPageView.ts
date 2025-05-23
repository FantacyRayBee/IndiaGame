import { config } from "../config/config";
import { tcLog } from "../framework/log/log";
import { tcRes } from "../framework/res/res";

/**
 * 支持手动左右滑动和定向定时轮播
 */
const { ccclass, property } = cc._decorator;

@ccclass
export default class CCCPageView extends cc.Component {
    @property(cc.Node)
    private pageSpriteTemplate: cc.Node | undefined = undefined;
    @property(cc.Node)
    private pageIndicatorToggleTemplate: cc.Node | undefined = undefined;

    private pageView: cc.PageView | undefined;
    private scrollToNextPageLeftTime: number = 0;
    private viewContent: cc.Node | undefined;
    //各pageView图片
    private pageSprites: cc.Sprite[] = [];
    //pageview的Indicator
    private indecatorContanerLayout: cc.Layout | undefined;
    private togList: cc.Toggle[] = [];
    //当前视图显示图片对应的pageView序号
    private currentIndex: number = 1;
    private preIndex: number = 1;
    //当前pageView的实际位移
    private centerX: number = 0;
    //当前pageView的实际序号
    private pageIndex = 1;
    //pageView是否已初始化
    private inittedPageView: boolean = false;

    //数据：可以是spriteFrame也可以是URL
    private pageViewDatas: any[] = [];
    private pageViewSpriteFrames: cc.SpriteFrame[] = [];

    private pageViewClickCallBack: Function | undefined;
    private pageViewTurnPageCallBack: Function | undefined;
    private bURL: boolean = false;

    //是否向左轮播
    private carouselLeft: boolean = true;
    private carouselInterval: number = 8;
    private bShowIndicatorAni: boolean = false; //翻页后是否播放indcator的动画
    //轮播间隔
    public set CarouselInterval(value: number) {
        this.carouselInterval = value;
    }

    private indicatorNormalWidth = 15;
    private indicatorSelectWidth = 35;

    protected onLoad(): void {
        this.pageView = this.node.getComponent(cc.PageView);
        this.viewContent = cc.find("view/content", this.node);
        this.indecatorContanerLayout = this.pageIndicatorToggleTemplate?.parent.getComponent(cc.Layout);
        //如果用户在滚动pageView则重置自动滑动时间
        this.pageView?.node.on(
            "page-turning",
            (event: any) => {
                this.scrollToNextPageLeftTime = this.carouselInterval;
            },
            this
        );
    }

    async init(datas: any[], carouselInterval: number = -1, carouselLeft: boolean = true, showIndicatorAni: boolean = false) {
        if (!datas || datas.length == 0) {
            tcLog.error(`PageView.init datas error`);
            return;
        }
        this.pageViewDatas = datas;
        this.carouselLeft = carouselLeft;
        this.bShowIndicatorAni = showIndicatorAni;
        this.bURL = typeof datas[0].banner === "string";
        if (!this.bURL) {
            datas.forEach((data) => {
                this.pageViewSpriteFrames.push(data.banner);
            });
        }
        this.carouselInterval = carouselInterval;
        this.scrollToNextPageLeftTime = carouselInterval;
        this.initPageview();
        await this.refreshPageView();

        if (this.pageView && this.togList.length > 0) {
            this.pageView!.setCurrentPageIndex(0);
        }
    }

    setPageViewClickHandler(callBack: Function) {
        this.pageViewClickCallBack = callBack;
    }
    setPageViewTurnPageHanlder(callBack: Function) {
        this.pageViewTurnPageCallBack = callBack;
    }

    public async refreshPageView() {
        if (this.inittedPageView || !this.pageSpriteTemplate) {
            return;
        }
        this.inittedPageView = true;
        for (let i = 0; i < this.pageSprites.length; ++i) {
            if (this.bURL) {
                await this.loadPageViewSprite(this.pageViewDatas[i % this.pageViewDatas.length].banner as string, i);
            } else {
                this.pageSprites[i].spriteFrame = this.pageViewDatas[i % this.pageViewDatas.length].banner as cc.SpriteFrame;
            }
        }
    }

    /**根据初始数据，构建对应数量的page及indicator */
    private initPageview() {
        //建立对应个page：page_0、page_1、page_2... ...；
        //初始定位到page_1；
        //当滑动到page_0时，立即移动位置到page_1且刷新全部page全部内容；
        //当滑动到page_2时，同上

        /* pageView数量只有1个时，默认时不能左右切换的，所以只需要创建一个pageView即可，
            如果数量等于2个，需要左右自由滑动时则至少需要4个pageView才行
            其他数量时，只需要对应数量即可
         */
        let dataCount = this.pageViewDatas.length;
        let pageViewCount = dataCount == 1 ? 1 : dataCount == 2 ? 4 : dataCount;
        for (let i = 0; i < pageViewCount; ++i) {
            const bg = i == 0 ? this.pageSpriteTemplate : cc.instantiate(this.pageSpriteTemplate);
            if (bg) {
                i != 0 && this.pageView?.addPage(bg);
                this.pageSprites.push(bg.getComponent(cc.Sprite));
                /**点击pageView的回调 */
                this.pageSprites[i]?.node?.on("click", () => {
                    this.pageViewClickCallBack && this.pageViewClickCallBack(this.currentIndex % dataCount);
                });
            }
        }

        for (let i = 0; i < this.pageViewDatas.length; ++i) {
            const indicatorToggle = i == 0 ? this.pageIndicatorToggleTemplate : cc.instantiate(this.pageIndicatorToggleTemplate);
            i != 0 && indicatorToggle?.setParent(this.pageIndicatorToggleTemplate?.parent!);
            i != 0 && indicatorToggle && (indicatorToggle.width = this.indicatorNormalWidth);
            indicatorToggle && this.togList.push(indicatorToggle.getComponent(cc.Toggle));
        }
        this.indecatorContanerLayout?.updateLayout();
        //计算中心位置
        let list = this.pageView!.getPages();
        if (list.length > 0) {
            let width = list[0].width;
            this.centerX = 1.5 * width;
        }

        //中心index的数值
        tcLog.info("pageindex: ", this.pageIndex);
        //注册事件
        this.pageView!.node.on("scroll-ended", () => {
            this.onScrollEnd();
        });
    }

    private onScrollEnd() {
        if (!this.pageViewDatas || this.pageViewDatas.length < 2) {
            return;
        }
        this.preIndex = this.currentIndex;
        if (this.pageView!.getCurrentPageIndex() <= this.pageIndex - 1) {
            this.pageView!.content.setPosition(-this.centerX, 0);

            this.pageView!.setCurrentPageIndex(this.pageIndex);

            --this.currentIndex;
            if (this.currentIndex < 0) {
                this.currentIndex = this.pageViewDatas.length - 1;
            }
            this.setPageViewSprite(false);
        } else if (this.pageView!.getCurrentPageIndex() >= this.pageIndex + 1) {
            this.pageView!.content.setPosition(-this.centerX, 0);

            this.pageView!.setCurrentPageIndex(this.pageIndex);
            ++this.currentIndex;
            if (this.currentIndex >= this.pageViewDatas.length) {
                this.currentIndex = 0;
            }
            this.setPageViewSprite(true);
        }
        /**翻页的回调 */
        this.pageViewTurnPageCallBack && this.pageViewTurnPageCallBack(this.currentIndex);
        if (this.bShowIndicatorAni) {
            this.showIndicatorsAnimation();
        }
    }

    private setPageViewSprite(direction: boolean) {
        let spIdx = this.currentIndex;
        let idx = 1;
        for (let index = 0; index < this.pageSprites.length; index++) {
            if (direction) {
                spIdx++;
                if (spIdx >= this.pageViewDatas.length) {
                    spIdx = 0;
                }
                idx++;
                if (idx >= this.pageSprites.length) {
                    idx = 0;
                }
            } else {
                spIdx--;
                if (spIdx < 0) {
                    spIdx = this.pageViewDatas.length - 1;
                }
                idx--;
                if (idx < 0) {
                    idx = this.pageSprites.length - 1;
                }
            }
            this.pageSprites[idx].spriteFrame = this.pageViewSpriteFrames[spIdx % this.pageViewDatas.length];
        }
        this.togList[this.currentIndex % this.pageViewDatas.length].check();
    }

    /**加载远程图片 */
    private async loadPageViewSprite(url: string, index: number) {
        tcRes.loadRemote<cc.Texture2D>(`${config.apiUrl}/${url}`).then((texture2D) => {
            if (!this.pageSprites[index] || !this.pageSprites[index].node) {
                return;
            }
            const spriteFrame = new cc.SpriteFrame(texture2D);
            this.pageViewSpriteFrames[index] = spriteFrame;

            //this.pageSprites[index].spriteFrame = spriteFrame;
            if (!this.pageViewDatas) {
                return;
            }
            if (this.pageViewDatas.length == 1) {
                this.pageSprites[0].spriteFrame = spriteFrame;
            } else if (this.currentIndex == index) {
                this.pageSprites[1].spriteFrame = spriteFrame;
            }
        });
    }

    protected update(dt: number): void {
        //如果没有传入轮播间隔则不轮播
        if (this.carouselInterval <= 0 || this.pageViewDatas.length < 2) {
            return;
        }
        this.scrollToNextPageLeftTime -= dt;
        if (this.scrollToNextPageLeftTime <= 0) {
            this.scrollToNextPageLeftTime = 8;
            this.scrollToNextView();
        }
    }

    scrollToNextView() {
        if (!this.pageView || !this.pageView.node || !this.node.active) {
            return;
        }
        let curPage = this.pageView?.getCurrentPageIndex();
        let index = (this.carouselLeft ? curPage + 1 : curPage - 1) % this.pageView?.getPages()?.length;
        this.pageView?.scrollToPage(index, 1);
    }

    showIndicatorsAnimation() {
        // if (this.indecatorContanerLayout?.enabled) {
        //     this.indecatorContanerLayout.enabled = false;
        // }
        this.togList.forEach((toggle, index) => {
            if (index == this.currentIndex) {
                cc.tween(toggle.node).to(0.3, { width: this.indicatorSelectWidth }, { easing: cc.easing.backOut }).start();
            } else {
                cc.tween(toggle.node).to(0.3, { width: this.indicatorNormalWidth }, { easing: cc.easing.backOut }).start();
            }
        });
    }
}
