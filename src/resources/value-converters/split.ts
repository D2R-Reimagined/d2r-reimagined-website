// Splits a string on a separator. Useful for rendering localized templates
// where a placeholder (e.g. `{0}`) needs to be replaced with real DOM (such as
// an anchor) instead of escaped text.
export class SplitValueConverter {
    toView(value: string | null | undefined, separator: string): string[] {
        if (value == null) return [];
        return String(value).split(separator);
    }
}
