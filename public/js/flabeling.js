// get url parameters
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

// get classes and current class
var classes = document.getElementsByClassName('class-selection'),
    curr_class = getUrlVars()["curr_class"];

// if current class wasn't set as a parameter in the url, then set current class as the first class
if (curr_class == undefined) {
    curr_class = 0
}
else {
    curr_class = parseInt(curr_class)
}

// set url parameters
function updateURLParameter(url, param, paramVal){
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";
    if (additionalURL) {
        tempArray = additionalURL.split("&");
        for (var i=0; i<tempArray.length; i++){
            if(tempArray[i].split('=')[0] != param){
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    }

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

// hex to rgba
function hex2rgba(hex, o){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+o+')';
    }
    throw new Error('Bad Hex');
}

// draw rectangles on canvas
var Rectangles = (function () {

    function Rectangles(canvas) {
        var inst = this;
        this.canvas = canvas;
        this.className = 'Rectangle';
        this.isDrawing = false;
        this.selectable = true;
        this.curr_object = -1;
        this.origin_width =
        this.bindEvents();
    }

    Rectangles.prototype.bindEvents = function () {
        var inst = this;
        inst.canvas.on('mouse:down', function (o) {
            //console.log('mouse:down')
            inst.onMouseDown(o);
        });
        inst.canvas.on('mouse:move', function (o) {
            //console.log('mouse:move')
            inst.onMouseMove(o);
        });
        inst.canvas.on('mouse:up', function (o) {
            //console.log('mouse:up')
            inst.onMouseUp(o);
        });
        inst.canvas.on('object:moving', function (o) {
            //console.log('object:moving')
            inst.disable();
        });
        inst.canvas.on('mouse:hover', function (o) {
            //console.log('mouse:hover')
        })
        inst.canvas.on('mouse:wheel', function (o) {
            //console.log('mouse:wheel')
            inst.onMouseWheel(o);
        })
    }
    Rectangles.prototype.onMouseUp = function (o) {
        var inst = this;
        //console.log(inst.canvas.getActiveObject())
        if(inst.canvas.getActiveObject() != null) {
            if ($(".label-"+inst.canvas.getActiveObject().id).length == 6){
                // Do something if class does exist
            } else {
                // Do something if class does not exist
                var w = inst.canvas.getActiveObject().width;
                var h = inst.canvas.getActiveObject().height;

                $('#dynamic_form').append(
                    '<input class="labels label-'+inst.canvas.getActiveObject().id+' label-w" type="hidden" name="W" value="' + (w/diff_width_ratio) + '">' +
                    '<input class="labels label-'+inst.canvas.getActiveObject().id+' label-h" type="hidden" name="H" value="' + (h/diff_width_ratio) + '">'
                );

                inst.canvas.getActiveObject().lockMovementX = true;
                inst.canvas.getActiveObject().lockMovementY = true;
            }
        }
        inst.disable();
    };

    Rectangles.prototype.onMouseMove = function (o) {
        var inst = this;
        if (!inst.isEnable()) { return; }
        if(inst.canvas.getActiveObject() != null) {
            var pointer = inst.canvas.getPointer(o.e);
            var activeObj = inst.canvas.getActiveObject();
            //console.log(activeObj);
            activeObj.stroke = classes[curr_class].style.backgroundColor;
            activeObj.strokeWidth = 3;
            activeObj.fill = activeObj.stroke.replace(')', ', 0.33)').replace('rgb', 'rgba');

            left_x = Math.min(origX, Math.max(pointer.x, 0))
            top_y = Math.min(origY, Math.max(pointer.y, 0))
            right_x = Math.max(origX, Math.min(pointer.x, canvas.getWidth()-5))
            bottom_y = Math.max(origY, Math.min(pointer.y, canvas.getHeight()-5))

            activeObj.set({ left: left_x });
            activeObj.set({ top: top_y });

            activeObj.set({ width: Math.abs(left_x - right_x) });
            activeObj.set({ height: Math.abs(top_y - bottom_y) });

            $(".label-"+inst.canvas.getActiveObject().id+".label-x").val(left_x/diff_width_ratio);
            $(".label-"+inst.canvas.getActiveObject().id+".label-y").val(top_y/diff_width_ratio);

            activeObj.setCoords();
            inst.canvas.renderAll();
        }
    };

    Rectangles.prototype.onMouseDown = function (o) {
        var inst = this;
        // Distinguish between two modes (drawing and resizing)
        if (!this.isDrawing) {
            if (o.target == null) {
                if(this.curr_object != -1) {
                    for (var i = 0; i < canvas.getObjects().length; i++) {
                        if (canvas.item(i).id == this.curr_object) {
                            canvas.item(i).set({ fill: 'transparent' });
                            break;
                        }
                    }
                }
                inst.enable();
                var pointer = inst.canvas.getPointer(o.e);
                origX = pointer.x;
                origY = pointer.y;
                var w = pointer.x - origX;
                var h = pointer.y - origY;
                var id =  Math.floor(Math.random() * (1000000000 - 100000)) + 100000;
                var rect = new fabric.Rect({
                    id: id,
                    left: origX,
                    top: origY,
                    originX: 'left',
                    originY: 'top',
                    width: pointer.x - origX,
                    height: pointer.y - origY,
                    angle: 0,
                    transparentCorners: false,
                    hasBorders: false,
                    hasControls: false,
                    selectable: true,
                    modified: false,
                    class: curr_class
                });
                counter += 1;
                $('#dynamic_form').append(
                    '<input class="labels label-'+id+' label-id" type="hidden" name="LabelingID" value="' + id + '">' +
                    '<input class="labels label-'+id+' label-c" type="hidden" name="CStaticID" value="' + curr_class + '">' +
                    '<input class="labels label-'+id+' label-x" type="hidden" name="X" value="' + (origX/diff_width_ratio) + '">' +
                    '<input class="labels label-'+id+' label-y" type="hidden" name="Y" value="' + (origY/diff_width_ratio) + '">'
                );
                $('#labels-counter').val(counter);
                this.curr_object = id;
                inst.canvas.add(rect).setActiveObject(rect);
            } else {
                if(this.curr_object != -1) {
                    for (var i = 0; i < canvas.getObjects().length; i++) {
                        if (canvas.item(i).id == this.curr_object) {
                            canvas.item(i).set({ fill: 'transparent' });
                            break;
                        }
                    }
                }
                this.curr_object = o.target.id;
                o.target.set({ fill: o.target.stroke.replace(')', ', 0.33)').replace('rgb', 'rgba')});
            }
        }
    };
    Rectangles.prototype.isEnable = function () {
        return this.isDrawing;
    }
    Rectangles.prototype.enable = function () {
        this.isDrawing = true;
    }
    Rectangles.prototype.disable = function () {
        this.isDrawing = false;
    }
    Rectangles.prototype.onMouseWheel = function (o) {
        var inst = this;
        canvas.remove(o);
        canvas.renderAll();
    };
    return Rectangles;
}());

// create main canvas
var canvas = new fabric.Canvas('canvas', {
        selection: false
    }),
    rects = new Rectangles(canvas);

// set cursor when hover over canvas to cross
canvas.hoverCursor = 'crosshair';

// get labels counter and list of labels
var counter = parseInt($('#labels-counter').val()),
    list_labels = $('.labels');
// Define the URL where your background image is located
var imageUrl = $("#image_path").val(),
    scaleFactor = $("#image_ratio").val();

// set the width of the canvas to 80% of window size
var origin_width = $("#origin_image_width").val(),
    new_width = $(document).width() * .8,
    new_height = new_width * scaleFactor,
    diff_width_ratio = new_width / origin_width;

$("#image_width").val(new_width);
$("#image_height").val(new_height);

canvas.setWidth(new_width);
canvas.setHeight(new_height);

// set background
canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
    width: $("#canvas").width(),
    height: $("#canvas").height()
});
canvas.calcOffset();

