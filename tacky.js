(function(){
  'use strict'

  function Tacky(el, opts) {
    this.opts = Object.assign({}, {
      tackedClass: 'tacked',
      wrapperTag: 'div',
      wrapperClass: 'tacky-wrapper',
      handler: function(offsetY, tacked) {
        return offsetY <= 0;
      }
    }, opts);
    
    this.element = el;
    this.wrapperEl = document.createElement(this.opts.wrapperTag);
    this.wrapperEl.classList.add(this.opts.wrapperClass);
    this.tacked = false;
    this._boundingRect = null;
    
    this.element.parentNode.appendChild(this.wrapperEl);
    this.element.remove();
    this.wrapperEl.appendChild(this.element);

    window.addEventListener('scroll', this.toggleTacked.bind(this));    

    return this;
  }

  Tacky.prototype.destroy = function() {
    window.removeEventListener('scroll', this.toggleTacked.bind(this));    
  }

  Tacky.prototype.toggleTacked = function() {
    window.requestAnimationFrame(() => {
      this._boundingRect = this.wrapperEl.getBoundingClientRect();
      if (this.tacked) {
        !this.opts.handler(this._boundingRect.top, this.tacked) && this.untack();
      } else {
        this.opts.handler(this._boundingRect.top, this.tacked) && this.tack();
      }
    });
  }

  Tacky.prototype.tack = function() {
    this.wrapperEl.style.height = this._boundingRect.height + 'px';
    this.element.remove();
    document.body.appendChild(this.element);
    this.element.classList.add(this.opts.tackedClass);
    this.tacked = true;
  }

  Tacky.prototype.untack = function() {
    this.element.remove();
    this.element.classList.remove(this.opts.tackedClass);
    this.wrapperEl.appendChild(this.element);
    this.wrapperEl.style.height = null;
    this.tacked = false;
  }

  window.Tacky = Tacky;
}())