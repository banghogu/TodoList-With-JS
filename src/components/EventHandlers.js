import TodoCrudApi from './TodoCrudApi'

export default class EventHandlers {
    constructor(todoForm, deleteAllButton, deleteDoneButton, completeAllButton, todoInput, displayTodos) {
        this.todoForm = todoForm;
        this.deleteAllButton = deleteAllButton;
        this.deleteDoneButton = deleteDoneButton;
        this.completeAllButton = completeAllButton;
        this.todoInput = todoInput;
        this.displayTodos = displayTodos;

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.todoForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const todoTitle = this.todoInput.value;
            await TodoCrudApi.addTodoToAPI(todoTitle);
            const todos = await TodoCrudApi.getTodos();
            this.displayTodos(todos);
            this.todoInput.value = '';
        });

        this.deleteAllButton.addEventListener('click', async () => {
            const todos = await TodoCrudApi.getTodos();
            const idArray = todos.map(item => item.id);
            if (idArray.length > 0) {
                await TodoCrudApi.deleteAllTodosFromAPI(idArray);
                const updatedTodos = await TodoCrudApi.getTodos();
                this.displayTodos(updatedTodos);
            } else {
                console.log('삭제할 할일이 없습니다.');
            }
        });

        this.deleteDoneButton.addEventListener('click', async () => {
            const todos = await TodoCrudApi.getTodos();
            const doneIds = todos.filter(todo => todo.done).map(todo => todo.id);
            if (doneIds.length > 0) {
                await TodoCrudApi.deleteAllTodosFromAPI(doneIds);
                const updatedTodos = await TodoCrudApi.getTodos();
                this.displayTodos(updatedTodos);
            } else {
                console.log('삭제할 완료된 할일이 없습니다.');
            }
        });

        this.completeAllButton.addEventListener('click', async () => {
            const todos = await TodoCrudApi.getTodos();
            const notDoneIds = todos.filter(todo => todo.done==false).map(todo => todo.id);
            if (notDoneIds.length > 0) {
                notDoneIds.forEach(async (todoId) => {
                    const todo = todos.find(todo => todo.id === todoId);
                    if (todo) {
                        await TodoCrudApi.updateTodoById(todoId, todo.title, true, todo.order);
                    }
                });
                const updatedTodos = await TodoCrudApi.getTodos();
                this.displayTodos(updatedTodos);
            } else {
                console.log('완료할 미완료된 할일이 없습니다.');
            }
        });
    }
}