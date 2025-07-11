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

async function getRegions() {
    const url = '/regions/'
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (error) {
        console.error(error.message);
    }

}

function changeRegion() {

}

async function populateRegions() {
    var select = document.getElementById('region-select');
    select.innerHTML = '';
    var regions = await getRegions();
    for (var i = 0; i < regions.length; i++) {
        var option = document.createElement('option');
        option.value = regions[i];
        option.text = regions[i];
        select.appendChild(option);
    }
    //changeRegion();
}

function changeDate() {

}

function prevDate() {
    
}

function nextDate() {
    
}

document.onkeyup = function(e) {
    if (e.key == 37){
        prevDate();
    }
    else if (e.key == 39){
        nextDate();
    }
};
