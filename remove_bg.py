from PIL import Image
import os

logos_dir = os.path.expanduser("~/gmat-prep/public/logos")

def remove_white_background(path):
    img = Image.open(path).convert("RGBA")
    data = img.getdata()
    new_data = []
    for r, g, b, a in data:
        # Make near-white and checkerboard-gray pixels transparent
        is_white = r > 220 and g > 220 and b > 220
        is_light_gray = r > 200 and g > 200 and b > 200 and abs(r-g) < 20 and abs(g-b) < 20
        if is_white or is_light_gray:
            new_data.append((r, g, b, 0))
        else:
            new_data.append((r, g, b, a))
    img.putdata(new_data)
    img.save(path, "PNG")
    print(f"Processed: {os.path.basename(path)}")

for filename in [f for f in os.listdir(logos_dir) if f.endswith(".png") or f.endswith(".jpg")]:
    filepath = os.path.join(logos_dir, filename)
    if os.path.exists(filepath):
        remove_white_background(filepath)
    else:
        print(f"Not found: {filename}")

print("Done!")
