// @ts-nocheck
import { get, writable, derived } from 'svelte/store'
import sampleClasses from './sampleClasses.txt?raw'
import { updateBackground } from './utils.js'

// Get the value out of local storage on load
// Use a sane default
const localStorageClasses = localStorage.classes || sampleClasses
const localStorageSelectedBackground = localStorage.selectedBackground || "2"

updateBackground(localStorageSelectedBackground)

const objectifyMember = (member) => {
  return { name: member.trim(), selectedGroup: '-', selectedPosition: '-', isSelected: true }
}

// Used by BackgroundSelect.svelte
export const selectedBackground = writable(localStorageSelectedBackground)

// Used by ClassSelector
export let allClasses = writable([])

// Used by SettingsEditor
export const storedClasses = writable(localStorageClasses)

// Used by ClassSelector and Members
export let selectedClass = writable({})

// Used by Members and Widgets. Ordered alphabetically by member.name
export let selectedClassMembers = writable(null)

// Used by Widgets and Results. Scrambled version selectedClassMembers
export let membersByGroup = writable([])

// Used by Widgets and Results
export let isAnimationsEnabled = writable([])

// Used by Widgets and Results
export let scrambledAt = writable([])

// Used by Widgets and Members
export let numberOfAvailableGroups = writable(undefined)

// --> improved version of the above
// ✅ array of all classes
// selected class
// array of all members in selected class
// array of group sizes
// array of scrambled groups (scrambled) array of arrays


// Whenever storedClasses changes
storedClasses.subscribe((value) => {
  localStorage.classes = value

  allClasses.set(value.split('\n').map((rawClass) => {
    const [className, rawMembers] = rawClass.split(':')
    const members = rawMembers ? rawMembers.split(',').map(objectifyMember) : []
    return { name: className.trim(), members }
  }))
})

// Whenever selectedBackground changes
selectedBackground.subscribe((value) => {
  localStorage.selectedBackground = value
})
