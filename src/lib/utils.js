
  export const scrambleArray = (elements) => {
    return elements
      .map((value) => ({value, sort: Math.random()}))
      .sort((a, b) => a.sort - b.sort)
      .map(({value}) => value)
  }

  export const random = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

