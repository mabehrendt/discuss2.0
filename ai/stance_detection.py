import torch
from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
                         )

# load model checkpoint and tokenizer
checkpoint = '/home/stefan/Documents/discuss2.0/ai/model/stance/'
tokenizer = AutoTokenizer.from_pretrained(checkpoint,local_files_only=True)
trained_model = AutoModelForSequenceClassification.from_pretrained(checkpoint,local_files_only=True)

class StancePredictor():
    def __init__(self):
        super().__init__()

    def make_prediction(self, question, comment):
        encoding = tokenizer(question, comment, return_tensors="pt")

        # give the encoded sentence to the model
        with torch.no_grad():
            output = trained_model(**encoding)

        prediction = output.logits.argmax(-1)
        if prediction == 0:
            stance = "Negativ"
        else:
            stance = "Positiv"

        return stance
