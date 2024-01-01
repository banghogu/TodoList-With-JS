import { Component } from "../core/core";
import TodoCon from "../components/TodoCon";
import Weather from "../components/weather";

export default class Homepage extends Component {
    render(){
        const todoCon= new TodoCon().el
        const weather = new Weather().el
        this.el.append(todoCon,weather);
    }
}