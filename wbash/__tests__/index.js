const supertest = require('supertest')

let PORT = 8888

describe('cli', () => {
  let request

  beforeEach(() => {
    request = supertest(`http://localhost:${PORT}`)
  })

  afterEach(() => {})
  describe('helloworld1', () => {
    test('1should support basic data back from server', done => {
      request
        .get('/test')
        .expect(200)
        .end(done)
    })
  })
})
