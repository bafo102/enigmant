let rotorTray = ['0', '1', '2', '3', '4', '5'];
let rotorInUse = ['0', '-', '-', '-']
let rotorLabels = ['0', 'I', 'II', 'III', 'IV', 'V'];
const label_1 = document.querySelector("#label-1");
const label_2 = document.querySelector("#label-2");
const label_3 = document.querySelector("#label-3");
const label_4 = document.querySelector("#label-4");
const label_5 = document.querySelector("#label-5");
const label_6 = document.querySelector("#label-6");
const label_7 = document.querySelector("#label-7");
const label_8 = document.querySelector("#label-8");
const keys = document.querySelectorAll(".key");
let targetKey = '';

// TARGET KEY
function getTargetKey(event) {
    clickedKey = event.target;
    // console.log('clickedKey: ',clickedKey);
    targetKey = clickedKey.id[clickedKey.id.length - 1];
    // console.log(targetKey);
}

keys.forEach(key => {key.addEventListener("mousedown", getTargetKey)});

// PLAY SOUND
function playSound() {
    pressSound = new Audio(`sound/press-${targetKey}.mp3`);
    pressSound.play();
    // console.log('audio played')
}

keys.forEach(key => {key.addEventListener("mousedown", playSound)});

// initialize and disable left tray
$( "#rotor-tray .rotor-holder" ).droppable();
$( "#rotor-tray .rotor-holder" ).droppable("disable");


$( function() {
    $( ".rotor" ).draggable({
        zIndex: 100,
        // revert: "invalid"
        revert: function(dropped) {
            return !dropped; // Revert if not dropped
        },
        revertDuration: 100, // Duration in milliseconds

        // function to make empty holder droppable again
        stop: updateHolderStatus
    });

    $( ".rotor-holder" ).droppable({
        drop: function( event, ui ) {
            // actually move the rotor inside the rotor-holder
            $( this ).append(ui.draggable);

            // make only in-use rotor to be spinnable
            document.querySelectorAll('#rotor-in-use .rotor-holder .rotor').forEach(rotor => {
                rotor.addEventListener('wheel', spinRotor);
            });
            document.querySelectorAll('#rotor-tray .rotor-holder .rotor').forEach(rotor => {
                rotor.removeEventListener('wheel', spinRotor);
            });

            // play sound
            if ($(this).parent().attr('id') == "rotor-in-use-holder") {
                dropInUseSound = new Audio(`sound/drop-in-use.mp3`);
                dropInUseSound.play();
            } else {
                dropInTraySound = new Audio(`sound/drop-in-tray.mp3`);
                dropInTraySound.play();
            }
            // disable busy holder
            if ($(this).children.length > 0) {
                $(this).droppable("disable");
            }
            
            // position the rotor to fit the rotor-holder
            ui.draggable.position({
                my: "left top",
                at: "left top",
                of: $(this)
            }),
            updateRotorLabel();

            // show readiness of rotors in use
            if (rotorInUse[1] != "-" && rotorInUse[2] != "-" && rotorInUse[3] != "-") {
                document.querySelector("#rotor-label-right").classList.add("ready");
            } else {
                document.querySelector("#rotor-label-right").classList.remove("ready");
            }
        }
    });
} );

function updateHolderStatus() {
    document.querySelectorAll(".rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            $( `#${holder.id}` ).droppable("enable");
        }
    });
}

function updateRotorLabel() {
    // reset orders
    rotorTray = ['0'];
    rotorInUse = ['0'];
    // check rotor and update order
    document.querySelectorAll("#rotor-tray .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            rotorTray.push("-");
        } else {
            rotorTray.push(holder.firstElementChild.id[holder.firstElementChild.id.length - 1]);
        }
    });

    document.querySelectorAll("#rotor-in-use .rotor-holder").forEach(holder => {
        if (holder.children.length == 0) {
            rotorInUse.push("-");
        } else {
            rotorInUse.push(holder.firstElementChild.id[holder.firstElementChild.id.length - 1]);
        }
    });

    console.log('rotorTray is: ', rotorTray);
    console.log('rotorInUse is: ', rotorInUse);

    // update labels
    label_1.textContent = rotorTray[1] == '-' ? '-' : rotorLabels[Number(rotorTray[1])];
    label_2.textContent = rotorTray[2] == '-' ? '-' : rotorLabels[Number(rotorTray[2])];
    label_3.textContent = rotorTray[3] == '-' ? '-' : rotorLabels[Number(rotorTray[3])];
    label_4.textContent = rotorTray[4] == '-' ? '-' : rotorLabels[Number(rotorTray[4])];
    label_5.textContent = rotorTray[5] == '-' ? '-' : rotorLabels[Number(rotorTray[5])];

    label_6.textContent = rotorInUse[1] == '-' ? '-' : rotorLabels[Number(rotorInUse[1])];
    label_7.textContent = rotorInUse[2] == '-' ? '-' : rotorLabels[Number(rotorInUse[2])];
    label_8.textContent = rotorInUse[3] == '-' ? '-' : rotorLabels[Number(rotorInUse[3])];
}
    
function spinRotor(event) {
    // rotor
    rotorTarget = event.target.id;
    if (event.target.className.includes('plate')) {
        rotorTarget = event.target.parentNode.parentNode.id;
    }

    // Prevent default scrolling
    event.preventDefault(); 
    
    // Each notch can be considered as an event
    mouseNotchCount = 0;
    degreeToRotate = 0;

    mouseNotchCount += Math.sign(event.deltaY);
    degreeToRotate = mouseNotchCount * 13.846;

    // play sound
    ringClickSound = new Audio(`sound/click.mp3`);
    ringClickSound.play();

    // Update the rotation for each box
    plates = document.querySelectorAll(`#${rotorTarget} .axis .plate`);
    plates.forEach(plate => {
        plateCurrentDeg = plate.getAttribute('style').match(/rotateX\(([-+]?\d*\.?\d+)deg\)/)[1];
        plate.style.transform = `rotateX(${degreeToRotate + Number(plateCurrentDeg)}deg) translateZ(10.83vh)` ;
    });

    degreeToRotate = 0;
    mouseNotchCount = 0;
};



