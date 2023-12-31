import {Component} from './core/core'
import Homepage from './page/Homepage'

export default class App extends Component {
    render(){
        const homepage = new Homepage().el 
        this.el.append(homepage)
    }
}