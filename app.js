/*Resources

1. https://mathieularose.com/decoding-captchas/

2. http://aheckmann.github.io/gm/docs.html

*/

//importing required packages
const fs = require('fs');
const gm = require('gm').subClass({ imageMagick: true });
const tesseract = require('node-tesseract-ocr');

//my variables
const fileName = '4P72J' // <--- test for different image files
const imagePath = './images/' + fileName + '.jpg'
const savePath = './modified-images/output.png'

//this function will remove noise from captcha
let modifyImage = () => {
    return new Promise((resolve, reject) => {
        gm(imagePath)

            //***** CHANGE BELOW THIS LINE *******/ 
            .whiteThreshold("12%%")
            .threshold(50, true)
            .paint(1)
            //***** CHANGE ABOVE THIS LINE *******/

            .write(savePath, err => {
                if (!err) {
                    console.log('Image successfully modified');
                    resolve()
                }
                else {
                    console.log('Failed to modify: ' + err)
                    reject()
                }
            });

    })
}

//this function will read text from captcha
let readImage = () => {
    return new Promise((resolve, reject) => {

        const config = {
            oem: 0,
            psm: 8,
        }

        tesseract
            .recognize(savePath, config)
            .then(code => {
                console.log('Real Value: ' + fileName)
                console.log('Calc Value: ' + code)
                resolve(code);
            })
            .catch(err => {
                console.log('Failed to read: ', err)
                reject();
            })
    })
}


//function calling will start from here
modifyImage()
    .then(() => {
        return readImage()
    })
    .catch(err => {
        console.log(err)
    })