// TODO: reize rectangles when canvas is resized
function resizeRectangles(diff_width_ratio){
    //console.log(canvas.getObjects());
    for (var i = 0; i < canvas.getObjects().length; i++) {
        canvas.item(i).lockMovementX = false;
        canvas.item(i).lockMovementY = false;
        canvas.item(i).set({
            left: $(".label-"+canvas.item(i).id+".label-x").val() * diff_width_ratio,
            top: $(".label-"+canvas.item(i).id+".label-y").val() * diff_width_ratio,
            width: $(".label-"+canvas.item(i).id+".label-w").val() * diff_width_ratio,
            height: $(".label-"+canvas.item(i).id+".label-h").val() * diff_width_ratio
        })
        canvas.item(i).lockMovementX = true;
        canvas.item(i).lockMovementY = true;
    }
}

// draw all rectangles that came from the database
for (var i = 0; i < list_labels.length; i += 6) {
    var rect = new fabric.Rect({
        id: list_labels[i].value,
        stroke: classes[parseInt(list_labels[i + 1].value)].style.backgroundColor,
        strokeWidth: 3,
        fill: "transparent",
        left: parseInt(list_labels[i + 2].value) * diff_width_ratio,
        top: parseInt(list_labels[i + 3].value) * diff_width_ratio,
        originX: 'left',
        originY: 'top',
        width: parseInt(list_labels[i + 4].value) * diff_width_ratio,
        height: parseInt(list_labels[i + 5].value) * diff_width_ratio,
        angle: 0,
        transparentCorners: false,
        hasBorders: false,
        hasControls: false,
        selectable: true,
        class: parseInt(list_labels[i + 1].value)
    });
    rect.lockMovementX = true,
    rect.lockMovementY = true,
    canvas.add(rect);
    canvas.renderAll();

}
canvas.renderAll();

