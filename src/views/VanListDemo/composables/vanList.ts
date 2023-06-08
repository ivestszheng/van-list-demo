import { Ref, isRef, ref, unref } from "vue";

function useVanList({
  page,
  total,
  searchContent,
  queryContent,
  beforeSearch,
}: {
  page: number | Ref<number>;
  total: number | Ref<number>;
  searchContent: string | Ref<string>;
  queryContent: Function;
  beforeSearch: Function;
}) {
  const list: Ref<number[]> = ref([]),
    loading = ref(false),
    finished = ref(false);

  async function onLoad() {
    if (isRefreshing.value) {
      // 如果是真实项目此处还应取消未完成的请求
      list.value = [];
      isRefreshing.value = false;
    }
    /**
     * 异步更新数据,
     * setTimeout 仅做示例，真实场景中一般为 ajax 请求,
     * 此处模拟真实的分页查询处理。
     * 搜索的逻辑不具体展开，只简单处理。
     **/
    const { clear, items } = await queryContent();
    if (clear) list.value.length = 0;
    list.value = [...list.value, ...items];
    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    if (list.value.length >= unref(total)) {
      finished.value = true;
    } else {
      if (isRef(page)) {
        page.value = page.value + 1;
      } else {
        page++;
      }
    }
  }

  const isRefreshing = ref(false);
  function onRefresh() {
    // 清空数据列表
    isRefreshing.value = true;
    isRef(page) ? (page.value = 0) : (page = 0);
    finished.value = false;

    // 重新加载数据
    // 将 loading 设置为 true，表示处于加载状态
    loading.value = true;
    onLoad();
  }

  function onSearch() {
    beforeSearch();
    onRefresh();
  }

  return {
    searchContent,
    list,
    loading,
    finished,
    onLoad,
    isRefreshing,
    onRefresh,
    onSearch,
  };
}

export { useVanList };
