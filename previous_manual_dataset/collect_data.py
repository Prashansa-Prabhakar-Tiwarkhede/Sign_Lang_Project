import cv2
import mediapipe as mp
import csv
import os

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

file_exists = os.path.isfile("dataset.csv")

with open("dataset.csv", "a", newline="") as f:
    writer = csv.writer(f)

    if not file_exists:
        header = [f"feature_{i}" for i in range(63)]
        header.append("label")
        writer.writerow(header)

    label = input("Enter the letter you want to collect (A-Z): ").upper()

    print("Collecting data for:", label)
    print("Press 's' to save frame, 'q' to quit")

    last_landmarks = None

    while True:
        ret, frame = cap.read()
        if not ret:
            break

        frame = cv2.flip(frame, 1)
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = hands.process(rgb_frame)

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                mp_draw.draw_landmarks(frame, hand_landmarks, mp_hands.HAND_CONNECTIONS)

                landmarks = []
                for lm in hand_landmarks.landmark:
                    landmarks.extend([lm.x, lm.y, lm.z])

                last_landmarks = landmarks
                

        cv2.imshow("Data Collection", frame)

        key = cv2.waitKey(1) & 0xFF

        if key == ord('s'):
            print("S pressed")
            if last_landmarks is not None:
                writer.writerow(last_landmarks + [label])
                print("Saved!")
            else:
                print("No hand data available!")

        if key == ord('q'):
            break

cap.release()
cv2.destroyAllWindows()