import numpy as np
import pandas as pd
import torch
from nltk import ngrams
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.feature_selection import SelectKBest, chi2
from torch.utils.data import Dataset


def GetUrlsAndLabels(file_path, max_seq_len):
    """
    :param file_path: 文件路径
    :return: 获取文件中的网址和标签
    """
    df = pd.read_csv(file_path, names=['label', 'url'])
    df['label'] = df['label'].astype('int64')
    urls = df.iloc[:, 1]
    urls = urls.str[:max_seq_len-2]
    labels = df.iloc[:, 0]
    labels = labels.to_numpy()
    urls = urls.to_numpy()
    return urls, labels


class URLDataset(Dataset):
    def __init__(self, seqs1, seqs2, seqs3, seqs4, labels):
        self.seqs1 = seqs1    # (N, 128)
        self.seqs2 = seqs2    # (N, 128)
        self.seqs3 = seqs3    # (N, 128)
        self.seqs4 = seqs4    # (N, 128)
        self.labels = labels    # (N,)
        self.len = len(self.labels)

    def __len__(self):
        return self.len

    def __getitem__(self, item):
        data = [self.seqs1[item], self.seqs2[item], self.seqs3[item], self.seqs4[item]]
        label = self.labels[item]
        return data, label


class CharTransformer:
    def __init__(self, max_seq_len):
        self.max_seq_len = max_seq_len
        self.alphabet = "abcdefghijklmnopqrstuvwxyz" \
                        "ABCDEFGHIJKLMNOPQRSTUVWXYZ " \
                        "0123456789" \
                        ",;.!?:'\"/\\|_@#$%^&*~`+-=<>()[]{}"
        self.vocab = ['<pad>'] + list(self.alphabet) + ['<SOS>', '<EOS>']

    def transform(self, urls):
        # url向量化
        vectorized_urls = [[self.vocab.index(tok) for tok in url] for url in urls]
        # 所有url的长度
        url_lengths = list(map(len, vectorized_urls))
        # 生成空的url_tans
        url_tans = np.zeros((len(vectorized_urls), self.max_seq_len))
        for idx, (url_chars, url_len) in enumerate(zip(vectorized_urls, url_lengths)):
            url_tans[idx, 0] = len(self.vocab) - 2  # adding the char '<SOS>'
            url_tans[idx, 1:url_len + 1] = torch.LongTensor(url_chars)
            url_tans[idx, url_len + 1] = len(self.vocab) - 1  # adding the char '<EOS>'

        return torch.from_numpy(url_tans).long()

    def get_vocab_size(self):
        return len(self.vocab)


class NGramTransformer:
    def __init__(self, max_seq_len, ngram_value, urls, labels):
        self.max_seq_len = max_seq_len
        self.ngram_value = ngram_value
        self.vocab = {}
        self.__get_vocab(urls, labels)

    def __get_vocab(self, urls, labels):
        vectorizer = TfidfVectorizer(ngram_range=(self.ngram_value, self.ngram_value),
                                     max_features=160000, sublinear_tf=True, analyzer='char', lowercase=False)
        tv_urls = vectorizer.fit_transform(urls)
        vector_count = tv_urls.shape[1]
        selector = SelectKBest(chi2, k='all')
        skb_urls = selector.fit_transform(tv_urls, labels)
        mask = selector.get_support()
        idf_dict = dict(zip(vectorizer.get_feature_names_out(), vectorizer.idf_))
        selected_features = []
        selected_feature_scores = []
        for bool, feature, score in zip(mask, vectorizer.get_feature_names_out(), selector.scores_):
            if bool:
                selected_features.append(feature)
                selected_feature_scores.append(score)
        selected_feature_scores, selected_features = zip(*sorted(zip(selected_feature_scores, selected_features)))
        # 生成词典
        for i, char in enumerate(selected_features):
            self.vocab[char] = i + 1

    def transform(self, urls):
        self.vocab['<pad>'] = 0
        self.vocab['<SOS>'] = len(self.vocab)
        self.vocab['<EOS>'] = len(self.vocab)
        self.vocab['<unk>'] = len(self.vocab)
        vectorized_urls = []
        missing_ngram_index = len(self.vocab) - 1
        for url in urls:
            vectorized_url = []
            ngram_list = ngrams(url, self.ngram_value)
            ngram_list = [''.join(ngram_tuple) for ngram_tuple in ngram_list]
            vectorized_url = [self.vocab.get(k, missing_ngram_index) for k in ngram_list]
            # 为防止有的url长度小于ngram_value导致vectorized_url列表为空，需要自行添加一个0值
            if len(vectorized_url) == 0:
                vectorized_url.append(0)
            if vectorized_url is None or len(vectorized_url) == 0:
                print("Something went wrong...")
            if max(vectorized_url) > missing_ngram_index:
                print("Something went wrong... n = ", self.ngram_value)
            vectorized_urls.append(vectorized_url)

        # 所有url的长度
        url_lengths = list(map(len, vectorized_urls))
        # 生成空的url_tans
        url_tans = np.zeros((len(vectorized_urls), self.max_seq_len))
        for idx, (url_chars, url_len) in enumerate(zip(vectorized_urls, url_lengths)):
            url_tans[idx, 0] = len(self.vocab) - 2  # adding the char '<SOS>'
            url_tans[idx, 1:url_len + 1] = torch.LongTensor(url_chars)
            url_tans[idx, url_len + 1] = len(self.vocab) - 1  # adding the char '<EOS>'

        return torch.from_numpy(url_tans).long()

    def get_vocab_size(self):
        return len(self.vocab)
