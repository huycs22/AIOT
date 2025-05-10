import cv2
from facenet_pytorch import MTCNN
import torch
from datetime import datetime
import os
import sys



device =  torch.device('cuda:0' if torch.cuda.is_available() else 'cpu')
print(device)

# IMG_PATH = './data/test_images/'
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
IMG_PATH = os.path.join(BASE_DIR, 'data', 'test_images')

count = 50
# usr_name = input("Input ur name: ")
if len(sys.argv) < 2:
    print("Usage: face_capture.py <username>")
    sys.exit(1)
    
usr_name = sys.argv[1]

USR_PATH = os.path.join(IMG_PATH, usr_name)
os.makedirs(USR_PATH, exist_ok=True)
leap = 1

mtcnn = MTCNN(margin = 20, keep_all=False, select_largest = True, post_process=False, device = device)
cap = cv2.VideoCapture(0)
cap.set(cv2.CAP_PROP_FRAME_WIDTH,640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT,480)
while cap.isOpened() and count:
    isSuccess, frame = cap.read()
    if mtcnn(frame) is not None and leap%2:
        path = str(USR_PATH+'/{}.jpg'.format(str(datetime.now())[:-7].replace(":","-").replace(" ","-")+str(count)))
        face_img = mtcnn(frame, save_path = path)
        print(face_img)
        count-=1
    leap+=1
    cv2.imshow('Face Capturing', frame)
    if cv2.waitKey(1)&0xFF == 27:
        break
cap.release()
cv2.destroyAllWindows()
sys.exit(0)