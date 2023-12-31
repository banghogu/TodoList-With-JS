import { Component } from "../core/core";
import TodoCrudApi from "./TodoCrudApi";
import CustomModal from './swal';

export default class TodoMain extends Component {
    constructor() {
        super({
            tagName: "main"
        });
    }

    render() {
        this.el.innerHTML = /* html */`
            <div id="todoMainContainer"> 
                <ul id="todoItems"></ul>
            </div>
        `;

        document.addEventListener('DOMContentLoaded', async () => { //dom이 로드 될 때
            const todoMainContainer = document.getElementById('todoMainContainer');
            const todoItems = todoMainContainer.querySelector('#todoItems');
            const todos = await TodoCrudApi.getTodos(); //getTodos()로 조회한 값들을 todos에 넣어준다.

            displayTodos(todos); //가져온 todos를 화면을 그려주는 displayTodos에 넣어준다.

            function displayTodos(todos) {
                todoItems.innerHTML = '';
            
                todos.forEach(todo => {
                    const todoItem = document.createElement("li");
                    todoItem.classList.add("todo-item");

                    const firstItemContainer = document.createElement("div");
                    firstItemContainer.classList.add("first-item-container")

                    const itemContainer = document.createElement("div"); // 수정, 삭제 버튼을 감싸는 컨테이너
                    itemContainer.classList.add("item-container");
            
                    const checkbox = document.createElement("input");
                    checkbox.classList.add("checkbox");
                    checkbox.type = "checkbox";
                    checkbox.checked = todo.done;
            
                    checkbox.addEventListener('change', function () {
                        toggleTodoStatus(todo.id, checkbox.checked);
                    });
            
                    if (todo.done) {
                        todoItem.classList.add('done');
                    }
            
                    const todoContent = document.createElement("span");
                    todoContent.textContent = todo.title;
            
                    const editButton = document.createElement("button");
                    editButton.textContent = "수정";
                    editButton.classList.add("hidden");
                    if (todo.done) {
                        editButton.style.display = 'none';
                    }
                    editButton.addEventListener('click', function () {
                        showEditOptions(todo);
                    });
            
                    const deleteButton = document.createElement("button");
                    deleteButton.textContent = "삭제";
                    deleteButton.classList.add("hidden");
                    deleteButton.addEventListener('click', function () {
                        deleteTodoByIdWithConfirmation(todo.id);
                    });
            
                    itemContainer.appendChild(editButton);
                    itemContainer.appendChild(deleteButton);
                    firstItemContainer.appendChild(checkbox)
                    firstItemContainer.appendChild(todoContent)
                    todoItem.appendChild(firstItemContainer);
                    todoItem.appendChild(itemContainer);

                    todoItem.addEventListener('mouseenter', function () {
                        editButton.classList.remove('hidden');
                        deleteButton.classList.remove('hidden');
                    });
            
                    todoItem.addEventListener('mouseleave', function () {
                        editButton.classList.add('hidden');
                        deleteButton.classList.add('hidden');
                    });
                    todoItems.appendChild(todoItem);
                });
            }
            
            function deleteTodoByIdWithConfirmation(todoId) {
                // CustomModal 클래스의 인스턴스를 생성
                const deleteModal = new CustomModal(_deleteHandler);

                // 확인 모달 표시
                deleteModal.showConfirmation(todoId);

                // 실제 삭제를 위한 핸들러 함수 정의
                function _deleteHandler(todoId) {
                    // 할일 삭제 수행
                    TodoCrudApi.deleteTodoById(todoId)
                        .then(async () => {
                            // 성공 메시지 표시
                            deleteModal.showDeletionSuccess();
                            const updatedTodos = await TodoCrudApi.getTodos();
                            displayTodos(updatedTodos);
                        })
                        .catch(error => {
                            // 삭제 중 오류가 발생한 경우 오류 메시지 표시
                            console.error("할일 삭제 오류:", error);
                        });
                }
            }
            function showEditOptions(todo) {
                CustomModal.showEditPrompt(todo.title)
                  .then(newTitle => {
                    if (newTitle !== null) {
                      updateTodoById(todo.id, newTitle, todo.done, todo.order);
                    }
                  });
              }
            async function updateTodoById(todoId, newTitle, done, order) {
                await TodoCrudApi.updateTodoById(todoId, newTitle, done, order);
                const updatedTodos = await TodoCrudApi.getTodos();
                displayTodos(updatedTodos);
            }

            async function toggleTodoStatus(todoId, isChecked) {
                const todos = await TodoCrudApi.getTodos(); // 토글 이벤트 발생 전에 todos를 갱신
                const newDoneValue = isChecked;
                const todo = todos.find(t => t.id === todoId);
            
                if (todo) {
                    await TodoCrudApi.updateTodoById(todoId, todo.title, newDoneValue, todo.order);
                    const updatedTodos = await TodoCrudApi.getTodos();
                    displayTodos(updatedTodos);
                } else {
                    console.error("해당 todo를 찾을 수 없습니다.");
                }
            }
            

            const addTodoButton = document.querySelector('.addTodoButton');
            addTodoButton.addEventListener('click', async () => {
                // 새로운 todo를 입력 받기 위한 prompt 표시
                const newTodoTitle = await CustomModal.showInputPrompt();

                // 사용자가 입력한 내용이 있으면 추가
                if (newTodoTitle) {
                    await TodoCrudApi.addTodoToAPI(newTodoTitle);
                    const updatedTodos = await TodoCrudApi.getTodos();
                    displayTodos(updatedTodos);
                }
            });
        });
    }
} 