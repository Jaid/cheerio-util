/** @module cheerio-util */

import {first, drop} from "lodash"
import cheerio from "cheerio"
import testString from "test-string"
import normalizeHtmlWhitespace from "normalize-html-whitespace"

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
  const trNodes = cheerioEnhanced(this).find("tr")
  const getFirstMatchedTr = () => {
    for (const tr of trNodes.toArray()) {
      const tdNodes = cheerioEnhanced(tr).find("td")
      if (tdNodes.length === 0) {
        continue
      }
      const firstTd = cheerioEnhanced(tdNodes |> first)
      const tdText = firstTd.textNormalized()
      if (testString(tdText, needle)) {
        return cheerioEnhanced(tr)
      }
    }
  }
  const trNode = getFirstMatchedTr()
  if (trNode === undefined) {
    return null
  }
  const tdsWithoutFirst = trNode.children("td") |> drop
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