import App from './App'
import router from './page/index'

const root = document.querySelector('#root')
root.append(new App().el)
router()