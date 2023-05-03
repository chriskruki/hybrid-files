export const sqlBridge = {
    validateUser: async (payload) => {
        return new Promise((resolve, reject) => {
            try {
                console.log(`Payload: ${JSON.stringify(payload, null, 2)}`)
                const res = {msg: "Up in the :D!"}
                resolve(res)
            } catch (e) {
                reject(e)
            }
        })
    }
}