<template>
  <div id="app">
    <shelf-header @add-book="onAddBook"></shelf-header>
    <shelf-message></shelf-message>
    <shelf-books
      :books="books"
      @delete-book="onDeleteBook"
    ></shelf-books>
    <div class="toast toast-end">
      <div
        class="alert alert-error error-alert"
        :class="{ show: showErrorAlert }"
      >
        <div>
          <span>{{ errorMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ShelfHeader from '@/components/ShelfHeader.vue';
import ShelfMessage from '@/components/ShelfMessage.vue';
import ShelfBooks from '@/components/ShelfBooks.vue';
import { deleteBook, getBooks } from '@/services/bookService';

export default {
  components: { ShelfHeader, ShelfBooks, ShelfMessage },
  data() {
    return {
      books: [],
      showErrorAlert: false,
      errorMessage: '',
    };
  },
  async created() {
    this.books = await getBooks()
      .catch((err) => {
        console.error(err.message);
        this.makeToast('書籍データを取得できませんでした。');
      });
  },
  methods: {
    makeToast(message) {
      this.errorMessage = message;
      this.showErrorAlert = true;
      // 5秒(5000ミリ秒)後に非表示にする
      setTimeout(() => {
        this.showErrorAlert = false;
        this.errorMessage = message;
      }, 5000);
    },
    onAddBook(book) {
      this.books.push(book);
    },
    async onDeleteBook(id) {
      const response = await deleteBook(id)
        .catch((err) => {
          console.error(err.message);
          this.makeToast('書籍データを削除できませんでした。');
        });

      if (!response) return;

      this.books = this.books.filter((book) => book.id !== id);
    },
  },
};
</script>

<style scoped>
.error-alert {
  animation: none;
  opacity: 0;
  transition: opacity 0.25s, transform 0.25s;
  transform: translateX(50%);
}

.error-alert.show {
  opacity: 1;
  transform: translateX(0);
}
</style>
