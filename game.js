const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = 1024
const HEIGHT = 768

let enemies = []
let obstacles = []
let clouds = []
let posts = []
let carImage
let radioImage
let speedometerImage
let dialogBoxImage
let leftSignImage
let rightSignImage
let limitSpeedSign
let rotateSign
let greenSigne
let cloudImage1
let cloudImage2
let sun
let postImage

let radios = []
let selectedStation
let mouseX, mouseY
let time = 0
let clock = 0
let hikers = []
let pause = false
let makeAChoice = false
let signs = {}

const car = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    w: 128,
    h: 64,
    color: 'white',
    places: [],
    totalPlaces: 4,
    totalKm: ''
}

init = () => {
    if (document.attachEvent) document.attachEvent('onclick', handler);
    else document.addEventListener('click', handler);
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT

    preload()
    for(let i = 0; i <= 5; i++) {
        radios.push(generateRadios())
    }

    for(let i = 0; i < 5; i++) {
        clouds.push(generateClouds())
    }

    for(let i = 0; i < 5; i++) {
        posts.push(generatePosts(i))
    }

    selectedStation = 0
    car.totalKm = generateKm()
    //createMap()
    //changeWeather()
    update()
}

preload = () => {
    carImage = new Image()
    carImage.src = './assets/cars/car1.png'
    radioImage = new Image()
    radioImage.src = './assets/radios/radio.png'
    speedometerImage = new Image()
    speedometerImage.src = './assets/speedometer.png'
    dialogBoxImage = new Image()
    dialogBoxImage.src = './assets/dialogBox.png'
    leftSignImage = new Image()
    leftSignImage.src = './assets/sign/left.png'
    rightSignImage = new Image()
    rightSignImage.src = './assets/sign/right.png'
    limitSpeedSign = new Image()
    limitSpeedSign.src = './assets/sign/limite.png'
    rotateSign = new Image()
    rotateSign.src = './assets/sign/rotatoria.png'
    greenSigne = new Image()
    greenSigne.src = './assets/sign/greenSigns.png'
    cloudImage1 = new Image()
    cloudImage1.src = './assets/clouds/1.png'
    cloudImage2 = new Image()
    cloudImage2.src = './assets/clouds/2.png'
    sun = new Image()
    sun.src = './assets/sun.png'
    postImage = new Image()
    postImage.src = './assets/posts.png'
}

update = () => {
    if(!pause && !makeAChoice){
        draw()
        //precisa criar uma carona
        //um ou dois
    
        if(mouseX >= 367 && mouseX <= 394) {
            if(mouseY >= 622 && mouseY <= 644){
                selectedStation = 0
            } else if(mouseY >= 649 && mouseY <= 669) {
                selectedStation = 1
            } else if(mouseY >= 674 && mouseY <= 694) {
                selectedStation = 2
            }
        } else if(mouseX >= 624 && mouseX <= 651){
            if(mouseY >= 622 && mouseY <= 644){
                selectedStation = 3
            } else if(mouseY >= 649 && mouseY <= 669) {
                selectedStation = 4
            } else if(mouseY >= 674 && mouseY <= 694) {
                selectedStation = 5
            }
        }
        if(mouseY >= 707 && mouseY <= 719) {
            if(mouseX => 403 && mouseX <= 458) {
                selectedStation -= selectedStation !== 0 ? 1 : -5
                radios[selectedStation]
            } else if(mouseX => 562 && mouseX <= 618) {
                selectedStation += selectedStation !== 6 ? 1 : -5
                radios[selectedStation]
            }
        }
    
        hikers.forEach(hiker => {
            hiker.x -= 8
            if(hiker.x < WIDTH / 2) {
                makeAChoice = true
            }
        })

        if(signs.x > 0) {
            signs.x -= 8
        } else {
            signs = {}
        }

        clouds.forEach((cloud, i) => {
            if(cloud.x + cloud.w > -150) {
                cloud.x -= cloud.speed
            } else {
                clouds[i] = generateClouds()
            }
        })

        posts.forEach((post, i) => {
            post.x -= 8
            if(post.x + 256 < 0) {
                posts[i] = generatePosts(4)
            }
        })
    
        time += 1 / 60
        clock += 1 / 60
    
        if(Math.floor(time) == timeOfChoices[0]) {
            //do something
            switch(/*Math.floor(Math.random() * 1)*/ 1) {
                case 0:
                    hikers.push(generateHiker())
                    for(let i = 0; i < hikers[0].son; i++) {
                        hikers.push(generateHiker(hikers[0].surname, hikers[0].place))
                    }
                    console.log(hikers)
                    time = 0
                    break
                case 1:
                    signs = generateSign()
                    time = 0
                    break
            }
        }
    
        mouseX = mouseY = -1
    
        requestAnimationFrame(update)
    } else {
        if(makeAChoice){
            makeChoices()
        } else {
            console.log('Pause')
        }
    }
}

