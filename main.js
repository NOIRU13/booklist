const initialBooks = [
  {
    id: 1,
    image: './images/item_book_1.jpg',
    title: '初めてのプログラミング',
    author: '煌木 太郎',
  },
  {
    id: 2,
    image: './images/item_book_2.jpg',
    title: '実践で学ぶSEO入門',
    author: '煌木 太郎',
  },
  {
    id: 3,
    image: './images/item_book_3.jpg',
    title: '実践 Webアプリケーション開発',
    author: '煌木 太郎',
  },
];

/**
 * -------------------
 * BookWishコンポーネント
 * -------------------
 */
const BookWish = {
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
  template: `
    <li class="group flex gap-4 max-w-sm">
      <img
        v-bind:src="book.image"
        alt=""
        width="64"
        height="83"
      >
      <div class="flex-grow flex items-center justify-between gap-2">
        <div>
          <h3 class="text-lg">{{ book.title }}</h3>
          {{ book.author }}
        </div>
        <div class="opacity-0 group-hover:opacity-100 transition-opacity">
          <span
            class="text-gray-400 hover:text-red-600 cursor-pointer transition-colors"
            title="削除する"
            role="button"
            v-on:click="$emit('delete-book', book.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </span>
        </div>
      </div>
    </li>
  `,
};

/**
 * -----------------
 * ルートVueインスタンス
 * -----------------
 */
new Vue({
  el: '#main',
  components: { BookWish },
  data: { books: initialBooks },
  methods: {
    onDeleteBook(id) {
      this.books = this.books.filter((book) => book.id !== id);
    },
  },
});
