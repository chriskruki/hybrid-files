// const mysql = require('mysql2')
import mysql from 'mysql2'
var bridge = {
  connected: false,
  con: undefined
}

export const sqlBridge = {
  establishCon: async (payload) => {
    return new Promise((resolve, reject) => {
      try {
        // Attempt to make connection
        const con = mysql.createConnection({
          host: 'localhost',
          database: 'hybridfiles',
          user: payload.username,
          password: payload.password
        })

        // On connect event
        con.connect((err) => {
          // Handle
          if (err) {
            var msg
            if (err.errno === -4078) {
              msg = 'MySQL Server is not online. Make sure the service is running!'
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
          }
          // Success
          else {
            const res = {
              success: true,
              msg: 'Connection Success'
            }
            bridge.con = con
            bridge.connected = true
            resolve(res)
          }
        })
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
      if (!bridge.connected) {
        reject('Connection not established!')
      }
      try {
        const query = `
          SELECT *
          FROM \`user\`
          WHERE username='${payload.username}'
          AND password='${payload.password}';
        `
        bridge.con.query(query, (err, data, fields) => {
          var res
          if (err) {
            console.log(err.message)
            res = {
              success: false,
              errMsg: err.message
            }
          } else {
            res = {
              success: data.length > 0
            }
          }
          resolve(res)
        })
      } catch (e) {
        reject(e.message)
      }
    })
  },
  getPlatforms: async (payload) => {
    return new Promise((resolve, reject) => {
      if (!bridge.connected) {
        reject('Connection not established!')
      }
      try {
        const query = `
          SELECT *
          FROM platform;
        `
        bridge.con.query(query, (err, data) => {
          var res
          if (err) {
            console.log(err.message)
            res = {
              success: false,
              errMsg: err.message
            }
          } else {
            res = {
              success: true,
              data: data
            }
          }
          resolve(res)
        })
      } catch (e) {
        reject(e.message)
      }
    })
  }
  
}
