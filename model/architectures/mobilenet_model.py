import pytorch_lightning as pl
import torch
from torch.nn import Linear
import torchmetrics
from sklearn.metrics import confusion_matrix
import seaborn as sns
import numpy as np
from torchvision.models import mobilenet_v2 as mobilenetv2_model

import torch.nn.functional as F
import matplotlib.pyplot as plt

class MobileNetV2Model(pl.LightningModule):
  def __init__(self, num_classes = 7):
    super().__init__()

    self.backbone = mobilenetv2_model.features
    self.pooling = lambda x: F.adaptive_max_pool2d(x, 1)

    self.fc1 = Linear(1280, 640)
    self.fc2 = Linear(640, 250)
    self.fc3 = Linear(250, num_classes)

    self.dropout = torch.nn.Dropout(p=0.3)
    self.loss_function = torch.nn.CrossEntropyLoss()

    self.train_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)
    self.val_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)
    self.test_acc = torchmetrics.Accuracy(task='multiclass', num_classes=num_classes)

    self.train_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes)
    self.val_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes)
    self.test_pr = torchmetrics.Precision(task='multiclass', num_classes=num_classes)

    self.train_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes)
    self.val_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes)
    self.test_rc = torchmetrics.Recall(task='multiclass', num_classes=num_classes)

    self.train_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')
    self.val_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')
    self.test_macro_f1 = torchmetrics.F1Score(num_classes=num_classes, task="multiclass", average='macro')

    self.val_preds = []
    self.val_labels = []

  def forward(self, x):
    x = self.backbone(x)
    x = self.pooling(x).flatten(1)

    x = self.dropout(x)
    x = self.fc1(x)
    x = F.relu(x)
    x = self.fc2(x)
    x = F.relu(x)
    x = self.fc3(x)

    return x

  def configure_optimizers(self):
    optimizer = torch.optim.AdamW(self.parameters(), lr=1e-4)
    scheduler = torch.optim.lr_scheduler.StepLR(optimizer, step_size=10, gamma=0.5)
    
    return {
        "optimizer": optimizer,
        "lr_scheduler": scheduler
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
    self.log('val_acc', self.val_acc, on_epoch=True, on_step=False)

    self.val_pr(preds, labels)
    self.log('val_pr', self.val_pr, on_epoch=True, on_step= False)

    self.val_rc(preds, labels)
    self.log('val_rc', self.val_rc, on_epoch=True, on_step= False)

    self.val_macro_f1(preds, labels)
    self.log('val_macro_f1', self.val_macro_f1, on_epoch=True, on_step = False)

    if self.current_epoch % 5 == 4 or self.current_epoch == 0:
        self.val_preds.append(preds)
        self.val_labels.append(labels)

    return loss

  def on_validation_epoch_end(self):
    if((self.current_epoch % 5 == 4 or self.current_epoch == 0) and not self.trainer.sanity_checking):
        val_preds = torch.cat(self.val_preds)
        val_labels = torch.cat(self.val_labels)
    
        cm = confusion_matrix(val_labels.cpu().numpy(), val_preds.cpu().numpy())
    
        self.plot_confusion_matrix(cm)
    
        self.val_preds.clear()
        self.val_labels.clear()
      
  def plot_confusion_matrix(self, cm, title = 'Validation'):
    cmn = cm.astype('float') / cm.sum(axis=1)[:, np.newaxis]
    fig, ax = plt.subplots(figsize=(10, 8))
    sns.heatmap(cmn, annot=True, fmt='.2f', cmap="Blues", ax=ax, xticklabels=df.columns[1:], yticklabels=df.columns[1:])
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
    self.log('test_acc', self.test_acc, on_epoch=True, on_step= False)

    self.test_pr(preds, labels)
    self.log('test_pr', self.test_pr, on_epoch=True, on_step= False)

    self.test_rc(preds, labels)
    self.log('test_rc', self.test_rc, on_epoch=True, on_step= False)

    self.test_macro_f1(preds, labels)
    self.log('test_macro_f1', self.test_macro_f1, on_epoch=True, on_step= False)

    return loss
      
  def on_test_epoch_end(self):
    test_preds = torch.cat(self.val_preds)
    test_labels = torch.cat(self.val_labels)
    
    cm = confusion_matrix(test_labels.cpu().numpy(), test_preds.cpu().numpy())
    
    self.plot_confusion_matrix(cm, 'Test')
    
    self.val_preds.clear()
    self.val_labels.clear()