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

        document.addEventListener('DOMContentLoaded', async () => { //처음 dom이 로드되면
            const todoMainContainer = document.getElementById('todoMainContainer');
            const todoItems = todoMainContainer.querySelector('#todoItems');
            const todos = await TodoCrudApi.getTodos();  //할일 목록을 가져와서

            displayTodos(todos); //할일 목록을 바탕으로 화면을 그려주는 함수에 넣는다.

            function displayTodos(todos) { //할일 아이템을 통해 화면을 그려주는 함수
                todoItems.innerHTML = '';
            
                todos.forEach(todo => { //할일 각각의 아이템들은 
                    const todoItem = document.createElement("li"); //li태그를 먼저 만들고
                    todoItem.classList.add("todo-item");

                    const firstItemContainer = document.createElement("div"); //체크박스,title 저장하는 div
                    firstItemContainer.classList.add("first-item-container") 

                    const itemContainer = document.createElement("div"); //수정,삭제 버튼을 저장하는 div
                    itemContainer.classList.add("item-container");
            
                    const checkbox = document.createElement("input"); //체크 박스 생성
                    checkbox.classList.add("checkbox");
                    checkbox.type = "checkbox";
                    checkbox.checked = todo.done; //해당 todo의 done을 가져와서 체크박스 체크 여부에 넣는다.
            
                    checkbox.addEventListener('change', function () { //체크박스를 토글 할 시 
                        toggleTodoStatus(todo.id, checkbox.checked); //해당 todo의 id, check 여부를 넣어준다.
                    });
            
                    if (todo.done) { //todo.done == true, 즉 체크박스가 체크될 시
                        todoItem.classList.add('done'); //해당 todo에 done 클래스를 넣어 밑줄을 그려준다.
                    }
            
                    const todoContent = document.createElement("span"); //todo title을 출력하는 span태그
                    todoContent.textContent = todo.title;
            
                    const editButton = document.createElement("button"); //수정버튼을 만들고
                    editButton.textContent = "수정";
                    editButton.classList.add("hidden"); //마우스를 올려놓을때만 보여지게 할 것이므로 hidden 상태를 넣어준다.
                    if (todo.done) { //todo.done = true 즉 할일이 완료된 상태이면 수정 할 수 없게 display none
                        editButton.style.display = 'none';
                    }
                    editButton.addEventListener('click', function () { //수정버튼을 클릭하면 해당 todo 를 넣어준다.
                        showEditOptions(todo);
                    });
            
                    const deleteButton = document.createElement("button"); //삭제버튼을 만들고
                    deleteButton.textContent = "삭제";
                    deleteButton.classList.add("hidden"); //마우스를 올릴때만 보여지게 하기 위해 처음에 hidden 클래스 추가
                    deleteButton.addEventListener('click', function () {
                        deleteTodoByIdWithConfirmation(todo.id); //todo id를 삭제 함수에 넣어준다.
                    });
            
                    itemContainer.appendChild(editButton);
                    itemContainer.appendChild(deleteButton);
                    firstItemContainer.appendChild(checkbox)
                    firstItemContainer.appendChild(todoContent)
                    todoItem.appendChild(firstItemContainer);
                    todoItem.appendChild(itemContainer);

                    todoItem.addEventListener('mouseenter', function () { //마우스가 들어오면 hidden 클래스 제거
                        editButton.classList.remove('hidden');
                        deleteButton.classList.remove('hidden');
                    });
            
                    todoItem.addEventListener('mouseleave', function () { //마우스빼면 hidden 클래스 다시 추가
                        editButton.classList.add('hidden');
                        deleteButton.classList.add('hidden');
                    });
                    todoItems.appendChild(todoItem);
                });
            }
            
            function deleteTodoByIdWithConfirmation(todoId) { //todo id를 이용하여 항목을 삭제하는 함수
                const deleteModal = new CustomModal(_deleteHandler); //모달창을 띄우기 위해 핸들러에 삭제 함수를 넣은 모달창을 인스턴스로 만들어준다

                deleteModal.showConfirmation(todoId); //모달창을 띄우고 true일 시 _deleteHandler(todoId)가 작동

                function _deleteHandler(todoId) {
                    TodoCrudApi.deleteTodoById(todoId) //삭제하고
                        .then(async () => {
                            deleteModal.showDeletionSuccess(); //잘 삭제됐다는 모달창 띄우고
                            const updatedTodos = await TodoCrudApi.getTodos(); //삭제했으니까 다시 목록들 가져와서
                            displayTodos(updatedTodos); //화면을 그려준다.
                        })
                        .catch(error => {
                            console.error("할일 삭제 오류:", error);
                        });
                }
            }
            function showEditOptions(todo) { //수정 버튼을 눌렀을 때
                CustomModal.showEditPrompt(todo.title) //input창에 새로운 할일을 newTitle로 받고
                  .then(newTitle => {
                    if (newTitle !== null) { //비어있지않으면
                      updateTodoById(todo.id, newTitle, todo.done, todo.order); //업데이트 해준다.
                    }
                  });
              }

            async function updateTodoById(todoId, newTitle, done, order) { //crudapi 해당 함수가 있지만 다시 쓴 이유는 항목이 변경 될 시 다시 목록을 가져와서 화면에 출력하는 과정을 위해 다시 함수를 써주었다.
                await TodoCrudApi.updateTodoById(todoId, newTitle, done, order);
                const updatedTodos = await TodoCrudApi.getTodos();
                displayTodos(updatedTodos);
            }

            async function toggleTodoStatus(todoId, isChecked) { //체크박스를 클릭했을 때 
                const todos = await TodoCrudApi.getTodos(); //todos를 가져오고
                const newDoneValue = isChecked; //체크박스의 새로운 상태를 넣어준다.
                const todo = todos.find(t => t.id === todoId); //가져온 todo와 체크박스가 토글된 해당 item의 id를 비교해서 todo를 찾고
            
                if (todo) { //해당 todo가 있으면 
                    await TodoCrudApi.updateTodoById(todoId, todo.title, newDoneValue, todo.order); //새롭게 done을 업데이트해준다.
                    const updatedTodos = await TodoCrudApi.getTodos(); //업데이트 됐으면 다시 가져와서
                    displayTodos(updatedTodos); //화면에 그려준다.
                } else {
                    console.error("해당 todo를 찾을 수 없습니다.");
                }
            }

            const addTodoButton = document.querySelector('.addTodoButton'); //footer에서 addbutton을 가져온다
            addTodoButton.addEventListener('click', async () => { //add 버튼 누르면
                const newTodoTitle = await CustomModal.showInputPrompt(); //새로운 item title을 받고

                if (newTodoTitle) { 
                    await TodoCrudApi.addTodoToAPI(newTodoTitle); //새로운 title을 통해 아이템을 생성하고
                    const updatedTodos = await TodoCrudApi.getTodos(); //목록을 가져와서
                    displayTodos(updatedTodos); //화면에 그려준다.
                }
            });
        });
    }
} 