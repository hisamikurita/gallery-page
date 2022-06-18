export default class GlElments {
  constructor(targetElArray) {
    this.targetElArray = targetElArray;
    this.optionList = [];
  }

  init() {
    this._initOptionList();
  }

  _initOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const target = this.targetElArray[i]
      const rect = target.getBoundingClientRect()

      this.optionList[i] = {};
      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;

      const imagePath = target.querySelector('img').src;
      this.optionList[i].img = imagePath;
    }
  }

  _updateOptionList() {
    for (let i = 0; i < this.targetElArray.length; i++) {
      const rect = this.targetElArray[i].getBoundingClientRect()

      this.optionList[i].width = rect.width;
      this.optionList[i].height = rect.height;
      this.optionList[i].top = rect.top;
      this.optionList[i].left = rect.left;
    }
  }
}
