import {matchSorter} from 'match-sorter'
import cities from './us-cities.json'

const allItems = cities.map((city, index) => ({
  ...city,
  id: String(index),
}))

export function getItems(filter) {
  if (!filter) {
    return allItems
  }
  return matchSorter(allItems, filter, {
    keys: ['name'],
  })
}

export default class makeFilterCitiesWorker {}
