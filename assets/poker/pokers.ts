const suitList = ['Heart', 'Spade', 'Diamond', 'Club']

const pokers = () => {
  let list = []
  suitList.forEach(suit => {
    for (let i = 2; i <= 14; i++) {
      list.push({
        suit,
        point: i
      })
    }
  })
  return list
}

if (!Array.prototype.shuffle) {
  Array.prototype.shuffle = function () {
    for (let j, x, i = this.length; i; j = parseInt(Math.random() * i), x = this[--i], this[i] = this[j], this[j] = x);
    return this
  }
}

export const getPokers = () => {
  const list = pokers()
  return list.shuffle()
}