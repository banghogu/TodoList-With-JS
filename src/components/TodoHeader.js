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