import pandas as pd
import albumentations as A
from albumentations.pytorch import ToTensorV2
import pytorch_lightning as pl
from torch.utils.data import DataLoader
from sklearn.model_selection import StratifiedShuffleSplit
import matplotlib.pyplot as plt

class Ham10000DataModule(pl.LightningDataModule):
  def __init__(self, csv_path, batch_size = 16, train_transform=None, val_test_transform=None):
    super().__init__()
    self.batch_size = batch_size
    self.train_transform = train_transform
    self.val_test_transform = val_test_transform
    self.data = pd.read_csv(csv_path)

  def setup(self, stage = None):
    if self.train_transform is None:
            self.train_transform = A.Compose([
                A.Resize(384, 384),
                A.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
                A.pytorch.ToTensorV2(),
            ])
    if self.val_test_transform is None:
            self.val_test_transform = A.Compose([
                A.Resize(384, 384),
                A.Normalize((0.485, 0.456, 0.406), (0.229, 0.224, 0.225)),
                A.pytorch.ToTensorV2(),
            ])

    train_df, val_df, test_df = self.get_stratified_splits(self.data)

    train_df = self.rebalance(train_df)
    val_df = self.rebalance(val_df, n_samples = len(val_df) // len(val_df.columns[1:]))

    self.plot_class_balance([train_df, val_df, test_df])
      
    self.train_dataset = HAM10000Dataset([f'{path_to_dataset}images', path_to_healthy_dataset], train_df, transform=self.train_transform)
    self.val_dataset = HAM10000Dataset([f'{path_to_dataset}images', path_to_healthy_dataset], val_df, transform=self.val_test_transform)
    self.test_dataset = HAM10000Dataset([f'{path_to_dataset}images', path_to_healthy_dataset], test_df, transform=self.val_test_transform)
      
    print(f'Train Len: {len(self.train_dataset)}')
    print(f'Val Len: {len(self.val_dataset)}')
    print(f'Test Len: {len(self.test_dataset)}')

  def train_dataloader(self):
    return DataLoader(self.train_dataset, self.batch_size, shuffle=True)

  def val_dataloader(self):
    return DataLoader(self.val_dataset, self.batch_size, shuffle=True)

  def test_dataloader(self):
    return DataLoader(self.test_dataset, shuffle=False)

  def get_stratified_splits(self, df):
      values = df.iloc[:, 0]
      labels = df.iloc[:, 1:]
      
      splitter = StratifiedShuffleSplit(n_splits = 1, test_size = 0.3, random_state = 42)
      train_idx, temp_idx = next(splitter.split(values, labels))
      
      splitter_val_test = StratifiedShuffleSplit(n_splits=1, test_size=0.33, random_state=42)
      val_idx, test_idx = next(splitter_val_test.split(df.iloc[temp_idx, 0], df.iloc[temp_idx, 1:]))

      train_set = df.iloc[train_idx].reset_index(drop=True)
      val_set = df.iloc[temp_idx].iloc[val_idx].reset_index(drop=True)
      test_set = df.iloc[temp_idx].iloc[test_idx].reset_index(drop=True)

      return train_set, val_set, test_set

  def rebalance(self, df, n_samples=1000):
    for col in df.columns[1:]:
        col_samples = df[df[col] == 1].sample(n=n_samples, random_state=42, replace=True)
        df = pd.concat([col_samples, df[df[col] != 1]], ignore_index=True)
        print(f'Col: {col} Sum: {df[col].sum()}')
    print("------------------------")
    return df

  def plot_class_balance(self, df_array):
      _, axis = plt.subplots(1, len(df_array), figsize=(5 * len(df_array), 4))
      
      for i, df in enumerate(df_array):
          balance = df.sum(axis=0)[1:]
          
          axis[i].set_title('Class Imbalance Histogram')
          balance.plot(kind='bar', ax=axis[i], width=0.9)

      plt.tight_layout()
      plt.show()