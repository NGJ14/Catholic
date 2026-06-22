import fitz  # PyMuPDF
import re
import json

books = [
    "Genesis", "Exodus", "Leviticus", "Numbers", "Deuteronomy", "Joshua", "Judges", "Ruth",
    "1 Samuel", "2 Samuel", "1 Kings", "2 Kings", "1 Chronicles", "2 Chronicles", "Ezra",
    "Nehemiah", "Tobit", "Judith", "Esther", "1 Maccabees", "2 Maccabees", "Job", "Psalms",
    "Proverbs", "Ecclesiastes", "Song of Solomon", "Wisdom of Solomon", "Sirach", "Isaiah",
    "Jeremiah", "Lamentations", "Baruch", "Ezekiel", "Daniel", "Hosea", "Joel", "Amos",
    "Obadiah", "Jonah", "Micah", "Nahum", "Habakkuk", "Zephaniah", "Haggai", "Zechariah",
    "Malachi", "Matthew", "Mark", "Luke", "John", "Acts", "Romans", "1 Corinthians",
    "2 Corinthians", "Galatians", "Ephesians", "Philippians", "Colossians", "1 Thessalonians",
    "2 Thessalonians", "1 Timothy", "2 Timothy", "Titus", "Philemon", "Hebrews", "James",
    "1 Peter", "2 Peter", "1 John", "2 John", "3 John", "Jude", "Revelation"
]

book_names_upper = {b.upper(): b for b in books}

def extract_bible(pdf_path, output_json):
    doc = fitz.open(pdf_path)
    
    current_book = None
    current_chapter = 1
    
    bible_data = {}
    
    # Regex for [Book Chapter]
    chapter_marker_re = re.compile(r'^\[([A-Za-z0-9\s]+)\s+(\d+)\]$')
    
    current_text = ""
    
    for i in range(len(doc)):
        page_text = doc[i].get_text("text")
        lines = page_text.split('\n')
        
        for line in lines:
            line = line.strip()
            if not line:
                continue
                
            # Filter out headers/footers (approximate)
            if re.match(r'^[A-Z\s]+\s+\d+$', line): # e.g. "GENESIS 32"
                continue
            if re.match(r'^\d+$', line): # Just a page number
                continue
                
            # Check for Book Title (Chapter 1)
            if line in book_names_upper:
                if current_book and current_text:
                    if current_book not in bible_data:
                        bible_data[current_book] = {}
                    bible_data[current_book][str(current_chapter)] = current_text.strip()
                    
                current_book = book_names_upper[line]
                current_chapter = 1
                current_text = ""
                continue
                
            # Check for chapter marker e.g. [Genesis 2]
            match = chapter_marker_re.match(line)
            if match:
                if current_book and current_text:
                    if current_book not in bible_data:
                        bible_data[current_book] = {}
                    bible_data[current_book][str(current_chapter)] = current_text.strip()
                
                b_name = match.group(1).strip()
                for b in books:
                    if b.lower() == b_name.lower():
                        current_book = b
                        break
                else:
                    current_book = b_name
                    
                current_chapter = int(match.group(2))
                current_text = ""
                continue
                
            # It's regular text. Append with hyphen stitching.
            if current_book:
                if current_text.endswith('-'):
                    current_text = current_text[:-1] + line
                else:
                    current_text += " " + line
                
    # Append the very last chapter
    if current_book and current_text:
        if current_book not in bible_data:
            bible_data[current_book] = {}
        bible_data[current_book][str(current_chapter)] = current_text.strip()
        
    print(f"Extracted {len(bible_data)} books.")
    
    # Now parse the concatenated text into verses using SEQUENTIAL logic
    parsed_data = {"books": [], "verses": {}}
    
    for book_name, chapters in bible_data.items():
        parsed_data["books"].append({
            "id": book_name,
            "name": book_name,
            "testament": "NT" if book_name in ["Matthew", "Mark", "Luke", "John", "Acts", "Romans", "Revelation"] else "OT",
            "chapters": len(chapters)
        })
        
        parsed_data["verses"][book_name] = {}
        for chap_num, text in chapters.items():
            verses = []
            
            # Find all numbers that are bordered by space or string start
            matches = list(re.finditer(r'(?:^|\s)(\d+)\s', text))
            
            verse_indices = []
            expected_verse = 1
            
            for m in matches:
                num = int(m.group(1))
                # Accept if it's the expected next verse, or if we skipped one (e.g., missed by parser)
                if num == expected_verse or num == expected_verse + 1:
                    verse_indices.append((num, m.end()))
                    expected_verse = num + 1
                    
            if not verse_indices:
                # No sequential verses found (maybe Psalm 150 which is short?)
                # Just fallback to pushing the whole text to verse 1
                parsed_data["verses"][book_name][chap_num] = [{"chapter": int(chap_num), "verse": 1, "text": text.strip()}]
                continue
                
            # Now slice the text based on the found indices
            for i in range(len(verse_indices)):
                v_num, start_idx = verse_indices[i]
                
                if i + 1 < len(verse_indices):
                    # End text exactly before the matched number string of the next verse
                    next_match = matches[0] # Just a placeholder
                    # We need the start index of the regex match for the next verse
                    # The number starts after the leading space (if any)
                    for match in matches:
                        if int(match.group(1)) == verse_indices[i+1][0] and match.end() == verse_indices[i+1][1]:
                            next_start_idx = match.start()
                            # If there's a leading space in the regex, start one character later
                            if text[next_start_idx] == ' ':
                                next_start_idx += 1
                            end_text = next_start_idx
                            break
                    else:
                        end_text = len(text)
                else:
                    end_text = len(text)
                    
                v_text = text[start_idx:end_text].strip()
                verses.append({"chapter": int(chap_num), "verse": v_num, "text": v_text})
                
            parsed_data["verses"][book_name][chap_num] = verses
            
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(parsed_data, f, ensure_ascii=False)
        
    print(f"Saved parsed data to {output_json}")

if __name__ == "__main__":
    extract_bible("NRSV Bible.pdf", "public/nrsv.json")
