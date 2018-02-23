<template>
  <div>
    <div v-for="item in addBtnList" class="add-btn" @click="clkCall(item.methods)">
      <i class="add-btn-i" :class="item.icon"></i>
      <div>{{item.title}}</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'titleAddBtn',
    props: ['addBtnList'],
    methods: {
      clkCall(methodsWords) {
        this.$emit('clkCallBk', methodsWords)
      }
    }
  }
</script>
