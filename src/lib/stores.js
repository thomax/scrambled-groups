import {writable} from 'svelte/store'
import sampleGroups from './sampleGroups.txt?raw'

// Get the value out of local storage on load
// Use a sane default
const stored = localStorage.groups || sampleGroups

const objectifyMember = (member) => {
  return {name: member.trim(), selectedUnit: '-', isSelected: true}
}

// Used by GroupSelector
export let allGroups = []

// Used by StoredGroupsEditor
export const storedGroups = writable(stored)

// Used by StoredGroupsEditor and Members
export let selectedGroup = writable(null)

// Used by Members and Widgets
export let selectedGroupMembers = writable(null)

// Used by Widgets and Results
export let membersByUnit = writable([])

// Whenever content of LocalStorage changes
// Incoming members is an array of strings (names)
storedGroups.subscribe((value) => {
  localStorage.groups = value

  // Update allGroups
  allGroups = value.split('\n').map((rawGroup) => {
    const [groupName, rawMembers] = rawGroup.split(':')
    const members = rawMembers ? rawMembers.split(',').map(objectifyMember) : []
    return {name: groupName.trim(), members}
  })
})
