import img0 from '../assets/background_0.webp'
import img1 from '../assets/background_1.webp'
import img2 from '../assets/background_2.webp'
import img3 from '../assets/background_4.jpg'
import img4 from '../assets/background_5.jpg'
import img5 from '../assets/background_6.jpg'
import img6 from '../assets/background_7.jpg'
import img7 from '../assets/background_8.jpg'
import img8 from '../assets/background_9.jpg'

export const backgroundImages = [img0, img1, img2, img3, img4, img5, img6, img7, img8]

export const updateBackground = (num) => {
  const css = `url('${backgroundImages[num]}')`
  document.body.style.backgroundImage = css
  document.body.style.backgroundSize = 'cover'
}

export const scrambleArray = (elements) => {
  return elements
    .map((value) => ({value, sort: Math.random()}))
    .sort((a, b) => a.sort - b.sort)
    .map(({value}) => value)
}

export const random = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}


