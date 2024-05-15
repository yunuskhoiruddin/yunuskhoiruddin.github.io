import os
from PIL import Image

def resize_images_in_folder(source_folder, target_folder, target_width=500):
    os.makedirs(target_folder, exist_ok=True)
    for filename in os.listdir(source_folder):
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.bmp')):
            source_path = os.path.join(source_folder, filename)
            with Image.open(source_path) as img:
                width_percent = (target_width / float(img.size[0]))
                target_height = int((float(img.size[1]) * float(width_percent)))
                img = img.resize((target_width, target_height), Image.ANTIALIAS)
                target_path = os.path.join(target_folder, filename)
                img.save(target_path)
                print(f'{filename} resized and saved to {target_path}')

source_folder = 'assets/projects'
target_folder = 'assets/thumbnails'
resize_images_in_folder(source_folder, target_folder)
