import path from "path"

import cheerio from "cheerio"

const indexModule = (process.env.MAIN ? path.resolve(process.env.MAIN) : path.join(__dirname, "..", "src")) |> require

/**
 * @type { import("../src") }
 */
const {default: wrap} = indexModule

it("should run", () => {
  const html = `
  <table>
    <tr>
      <th>Attribute:</th>
      <th>Value</th>
    </tr>
    <tr>
      <td>Color:</td>
      <td>red</td>
    </tr>
    <tr>
      <td>Price:</td>
      <td>344,99&nbsp;€</td>
    </tr>
  </table>
  `
  const dom = cheerio.load(html)
  wrap(dom)
  const getAttributeValue = key => {
    const trNodes = dom("tr")
    const trNode = trNodes.findByText(`${key}:`)
    const valueNode = dom(trNode).children("td").last()
    const value = valueNode.text()
    return value
  }
  const color = getAttributeValue("Color")
  expect(color).toBe("red")
  // Replacing non-breaking spaces with regular spaces
  const price = getAttributeValue("Price").replace(String.fromCharCode(160), " ")
  expect(price).toBe("344,99 €")
})