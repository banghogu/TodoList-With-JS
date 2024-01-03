import { Component } from "../core/core";
import TodoCrudApi from "./TodoCrudApi";
import store from "../store/todo";

export default class TodoFooter extends Component {
    constructor() {
        super({
            tagName: "footer"
        });
        store.subscribe('todoItems', () => {
            this.render();
        });
    }

    render() {
        this.el.innerHTML = /* html */`
            <div class="todoFooterContainer">
                <div class="tasksContainer">
                </div>
                <div class="addTodoButton">Add New +</div>
            </div>
        `;

        const tasksContainer = this.el.querySelector('.tasksContainer');
        tasksContainer.textContent = `${store.state.todoItems.length} tasks`
    }
}