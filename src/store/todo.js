import { Store } from "../core/core";
import TodoCrudApi from "../components/TodoCrudApi";

const store = new Store({
    todoItems: []
});

export default store;

export const getTodoItems = async () => {
        const todos = await TodoCrudApi.getTodos();
        store.setState({ todoItems: todos });
}