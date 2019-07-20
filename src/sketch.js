let table;
let img;
let circlesArray;
const graphPosX = 150;
const graphPosY = 200;

function setup() {
  //add input load file
  input = createFileInput(handleFile);
  input.position(0, 0);

  
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
  print(file);  
  if (file.type === 'image') {
    img = createImg(file.data);
    img.hide();
  } else if (file.type === 'application' && file.subtype === 'vnd.ms-excel') {
    console.log('fseqgsqfgfqgqfdg');
    table = loadTable(file.data, loadTableOn, 'csv', 'header');
  }
  else {
    img = null;
    table = null;
  }
}

function loadTableOn() {
  circlesArray = [];
  print(table.getRowCount() + ' total rows in table');
  print(table.getColumnCount() + ' total columns in table');
  print(table.getColumn('km'));
  print(table.getColumn('price'));
  //["Goat", "Leopard", "Zebra"]

  //cycle through the table
  for (let r = 0; r < table.getRowCount(); r++){
    circlesArray.push([table.getString(r, 'km'),table.getString(r, 'price')])
      //print("km : " + table.getString(r, 'km'));
      //print("price : " + table.getString(r, 'price'));
  }
}

function draw() {
  background(255);
  textSize(30);
  text('tesgrgsfg', innerWidth / 2, 20);
  
  if (img) {
    image(img, 0, 0, width, height);
  }
  else if (table) {
    console.log('table create');
    fill('red');
    stroke('red');
    for (let circleIndex in circlesArray) {
      circle(circlesArray[circleIndex][0]/200 + graphPosX, circlesArray[circleIndex][1]/100 * 4 + graphPosY, 5);
    }
    line(30, 20, 85, 75);
  }

}