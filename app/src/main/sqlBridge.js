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
          host: payload.host,
          database: payload.database,
          user: payload.username,
          password: payload.password,
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
    const query = `
    SELECT *
    FROM \`user\`
    WHERE username='${payload.username}'
    AND password='${payload.password}';
    `
    return GETQueryPromise(query)
  },
  getPlatforms: async (payload) => {
    const query = `
    SELECT *
    FROM platform;
    `
    return GETQueryPromise(query)
  },
  editPlatform: async (payload) => {
    const query = `
    UPDATE platform
    SET \`name\` = '${payload.name}',
        \`type\`= '${payload.type}',
        \`schema\` = '${payload.schema}',
        \`status\` = '${payload.status}'
    WHERE platform_id = ${payload.platform_id}
    `
    return PUTQueryPromise(query)
  },
  insertPlatform: async (payload) => {
    const query = `
    INSERT INTO platform (\`name\`, \`type\`, \`schema\`, status)
    VALUES ('${payload.name}', '${payload.type}', '${payload.schema}', '${payload.status}');
    `
    return PUTQueryPromise(query)
  },
  deletePlatform: async (payload) => {
    const query = `
      DELETE FROM platform
      WHERE platform_id='${payload.platform_id}'
    `
    return DELETEQueryPromise(query)
  }
}

// Resolves promise regardless - pivot on successs & errMsg
const DELETEQueryPromise = (query) => {
  return new Promise((resolve, reject) => {
    var res = {
      success: false,
      errMsg: '',
      data: []
    }
    if (!bridge.connected) {
      res.success = false
      res.errMsg = 'Connection not established!'
      resolve(res)
    }
    try {
      bridge.con.query(query, (err) => {
        if (err) {
          res.success = false
          res.errMsg = err.message
        } else {
          res.success = true
        }
        resolve(res)
      })
    } catch (e) {
      res.success = false
      res.errMsg = e.message
      resolve(res)
    }
  })
}

const GETQueryPromise = (query, successCallback) => {
  return new Promise((resolve, reject) => {
    var res = {
      success: false,
      errMsg: '',
      data: []
    }
    if (!bridge.connected) {
      res.success = false
      res.errMsg = 'Connection not established!'
      resolve(res)
    }
    try {
      bridge.con.query(query, (err, data) => {
        if (err) {
          res.success = false
          res.errMsg = err.message
        } else {
          res.success = true
          res.data = data
          successCallback && successCallback(res)
        }
        resolve(res)
      })
    } catch (e) {
      res.success = false
      res.errMsg = e.message
      resolve(res)
    }
  })
}

const PUTQueryPromise = (query, successCallback) => {
  return new Promise((resolve, reject) => {
    var res = {
      success: false,
      errMsg: '',
    }
    if (!bridge.connected) {
      res.success = false
      res.errMsg = 'Connection not established!'
      resolve(res)
    }
    try {
      bridge.con.query(query, (err, data) => {
        if (err) {
          res.success = false
          res.errMsg = err.message
        } else {
          res.success = true
          successCallback && successCallback(res)
        }
        resolve(res)
      })
    } catch (e) {
      res.success = false
      res.errMsg = e.message
      resolve(res)
    }
  })
}
