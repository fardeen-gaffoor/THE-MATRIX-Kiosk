import os
import io
from PIL import Image

# This toggle will let you switch between CPU (Tesseract) and GPU (Florence-2)
# Set to 'gpu' when you move this code to your NVIDIA machine.
OCR_MODE = os.getenv("OCR_MODE", "cpu").lower() 

def extract_text_cpu(image: Image.Image) -> str:
    """
    CPU-based OCR using Tesseract.
    Perfect for this device.
    """
    try:
        import pytesseract
        # If tesseract is not in your PATH on Windows, you must specify the path:
        # pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
        
        # We can specify languages if you install the Hindi/Marathi packs
        # text = pytesseract.image_to_string(image, lang='eng+hin+mar')
        text = pytesseract.image_to_string(image)
        return text
    except Exception as e:
        print(f"[OCR CPU ERROR] {e}")
        return "Error extracting text via Tesseract. Is Tesseract installed?"


def extract_text_gpu(image: Image.Image) -> str:
    """
    GPU-based OCR using Microsoft's Florence-2.
    Use this on your NVIDIA device.
    """
    try:
        import torch
        from transformers import AutoProcessor, AutoModelForCausalLM
        
        # Load Florence-2 (Will download on first run)
        model_id = "microsoft/Florence-2-base"
        device = "cuda" if torch.cuda.is_available() else "cpu"
        
        processor = AutoProcessor.from_pretrained(model_id, trust_remote_code=True)
        model = AutoModelForCausalLM.from_pretrained(model_id, trust_remote_code=True).eval().to(device)
        
        # Florence-2 uses specific task prompts. '<OCR>' extracts all text.
        prompt = "<OCR>"
        
        inputs = processor(text=prompt, images=image, return_tensors="pt").to(device)
        generated_ids = model.generate(
            input_ids=inputs["input_ids"],
            pixel_values=inputs["pixel_values"],
            max_new_tokens=1024,
            num_beams=3
        )
        generated_text = processor.batch_decode(generated_ids, skip_special_tokens=False)[0]
        
        # Clean up the output tags
        parsed_answer = processor.post_process_generation(generated_text, task=prompt, image_size=(image.width, image.height))
        
        return parsed_answer.get("<OCR>", "")
        
    except Exception as e:
        print(f"[OCR GPU ERROR] {e}")
        return "Error extracting text via GPU model."


def process_document_ocr(file_content: bytes, item_id: str, original_filename: str):
    print(f"[{item_id}] Starting OCR processing for {original_filename} using {OCR_MODE.upper()} mode...")
    
    try:
        image = Image.open(io.BytesIO(file_content)).convert("RGB")
        
        if OCR_MODE == "gpu":
            extracted_text = extract_text_gpu(image)
        else:
            extracted_text = extract_text_cpu(image)
            
        print(f"[{item_id}] Extracted Text Snippet: {extracted_text[:100]}...")
        
        # TODO: Here you would save 'extracted_text' to PostgreSQL
        # db.add(Item(id=item_id, extracted_text=extracted_text))
        
        print(f"[{item_id}] Processing complete.")
        return extracted_text
        
    except Exception as e:
        print(f"[{item_id}] Failed to open image: {e}")
