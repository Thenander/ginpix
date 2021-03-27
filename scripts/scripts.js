const IMG_BASE_URL = '../img/'

window.onload = () => {
  const observedHero = document.getElementById('home')
  const navbar = document.getElementById('navbar')
  const observedTrigger = document.getElementById('trigger')
  const menu = document.querySelector('nav')

  const hideMenu = new IntersectionObserver((entries, observer) => {
    entries.forEach(anotherEntry => {
      const { isIntersecting: observedHeroIsIntersecting } = anotherEntry

      if (observedHeroIsIntersecting) {
        navbar.classList.remove('navTopOff')
        navbar.classList.add('navTopOn')
      } else {
        let prevScrollpos = window.pageYOffset
        window.onscroll = () => {
          const heroHeight = window.innerHeight
          const currentScrollPos = window.pageYOffset
          if (
            prevScrollpos < currentScrollPos &&
            currentScrollPos > heroHeight
          ) {
            navbar.classList.remove('navTopOn')
            navbar.classList.add('navTopOff')
          } else {
            navbar.classList.remove('navTopOff')
            navbar.classList.add('navTopOn')
          }
          prevScrollpos = currentScrollPos
        }
      }
    })
  })
  hideMenu.observe(observedHero)

  const bigMenu = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      const { isIntersecting: observedTriggerIsIntersecting } = entry

      if (observedTriggerIsIntersecting) {
        menu.classList.remove('contNav')
        menu.classList.add('startNav')
      } else {
        menu.classList.remove('startNav')
        menu.classList.add('contNav')
      }
    })
  })
  bigMenu.observe(observedTrigger)
}

const crEl = el => document.createElement(el)
const crTxtNd = txt => document.createTextNode(txt)

const createX = () => {
  const wrapXY = crEl('div')
  const crossX = crEl('div')
  const crossY = crEl('div')

  wrapXY.id = 'close'
  crossX.className = 'crossX'
  crossY.className = 'crossY'

  crossX.append(crossY)
  wrapXY.append(crossX)

  return wrapXY
}

const createRecipe = (name, recipe) => {
  const wrapper = crEl('div')
  const header = crEl('h3')
  const main = crEl('div')
  const headerContent = crTxtNd(name)
  const mainContent = crTxtNd(recipe)

  wrapper.className = 'recipe'

  header.append(headerContent)
  main.append(mainContent)
  wrapper.append(header)
  wrapper.append(main)
  return wrapper
}

const createTech = tech => {
  const { camera, lens, shutter, aperture, iso, glassware } = tech

  const wrapper = crEl('div')
  const techDiv = crEl('div')
  const techDivContent = crTxtNd(
    `Camera: ${camera}\nLens: ${lens}\nShutter speed: ${shutter}\nAperture: ${aperture}\nISO: ${iso}\n\nGlassware: ${glassware}`
  )

  techDiv.append(techDivContent)
  wrapper.append(techDiv)

  return wrapper
}

const showImage = (e, drink, IMG_BASE_URL, color) => {
  const { recipe, id, img, name, tech, uniqueColor } = drink
  const imgUrl = IMG_BASE_URL + img

  const closingX = createX()
  const theDrink = createRecipe(name, recipe)
  const theTech = createTech(tech)
  theTech.className = 'tech'

  const drinksModalBG = document.querySelector('.drinksModalBG')
  drinksModalBG.classList.remove('hide')
  drinksModalBG.classList.add('show')

  // Create inner div
  const drinksModal = crEl('div')
  drinksModal.className = 'drinksModal'
  drinksModal.style.backgroundColor = uniqueColor || color
  drinksModalBG.append(drinksModal)

  // Create image
  const image = crEl('img')
  image.src = imgUrl
  drinksModal.append(image)

  // Create textinfo
  const textInfoWrapper = crEl('div')
  textInfoWrapper.className = 'drinksInfo'

  // Append to modal
  drinksModal.append(closingX)
  textInfoWrapper.append(theDrink)
  textInfoWrapper.append(theTech)

  drinksModal.append(textInfoWrapper)

  const closeModal = () => {
    document.body.style.position = ''
    drinksModal.remove()
    drinksModalBG.classList.remove('show')
    drinksModalBG.classList.add('hide')
  }

  // Close modal
  drinksModalBG.addEventListener('click', () => {
    closeModal()
  })

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal()
  })
}

