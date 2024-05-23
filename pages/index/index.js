Page({
  data: {
    list: [
      {
        id: "common",
        name: "通用",
        pages: [
          { name: "长文本分页", url: "/pages/pagination/pagination" },
          { name: "触摸选中文本", url: "/pages/selected/selected" },
        ],
      },
    ],
  },

  toggle: function (e) {
    const id = e.currentTarget.dataset.id;
    const list = this.data.list;

    for (let index = 0; index < list.length; index++) {
      if (list[index].id == id) {
        list[index].open = !list[index].open;
      } else {
        list[index].open = false;
      }
    }

    this.setData({
      list,
    });
  },
});
