export class EntriesValueConverter {
    toView(obj: Record<string, unknown> | null | undefined) {
        if (!obj) return [];
        return Object.entries(obj);
    }
}
