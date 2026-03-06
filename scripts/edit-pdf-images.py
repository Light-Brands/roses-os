"""
Edit images in existing PDF files using PyMuPDF.
Supports listing, replacing, adding, and removing images.

Requirements: pip install pymupdf

Usage:
  python scripts/edit-pdf-images.py list <pdf_path>
  python scripts/edit-pdf-images.py replace <pdf_path> <image_index> <new_image_path> [--output <out.pdf>]
  python scripts/edit-pdf-images.py add <pdf_path> <page_num> <image_path> --x <x> --y <y> --width <w> --height <h> [--output <out.pdf>]
  python scripts/edit-pdf-images.py remove <pdf_path> <image_index> [--output <out.pdf>]
"""

import argparse
import sys
import os

import fitz  # PyMuPDF


def list_images(pdf_path: str) -> None:
    """List all images in a PDF with their index, page, size, and position."""
    doc = fitz.open(pdf_path)
    image_index = 0

    print(f"Images in: {pdf_path}")
    print(f"{'Index':<8}{'Page':<8}{'Width':<10}{'Height':<10}{'X':<10}{'Y':<10}{'Name':<20}")
    print("-" * 76)

    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)

        for img in image_list:
            xref = img[0]
            # Get image bounding box on the page
            rects = page.get_image_rects(xref)
            if rects:
                rect = rects[0]
                x, y, w, h = rect.x0, rect.y0, rect.width, rect.height
            else:
                x, y, w, h = 0, 0, 0, 0

            # Get image info
            base_image = doc.extract_image(xref)
            img_width = base_image.get("width", 0)
            img_height = base_image.get("height", 0)
            img_name = img[7] if len(img) > 7 else f"image-{xref}"

            print(f"{image_index:<8}{page_num + 1:<8}{img_width:<10}{img_height:<10}{x:<10.1f}{y:<10.1f}{img_name:<20}")
            image_index += 1

    if image_index == 0:
        print("  No images found.")

    doc.close()
    print(f"\nTotal images: {image_index}")


def _get_image_by_index(doc, target_index: int):
    """Find an image by its flat index across all pages. Returns (page, xref, rect)."""
    current_index = 0
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        for img in image_list:
            if current_index == target_index:
                xref = img[0]
                rects = page.get_image_rects(xref)
                rect = rects[0] if rects else None
                return page, xref, rect
            current_index += 1
    return None, None, None


def replace_image(pdf_path: str, image_index: int, new_image_path: str, output_path: str) -> None:
    """Replace an image at the given index with a new image file."""
    if not os.path.exists(new_image_path):
        print(f"Error: Image file not found: {new_image_path}", file=sys.stderr)
        sys.exit(1)

    doc = fitz.open(pdf_path)
    page, xref, rect = _get_image_by_index(doc, image_index)

    if page is None:
        print(f"Error: Image index {image_index} not found.", file=sys.stderr)
        doc.close()
        sys.exit(1)

    if rect is None:
        print(f"Error: Could not determine image position for index {image_index}.", file=sys.stderr)
        doc.close()
        sys.exit(1)

    # Remove the old image and insert the new one at the same position
    page.delete_image(xref)
    page.insert_image(rect, filename=new_image_path)

    doc.save(output_path)
    doc.close()
    print(f"Replaced image {image_index} with {new_image_path}")
    print(f"Saved to: {output_path}")


def add_image(pdf_path: str, page_num: int, image_path: str,
              x: float, y: float, width: float, height: float, output_path: str) -> None:
    """Add a new image to a specific page at given coordinates."""
    if not os.path.exists(image_path):
        print(f"Error: Image file not found: {image_path}", file=sys.stderr)
        sys.exit(1)

    doc = fitz.open(pdf_path)

    if page_num < 1 or page_num > len(doc):
        print(f"Error: Page {page_num} out of range (1-{len(doc)}).", file=sys.stderr)
        doc.close()
        sys.exit(1)

    page = doc[page_num - 1]  # Convert to 0-indexed
    rect = fitz.Rect(x, y, x + width, y + height)
    page.insert_image(rect, filename=image_path)

    doc.save(output_path)
    doc.close()
    print(f"Added {image_path} to page {page_num} at ({x}, {y}, {width}x{height})")
    print(f"Saved to: {output_path}")


def remove_image(pdf_path: str, image_index: int, output_path: str) -> None:
    """Remove an image by its flat index."""
    doc = fitz.open(pdf_path)
    page, xref, _rect = _get_image_by_index(doc, image_index)

    if page is None:
        print(f"Error: Image index {image_index} not found.", file=sys.stderr)
        doc.close()
        sys.exit(1)

    page.delete_image(xref)

    doc.save(output_path)
    doc.close()
    print(f"Removed image {image_index}")
    print(f"Saved to: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Edit images in PDF files")
    subparsers = parser.add_subparsers(dest="action", required=True)

    # list
    list_parser = subparsers.add_parser("list", help="List all images in a PDF")
    list_parser.add_argument("pdf_path", help="Path to the PDF file")

    # replace
    replace_parser = subparsers.add_parser("replace", help="Replace an image in a PDF")
    replace_parser.add_argument("pdf_path", help="Path to the PDF file")
    replace_parser.add_argument("image_index", type=int, help="Index of the image to replace")
    replace_parser.add_argument("new_image_path", help="Path to the new image file")
    replace_parser.add_argument("--output", help="Output path (default: overwrite in-place)")

    # add
    add_parser = subparsers.add_parser("add", help="Add a new image to a PDF")
    add_parser.add_argument("pdf_path", help="Path to the PDF file")
    add_parser.add_argument("page_num", type=int, help="Page number (1-indexed)")
    add_parser.add_argument("image_path", help="Path to the image file")
    add_parser.add_argument("--x", type=float, required=True, help="X coordinate")
    add_parser.add_argument("--y", type=float, required=True, help="Y coordinate")
    add_parser.add_argument("--width", type=float, required=True, help="Image width")
    add_parser.add_argument("--height", type=float, required=True, help="Image height")
    add_parser.add_argument("--output", help="Output path (default: overwrite in-place)")

    # remove
    remove_parser = subparsers.add_parser("remove", help="Remove an image from a PDF")
    remove_parser.add_argument("pdf_path", help="Path to the PDF file")
    remove_parser.add_argument("image_index", type=int, help="Index of the image to remove")
    remove_parser.add_argument("--output", help="Output path (default: overwrite in-place)")

    args = parser.parse_args()

    if args.action == "list":
        list_images(args.pdf_path)
    elif args.action == "replace":
        output = args.output or args.pdf_path
        replace_image(args.pdf_path, args.image_index, args.new_image_path, output)
    elif args.action == "add":
        output = args.output or args.pdf_path
        add_image(args.pdf_path, args.page_num, args.image_path,
                  args.x, args.y, args.width, args.height, output)
    elif args.action == "remove":
        output = args.output or args.pdf_path
        remove_image(args.pdf_path, args.image_index, output)


if __name__ == "__main__":
    main()
