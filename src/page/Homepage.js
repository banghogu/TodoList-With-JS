import { Component } from "../core/core";
import TodoCon from "../components/TodoCon";

export default class Homepage extends Component {
    render(){
        const todoCon= new TodoCon().el
        this.el.append(todoCon)
    }
}