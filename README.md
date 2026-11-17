<!-- GitHub profile README for @mhilmisyarif (lives in mhilmisyarif/mhilmisyarif) -->

<p align="center">
  <img src="assets/hero.svg" width="100%" alt="Muhammad Hilmi Syarif, AI/ML Engineer focused on Natural Language Processing. An animated terminal shows a fine-tuned GPT-2 model turning ingredients into an Indonesian recipe." />
</p>

<p align="center">
  <a href="https://mhilmisyarif.github.io/portfolio/"><img src="https://img.shields.io/badge/Portfolio-mhilmisyarif.github.io-22D3EE?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=0F172A" alt="Portfolio website" /></a>
  <a href="mailto:hilmisyarif.dev@gmail.com"><img src="https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white" alt="Email" /></a>
  <a href="https://www.linkedin.com/in/hilmisyarif/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" /></a>
  <a href="https://github.com/mhilmisyarif?tab=followers"><img src="https://img.shields.io/github/followers/mhilmisyarif?label=Follow&style=for-the-badge&logo=github&color=181717&logoColor=white" alt="GitHub followers" /></a>
  <img src="https://komarev.com/ghpvc/?username=mhilmisyarif&style=for-the-badge&color=0e75b6&label=Profile+Views" alt="Profile views" />
</p>

## 👋 About me

I'm an AI/ML engineer with a Computer Science degree and a soft spot for **language**. My main subject is **Natural Language Processing**: my final research fine-tuned GPT-2 to write Indonesian cooking recipes, and I have been working on text models ever since.

A model is only useful once someone can call it, so I also build the API, the app and the release pipeline around it.

<table>
  <tr>
    <td width="33%" valign="top">
      <h4>🧠 Focus</h4>
      Generative language models and transfer learning for low-resource Indonesian text
    </td>
    <td width="33%" valign="top">
      <h4>📈 Background</h4>
      Data scientist work on sales forecasting and ML models served as REST APIs
    </td>
    <td width="33%" valign="top">
      <h4>🌱 Now learning</h4>
      The Natural Language Processing Specialization, currently on probabilistic models
    </td>
  </tr>
</table>

## 🧠 NLP & Machine Learning

### ⭐ Indonesian recipe generation with GPT-2

My thesis project, and still the one I'm proudest of. Give it a list of ingredients and it writes a complete Indonesian recipe, the way the banner above shows.

```mermaid
flowchart LR
    A[Scrape recipe sites<br/>+ public datasets] --> B[Clean and merge<br/>all fields]
    B --> C[BPE encoding<br/>with control tokens]
    C --> D[Fine-tune GPT-2 small<br/>transfer learning]
    D --> E[Conditional generation<br/>ingredients to recipe]
    E --> F[Evaluate<br/>perplexity]
```

<details>
<summary><b>How each stage works</b></summary>
<br />

| Stage | What I did |
|---|---|
| Data | Scraped Indonesian recipe sites and merged them with public datasets into one corpus |
| Preparation | Cleaned every field, then encoded recipes with special tokens that mark where a recipe, its ingredients and its steps begin |
| Training | Fine-tuned GPT-2 small (12 layers, 768 hidden units) first in TensorFlow, later rebuilt on PyTorch and Hugging Face Transformers |
| Inference | Conditional generation from a prompt of ingredients, scored with perplexity |

</details>

### More ML work

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>✍️ <a href="https://github.com/mhilmisyarif/handwrittend-digit-app">Handwritten digit generator</a></h4>
      A conditional GAN trained on MNIST that draws any digit you pick, served as a Streamlit app.
      <br /><br />
      <code>TensorFlow</code> <code>Keras</code> <code>Streamlit</code>
    </td>
    <td width="50%" valign="top">
      <h4>📰 News topic classification</h4>
      A bidirectional LSTM that sorts Indonesian news articles into topics.
      <br /><br />
      <code>TensorFlow</code> <code>NLTK</code>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>♻️ <a href="https://github.com/mhilmisyarif/trash-classification">Trash classification</a></h4>
      Image classification for waste sorting.
      <br /><br />
      <code>Deep learning</code> <code>Jupyter</code>
    </td>
    <td width="50%" valign="top">
      <h4>📈 Forecasting &amp; regression</h4>
      <a href="https://github.com/mhilmisyarif/price-predict">Car price prediction</a>, <a href="https://github.com/mhilmisyarif/stock-predict">stock forecasting</a>, and product trend forecasts with SARIMAX on Google Trends data.
      <br /><br />
      <code>scikit-learn</code> <code>statsmodels</code> <code>pandas</code>
    </td>
  </tr>
