## 📌 프로젝트 설명 및 요구사항

### 할 일(Todo) 관리 페이지 만들기

- [ ] 원하는 특정 기업을 하나 선정하거나 새로운 가상의 기업을 만드세요!
- [ ] 해당 기업의 할 일 목록(List)이 출력되는 페이지가 있어야 합니다! (예시)`example.com/`)
- [ ] 해당 기업 혹은 담당 개발자에 대한 간단한 소개 페이지가 포함돼야 합니다! (예시) `example.com/about`)
- [ ] 할 일 항목(Item)을 새롭게 추가할 수 있어야 합니다!
- [ ] 실제 서비스로 배포하고 외부에서 접근 가능한 링크를 추가해야 합니다! (Vercel, Netlify, AWS, GCP 등)
- [ ] 각 페이지를 데스크탑과 모바일 등 다양한 디바이스 크기에 대응하는 반응형 레이아웃으로 만들어야 합니다!


배포한 사이트 : https://todolist-with-node.vercel.app/#/

---

**과제 중간점검 프로젝트 기간 : 2023/12/22 ~ 2024/01/01**

**중간점검 결과물 : 해당 레포지토리 코드를 다운받거나 clone 후 npm install → npm run dev 하시면 됩니다**

→최종 수정 완료

https://github.com/banghogu/todolist-with-node

**참고 : 주어진 todolist api를 이용하여 기본적인 CRUD를 해보았습니다. 정상적으로 동작하지만, 코드 최적화가 필요합니다. 코드 최적화 이전과 이후 사이트 성능을 비교해보기 위해 1차적인 중간점검 프로젝트를 먼저 리뷰해봅니다.**

---

### 화면 구성

전체 화면

![](https://velog.velcdn.com/images/banghogu/post/cedfbb7b-2eec-4336-9bc4-45d293c35a8f/image.png)

![](https://velog.velcdn.com/images/banghogu/post/df654b60-5a89-4b54-b657-ac39e2411f86/image.png)

---

### 파일 트리
![](https://velog.velcdn.com/images/banghogu/post/b82b2801-55e9-49c8-a367-683ff17c1685/image.png)


---

### 주요 코드

**src > components > TodoCrudApi.js**

```jsx
**TodoCrudApi.js**

export default class TodoCrudApi {
    static getTodos() {
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      myHeaders.append("apikey", "KDT7_GrZ1eYBo");
      myHeaders.append("username", "KDT7_BangHoJin");
      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };
      return fetch("https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos", requestOptions)
        .then(response => response.json())
        .then(todos =>
          todos.map(todo => ({
            ...todo,
            done: Boolean(todo.done),
          }))
            .sort((a, b) => b.order - a.order)
        );
    }
  
    static updateTodoById(todoId, newTitle, done, order) {
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      myHeaders.append("apikey", "KDT7_GrZ1eYBo");
      myHeaders.append("username", "KDT7_BangHoJin");
  
      const raw = JSON.stringify({
        "title": newTitle,
        "done": done,
        "order": order
      });
  
      const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      return fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todoId}`, requestOptions)
        .then(response => response.json());
    }
  
    static addTodoToAPI(todoTitle) {
      return TodoCrudApi.getTodos()
        .then(result => {
          const orderArray = result.map(item => item.order);
          const maxOrder = orderArray.reduce((max, order) => Math.max(max, order), 0);
          const newOrder = maxOrder + 1;
  
          const myHeaders = new Headers();
          myHeaders.append("content-type", "application/json");
          myHeaders.append("apikey", "KDT7_GrZ1eYBo");
          myHeaders.append("username", "KDT7_BangHoJin");
  
          const raw = JSON.stringify({
            "title": todoTitle,
            "order": newOrder,
          });
  
          const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
          };
  
          return fetch("https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos", requestOptions)
            .then(response => response.json());
        });
    }
  
    static deleteTodoById(todoId) {
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      myHeaders.append("apikey", "KDT7_GrZ1eYBo");
      myHeaders.append("username", "KDT7_BangHoJin");
  
      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: '',
        redirect: 'follow'
      };
  
      return fetch(`https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/${todoId}`, requestOptions)
        .then(response => response.json());
    }
  
    static deleteAllTodosFromAPI(todoIds) {
      const myHeaders = new Headers();
      myHeaders.append("content-type", "application/json");
      myHeaders.append("apikey", "KDT7_GrZ1eYBo");
      myHeaders.append("username", "KDT7_BangHoJin");
  
      const raw = JSON.stringify({
        "todoIds": todoIds
      });
  
      const requestOptions = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
      };
  
      return fetch("https://asia-northeast3-heropy-api.cloudfunctions.net/api/todos/deletions", requestOptions)
        .then(response => response.json());
    }
  }
