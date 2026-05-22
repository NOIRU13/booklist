import axios from 'axios';

export const getBooks = async () => {
  const { data } = await axios.get('/books');
  return data;
};

export const postBook = (title, image) => axios.post('/books', { title, image });

export const deleteBook = (id) => axios.delete(`/books/${id}`);
