const history = []

const add = (entry) => {
  history.push({ ...entry, ts: Date.now() })
  if (history.length > 50) history.shift()
}

const get = () => history

module.exports = { add, get }
