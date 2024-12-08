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
import os
from datetime import datetime
from time import process_time

# 设置随机数种子
import random
seed = 42
torch.manual_seed(seed)
np.random.seed(seed)
random.seed(seed)

# 创建文件夹存储训练结果
def create_dir():
    now = datetime.now()  # 获得当前时间
    timestr = now.strftime("%m.%d_%H.%M")
    dir = os.getcwd() + '/results_all/' + timestr  # os.getcwd()获得当前执行目录
    if os.path.exists(dir):  # 看文件夹是否存在
        print('文件夹已存在')
    else:  # 如果不存在
        os.makedirs(dir)
        os.makedirs(dir+'/Outputs')
        os.makedirs(dir+'/Score_results')
    return dir

# 定义参数
def parse_args():
    """
    :return:进行参数的解析
    """
    parser = argparse.ArgumentParser()
    parser.add_argument("-d", "--dataset", type=str, default='data', help="The dataset directory")
    parser.add_argument("-o", "--output", type=str, default='Outputs', help="The weights output directory")
    parser.add_argument("-mn", "--model_name", type=str, default='model001', help="Model filename")

    # Input ngram selections
    parser.add_argument("-n1", "--ngram_1", type=int, default=3, help="Ngram value of first ngram embedding layer")
    parser.add_argument("-n2", "--ngram_2", type=int, default=4, help="Ngram value of second ngram embedding layer")
    parser.add_argument("-n3", "--ngram_3", type=int, default=5, help="Ngram value of third ngram embedding layer")
    # Feature Selection Parameters
    parser.add_argument("-maxf", "--max_features", type=int, default=160000, help="Maximum number of features")
    parser.add_argument("-msl", "--max_seq_len", type=int, default=192, help="The maximum sequence length to trim our transformed sequences")

    parser.add_argument("-ced", "--char_embed_dim", type=int, default=95, help="Embedding dimension for Embedding Layer")
    parser.add_argument("-ed", "--embed_dim", type=int, default=15, help="Embedding dimension for Embedding Layer")
    parser.add_argument("-aw", "--attn_width", type=int, default=10, help="The attention layer width")
    parser.add_argument("-rnn", "--rnn_cell_size", type=int, default=384, help="The recurrent size")
    parser.add_argument("-bs", "--batch_size", type=int, default=128, help="Batch size")
    parser.add_argument("-ep", "--epochs", type=int, default=30, help="number of epoch to train our model")
    parser.add_argument("-lr", "--learning_rate", type=float, default=0.01, help="Learning rate")

    parser.add_argument("-nc", "--num_class", type=int, default=13, help="Num of Class")

    parser.add_argument("-nw", "--num_workers", type=int, default=4)

    args = parser.parse_args()
    return args


