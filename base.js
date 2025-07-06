function slugify(value, allowUnicode = false) {

    value = String(value);

    if (allowUnicode) {
        value = value.normalize('NFKC');
    } else {
        value = value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
    }

    value = value.toLowerCase().replace(/[^\w\s-]/g, '');
    return value.trim().replace(/[-\s]+/g, '-').replace(/^[-_]+|[-_]+$/g, '');

}

function updateRegion() {

}

function populateRegions() {
    

    updateRegion();
}

function updateDate() {

}

function prevDate() {
    
}

function nextDate() {
    
}

populateRegions();
$(document).keypress(function(e){
    if (e.which == 37){
        prevDate();
    }
    else if (e.which == 39){
        nextDate();
    }
});
