function drawEventLine(canvas, eventId, targetX, targetY, strokeStyle, useVerticalStart, startPercent, lineWidth, useBoundingRect) {
    useVerticalStart = useVerticalStart || false;
    lineWidth = lineWidth || 1;
    
    var eventElement = document.getElementById(eventId);
    if (!eventElement) {
        console.warn('Event element not found:', eventId);
        return;
    }
    
    // Get canvas and container dimensions
    var canvasContainer = document.getElementById("EventsCanvasContainer");
    if (!canvasContainer) {
        console.warn('Canvas container not found');
        return;
    }
    
    var containerRect = canvasContainer.getBoundingClientRect();
    var canvasRect = canvas.canvas.getBoundingClientRect();
    
    // Calculate scaling factors between canvas and container
    var scaleX = canvas.canvas.width / containerRect.width;
    var scaleY = canvas.canvas.height / containerRect.height;
    
    // Get event element position relative to container
    var eventRect, eventLeft, eventTop;
    if (useBoundingRect) {
        eventRect = eventElement.getBoundingClientRect();
        eventLeft = eventRect.left - containerRect.left;
        eventTop = eventRect.top - containerRect.top;
    } else {
        eventLeft = eventElement.offsetLeft;
        eventTop = eventElement.offsetTop;
    }
    
    // Apply any CSS transforms
    var transform = getTranslateXY(eventElement);
    eventLeft += transform[0];
    eventTop += transform[1];
    
    // Get event element dimensions
    var eventWidth = eventElement.offsetWidth - 1;
    var eventHeight = eventElement.offsetHeight - 1;
    
    // Calculate start position (p, w) and end position (targetX, targetY)
    var startX = eventLeft;
    var startY = eventTop;
    
    if (startPercent < 0) {
        // Complex line calculation for negative start percent
        var centerX = (2 * eventLeft + eventWidth) / 2;
        var centerY = (2 * eventTop + eventHeight) / 2;
        var slope = (targetY - centerY) / (targetX - centerX);
        var offset = slope * eventWidth / 2;
        
        if (-eventHeight / 2 <= offset && offset <= eventHeight / 2) {
            if (centerX < targetX) {
                startX = eventLeft + eventWidth;
                startY = centerY + offset;
            } else {
                startX = eventLeft;
                startY = centerY - offset;
            }
        } else {
            if (centerY < targetY) {
                startX = centerX + eventHeight / 2 / slope;
                startY = eventTop + eventHeight;
            } else {
                startX = centerX - eventHeight / 2 / slope;
                startY = eventTop;
            }
        }
    } else {
        // Simple percentage-based calculation
        var percent = startPercent / 100 || 0.5;
        if (useVerticalStart) {
            startY = eventTop + eventHeight * percent;
            if (eventLeft < targetX) {
                startX = eventLeft + eventWidth - 1;
            }
        } else {
            if (targetY < eventTop) {
                startX = eventLeft + eventWidth * percent;
            } else {
                startX = eventLeft + eventWidth * percent;
                startY = eventTop + eventHeight;
            }
        }
    }
    
    // Scale coordinates to canvas space
    var canvasStartX = startX * scaleX;
    var canvasStartY = startY * scaleY;
    var canvasTargetX = targetX * scaleX;
    var canvasTargetY = targetY * scaleY;
    
    // Draw the line
    canvas.strokeStyle = strokeStyle;
    canvas.lineWidth = lineWidth;
    canvas.beginPath();
    canvas.moveTo(canvasStartX, canvasStartY);
    canvas.lineTo(canvasTargetX, canvasTargetY);
    
    // Draw arrow if lineWidth > 0
    if (lineWidth > 0) {
        canvas.fillStyle = strokeStyle;
        if (useVerticalStart) {
            canvas.lineTo(canvasStartX, canvasStartY + lineWidth);
        } else {
            canvas.lineTo(canvasStartX + lineWidth, canvasStartY);
        }
        canvas.fill();
    }
    
    canvas.stroke();
}