# 每轮训练和验证时计算各个类别和整体的score指标
def cal_score(score_list, label_list, num_class, train_or_val, epoch):
    score_array = np.array(score_list)
    # 将label转换成onehot形式
    label_tensor = torch.tensor(label_list)
    label_tensor = label_tensor.reshape((label_tensor.shape[0], 1))
    label_onehot = torch.zeros(label_tensor.shape[0], num_class)
    label_onehot.scatter_(dim=1, index=label_tensor, value=1)
    label_onehot = np.array(label_onehot)
    # print("score_array:", score_array.shape)  # (batchsize, classnum) softmax
    # print("label_onehot:", label_onehot.shape)  # torch.Size([batchsize, classnum]) onehot

    # 计算整体的score和各个类别的score
    score_dict = dict()
    precision_dict = dict()
    recall_dict = dict()
    average_precision_dict = dict()

    # 调用sklearn库，计算每个类别对应的precision和recall
    for i in range(num_class):
        precision_dict[i], recall_dict[i], _ = precision_recall_curve(label_onehot[:, i], score_array[:, i])
        average_precision_dict[i] = average_precision_score(label_onehot[:, i], score_array[:, i])
        # print(precision_dict[i].shape, recall_dict[i].shape, average_precision_dict[i])
        R_07_idx = np.where(recall_dict[i] <= 0.7)[0][0]
        P_07 = precision_dict[i][R_07_idx]
        R_08_idx = np.where(recall_dict[i] <= 0.8)[0][0]
        P_08 = precision_dict[i][R_08_idx]
        R_09_idx = np.where(recall_dict[i] <= 0.9)[0][0]
        P_09 = precision_dict[i][R_09_idx]
        score_dict[i] = 0.5 * P_07 + 0.3 * P_08 + 0.2 * P_09
        # print('Score of class_{} is {}'.format(i, score_dict[i]))

    # micro
    precision_dict["micro"], recall_dict["micro"], _ = precision_recall_curve(label_onehot.ravel(),
                                                                              score_array.ravel())
    average_precision_dict["micro"] = average_precision_score(label_onehot, score_array, average="micro")
    print('micro-averaged: {0:0.2f}'.format(average_precision_dict["micro"]))
    R_07_idx = np.where(recall_dict["micro"] <= 0.7)[0][0]
    P_07 = precision_dict["micro"][R_07_idx]
    R_08_idx = np.where(recall_dict["micro"] <= 0.8)[0][0]
    P_08 = precision_dict["micro"][R_08_idx]
    R_09_idx = np.where(recall_dict["micro"] <= 0.9)[0][0]
    P_09 = precision_dict["micro"][R_09_idx]
    score_dict["micro"] = 0.5 * P_07 + 0.3 * P_08 + 0.2 * P_09
    print('Score is {}.'.format(score_dict["micro"]))

    score_df = pd.DataFrame(list(score_dict.items()), columns=['class', 'score'])
    precision_df = pd.DataFrame(list(precision_dict.items()), columns=['class', 'precision'])
    recall_df = pd.DataFrame(list(recall_dict.items()), columns=['class', 'recall'])
    average_precision_df = pd.DataFrame(list(average_precision_dict.items()), columns=['class', 'average_precision'])
    all_df = score_df.merge(average_precision_df)
    # all_df = all_df.merge(recall_df)
    # all_df = all_df.merge(precision_df)
    all_df.to_excel(dir+'/Score_results/score_result_{}_{}.xlsx'.format(train_or_val, epoch), index=False)

    # # 绘制所有类别平均的pr曲线
    # plt.figure()
    # plt.step(recall_dict['micro'], precision_dict['micro'], where='post')
    #
    # plt.xlabel('Recall')
    # plt.ylabel('Precision')
    # plt.ylim([0.0, 1.05])
    # plt.xlim([0.0, 1.0])
    # plt.title(
    #     'Average precision score, micro-averaged over all classes: AP={0:0.2f}'
    #     .format(average_precision_dict["micro"]))
    # plt.savefig("pr_curve.jpg")
    # plt.show()


