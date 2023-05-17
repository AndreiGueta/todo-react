import MondaySdk from 'monday-sdk-js';
import { createSlice } from '@reduxjs/toolkit';

const monday = MondaySdk();

const getInitialTodo = async () => {
  const localTodoList = (await monday.storage.instance.getItem('todoList')).data
    .value;
  if (localTodoList?.length) {
    return localTodoList;
  }
  await monday.storage.instance.setItem('todoList', { value: [] });
  return [];
};

const initialValue = async () => ({
  filterStatus: 'all',
  todoList: await getInitialTodo(),
});

export const todoMonday = createSlice({
  name: 'todo',
  initialState: {},
  reducers: {
    addTodo: async (state, action) => {
      state.todoList.push(action.payload);
      const todoList = (await monday.storage.instance.getItem('todoList')).data
        .value;
      if (todoList) {
        const todoListArr = todoList;
        todoListArr.push({
          ...action.payload,
        });
        await monday.storage.instance.setItem('todoList', {
          value: todoListArr,
        });
      } else {
        await monday.storage.instance.setItem('todoList', {
          value: [
            {
              ...action.payload,
            },
          ],
        });
      }
    },
    updateTodo: async (state, action) => {
      const todoList = (await monday.storage.instance.getItem('todoList')).data
        .value;
      if (todoList) {
        const todoListArr = todoList;
        todoListArr.forEach((todo) => {
          if (todo.id === action.payload.id) {
            todo.status = action.payload.status;
            todo.title = action.payload.title;
          }
        });
        await monday.storage.instance.setItem('todoList', {
          value: todoListArr,
        });
        state.todoList = [...todoListArr];
      }
    },
    deleteTodo: async (state, action) => {
      const todoList = (await monday.storage.instance.getItem('todoList')).data
        .value;
      if (todoList) {
        const todoListArr = todoList;
        todoListArr.forEach((todo, index) => {
          if (todo.id === action.payload) {
            todoListArr.splice(index, 1);
          }
        });
        await monday.storage.instance.setItem('todoList', {
          value: todoListArr,
        });
        state.todoList = todoListArr;
      }
    },
    updateFilterStatus: (state, action) => {
      state.filterStatus = action.payload;
    },
  },
  options: await initialValue(),
});

export const { addTodo, updateTodo, deleteTodo, updateFilterStatus } =
  todoMonday.actions;
export default todoMonday.reducer;
