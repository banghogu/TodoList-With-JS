import { Component } from "../core/core";
import TodoHeader from "./TodoHeader"
import TodoMain from "./TodoMain"
import TodoFooter from "./TodoFooter"


export default class TodoCon extends Component {
    render(){
        const todoHeader = new TodoHeader().el;
        const todoMain = new TodoMain().el
        const todoFooter = new TodoFooter().el;
        
        this.el.classList.add("todo-container")
        this.el.append(todoHeader,todoMain,todoFooter);
    }
}