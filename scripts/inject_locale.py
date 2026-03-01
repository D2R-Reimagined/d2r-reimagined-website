from collections import OrderedDict
import codecs
import json
import re

SUPPORTED_LANG = [
    'enUS',
    'zhTW',
    'deDE',
    'esES',
    'frFR',
    'itIT',
    'koKR',
    'plPL',
    'esMX',
    'jaJP',
    'ptBR',
    'ruRU',
    'zhCN',
]

IGNORE_KEYS = [
    'Expansion',
]

EXPAND_KEYS = [
    'Equipment',
    'SetItems',
    'Runes',
]

REFERENCE_FILES = [
    'data/local/lng/strings/item-runes.json',
    'data/local/lng/strings/item-names.json',
    'data/local/lng/strings/item-nameaffixes.json',
]

def strip_color_tags(s: string) -> string:
    return re.sub('ÿc.', '', s.replace('ÿc2*ÿc3', ''))

def load(fn: string) -> dict:
    try:
        with open(fn, encoding='utf-8') as f:
            return json.load(f, object_pairs_hook=OrderedDict)
    except:
        # mod dir files has BOM
        with open(fn, encoding='utf-8-sig') as f:
            return json.load(f, object_pairs_hook=OrderedDict)

def json2map(data: dict) -> dict:
    ret = dict()
    for item in data:
        ret[item['Key']] = item
        ret[item['enUS']] = item
        stripped = re.sub('ÿc.', '', item['enUS'].replace('ÿc2*ÿc3', ''))
        ret[strip_color_tags(item['enUS'])] = item
    return ret

if __name__ == '__main__':
    import sys
    import os

    # eg: src/pages/item-jsons/runewords.json
    target = load(sys.argv[1])
    # eg: $MOD_HOME/data/local/lng/strings/item-runes.json'
    refs = OrderedDict()
    for fn in REFERENCE_FILES:
        reference = load(os.path.join(sys.argv[2], fn))
        refs.update(json2map(reference))

    def expands(item: dict) -> dict:
        ref = refs.get(item.get('Index')) or refs.get(item.get('Code')) or refs.get(re.sub(' Rune$', '', item.get('Name')))
        if not ref:
            key = item.get('Index') or item.get('Code') or item.get('Name')
            if key in IGNORE_KEYS:
                return
            raise Exception('missing key in reference! ' + key)
        langs = item['Names'] = item.get('Names') or OrderedDict()
        for x in SUPPORTED_LANG:
            langs[x] = strip_color_tags(ref.get(x) or item['Name'])
        for k in EXPAND_KEYS:
            sub_items = item.get(k) or []
            if type(sub_items) == list:
                for s in sub_items:
                    expands(s)
            else:
                expands(sub_items)
        if set_name := item.get('Set'):
            if type(set_name) != str:
                print(type(set_name))
                return
            langs = item['SetNames'] = item.get('SetNames') or OrderedDict()
            ref = refs.get(set_name)
            if not ref:
                raise Exception('missing key in reference! ' + set_name)
            for x in SUPPORTED_LANG:
                langs[x] = strip_color_tags(ref.get(x) or item['Name'])

    for item in target:
        expands(item)

    with open(sys.argv[1], 'w') as w:
        w.write(json.dumps(target, indent=4, ensure_ascii=False))
