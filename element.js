Element.prototype.setStyle = function(css) {
  _.each(css, _.bind(function(value, key) {
    this.style[key] = value;
  }, this));
}
