class Klass {
  constructor(name) {
    this.name = name
    this.members = []
  }

  getMembers() {
    return this.members
  }

  addMember(memberName) {
    this.members.push(new Member(memberName))
  }
}

class Member {
  constructor(name) {
    this.name = name
    this.isSelected = true
    this.desiredUnit = null
    this.desiredPosition = null
  }

  toggleSelected() {
    this.isSelected = !this.isSelected
  }

  updateDesiredUnit(unit) {
    this.desiredUnit = unit
    if (!unit) {
      // unset position if no unit
      this.desiredPosition = null
    }
  }

  updateDesiredPosition(position) {
    this.desiredPosition = position
  }

  stringify() {
    return `${this.name}:${this.desiredUnit}:${this.desiredPosition}`
  }
}