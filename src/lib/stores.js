// @ts-nocheck
import { get, writable } from 'svelte/store'
import sampleClasses from './sampleClasses.txt?raw'
import { updateBackground } from './utils'

// Get the value out of local storage on load
// Use a sane default
const localStorageClasses = localStorage.classes || sampleClasses
const localStorageSelectedBackground = localStorage.selectedBackground || "2"

updateBackground(localStorageSelectedBackground)

const objectifyMember = (member) => {
  return { name: member.trim(), selectedUnit: '-', selectedPosition: '-', isSelected: true }
}

// Used by BackgroundSelect.svelte
export const selectedBackground = writable(localStorageSelectedBackground)

// Used by ClassSelector
export let allClasses = []

// Used by SettingsEditor
export const storedClasses = writable(localStorageClasses)

// Used by ClassSelector and Members
export let selectedClass = writable(null)

// Used by Members and Widgets. Ordered alphabetically by member.name
export let selectedClassMembers = writable(null)

// Used by Widgets and Results. Scrabled version selectedClassMemebers
export let membersByUnit = writable([])

// Used by Widgets and Results
export let isAnimationsEnabled = writable([])

// Used by Widgets and Results
export let scrambledAt = writable([])

// Used by Widgets and Members
export let numberOfAvailableUnits = writable(undefined)

// Whenever storedClasses changes
storedClasses.subscribe((value) => {
  localStorage.classes = value

  // Important: Incoming members is an array of strings (names)
  allClasses = value.split('\n').map((rawClass) => {
    const [className, rawMembers] = rawClass.split(':')
    const members = rawMembers ? rawMembers.split(',').map(objectifyMember) : []
    return { name: className.trim(), members }
  })
})

// Whenever selectedBackground changes
selectedBackground.subscribe((value) => {
  localStorage.selectedBackground = value
})
