var frames = []
const img_prefix = '/media/'

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

async function getRegionFrames(region) {
    const url = '/region/' + region;
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

async function changeRegion() {
    var region = document.getElementById('region-select').value;
    frames = await getRegionFrames(region);

    var slider = document.getElementById('date-slider');
    slider.min = 0;
    slider.max = frames.length - 1;
    slider.value = 0;
    changeDate();
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
    await changeRegion();
}

function changeDate() {
    var slider = document.getElementById('date-slider');
    var frame = frames[slider.value];

    document.getElementById('date').innerHTML = frame.date;
    document.getElementById('title').innerHTML = frame.title;
    document.getElementById('description').innerHTML = frame.description;
    document.getElementById('map').src = img_prefix + frame.path;
}

function prevDate() {
    var slider = document.getElementById('date-slider');
    if (parseInt(slider.value) > parseInt(slider.min)) {
        slider.value--;
        changeDate();
    }
}

function nextDate() {
    var slider = document.getElementById('date-slider');
    if (parseInt(slider.value) <= parseInt(slider.max)) {
        slider.value++;
        changeDate();
    }
}

document.onkeyup = function(e) {
    if (e.key == "ArrowLeft"){
        prevDate();
    }
    else if (e.key == "ArrowRight"){
        nextDate();
    }
};
