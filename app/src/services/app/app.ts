

export default class app {
  getAllCards(): Promise<Response> {
    return fetch('http://localhost:3000/cards')
  }
}