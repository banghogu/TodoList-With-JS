import { Component } from "../core/core";
import store, { getTodoItems } from "../store/todo";
import TodoMainItem from "./TodoMainItem";

export default class TodoMain extends Component {
    constructor() {
        super({
            tagName: "main"
        });
        store.subscribe('todoItems', () => {
            this.render();
        });
        getTodoItems()
            .then((initialTodos) => {
                const currentTodoItems = Array.isArray(store.state.todoItems) ? store.state.todoItems : [];
                const mergedState = { todoItems: [...currentTodoItems, ...(Array.isArray(initialTodos) ? initialTodos : [])] };
                store.setState(mergedState);
                this.render();
            })
    }

    render() {
        this.el.innerHTML = /* html */`
            <div id="todoMainContainer"> 
                <ul id="todoItems"></ul>
            </div>
        `;
        const todoMainContainer = this.el.querySelector('#todoMainContainer');
        const todoItems = todoMainContainer.querySelector("#todoItems");
        todoItems.append(
            ...store.state.todoItems.map((todoitem) => {
                return new TodoMainItem({
                    todoitem: todoitem
                }).el;
            })
        );


    }
}