let btnColor = '#fff'
const setLoadMoreButtonColor = color => {
  btnColor = color
}

const makeDrinkCard = drink => {
  // Variables
  const { recipe, id, img, name, uniqueColor } = drink

  const color = ['#8e4f8f', '#40728f', '#8f6732', '#598f39']
  const colClass = 'col-md-4'
  const imageUrl = `url('${IMG_BASE_URL}${img}')`
  const drinkCardClass = 'drinkCard'
  const drinkTextClass = 'drinkText'
  const ingredientsClass = 'ingredients'
  const colStyleMarginBottom = '1rem'
  const colour = uniqueColor || color[id % 4]
  const drinkCardStyleBorder = '0.5rem solid ' + colour
  const btnContent = 'MORE INFO'
  const drinkButton = 'drinkButton'

  setLoadMoreButtonColor(color[(id - 1) % 4])

  // Create elements and nodes
  const col = crEl('div')
  const drinkCard = crEl('div')
  const drinkText = crEl('div')
  const h3 = crEl('h3')
  const ingredients = crEl('div')
  const buttonContent = crTxtNd(btnContent)
  const button = crEl('button')
  const buttonDiv = crEl('div')
  const drinkTextContent = crTxtNd(name)

  // Set classes
  col.className = colClass
  drinkCard.className = drinkCardClass
  drinkText.className = drinkTextClass
  ingredients.className = ingredientsClass
  button.className = drinkButton

  // Set styles
  col.style.marginBottom = colStyleMarginBottom
  drinkCard.style.borderTop = drinkCardStyleBorder
  drinkCard.style.backgroundImage = imageUrl

  // Add onclick
  drinkCard.addEventListener('click', e =>
    showImage(e, drink, IMG_BASE_URL, color[id % 4])
  )

  // Appends
  h3.append(drinkTextContent)
  drinkText.append(h3)
  ingredients.append(recipe)
  button.append(buttonContent)
  buttonDiv.append(button)
  drinkText.append(ingredients)
  drinkText.append(button)
  drinkCard.append(drinkText)
  drinkCard.append(buttonDiv)
  col.append(drinkCard)

  return col
}

const makeDrinkRow = drinks => {
  const row = crEl('div')
  row.className = 'row'

  drinks.forEach(drink => {
    row.append(makeDrinkCard(drink))
  })

  const loadMore = 'LOAD MORE'
  const loadMoreButton = crEl('div')
  const loadMoreContent = crTxtNd(loadMore)
  loadMoreButton.className = 'loadMore'
  loadMoreButton.style.backgroundColor = btnColor
  loadMoreButton.append(loadMoreContent)
  const flexWrapper = crEl('div')
  flexWrapper.className = 'flexWrapper'
  flexWrapper.append(loadMoreButton)

  row.append(flexWrapper)

  // Add onclick
  loadMoreButton.addEventListener('click', fetchMoreData)

  return row
}

let arrayLength = 0
let drinks = []
let count = 0

const fetchData = async () => {
  const response = await fetch('../json/drinks.json')
  const data = await response.json()
  arrayLength = data.drinks.length

  const addedArray = data.drinks.slice(count, count + 3)
  drinks = addedArray

  count += 3

  const drinkWrapper = document.querySelector('.drinkWrapper')
  drinkWrapper.append(makeDrinkRow(drinks))

  const cardsLength = document.getElementsByClassName('drinkCard').length

  if (cardsLength >= arrayLength) document.querySelector('.loadMore').remove()
}

fetchData()

const fetchMoreData = () => {
  const btn = document.querySelector('.loadMore')
  btn.remove()
  fetchData()
}

document.querySelector('.copyright').innerText =
  '© ' + new Date().getFullYear() + ' Joacim Thenander. All rights reserved.'