def train(args, model, train_loader, val_loader, device, loss_fn, optimizer, scheduler):
    num_class = args.num_class
    train_loss = []
    valid_loss = []
    train_epochs_loss = []
    valid_epochs_loss = []

    start = time.time()
    for epoch in range(args.epochs):
        model.train()
        train_epoch_loss = []
        train_score_list = []  # 存储预测得分
        train_label_list = []  # 存储真实标签
        for idx, (data, labels) in enumerate(train_loader):
            seqs1 = data[0].to(device)
            seqs2 = data[1].to(device)
            seqs3 = data[2].to(device)
            seqs4 = data[3].to(device)
            labels = labels.to(device)
            outputs = model(seqs1, seqs2, seqs3, seqs4)

            # 储存预测得分和真实标签
            score_tmp = outputs  # (batchsize, nclass)
            train_score_list.extend(score_tmp.detach().cpu().numpy())
            train_label_list.extend(labels.cpu().numpy())

            loss = loss_fn(outputs, labels)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
            scheduler.step()
            train_epoch_loss.append(loss.item())
            train_loss.append(loss.item())

            if idx % (len(train_loader) // 5) == 0:
                print("epoch={}/{}, {}/{} of train, loss={}".format(epoch, args.epochs, idx, len(train_loader), loss.item()))
        train_epochs_loss.append(np.average(train_epoch_loss))
        # 计算得分
        cal_score(train_score_list, train_label_list, num_class, 'train', epoch)

        # =====================valid============================
        model.eval()
        valid_epoch_loss = []
        valid_score_list = []  # 存储预测得分
        valid_label_list = []  # 存储真实标签
        for idx, (data, labels) in enumerate(val_loader):
            seqs1 = data[0].to(device)
            seqs2 = data[1].to(device)
            seqs3 = data[2].to(device)
            seqs4 = data[3].to(device)
            labels = labels.to(device)
            outputs = model(seqs1, seqs2, seqs3, seqs4)

            # 储存预测得分和真实标签
            score_tmp = outputs  # (batchsize, nclass)
            valid_score_list.extend(score_tmp.detach().cpu().numpy())
            valid_label_list.extend(labels.cpu().numpy())

            loss = loss_fn(outputs, labels)
            valid_epoch_loss.append(loss.item())
            valid_loss.append(loss.item())
        valid_epochs_loss.append(np.average(valid_epoch_loss))
        print("val_loss:{}".format(np.average(valid_epoch_loss)))
        # 计算得分
        cal_score(valid_score_list, valid_label_list, num_class, 'val', epoch)

        # ====================adjust lr========================

        # lr_adjust = {
        #     2: 5e-5, 4: 1e-5, 6: 5e-6, 8: 1e-6,
        #     10: 5e-7, 15: 1e-7, 20: 5e-8
        # }
        # if epoch in lr_adjust.keys():
        #     lr = lr_adjust[epoch]
        #     for param_group in optimizer.param_groups:
        #         param_group['lr'] = lr
        #     print('Updating learning rate to {}'.format(lr))
        if (epoch+1) % 5 == 0:
            torch.save(model.state_dict(), dir+'/Outputs/model_epoch_{}.pth'.format(epoch))

    # 记录损失值
    loss_results = pd.DataFrame({'train_loss': pd.Series(train_loss), 'valid_loss': pd.Series(valid_loss),
                                 'train_epochs_loss': pd.Series(train_epochs_loss),
                                 'valid_epochs_loss': pd.Series(valid_epochs_loss)})
    loss_results.to_excel(dir+'/loss_result_{}.xlsx'.format(epoch))

    end = time.time()
    print("using time is :{}".format(end-start))

    plt.figure(figsize=(12, 4))
    plt.subplot(121)
    plt.plot(train_loss[:])
    plt.title("train_loss")
    plt.subplot(122)
    plt.plot(train_epochs_loss[1:], '-o', label="train_loss")
    plt.plot(valid_epochs_loss[1:], '-o', label="valid_loss")
    plt.title("epochs_loss")
    plt.legend()
    plt.show()


def predict(url, model, weight_file, CT, NT_1, NT_2, NT_3):

    model.load_state_dict(torch.load(weight_file), strict=True)
    x = np.array([url for _ in range(args.batch_size)])
    x0 = CT.transform(x).to(device)
    x1 = NT_1.transform(x).to(device)
    x2 = NT_2.transform(x).to(device)
    x3 = NT_3.transform(x).to(device)
    model.eval()
    outputs = model(x0, x1, x2, x3)
    y = np.argmax(outputs[0].tolist())
    #
    # process_time()
    # for i in range(10000):
    #     x = np.array([url for _ in range(args.batch_size)])
    #     x0 = CT.transform(x).to(device)
    #     x1 = NT_1.transform(x).to(device)
    #     x2 = NT_2.transform(x).to(device)
    #     x3 = NT_3.transform(x).to(device)
    #     model.eval()
    #     outputs = model(x0, x1, x2, x3)
    #     y = np.argmax(outputs[0].tolist())
    # print("运行时间是: {:9.9}s".format(process_time()))

    # print("{} belong to class_{}".format(url, y))
    return y





if __name__ == '__main__':
    # global dir
    # dir = create_dir()
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

    # 封装成DataLoader
    dataset_train = URLDataset(train_x0, train_x1, train_x2, train_x3, train_labels)
    dataset_val = URLDataset(val_x0, val_x1, val_x2, val_x3, val_labels)
    train_loader = DataLoader(dataset_train, args.batch_size, shuffle=True, num_workers=args.num_workers, pin_memory=True)
    val_loader = DataLoader(dataset_val, args.batch_size, shuffle=True, num_workers=args.num_workers, pin_memory=True)

    # 定义网络
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    model = Model(vocab_size_0, vocab_size_1, vocab_size_2, vocab_size_3,
                  args.char_embed_dim,
                  args.embed_dim,
                  args.max_seq_len,
                  args.rnn_cell_size,
                  args.attn_width).to(device)

    # 查看网络结构
    # input_data = torch.ones(args.batch_size, args.max_seq_len).long()   # [128,128]
    # summary(model, input_data, input_data, input_data, input_data)
    # # 查看网络参数
    # pytorch_total_params = sum(p.numel() for p in model.parameters())
    # print(pytorch_total_params)

    # # 训练
    # loss_fn = torch.nn.CrossEntropyLoss()
    # # optimizer = torch.optim.Adam(model.parameters(), lr=args.learning_rate)
    # # optimizer = torch.optim.SGD(model.parameters(), lr=args.learning_rate, momentum=0.8)
    # optimizer = torch.optim.AdamW(model.parameters(), lr=args.learning_rate, weight_decay=1e-2)
    #
    # scheduler = torch.optim.lr_scheduler.CosineAnnealingWarmRestarts(optimizer, T_0=5)  # 余弦递减
    # train(args, model, train_loader, val_loader, device, loss_fn, optimizer, scheduler)

    # # 预测
    # weight_file = dir+'/Outputs/weight_best.pth'
    # url = "www.google.com"
    # predict(url, model, weight_file, CT, NT_1, NT_2, NT_3)

    # 计算预测时间
    weight_file = 'weight_best.pth'
    url = "www.google.com"
    y = D


    # # 批量预测
    # def GetUrls(file_path, max_seq_len):
    #     df = pd.read_csv(file_path, names=['url', 'pred_class'], header=None)
    #     # df['pred_class'] = df['pred_class'].astype('int64')
    #     urls = df.iloc[:, 0]
    #     urls = urls.str[:max_seq_len - 2]
    #     urls = urls.to_numpy()
    #     return urls
    #
    # weight_file = 'weight_best.pth'
    # model.load_state_dict(torch.load(weight_file), strict=True)
    # model.eval()
    # test_urls = GetUrls('data0325/test(unlabeled).csv', args.max_seq_len)
    # test_x0 = CT.transform(test_urls)
    # test_x1 = NT_1.transform(test_urls)
    # test_x2 = NT_2.transform(test_urls)
    # test_x3 = NT_3.transform(test_urls)
    #
    # i = 0
    # y_all = []
    # while i <= len(test_urls):
    #     x0 = test_x0[i:i+32].to(device)
    #     x1 = test_x1[i:i+32].to(device)
    #     x2 = test_x2[i:i+32].to(device)
    #     x3 = test_x3[i:i+32].to(device)
    #     outputs = model(x0, x1, x2, x3)
    #     y = np.argmax(outputs.tolist(), axis=1)
    #     y_all.extend(y)
    #     i += 32
    # y_df = pd.DataFrame(columns='label', data=y_all)
    # y_df.to_csv("data0325/test(labeled).csv")

