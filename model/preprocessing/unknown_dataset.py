import os
from torch.utils.data import Dataset
from torchvision import transforms

class UnknownTestDataset(Dataset):
    def __init__(self, img_dir, classes, transform = None):
        if not transform:
            self.transform = transforms.Compose([
                transforms.Resize((384, 384)),
                transforms.ToTensor(),
                transforms.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225))
            ])
        else: self.transform = transform

        self.dataset = ImageFolderWrapper(root=img_dir, class_to_idx=classes, transform=self.transform)

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        image, label = self.dataset[idx]
        return image, label