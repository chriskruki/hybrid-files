const mysql = require('mysql2')
var bridge = {
  connected: false,
  con: undefined
};

export const sqlBridge = {
  establishCon: async (payload) => {
    return new Promise((resolve, reject) => {
      try {
        const con = mysql.createConnection({
          host: "localhost",
          user: payload.username,
          password: payload.password
        });

        con.connect((err) => {
          if (err) {
            var msg
            if (err.errno === -4078) {
              msg = "MySQL Server is not online. Make sure the service is running!"
            } else {
              msg = err.message
            }
            const res = {
              success: false,
              msg: msg
            }
            bridge.con = undefined
            bridge.connected = false
            resolve(res)
          } else {
            const res = {
              success: true,
              msg: "Connection Success"
            }
            bridge.con = con
            bridge.connected = true
            resolve(res)
          }
        });
      } catch (err) {
        const res = {
          success: false,
          msg: err.msg
        }
        bridge.con = undefined
        bridge.connected = false
        reject(res)
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
