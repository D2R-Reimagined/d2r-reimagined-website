interface IChanceItem {
    PropertyString?: string;
    Chance?: number;
    ModChance?: number;
}

export class ChanceValueConverter {
    toView(affix: IChanceItem, pool: IChanceItem[]) {
        if (!pool || pool.length === 0) return 0;
        // Filter pool to only include items with PropertyString (actual properties)
        const propertyPool = pool.filter(item => item.PropertyString);
        if (propertyPool.length === 0) return 0;

        const totalChance = propertyPool.reduce((sum: number, item: IChanceItem) => sum + (item.Chance || item.ModChance || 1), 0);
        const specificChance = affix.Chance || affix.ModChance || 1;
        const chancePercent = (specificChance / totalChance) * 100;
        // Format to 1 decimal place if not an integer, otherwise no decimals
        return Number.isInteger(chancePercent) ? chancePercent : chancePercent.toFixed(1);
    }
}
