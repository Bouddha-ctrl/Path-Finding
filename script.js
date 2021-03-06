//classes

class Noeud {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.g = 0;
        this.h = 0;
        this.parent = null;
    }

};
/////////////

///body
const container1 = document.querySelector('.container1')

var n = 12;
var m = 24;
document.getElementById("x").value = n
document.getElementById("y").value = m

function changeX(){
    let x = document.getElementById('x').value;
    if(x>0){
        n=parseInt(x);
        grid();
    }
}
function changeY(){
    let y = document.getElementById('y').value;
    if(y>0){
        m=parseInt(y);
        grid();
    }
}

function grid(){
    container1.innerHTML = "";
    draw();
}

function draw() {
    let min = Math.min(container1.clientWidth / (m + 1), container1.clientHeight / (n + 1))
    for (let i = 0; i < n; i++) {
        let row = document.createElement('div')
        row.setAttribute("class", "roww")
        for (let index = 0; index < m; index++) {
            let squars = document.createElement('div')
            squars.style.width = `${min}`
            squars.style.height = `${min}`
            squars.setAttribute("class", "squars")
            squars.setAttribute("name", `${i}_${index}`)
            squars.setAttribute("id", `${i*m+index+1}`)
            squars.setAttribute("onclick", `getSquare("${i}_${index}")`)

            let squarshigh = document.createElement('span')
            squarshigh.setAttribute("class", "squarshigh")
            let squarslow = document.createElement('span')
            squarslow.setAttribute("class", "squarslow")

            squars.appendChild(squarshigh)
            squars.appendChild(squarslow)


            row.appendChild(squars)
        }
        container1.appendChild(row)
    }

}
window.addEventListener('resize', () => {
    container1.innerHTML = ""
    draw()
})

draw()
function reset(){
    document.location.reload();
}

function clean(){
    let deb1 = null
    let fin1 = null
    container1.innerHTML = ""
    draw()
    ListClose = []
    ListOpen = []

    editable = true;
    solutionFound =  false ;
    valuesCheck = true;
    colorCheck = true;
    
    if (debut!= null && fin!=null){
        deb1 = new Noeud(debut.x,debut.y);
        fin1 = new Noeud(fin.x,fin.y);
        
    }
    debut = null;
    fin = null;
    clickonsquare(deb1);
    clickonsquare(fin1);

    //wall
    ListWall.forEach(noeud => {
        addwall(noeud.x+"_"+noeud.y);
    });
    
}

function directionChange(){
    const directionRadio = document.querySelector('input[name="directionRadio"]:checked').value; //heuristic function
    if (directionRadio=="0"){
        document.getElementById("flexRadioDefault9").checked = true;
        document.getElementById("flexRadioDefault10").disabled = true;
    }
    else {
        document.getElementById("flexRadioDefault10").disabled = false;
    }
}
function clickonsquare(noeud){
    if (noeud == null) return;
    let id = noeud.x*m+noeud.y+1;
    let h = document.getElementById(id);
    h.click();
}

function addwall(name){
    let noeud = buildNoeud(name);
    if(!containt(noeud,ListClose) && !containt(noeud,ListOpen) && !compareNoeud(fin,noeud)){
        ListWall.push(noeud);
        ListClose.push(noeud);
        SUDOchangeColor(noeud,'gray');
    }
}
//////////////
///variables 
var ListClose = []
var ListOpen = []
var ListWall = []

var multiplier = 10;
var editable = true;
var solutionFound =  false ;
var valuesCheck = true;
var colorCheck = true;
var neighbour ;
var searchFunction;
var Hfunction ;
var mazeNumber = 1;

var debut = null;
var fin = null;

//////calculate
function getSquare(name) {
    console.log(name);
    valuesCheck = document.getElementById('valuesCheck').checked;
    colorCheck = document.getElementById('colorCheck').checked;


    if(debut==null){
        debut = buildNoeud(name);
        SUDOchangeColor(debut,'blue')
        displaytext(debut,'A');
        ListOpen.push(debut);
    }else if(fin == null){
        fin = buildNoeud(name);
        if(compareNoeud(fin,debut)) fin=null;
        SUDOchangeColor(fin,'blue');
        displaytext(fin,'B');   
    }else if(editable){
        const cb = document.getElementById('wallCheck');
        if(cb.checked){
            addwall(name);
        }else{
            doAction(name);
        }

    }
}

