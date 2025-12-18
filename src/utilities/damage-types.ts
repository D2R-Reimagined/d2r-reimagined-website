export function getDamageTypeString(type: number): string {
    switch (type) {
        case 3:
            return 'Damage:';
        case 2:
            return 'Throw Damage:';
        case 1:
            return 'Two-Hand Damage:';
        case 0:
            return 'One-Hand Damage:';
        default:
            return 'Damage:';
    }
}
