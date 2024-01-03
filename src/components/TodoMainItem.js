import { Component } from "../core/core";
import store from "../store/todo";
import TodoCrudApi from "./TodoCrudApi";
import CustomModal from './swal';

export default class TodoMainItem extends Component {
    constructor(props) {
        super({
            props: props,
            tagName: 'li'
        });
    }

    async toggle(isChecked) {
        const { id, title, done, order } = this.props.todoitem;
        const newDoneValue = isChecked;
        await TodoCrudApi.updateTodoById(id, title, newDoneValue, order);
        const updatedTodoItems = store.state.todoItems.map(item =>
            item.id === id ? { ...item, done: newDoneValue } : item
        );
        store.setState({ todoItems: updatedTodoItems });
    }

    async edit() {
        const { id, title, done, order } = this.props.todoitem;
        const newTitle = await CustomModal.showEditPrompt(title);
        if (newTitle !== null) {
            await TodoCrudApi.updateTodoById(id, newTitle, done, order);
            const updatedTodoItems = store.state.todoItems.map(item =>
                item.id === id ? { ...item, title: newTitle } : item
            );
            store.setState({ todoItems: updatedTodoItems });
        }
    }

    async delete(todoId) {
        const deleteModal = new CustomModal(async (todoId) => {
            await deleteHandler(todoId);
        });
        deleteModal.showConfirmation(todoId);
        
        async function deleteHandler(todoId) {
            await TodoCrudApi.deleteTodoById(todoId);
            const updatedTodoItems = store.state.todoItems.filter(item =>
                item.id !== todoId
            );
            store.setState({ todoItems: updatedTodoItems });
            deleteModal.showDeletionSuccess();

        }
    }

    render() {
        const { id, title, done } = this.props.todoitem;
        this.el.classList.add("todo-item");
        this.el.innerHTML = /* html */`
            <input type="checkbox" class="checkbox" ${done ? "checked" : ""}>
            <span>${title}</span>
            <button class="hidden editBtn">수정</button>
            <button class="hidden deleteBtn">삭제</button>
        `;

        const checkbox = this.el.querySelector('.checkbox');
        checkbox.addEventListener('change', () => {
            this.toggle(checkbox.checked);
        });

        const editBtn = this.el.querySelector('.editBtn');
        editBtn.addEventListener('click', () => {
            this.edit();
        });

        const deleteBtn = this.el.querySelector('.deleteBtn');
        deleteBtn.addEventListener('click', () => {
            this.delete(id);
        });

        this.el.addEventListener('mouseenter', () => {
            editBtn.classList.remove('hidden');
            deleteBtn.classList.remove('hidden');
        });

        this.el.addEventListener('mouseleave', () => {
            editBtn.classList.add('hidden');
            deleteBtn.classList.add('hidden');
        });

        if (done) {
            const todoTitle = this.el.querySelector('span');
            todoTitle.classList.add('done');
            this.el.removeChild(editBtn); 
        }
    }
}