function buildNoeud(name){
    let point = name.split("_");
    let x = parseInt(point[0]);
    let y = parseInt(point[1]);
    let noeud = new Noeud(x,y);
    return noeud;
}

//functions
function compareNoeud(N1,N2){
    if (N1.x == N2.x && N1.y == N2.y) return true;
    return false;
}
function containt(N,Array){ 
    for (let i = 0; i < Array.length; i++) {
        if (compareNoeud(N,Array[i]) == true ){
            return true;
        }
    }
    return false;
}
function changeColor(Noeud,color, check =0){
    if( (fin==null || (!compareNoeud(Noeud,fin) && !compareNoeud(Noeud,debut)) || check ==1 ) && colorCheck ){
        let current = document.getElementsByName(Noeud.x + "_" + Noeud.y);
        current[0].style.backgroundColor = color;
    }
}
function SUDOchangeColor(Noeud,color){
    if(Noeud!=null){
        let current = document.getElementsByName(Noeud.x + "_" + Noeud.y);
        current[0].style.backgroundColor = color;
    }
}

function displayValue(Noeud){
    if (valuesCheck && !compareNoeud(Noeud,fin)){
        let current = document.getElementById(Noeud.x*m+Noeud.y+1);
        let sum = Noeud.h+Noeud.g;

        let high = current.querySelector(".squarshigh");
        high.innerHTML =`<span>${Noeud.g}</span><span>${Noeud.h}</span>`;

        let low = current.querySelector(".squarslow");
        low.innerText = sum;
    }
}
function displaytext(Noeud,text){
    if(Noeud!=null){
        let current = document.getElementById(Noeud.x*m+Noeud.y+1);
        let low = current.querySelector(".squarslow");
        low.innerHTML =`<span>${text}</span>`;
    }
}

function getNoeud(Array,N){
    for (let i = 0; i < Array.length; i++) {
        if (compareNoeud(N,Array[i]) == true ){
            return Array[i];
        }
    }
    return null;
}

function updateList(Array,N){
    for (let i = 0; i < Array.length; i++) {
        if (compareNoeud(N,Array[i]) == true ){
            Array[i].parent = N.parent;
            Array[i].h = N.h;
            Array[i].g = N.g;
        }
    }
    return Array;
}

function getpath(noeud,count = -1){
    
    setTimeout(function() { 
        if(noeud == null){
            alert("Solution trouv??, le cout : "+fin.g+"\n nb de pas : "+count);
            return;
        }
        SUDOchangeColor(noeud,'purple');
        return getpath(noeud.parent,count+1);
    }, 200)
}


function directDistance(noeud,fin){
    let xdiff = Math.abs(fin.x-noeud.x);
    let ydiff = Math.abs(fin.y-noeud.y);
    let min = Math.min(xdiff,ydiff)
    let diff  = Math.abs(xdiff-ydiff);
    return multiplier*1.4*min + multiplier*1 * diff;
}

function Manhattan(noeud,fin){
    return Math.abs(fin.x-noeud.x)*multiplier + Math.abs(fin.y-noeud.y)*multiplier;
}

function doAction(name){

    const directionRadio = document.querySelector('input[name="directionRadio"]:checked').value; //4-8 directions
    if(directionRadio=='0'){
        multiplier = 1;
        neighbour = neighbour_4way;
    }else{
        multiplier = 10;
        neighbour = neighbour_8way;
    }

    const functionSelect = document.getElementById("functionSelect").value; //search function
    if (functionSelect=="astar") searchFunction=Astar;
    else if (functionSelect=="BFS") searchFunction=BFS;
    else if (functionSelect=="DFS") searchFunction=DFS;
    else if (functionSelect=="greedy") searchFunction=greedy;

    const heuristicRadio = document.querySelector('input[name="heuristicRadio"]:checked').value; //heuristic function
    if (heuristicRadio=="manhattan") Hfunction=Manhattan;
    else if (heuristicRadio=="shortest") Hfunction=directDistance;
    
    searchFunction(name);
}


