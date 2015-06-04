;(function (dime, window, document) {
  'use strict';

  var buildContext = function(canvas, w) {
    canvas.width = canvas.height = w;
    var context = canvas.getContext('2d');
    context.font = 'normal normal normal 32px/' + w + 'px MaterialDesignIcon';
    context.textBaseline = 'middle';
    return context;
  };

  dime.helper.favicon = function(icon, color, bg) {
    if(!window.getComputedStyle || !document.querySelectorAll) return;

    color = color || '#000';

    var body = document.body;
    var container = document.createElement('div');
    container.style.display = 'none';

    var span = document.createElement('span');
    span.className = 'icon icon-' + icon.replace(/^icon-/, '');
    container.appendChild(span);

    var canvas = document.createElement('canvas');
    if(!canvas.toDataURL || !canvas.getContext) return;

    body.appendChild(container);
    var content = window.getComputedStyle(span, ':before').getPropertyValue('content').replace(/['"]/g, '');
    body.removeChild(container);

    var context = buildContext(canvas, 32);
    var iconWidth = context.measureText(content).width;
    
    if(iconWidth > canvas.width) {
      context = buildContext(canvas, iconWidth);
    }

    if(bg) {
      context.rect(0, 0, canvas.width, canvas.height);
      context.fillStyle = bg;
      context.fill();
    }
    context.fillStyle = color;
    context.fillText(content, (canvas.width - iconWidth) / 2, canvas.height / 2);
    
    var link = document.createElement('link');
    link.setAttribute('rel', 'icon');
    link.setAttribute('type', 'image/png');
    link.setAttribute('href', canvas.toDataURL('image/png'));
    for(var icons = document.querySelectorAll('link[rel*=icon]'), i = 0, l = icons.length; i < l; i++) {
      icons[i].parentNode.removeChild(icons[i]);
    }
    document.getElementsByTagName('head')[0].appendChild(link);
  };

})(dime, window, document);
