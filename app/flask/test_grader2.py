import cv2
import os
import numpy as np

# Define the file path
file_path = 'data_images/page_2.png'

# Check if the file exists
if not os.path.exists(file_path):
    print(f"Error: File '{file_path}' not found.")
    exit()

# Load the image
image = cv2.imread(file_path)

# Check if the image was loaded successfully
if image is None:
    print(f"Error: Unable to load image '{file_path}'.")
    exit()

# Get the image dimensions
height, width, channels = image.shape

# Calculate the height of the top 1/5 of the image
cut_off_height = height // 5

# Crop the image to remove the top 1/5
cropped_image = image[cut_off_height:height, 0:width]

# Convert to grayscale
gray = cv2.cvtColor(cropped_image, cv2.COLOR_BGR2GRAY)

# Apply bilateral filter
bilateral_filtered = cv2.bilateralFilter(gray, 9, 75, 75)

# Apply thresholding
thresh = cv2.adaptiveThreshold(bilateral_filtered, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY_INV, 11, 2)

# Find contours
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

# Filter contours based on area to identify bubbles
bubbles = [cnt for cnt in contours if 300 < cv2.contourArea(cnt) < 600]

# Sort bubbles by x-coordinate
bubbles = sorted(bubbles, key=lambda c: cv2.boundingRect(c)[0])

# Group bubbles into columns based on x-coordinate
column_threshold = 5  # Adjust this threshold based on your specific image
columns = []
current_column = []

for cnt in bubbles:
    x, _, _, _ = cv2.boundingRect(cnt)
    if not current_column:
        current_column.append(cnt)
    else:
        last_x, _, _, _ = cv2.boundingRect(current_column[-1])
        if abs(x - last_x) < column_threshold:
            current_column.append(cnt)
        else:
            columns.append(current_column)
            current_column = [cnt]

if current_column:
    columns.append(current_column)

# Further group contours within each column into rows
row_threshold = 5  # Adjust this value based on the spacing between rows
grid = []

for col_index, column in enumerate(columns):
    column_groups = []
    current_row = []

    for cnt in sorted(column, key=lambda c: cv2.boundingRect(c)[1]):
        if not current_row:
            current_row.append(cnt)
        else:
            _, y, _, _ = cv2.boundingRect(cnt)
            _, last_y, _, _ = cv2.boundingRect(current_row[-1])
            if abs(y - last_y) < row_threshold:
                current_row.append(cnt)
            else:
                column_groups.append(current_row)
                current_row = [cnt]

    if current_row:
        column_groups.append(current_row)

    grid.append(column_groups)

# Draw contours around each detected bubble and show column and row groups
for col_index, column in enumerate(grid):
    for row_index, group in enumerate(column):
        color = (0, 255, 0) if row_index % 2 == 0 else (0, 0, 255)  # Alternate colors for visualization
        for cnt in group:
            x, y, w, h = cv2.boundingRect(cnt)
            cv2.drawContours(cropped_image, [cnt], -1, color, 2)
            cv2.putText(cropped_image, f"C{col_index}R{row_index}", (x, y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 2)

# Function to get a specific bubble by its column and row number
def get_bubble(col_index, row_index):
    try:
        return grid[col_index][row_index]
    except IndexError:
        print(f"No bubble found at column {col_index}, row {row_index}")
        return None

# Example usage of the get_bubble function
col_index = 0  # Specify the column index
row_index = 0  # Specify the row index
bubble = get_bubble(col_index, row_index)
if bubble:
    for cnt in bubble:
        x, y, w, h = cv2.boundingRect(cnt)
        cv2.rectangle(cropped_image, (x, y), (x + w, y + h), (255, 255, 0), 2)

# Show the image with detected bubbles
cv2.imshow("Detected Bubbles with Columns and Rows", cropped_image)
cv2.waitKey(0)
cv2.destroyAllWindows()