function greedy(name){
    
    let current = getNoeud(ListOpen,buildNoeud(name));
    
    if (current != null){ //check if in ListOpen , ListOpen.containt(current)
        
        if (compareNoeud(current,fin)){
            fin.g = current.g;
            getpath(current);
            editable = false;
            solutionFound = true;
            return;
        }
        /////////
        //pop from open add to close
        ListClose.push(current);
        ListOpen = ListOpen.filter(function(Noeud){ 
            return !containt(Noeud,ListClose);
        });
        changeColor(current,'red');
        /////////
        let array = neighbour(current);
        array.forEach(noeud => {
            if (!containt(noeud, ListClose)) { 
                
                //h calcule, estimated distance from current to end
                noeud.h = Hfunction(noeud,fin);
                
                if(containt(noeud, ListOpen)){
                    let noeudOpen = getNoeud(ListOpen,noeud);
                    if (noeud.g+noeud.h < noeudOpen.g+noeudOpen.h){ //update
                        changeColor(noeud,'orange');
                        ListOpen = updateList(ListOpen,noeud);
                        displayValue(noeud);
                    }                    
                }else{
                    ListOpen.push(noeud);
                    changeColor(noeud,'green');
                    displayValue(noeud);
                }
            }
        });
        
    }
    ListOpen = ListOpen.sort((a,b) => a.g+a.h - b.g-b.h);
}

function Astar(name){
    
    let current = getNoeud(ListOpen,buildNoeud(name));
    
    if (current != null){ //check if in ListOpen , ListOpen.containt(current)
        
        if (compareNoeud(current,fin)){
            fin.g = current.g;
            getpath(current);
            editable = false;
            solutionFound = true;
            return;
        }
        /////////
        //pop from open add to close
        ListClose.push(current);
        ListOpen = ListOpen.filter(function(Noeud){ 
            return !containt(Noeud,ListClose);
        });
        changeColor(current,'red');
        /////////
        let array = neighbour(current);
        array.forEach(noeud => {
            if (!containt(noeud, ListClose)) {
                // g calcule , distance from start to current
                let count = Math.abs(noeud.x-current.x)+Math.abs(noeud.y-current.y)
                if (count>1){
                    noeud.g=current.g+1.4*multiplier;
                }else{
                    noeud.g=current.g+1*multiplier;
                }

                //noeud.g=current.g+1;
                
                //h calcule, estimated distance from current to end
                noeud.h = Hfunction(noeud,fin);
                
                if(containt(noeud, ListOpen)){
                    let noeudOpen = getNoeud(ListOpen,noeud);
                    if (noeud.g+noeud.h < noeudOpen.g+noeudOpen.h){ //update
                        changeColor(noeud,'orange');
                        ListOpen = updateList(ListOpen,noeud);
                        displayValue(noeud);
                    }                    
                }else{
                    ListOpen.reverse(); //push in the beginning
                    ListOpen.push(noeud);
                    ListOpen.reverse();
                    changeColor(noeud,'green');
                    displayValue(noeud);
                }
            }
        });
        
    }
    ListOpen = ListOpen.sort((a,b) => a.g+a.h - b.g-b.h);
}

function BFS(name){
    
    let current = getNoeud(ListOpen,buildNoeud(name));
    
    if (current != null){ //check if in ListOpen , ListOpen.containt(current)
        
        if (compareNoeud(current,fin)){
            fin.g = current.g;
            getpath(current);
            editable = false;
            solutionFound = true;
            return;
        }
        /////////
        //pop from open add to close
        ListClose.push(current);
        ListOpen = ListOpen.filter(function(Noeud){ 
            return !containt(Noeud,ListClose);
        });
        changeColor(current,'red');
        /////////
        let array = neighbour(current);
        array.forEach(noeud => {
            if (!containt(noeud, ListClose) && !containt(noeud, ListOpen)) {
                // g calcule , distance from start to current
                let count = Math.abs(noeud.x-current.x)+Math.abs(noeud.y-current.y)
                if (count>1){
                    noeud.g=current.g+1.4*multiplier;
                }else{
                    noeud.g=current.g+1*multiplier;
                }
                //noeud.g=current.g+1;
                
                ListOpen.push(noeud); // add in the end
                changeColor(noeud,'green');
                displayValue(noeud);
            }
        });
        
    }
}
function DFS(name){
    
    let current = getNoeud(ListOpen,buildNoeud(name));
    
    if (current != null){ //check if in ListOpen , ListOpen.containt(current)
        
        if (compareNoeud(current,fin)){
            fin.g = current.g;
            getpath(current);
            editable = false;
            solutionFound = true;
            return;
        }
        /////////
        //pop from open add to close
        ListClose.push(current);
        ListOpen = ListOpen.filter(function(Noeud){ 
            return !containt(Noeud,ListClose);
        });
        changeColor(current,'red');
        /////////
        let array = neighbour(current);
        array.forEach(noeud => {
            if (!containt(noeud, ListClose)) {
                // g calcule , distance from start to current
                let count = Math.abs(noeud.x-current.x)+Math.abs(noeud.y-current.y)
                if (count>1){
                    noeud.g=current.g+1.4*multiplier;
                }else{
                    noeud.g=current.g+1*multiplier;
                }
                
                ListOpen.unshift(noeud) //push in the beginning
                changeColor(noeud,'green');
                displayValue(noeud);
                
            }
        });
        
    }
}


