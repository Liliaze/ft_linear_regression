let table;
let img;
let circlesArray;
const maxX = innerWidth - 150;
const maxY = 115;
const graphOriginX = 100;
const graphOriginY = innerHeight - 100;
const ecartY = graphOriginY - maxY;
const ecartX = maxX - graphOriginX;
const linearLineX1 = graphOriginX;
const linearLineY1 = graphOriginY;
let linearLineX2 = maxX;
let linearLineY2 = maxY;
let maxKm = 0;
let maxPrice = 0;
let theta0 = 0;
let theta1 = 0;

function setup() {
  //add input load file
  input = createFileInput(handleFile);
  input.position(innerWidth / 2 - 100, 95);
  createCanvas(innerWidth, innerHeight);
}

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
  maxPrice = 0;
  maxKm = 0;
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print(table.getColumn('km'));
  print(table.getColumn('price'));

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++){
    if (table.getString(r, 'km') > maxKm)
      maxKm = table.getString(r, 'km');
    if (table.getString(r, 'price') > maxPrice)
      maxPrice = table.getString(r, 'price');
    circlesArray.push([table.getString(r, 'km'), table.getString(r, 'price')])
  }
}

function draw() {
  //clean
  background(255);
  textSize(30);
  stroke('black');
  fill('blue');
  //display interface
  text('FT_LINEAR_REGRESSION', innerWidth / 2 - 8*28, 30);
  text('BY DBOUDY', innerWidth / 2 - 4*28, 70);
  fill('black');
  line(graphOriginX, graphOriginY, maxX, graphOriginY);
  line(graphOriginX,graphOriginY, graphOriginX, maxY);
  //dislay file img
  if (img) {
    image(img, graphOriginX, maxY, innerWidth - 200 , innerHeight - 200);
  }
  //dislay linear graph
  else if (table) {
    textSize(15);
    text('0', graphOriginX -16, graphOriginY + 16);
    text('price\n' + maxPrice, graphOriginX - 40, maxY);
    text('km\n' + maxKm, maxX + 10, graphOriginY);
    fill('red');
    stroke('red');
    for (let circleIndex in circlesArray) {
      let posX = (ecartX * circlesArray[circleIndex][0])/maxKm + graphOriginX;
      let posY = graphOriginY - (ecartY * circlesArray[circleIndex][1]/maxPrice)
      circle(posX, posY, 5);
      textSize(11);
      text("(" + circlesArray[circleIndex][1] + "," + circlesArray[circleIndex][0] + ")", posX + 5, posY);
    }
    fill('green');
    stroke('green');
    //to do define theta0 et theta1
    line(linearLineX1, linearLineY1, linearLineX2, linearLineY2);
  }
}

