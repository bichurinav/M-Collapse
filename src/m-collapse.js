class MCollapse {
  constructor(name, options = {}) {
    this.name = name;
    if (!this.name) throw new Error("Добавьте элементу p-collase=ИМЯ");
    // default options
    this.options = Object.assign(
      {
        accordion: false,
        containerClick: false,
        bodyClick: false,
        visibleAll: false,
        animateDurationOpen: 200,
        animateDurationClose: 200,
        animateDurationArrow: 200,
      },
      options
    );
    this.$main = document.querySelector(`[m-collapse='${this.name}']`);
    this.$containers = this.$main.querySelectorAll("[m-collapse-container]");
    this.items = [];
  }

  init() {
    this.$containers.forEach((item, idx) => {
      const el = new MCollapseItem(item, idx, this.name, this.options);
      this.items.push(el);
    });
    return this;
  }

  destroy() {
    this.items.forEach((item) => {
      item.$header.removeEventListener("click", item.headerClick);
      item.$container.removeEventListener("click", item.containerClick);
      item.$body.removeEventListener("click", item.bodyClick);
    });
  }

  get _animateDurationOpen() {
    return this.options.animateDurationOpen / 1000;
  }

  get _animateDurationClose() {
    return this.options.animateDurationClose / 1000;
  }

  get _animateDurationArrow() {
    return this.options.animateDurationArrow / 1000;
  }
}

class MCollapseItem extends MCollapse {
  constructor(item, idx, name, options) {
    super(name, options);
    this.$container = item;
    this.$header = this.$container.querySelector("[m-collapse-header]");
    this.idx = idx;
    this.$body = this.$container.querySelector("[m-collapse-body]");
    this.$arrow = this.$container.querySelector("[m-collapse-arrow]");
    this.options = options;
    this.bodyHeight = this.$body.clientHeight;
    this.timeout = null;
    this.headerClick = null;
    this.bodyClick = null;
    this.containerClick = null;
    this._init();
  }

  _init() {
    this._initCursor();
    this._toggleHandle();

    if (this._isVisibleBody) {
      this.$body.style.display = "block";
      this._animateArrow(this.$arrow, "up");
    } else {
      this.$body.style.display = "none";
      this._animateArrow(this.$arrow, "down");
    }

    if (this.options.visibleAll) {
      this.$body.style.display = "block";
      this.$body.setAttribute("m-collapse-body", "visible");
      return;
    }
  }

  _toggleHandle() {
    if (this.timeout) {
      return;
    }

    const toggleAction = () => {
      if (this.options.accordion) {
        if (this._isVisibleBody) {
          this._setHideStyles(this.$body, this.$arrow);
          return;
        }
        this._hideAllBody().then(() => {
          this._setStyles();
        });
      } else {
        this._setStyles();
      }
    };

    this.headerClick = (e) => {
      e.stopPropagation();
      toggleAction();
    };

    this.containerClick = () => {
      toggleAction();
    };

    this.bodyClick = (e) => {
      e.stopPropagation();
      this._setHideStyles(this.$body, this.$arrow);
    };

    this.$header.addEventListener("click", this.headerClick);

    if (this.options.containerClick) {
      this.$container.addEventListener("click", this.containerClick);
    }
    if (this.options.bodyClick) {
      this.$body.addEventListener("click", this.bodyClick);
    }
  }

  _animateArrow($arrow, direction) {
    if (!$arrow) return;
    switch (direction) {
      case "up":
        $arrow.style.transition = `transform ${
          super._animateDurationArrow
        }s ease`;
        this.$arrow.style.transform = "rotate(180deg)";
        break;
      case "down":
        $arrow.style.transition = `transform ${
          super._animateDurationArrow
        }s ease`;
        $arrow.style.transform = "rotate(0deg)";
        break;
    }
  }

  _initCursor() {
    if (!this.options.bodyClick && !this.options.containerClick) {
      this.$header.style.cursor = "pointer";
      return;
    }
    if (this.options.bodyClick && !this.options.containerClick) {
      this.$header.style.cursor = "pointer";
      this.$body.style.cursor = "pointer";
      return;
    }
    if (this.options.containerClick) {
      this.$container.style.cursor = "pointer";
      return;
    }
  }

  get _isVisibleBody() {
    return this.$body.getAttribute("m-collapse-body") === "visible";
  }

  async _hideAllBody() {
    for await (let item of this.$containers) {
      const $body = item.querySelector("[m-collapse-body]");
      const $arrow = item.querySelector("[m-collapse-arrow]");
      await this._setHideStyles($body, $arrow);
    }
    return;
  }

  async _setStyles() {
    if (!this._isVisibleBody) {
      return await this._setOpenStyles();
    }
    return await this._setHideStyles(this.$body, this.$arrow);
  }

  async _setHideStyles($body, $arrow) {
    return new Promise((res, _) => {
      this._animateArrow($arrow, "down");
      $body.style.transition = `height ${
        super._animateDurationClose
      }s ease, opacity ${super._animateDurationClose + 0.1}s ease`;
      $body.style.height = "0";
      $body.style.opacity = "0";
      $body.style.overflow = "hidden";
      this.timeout = setTimeout(() => {
        $body.style.display = "none";
        $body.setAttribute("m-collapse-body", "");
        this.timeout = null;
        res("hidden");
      }, this.options.animateDurationClose - 50);
    });
  }

  async _setOpenStyles() {
    return new Promise((res, _) => {
      this._animateArrow(this.$arrow, "up");
      this.$body.style.transition = `height ${
        super._animateDurationOpen
      }s ease-in, opacity ${super._animateDurationOpen + 0.1}s ease`;
      this.$body.style.height = "0";
      this.$body.style.opacity = "0";
      this.$body.style.overflow = "hidden";
      this.$body.style.display = "block";
      this.timeout = setTimeout(() => {
        this.$body.style.height = this.bodyHeight + "px";
        this.$body.style.opacity = "1";
        this.$body.setAttribute("m-collapse-body", "visible");
        this.timeout = null;
        res("opened");
      }, 50);
    });
  }
}

new MCollapse("collapse").init();