// selection of class action
$(".class-selection").click(function () {
    curr_class = parseInt($(this).text().split(":")[0]) - 1;
    $("#select-class").text($(this).text().split(":")[1].replace(" ", ""));

    // pass current class to other pages when labeling
    $('.pass-class').each(function(event) {
        var url = $(this).attr('href');
        url = updateURLParameter(url, 'curr_class', curr_class)
        $(this).attr("href", url);
    });

    // update current class in form so when saved the class will be presented the same
    $("#curr_class").val(curr_class);

});

// delete a rect
function deleteObjects() {
    var activeObject = canvas.getActiveObject(),
        activeGroup = canvas.getActiveGroup();
    if (activeObject) {
        if (confirm('Are you sure?')) {
            $(".label-"+activeObject.id).remove();
            canvas.remove(activeObject);
            counter -= 1;
            $('#labels-counter').val(counter);
        }
    }
    else if (activeGroup) {
        if (confirm('Are you sure?')) {
            var objectsInGroup = activeGroup.getObjects();
            canvas.discardActiveGroup();
            objectsInGroup.forEach(function (object) {
                canvas.remove(object);
                counter -= 1;
                $('#labels-counter').val(counter);
            });
        }
    }
}

// reset labels action
function resetLabels(){
    if (confirm('Do you want to remove all the labels?')) {
        counter = 0;
        $('#labels-counter').val(counter);
        $( ".labels" ).remove();
        canvas.clear();
        canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
            width: $("#canvas").width(),
            height: $("#canvas").height()
        });
    }
}
$("#reset-labeling").click(resetLabels);

// undo label action
function undoLabel(){
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        width: $("#canvas").width(),
        height: $("#canvas").height()
    });
    if($(".labels").length != 0){
        $( ".labels" ).last().remove();
        $( ".labels" ).last().remove();
        $( ".labels" ).last().remove();
        $( ".labels" ).last().remove();
        $( ".labels" ).last().remove();
        for (var i = 0; i < canvas.getObjects().length; i++) {
            if (canvas.item(i).id == $( ".labels" ).last().val()) {
                canvas.item(i).remove();
                break;
            }
        }
        $( ".labels" ).last().remove();
        counter -= 1;
        $('#labels-counter').val(counter);
    }
}
$("#undo-labeling").click(undoLabel);

