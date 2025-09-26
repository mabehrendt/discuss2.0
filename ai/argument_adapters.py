from transformers import AutoTokenizer, AutoConfig, AutoAdapterModel
import numpy as np
import torch.nn.functional as F
import torch
from .utils import get_dynamic_parallel

# load model checkpoint and tokenizer
adapters_path = './model/quality_adapters/'
threshold = 2.56

task2identifier = {"anrede": adapters_path+"anrede",
                   "begründung": adapters_path+"begründung",
                   "beleidigung": adapters_path+"beleidigung",
                   "bezugform": adapters_path+"bezugform",
                   "bezuginhalt": adapters_path+"bezuginhalt",
                   "bezugmedium": adapters_path+"bezugmedium",
                   "bezugnutzer": adapters_path+"bezugnutzer",
                   "bezugpersönlich": adapters_path+"bezugpersönlich",
                   "diskriminierung": adapters_path+"diskriminierung",
                   "frage": adapters_path+"frage",
                   "lösungsvorschlag": adapters_path+"lösungsvorschlag",
                   "meinung": adapters_path+"meinung",
                   "respekt": adapters_path+"respekt",
                   "sarkasmus": adapters_path+"sarkasmus",
                   "schreien": adapters_path+"schreien",
                   "storytelling": adapters_path+"storytelling",
                   "tatsache": adapters_path+"tatsache",
                   "themenbezug": adapters_path+"themenbezug",
                   "vulgär": adapters_path+"vulgär",
                   "zusatzwissen": adapters_path+"zusatzwissen"}

# maybe only keep: begründung, lösungsvorschlag, meinung, sarkasmus, tatsache, themenbezug, zusatzwissen
#weights = np.array([0.01482095,  0.29000763, -0.05884586, -0.02674237,
#       -0.02847408,  0.07019062, -0.03768367, 0.21126469, 0.02934227,
#       -0.07331445,  0.39535126, -0.11069402,  0.00732909, -0.15170863,
#       -0.01900971, 0.10628146,  0.18285757,  0.20908452, -0.04995486,
#        0.14655912])

# maybe only keep: begründung, lösungsvorschlag, meinung, sarkasmus, tatsache, themenbezug, zusatzwissen
weights = np.array([0.01482095,  0.29000763, -1, -0.02674237,
       -0.02847408,  0.07019062, -0.03768367, 0.21126469, 0.02934227,
       -0.07331445,  0.39535126, -0.11069402,  0.00732909, -0.15170863,
       -0.01900971, 0.10628146,  0.18285757,  0.20908452, -1,
        0.14655912])

max_score = np.empty(20)
max_score.fill(3)
pos = weights > 0
neg = weights <= 0

maxval = weights[pos].dot(max_score[pos])
minval = weights[neg].dot(max_score[neg])
minmaxdif = maxval-minval

class QualityPredictor():
    def __init__(self):
        super().__init__()
        self.model = AutoAdapterModel.from_pretrained("bert-base-multilingual-cased")
        self.tokenizer = AutoTokenizer.from_pretrained("bert-base-multilingual-cased")

    def load_adapters(self):
        adapter_counter = 0
        # load all adapters into the model
        for k, v in task2identifier.items():
            print("loading adapter %s as adapter %d" % (k, adapter_counter))

            self.model.load_adapter(v, load_as="adapter%d" % adapter_counter, with_head=True,
                           set_active=True, source="hf")
            adapter_counter += 1

        print("loaded %d adapters" % adapter_counter)
        adapter_setup = get_dynamic_parallel(adapter_number=adapter_counter)
        self.model.active_adapters = adapter_setup

    def normalize_score(self, score, bound=5):
        """
        Returns the normalized scores in an interval between 0 and bound.

        Arguments:
        scores  – scores to normalize
        bound   – upper interval bound
        """
        return ((score-minval)/minmaxdif)*bound

    def predict(self,comment):
        encoding = self.tokenizer(comment, return_tensors="pt")
        with torch.no_grad():
            *outputs ,= self.model(**encoding)
            labels = []
            for i in range(len(outputs)):
                logits = outputs[i].logits
                labels.append(np.argmax(logits[0]).item())
            prediction = np.dot(np.array(labels), weights)
            prediction = self.normalize_score(prediction)
            if prediction >= threshold:
                quality = "high"
            else:
                quality = "low"
            return str(labels), prediction, quality
