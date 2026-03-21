export class EntriesValueConverter {
    toView(obj: any) {
        if (!obj) return [];
        return Object.entries(obj);
    }
}
