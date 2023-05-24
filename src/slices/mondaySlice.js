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

    return monday.storage.instance.getItem(MONDAY_STORAGE_KEY)
        .then((mondayTodoList) => {
            if (localTodoList && mondayTodoList) {
                return JSON.parse(localTodoList, mondayTodoList);
            }
            window.localStorage.setItem(MONDAY_STORAGE_KEY, []);
            return [];

        })
        .catch((err) => {
            console.log("Error retrieving item:", err);
        });
};

// const initialValue = {
//     filterStatus: "all",
//     todoList: getInitialTodo()
// };

export const mondaySlice = createSlice({
    name: "todo",
    initialState: {
        filterStatus: "all",
        todoList: []
    },
    reducers: {
        addTodo: (state, action) => {
            const todo = { ...action.payload };
            state.todoListMonday.push(todo);

            monday.storage.instance.getItem('todoList')
                .then((todoListMonday) => {
                    let todoListArr = [];

                    if (todoListMonday) {
                        todoListArr = JSON.parse(todoListMonday);
                    }

                    todoListArr.push(todo);
                    window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                    monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr))
                        .catch((err) => {
                            console.log("Error setting item:", err);
                        });

                    console.log(todoListArr);
                })
                .catch((err) => {
                    console.log("Error retrieving item:", err);
                });
        },

        updateTodo: (state, action) => {
            const { id, status, title } = action.payload;

            monday.storage.instance.getItem('todoList')
                .then((todoListMonday) => {
                    let todoListArr = [];

                    if (todoListMonday) {
                        todoListArr = JSON.parse(todoListMonday);
                    }

                    todoListArr.forEach((todo) => {
                        if (todo.id === id) {
                            todo.status = status;
                            todo.title = title;
                        }
                    });

                    window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                    monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr))
                        .then(() => {
                            state.todoList = [...todoListArr];
                            console.log(todoListArr);
                        })
                        .catch((err) => {
                            console.log("Error setting item:", err);
                        });
                })
                .catch((err) => {
                    console.log("Error retrieving item:", err);
                });
        },
        deleteTodo: (state, action) => {
            const todoId = action.payload;

            monday.storage.instance.getItem('todoList')
                .then((todoListMonday) => {
                    let todoListArr = [];

                    if (todoListMonday) {
                        todoListArr = JSON.parse(todoListMonday);
                    }

                    todoListArr.forEach((todo, index) => {
                        if (todo.id === todoId) {
                            todoListArr.splice(index, 1);
                        }
                    });

                    window.localStorage.setItem('todoList', JSON.stringify(todoListArr));
                    monday.storage.instance.setItem('todoList', JSON.stringify(todoListArr))
                        .then(() => {
                            state.todoList = todoListArr;
                            console.log(todoListArr);
                        })
                        .catch((err) => {
                            console.log("Error setting item:", err);
                        });
                })
                .catch((err) => {
                    console.log("Error retrieving item:", err);
                });
        },
        updateFilterStatus: (state, action) => {
            state.filterStatus = action.payload;
        },
    }
});


export const { addTodo, updateTodo, deleteTodo, updateFilterStatus } =
    mondaySlice.actions;

export default mondaySlice.reducer;
