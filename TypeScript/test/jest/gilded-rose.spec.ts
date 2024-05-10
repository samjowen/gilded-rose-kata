import { Item, GildedRose, degradeItem, appreciateItem, handleEndOfDayItem, handleLegendaryItem, LegendaryItemObject, isItemLegendary, isBackstagePass, handleBackstagePass, isConjured, handleConjuredItem } from '@/gilded-rose';

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

  it("ensures that we can detect a backstage pass", () => {
    const backstagePass = new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)
    expect(isBackstagePass(backstagePass)).toBe(true)
  });

  it("ensures that the main method can handle a backstage pass", () => {
    const backstagePass = new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20)
    expect(handleEndOfDayItem({ item: backstagePass })).toEqual(new Item("Backstage passes to a TAFKAL80ETC concert", 14, 21))
  });

  it("can detect a conjured item", () => {
    const conjuredItem = new Item("Conjured Mana Cake", 3, 6)
    const regularItem = new Item("Regular Item", 3, 6)
    expect(isConjured(conjuredItem)).toBe(true)
    expect(isConjured(regularItem)).toBe(false)
  });

  it("correctly handles a conjured item", () => {
    const conjuredItem = new Item("Conjured Mana Cake", 3, 6)
    expect(handleConjuredItem({ item: conjuredItem })).toEqual(new Item("Conjured Mana Cake", 2, 4))
  });
});



describe('Gilded Rose Backstage Pass', () => {
  it("handles a regular backstage pass", () => {
    const regularBackstagePass = new Item("Backstage passes to a TAFKAL80ETC concert", 15, 20);
    expect(handleBackstagePass({ item: regularBackstagePass })).toEqual(new Item("Backstage passes to a TAFKAL80ETC concert", 14, 21));
  });

  it("increases quality by 2 when there are 10 days or less", () => {
    const backstagePassFirstPriceIncrease = new Item("Backstage passes to a TAFKAL80ETC concert", 10, 20);
    expect(handleBackstagePass({ item: backstagePassFirstPriceIncrease })).toEqual(new Item("Backstage passes to a TAFKAL80ETC concert", 9, 22));
  });

  it("increases quality by 3 when there are 5 days or less", () => {
    const backstagePassSecondPriceIncrease = new Item("Backstage passes to a TAFKAL80ETC concert", 5, 20);
    expect(handleBackstagePass({ item: backstagePassSecondPriceIncrease })).toEqual(new Item("Backstage passes to a TAFKAL80ETC concert", 4, 23));
  });

  it("drops quality to 0 after the concert", () => {
    const backstagePassAfterConcert = new Item("Backstage passes to a TAFKAL80ETC concert", 0, 20);
    expect(handleBackstagePass({ item: backstagePassAfterConcert })).toEqual(new Item("Backstage passes to a TAFKAL80ETC concert", -1, 0));
  });
});

