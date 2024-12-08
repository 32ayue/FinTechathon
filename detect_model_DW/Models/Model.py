from Models.Embeddings import *

class Model(nn.Module):
    def __init__(self, vocab_size_0, vocab_size_1, vocab_size_2, vocab_size_3,
                 CHAR_EMBEDDING_DIM, embed_dim, max_seq_len, rnn_cell_size, attn_width):
        super(Model, self).__init__()
        self.char_embedding = NBeddingModel(vocab_size_0, CHAR_EMBEDDING_DIM, max_seq_len, rnn_cell_size, attn_width)
        self.ngram_embedding1 = NBeddingModel(vocab_size_1, embed_dim, max_seq_len, rnn_cell_size, attn_width)
        self.ngram_embedding2 = NBeddingModel(vocab_size_2, embed_dim, max_seq_len, rnn_cell_size, attn_width)
        self.ngram_embedding3 = NBeddingModel(vocab_size_3, embed_dim, max_seq_len, rnn_cell_size, attn_width)
        self.dense = nn.Linear(rnn_cell_size*8, rnn_cell_size*2)
        self.relu = nn.ReLU()
        self.dropout = nn.Dropout(0.2)
        self.output = nn.Linear(rnn_cell_size*2, 13)

    def forward(self, input_0, input_1, input_2, input_3):
        x0 = self.char_embedding(input_0)         # [None, 512]
        x1 = self.ngram_embedding1(input_1)       # [None, 512]
        x2 = self.ngram_embedding2(input_2)       # [None, 512]
        x3 = self.ngram_embedding3(input_3)       # [None, 512]
        x = torch.cat([x0, x1, x2, x3], dim=1)    # [None, 2048]
        x = self.dense(x)
        x = self.relu(x)
        x = self.dropout(x)
        x = self.output(x)

        return x