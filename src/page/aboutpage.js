import {Component} from '../core/core'
import aboutstore from '../store/about'


export default class About extends Component {
    render(){
        const {photo,name,email,github} = aboutstore.state 
        this.el.classList.add('container','about');
        this.el.innerHTML = /* html */`
            <div style="background-image:url(${photo})"class="photo"></div>
            <p class="name">${name}</p>
            <p><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${email}" target="_blank">${email}</a></p>
            <p><a href="${github}" target="_blank">Github</a></p>

        `
    }
}