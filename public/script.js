let x1 = document.getElementsByClassName('box')[0];
let x2 = document.getElementsByClassName('box')[1];
let x3 = document.getElementsByClassName('box')[2];
let x4 = document.getElementsByClassName('box')[3];
let x5 = document.getElementsByClassName('box')[4];
let x6 = document.getElementsByClassName('box')[5];
let x7 = document.getElementsByClassName('box')[6];
let x8 = document.getElementsByClassName('box')[7];
let x9 = document.getElementsByClassName('box')[8];
let t = document.getElementById('turn');
let turn = 'X';

function new_game() {
    turn = 'X';

    x1.innerText = '';
    x2.innerText = '';
    x3.innerText = '';
    x4.innerText = '';
    x5.innerText = '';
    x6.innerText = '';
    x7.innerText = '';
    x8.innerText = '';
    x9.innerText = '';

    t.innerText = 'Current Player X';

    x1.setAttribute('onclick', 'click1()');
    x2.setAttribute('onclick', 'click2()');
    x3.setAttribute('onclick', 'click3()');
    x4.setAttribute('onclick', 'click4()');
    x5.setAttribute('onclick', 'click5()');
    x6.setAttribute('onclick', 'click6()');
    x7.setAttribute('onclick', 'click7()');
    x8.setAttribute('onclick', 'click8()');
    x9.setAttribute('onclick', 'click9()');

    x1.style.backgroundColor = 'antiquewhite';
    x2.style.backgroundColor = 'antiquewhite';
    x3.style.backgroundColor = 'antiquewhite';
    x4.style.backgroundColor = 'antiquewhite';
    x5.style.backgroundColor = 'antiquewhite';
    x6.style.backgroundColor = 'antiquewhite';
    x7.style.backgroundColor = 'antiquewhite';
    x8.style.backgroundColor = 'antiquewhite';
    x9.style.backgroundColor = 'antiquewhite';
}

function compare(a1,a2,a3){
    if (a1.innerText == a2.innerText && a2.innerText == a3.innerText && a1.innerText != '') {
        a1.style.backgroundColor = 'rgb(115, 255, 115)';
        a2.style.backgroundColor = 'rgb(115, 255, 115)';
        a3.style.backgroundColor = 'rgb(115, 255, 115)';
        for (let i = 0; i < 9; i++) {
            document.getElementsByClassName('box')[i].removeAttribute('onclick');
        }
        t.innerText = `Winner Player ${a1.innerText}`;
    }
}

// Win function
function win() {    
    if ((x1.innerText != '' && x2.innerText != '' && x3.innerText != '' && x4.innerText != '' && x5.innerText != '' && x6.innerText != '' && x7.innerText != '' && x8.innerText != '' && x9.innerText != '') && (x1)) {
        t.innerText = `Match Tie`;
    }
    compare(x1,x2,x3);
    compare(x1,x4,x7);
    compare(x7,x8,x9);
    compare(x9,x6,x3);
    compare(x4,x5,x6);
    compare(x2,x5,x8);
    compare(x1,x5,x9);
    compare(x3,x5,x7);

}


function click(num){
    if (turn == 'X') {
        document.getElementsByClassName('box')[num].innerText = 'X';
        document.getElementsByClassName('box')[num].style.color="red";
        document.getElementsByClassName('box')[num].removeAttribute('onclick');
        console.log(x1.innerText)
        turn = 'O';
        t.innerText = 'Current Player O';
    }
    else if (turn == 'O') {
        document.getElementsByClassName('box')[num].innerText = 'O';
        document.getElementsByClassName('box')[num].style.color="blue";
        document.getElementsByClassName('box')[num].removeAttribute('onclick');
        turn = 'X';
        t.innerText = 'Current Player X';
    }
    win();
}

function click1() {
    click(0);
}
function click2() {
    click(1);
}
function click3() {
    click(2);
}
function click4() {
    click(3);
}

function click5() {
    click(4);
}
function click6() {
    click(5);
}
function click7() {
    click(6);
}
function click8() {
    click(7);
}
function click9() {
    click(8);
}
