import torch
import torch.nn as nn


class Attention(nn.Module):
    def __init__(self, units, hidden_size):
        super(Attention, self).__init__()
        self.units = units
        self.W1 = nn.Linear(hidden_size*2, self.units)
        self.W2 = nn.Linear(hidden_size*2, self.units)
        self.V = nn.Linear(self.units, 1)

    def forward(self, features, hidden):
        # score shape == (batch_size, max_length, 1)
        # we get 1 at the last axis because we are applying score to self.V
        # the shape of the tensor before applying self.V is (batch_size, max_length, units)
        score = torch.tanh(self.W1(features) + self.W2(hidden))
        # attention_weights shape == (batch_size, max_length, 1)
        attention_weights = torch.softmax(self.V(score), dim=1)

        # context_vector shape after sum == (batch_size, hidden_size)
        context_vector = attention_weights * features
        context_vector = torch.sum(context_vector, dim=1)
        return context_vector, attention_weights


class NBeddingModel(nn.Module):
    def __init__(self, vocab_size, embedding_dim, max_seq_len, rnn_cell_size=256, attention_width=10):
        super(NBeddingModel, self).__init__()
        self.hidden_size = rnn_cell_size
        self.embedding = nn.Embedding(vocab_size, embedding_dim, padding_idx=0)

        self.conv1d_1 = nn.Conv1d(in_channels=embedding_dim, out_channels=64, kernel_size=9, stride=1)
        self.amp = nn.AdaptiveMaxPool1d(output_size=1)
        self.conv1d_2 = nn.Conv1d(in_channels=1, out_channels=128, kernel_size=9, stride=1)
        self.relu = nn.ReLU()
        self.bn1d = nn.BatchNorm1d(max_seq_len-8-8)
        # 需要实现SpatialDropout
        self.sd1d = nn.Dropout2d(p=0.2)
        self.lstm = nn.LSTM(input_size=max_seq_len-8-8, hidden_size=self.hidden_size, bidirectional=True, batch_first=True)
        self.attention = Attention(attention_width, self.hidden_size)

    def forward(self, input):
        x = input   # [None, 128]
        x = self.embedding(x)   # [None, 128, 95] / [None, 128, 15]
        x = x.permute(0, 2, 1)  # [None, 95, 128]
        x = self.conv1d_1(x)    # [None, 64, 120]
        x = self.relu(x)
        x = x.permute(0, 2, 1)  # [None, 120, 64]
        x = self.amp(x)         # [None, 120, 1]
        x = x.permute(0, 2, 1)  # [None, 1, 120]
        x = self.conv1d_2(x)    # [None, 128, 112]
        x = self.relu(x)
        x = x.permute(0, 2, 1)  # [None, 112, 128]
        x = self.bn1d(x)        # [None, 112, 128]
        x = self.sd1d(x)        # [None, 112, 128]
        x = x.permute(0, 2, 1)
        lstm, (h_n, c_n) = self.lstm(x)
        # output: [None, 128, 512], ([2, None, 256], [2, None, 256])
        h_n = h_n.view(-1, 1, 2*self.hidden_size)
        # h_n = torch.cat([h_n[i, :, :] for i in range(h_n.shape[0])], dim=-1)
        # output: [None, 1, 512]
        context_vector, attention_weights = self.attention(lstm, h_n)
        # output: [None, 512], [None, 112, 1]
        return context_vector
