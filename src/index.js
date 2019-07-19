/** @module cheerio-util */

import {first} from "lodash"
import cheerio from "cheerio"

function filterByText(needle) {
  return this.filter(function () {
    const nodeText = cheerio.text(this.children).trim()
    return nodeText.includes(needle)
  })
}

function findByText(needle) {
  return this.filter(function () {
    const nodeText = cheerio.text(this.children).trim()
    return nodeText.includes(needle)
  }) |> first
}

const wrap = cheerioRoot => {
  cheerioRoot.prototype.filterByText = filterByText
  cheerioRoot.prototype.findByText = findByText
}

export {wrap}

/**
 * @type {import {CheerioAPI} from "cheerio"}
 */
export default cheerioEnhanced