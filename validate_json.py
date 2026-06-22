import json
import re

def validate():
    with open('public/nrsv.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    verses_data = data['verses']
    
    anomalies = []
    
    for book, chapters in verses_data.items():
        for chapter_str, verses in chapters.items():
            expected_verse = 1
            for v in verses:
                v_num = v['verse']
                v_text = v['text']
                
                # Check for missing verses
                if v_num != expected_verse:
                    anomalies.append(f"Missing verses between {expected_verse-1} and {v_num} in {book} {chapter_str}")
                    expected_verse = v_num
                
                # Check for extremely long verses (might have missed a verse split)
                if len(v_text) > 1000:
                    anomalies.append(f"Very long verse in {book} {chapter_str}:{v_num} ({len(v_text)} chars)")
                    
                # Check for section headings embedded in text (often short capitalized phrases or missing punctuation)
                # But since it's hard to be certain, we can look for large gaps of uppercase letters
                if re.search(r'[A-Z\s]{20,}', v_text):
                    anomalies.append(f"Possible ALL CAPS heading in {book} {chapter_str}:{v_num}")
                    
                # Check for hanging hyphens
                if "- " in v_text:
                    anomalies.append(f"Possible broken hyphenation in {book} {chapter_str}:{v_num}")
                    
                expected_verse += 1
                
    # Output summary
    print(f"Total anomalies found: {len(anomalies)}")
    for a in anomalies[:20]:
        print(a)
    if len(anomalies) > 20:
        print("...")
        
if __name__ == '__main__':
    validate()
