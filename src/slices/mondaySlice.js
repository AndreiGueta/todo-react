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
    const localTodoList = window.localStorage.getItem(MONDAY_STORAGE_KEY);
    const mondayTodoList = monday.storage.instance.getItem(MONDAY_STORAGE_KEY);

    if (localTodoList && mondayTodoList) {
        // todoList = JSON.parse(localTodoList, mondayTodoList);
        return JSON.parse(localTodoList, mondayTodoList);
    }
    window.localStorage.setItem(MONDAY_STORAGE_KEY, []);
    monday.storage.instance.setItem(MONDAY_STORAGE_KEY, []);
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

export const mondaySlice = createSlice({
    name: "todo",
    initialState: initialValue,
    reducers: {
        addTodo: (state, action) => {
            state.todoList.push(action.payload);
            const todoList = window.localStorage.getItem('todoList');
            const todoListMonday = monday.storage.instance.getItem('todoList');
            if (todoList) {
                const todoListArr = JSON.parse(todoList, todoListMonday);
                todoListArr.push({
                    ...action.payload,
                });
                window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr));
                console.log(todoListArr);
            } else {
                window.localStorage.setItem('todoList', JSON.stringify([{...action.payload }]));
                monday.storage.instance.setItem('todoList', JSON.stringify([{...action.payload }]));
            }
        },

        updateTodo: (state, action) => {
            const todoList = window.localStorage.getItem('todoList');
            const todoListMonday = monday.storage.instance.getItem('todoList');
            if (todoList && todoListMonday) {
                const todoListArr = JSON.parse(todoList, todoListMonday);
                todoListArr.forEach((todo) => {
                    if (todo.id === action.payload.id) {
                        todo.status = action.payload.status;
                        todo.title = action.payload.title;
                    }
                });
                window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr));
                state.todoList = [...todoListArr];
            }
        },
        deleteTodo: (state, action) => {
            const todoList = window.localStorage.getItem('todoList');
            const todoListMonday = monday.storage.instance.getItem("todoList");
            if (todoList && todoListMonday) {
                const todoListArr = JSON.parse(todoList, todoListMonday);
                console.log(todoListArr);
                todoListArr.forEach((todo, index) => {
                    if (todo.id === action.payload) {
                        todoListArr.splice(index, 1);
                    }
                });
                window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                monday.storage.instance.setItem("todoList", JSON.stringify(todoListArr));
                state.todoList = todoListArr;


            }
        },
        updateFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
    }

});

export const { addTodo, updateTodo, deleteTodo, updateFilterStatus } =
    mondaySlice.actions;

export default mondaySlice.reducer;
