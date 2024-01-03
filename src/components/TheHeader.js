import { Component } from '../core/core'

export default class TheHeader extends Component {
    render() {
        this.el.innerHTML = /* html */`  
                <span>header</span>
        `
    }
}