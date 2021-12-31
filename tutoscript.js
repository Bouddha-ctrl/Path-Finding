

function display(element,level){
    if (level==1) element = element.firstElementChild
    element.style.display = 'inline';
}

function undisplay(element,level){
    if (level==1) element = element.firstElementChild

    element.style.display = 'none';
}
