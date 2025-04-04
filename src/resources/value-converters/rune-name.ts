export class RuneNameValueConverter {
    public toView(value: string): string | undefined {
        if (!value) {
            return;
        }
        switch (value) {
            case 'El Rune':
                return 'El (1)';
            case 'Eld Rune':
                return 'Eld (2)';
            case 'Tir Rune':
                return 'Tir (3)';
            case 'Nef Rune':
                return 'Nef (4)';
            case 'Eth Rune':
                return 'Eth (5)';
            case 'Ith Rune':
                return 'Ith (6)';
            case 'Tal Rune':
                return 'Tal (7)';
            case 'Ral Rune':
                return 'Ral (8)';
            case 'Ort Rune':
                return 'Ort (9)';
            case 'Thul Rune':
                return 'Thul (10)';
            case 'Amn Rune':
                return 'Amn (11)';
            case 'Sol Rune':
                return 'Sol (12)';
            case 'Shael Rune':
                return 'Shael (13)';
            case 'Dol Rune':
                return 'Dol (14)';
            case 'Hel Rune':
                return 'Hel (15)';
            case 'Io Rune':
                return 'Io (16)';
            case 'Lum Rune':
                return 'Lum (17)';
            case 'Ko Rune':
                return 'Ko (18)';
            case 'Fal Rune':
                return 'Fal (19)';
            case 'Vex Rune':
                return 'Vex (20)';
            case 'Ohm Rune':
                return 'Ohm (21)';
            case 'Lo Rune':
                return 'Lo (22)';
            case 'Sur Rune':
                return 'Sur (23)';
            case 'Ber Rune':
                return 'Ber (24)';
            case 'Jah Rune':
                return 'Jah (25)';
            case 'Cham Rune':
                return 'Cham (26)';
            case 'Zod Rune':
                return 'Zod (27)';
        }
        return value;
    }
}