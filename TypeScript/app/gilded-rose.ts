export class Item {
  name: string;
  sellIn: number;
  quality: number;

  constructor(name, sellIn, quality) {
    this.name = name;
    this.sellIn = sellIn;
    this.quality = quality;
  }
}
const LEGENDARY_ITEMS = ["Sulfuras, Hand of Ragnaros"] as const

type LegendaryItemNames = typeof LEGENDARY_ITEMS[number]

type AgedBrieObject = {
  name: "Aged Brie"
  sellIn: number
  quality: number
}


export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    this.items.forEach(item => {
      const updatedItem = handleEndOfDayItem({ item });
      item.sellIn = updatedItem.sellIn;
      item.quality = updatedItem.quality;
    });
  }

}


// helper functions
type DegradeItemParameters = {
  item: Item
  amount: number
}
export function degradeItem({ item, amount }: DegradeItemParameters) {
  item = structuredClone(item);
  item.quality = Math.max(0, item.quality - amount);  // Directly apply the lower bound
  return item;
}

type DecrementSellInParameters = {
  item: Item
  amount: number
}

export function decrementSellIn({ item, amount }: DecrementSellInParameters) {
  item = structuredClone(item);
  return { ...item, sellIn: item.sellIn - amount }
}

type AppreciateItemParameters = {
  item: Item
  amount: number
  limit?: number
}

export function appreciateItem({ item, amount, limit = 50 }: AppreciateItemParameters) {
  item = structuredClone(item);
  const newQuality = item.quality + amount;
  if (newQuality > limit) {
    return { ...item, quality: limit }
  } else
    return { ...item, quality: item.quality + amount, }
}

type HandleEndOfDayItemParameters = {
  item: Item
}

export function handleEndOfDayItem({ item }: HandleEndOfDayItemParameters) {
  switch (true) {
    case (item.name === "Aged Brie"):
      return handleAgedBrie({ item: item as AgedBrieObject })
    case (isItemLegendary(item, LEGENDARY_ITEMS as unknown as string[])):
      return handleLegendaryItem({ item: item as LegendaryItemObject })
    case (isBackstagePass(item)):
      return handleBackstagePass({ item })
    case (isConjured(item)):
      return handleConjuredItem({ item })
  }
  return handleRegularItem({ item })
}

export function handleAgedBrie({ item }: HandleAgedBrieParameters) {
  item = structuredClone(item);
  if (item.sellIn <= 0) {
    item = appreciateItem({ item: item as Item, amount: 2 }) as AgedBrieObject
    return decrementSellIn({ item: item as Item, amount: 1 }) as Item
  }
  item = appreciateItem({ item: item as Item, amount: 1 }) as AgedBrieObject
  return decrementSellIn({ item: item as Item, amount: 1 }) as Item
}

export type HandleAgedBrieParameters = {
  item: AgedBrieObject
}

export type HandleRegularItemParameters = {
  item: Item
}

export function handleRegularItem({ item }: HandleRegularItemParameters) {
  item = structuredClone(item);
  item.quality -= item.sellIn <= 0 ? 2 : 1;
  if (item.quality < 0) item.quality = 0;  // Quality should not be negative
  item.sellIn -= 1;
  return item;
}

export type LegendaryItemObject = {
  name: LegendaryItemNames
  sellIn: number,
  quality: number
}

type HandleLegendaryItemParameter = {
  item: LegendaryItemObject
};

export function handleLegendaryItem({ item }: HandleLegendaryItemParameter) {
  item = structuredClone(item);
  return item;
}

export function isItemLegendary(item: Item, legendaryItems: string[]): item is LegendaryItemObject {
  return legendaryItems.includes(item.name as LegendaryItemNames)
}

export function isBackstagePass(item: Item): Boolean {
  return item.name == "Backstage passes to a TAFKAL80ETC concert"
}

type HandleBackstagePassParameters = {
  item: Item
}

export function handleBackstagePass({ item }: HandleBackstagePassParameters): Item {
  item = structuredClone(item);

  switch (true) {
    case (item.sellIn <= 0):
      item = decrementSellIn({ item, amount: 1 })
      return { ...item, quality: 0 }
    case (item.sellIn <= 5):
      item = appreciateItem({ item, amount: 3 })
      return decrementSellIn({ item, amount: 1 })
    case (item.sellIn <= 10):
      item = appreciateItem({ item, amount: 2 })
      return decrementSellIn({ item, amount: 1 })
    default:
      item = appreciateItem({ item, amount: 1 })
      return decrementSellIn({ item, amount: 1 })

  }
}

export function isConjured(item: Item): boolean {
  return item.name.includes("Conjured")
}

type HandleConjuredItemParameters = {
  item: Item
}
export function handleConjuredItem({ item }: HandleConjuredItemParameters): Item {
  item = structuredClone(item);
  item.quality -= item.sellIn <= 0 ? 2 : 1;
  if (item.quality < 0) item.quality = 0;  // Quality should not be negative
  item.sellIn -= 1;
  return item;
}


