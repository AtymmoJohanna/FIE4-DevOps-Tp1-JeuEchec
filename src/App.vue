<template>
  <div id="app">
    <ChessBoard />
  </div>
  
</template>

<script>
import ChessBoard from './components/ChessBoard.vue';

export default {
  name: 'App',
  components: {
    ChessBoard
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>