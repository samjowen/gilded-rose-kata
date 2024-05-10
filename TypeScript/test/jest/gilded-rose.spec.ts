import { Item, GildedRose, degradeItem, appreciateItem, handleEndOfDayItem, handleLegendaryItem, LegendaryItemObject, isItemLegendary } from '@/gilded-rose';

describe('Gilded Rose', () => {
  it('should foo', () => {
    const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
    const items = gildedRose.updateQuality();
    expect(items[0].name).toBe('foo');
  });

  it("can degrade an item", () => {
    const itemToDegrade = new Item("degradable", 1, 50)
    expect(degradeItem({ item: itemToDegrade, amount: 10 })).toEqual(new Item("degradable", 1, 40))
  });

  it("can appreciate an item", () => {
    const itemToAppreciate = new Item("appreciatable", 1, 30);
    expect(appreciateItem({ item: itemToAppreciate, amount: 10 })).toEqual(new Item("appreciatable", 1, 40))
  });

  it("handles the end of the day for the regular items (i.e., non edge-cases)", () => {
    const regularItem = new Item("Elixir of the Mongoose", 5, 7);
    expect(handleEndOfDayItem({ item: regularItem })).toEqual(new Item("Elixir of the Mongoose", 4, 6))
  });

  it("handles the end of the day for a legendary item", () => {
    const sulfuras = new Item("Sulfuras", 0, 80) as LegendaryItemObject
    expect(handleLegendaryItem({ item: sulfuras })).toEqual(new Item("Sulfuras", 0, 80));
  });

  it("ensures that quality never goes above 50", () => {
    // buffer overflow possible here?
    const runeKiteshield = new Item("Rune Kiteshield", 1, 49)
    expect(appreciateItem({ item: runeKiteshield, amount: 10 })).toEqual(new Item("Rune Kiteshield", 1, 50))
  });

  it("ensured that aged brie goes up in quality as it ages", () => {
    const agedBrie = new Item("Aged Brie", 1, 0);
    expect(handleEndOfDayItem({ item: agedBrie })).toEqual(new Item("Aged Brie", 0, 1))
  });

  it("can figure out if an item is legendary", () => {
    const sulfuras = new Item("Sulfuras", 0, 80) as LegendaryItemObject
    const notLegendaryItem = new Item("Not Legendary", 0, 80)
    const legendaryItems = ["Sulfuras"]
    expect(isItemLegendary(sulfuras, legendaryItems)).toBe(true)
    expect(isItemLegendary(notLegendaryItem, legendaryItems)).toBe(false)
  });

  it("the end of the day function can handle a legendary item", () => {
    const sulfuras = new Item("Sulfuras", 0, 80) as LegendaryItemObject
    expect(handleEndOfDayItem({ item: sulfuras })).toEqual(new Item("Sulfuras", 0, 80))
  });

  it("ensures that an items quality is never negative", () => {
    const item = new Item("Item", 1, 0)
    expect(degradeItem({ item, amount: 10 })).toEqual(new Item("Item", 1, 0))
  });
})
