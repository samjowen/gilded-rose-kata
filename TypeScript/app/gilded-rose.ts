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
const LEGENDARY_ITEMS = ["Sulfuras"] as const

type LegendaryItemNames = typeof LEGENDARY_ITEMS[number]


export class GildedRose {
  items: Array<Item>;

  constructor(items = [] as Array<Item>) {
    this.items = items;
  }

  updateQuality() {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i].name != 'Aged Brie' && this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
        if (this.items[i].quality > 0) {
          if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
            this.items[i].quality = this.items[i].quality - 1
          }
        }
      } else {
        if (this.items[i].quality < 50) {
          this.items[i].quality = this.items[i].quality + 1
          if (this.items[i].name == 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].sellIn < 11) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
            if (this.items[i].sellIn < 6) {
              if (this.items[i].quality < 50) {
                this.items[i].quality = this.items[i].quality + 1
              }
            }
          }
        }
      }
      if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
        this.items[i].sellIn = this.items[i].sellIn - 1;
      }
      if (this.items[i].sellIn < 0) {
        if (this.items[i].name != 'Aged Brie') {
          if (this.items[i].name != 'Backstage passes to a TAFKAL80ETC concert') {
            if (this.items[i].quality > 0) {
              if (this.items[i].name != 'Sulfuras, Hand of Ragnaros') {
                this.items[i].quality = this.items[i].quality - 1
              }
            }
          } else {
            this.items[i].quality = this.items[i].quality - this.items[i].quality
          }
        } else {
          if (this.items[i].quality < 50) {
            this.items[i].quality = this.items[i].quality + 1
          }
        }
      }
    }

    return this.items;
  }
}


// helper functions
type DegradeItemParameters = {
  item: Item
  amount: number
}
export function degradeItem({ item, amount }: DegradeItemParameters) {
  item = structuredClone(item);
  return { ...item, quality: item.quality - amount }
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
  item = structuredClone(item);
  item = degradeItem({ item, amount: 1 })
  return decrementSellIn({ item, amount: 1 })
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



