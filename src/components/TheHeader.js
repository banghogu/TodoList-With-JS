import { Component } from '../core/core'

export default class TheHeader extends Component {
    constructor() {
        super({
            state: {
                menus: [
                    {
                        name: 'Todo',
                        href: '#/'
                    },
                    {

                        name: 'About',
                        href: '#/about'

                    }
                ]
            }
        })
        window.addEventListener('popstate', () => {
            this.render();
        })
    }
    render() {
        this.el.classList.add('header');
        this.el.innerHTML = /* html */`
            <nav>
                <ul>
                    ${this.state.menus.map(menu => {
                        const href = menu.href.split('?')[0]
                        const hash = location.hash.split('?')[0]
                        const isActive = href === hash
                        return /* html */`
                            <li>
                                <a class="${isActive? 'active' : ''}" 
                                href="${menu.href}">${menu.name}</a>
                            </li>
                        `
                    }).join('')}
                </ul>
            </nav>
            <a href="#/about" class="user">
                <img src="https://1.gall-img.com/hygall/files/attach/images/82/489/259/237/1926aa0bdf9b50b95cf9373cc6bc6b37.png" />
            </a>

        `
    }
}