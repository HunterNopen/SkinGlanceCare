from torchvision.datasets import ImageFolder
from torchvision.datasets.folder import has_file_allowed_extension, IMG_EXTENSIONS
import os

class ImageFolderWrapper(ImageFolder):
    def __init__(self, root, class_to_idx, transform=None):
        self.custom_class_to_idx = class_to_idx
        self.custom_classes = list(class_to_idx.keys())

        super().__init__(root=root, transform=transform)

        self.class_to_idx = self.custom_class_to_idx
        self.classes = self.custom_classes

        self.samples = self.make_dataset(self.root, self.class_to_idx)
        self.targets = [s[1] for s in self.samples]
        self.imgs = self.samples

    def make_dataset(
        self, directory, class_to_idx,
        extensions=IMG_EXTENSIONS, is_valid_file=None,
        allow_empty=False
    ):
        instances = []
        directory = os.path.expanduser(directory)

        for target_class in sorted(class_to_idx.keys()):
            class_index = class_to_idx[target_class]
            target_dir = os.path.join(directory, target_class)
            if not os.path.isdir(target_dir):
                continue
            for root, _, fnames in sorted(os.walk(target_dir)):
                for fname in sorted(fnames):
                    path = os.path.join(root, fname)
                    if has_file_allowed_extension(fname, extensions):
                        item = (path, class_index)
                        instances.append(item)
        return instances