// key mapping
$(document).keydown(function (event) {

    var key = (event.keyCode ? event.keyCode : event.which) - 49;
    //console.log(key)
    if(0 <= key && key < classes.length){
        curr_class = parseInt(classes[key].innerHTML.split(":")[0])-1;
        $("#select-class").text(classes[key].innerHTML.split(":")[1].replace(" ", ""));

        // pass current class to other pages when labeling
        $('.pass-class').each(function(event) {
            var url = $(this).attr('href');
            url = updateURLParameter(url, 'curr_class', curr_class)
            $(this).attr("href", url);
        });

        // update current class in form so when saved the class will be presented the same
        $("#curr_class").val(curr_class);

    }
    else if (key == 36 || key == 32) { // u or q
         undoLabel()
    }
    else if (key == 33) { // r
        resetLabels()
    }
    else if (key == 38) { // w
        curr_class = curr_class + 1;
        if(curr_class >= classes.length) {
            curr_class = 0
        }
        $("#select-class").text($(classes[curr_class]).text().split(":")[1].replace(" ", ""));

        // pass current class to other pages when labeling
        $('.pass-class').each(function(event) {
            var url = $(this).attr('href');
            url = updateURLParameter(url, 'curr_class', curr_class)
            $(this).attr("href", url);
        });

        // update current class in form so when saved the class will be presented the same
        $("#curr_class").val(curr_class);

    }
    else if (key == 28) { // m
        // navigation
        $('#menu_modal').modal('toggle');
    }
    else if (key == 34) { // s
        // save
        $("#form-save").trigger('click');
    }
    else if (key == -12 || key == 16) { // left or a
        // prev
        $("#auto-prev").trigger('click');
        $(location).attr('href', $("#prev").attr("href"))
    }
    else if (key == -10 || key == 19) { // right or d
        // next
        $("#auto-next").trigger('click');
        $(location).attr('href', $("#next").attr("href"))
    }
    else if (key == 20){ // e
        deleteObjects();
    }
    else if (key == 24){ // i
        // info
        $('#info_modal').modal('toggle');
    }

});

// when window resize, rescale canvas
$(window).resize(function() {
    origin_width = $("#origin_image_width").val();
    new_width = $(document).width() * .8;
    new_height = new_width * scaleFactor;
    diff_width_ratio = new_width / origin_width;
    //console.log(new_width);
    //console.log(new_height);
    $("#image_width").val(new_width);
    $("#image_height").val(new_height);
    canvas.setWidth(new_width);
    canvas.setHeight(new_height);
    canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
        width: $("#canvas").width(),
        height: $("#canvas").height()
    });
    canvas.calcOffset();
    resizeRectangles(diff_width_ratio);
});

// delete unwanted objects (simple clicks on canvas creates unwanted objects)
setInterval(function(){
    for (var i = 0; i < canvas.getObjects().length; i++) {
        if($(".label-"+canvas.item(i).id+".label-w").val() < 10 || $(".label-"+canvas.item(i).id+".label-h").val() < 10) {
            if(!canvas.isDrawing){
                $(".label-"+canvas.item(i).id).remove();
                canvas.remove(canvas.item(i));
                counter -= 1;
                $('#labels-counter').val(counter);
            }
        }
    }
}, 1000);

//TODO issue with resizing large images
// origin_width = $("#origin_image_width").val();
// new_width = $(document).width() * .8;
// new_height = new_width * scaleFactor;
// diff_width_ratio = new_width / origin_width;
// //console.log(new_width);
// //console.log(new_height);
// $("#image_width").val(new_width);
// $("#image_height").val(new_height);
// canvas.setWidth(new_width);
// canvas.setHeight(new_height);
// canvas.setBackgroundImage(imageUrl, canvas.renderAll.bind(canvas), {
//     width: $("#canvas").width(),
//     height: $("#canvas").height()
// });
// canvas.calcOffset();
// resizeRectangles(diff_width_ratio);