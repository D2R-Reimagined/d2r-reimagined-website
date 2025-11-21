import prefixes from '../item-jsons/magicprefix.json';
import suffixes from '../item-jsons/magicsuffix.json';
// Note: All advanced filtering/sorting has been removed per request. Keep only a simple search.

export class Affixes {
    allAffixes: any[] = [];
    filteredAffixes: any[] = [];

    // search text
    search = '';
    // debounce settings
    private filterDebounceHandle: number | undefined;
    private readonly debounceDelay = 350; // ms

    // All filtering/sorting controls removed.

    attached() {
        const normalized = (arr: any[], pType: 'Prefix' | 'Suffix') =>
            arr.map((a) => ({
                ...a,
                PType: pType,
                AllTypes: Array.from(new Set([...(a.Types || []), ...(a.ETypes || [])])),
            }));

        this.allAffixes = [
            ...normalized(prefixes as any[], 'Prefix'),
            ...normalized(suffixes as any[], 'Suffix'),
        ];

        this.applyFilters();
    }

    // Debounced wrapper for applyFilters used by the input event
    debouncedApplyFilters() {
        if (this.filterDebounceHandle !== undefined) {
            clearTimeout(this.filterDebounceHandle);
        }
        this.filterDebounceHandle = window.setTimeout(() => {
            this.applyFilters();
        }, this.debounceDelay);
    }

    applyFilters() {
        const q = (this.search || '').trim().toLowerCase();
        if (!q) {
            this.filteredAffixes = this.allAffixes.slice();
            return;
        }

        this.filteredAffixes = this.allAffixes.filter((a) => {
            const name: string = (a.Name || '').toString().toLowerCase();
            const props: string = (a.Properties || [])
                .map((p: any) => (p && p.PropertyString ? String(p.PropertyString) : ''))
                .join('\n')
                .toLowerCase();
            const types: string = (a.AllTypes || [])
                .map((t: any) => (t != null ? String(t) : ''))
                .join('\n')
                .toLowerCase();
            return name.includes(q) || props.includes(q) || types.includes(q);
        });
    }
}
