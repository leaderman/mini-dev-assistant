Page({
  data: {
    // 文本内容
    text: "豫章故郡，洪都新府。星分翼轸，地接衡庐。襟三江而带五湖，控蛮荆而引瓯越。物华天宝，龙光射牛斗之墟；人杰地灵，徐孺下陈蕃之榻。雄州雾列，俊采星驰。台隍枕夷夏之交，宾主尽东南之美。都督阎公之雅望，棨戟遥临；宇文新州之懿范，襜帷暂驻。十旬休假，胜友如云；千里逢迎，高朋满座。腾蛟起凤，孟学士之词宗；紫电青霜，王将军之武库。家君作宰，路出名区；童子何知，躬逢胜饯。时维九月，序属三秋。潦水尽而寒潭清，烟光凝而暮山紫。俨骖騑于上路，访风景于崇阿；临帝子之长洲，得天人之旧馆。层峦耸翠，上出重霄；飞阁流丹，下临无地。鹤汀凫渚，穷岛屿之萦回；桂殿兰宫，即冈峦之体势。",

    // 字符数组
    charactors: [],

    // 字符区域布局
    charactorsRect: null,

    // 字符布局
    charactorRects: [],

    // 开始选中字符索引
    startSelectedCharactor: -1,
    // 结束选中字符索引
    endSelectedCharactor: -1,
  },

  onLoad: function () {
    // 设置导航栏标题
    wx.setNavigationBarTitle({
      title: "触摸选中文本",
    });
  },

  onShow: async function () {
    wx.showNavigationBarLoading();

    // 将文本内容拆分为字符数组
    const charactors = this.data.text.split("").map((char) => ({ char }));
    this.setData({
      charactors,
    });

    // 获取字符区域布局
    const charactorsRect = await this.getCharactorsRect();
    this.setData({
      charactorsRect,
    });

    // 获取字符布局
    const charactorRects = await this.getCharactorRects();
    this.setData({
      charactorRects,
    });

    wx.hideNavigationBarLoading();
  },

  /**
   * 获取字符区域高度
   *
   * @returns {Promise<object>} 布局
   */
  getCharactorsRect: async function () {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .select(".charactors")
        .boundingClientRect((rect) => {
          resolve(rect);
        })
        .exec();
    });
  },

  /**
   * 获取字符布局
   *
   * @returns {Promise<object>} 布局
   */
  getCharactorRects: async function () {
    return new Promise((resolve) => {
      wx.createSelectorQuery()
        .selectAll(".charactor")
        .boundingClientRect(function (rects) {
          resolve(rects);
        })
        .exec();
    });
  },

  /**
   * 获取选中的字符索引：
   * 如果触摸点在字符布局内，则返回字符索引，否则返回 -1
   *
   * @param {number} clientX 触摸点横坐标
   * @param {number} clientY 触摸点纵坐标
   * @returns {number} 字符索引
   */
  getCharactor: function (clientX, clientY) {
    const charactorRects = this.data.charactorRects;

    for (let index = 0; index < charactorRects.length; index++) {
      const rect = charactorRects[index];

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom
      ) {
        // 触摸点在字符布局内，选中
        return index;
      }
    }

    return -1;
  },

  /**
   * 选中字符
   */
  selectCharactors: function () {
    let start = this.data.startSelectedCharactor;
    let end = this.data.endSelectedCharactor;
    if (start > end) {
      const temp = start;
      start = end;
      end = temp;
    }

    const charactors = this.data.charactors.map((charactor, index) => {
      if (index >= start && index <= end) {
        charactor.selected = true;
      } else {
        charactor.selected = false;
      }

      return charactor;
    });
    this.setData({
      charactors,
    });
  },

  /**
   * 触摸开始：
   * 更新开始选中字符索引和结束选中字符索引
   *
   * @param {object} e 事件
   */
  touchStart: function (e) {
    const startSelectedCharactor = this.data.startSelectedCharactor;
    const endSelectedCharactor = this.data.endSelectedCharactor;
    // 如果已经选中字符，则不处理
    if (startSelectedCharactor != -1 && endSelectedCharactor != -1) {
      return;
    }

    // 触摸点坐标
    const clientX = e.touches[0].clientX;
    const clientY = e.touches[0].clientY;

    const charactorsRect = this.data.charactorsRect;
    if (
      clientX < charactorsRect.left ||
      clientX > charactorsRect.right ||
      clientY < charactorsRect.top ||
      clientY > charactorsRect.bottom
    ) {
      // 触摸点不在字符区域内，不处理
      return;
    }

    // 获取选中的字符索引
    const charactor = this.getCharactor(clientX, clientY);
    // 更新开始选中字符索引和结束选中字符索引
    this.setData({
      startSelectedCharactor: charactor,
      endSelectedCharactor: charactor,
    });

    // 选中字符
    this.selectCharactors();
  },

  /**
   * 触摸移动：
   * 更新结束选中字符索引
   *
   * @param {object} e 事件
   */
  touchMove: function (e) {
    // 触摸点坐标
    let clientX = e.touches[0].clientX;
    let clientY = e.touches[0].clientY;

    const charactorsRect = this.data.charactorsRect;
    // 限制触摸点坐标在字符区域内
    if (clientX < charactorsRect.left) {
      clientX = charactorsRect.left;
    }
    if (clientX > charactorsRect.right) {
      clientX = charactorsRect.right;
    }
    if (clientY < charactorsRect.top) {
      clientY = charactorsRect.top;
    }
    if (clientY > charactorsRect.bottom) {
      clientY = charactorsRect.bottom;
    }

    // 获取选中的字符索引
    const charactor = this.getCharactor(clientX, clientY);
    // 更新结束选中字符索引
    this.setData({
      endSelectedCharactor: charactor,
    });

    // 选中字符
    this.selectCharactors();
  },

  /**
   * 点击：
   * 清空选中字符
   */
  tap: function () {
    // 清空选中字符
    this.setData({
      startSelectedCharactor: -1,
      endSelectedCharactor: -1,
    });

    // （清空）选中字符
    this.selectCharactors();
  },
});
