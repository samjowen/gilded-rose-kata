import { Item, GildedRose, degradeItem } from '@/gilded-rose';

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
    const itemToAppreciate = new Item("degradable", 1, 50);
    expect(appreciateItem({ item: itemToAppreciate, amount: 10 })).toEqual(new Item("degradable", 1, 60))
  });
});
