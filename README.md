# discuss2.0
discuss2.0 is forked from adhocracy+. We extended the platform with two additional AI-supported debate modules:

1. **Comment Recommendation Module**: To encourage user interaction and expose participants to opposing viewpoints, we developed a comment recommendation module based on a stance detection model.
2. **Deliberative Quality Module:** To enhance user engagement and improve the quality of contributed comments, we implemented a debate module that automatically detects and highlights the most deliberative comments.

When 

## BibTeX Citation
If you use the `AQuA 🌊` score in a scientific publication, we would appreciate using the following citations:

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

See information on the installation of adhocracy+ below.

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
