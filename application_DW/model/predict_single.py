import time
import torch
import torch.nn as nn
from sklearn.metrics import precision_recall_curve, average_precision_score
from torch.utils.data import DataLoader
import numpy as np
import pandas as pd
import argparse
import matplotlib.pyplot as plt
from torchsummary import summary

from Models.Model import Model
from Utils.DataUtils import GetUrlsAndLabels, URLDataset, CharTransformer, NGramTransformer


def parse_args():
    """
    :return:进行参数的解析
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dataset", type=str, default='data', help="The dataset directory")
    parser.add_argument("-o", "--output", type=str, default='Outputs', help="The output directory")
    parser.add_argument("-mn", "--model_name", type=str, default='model001', help="Model filename")
    # Input ngram selections
    parser.add_argument("-n1", "--ngram_1", type=int, default=3, help="Ngram value of first ngram embedding layer")
    parser.add_argument("-n2", "--ngram_2", type=int, default=4, help="Ngram value of second ngram embedding layer")
    parser.add_argument("-n3", "--ngram_3", type=int, default=5, help="Ngram value of third ngram embedding layer")
    # Feature Selection Parameters
    parser.add_argument("-maxf", "--max_features", type=int, default=160000, help="Maximum number of features")
    parser.add_argument("-msl", "--max_seq_len", type=int, default=128, help="The maximum sequence length to trim our transformed sequences")

    parser.add_argument("-ced", "--char_embed_dim", type=int, default=95, help="Embedding dimension for Embedding Layer")
    parser.add_argument("-ed", "--embed_dim", type=int, default=15, help="Embedding dimension for Embedding Layer")
    parser.add_argument("-aw", "--attn_width", type=int, default=10, help="The attention layer width")
    parser.add_argument("-rnn", "--rnn_cell_size", type=int, default=256, help="The recurrent size")
    parser.add_argument("-bs", "--batch_size", type=int, default=128, help="Batch size")
    parser.add_argument("-ep", "--epochs", type=int, default=5, help="number of epoch to train our model")
    parser.add_argument("-lr", "--learning_rate", type=float, default=0.001, help="Learning rate")

    parser.add_argument("-nc", "--num_class", type=int, default=13, help="Num of Class")

    args = parser.parse_args()
    return args

args = parse_args()
train_file = args.dataset + "/train.csv"
val_file = args.dataset + "/val.csv"
# 获取数据
train_urls, train_labels = GetUrlsAndLabels(train_file, args.max_seq_len)
val_urls, val_labels = GetUrlsAndLabels(val_file, args.max_seq_len)
print('################################ Character Level Transformation ################################')
CT = CharTransformer(max_seq_len=args.max_seq_len)
train_x0, val_x0 = CT.transform(train_urls), CT.transform(val_urls)
vocab_size_0 = CT.get_vocab_size()
print('################################ 1st NGram Input Transformation ################################')
NT_1 = NGramTransformer(args.max_seq_len, args.ngram_1, train_urls, train_labels)
train_x1, val_x1 = NT_1.transform(train_urls), NT_1.transform(val_urls)
vocab_size_1 = NT_1.get_vocab_size()
print('################################ 2nd NGram Input Transformation ################################')
NT_2 = NGramTransformer(args.max_seq_len, args.ngram_2, train_urls, train_labels)
train_x2, val_x2 = NT_2.transform(train_urls), NT_2.transform(val_urls)
vocab_size_2 = NT_2.get_vocab_size()
print('################################ 3rd NGram Input Transformation ################################')
NT_3 = NGramTransformer(args.max_seq_len, args.ngram_3, train_urls, train_labels)
train_x3, val_x3 = NT_3.transform(train_urls), NT_3.transform(val_urls)
vocab_size_3 = NT_3.get_vocab_size()

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# 封装成DataLoader
dataset_train = URLDataset(train_x0, train_x1, train_x2, train_x3, train_labels)
dataset_val = URLDataset(val_x0, val_x1, val_x2, val_x3, val_labels)
train_loader = DataLoader(dataset_train, args.batch_size, shuffle=True)
val_loader = DataLoader(dataset_val, args.batch_size, shuffle=True)

model = Model(vocab_size_0, vocab_size_1, vocab_size_2, vocab_size_3,
                  args.char_embed_dim,
                  args.embed_dim,
                  args.max_seq_len,
                  args.rnn_cell_size,
                  args.attn_width).to(device)

url = "www.baidu.com"
weight_file = 'Outputs/weight_best.pth'

def predict(url):
    batch_size = 128
    model.load_state_dict(torch.load(weight_file), strict=True)
    x = np.array([url for _ in range(batch_size)])
    x0 = CT.transform(x).to(device)
    x1 = NT_1.transform(x).to(device)
    x2 = NT_2.transform(x).to(device)
    x3 = NT_3.transform(x).to(device)
    model.eval()
    outputs = model(x0, x1, x2, x3)
    y = np.argmax(outputs[0].tolist())

    # print("{} belong to class_{}".format(url, y))
    return y

y =predict(url)
print(y)