function getTranslateXY(element) {
    var transform = element.style.transform;
    if (transform === "") return [0, 0];
    
    var matches = transform.match(/(-?[0-9\.]+)/g);
    if (!matches) return [0, 0];
    
    if (matches.length === 2) {
        return [parseInt(matches[0]), parseInt(matches[1])];
    } else if (matches.length === 1) {
        return [parseInt(matches[0]), 0];
    }
    return [0, 0];
}

function drawEvents() {
    var canvas = $(".events-canvas").get(0);
    if (!canvas) {
        console.warn('Events canvas not found');
        return;
    }
    
    var ctx = canvas.getContext("2d");
    if (!ctx) {
        console.warn('Could not get canvas context');
        return;
    }
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ensure canvas dimensions match container
    var container = document.getElementById("EventsCanvasContainer");
    if (container) {
        var containerRect = container.getBoundingClientRect();
        if (canvas.width !== containerRect.width || canvas.height !== containerRect.height) {
            canvas.width = containerRect.width;
            canvas.height = containerRect.height;
        }
    }
    
    // Draw lines for each event
    $(".event").each(function() {
        var $event = $(this);
        drawEventLine(
            ctx,
            $event.attr("id"),
            $event.data("pointx"),
            $event.data("pointy"),
            $event.data("stroke-style"),
            $event.data("use-vertical-start") === "True",
            $event.data("start-percent")
        );
    });
}

function hideEvents() {
    $(".events-layer").hide();
    $(".event-img").not(".event-img_main").hide();
}

function showEvents() {
    $(".events-layer").show();
    $(".event-img").not(".event-img_main").show();
    drawEvents();
}

function toggleShowEvents(e) {
    if ($("#show_events").is(":checked")) {
        showEvents();
    } else {
        hideEvents();
    }
    toggleCookie("show_events");
}

function hideLabels() {
    $(".labels.overlay").hide();
    $(".loci.overlay").hide();
    $(".event-img_main").hide();
}

function showLabels() {
    $(".labels.overlay").show();
    $(".loci.overlay").show();
    $(".event-img_main").show();
}

function toggleShowLabels(e) {
    if ($("#show_labels").is(":checked")) {
        showLabels();
    } else {
        hideLabels();
    }
    toggleCookie("show_labels");
}

function hideMapEffect(e) {
    $(".tj-map-display").removeClass(e);
}

function showMapEffect(e) {
    $(".tj-map-display").addClass(e);
}

function toggleMapEffect(e) {
    if ($("#" + e).is(":checked")) {
        showMapEffect(e);
    } else {
        hideMapEffect(e);
    }
    toggleCookie(e);
}

function hideMapLayerEffect(e) {
    $(".tj-map-display").removeClass(e);
    $("#" + e + "_layer").hide();
}

function showMapLayerEffect(e) {
    $(".tj-map-display").addClass(e);
    $("#" + e + "_layer").show();
}

function toggleMapLayerEffect(e) {
    if ($("#" + e).is(":checked")) {
        showMapLayerEffect(e);
    } else {
        hideMapLayerEffect(e);
    }
    toggleCookie(e);
}

function toggleCookie(e) {
    var base_url = "/update_session/" + e + "/";
    if ($("#" + e).is(":checked")) {
        $.ajax(base_url + "True/");
    } else {
        $.ajax(base_url + "False/");
    }
}

function setCookie(e, t) {
    var base_url = "/update_session/" + e + "/";
    $.ajax(base_url + t + "/");
}

// Add resize handler to redraw events when window is resized
$(window).on('resize', function() {
    if ($("#show_events").is(":checked")) {
        // Debounce the resize event
        clearTimeout(window.resizeTimeout);
        window.resizeTimeout = setTimeout(function() {
            drawEvents();
        }, 100);
    }
});