makeChoices = () => {
    if(makeAChoice) {
        ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
        if(hikers.length > 0){
            ctx.fillStyle = "white"
            ctx.fillRect(WIDTH / 2 - 220, HEIGHT / 2 - 65, 100, 120)
            ctx.fillText(hikers[0].name, WIDTH / 2 - 100, HEIGHT / 2 - 45)
            ctx.fillStyle = "white"
            ctx.font = "20px Arial"
            if(hikers[0].son === 0) {
                ctx.fillText(askPhrases[Math.floor(Math.random() * askPhrases.length)], WIDTH / 2 - 100, HEIGHT / 2 - 10)
            } else {
                if(hikers[0].son === 1) {
                    ctx.fillText(askPhrasesSon[Math.floor(Math.random() * askPhrasesSon.length)], WIDTH / 2 - 100, HEIGHT / 2 - 10)
                } else {
                    ctx.fillText(askPhrasesSons[Math.floor(Math.random() * askPhrasesSons.length)], WIDTH / 2 - 100, HEIGHT / 2 - 10)
                }
            }
            ctx.fillText(`${hikers[0].place}?`, WIDTH / 2 - 100, HEIGHT / 2 + 15)
        }
        ctx.fillStyle = "white"
        ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 + 25, 50, 30)
        ctx.fillRect(WIDTH / 2 + 50, HEIGHT / 2 + 25, 50, 30)
        ctx.fillStyle = "black"
        ctx.font = "20px Arial"
        ctx.fillText("Sim", WIDTH / 2 - 43, HEIGHT / 2 + 45)
        ctx.fillText("Não", WIDTH / 2 + 56, HEIGHT / 2 + 45)

        if(mouseX >= 471 && mouseX <= 520 && mouseY >= 418 && mouseY <= 447) {
            console.log('Yes')
            car.places.push(hikers)

            hikers = []

            makeAChoice = false
            mouseX = mouseY = -1
        } else if (mouseX >= 570 && mouseX <= 619 && mouseY >= 418 && mouseY <= 448) {
            console.log('No')
            hikers = []

            makeAChoice = false
            mouseX = mouseY = -1
        }

        requestAnimationFrame(makeChoices)
    } else {
        update()
    }
}

