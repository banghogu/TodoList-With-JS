
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
  }