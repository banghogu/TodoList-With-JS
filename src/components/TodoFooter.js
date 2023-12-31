import { Component } from "../core/core";
import TodoCrudApi from "./TodoCrudApi";

export default class TodoFooter extends Component {
    constructor() {
        super({
            tagName: "footer"
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
        TodoCrudApi.getTodos()
            .then(todos => {
                const todoItemCount = todos.length;
                tasksContainer.textContent = `${todoItemCount} tasks`
            });
    }
}