draw = () => {
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2)
    ctx.fillStyle = "green"
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 4)
    ctx.fillStyle = "black"
    ctx.fillRect(0, (HEIGHT / 2) + (HEIGHT / 4), WIDTH, HEIGHT / 4)

    ctx.drawImage(radioImage, WIDTH / 3, HEIGHT - (HEIGHT / 4))
    ctx.drawImage(speedometerImage, 0, HEIGHT - 256, 256, 256)
    
    ctx.drawImage(sun, 50, 50, 128, 128)

    /**
     * CLOUDS
     */
    clouds.forEach(cloud => {
        if(cloud.types === 1) {
            ctx.drawImage(cloudImage1, cloud.x, cloud.y)
        } else {
            ctx.drawImage(cloudImage2, cloud.x, cloud.y)
        }
    })

    /**
     * POSTS
     
    ctx.drawImage(postImage, 0, HEIGHT / 2 - 124)
    ctx.drawImage(postImage, 256, HEIGHT / 2 - 124)
    ctx.drawImage(postImage, 512, HEIGHT / 2 - 124)
    ctx.drawImage(postImage, 768, HEIGHT / 2 - 124)
    */
    posts.forEach(post => {
        ctx.drawImage(postImage, post.x, post.y)
    })
    

    /**
     * Signs 
     */
    if(signs !== {}){
        ctx.fillStyle = "brown"
        ctx.fillRect(signs.x + 12, signs.y, 8, 64)
        switch(signs.type) {
            case 0:
                ctx.drawImage(leftSignImage, signs.x, signs.y, 32, 32)
                break
            case 1:
                ctx.drawImage(rightSignImage, signs.x, signs.y, 32, 32)
                break
            case 2:
                ctx.drawImage(limitSpeedSign, signs.x, signs.y, 32, 32)
                break
            case 3:
                ctx.drawImage(rotateSign, signs.x, signs.y, 32, 32)
                break
            case 4:
                //ctx.drawImage(greenSigne, signs.x, signs.y, 32, 32)
                ctx.drawImage(rotateSign, signs.x, signs.y, 32, 32)
                break
        }
    }

    ctx.drawImage(carImage, car.x - 128, car.y - 128)

    /**
     * FONTS
     */
    ctx.fillStyle = "white"
    ctx.font = "16px Press Start 2P', cursive"
    ctx.fillText("PLACES", 266, HEIGHT - (HEIGHT / 5.5))
    ctx.font = "30px Arial"
    ctx.fillText(car.places.length + "/" + car.totalPlaces, 274, HEIGHT - (HEIGHT / 7))
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.fillText(radios[selectedStation].station, WIDTH / 2 - 32, HEIGHT - 112)
    ctx.fillText(car.totalKm, 92, HEIGHT - (HEIGHT / 7))
    ctx.fillStyle = "black"
    ctx.fillText(Math.floor(clock), 10, 20)
    //ctx.fillStyle = car.color
    //ctx.fillRect(car.x - (car.w / 2), car.y, car.w, car.h)

    hikers.forEach(hiker => {
        ctx.fillStyle = 'black'
        ctx.fillRect(hiker.x, hiker.y - 92, 64, 92)
    })
}

generateHiker = (surname = '', place = '') => {
    let choices = Math.random()
    let son = 0
    if(choices > .8) {
        if(choices > .95) {
            if(choices > .98) { son = Math.floor(Math.random() * 4)}
            else { son = 2 }
        } else {
            son = 1
        }
    } else {
        son = 0
    }
    return {
        x: WIDTH + (WIDTH / 2),
        y: HEIGHT / 2,
        name: names[Math.floor(Math.random() * names.length)],
        surname: surname !== '' ? surname : surnames[Math.floor(Math.random() * surnames.length)],
        place: place !== '' ? place : cities[Math.floor(Math.random() * cities.length)],
        son: son
    }
}

generateRadios = () => {
    let decimal = [1, 3, 5, 7, 9]
    let integer = 88 + Math.floor(Math.random() * 19)
    return {
        station: `${integer}.${decimal[Math.floor(Math.random() * decimal.length)]}`,
        theme: 'Music',
        host: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`
    }
}

generateKm = () => {
    let digits = [
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 3),
        Math.floor(Math.random() * 5),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
        Math.floor(Math.random() * 9),
    ]

    return digits.join('')
}

generateSign = () => {
    let signs = [0, 1, 2, 3, 4]
    return {
        x: WIDTH + (WIDTH / 2),
        y: HEIGHT / 2 - 64,
        type: signs[Math.floor(Math.random() * signs.length)]
    }
}

generateClouds = () => {
    let types = [0, 1]
    return {
        x: WIDTH + 100,
        y: Math.floor(Math.random() * (HEIGHT / 2 - 200)),
        w: 150,
        h: 76,
        speed: Math.floor(Math.random() * 6 + 2),
        types: Math.floor(Math.random() * types.length)
    }
}

generatePosts = (i) => {
    return {
        x: i * 256, 
        y: HEIGHT / 2 - 124,    
    }
}

handler = (e) => {
    e = e || window.event;

    mouseX = pageX = e.pageX;
    mouseY = pageY = e.pageY;

    // IE 8
    if (pageX === undefined) {
        mouseX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        mouseY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }

    console.log(mouseX, mouseY);
}

init()