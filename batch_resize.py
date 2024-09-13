import os
from PIL import Image

def resize_images_in_folder(source_folder, target_folder, target_width=400):
    os.makedirs(target_folder, exist_ok=True)
    for filename in os.listdir(source_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            source_path = os.path.join(source_folder, filename)
            with Image.open(source_path) as img:
                width_percent = (target_width / float(img.size[0]))
                target_height = int((float(img.size[1]) * float(width_percent)))
                img = img.resize((target_width, target_height), Image.Resampling.LANCZOS)
                
                # Convert image to RGB if not already in that mode (to ensure compatibility with JPG format)
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Change extension to .jpg for output files
                base_filename = os.path.splitext(filename)[0]
                target_filename = f"{base_filename}.jpg"
                target_path = os.path.join(target_folder, target_filename)
                
                img.save(target_path, format='JPEG')
                print(f'{filename} resized and saved to {target_path}')

source_folder = 'assets/projects'
target_folder = 'assets/thumbnails'
resize_images_in_folder(source_folder, target_folder)