function neighbour_4way(N){
    let x = N.x;
    let y = N.y;
    let array = [];
    for(let i =x-1;i<x+2;i++){
        for (let j = y-1; j < y+2; j++) {
            if (i>=0 && i<n && j>=0 && j<m && Math.abs(x-i)+Math.abs(y-j)<2){
                let Nv = new Noeud(i,j);
                Nv.parent = N;
                array.push(Nv)
            }
        }
    }
    return array;
}
function neighbour_8way(N){
    let x = N.x;
    let y = N.y;
    let array = [];
    for(let i =x-1;i<x+2;i++){
        for (let j = y-1; j < y+2; j++) {
            if (i>=0 && i<n && j>=0 && j<m ){
                let Nv = new Noeud(i,j);
                Nv.parent = N;
                array.push(Nv)
            }
        }
    }
    return array;
}


function solve(){
    if(debut == null){
        var dx =  Math.floor(Math.random() * n);
        var dy =  Math.floor(Math.random() * m);
        debut = new Noeud(dx,dy);
        SUDOchangeColor(debut,'blue');
        displaytext(debut,'A');
        ListOpen.push(debut);
    }
    if(fin == null){
        var fx =  Math.floor(Math.random() * n);
        var fy =  Math.floor(Math.random() * m);
        fin = new Noeud(fx,fy);
        SUDOchangeColor(fin,'blue');
        displaytext(fin,'B');
    }


    let cb = document.getElementById('wallCheck');  //disable wall builing if enabled
    cb.checked = false;

    const radio = document.querySelector('input[name="findRadio"]:checked').value; //all or step by step
    let H = 1;
    if (radio == '1'){
        H = 1000000;
    }

    


    for(let index = 0 ; index < H;index++){   // one iteration or many till solution
        if(ListOpen.length == 0 ) {
            editable = false;
            alert("no solution");
            return;
        }
        if(solutionFound) return;
        let Noeud = ListOpen[0];
        let current = document.getElementById(Noeud.x*m+Noeud.y+1);
        current.click(); 
        
    }
}


//draw walls on draw , click and drag
var isMouseDown = false;
document.onmousedown = function() { isMouseDown = true  };
document.onmouseup   = function() { isMouseDown = false };
document.onmousemove = function(event) { if(isMouseDown) { 
    pointerX = event.pageX;
	pointerY = event.pageY;
    let rect = container1.getBoundingClientRect();

    if (pointerY > rect.y && pointerY < rect.bottom) 
        document.elementFromPoint(event.pageX, event.pageY).click();
    } 
};



//Maze 

var maze1 = ["2_5","3_5","9_5","8_5","10_3","10_4","10_5","10_6","10_7","10_8","10_9","10_10","10_11","10_12","10_13","10_14","10_15","10_16","10_17","10_2","9_2","8_2","7_2","6_2","5_2","4_2","3_2","2_2","1_2","1_3","1_4","1_5","1_6","1_7","1_8","1_9","1_10","1_11","1_12","1_13","1_14","1_15","1_16","1_17","1_18","1_19","1_20","1_21","1_22","2_22","3_22","4_22","5_22","6_22","7_22","8_22","9_22","10_22","10_21","10_20","10_19","10_18","7_10","7_9","7_8","6_8","5_8","4_8","4_9","4_10","4_14","4_15","4_16","3_16","2_16","7_14","7_15","7_16","8_16","9_16","4_19","5_19","6_19","7_19"]
var Maze = [maze1]


function draw_maze(){
    mazeNumber = document.getElementById("mazeNumber").value;

    container1.innerHTML = ""
    draw()
    ListClose = []
    ListOpen = []
    ListWall = []

    editable = true;
    solutionFound =  false ;
    valuesCheck = true;
    colorCheck = true;

    debut = null;
    fin = null;

    Maze[mazeNumber-1].forEach(name => {
        let noeud = buildNoeud(name);
        SUDOchangeColor(noeud, 'gray');
        ListWall.push(noeud);
        ListClose.push(noeud);

    });
}