const mysql = require('mysql')
var bridge = {
  connected: false,
  con: undefined
};

bridge.con

export const sqlBridge = {
  establishCon: async (payload) => {
    return new Promise((resolve, reject) => {
      try {
        bridge.con = mysql.createConnection({
          host: "localhost",
          user: payload.username,
          password: payload.password
        });
        const res = { msg: 'Up in the :D!' }
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  },
  validateUser: async (payload) => {
    return new Promise((resolve, reject) => {
      try {
        console.log(`Payload: ${JSON.stringify(payload, null, 2)}`)
        const res = { msg: 'Up in the :D!' }
        resolve(res)
      } catch (e) {
        reject(e)
      }
    })
  }
}
