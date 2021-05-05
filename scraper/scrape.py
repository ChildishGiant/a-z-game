import pandas as pd
from mediawikiapi import MediaWikiAPI
import re
import json
import unicodedata

mode = "file"

# print(names)

toStore = [[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[],	[], []]



def remove_accents(input_str):
    nfkd_form = unicodedata.normalize('NFKD', input_str)
    return u"".join([c for c in nfkd_form if not unicodedata.combining(c)])

if mode == "wiki":
    mediawikiapi = MediaWikiAPI()

    countries = mediawikiapi.page("List_of_national_capitals")

    table = pd.read_html(countries.url, attrs={"class": "wikitable"})[0]
    names = table["City/Town"]

else:
    with open("in.txt", "r", encoding="utf8") as f:
        names = f.readlines()


for name in names:

    name = re.sub('\d*', '', name).lower().strip()
    second = remove_accents(name)

    toStore["abcdefghijklmnopqrstuvwxyz".index(name[0].lower())].append(name)

    if second != name:
        toStore["abcdefghijklmnopqrstuvwxyz".index(name[0].lower())].append(second)


with open("out.json", "w", encoding="utf8") as f:
    f.write(json.dumps(toStore))