```

CURD api를 기능을 모아넣은 파일입니다. export 해서, 언제든지 다른 파일에서 해당 api 요청 코드를 사용 할 수 있게 해주었습니다.

**static getTodos()** : 할일 목록을 조회하는 api 요청 코드입니다. postman을 이용해서 요청 코드를 가져왔습니다. 글을 작성 하면 order가 2,3,4 1씩 올라가서 가장 최근에 추가한 order 순서대로 화면에 출력하기 위해 .sort((a, b) => b.order - a.order) 코드를 추가 했습니다.

**static addTodoToAPI(todoTitle)** : 할일을 추가하는 api 요청코드입니다. 할일 order의 순서를 보장하기 위해 TodoCrudApi.getTodos()로 할일을 전부 가져와 최대 order값을 구했습니다. title은 매개변수로 받은 title, order는 최대 order값 + 1은 해준 새로운 order를 넣어줬습니다.

**static deleteTodoById(todoId)** : 할일을 삭제하는 api 요청 코드입니다. 매개변수로 삭제하려는 id값을 넣어주어 삭제 요청을 보냅니다.

---

**src > components > Swal.js**

```jsx
**Swal.js**

import Swal from 'sweetalert2';

class CustomModal {
  constructor(modalHandler) {
    this.modalHandler = modalHandler;
  }
  static async showEditPrompt(currentTitle) {
    const { value: newTitle } = await Swal.fire({
      input: "text",
      inputValue: currentTitle,
      inputLabel: "할 일을 수정 하시나요?",
      inputPlaceholder: "여기에 수정 할 할일 입력",
      inputAttributes: {
        "aria-label": "Type the new todo text here"
      },
      showCancelButton: true
    });

    return newTitle;
  }
  async showConfirmation(todoId) {
    const result = await Swal.fire({
      title: '삭제하세요?',
      text: '복구 할 수 없어요!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제'
    });

    if (result.isConfirmed) {
      this.modalHandler(todoId);
    }
  }

  showDeletionSuccess() {
    Swal.fire({
      title: '삭제되었습니다',
      text: '할일이 삭제 되었습니다.',
      icon: 'success'
    });
  }

  static async showInputPrompt() {
    const { value: text } = await Swal.fire({
      input: "text",
      inputLabel: "새로운 할 일을 추가해보세요",
      inputPlaceholder: "여기에 새로운 할 일 작성",
      inputAttributes: {
        "aria-label": "Type your new todo here"
      },
      showCancelButton: true
    });

    return text;
  }
}

export default CustomModal;
```

https://sweetalert2.github.io/

해당 사이트를 이용해서 모달 창을 구현했습니다. 할일이 삭제될 때, 할일이 수정될 때, 할일이 추가 될 때 해당되는 모달창을 띄웁니다. 모든 swal 함수들은 비동기로 작동하기 위해 async, await 패턴을 사용했습니다.

---

**src > components > TodoHeader.js**

```jsx

import { Component } from "../core/core";

