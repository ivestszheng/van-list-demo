<template>
  <div class="van-list-demo-view">
    <van-pull-refresh
      v-model="isRefreshing"
      @refresh="onRefresh"
      class="full-screen-pull-refresh"
    >
      <van-sticky :offset-top="0">
        <van-search
          v-model="searchContent"
          placeholder="请输入数字"
          @search="onSearch"
        />
      </van-sticky>
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <van-cell
          v-for="item in list"
          :key="item"
          :title="item"
          style="text-align: center"
        />
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script setup lang="ts">
import { Ref, reactive, ref, unref } from "vue";

const searchContent = ref("");
function onSearch() {
  queryCondition.searchContent = unref(searchContent);
  onRefresh();
}

const list: Ref<number[]> = ref([]),
  loading = ref(false),
  finished = ref(false),
  queryCondition = reactive({
    page: 0,
    size: 8,
    searchContent: "",
  }),
  totalNum = 40;

function onLoad() {
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
  setTimeout(() => {
    if (queryCondition.searchContent) {
        // 这个条件只是模拟出查询的效果，没有什么现实意义
      if (
        Number(queryCondition.searchContent) > 0 &&
        Number(queryCondition.searchContent) <= totalNum
      ) {
        list.value.length = 0;
        list.value.push(Number(queryCondition.searchContent));
      }
    } else {
      for (let i = 0; i < queryCondition.size; i++) {
        list.value.push(list.value.length + 1);
      }
    }
    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    if (list.value.length >= totalNum || queryCondition.searchContent) {
      finished.value = true;
    } else {
      queryCondition.page++;
    }
  }, 1000);
}

const isRefreshing = ref(false);
function onRefresh() {
  // 清空数据列表
  isRefreshing.value = true;
  queryCondition.page = 0;
  finished.value = false;

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true;
  onLoad();
}
</script>

<style scoped>
.van-list-demo-view {
  box-sizing: border-box;
  height: 100%;
}
</style>
