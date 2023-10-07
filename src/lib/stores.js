// @ts-nocheck
import {writable} from 'svelte/store'
import sampleGroups from './sampleGroups.txt?raw'
import {updateBackground} from './utils'

// Get the value out of local storage on load
// Use a sane default
const localStorageGroups = localStorage.groups || sampleGroups
const localStorageSelectedBackground = localStorage.selectedBackground || "2"

updateBackground(localStorageSelectedBackground)


const objectifyMember = (member) => {
  return {name: member.trim(), selectedUnit: '-', isSelected: true}
}

// Used by GroupSelector
export let allGroups = []

// Used by StoredGroupsEditor
export const storedGroups = writable(localStorageGroups)

// Used by BackgroundSelect.svelte
export const selectedBackground = writable(localStorageSelectedBackground)

// Used by StoredGroupsEditor and Members
export let selectedGroup = writable(null)

// Used by Members and Widgets
export let selectedGroupMembers = writable(null)

// Used by Widgets and Results
export let membersByUnit = writable([])

// Used by Widgets and Results
export let isAnimationsEnabled = writable([])

// Used by Widgets and Results
export let scrambledAt = writable([])

// Used by Widgets and Members
export let numberOfAvailableUnits = writable(undefined)

// Whenever storedGroups changes
storedGroups.subscribe((value) => {
  localStorage.groups = value
  
  // Important: Incoming members is an array of strings (names)
  allGroups = value.split('\n').map((rawGroup) => {
    const [groupName, rawMembers] = rawGroup.split(':')
    const members = rawMembers ? rawMembers.split(',').map(objectifyMember) : []
    return {name: groupName.trim(), members}
  })
})

// Whenever selectedBackground changes
selectedBackground.subscribe((value) => {
  localStorage.selectedBackground = value
})
