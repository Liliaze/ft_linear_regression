let table;
let img;
let circlesArray;
const graphOriginX = 100;
const graphOriginY = innerHeight - 100;
const graphCoefX = 200;
const graphCoefY = 25;
const maxX = innerWidth - 150;
const maxY = 115;

function setup() {
  //add input load file
  input = createFileInput(handleFile);
  input.position(innerWidth / 2 - 100, 95);

  
  createCanvas(innerWidth, innerHeight);
  background(150);
  //add button load file
  /*
  button = createButton('load');
  button.position(19, 19);
  button.mousePressed(loadFile);
  */
}

/*
function loadFile(file) {
  
}
*/

function handleFile(file) {
    img = null;
  table = null;
  print(file);  
  if (file.type === 'image') {
    img = createImg(file.data);
    img.hide();
  } else if (file.type === 'application' && file.subtype === 'vnd.ms-excel') {
    console.log('fseqgsqfgfqgqfdg');
    table = loadTable(file.data, loadTableOn, 'csv', 'header');
  }
}

function loadTableOn() {
  circlesArray = [];
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print(table.getColumn('km'));
  print(table.getColumn('price'));

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++){
    circlesArray.push([table.getString(r, 'km'),table.getString(r, 'price')])
      //print("km : " + table.getString(r, 'km'));
      //print("price : " + table.getString(r, 'price'));
  }
}

function draw() {
  background(255);
  stroke('black');
  fill('blue');
  textSize(30);
  text('FT_LINEAR_REGRESSION', innerWidth / 2 - 8*28, 30);
  text('BY DBOUDY', innerWidth / 2 - 4*28, 70);
  fill('black');
  line(graphOriginX, graphOriginY, maxX, graphOriginY);
  line(graphOriginX,graphOriginY, graphOriginX, maxY);
  if (img) {
    image(img, graphOriginX, maxY, innerWidth - 200 , innerHeight - 200);
  }
  else if (table) {
    fill('red');
    stroke('red');
    for (let circleIndex in circlesArray) {
      circle(circlesArray[circleIndex][0]/graphCoefX + graphOriginX, (-(circlesArray[circleIndex][1]/graphCoefY) + graphOriginY), 5);
    }
  }
}