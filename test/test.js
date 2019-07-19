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

it("findtrByFirstTd", () => {
  const price = dom.root().findTrByFirstTd("Price")
  expect(price[0]).toBe("344,99 €")
})