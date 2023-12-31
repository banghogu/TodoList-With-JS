import { Component } from "../core/core";
import TodoCrudApi from "./TodoCrudApi";
import EventHandlers from "./EventHandlers";

export default class CreateEl extends Component {
    render() {
        this.el.innerHTML = /* html */`
            <form id="todoForm">
                <label for="todoInput">할일:</label>
                <input type="text" id="todoInput" required>
                <button type="submit">추가</button>
            </form>

            <!-- 할일 목록을 표시할 곳 -->
            <div>
                <div id="doneListContainer">
                    <h2>완료된 할일</h2>
                    <ul id="doneList"></ul>
                    <button id="deleteDoneButton">완료된 할일 모두 삭제</button>
                </div>
                <div id="notDoneListContainer">
                    <h2>미완료된 할일</h2>
                    <ul id="notDoneList"></ul>
                    <button id="completeAllButton">미완료된 할일 전체 완료</button>
                </div>
            </div>

            <button id="deleteAllButton">모두 삭제</button>
        `;

        document.addEventListener('DOMContentLoaded', async () => {
            const todoForm = document.getElementById('todoForm');
            const todoInput = document.getElementById('todoInput');
            const doneList = document.getElementById('doneList');
            const notDoneList = document.getElementById('notDoneList');
            const deleteAllButton = document.getElementById('deleteAllButton');
            const deleteDoneButton = document.getElementById('deleteDoneButton');
            const completeAllButton = document.getElementById('completeAllButton');

            // 데이터를 가져와서 초기화
            const todos = await TodoCrudApi.getTodos();
            displayTodos(todos);

            const eventHandlers = new EventHandlers(
                todoForm,
                deleteAllButton,
                deleteDoneButton,
                completeAllButton,
                todoInput,
                displayTodos
            );

            function displayTodos(todos) {
                doneList.innerHTML = '';
                notDoneList.innerHTML = '';

                todos.forEach(todo => {
                    const todoItem = document.createElement("li");

                    // 할일 내용 출력
                    const todoContent = document.createElement("span");
                    todoContent.textContent = todo.title;
                    todoItem.appendChild(todoContent);

                    // 삭제 버튼 추가
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "삭제";
                    deleteButton.addEventListener('click', function () {
                        deleteTodoById(todo.id);
                    });
                    todoItem.appendChild(deleteButton);

                    // 수정 버튼 추가
                    const editButton = document.createElement("button");
                    editButton.textContent = "수정";
                    editButton.addEventListener('click', function () {
                        const editInput = document.createElement("input");
                        editInput.type = "text";
                        editInput.value = todo.title;

                        const confirmButton = document.createElement("button");
                        confirmButton.textContent = "확인";
                        confirmButton.addEventListener('click', function () {
                            const newDoneValue = todo.done;
                            updateTodoById(todo.id, editInput.value, newDoneValue, todo.order);
                        });

                        const cancelButton = document.createElement("button");
                        cancelButton.textContent = "취소";
                        cancelButton.addEventListener('click', function () {
                            todoItem.removeChild(editInput);
                            todoItem.removeChild(confirmButton);
                            todoItem.removeChild(cancelButton);
                        });

                        todoItem.appendChild(editInput);
                        todoItem.appendChild(confirmButton);
                        todoItem.appendChild(cancelButton);
                    });
                    todoItem.appendChild(editButton);

                    // 완료 버튼 추가
                    const completeButton = document.createElement("button");
                    completeButton.textContent = "완료";
                    completeButton.addEventListener('click', function () {
                        const newDoneValue = !todo.done;
                        updateTodoById(todo.id, todo.title, todo.order, newDoneValue);
                    });
                    todoItem.appendChild(completeButton);

                    if (todo.done) {
                        todoItem.classList.add('done');
                        todoItem.removeChild(completeButton);
                        todoItem.removeChild(editButton);
                        doneList.appendChild(todoItem);
                    } else {
                        notDoneList.appendChild(todoItem);
                    }
                });
            }

            async function deleteTodoById(todoId) {
                await TodoCrudApi.deleteTodoById(todoId);
                const updatedTodos = await TodoCrudApi.getTodos();
                displayTodos(updatedTodos);
            }

            async function updateTodoById(todoId, newTitle, done, order) {
                await TodoCrudApi.updateTodoById(todoId, newTitle, done, order);
                const updatedTodos = await TodoCrudApi.getTodos();
                displayTodos(updatedTodos);
            }
        });
    }
}
