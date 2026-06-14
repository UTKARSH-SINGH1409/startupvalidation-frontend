import os
from PIL import Image

def process_image(filepath):
    try:
        img = Image.open(filepath).convert("RGBA")
        datas = img.getdata()

        # Convert white to transparent
        newData = []
        for item in datas:
            # Check if pixel is white (or very close to white)
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        
        img.putdata(newData)
        
        # Get bounding box of non-transparent pixels
        bbox = img.getbbox()
        if bbox:
            img = img.crop(bbox)
            
            # Save the cropped and transparent image back
            img.save(filepath, "PNG")
            print(f"Processed and cropped {filepath}")
        else:
            print(f"Image {filepath} is completely transparent/white")
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

assets_dir = "src/assets"
for filename in ["box.png", "brain.png", "cap.png"]:
    process_image(os.path.join(assets_dir, filename))
