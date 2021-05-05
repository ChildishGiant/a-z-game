const categories = require('./categories.json').production

const categoryNames = Object.keys(categories)

let currentLetter = 0
let currentCategory = 'countries'
const letters = 'abcdefghijklmnopqrstuvwxyz'
let score = 0

window.onload = function () {
  const picker = document.getElementById('category-picker')
  console.log(categoryNames)
  // Populate categories select
  for (const i in categoryNames) {
    const category = categoryNames[i]
    const select = document.createElement('option')
    select.value = category
    const text = document.createTextNode(category)
    select.appendChild(text)
    picker.appendChild(select)
  }
}

window.load = function (category) {
  currentCategory = category
  score = 0
  document.getElementById('category').innerText = category
  document.getElementById('category-modal').classList.toggle('hidden')
}

function win () {
  currentLetter = 0
  window.alert('win' + score)
  score = 0
}

function increment (earned) {
  // If on last letter
  if (currentLetter === 25) {
    // Win
    win()
  } else {
    // Move on one category
    currentLetter++

    // Make sure the next category have
    while (categories[currentCategory][currentLetter].length === 0) {
      currentLetter++
      if (currentLetter > 25) {
        win()
      }
    }
  }

  // If it was earned, not skipped
  if (earned) {
    score++
  }

  document.getElementById('letter').innerHTML = letters[currentLetter]
}

window.increment = increment

function makeGuess () {
  // Store guess
  const guess = document.getElementById('guess').value.toLowerCase()
  // Wipe guess box, no matter what
  document.getElementById('guess').value = ''

  // Test if guess is right
  if (categories[currentCategory][currentLetter].indexOf(guess) !== -1) {
    increment(true)
  }
}
window.makeGuess = makeGuess
