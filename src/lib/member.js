class Group {
  constructor(name, members = []) {
    this.name = name
    this.members = members
  }
}

class Member {
  constructor(name) {
    this.name = name
    this.isSelected = true
    this.selectedUnit = '-'
    this.selectedPosition = '-'
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
  }

  updateSelectedUnit(unit) {
    this.selectedUnit = unit
  }

  updateSelectedPosition(position) {
    this.selectedPosition = position
  }

  stringify() {
    return `${this.name}:${this.selectedUnit}:${this.selectedPosition}`
  }
}