</table>

## 🚀 Apps I've built

<table>
  <tr>
    <td width="50%" valign="top">
      <h4>⚓ <a href="https://github.com/mhilmisyarif/harbor">Harbor</a></h4>
      A dock, menu bar and widget panel for Windows, with signed in-app updates.
      <br /><br />
      <code>Tauri 2</code> <code>Rust</code> <code>React</code> <code>TypeScript</code>
    </td>
    <td width="50%" valign="top">
      <h4>🏪 <a href="https://github.com/mhilmisyarif/warunku">Warunku</a> + <a href="https://github.com/mhilmisyarif/warunku_backend">backend</a></h4>
      Store management for a small warung: products, customers and itemized debt tracking.
      <br /><br />
      <code>Flutter</code> <code>BLoC</code> <code>Express</code> <code>MongoDB</code> <code>Docker</code>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>🧪 Lab datasheet system <sub>private</sub></h4>
      Role-based workflow for lab test records, review per clause, and generated PDF and Word reports.
      <br /><br />
      <code>React</code> <code>Express</code> <code>Prisma</code> <code>PostgreSQL</code>
    </td>
    <td width="50%" valign="top">
      <h4>🏃 Half-marathon tracker <sub>private</sub></h4>
      A 52-week training plan with offline sync and Strava import, as a web app and an Android app.
      <br /><br />
      <code>JavaScript</code> <code>Capacitor</code> <code>Vercel</code> <code>Postgres</code>
    </td>
  </tr>
</table>

## 🛠️ Tech stack

**NLP & machine learning**

<p>
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white" alt="PyTorch" />
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=flat-square&logo=tensorflow&logoColor=white" alt="TensorFlow" />
  <img src="https://img.shields.io/badge/Keras-D00000?style=flat-square&logo=keras&logoColor=white" alt="Keras" />
  <img src="https://img.shields.io/badge/Hugging%20Face-FFD21E?style=flat-square&logo=huggingface&logoColor=black" alt="Hugging Face Transformers" />
  <img src="https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white" alt="scikit-learn" />
  <img src="https://img.shields.io/badge/NLTK-154F5B?style=flat-square" alt="NLTK" />
  <img src="https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white" alt="NumPy" />
  <img src="https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white" alt="Jupyter" />
</p>

**Serving & data**

<p>
  <img src="https://img.shields.io/badge/Flask-000000?style=flat-square&logo=flask&logoColor=white" alt="Flask" />
  <img src="https://img.shields.io/badge/Streamlit-FF4B4B?style=flat-square&logo=streamlit&logoColor=white" alt="Streamlit" />
  <img src="https://img.shields.io/badge/Node.js-5FA04E?style=flat-square&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Google%20Cloud-4285F4?style=flat-square&logo=googlecloud&logoColor=white" alt="Google Cloud" />
</p>

**Apps**

<p>
  <img src="https://img.shields.io/badge/Flutter-02569B?style=flat-square&logo=flutter&logoColor=white" alt="Flutter" />
  <img src="https://img.shields.io/badge/Dart-0175C2?style=flat-square&logo=dart&logoColor=white" alt="Dart" />
  <img src="https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tauri-24C8D8?style=flat-square&logo=tauri&logoColor=white" alt="Tauri" />
  <img src="https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
  <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" alt="Git" />
</p>

## 📊 GitHub stats

<p align="center">
  <img src="assets/stats.svg" width="100%" alt="GitHub activity card: contributions, pull requests and current streak over the last 12 months, top languages across public repositories, and a contribution heatmap." />
</p>

## 📫 Let's talk

I'm open to NLP and machine learning roles and collaborations. My full portfolio is at [mhilmisyarif.github.io/portfolio](https://mhilmisyarif.github.io/portfolio/), and the fastest way to reach me is [email](mailto:hilmisyarif.dev@gmail.com) or [LinkedIn](https://www.linkedin.com/in/hilmisyarif/).
