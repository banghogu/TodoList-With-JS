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

            function displayTodos(todos) { //화면을 그려주는 함수
                todoItems.innerHTML = ''; //todoItems들을 초기화 해준 후

                todos.forEach(todo => { //각각의 todo 아이템 마다 요소를 생성한다.
                    const todoItem = document.createElement("li"); //ul에 들어가야 하니까 li로 만들어주고

                    // 할 일 완료 체크박스 추가
                    const checkbox = document.createElement("input"); //할일 완료 체크박스를 추가해준다.
                    checkbox.type = "checkbox";
                    checkbox.checked = todo.done; //done이 true면 체크박스가 체크 되어있다.
                    checkbox.addEventListener('change', function () { //체크박스가 변경 될 때마다 
                        toggleTodoStatus(todo.id, checkbox.checked); //todo.id, 체크박스 체크여부를 함수에 넣어준다.
                    });
                    // toggleTodoStatus함수를 돌면 새롭게 아이템들을 가져와서 화면을 보여주는데
                    if (todo.done) { //todo의 done이 true이면 
                        todoItem.classList.add('done'); //클래스에 done 추가
                    }
                    todoItem.appendChild(checkbox); //체크박스 버튼을 li태그에 넣어준다.

                    // 할일 내용 출력
                    const todoContent = document.createElement("span"); //item title이 들어갈 span태그를 만들고
                    todoContent.textContent = todo.title; // item title을 넣어주고
                    todoItem.appendChild(todoContent); //text를 li태그에 넣어준다.

                    // 수정버튼 추가
                    const editButton = document.createElement("button");
                    editButton.textContent = "수정";
                    if (todo.done) {
                        editButton.style.display = 'none';
                    }
                    editButton.addEventListener('click', function () {
                        showEditOptions(todo);
                      });

                    todoItem.appendChild(editButton);

                    // 삭제 버튼 추가
                    const deleteButton = document.createElement("button"); //삭제 버튼을 만들고
                    deleteButton.textContent = "삭제"; //버튼 요소 text는 삭제
                    deleteButton.addEventListener('click', function () { //삭제 버튼을 클릭하면?
                        deleteTodoByIdWithConfirmation(todo.id); //해당 todo id를 함수에 넣어준다.
                    });
                    todoItem.appendChild(deleteButton); //li태그에 deleteButton을 넣어준다.

                    //모든 요소들을 todoitem li태그에 넣어준다. 각 item완성
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