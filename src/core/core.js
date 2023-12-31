export class Component {
    constructor(payload = {}) {
      const {
        tagName = 'div', // 최상위 요소의 태그 이름
        props = {},
        state = {}
      } = payload
      this.el = document.createElement(tagName) // 컴포넌트의 최상위 요소
      this.props = props // 컴포넌트가 사용될 때 부모 컴포넌트에서 받는 데이터
      this.state = state // 컴포넌트 안에서 사용할 데이터
      this.render()
    }
    render() { // 컴포넌트를 렌더링하는 함수
      // ...
    }
  }
  

  function routeRender(routes) {
    if (!location.hash) {history.replaceState(null, '', '/#/')}
    const routerView = document.querySelector('router-view')
    const [hash, queryString = ''] = location.hash.split('?') 
    const query = queryString
      .split('&')
      .reduce((acc, cur) => {
        const [key, value] = cur.split('=')
        acc[key] = value
        return acc
      }, {})
    history.replaceState(query, '') 
    const currentRoute = routes.find(route => new RegExp(`${route.path}/?$`).test(hash))
    routerView.innerHTML = ''
    routerView.append(new currentRoute.component().el)
    window.scrollTo(0, 0)}
  export function createRouter(routes) {
    return function () {
      window.addEventListener('popstate', () => {
        routeRender(routes)
      })
      routeRender(routes)
    }
  }
  export class Store {
    constructor(state) {
      this.state = {} // 상태(데이터)
      this.observers = {}
      for (const key in state) {
        // 각 상태에 대한 변경 감시(Setter) 설정!
        Object.defineProperty(this.state, key, {
          // Getter
          get: () => state[key],
          // Setter
          set: val => {
            state[key] = val
            if (Array.isArray(this.observers[key])) { // 호출할 콜백이 있는 경우!
              this.observers[key].forEach(observer => observer(val))
            }
          }
        })
      }
    }
    // 상태 변경 구독!
    subscribe(key, cb) {
      Array.isArray(this.observers[key]) // 이미 등록된 콜백이 있는지 확인!
        ? this.observers[key].push(cb) // 있으면 새로운 콜백 밀어넣기!
        : this.observers[key] = [cb] // 없으면 콜백 배열로 할당!
    }
  }