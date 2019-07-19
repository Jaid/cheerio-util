import path from "path"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
 * @type { import("../src") }
 */
const {default: cheerioEnhanced} = indexModule

const html = `
  <table>
    <tr>
      <th>Attribute:</th>
      <th>Value</th>
    </tr>
    <tr>
      <td><b>Color</b>:</td>
      <td> red </td>
    </tr>
    <tr>
      <td>Price:</td>
      <td><span><span>344,99   &nbsp;€</span></span></td>
    </tr>
  </table>
  `

const dom = cheerioEnhanced.load(html)

it("should be the enhanced version of cheerio", () => {
  const utilFunctions = [
    "findByText",
    "filterByText",
    "findTrByFirstTd",
    "textNormalized",
  ]
  for (const utilFunction of utilFunctions) {
    expect(typeof dom.prototype[utilFunction]).toBe("function")
    expect(typeof dom.fn[utilFunction]).toBe("function")
    expect(typeof dom("tr").first()[utilFunction]).toBe("function")
  }
})

it("findByText", () => {
  const getAttributeValue = key => {
    const trNodes = dom("tr")
    const trNode = trNodes.findByText(`${key}:`)
    const valueNode = dom(trNode).children("td").last()
    const value = valueNode.textNormalized()
    return value
  }
  const color = getAttributeValue("Color")
  expect(color).toBe("red")
})

it("textNormalized", () => {
  const allText = dom.root().textNormalized()
  expect(allText.startsWith("Attribute")).toBeTruthy()
})

it("findtrByFirstTd", () => {
  const price = dom.root().findTrByFirstTd("Price")
  expect(price).toStrictEqual(["344,99 €"])
})