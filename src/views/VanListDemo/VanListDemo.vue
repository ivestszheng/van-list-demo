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
import { useVanList } from "./composables/vanList";

const {
  searchContent,
  onSearch,
  list,
  loading,
  finished,
  onLoad,
  isRefreshing,
  onRefresh,
} = useVanList();
</script>

<style scoped>
.van-list-demo-view {
  box-sizing: border-box;
  height: 100%;
}
</style>
