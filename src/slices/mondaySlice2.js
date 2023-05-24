import { createSlice } from "@reduxjs/toolkit";
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk({
    token: "eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI1NjA3NTU0NSwiYWFpIjoxMSwidWlkIjo0MjQ5NjA4NiwiaWFkIjoiMjAyMy0wNS0xMlQwOTo0NDoxMC4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTA1NzY5NzEsInJnbiI6InVzZTEifQ.PcE-YncCh0ZF1M0gB22j9vtgTciwQng895rZ0DhyA5M",
    clientId: "5d6607a9b907fb548a4f29560512f48a"
});

// monday.setToken(
//     'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjI1NjA3NTU0NSwiYWFpIjoxMSwidWlkIjo0MjQ5NjA4NiwiaWFkIjoiMjAyMy0wNS0xMlQwOTo0NDoxMC44NDlaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MTA1NzY5NzEsInJnbiI6InVzZTEifQ.4_YAG6TkH-1k_aRYe9aw1CX5rYDNfkc9NJRYNcvFqSM'
// );

// Set the data in Monday's storage API
// const key = ["test_key", "test2", "test3", "test4", "test5", "test6"];
// const value = { test: "value" };
// monday.storage.instance.setItem([key, value]).then(() => {
//     console.log("Successfully set item in Monday's storage API");
// }).catch((err) => {
//     console.log("Error setting item:", err);
// });

// // Retrieve the data from Monday's storage API
// monday.storage.instance.getItem(key).then((res) => {
//     console.log("Successfully got item from Monday's storage API");
//     console.log(key);
// }).catch((err) => {
//     console.log("Error getting item:", err);
// });

const MONDAY_STORAGE_KEY = "TODO_LIST_KEY";

const getInitialTodo = () => {
    const mondayTodoList = monday.storage.instance.getItem(MONDAY_STORAGE_KEY).then((value) => {
        console.log('Value retrieved from Monday storage:', value);
    }).catch(err => console.log('Error retrieving value from Monday storage:', err));


    if (mondayTodoList) {
        // todoList = JSON.parse(localTodoList, mondayTodoList);
        return JSON.parse(mondayTodoList);
    }
    monday.storage.instance.setItem(MONDAY_STORAGE_KEY, []).then(() => {
        console.log('Todo list initialized in Monday storage.');
    }).catch(err => console.log('Error initializing todo list in Monday storage:', err));
    return [];
};

// monday.storage.instance
//     .setItem(MONDAY_STORAGE_KEY, [todoList])
//     .then((res) => {
//         console.log("successful update of " + [MONDAY_STORAGE_KEY]);
//         console.log(res.args.value);
//         return [];
//     });

// monday.storage.instance.getItem(MONDAY_STORAGE_KEY).then((res) => {
//     if (res) {
//         console.log("get data from monday using key: " + MONDAY_STORAGE_KEY);
//         console.log([todoList]);
//     }
// });

// return todoList;

const initialValue = {
    filterStatus: "all",
    todoList: getInitialTodo(),
};

export const mondaySlice2 = createSlice({
    name: "todo",
    initialState: initialValue,
    reducers: {
        addTodo: (state, action) => {
            state.todoList.push(action.payload);
            const todoList = monday.storage.instance.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                todoListArr.push({
                    ...action.payload,
                });
                window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr));
                console.log(todoListArr);
            } else {
                window.localStorage.setItem('todoList', JSON.stringify([{ ...action.payload }]));
                monday.storage.instance.setItem('todoList', JSON.stringify([{ ...action.payload }]));
            }
        },

        updateTodo: (state, action) => {
            const todoList = monday.storage.instance.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                todoListArr.forEach((todo) => {
                    if (todo.id === action.payload.id) {
                        todo.status = action.payload.status;
                        todo.title = action.payload.title;
                    }
                });
                monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr));
                state.todoList = [...todoListArr];
            }
        },
        deleteTodo: (state, action) => {
            const todoList = monday.storage.instance.getItem("todoList");
            if (todoList) {
                const todoListArr = JSON.parse(todoList);
                console.log(todoListArr);
                todoListArr.forEach((todo, index) => {
                    if (todo.id === action.payload) {
                        todoListArr.splice(index, 1);
                    }
                });
                monday.storage.instance.setItem("todoList", JSON.stringify(todoListArr));
                state.todoList = todoListArr;


            }
        },
        updateFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
            console.log(action.payload);
        },
    }

});

export const { addTodo, updateTodo, deleteTodo, updateFilterStatus } =
    mondaySlice2.actions;

export default mondaySlice2.reducer;
