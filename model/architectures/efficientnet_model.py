import pytorch_lightning as pl
import torch
from torch.nn import Linear
import torchmetrics
from sklearn.metrics import confusion_matrix
import seaborn as sns
import os
import csv
import numpy as np
import torchvision.models as models
from model.helpers.cross_entropy_smoithin_loss import LabelSmoothingCrossEntropy

import torch.nn.functional as F
import matplotlib.pyplot as plt

class EfficientNetV2Model(pl.LightningModule):
  def __init__(self, num_classes = 8):
    super().__init__()
    efficientnet_model = models.efficientnet_b0(weights = models.EfficientNet_B0_Weights.IMAGENET1K_V1)
    self.backbone = efficientnet_model.features
    self.pooling = lambda x: F.adaptive_max_pool2d(x, 1)

    self.fc1 = Linear(1280, 512)
    self.fc2 = Linear(512, num_classes)

    self.dropout = torch.nn.Dropout(p=0.3)
      
    self.loss_function = LabelSmoothingCrossEntropy(smoothing=0.1)

    self.train_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)
    self.val_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes, average=None)
    self.test_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes, average=None)
    self.val_acc_macro = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)
    self.test_acc_macro = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)


    self.train_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes)
    self.val_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes, average=None)
    self.test_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes, average=None)
    self.val_pr_macro = torchmetrics.Precision(task='multiclass', num_classes=num_classes)
    self.test_pr_macro = torchmetrics.Precision(task='multiclass', num_classes=num_classes)

    self.train_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes)
    self.val_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes, average=None)
    self.test_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes, average=None)
    self.val_rc_macro = torchmetrics.Recall(task='multiclass', num_classes=num_classes)
    self.test_rc_macro = torchmetrics.Recall(task='multiclass', num_classes=num_classes)

    self.train_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')
    self.val_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')
    self.test_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')

    self.val_preds = []
    self.val_labels = []

    self.test_preds = []
    self.test_labels = []

  def forward(self, x):
    x = self.backbone(x)
    x = self.pooling(x).flatten(1)

    x = self.dropout(x)
    x = self.fc1(x)
    x = F.relu(x) 

    x = self.fc2(x)

    return x

  def configure_optimizers(self):
    optimizer = torch.optim.AdamW(self.parameters(), lr=1e-4, weight_decay=1e-4)
    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='max', factor=0.5, patience=3)

    return {
    "optimizer": optimizer,
    "lr_scheduler": {
        "scheduler": scheduler,
        "monitor": "val_macro_f1",
        "interval": "epoch",
        "frequency": 1,
         },
    }

  def training_step(self, train_batch, batch_idx):
    inputs, labels = train_batch

    outputs = self.forward(inputs.float())
    loss = self.loss_function(outputs, labels)

    self.log('train_loss', loss, on_epoch = True, on_step= False)
      
    preds = torch.argmax(outputs, dim=1)

    self.train_acc(preds, labels)
    self.log('train_acc', self.train_acc, on_epoch=True, on_step= False)

    self.train_pr(preds, labels)
    self.log('train_pr', self.train_pr, on_epoch=True, on_step= False)

    self.train_rc(preds, labels)
    self.log('train_rc', self.train_rc, on_epoch=True, on_step= False)

    self.train_macro_f1(preds, labels)
    self.log('train_macro_f1', self.train_macro_f1, on_epoch=True, on_step= False)

    return loss

  def validation_step(self, val_batch, batch_idx):
    inputs, labels = val_batch

    outputs = self.forward(inputs.float())
    loss = self.loss_function(outputs, labels)

    self.log('val_loss', loss, on_epoch = True, on_step= False)

    preds = torch.argmax(outputs, dim=1)

    self.val_acc(preds, labels)
    self.val_rc(preds, labels)
    self.val_pr(preds, labels)

    self.val_acc_macro(preds, labels)
    self.log('val_acc_macro', self.val_acc_macro, on_epoch=True, on_step=False)

    self.val_pr_macro(preds, labels)
    self.log('val_pr_macro', self.val_pr_macro, on_epoch=True, on_step= False)

    self.val_rc_macro(preds, labels)
    self.log('val_rc_macro', self.val_rc_macro, on_epoch=True, on_step= False)

    self.val_macro_f1(preds, labels)
    self.log('val_macro_f1', self.val_macro_f1, on_epoch=True, on_step = False)
      
    if self.current_epoch % 5 == 4 or self.current_epoch == 0:
        self.val_preds.append(preds)
        self.val_labels.append(labels)

    return loss

  def on_validation_epoch_end(self):
    if (self.current_epoch % 5 == 4 or self.current_epoch == 0) and not self.trainer.sanity_checking:
        val_preds = torch.cat(self.val_preds)
        val_labels = torch.cat(self.val_labels)
        
        cm = confusion_matrix(val_labels.cpu().numpy(), val_preds.cpu().numpy())      
        self.plot_confusion_matrix(cm)

        acc_vals = self.val_acc.compute().cpu().numpy()
        rc_vals = self.val_rc.compute().cpu().numpy()
        pr_vals = self.val_pr.compute().cpu().numpy()
        
        self.write_per_class_metrics({'acc':acc_vals,
                                      'rc':rc_vals,
                                      'pr':pr_vals
                                     })
        
        self.val_acc.reset()
        self.val_rc.reset()
        self.val_pr.reset()
        self.val_preds.clear()
        self.val_labels.clear()

  def write_per_class_metrics(self, metrics, filename = "val_class_metrics.csv"):
      file_exists = os.path.exists(filename)

      if self.current_epoch == 0 and file_exists:
          os.remove(filename)
          file_exists = False
      
      with open(filename, "a", newline="") as f:
          writer = csv.writer(f)
          
          if not file_exists:
              head = ["epoch"]
              for col in range(1, 9):
                  for key in metrics.keys():
                      head.append(f'{col}_{key}')
              writer.writerow(head)

          row = [self.current_epoch]
          for i in range(len(range(1, 9))):
              for key in metrics.keys():
                  row.append(metrics[key][i])               
          writer.writerow(row)
      
  def plot_confusion_matrix(self, cm, title = "Validation"):      
    cmn = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(cmn, annot=True, fmt='.2f', cmap="Blues", ax=ax, xticklabels=range(1, 9), yticklabels=range(1, 9))
    ax.set_xlabel("Predicted labels")
    ax.set_ylabel("True labels")

    self.logger.experiment.add_figure(f"{title} Confusion Matrix {self.current_epoch} epoch", fig, self.current_epoch)
    plt.close(fig)

  def test_step(self, test_batch, test_idx):
    inputs, labels = test_batch

    outputs = self.forward(inputs.float())
    loss = self.loss_function(outputs, labels)

    preds = torch.argmax(outputs, dim=1)

    self.test_acc(preds, labels)
    self.test_rc(preds, labels)
    self.test_pr(preds, labels)

    self.test_acc_macro(preds, labels)
    self.log('test_acc_macro', self.test_acc_macro, on_epoch=True, on_step = False)

    self.test_pr_macro(preds, labels)
    self.log('test_pr_macro', self.test_pr_macro, on_epoch=True, on_step= False)

    self.test_rc_macro(preds, labels)
    self.log('test_rc_macro', self.test_rc_macro, on_epoch=True, on_step= False)

    self.test_macro_f1(preds, labels)
    self.log('test_macro_f1', self.test_macro_f1, on_epoch=True, on_step=False)

    self.test_preds.append(preds)
    self.test_labels.append(labels)

    return loss

  def on_test_epoch_end(self):
    test_preds = torch.cat(self.test_preds)
    test_labels = torch.cat(self.test_labels)
    
    cm = confusion_matrix(test_labels.cpu().numpy(), test_preds.cpu().numpy())
    
    self.plot_confusion_matrix(cm, 'Test')
    
    self.test_preds.clear()
    self.test_labels.clear()