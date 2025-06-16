import os
import numpy as np
from PIL import Image
from torch.utils.data import Dataset

class HAM10000Dataset(Dataset):
    def __init__(self, img_dir, dataframe, transform=None):
        self.img_dir = img_dir
        self.data = dataframe
        self.transform = transform

        self.image_ids = self.data.iloc[:,0]
        self.labels = np.argmax(self.data.iloc[:,1:].values.astype(float), axis=1)

    def __len__(self):
        return len(self.image_ids)

    def __getitem__(self, idx):
        img_name = self.image_ids[idx] + '.jpg'
        if img_name.startswith('ISIC'):
            img_path = os.path.join(self.img_dir[0], img_name)
        else: img_path = os.path.join(self.img_dir[1], img_name)
        image = Image.open(img_path).convert('RGB')
        label = self.labels[idx]

        if self.transform:
            image = self.transform(image=np.array(image))['image']
            
        return image, label