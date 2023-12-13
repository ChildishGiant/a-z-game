const categories = require('./categories.json')

const categoryNames = categories

let currentCategory = []
const letters = 'abcdefghijklmnopqrstuvwxyz'
let score = 0
let currentLetter = 0
let startTime = new Date()

let options = {
  autoGuess: true
}

window.onload = function () {
  const picker = document.getElementById('category-picker')

  // Populate categories select
  for (const i in categoryNames) {
    const category = categoryNames[i]
    const select = document.createElement('option')
    select.value = category
    const text = document.createTextNode(category)
    select.appendChild(text)
    picker.appendChild(select)
  }

  // Make sure state is matched
  document.getElementById("auto-guess").checked = options.autoGuess

  // Bind things
  document.getElementById("guess").addEventListener("keydown", (() => {
    if (event.key === 'Enter') makeGuess()
  }))

  document.getElementById("guess").addEventListener("input", (() => {
    if (options.autoGuess) makeGuess()
  }))

  document.getElementById("auto-guess").addEventListener("click", (() => {
    options.autoGuess = !options.autoGuess
  }))
}

// Takes a category name and requests and loads that json
window.download_category = async function (category) {
  console.log('Downloading category: ' + category)
  try {
    const response = await fetch("categories/" + category + '.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching JSON:', error);
    return null; // or handle the error in some other way
  }
}

function reset () {
  currentLetter = 0
  score = 0
}

window.load = function (category) {
  // reset()

  download_category(category)
  .then(data => {
    currentCategory = data
    console.log(data)
  })
  // Could cache but that'd only useful if you're playing the same category multiple times
  // So I'm not gonna bother
  startTime = new Date()

  document.getElementById('category').innerText = category
  document.getElementById('category-backdrop').classList.toggle('hidden')
}

/**
 * Last letter was guessed, so the game is over
 */
function finish () {
  let endTime = new Date()
  let timeDiff = endTime - startTime
  window.alert('You did it! You scored ' + score + ' points! \n It took you ' + timeDiff / 1000 + ' seconds!')
  reset()
  // Show the category picker again
  document.getElementById('category-backdrop').classList.remove('hidden')
}

/**
 *
 * Moves onto the next letter of the alphabet
 * @param {boolean} earned - If the letter was earned or skipped
 */
function increment (earned) {
  // If on last letter
  if (currentLetter === 25) {
    // Win
    finish()
  } else {
    // Move on one category
    currentLetter++

    // Clear the input
    document.getElementById('guess').value = ''

    // Make sure the next category have valid guesses
    while (currentCategory[currentLetter].length === 0) {
      currentLetter++
      if (currentLetter > 25) {
        finish()
      }
    }
  }

  // If it was earned, not skipped
  if (earned) {
    score++
  }

  document.getElementById('letter').innerHTML = letters[currentLetter]
}

// Think this is a really outdated way of doing it
// But it works so I'm not gonna change it
window.increment = increment

function makeGuess (autoGuess) {
  // Store guess in const
  const guess = document.getElementById('guess').value.toLowerCase()

  // Test if guess is right
  if (currentCategory[currentLetter].indexOf(guess) !== -1) {
    increment(true)
  }
}
window.makeGuess = makeGuess
