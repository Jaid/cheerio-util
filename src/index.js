/** @module cheerio-util */

import {first, drop} from "lodash"
import cheerio from "cheerio"
import testString from "test-string"
import normalizeHtmlWhitespace from "normalize-html-whitespace"

const tdSelector = "th, td"

/**
 * @function
 * @param {import("cheerio")} cheerioRoot
 * @returns {import("cheerio")}
 */
function wrap(cheerioRoot) {
  cheerioRoot.prototype.filterByText = filterByText
  cheerioRoot.prototype.findByText = findByText
  cheerioRoot.prototype.findTrByFirstTd = findTrByFirstTd
  cheerioRoot.prototype.textNormalized = textNormalized
  return cheerioRoot
}

const cheerioEnhanced = wrap(cheerio)

function filterByText(needle) {
  return this.filter(function () {
    const nodeText = cheerioEnhanced.text(this.children).trim()
    return testString(nodeText, needle)
  })
}

function findByText(needle) {
  return this.filter(function () {
    const nodeText = cheerioEnhanced.text(this.children).trim()
    return testString(nodeText, needle)
  }) |> first
}

function findTrByFirstTd(needle) {
  const trNodes = this.find("tr")
  const matchedTrNodes = trNodes.filter(function () {
    const trNodeApi = cheerioEnhanced(this)
    const tdNodes = trNodeApi.children(tdSelector)
    if (tdNodes.length === 0) {
      return false
    }
    const firstTd = tdNodes.first()
    const nodeText = firstTd.text().trim()
    if (nodeText.length === 0) {
      return false
    }
    return testString(nodeText, needle)
  })
  if (matchedTrNodes.length === 0) {
    return null
  }
  const trNode = matchedTrNodes.first()
  const tdsWithoutFirst = trNode.children(tdSelector) |> drop
  const tdValues = tdsWithoutFirst.map(node => {
    const nodeText = cheerioEnhanced(node).textNormalized()
    return nodeText
  })
  return tdValues
}

function textNormalized() {
  return normalizeHtmlWhitespace(this.text().trim()).replace(/\s+/g, " ")
}

export {wrap}

/**
 * @type {import {CheerioAPI} from "cheerio"}
 */
export default cheerioEnhanced