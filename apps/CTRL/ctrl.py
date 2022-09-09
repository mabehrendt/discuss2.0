from transformers import CTRLTokenizer, CTRLLMHeadModel, OPTForCausalLM, OPTConfig, GPT2Tokenizer, pipeline
import torch

class CTRL:
    def __init__(self, model="ctrl", translator="facebook/wmt19", translate=False):
        """
        model: load pretrained model
        translator: choose translator, default: facebook/wmt19
        """
        #self.tokenizer = CTRLTokenizer.from_pretrained(model)
        #self.model = CTRLLMHeadModel.from_pretrained(model)
        self.tokenizer = GPT2Tokenizer.from_pretrained("facebook/opt-125m")
        self.model = OPTForCausalLM.from_pretrained("facebook/opt-125m")
        self.translate=translate
        if self.translate:
            self.translate_en_de = pipeline('translation', model=translator+"-en-de")
            self.translate_de_en = pipeline('translation', model=translator+"-de-en")

    def predict(self, prompt, max_length=60):
        """
        prompt: input that begins with @bot: 
        Returns: generated text by the model
        """
        # assuming that the input begins with @bot: 
        if self.translate:    
            prompt = translate_de_en(prompt[6:])
        tokenized = self.tokenizer(prompt, return_tensors='pt')
        generate_ids = self.model.generate(tokenized.input_ids, max_length=max_length)
        ids = generate_ids[:,len(tokenized.input_ids[0]):]
        out = self.tokenizer.batch_decode(ids, skip_special_tokens=True, clean_up_tokenization_spaces=True)[0]
        if self.translate:
            translated_output = translation_en_de(out)[0]["translation_text"]
            return translated_output
        else:
            return out

