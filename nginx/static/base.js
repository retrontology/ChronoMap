var frames = []
const img_prefix = '/media/'

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

async function getFrameData(frame_id) {
    const url = '/frame/' + frame_id;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const text = await response.text();
        return text;
    } catch (error) {
        console.error(error.message);
    }
}

async function preloadRegion() {
    var element = document.createElement('div');
    element.style.display = 'none';
    document.body.appendChild(element);
    for (var i = 0; i < frames.length; i++) {
        let data = await getFrameData(frames[i].id);
        element.innerHTML = data;
    }
    element.remove()
}

async function changeRegion() {
    var region = document.getElementById('region-select').value;
    frames = await getRegionFrames(region);

    var slider = document.getElementById('date-slider');
    slider.min = 0;
    slider.max = frames.length - 1;
    slider.value = 0;
    await changeDate();
    //await preloadRegion();
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

async function changeDate() {
    var slider = document.getElementById('date-slider');
    var frame = frames[slider.value];

    document.getElementById('date').innerHTML = frame.date;
    var title = document.getElementById('title')
    title.innerHTML = frame.title;
    title.href = frame.url;
    document.getElementById('description').innerHTML = frame.description;
    const data = await getFrameData(frame.id);
    document.getElementById('map').innerHTML = data;
    showEvents();
}

async function prevDate() {
    var slider = document.getElementById('date-slider');
    if (parseInt(slider.value) > parseInt(slider.min)) {
        slider.value--;
        await changeDate();
    }
}

async function nextDate() {
    var slider = document.getElementById('date-slider');
    if (parseInt(slider.value) <= parseInt(slider.max)) {
        slider.value++;
        await changeDate();
    }
}

var swipe_event = null;

class SwipeEvent {

    static THRESHOLD = 50;

    static RIGHT = 'right';
    static LEFT = 'left';
    static UP = 'up';
    static DOWN = 'down';

    constructor(event) {
        this.direction = null;
        this.start_event = event;
    }

    endSwipe(event) {
        this.end_event = event;

        let start = this.start_event.changedTouches[0];
        let end = this.end_event.changedTouches[0];

        if (!start || !end) { return; }

        let d_x = start.screenX - end.screenX;
        let d_y = start.screenY - end.screenY;
        let abs_x = Math.abs(d_x);
        let abs_y = Math.abs(d_y);

        let biggest = abs_x > abs_y ? abs_x : abs_y;
        if (biggest <= SwipeEvent.THRESHOLD) { return; }
        
        if (abs_x > abs_y) {
            if (d_x > 0) {
                this.direction = SwipeEvent.LEFT;
            }
            else {
                this.direction = SwipeEvent.RIGHT;
            }
        }
        else {
            if (d_y > 0) {
                this.direction = SwipeEvent.UP;
            }
            else {
                this.direction = SwipeEvent.DOWN;
            }
        }

        return this.direction;
    }
}

function startSwipe(event) {
    swipe_event = new SwipeEvent(event);
}

async function endSwipe(event) {
    if (!swipe_event){ return; }

    let direction = swipe_event.endSwipe(event)
    switch(direction) {
        case SwipeEvent.RIGHT:
            await prevDate();
            break;
        case SwipeEvent.LEFT:
            await nextDate();
            break;
        case SwipeEvent.UP:
            await nextDate();
            break;
        case SwipeEvent.DOWN:
            await prevDate();
            break;
    }

    swipe_event = null;
}

map = document.getElementById("map");
map.addEventListener('touchstart', (event) => startSwipe(event));
map.addEventListener('touchend', async function(event) {await endSwipe(event)});

document.addEventListener('keydown', async function(event) {
    switch (event.key) {
        case 'ArrowLeft':
            await prevDate();
            break;
        case 'ArrowRight':
            await nextDate();
            break;
    }
})

populateRegions();


