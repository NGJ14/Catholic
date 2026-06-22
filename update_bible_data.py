import json
import re

catholic_canon = {
    "OT": [
        "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
        "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
        "Nehemiah", "Tobit", "Judith", "Esther", "1 Maccabees", "2 Maccabees", "Job", "Psalms",
        "Proverbs", "Ecclesiastes", "Song of Solomon", "Wisdom of Solomon", "Sirach", "Isaiah",
        "Jeremiah", "Lamentations", "Baruch", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
        "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah",
        "Malachi"
    ],
    "NT": [
        "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians", "2 Corinthians",
        "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians", "2 Thessalonians",
        "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James", "1 Peter", "2 Peter",
        "1 John", "2 John", "3 John", "Jude", "Revelation"
    ]
}

def update():
    with open('public/nrsv.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    extracted_books = {b['name']: b['chapters'] for b in data['books']}
    
    # Merge "Psalm" into "Psalms" if it happened during parsing
    if "Psalm" in extracted_books and "Psalms" in extracted_books:
        extracted_books["Psalms"] = max(extracted_books["Psalms"], extracted_books["Psalm"])
        
    if "Galations" in extracted_books and "Galatians" not in extracted_books:
        extracted_books["Galatians"] = extracted_books["Galations"]

    books_ts_array = "export const books: Book[] = [\n"
    
    for testament, book_list in catholic_canon.items():
        for b_name in book_list:
            b_id = re.sub(r'[^a-z0-9]', '', b_name.lower())
            chapters = extracted_books.get(b_name, 1) # fallback to 1 if parsing missed it
            
            # Known chapter counts for fallbacks
            if chapters == 1 and b_name == "Psalms": chapters = 150
            if chapters == 1 and b_name == "Genesis": chapters = 50
            
            books_ts_array += f"  {{ id: '{b_id}', name: '{b_name}', testament: '{testament}', chapters: {chapters} }},\n"
            
    books_ts_array += "];"
    
    with open('src/data/bibleData.ts', 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Replace the books array in the TS file
    pattern = re.compile(r'export const books: Book\[\] = \[.*?\];', re.DOTALL)
    new_content = pattern.sub(books_ts_array, content)
    
    with open('src/data/bibleData.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
        
    print("Updated bibleData.ts with all 73 books.")

if __name__ == '__main__':
    update()
