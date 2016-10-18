function TestTask(config) {
  this.mainLayer = new Konva.Layer();
  this.contextMenuLayer = new Konva.Layer();
  this.config = config;
  this.init();
}

TestTask.prototype.init = function() {
  this.buildStage();
  this.buildGrid();
  this.buildHeaders();
};

TestTask.prototype.buildStage = function() {
  this.stage = new Konva.Stage({
    container: this.config.stage.id,
    width: this.config.stage.width,
    height: this.config.stage.height
  });
};

TestTask.prototype.buildGrid = function() {
  var self = this;
  var columns = this.config.grid.columns;
  var strokes = this.config.grid.strokes;
  var width = this.config.grid.width;
  var height = this.config.grid.height;
  for (i = 0; i < strokes + 1; i++) {
    var horizontalLine = new Konva.Line({
      points: [0, height * i, width * columns, height * i],
      stroke: '#000000',
      strokeWidth: 1,
    });
    self.mainLayer.add(horizontalLine);
  }
  for (i = 0; i < columns + 1; i++) {
    var veticalLine = new Konva.Line({
      points: [width * i, 0, width * i, height * strokes],
      stroke: '#000000',
      strokeWidth: 1,
    });
    self.mainLayer.add(veticalLine);
  }
  this.stage.add(self.mainLayer);
};

TestTask.prototype.buildHeaders = function(config) {
  var textLayer = new Konva.Layer();
  var self = this;
  for (var i in this.config.headers.elements) {
    var text = new Konva.Text({
      x: this.config.grid.width * i,
      y: 0,
      width: this.config.grid.width,
      height: this.config.grid.height,
      text: this.config.headers.elements[i].value,
      fontSize: this.config.grid.height / 2,
      fill: 'black',
      align: 'center',
      padding: this.config.grid.height / 3.5
    });
    if (this.config.headers.elements[i].drop !== undefined) {
      var colNum = i;
      var header = this.config.headers.elements[i].value;
      var drop = this.config.headers.elements[i].drop;
      text.setAttr('text', header + ' +');
      text.on('mouseover', function() {
        self.buildContextMenu({
          'colNum': colNum,
          'header': header,
          'links': drop
        });
      });
    }
    textLayer.add(text);
  }
  this.stage.add(textLayer);
};

TestTask.prototype.buildContextMenu = function(config) {
  var self = this;
  var hideContextRect = new Konva.Rect({
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  });

  hideContextRect.on('mouseover', function() {
    self.contextMenuLayer.clear();
  });
  this.contextMenuLayer.add(hideContextRect);

  var group = new Konva.Group({
    x: this.config.grid.width * config.colNum,
    y: 0
  });
  var area = new Konva.Rect({
    width: this.config.grid.width,
    height: this.config.grid.height * (config.links.length + 1),
    fill: '#1b9d00',
    stroke: '#ccc',
    strokeWidth: 1
  });
  var header = new Konva.Text({
    width: this.config.grid.width,
    height: this.config.grid.height,
    text: config.header + ' -',
    fontSize: this.config.grid.height / 2,
    fill: 'rgb(255, 255, 255)',
    align: 'center',
    padding: this.config.grid.height / 3.5,
  });
  group.add(area);
  group.add(header);
  for (i = 0; i < config.links.length; i++) {
    var link = new Konva.Text({
      y: this.config.grid.height * (i + 1),
      width: this.config.grid.width,
      height: this.config.grid.height,
      text: config.links[i],
      fontSize: this.config.grid.height / 2.5,
      fill: 'rgb(255, 255, 255)',
      align: 'center',
      padding: this.config.grid.height / 3.5
    });
    link.on('mouseover', function() {
      document.body.style.cursor = 'pointer';
      this.setAttr('fill', 'rgb(201, 201, 201)');
      self.contextMenuLayer.draw();
    });
    link.on('mouseout', function() {
      document.body.style.cursor = 'default';
      this.setAttr('fill', 'rgb(255, 255, 255)');
      self.contextMenuLayer.draw();
    });
    link.on('click', function() {
      alert('какая-то информация');
      self.contextMenuLayer.remove();
    });
    group.add(link);
  }
  this.contextMenuLayer.add(group);
  this.stage.add(this.contextMenuLayer);
};
