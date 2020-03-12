const translate = {
  fr_FR: require('./fr_FR'),
  fr_BE: require('./fr_FR'),
  en_US: require('./en_US'),
};

class Translation {
  constructor(language) {
    this.language = language;
    this.messages = translate[language];
  }

  static availableLanguage() {
    return Object.keys(translate);
  }

  get(id) {
    return this.messages[id];
  }
}

module.exports = Translation;