export default class TodoHeader extends Component {
    constructor() {
        super({
            tagName: "header",
            state: {
                today: [
                    {
                        days: "",
                        date: ""
                    }
                ]
            },
        })
    }
    render() {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.state.today.days = daysOfWeek[dayOfWeek];
        this.state.today.date = `${months[today.getMonth()]} ${today.getDate()}`;
        this.el.innerHTML = /* html */`
            <div id="todoHeaderContainer">
                <span class="days">${this.state.today.days}, </span>&nbsp;
                <span class="date">${this.state.today.date}</span>
            </div>
        `;
    }
}
```

TodoHeader에는 오늘 요일과 날짜가 들어갑니다. 따라서 오늘의 요일과 날짜를 변수로 저장하고, 저장된 값을 해당 today state를 이용해서 넣어주어 innerHTML로 보여지게 했습니다. 이 때 굳이 state를 안쓰고 그냥 바로 저장된 요일, 날짜를 넣어줘도 될 것 같습니다.

---

**src > components > TodoFooter.js**

```jsx

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
```

TodoFooter에는 몇개의 tasks 할일이 있는지 화면에 출력되고, 할일을 추가 할 수 있는 addnew 버튼이 있습니다. 

### 📌 개선점1

TodoFooter에는 오류가 있는데 todos 할일이 추가, 삭제 등 변경 될 시 변경점을 감지하지 못해 아이템이 추가 삭제 돼도 그대로 tasks가 유지되는 현상이 발생한다. 즉 화면이 처음 렌더링 될 때 getTodos()로 아이템들을 가져와 할일 갯수가 잘 출력되지만 수정, 삭제 될 시 이 변경점을 감지 하지 못하고 처음 getTodos()로 가져온 아이템들 갯수만 출력되는 것이다. 이 오류를 해결하기 위해 store를 사용해서 todos ID목록에 subscribe를 걸어 목록이 수정될 때 감지하여 새로운 tasks 갯수를 출력되는 콜백 함수를 작성해야 한다.

---

**src > components > TodoMain.js**

```jsx

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
```

![](https://velog.velcdn.com/images/banghogu/post/49eaf7e5-58d2-4119-94f2-09531d051f07/image.png)


### 📌 개선점2

현재 DOMContentLoaded라는 이벤트로 처음 화면이 로드 될 때 화면을 그려주고 있는데, store를 사용해서, store state에 todosId라는 빈배열을 만들고 getTodos()로 todoitem들의 Id를 state todosId에 넣어주면, 콜백함수로 화면을 그려주는 함수가 실행되는 코드로 바꿔줘야 한다.

### 📌 개선점3

현재 todo 아이템들이 업데이트, 삭제, 추가 될 때 해당 요청을 보낸 후 getTodos()로 다시 전부 가져오고 화면을 출력하기 때문에 불필요한 api 요청이 일어나 화면이 버벅거린다. 때문에 업데이트, 삭제, 추가 api 요청은 단 한번만 일어나게하고, 해당 id를 화면에서 찾아내 추가, 삭제, 업데이트 하도록 해줘야 한다. 

**생각해봐야 할 점 →** 어떻게 해야 변경이 일어났음을 감지하고 해당 id를 찾을 수 있을까. 개선점 2처럼 수정,삭제,추가 api 요청시 어쨋든 이후에 getTodos()를 요청까지 날려줘야 store state에서 변경 사항을 감지 할 수 있을텐데, 아예 getTodos() 요청을 안보내는 법이 있을까 생각해봐야 한다.

**나의 방법** : 수정, 삭제, 업데이트 되면 변경이 일어난 해당 id를 가져와서 find 메서드로 store state todoId 에서 해당 todo아이템을 찾고 화면에서 지운다.

### 📌 개선점4

api 데이터에 익숙해져보는 과제 목적에 따라 날씨 데이터를 가져와서 화면에 실시간 날씨를 출력해본다. 

### 📌 개선점5

할일 최대 갯수를 추가해본다. 

### 📌 개선점6

about페이지를 만들고 각 페이지에 맞게 라우터를 연결해본다.

---

## 개선점 수정 2024 /1 /12

📌 개선점1 : TodoFooter에는 오류가 있는데 todos 할일이 추가, 삭제 등 변경 될 시 변경점을 감지하지 못해 아이템이 추가 삭제 돼도 그대로 tasks가 유지되는 현상이 발생한다. 즉 화면이 처음 렌더링 될 때 getTodos()로 아이템들을 가져와 할일 갯수가 잘 출력되지만 수정, 삭제 될 시 이 변경점을 감지 하지 못하고 처음 getTodos()로 가져온 아이템들 갯수만 출력되는 것이다. 이 오류를 해결하기 위해 store를 사용해서 todos ID목록에 subscribe를 걸어 목록이 수정될 때 감지하여 새로운 tasks 갯수를 출력되는 콜백 함수를 작성해야 한다.

-> store에 todoItems라는 데이터를 추가해서 이를 subscribe하여 목록이 변할 때 마다 tasks가 수정되게 바꾸었다.
![](https://velog.velcdn.com/images/banghogu/post/1f778873-ed7c-49fb-bd1e-335da9dbc56d/image.png)

---

📌개선점2 : 현재 DOMContentLoaded라는 이벤트로 처음 화면이 로드 될 때 화면을 그려주고 있는데, store를 사용해서, store state에 todosId라는 빈배열을 만들고 getTodos()로 todoitem들의 Id를 state todosId에 넣어주면, 콜백함수로 화면을 그려주는 함수가 실행되는 코드로 바꿔줘야 한다.

-> 이 역시 todoItems데이터를 subscribe하여서 초기에 getTodoItems 함수를 이용해서 todoItems 항목을 변경 시키면 그 때 화면이 render되게 해주었다.
![](https://velog.velcdn.com/images/banghogu/post/35f2a7bf-563d-42fa-8884-0377770ac27c/image.png)

---

📌 개선점3

현재 todo 아이템들이 업데이트, 삭제, 추가 될 때 해당 요청을 보낸 후 getTodos()로 다시 전부 가져오고 화면을 출력하기 때문에 불필요한 api 요청이 일어나 화면이 버벅거린다. 때문에 업데이트, 삭제, 추가 api 요청은 단 한번만 일어나게하고, 해당 id를 화면에서 찾아내 추가, 삭제, 업데이트 하도록 해줘야 한다.

-> 수정 이전 코드는 todoItems 항목 하나라도 바뀔 시 전부 리랜더링 하여 불필요한 api요청으로 동작 시간이 매우 오래걸렸다. 때문에 부모 컴포넌트에서 todoItems 각 항목을 props로 넘겨서 전부 다시 그리는것이 아닌 각 항목마다 랜더링 하는 함수와 컴포넌트를 작성했다.

![](https://velog.velcdn.com/images/banghogu/post/695fbe3d-a244-4983-9734-5f089bf35f18/image.png)

이 전에는 모든 아이템을 가져오고, 수정하고, 추가하고, 삭제하는 코드들이 위 main 파일에 있었지만 TodoMainItem이라는 각 아이템을 만드는 컴포넌트로 분리하였고, api요청이 일어날시 해당 아이템에서만 api요청이 일어난다.

---

📌 개선점4

api 데이터에 익숙해져보는 과제 목적에 따라 날씨 데이터를 가져와서 화면에 실시간 날씨를 출력해본다. 

-> openweathermap을 이용해 날씨를 받아오는 api를 다뤄봤다. 이 역시 ![](https://velog.velcdn.com/images/banghogu/post/0a0c8856-bcd0-49df-a20a-2d5e89392cf3/image.png)
스토어로 날씨 데이터를 관리 하여 날씨 컴포넌트 파일에서 날씨 요청 api를 날려주면 해당 store state에 저장되고 그 순간 랜더되어 날씨가 출력된다.

---

📌 개선점5

할일 최대 갯수를 추가해본다. 

-> 최대 할일 갯수를 추가하였고 이를 넘었을시 경고 모달창이 뜨도록 수정했다.
![](https://velog.velcdn.com/images/banghogu/post/a562bc86-bccb-4fa6-a5c1-14f9e921fe1f/image.png)

---

📌 개선점6

about페이지를 만들고 각 페이지에 맞게 라우터를 연결해본다.

-> 영화 예제 사이트를 참고하여 router, about 페이지를 만들어 적용시켰다.

