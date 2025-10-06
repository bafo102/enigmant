const inputWheel = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];



const rotorThreeTest = {
    plates: ['01', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '09', '08', '07', '06', '05', '04', '03-notch', '02'],
    leftMetalContacts: [2, 20, 19, 7, 17, 14, 12, 0, 4, 11, 10, 6, 8, 24, 3, 9, 15, 1, 5, 25, 22, 16, 21, 13, 23, 18], 
    rightMetalContacts: [7, 21, 3, 19, 1, 24, 22, 6, 11, 14, 4, 13, 0, 25, 18, 9, 20, 23, 12, 15, 10, 8, 16, 17, 2, 5]
};

const rotorOneDefault = {
    plates: ['01', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11-notch', '10', '09', '08', '07', '06', '05', '04', '03', '02'],
    leftMetalContacts: [5, 15, 10, 12, 6, 17, 2, 18, 21, 9, 3, 20, 22, 0, 8, 23, 19, 4, 14, 16, 24, 1, 7, 13, 25, 11], 
    rightMetalContacts: [11, 23, 5, 19, 13, 22, 1, 12, 21, 16, 18, 4, 14, 9, 25, 0, 3, 8, 17, 6, 10, 24, 2, 7, 20, 15]
};

const rotorTwoDefault = {
    plates: ['01', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17', '16', '15-notch', '14', '13', '12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02'],
    leftMetalContacts: [3, 16, 1, 2, 20, 13, 12, 22, 17, 0, 15, 23, 9, 6, 18, 8, 24, 4, 5, 10, 7, 19, 25, 21, 14, 11], 
    rightMetalContacts: [21, 0, 25, 2, 13, 4, 6, 19, 15, 3, 12, 9, 8, 1, 16, 11, 22, 23, 5, 18, 10, 17, 14, 24, 20, 7]
};



const reflector = [24, 12, 6, 9, 22, 14, 2, 15, 21, 3, 19, 20, 1, 17, 5, 7, 23, 13, 25, 10, 11, 8, 4, 16, 0, 18];

const rotorFiveDefault = {
    plates: ['01', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17-notch', '16', '15', '14', '13', '12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02'],
    leftMetalContacts: [18, 10, 21, 15, 8, 20, 22, 3, 24, 13, 1, 23, 0, 6, 14, 16, 17, 7, 9, 11, 5, 25, 2, 12, 19, 4], 
    rightMetalContacts: [21, 10, 2, 6, 7, 24, 0, 18, 14, 25, 1, 13, 20, 4, 5, 17, 8, 9, 23, 15, 12, 11, 3, 16, 19, 22]
};

const rotorFourDefault = {
    plates: ['01', '26', '25', '24', '23', '22', '21-notch', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '09', '08', '07', '06', '05', '04', '03', '02'],
    leftMetalContacts: [22, 13, 2, 1, 3, 10, 14, 21, 4, 7, 19, 12, 20, 9, 24, 11, 18, 6, 8, 15, 16, 17, 5, 23, 25, 0], 
    rightMetalContacts: [15, 9, 21, 1, 25, 13, 10, 2, 22, 14, 0, 16, 24, 20, 6, 12, 3, 7, 4, 18, 8, 11, 23, 5, 17, 19]
};

const rotorThreeDefault = {
    plates: ['01', '26', '25', '24', '23', '22', '21', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '09', '08', '07', '06', '05', '04', '03-notch', '02'],
    leftMetalContacts: [2, 20, 19, 7, 17, 14, 12, 0, 4, 11, 10, 6, 8, 24, 3, 9, 15, 1, 5, 25, 22, 16, 21, 13, 23, 18], 
    rightMetalContacts: [7, 21, 3, 19, 1, 24, 22, 6, 11, 14, 4, 13, 0, 25, 18, 9, 20, 23, 12, 15, 10, 8, 16, 17, 2, 5]
};

// key pressed:  Q
// script.js:733 key after plugboard first trip:  Q
// script.js:737 inputWheelContactFirstIndex:  16

// script.js:742 rightContactRightRotorFirstValue:  20
// script.js:743 leftContactRightRotorFirstIndex:  1

// script.js:748 rightContactMidRotorFirstValue:  9
// script.js:749 leftContactMidRotorFirstIndex:  13

// script.js:754 rightContactLeftRotorFirstValue:  4
// script.js:755 leftContactLeftRotorFirstIndex:  25

// script.js:759 reflectorContactOutcome:  18

// script.js:764 leftContactLeftRotorSecondValue:  9
// script.js:765 rightContactLeftRotorSecondIndex:  17

// script.js:770 leftContactMidRotorSecondValue:  6
// script.js:771 rightContactMidRotorSecondIndex:  14

// script.js:776 leftContactRightRotorSecondValue:  3
// script.js:777 rightContactRightRotorSecondIndex:  16

// script.js:781 key value going in the inputWheel:  Q
// script.js:786 key after plugboard second trip:  Q
