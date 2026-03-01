export type Language =
    'enUS'
    | 'koKR'
;

export class Configs {
    public language: Language = 'enUS';

    updateLanguage(val: Language) {
        this.language = val;
    }
}
