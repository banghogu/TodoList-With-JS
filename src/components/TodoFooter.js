import { Component } from "../core/core";
import store from "../store/todo";
import TodoCrudApi from "./TodoCrudApi";
import CustomModal from './swal';

export default class TodoFooter extends Component {
    constructor() {
        super({
            tagName: "footer"
        });
        store.subscribe('todoItems', () => {
            this.render();
        });
    }
    
    async add() {
        const MAX_TODO_ITEMS = 6;
        if (store.state.todoItems.length === MAX_TODO_ITEMS) {
            CustomModal.showNotAddPrompt()
            return;
        }
        const newTodoTitle = await CustomModal.showInputPrompt();
        if (newTodoTitle !== null) {
            const newTodo = await TodoCrudApi.addTodoToAPI(newTodoTitle);
            const updatedTodoItems = [...store.state.todoItems, newTodo];
            store.setState({ todoItems: updatedTodoItems });
        }
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

        const addTodoButton = this.el.querySelector('.addTodoButton');
        addTodoButton.addEventListener('click', () => {
            this.add();
        });
    }
}