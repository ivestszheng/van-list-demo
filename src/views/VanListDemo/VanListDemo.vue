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
import { reactive, ref, toRefs, unref } from "vue";
import { useVanList } from "./composables/vanList";

const queryCondition = reactive({
    page: 0,
    size: 8,
    searchContent: "",
  }),
  searchContent = ref(""),
  total = ref(40),
  MAX_SIZE = 40,
  { page } = toRefs(queryCondition);

const { list, loading, finished, onLoad, isRefreshing, onRefresh, onSearch } =
  useVanList({
    page,
    total,
    searchContent,
    queryContent,
    beforeSearch,
  });

function queryContent() {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (
        searchContent.value &&
        Number(searchContent.value) > 0 &&
        Number(searchContent.value) <= MAX_SIZE
      ) {
        const items = [Number(queryCondition.searchContent)];
        resolve({ clear: true, items });
      } else if (
        searchContent.value &&
        (Number(searchContent.value) <= 0 ||
          Number(searchContent.value) > MAX_SIZE)
      ) {
        resolve({ clear: true, items: [] });
      } else {
        const items = [];
        for (let i = 1; i < queryCondition.size + 1; i++) {
          items.push(list.value.length + i);
        }
        resolve({
          clear: false,
          items,
        });
      }
    }, 1000);
  });
}

function beforeSearch() {
  queryCondition.searchContent = unref(searchContent);
  // total 的赋值只是因为实现显示逻辑，真实业务不需要有此逻辑
  if (searchContent.value && Number(searchContent.value) <= MAX_SIZE) {
    total.value = 1;
  } else if (
    (searchContent.value && Number(searchContent.value) <= 0) ||
    Number(searchContent.value) > MAX_SIZE
  ) {
    total.value = 0;
  } else {
    total.value = MAX_SIZE;
  }
}
</script>

<style scoped>
.van-list-demo-view {
  box-sizing: border-box;
  height: 100%;
}
</style>
