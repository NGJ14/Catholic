import fitz  # PyMuPDF
import sys

def inspect_pdf(pdf_path):
    try:
        doc = fitz.open(pdf_path)
        with open("pdf_sample.txt", "w", encoding="utf-8") as f:
            for i in range(35, 50): # Pages 35-49
                f.write(f"\n--- PAGE {i} ---\n")
                f.write(doc[i].get_text())
                
        print("Wrote sample to pdf_sample.txt")
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    inspect_pdf("NRSV Bible.pdf")
