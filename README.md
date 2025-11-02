# discuss2.0
discuss2.0 is forked from adhocracy+. We expanded the platform with two additional AI-supported debate modules:

1. **Comment Recommendation Module**: To encourage user interaction and expose participants to opposing viewpoints, we developed a comment recommendation module based on a stance detection model.
2. **Deliberative Quality Module:** To enhance user engagement and improve the quality of contributed comments, we implemented a debate module that automatically detects and highlights the most deliberative comments.

The instructions to install and setup the platform can be found below. Please ensure that you download the AI models separately and place them in the following folders: 

1. [German BERT Base uncased Model](https://huggingface.co/dbmdz/bert-base-german-uncased) fine-tuned on the [X-Stance Dataset](https://huggingface.co/datasets/ZurichNLP/x_stance) (Vamvas & Sennrich, 2020) for the **Comment Recommendation Module**:

      ```ai/model/stance```
   
2. Adapters to calculate the AQuA score (Behrendt et al., 2024) for the **Deliberative Quality Module** (you find them [here](https://github.com/mabehrendt/AQuA/tree/master/trained%20adapters)):

      ```ai/model/quality_adapers```

## BibTeX Citation
The paper describing the expanded platform and a conducted user study has been presented at the 2025 Bridging Human-Computer Interaction and Natural Language Processing Workshop at the EMNLP 2025 in Suzhou, China.
If you use the platform, we would appreciate a citation of the following paper: 

```
@inproceedings{
anonymous2025supporting,
title={Supporting Online Discussions: Integrating {AI} Into the adhocracy+ Participation Platform To Enhance Deliberation},
author={Anonymous},
booktitle={Fourth Workshop on Bridging Human-Computer Interaction and Natural Language Processing},
year={2025},
url={https://openreview.net/forum?id=mGXj8991px}
}
```

## References
X-Stance Dataset:

```
@inproceedings{vamvas2020x,
  title={X-stance: A Multilingual Multi-Target Dataset for Stance Detection},
  author={Vamvas, Jannis and Sennrich, Rico},
  booktitle={5th SwissText \& 16th KONVENS Joint Conference 2020},
  pages={9},
  year={2020},
  organization={CEUR-WS. org}
}
```
AQuA Score:
```
@inproceedings{behrendt-etal-2024-aqua,
    title = "{AQ}u{A} {--} Combining Experts' and Non-Experts' Views To Assess Deliberation Quality in Online Discussions Using {LLM}s",
    author = "Behrendt, Maike  and
      Wagner, Stefan Sylvius  and
      Ziegele, Marc  and
      Wilms, Lena  and
      Stoll, Anke  and
      Heinbach, Dominique  and
      Harmeling, Stefan",
    editor = "Hautli-Janisz, Annette  and
      Lapesa, Gabriella  and
      Anastasiou, Lucas  and
      Gold, Valentin  and
      Liddo, Anna De  and
      Reed, Chris",
    booktitle = "Proceedings of the First Workshop on Language-driven Deliberation Technology (DELITE) @ LREC-COLING 2024",
    month = may,
    year = "2024",
    address = "Torino, Italia",
    publisher = "ELRA and ICCL",
    url = "https://aclanthology.org/2024.delite-1.1/",
    pages = "1--12"
}
```

See information on the installation and setup of adhocracy+ below.

## adhocracy+

[adhocracy.plus](https://adhocracy.plus/) is a free Open-Source participation platform maintained and primarily developed by Liquid Democracy e.V.. It is based on [adhocracy 4](https://github.com/liqd/adhocracy4) and [Django](https://github.com/django/django).

![Build Status](https://github.com/liqd/adhocracy-plus/actions/workflows/django.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/liqd/adhocracy-plus/badge.svg?branch=main)](https://coveralls.io/github/liqd/adhocracy-plus?branch=main)

## Getting started

adhocracy+ is designed to make online participation easy and accessible to everyone. It can be used on our SaaS-platform or installed on your own servers. How to get started on our platform is explained [here](https://adhocracy.plus/info/start/).

## Installation for development

### Requirements:

 * nodejs (+ npm)
 * python 3.x (+ venv + pip)
 * libpq (only if postgres should be used)

### Installation:

    git clone https://github.com/liqd/adhocracy-plus.git
    cd adhocracy-plus
    make install
    make fixtures

### Start virtual environment:
    source venv/bin/activate

### Check if tests work:

    make test

### Start a local server:
    make watch

### Use postgresql database for testing:
run the following command once:
```
make create-postgres
```
to start the testserver with postgresql, run:
```
export DATABASE=postgresql
make start-postgres
make watch
```

Go to http://localhost:8004/ and login with admin@liqd.net | password

## Installation on a production system

You like adhocracy+ and want to run your own version? An installation guide for production systems can be found [here](./docs/installation_prod.md).

## Contributing or maintaining your own fork

If you found an issue, want to contribute, or would like to add your own features to your own version of adhocracy+, check out [contributing](./docs/contributing.md).

## Security
We care about security. So, if you find any issues concerning security, please send us an email at info [at] liqd [dot] net.
