import re
import json
import unicodedata
from SPARQLWrapper import SPARQLWrapper, JSON

mode = "wiki"
language = "en"

categories = {
    "cites": "Q515",
    "fruits": [
        "Q1364",  # Fruit - part of a flowering plant
        "Q3314483",  # Fruit - food, edible in the raw state
    ],
    "vegetables": "Q11004",
    "cats": "Q146",
    "horses": "Q726",
}

category = "vegetables"

# Create an empty list for each letter of the alphabet
toStore = [
    [] for _ in range(26)
]


def send_sparql_query(sparql_query):

    print(sparql_query)

    # Define the Wikidata API endpoint
    wikidata_api_url = "https://query.wikidata.org/bigdata/namespace/wdq/sparql"

    # Set the user agent
    user_agent = "CategoriesScraper/0.1"

    # Initialize the SPARQLWrapper
    sparql = SPARQLWrapper(wikidata_api_url, agent=user_agent)
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(JSON)

    # Send the query and return the results
    return sparql.query().convert()


def get_instances(category_id):
    # Should probably only be checking for instances or only subclasses but idk
    # So search for boths
    sparql_query = """
    SELECT DISTINCT ?item ?itemLabel WHERE {{
    SERVICE wikibase:label {{ bd:serviceParam wikibase:language "{0}". }}
    {{
    SELECT DISTINCT ?item WHERE {{
        {{
        ?item p:P31 ?statement0.
        ?statement0 (ps:P31/(wdt:P279*)) wd:{1}.
        }}
        UNION
        {{
        ?item p:P279 ?statement1.
        ?statement1 (ps:P279/(wdt:P279*)) wd:{1}.
        }}
    }}
    }}
}}
""".format(
        language, category_id
    )

    response = send_sparql_query(sparql_query)

    return response["results"]["bindings"]


def remove_accents(input_str):
    nfkd_form = unicodedata.normalize("NFKD", input_str)
    return "".join([c for c in nfkd_form if not unicodedata.combining(c)])


def add_item_to_alphabetical_list(item, toStore):
    # Extract the first character of the item in lowercase and without accents
    # Need to remove accents otherwise accented characters really mess up the index
    first_char = remove_accents(item[0].lower())

    # Calculate the index for the first character
    index = ord(first_char) - ord("a")

    # If the character isn't in a-z (numbers, symbols, etc.)
    if index < 0 or index > 25:
        print("Index out of bounds: {} -> {} -> {}".format(item, first_char, index))
        return

    # Get the list corresponding to the first character
    char_list = toStore[index]

    # Check if the item is not already in the list
    if item not in char_list:
        # if not, add it
        char_list.append(item)


if mode == "wiki":

    items = []

    # Due to how the game and wikidata works, sometimes we need multiple categories
    # if there's only one, put it in a list so we don't treat the string like an array (python moment)
    if isinstance(categories[category], str):
        categories[category] = [categories[category]]

    for wikidata_category in categories[category]:
        items = items + get_instances(wikidata_category)

    things = []

    # Extract the item IDs from the response
    for thing in items:

        if "itemLabel" in thing and "xml:lang" in thing["itemLabel"]:
            if thing["itemLabel"]["xml:lang"] == language:
                # Has a label in the right language
                things.append(thing["itemLabel"]["value"])
                # print(thing["itemLabel"]["value"])
        # Invisible else: continue

    print("Collected {} things".format(len(things)))

else:
    with open("in.txt", "r", encoding="utf8") as f:
        items = f.readlines()


for thing in things:

    # Remove numbers, spaces and convert to lowercase
    thing = re.sub(r"\d*", "", thing).lower().strip()
    # To store a version without accents
    second = remove_accents(thing)

    add_item_to_alphabetical_list(thing, toStore)

    if second != thing:
        add_item_to_alphabetical_list(second, toStore)


with open("{}.json".format(category), "w", encoding="utf8") as f:
    f.write(json.dumps(toStore))
