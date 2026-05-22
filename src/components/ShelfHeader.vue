<template>
  <div class="navbar bg-base-100 justify-between">
    <a href="./index.html" class="btn btn-ghost">
      <img src="@/assets/logo.png" alt="Bookshelf" />
    </a>
    <shelf-modal @add-book="onAddBook"></shelf-modal>
  </div>
</template>

<script>
import ShelfModal from '@/components/ShelfModal.vue';

export default {
  components: { ShelfModal },
  methods: {
    onAddBook(book) {
      this.$emit('add-book', book);
    },
  },
};
</script>
