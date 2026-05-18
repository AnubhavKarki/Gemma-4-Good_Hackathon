"""
OCR pipeline — extracts text from PDFs and images.

Priority order for PDFs:
  1. pdfplumber  — fast, pure-Python, best for text-embedded PDFs
  2. PyMuPDF     — handles more PDF variants, also pure extraction (no OCR)
  3. PaddleOCR   — only if installed (requires Python <=3.12), for scanned docs

Images:
  1. PaddleOCR if installed
  2. Returns empty string with a clear warning if not installed
"""

import io
import logging

logger = logging.getLogger(__name__)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = _try_pdfplumber(file_bytes)
    if text:
        return text

    text = _try_pymupdf_text(file_bytes)
    if text:
        return text

    # Last resort: render pages as images and OCR (requires PaddleOCR)
    return _try_pymupdf_ocr(file_bytes)


def _try_pdfplumber(file_bytes: bytes) -> str:
    try:
        import pdfplumber
        with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
            pages = [page.extract_text() or "" for page in pdf.pages]
            combined = "\n\n".join(p.strip() for p in pages if p.strip())
            if len(combined) > 50:
                logger.info("pdfplumber: extracted %d chars", len(combined))
                return combined
    except Exception as e:
        logger.warning("pdfplumber failed: %s", e)
    return ""


def _try_pymupdf_text(file_bytes: bytes) -> str:
    """Use PyMuPDF's built-in text extraction — no OCR needed."""
    try:
        import fitz
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        pages = [doc.load_page(i).get_text("text") for i in range(len(doc))]
        combined = "\n\n".join(p.strip() for p in pages if p.strip())
        if len(combined) > 50:
            logger.info("PyMuPDF text: extracted %d chars", len(combined))
            return combined
    except Exception as e:
        logger.warning("PyMuPDF text extraction failed: %s", e)
    return ""


def _try_pymupdf_ocr(file_bytes: bytes) -> str:
    """Render scanned PDF pages as images and OCR with Tesseract."""
    try:
        import fitz
        import pytesseract
        from PIL import Image

        doc = fitz.open(stream=file_bytes, filetype="pdf")
        all_text = []
        for i in range(len(doc)):
            pix = doc.load_page(i).get_pixmap(matrix=fitz.Matrix(2, 2))
            img = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
            text = pytesseract.image_to_string(img)
            if text.strip():
                all_text.append(text.strip())
        combined = "\n\n".join(all_text)
        if combined:
            logger.info("Tesseract scanned PDF: extracted %d chars", len(combined))
        return combined
    except ImportError:
        logger.warning("pytesseract not installed — run: pip install pytesseract")
    except Exception as e:
        logger.error("Scanned PDF OCR failed: %s", e)
    return ""


def _try_image_ocr(image_bytes: bytes) -> str:
    """OCR an image using Tesseract (requires: brew install tesseract)."""
    try:
        import pytesseract
        from PIL import Image

        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        text = pytesseract.image_to_string(img)
        if text.strip():
            logger.info("Tesseract extracted %d chars from image", len(text))
            return text.strip()
    except ImportError:
        logger.warning("pytesseract not installed — run: pip install pytesseract")
    except pytesseract.TesseractNotFoundError:
        logger.warning("Tesseract binary not found — run: brew install tesseract")
    except Exception as e:
        logger.error("Tesseract OCR failed: %s", e)
    return ""


def extract_text(file_bytes: bytes, mime_type: str) -> str:
    if mime_type == "application/pdf":
        return extract_text_from_pdf(file_bytes)
    elif mime_type.startswith("image/"):
        return _try_image_ocr(image_bytes=file_bytes)
    else:
        logger.warning("Unsupported MIME type: %s", mime_type)
        return ""
