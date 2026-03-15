export class SortPropertiesValueConverter {
    toView(properties: any[]) {
        if (!properties || !Array.isArray(properties)) return properties;

        return [...properties].sort((a, b) => {
            const getPriority = (p: any) => {
                // If it's a group property
                if (p['group-properties']) {
                    const pools = Object.values(p['group-properties']);
                    if (pools.length > 0) {
                        const pool = pools[0] as any[];
                        // Check if it's pickmode 0 (as number or string)
                        const pickMode = p.pickmode ?? (pool[0] ? pool[0].PickMode : undefined);
                        if (pickMode == 0) {
                            return 0; // Pickmode 0 group (high priority)
                        }
                        return 1; // Pickmode 1+ group (low priority)
                    }
                }
                return 0; // Simple property or empty group (high priority)
            };

            return getPriority(a) - getPriority(b);
        });
    }
}
