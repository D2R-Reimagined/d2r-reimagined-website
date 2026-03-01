export type Language =
    'enUS'
    | 'deDE'
    | 'enUS'
    | 'esES'
    | 'esMX'
    | 'frFR'
    | 'itIT'
    | 'jaJP'
    | 'koKR'
    | 'plPL'
    | 'ptBR'
    | 'ruRU'
    | 'zhCN'
    | 'zhTW'
;

export class Configs {
    public language: Language = 'enUS';

    updateLanguage(val: Language) {
        this.language = val;
    }
}
