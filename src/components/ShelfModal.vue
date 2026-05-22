<template>
  <div>
    <button
      @click="show = true"
      class="btn btn-sm btn-outline btn-success book-registration__show-btn"
    >
      <bookmark-icon class="mr-1.5"></bookmark-icon>書籍の登録
    </button>
    <input type="checkbox" class="modal-toggle" :checked="show" />
    <div class="modal">
      <div class="modal-box">
        <div class="flex justify-between">
          <h3 class="font-bold text-lg">書籍の登録</h3>
          <button @click="show = false"><x-icon /></button>
        </div>
        <form @submit.prevent="onSubmit">
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text text-lg">タイトル</span>
            </label>
            <input
              type="text"
              placeholder=""
              class="input input-bordered w-full"
              :class="{ 'input-error': isErrorTitle }"
              v-model="title"
            />
            <span
              v-if="isErrorTitle"
              class="text-red-500"
              aria-label="タイトル入力エラー"
            >
              タイトルを入力してください
            </span>
          </div>
          <div class="form-control w-full mt-3">
            <label class="label">
              <span class="label-text text-lg">表紙画像</span>
            </label>
            <input
              ref="imageFile"
              type="file"
              @change="onImageFileChange"
              class="file-input file-input-bordered w-full"
              :class="{ 'file-input-error': isErrorImage }"
              accept="image/*"
            />
            <span
              v-if="isErrorImage"
              class="text-red-500"
              aria-label="表示画像のエラー"
            >
              正しい画像ファイルをアップロードしてください。
            </span>
            <div class="mt-2 w-24 h-24 bg-gray-100 border border-gray-200">
              <img
                v-if="imageFileEncoded"
                class="w-full h-full object-contain"
                :src="imageFileEncoded"
                alt=""
              />
            </div>
          </div>
          <p
            v-if="isFailed"
            class="text-red-600 mt-5"
            role="alert"
          >
            登録に失敗しました。
          </p>
          <button
            type="submit"
            class="btn btn-outline btn-success w-full mt-5"
            :class="{ 'btn-disabled': isPosting }"
          >
            保存する
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { BookmarkIcon, XIcon } from 'vue-tabler-icons';
import { postBook } from '@/services/bookService';

// 状態の定数
const IS_DEFAULT = 'IS_DEFAULT';
const IS_POSTING = 'IS_POSTING'; // データを送信中
const IS_FAILED = 'IS_FAILED'; // データを送信できなかった

const encodeImage = (file) => {
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = (event) => resolve(event.target.result);
    reader.readAsDataURL(file);
  });
};

export default {
  components: { BookmarkIcon, XIcon },
  data() {
    return {
      show: false,
      title: '',
      imageFileEncoded: '',
      validated: false,
      isValidImageFile: null,
      currentState: IS_DEFAULT,
    };
  },
  computed: {
    isErrorTitle() {
      // 保存ボタン未クリックならエラー表示はしない
      if (!this.validated) return false;
      // タイトルが未入力ならエラー
      return this.title.trim().length === 0;
    },
    isErrorImage() {
      // 保存ボタン未クリックならエラー表示はしない
      if (!this.validated) return false;
      // trueではない = 画像が未選択(isValidImage == null) or 画像ファイル形式エラー(isValidImage == false)
      return this.isValidImageFile !== true;
    },
    isValidInputs() {
      return !this.isErrorTitle && !this.isErrorImage;
    },
    isPosting() {
      return this.currentState === IS_POSTING;
    },
    isFailed() {
      return this.currentState === IS_FAILED;
    },
  },
  methods: {
    onImageFileChange(e) {
      if (e.target.files[0]) {
        encodeImage(e.target.files[0])
          .then((res) => {
            this.imageFileEncoded = res;
            this.isValidImageFile = true;
          })
          .catch((err) => {
            this.isValidImageFile = false;
            console.error(err.message);
          });
      } else {
        this.isValidImageFile = null;
      }
    },
    // 状態を変更する
    toDefault() {
      this.currentState = IS_DEFAULT;
    },
    toPosting() {
      this.currentState = IS_POSTING;
    },
    toFailed() {
      this.currentState = IS_FAILED;
    },
    // 入力値を初期値に戻す
    clearForm() {
      this.title = '';
      this.imageFileEncoded = '';
      this.isValidImageFile = null;
      this.validated = false;
      this.$refs.imageFile.value = null; // ファイル入力欄をクリア
    },
    async onSubmit() {
      // 保存ボタンクリック済みにマーク
      this.validated = true;
      if (!this.isValidInputs) return;

      this.toPosting();

      // 書籍データをJSON Serverに送信する
      const response = await postBook(this.title, this.imageFileEncoded).catch((err) => {
        this.toFailed();
        console.error(err.message);
      });

      if (!response) return;

      this.toDefault();

      // カスタムイベントを発行する
      const { id, title, image } = response.data;
      this.$emit('add-book', { id, title, image });

      // モーダルを閉じる
      this.show = false;

      // 次回の表示に備えて初期化する
      this.clearForm();
    },
  },
};
</script>

<style scoped>
.book-registration__show-btn {
  padding-right: 1.2rem;
}
</style>
