const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = 1024
const HEIGHT = 768

let enemies = []
let obstacles = []
let city = []
let clouds = []
let posts = []
let cityPlaces = []
let gasStation
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
let myGradient
let foodImage
let waterImage
let steakImage
let gasStationImage
let fuelImage

let stopGas = false
let stopSleep = false
let chooseSleep = false
let chooseTheft = false
let gasItems = []
let gasPrice
let noMoney = false
let stopTheft = true

let radios = []
let selectedStation
let mouseX, mouseY

let time = 0
let hour = 9    
let minutes = 0
let clock = 0
let day = 1


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
    totalKm: '',
    fuelLeft: 36,
    speed: 80,
}

const player = {
    hungry: 2,
    thirst: 4,
    sleep: 4,
    money: 5,
    item: []
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

    let array = []
    for(let i = 0; i < 2; i++){
        array.push(generateItems(i))
    }
    console.log(array)
    player.item = array

    changeColorSky(hour)

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
    foodImage = new Image()
    foodImage.src = './assets/items/pera.png'
    waterImage = new Image()
    waterImage.src = './assets/items/water.png'
    steakImage = new Image()
    steakImage.src = './assets/items/steak.png'
    gasStationImage = new Image()
    gasStationImage.src = './assets/buildings/gas_station.png'
    fuelImage = new Image()
    fuelImage.src = './assets/items/fuel.png'
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

        if(gasStation !== undefined) {
            gasStation.x -= 8
            
            if(gasStation.x + 300 > car.x && gasStation.x + 292 < car.x){
                gasItems.push(generateGas())
                gasItems.push(generateItems())
                gasItems.push(generateItems())
                makeAChoice = true
            }
            
            if((gasStation.x + WIDTH / 2) < 0) {
                gasStation = {}
            }
        }

        clouds.forEach((cloud, i) => {
            if(cloud.x + cloud.w > -150) {
                cloud.x -= cloud.speed
            } else {
                clouds[i] = generateClouds()
            }
        })

        city.forEach((building, i) => {
            building.x -= 8
            
            if(building.x + 128 < WIDTH - 32) {
                city.slice(i, 1)
            }
        })

        if(city.length > 0) {
            console.log(minutes)
            if(city[0].x < 0 ) {
                cityPlaces.push(generateCityPlaces())
                cityPlaces.push(generateCityPlaces())
                cityPlaces.push(generateCityPlaces())
                
                makeAChoice = true
            }
        }

        posts.forEach((post, i) => {
            post.x -= 8
            if(post.x + 256 < 0) {
                posts[i] = generatePosts(4)
            }
        })
    
        time += 1 / 60
        clock += 1 / 60
        minutes += 1 / 180

        if(((minutes * 10).toFixed(1) % 8) === 0) {
            car.totalKm = parseInt(car.totalKm) + 1
            car.totalKm = addZeros(car.totalKm)
        }
        /**
         * TIME
         */
        if(Math.floor(minutes) === 6.0) {
            hour++
            car.fuelLeft--
            if(hour === 24) {
                hour = 0
                day++
            }
            changeColorSky(hour)
        }
    
        if(Math.floor(time) == timeOfChoices[0]) {
            //do something
            switch(/*Math.floor(Math.random() * 1)*/ 3) {
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
                case 2:
                    gasStation = generateGasStation()
                    time = 0
                    break
                case 3:
                    time++
                    for(let i = 0; i < Math.floor(Math.random() * 10 + 4); i++) {
                        city.push(generateBuildings(i))
                    }
                    time = 0
                    break
            }
        }

        if(hour % 8 === 0 && Math.floor(minutes * 10) === 0) {
            player.hungry -= 1/14
            player.sleep -= 1/14
        } else if (hour % 12 === 0 && Math.floor(minutes * 10) === 0) {
            player.thirst -= 1/14
        }

        /**
         * CHOICES
         */
    
        ctx.strokeRect(WIDTH - 342, HEIGHT - 182, 64, 64)
        ctx.strokeRect(WIDTH - 270, HEIGHT - 182, 64, 64)
        ctx.strokeRect(WIDTH - 198, HEIGHT - 182, 64, 64)
        ctx.strokeRect(WIDTH - 126, HEIGHT - 182, 64, 64)
    
        ctx.strokeRect(WIDTH - 342, HEIGHT - 108, 64, 64)
        ctx.strokeRect(WIDTH - 270, HEIGHT - 108, 64, 64)
        ctx.strokeRect(WIDTH - 198, HEIGHT - 108, 64, 64)
        ctx.strokeRect(WIDTH - 126, HEIGHT - 108, 64, 64)

        if( mouseX >= 690 && mouseX <= 754 && mouseY >= 597 && mouseY <= 658) {
            refreshPlayer(0)
            console.log('Food')
            player.hungry++
        } else if (mouseX >= 762 && mouseX <= 826 && mouseY >= 597 && mouseY <= 658) {
            refreshPlayer(1)
            console.log("Food2")
            player.hungry = 4
        } else if (mouseX >= 834 && mouseX <= 898 && mouseY >= 597 && mouseY <= 658) {
            refreshPlayer(2)
            console.log('Thirst')
            player.thirst = 4
        } else if (mouseX >= 907 && mouseX <= 969 && mouseY >= 597 && mouseY <= 658) {
            refreshPlayer(3)
            console.log('Outro')
        } else if( mouseX >= 690 && mouseX <= 754 && mouseY >= 669 && mouseY <= 733) {
            refreshPlayer(4)
            console.log('Another')
            player.hungry++
        } else if (mouseX >= 762 && mouseX <= 826 && mouseY >= 669 && mouseY <= 733) {
            refreshPlayer(5)
            console.log("Mais um")
            player.hungry = 4
        } else if (mouseX >= 834 && mouseX <= 898 && mouseY >= 669 && mouseY <= 733) {
            refreshPlayer(6)
            console.log('Other')
            player.thirst = 4
        } else if (mouseX >= 907 && mouseX <= 969 && mouseY >= 669 && mouseY <= 733) {
            refreshPlayer(7)
            console.log('Otro')
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
    if(stopGas) {
        gasStationBuy()
    } else {
        if(stopSleep) {
            sleepOrNot()
        } else {
            if(makeAChoice) {
                let option
                ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
                /**
                 * RIDE
                 */
                if(hikers.length > 0){
                    option = 'ride'
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
                /**
                 * GAS STATION
                 */
                if(gasStation !== undefined) {
                    option = 'gas'
                    ctx.fillText("Gostaria de comprar algo", WIDTH / 2 - 100, HEIGHT / 2 - 10)
                }

                if(city.length !== 0) {
                    option = 'city'
                    ctx.fillText("Gostaria de parar na cidade", WIDTH / 2 - 100, HEIGHT / 2 - 10)
                }
                
                ctx.fillStyle = "white"
                ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 + 25, 50, 30)
                ctx.fillRect(WIDTH / 2 + 50, HEIGHT / 2 + 25, 50, 30)
                ctx.fillStyle = "black"
                ctx.font = "20px Arial"
                ctx.fillText("Sim", WIDTH / 2 - 43, HEIGHT / 2 + 45)
                ctx.fillText("Não", WIDTH / 2 + 56, HEIGHT / 2 + 45)
        
                if(mouseX >= 471 && mouseX <= 520 && mouseY >= 418 && mouseY <= 447) {
                    if(option === 'ride'){
                        console.log('Yes')
                        car.places.push(hikers)
        
                        hikers = []
        
                        makeAChoice = false
                        mouseX = mouseY = -1
                    } else if(option === 'gas') {
                        minutes += .5
                        stopGas = true
                        mouseX = mouseY = -1
                    } else if(option === 'city') {
                        stopSleep = true
                        mouseX = mouseY = -1
                    }
                } else if (mouseX >= 570 && mouseX <= 619 && mouseY >= 418 && mouseY <= 448) {
                    if(option === 'ride'){
                        console.log('No')
                        hikers = []
        
                        makeAChoice = false
                        mouseX = mouseY = -1
                    }else if (option === 'gas') {
                        stopGas = false
                        mouseX = mouseY = -1
                    } else if(option === 'city') {
                        stopSleep = false
                        mouseX = mouseY = -1
                    }
                }
        
                requestAnimationFrame(makeChoices)
            } else {
                update()
            }
        }
    }
    
}

draw = () => {
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2)
    ctx.fillStyle = myGradient
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2)
    ctx.fillStyle = "green"
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 4)
    ctx.fillStyle = "black"
    ctx.fillRect(0, (HEIGHT / 2) + (HEIGHT / 4), WIDTH, HEIGHT / 4)

    ctx.drawImage(radioImage, WIDTH / 3, HEIGHT - (HEIGHT / 4))
    ctx.drawImage(speedometerImage, 0, HEIGHT - 256, 256, 256)
    
    //ctx.drawImage(sun, 50, 50, 128, 128)

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
                ctx.fillRect(signs.x + 12, signs.y, 8, 64)
                ctx.drawImage(leftSignImage, signs.x, signs.y, 32, 32)
                break
            case 1:
                ctx.fillRect(signs.x + 12, signs.y, 8, 64)
                ctx.drawImage(rightSignImage, signs.x, signs.y, 32, 32)
                break
            case 2:
                
                ctx.drawImage(limitSpeedSign, signs.x, signs.y, 32, 32)
                ctx.fillStyle = "black"
                ctx.font = "14px Arial"
                ctx.fillText("80", signs.x + 8, signs.y + 22)
                break
            case 3:
                ctx.fillRect(signs.x + 12, signs.y, 8, 64)
                ctx.drawImage(rotateSign, signs.x, signs.y, 32, 32)
                break
            case 4:
                ctx.fillRect(signs.x + 12, signs.y, 8, 64)
                //ctx.drawImage(greenSigne, signs.x, signs.y, 32, 32)
                ctx.drawImage(rotateSign, signs.x, signs.y, 32, 32)
                break
        }
    }

    city.forEach(building => {
        ctx.drawImage(building.image, building.x, building.y, building.w, building.h)
    })

    /**
     * GAS STATION
     */
    if(gasStation !== undefined) {
        ctx.drawImage(gasStationImage, gasStation.x - 128, gasStation.y - 256)
    }

    ctx.drawImage(carImage, car.x - 128, car.y - 128)

    if(signs !== {} && signs.type === 5) {
        ctx.fillStyle = "black"
        ctx.beginPath();
        ctx.arc(signs.x + 16, signs.y, 16, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = "brown"
        ctx.fillRect(signs.x + 12, signs.y, 8, 64)
    }

    /**
    * AVATARS
    */
    let avatar = new Image()
    avatar.src = './assets/avatars/1.jpg'
    ctx.drawImage(avatar, 10, 10, 64, 64)
    ctx.fillStyle = "red"
    ctx.fillRect(10, 74, 64, 16)
    ctx.fillRect(10, 92, 64, 16)
    ctx.fillRect(10, 110, 64, 16)
    ctx.fillStyle = "green"
    ctx.fillRect(10, 74, player.thirst * 16, 16)
    ctx.fillRect(10, 92, player.hungry * 16, 16)
    ctx.fillRect(10, 110, player.sleep * 16, 16)

    car.places.forEach((_, i) => {
        console.log((8 * (i + 1)))
        ctx.drawImage(avatar, ((64 * (i + 1)) + 10), 10, 64, 64)
        ctx.fillStyle = "red"
        ctx.fillRect(10, 74, 64, 16)
        ctx.fillRect(10, 92, 64, 16)
        ctx.fillRect(10, 110, 64, 16)
        ctx.fillStyle = "green"
        ctx.fillRect((64 * (i + 1)) + 10, 74, player.thirst * 16, 16)
        ctx.fillRect((64 * (i + 1)) + 10, 92, player.hungry * 16, 16)
        ctx.fillRect((64 * (i + 1)) + 10, 110, player.sleep * 16, 16)
    })

    /**
     * TEXT
     */
    ctx.fillStyle = "white"
    ctx.font = "16px Press Start 2P', cursive"
    ctx.fillText("PLACES", 256, HEIGHT - (HEIGHT / 5.5))
    ctx.font = "30px Arial"
    ctx.fillText(car.places.length + "/" + car.totalPlaces, 274, HEIGHT - (HEIGHT / 7))
    ctx.fillStyle = "white"
    ctx.font = "20px Arial"
    ctx.fillText(radios[selectedStation].station, WIDTH / 2 - 32, HEIGHT - 112)
    ctx.fillText(car.totalKm, 92, HEIGHT - (HEIGHT / 7))
    ctx.fillText(`F:${car.fuelLeft} h`, 92, HEIGHT - (HEIGHT / 6))
    ctx.font = "30px Arial"
    ctx.fillText(car.speed, 92, HEIGHT - (HEIGHT / 5))
    ctx.font = "20px Arial"
    ctx.fillText("km", 128, HEIGHT - (HEIGHT / 5))
    ctx.fillStyle = "white"
    ctx.fillText(Math.floor(hour) < 10 ? `0${Math.floor(hour)}:` : `${Math.floor(hour)}:`, WIDTH - 128, HEIGHT - 20)
    //ctx.fillText(Math.floor(minutes), 30, 20)
    ctx.fillText(Math.floor(minutes * 10) < 10 ? `0${Math.floor(minutes * 10)}` : Math.floor(minutes * 10), WIDTH - 88, HEIGHT - 20)
    //ctx.fillStyle = car.color
    //ctx.fillRect(car.x - (car.w / 2), car.y, car.w, car.h)

    hikers.forEach(hiker => {
        ctx.fillStyle = 'black'
        ctx.fillRect(hiker.x, hiker.y - 92, 64, 92)
    })

    /**
     * INVENTARIO
     */
    ctx.strokeStyle = "white"
    ctx.strokeRect(WIDTH - 352, HEIGHT - 190, 302, 189)
    if(player.item[0] !== undefined) {ctx.drawImage(player.item[0].image, WIDTH - 342, HEIGHT - 182, 64, 64)} else {ctx.strokeRect(WIDTH - 342, HEIGHT - 182, 64, 64)}
    if(player.item[1] !== undefined) {ctx.drawImage(player.item[1].image, WIDTH - 270, HEIGHT - 182, 64, 64)} else {ctx.strokeRect(WIDTH - 270, HEIGHT - 182, 64, 64)}
    if(player.item[2] !== undefined) {ctx.drawImage(player.item[2].image, WIDTH - 198, HEIGHT - 182, 64, 64)} else {ctx.strokeRect(WIDTH - 198, HEIGHT - 182, 64, 64)}
    if(player.item[3] !== undefined) {ctx.drawImage(player.item[3].image, WIDTH - 126, HEIGHT - 182, 64, 64)} else {ctx.strokeRect(WIDTH - 126, HEIGHT - 182, 64, 64)}


    if(player.item[4] !== undefined) {ctx.drawImage(player.item[4].image, WIDTH - 342, HEIGHT - 108, 64, 64)} else {ctx.strokeRect(WIDTH - 342, HEIGHT - 108, 64, 64)}
    if(player.item[5] !== undefined) {ctx.drawImage(player.item[5].image, WIDTH - 270, HEIGHT - 108, 64, 64)} else {ctx.strokeRect(WIDTH - 270, HEIGHT - 108, 64, 64)}
    if(player.item[6] !== undefined) {ctx.drawImage(player.item[6].image, WIDTH - 198, HEIGHT - 108, 64, 64)} else {ctx.strokeRect(WIDTH - 198, HEIGHT - 108, 64, 64)}
    if(player.item[7] !== undefined) {ctx.drawImage(player.item[7].image, WIDTH - 126, HEIGHT - 108, 64, 64)} else {ctx.strokeRect(WIDTH - 126, HEIGHT - 108, 64, 64)}
}

generateHiker = (surname = '', place = '') => {
    let choices = Math.random()
    let son = 0
    let item = {}
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
    if((Math.random() * 15) < (10 / day)) {
        item = generateItems()
    }
    return {
        x: WIDTH + (WIDTH / 2),
        y: HEIGHT / 2,
        name: names[Math.floor(Math.random() * names.length)],
        surname: surname !== '' ? surname : surnames[Math.floor(Math.random() * surnames.length)],
        place: place !== '' ? place : cities[Math.floor(Math.random() * cities.length)],
        thirst: 4,
        gender: Math.random > .5 ? 'F' : 'M',
        hungry: 4, 
        son: son,
        item: item
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
    let signs = [0, 1, 2, 3, 4, 5, 5, 5]
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

generateItems = (i) => {
    let image = new Image()
    let type = items[Math.floor(Math.random() * items.length)]
    let brand = Math.floor(Math.random() * 3)
    let price = []
    console.log(type)
    switch(type) {
        case 'food 1':
            price.push(1, 2)
            if(brand === 0){
                image.src = './assets/items/doritos.png'
            } else if ( brand === 1){
                image.src = './assets/items/apple.png'
            } else {
                image.src = './assets/items/chocolate.png'
            }
            break
        case 'food 2':
            price.push(3, 4, 5)
            if(brand === 0){
                image.src = './assets/items/steak.png'
            } else if ( brand === 1){
                image.src = './assets/items/pizza.png'
            } else {
                image.src = './assets/items/sushi.png'
            }
            break
        case 'bebidas':
            price.push(5)
            if(brand === 0){
                image.src = './assets/items/coffee.png'
            } else if ( brand === 1){
                image.src = './assets/items/hot_chocolate.png'
            } else {
                image.src = './assets/items/tea.png'
            }
            break
        case 'energetic':
            price.push(5, 6)
            if(brand === 0){
                image.src = './assets/items/monster.png'
            } else if ( brand === 1){
                image.src = './assets/items/red_bull.png'
            } else {
                image.src = './assets/items/demon.png'
            }
            break
        case 'watter':
            price.push(3, 4, 5, 6)
            if(brand === 0){
                image.src = './assets/items/water.png'
            } else if ( brand === 1){
                image.src = './assets/items/cup.png'
            } else {
                image.src = './assets/items/bottle.png'
            }
            break
        case 'soda':
            price.push(3, 4, 5)
            if(brand === 0){
                image.src = './assets/items/coke.png'
            } else if ( brand === 1){
                image.src = './assets/items/pepsi.png'
            } else {
                image.src = './assets/items/fanta.png'
            }
            break
        default:
            if(brand === 0){
                image.src = './assets/items/pera.png'
            } else if ( brand === 1){
                image.src = './assets/items/pera.png'
            } else {
                image.src = './assets/items/pera.png'
            }
            break
    }
    return {
        type: type,
        brand: brand,
        image: image,
        index: i,
        price: Math.floor(Math.random() * price.length)
    }
}

refreshPlayer = (i) => {    
    switch(player.item.type){
        case 'food 1':
            player.hungry++
            break
        case 'food 2':
            player.hungry = 4
            break
        case 'bebida':
            player.sleep++
            player.thirst++
            break
        case 'energetic':
            player.sleep = 4
            player.thisrt++
            break
        case 'watter':
            player.thirst = 4
            break
        case 'soda':
            player.thirst++
            player.hungry--
            break
    }
    
    console.log('aqui')
    player.item.splice(i, 1)
    player.item.sort()
}

generateGasStation = () => {
    return {
        x: WIDTH + (WIDTH / 2),
        y: HEIGHT / 2 - 64,
    }
}

generateGas = () => {
    return {
        price: (Math.floor(Math.random() * 3 + 1) + Math.floor(day * Math.random()))
    }
}

generateBuildings = (i) => {
    let image = new Image()
    if(Math.random > .5) {
        image.src = './assets/buildings/house1.jpg'
    } else {
        image.src = './assets/buildings/house2.jpg'
    }
    return {
        x: WIDTH + (WIDTH / 2) + (i * 160),
        y: HEIGHT / 2 - 256,
        w: 128,
        h: 256,
        image: image
    }
}

generateCityPlaces = () => {
    let danger = [1, 2, 3, 4]
    let dangerValue = danger[Math.floor(Math.random() * 4)]
    let max = dangerValue + 1
    let min = dangerValue - 1
    console.log(max, min)
    let qtdItems = Math.floor(Math.random() * max + min)
    console.log(qtdItems)
    return {
        name: places[Math.floor(Math.random() * places.length)],
        danger: dangerValue,
        qtdItems: qtdItems,
        items: []
    }
}
 
changeColorSky = (hour) => {
    myGradient = ctx.createLinearGradient(0, 0, 0, HEIGHT)
    colorsOfSky[hour].forEach((colors, i) => {
        myGradient.addColorStop(i / colorsOfSky[hour].length, colors)
    })
}

gasStationBuy = () => {
    if(!makeAChoice) {
        console.log(makeAChoice)
        stopGas = false
        makeAChoice = false
        update()
    } else {
        if(!noMoney) {
            ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
            if(gasItems[0] !== undefined) ctx.drawImage(fuelImage ,WIDTH / 2 - 220, HEIGHT / 2 - 65, 100, 100)
            if(gasItems[1] !== undefined) ctx.drawImage(gasItems[1].image ,WIDTH / 2 - 60, HEIGHT / 2 - 65, 100, 100)
            if(gasItems[2] !== undefined) ctx.drawImage(gasItems[2].image ,WIDTH / 2 + 120, HEIGHT / 2 - 65, 100, 100)
            ctx.fillStyle = "black"
            if(gasItems[0] !== undefined) ctx.fillText(gasItems[0].price, WIDTH / 2 - 185, HEIGHT / 2 + 60)
            if(gasItems[1] !== undefined) ctx.fillText(gasItems[1].price, WIDTH / 2 - 10, HEIGHT / 2 + 60)
            if(gasItems[2] !== undefined) ctx.fillText(gasItems[2].price, WIDTH / 2 + 170, HEIGHT / 2 + 60)
    
            ctx.fillStyle = "white"
            ctx.fillRect(WIDTH / 2 - 50, HEIGHT / 2 + 100, 100, 50)
            ctx.fillStyle = "black"
            ctx.fillText("Voltar", WIDTH / 2 - 25, HEIGHT / 2 + 125)
    
            if(mouseX >= WIDTH / 2 - 220 && mouseX <= WIDTH / 2 - 120 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
                let newPrice = player.money - gasItems[0].price
                if(newPrice < 0) {
                    
                } else {
                    player.money = newPrice
                    car.fuelLeft += Math.floor(Math.random() - 16 - day)
                    gasItems[0] = undefined
                }
                console.log('buy gas')
            } else if(mouseX >= WIDTH / 2 - 60 && mouseX <= WIDTH / 2 + 40 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
                let newPrice = player.money - gasItems[1].price
                if(newPrice < 0) {
                    
                } else {
                    player.money = newPrice
                    let playerItemCopia = player.item
                    playerItemCopia.push(gasItems[1])
                    player.item = playerItemCopia
                    gasItems[1] = undefined
                }
                console.log('item 1')
            }
            else if(mouseX >= WIDTH / 2 + 120 && mouseX <= WIDTH / 2 + 220 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
                let newPrice = player.money - gasItems[2].price
                if(newPrice < 0) {
                    
                } else {
                    player.money = newPrice
                    let playerItemCopia = player.item
                    playerItemCopia.push(gasItems[2])
                    player.item = playerItemCopia
                    gasItems[2] = undefined
                }
                console.log('item 2')
            } else if(mouseX >= 470 && mouseX <= 570 && mouseY >= 493 && mouseY <= 543) {
                console.log('aqui')
                makeAChoice = false
            }

            console.log(player.item)

            mouseX = mouseY = -1
    
            requestAnimationFrame(gasStationBuy)
        } else{
            if(noMoney) messageBox("Você não tem dinheiro suficiente")
        } 
    }
}

sleepOrNot = () => {
    if(!makeAChoice) {
        stopSleep = false
        makeAChoice = false
        update()
    } else {
        if(chooseSleep) {
            makeSleep()
        } else {
            if(chooseTheft) {
                makeTheft()
            } else {
                ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
                ctx.fillText("O que fazer durante a noite", WIDTH / 2 - 100, HEIGHT / 2 - 10)
        
                ctx.fillStyle = "white"
                ctx.fillRect(WIDTH / 2 - 100, HEIGHT / 2 + 25, 100, 30)
                ctx.fillRect(WIDTH / 2 + 50, HEIGHT / 2 + 25, 100, 30)
                ctx.fillStyle = "black"
                ctx.font = "20px Arial"
                ctx.fillText("Dormir", WIDTH / 2 - 90, HEIGHT / 2 + 45)
                ctx.fillText("Saquear", WIDTH / 2 + 56, HEIGHT / 2 + 45)

                if(mouseX >= 420 && mouseX <= 520 && mouseY >= 418 && mouseY <= 448) {
                    chooseSleep = true
                    console.log('make sleep')
                } else if (mouseX >= 570 && mouseX <= 670 && mouseY >= 418 && mouseY <= 448) {
                    stopTheft = false
                    chooseTheft = true
                }
                
                mouseX = mouseY = -1

                requestAnimationFrame(sleepOrNot) 
            }
        }
    }
}

makeSleep = () => {
    ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
    ctx.fillStyle = "white"
    ctx.fillRect(WIDTH / 2 - 220, HEIGHT / 2 - 65, 100, 100)
    ctx.fillRect(WIDTH / 2 - 60, HEIGHT / 2 - 65, 100, 100)
    ctx.fillRect(WIDTH / 2 + 120, HEIGHT / 2 - 65, 100, 100)
    ctx.fillStyle = "black"
    ctx.fillText("2 Horas", WIDTH / 2 - 200, HEIGHT / 2 + 60)
    ctx.fillText("5 Horas", WIDTH / 2 - 50, HEIGHT / 2 + 60)
    ctx.fillText("8 Horas", WIDTH / 2 + 150, HEIGHT / 2 + 60)

    if(mouseX >= WIDTH / 2 - 220 && mouseX <= WIDTH / 2 - 120 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
        player.sleep++
        minutes += 12.0
        chooseSleep = false
        makeAChoice = false
    } else if(mouseX >= WIDTH / 2 - 60 && mouseX <= WIDTH / 2 + 40 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
        player.sleep += 2
        minutes += 30.0
        chooseSleep = false
        makeAChoice = false
    } else if(mouseX >= WIDTH / 2 + 120 && mouseX <= WIDTH / 2 + 220 && mouseY >= HEIGHT / 2 - 65 && mouseY <= HEIGHT / 2 + 35) {
        player.sleep = 4
        minutes += 48.0
        chooseSleep = false
        makeAChoice = false
    }
    mouseX = mouseY = -1

    requestAnimationFrame(makeSleep)
}

makeTheft = () => {
    if(stopTheft) {
        stopSleep = false
        makeAChoice = false
        update()
    } else {
        ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
        ctx.fillStyle = "white"
        ctx.fillRect(WIDTH / 2 - 220, HEIGHT / 2 - 65, 100, 100)
        ctx.fillRect(WIDTH / 2 - 60, HEIGHT / 2 - 65, 100, 100)
        ctx.fillRect(WIDTH / 2 + 120, HEIGHT / 2 - 65, 100, 100)
        ctx.fillStyle = "black"
        ctx.fillText(cityPlaces[0].name, WIDTH / 2 - 200, HEIGHT / 2 + 60)
        ctx.fillText(cityPlaces[1].name, WIDTH / 2 - 50, HEIGHT / 2 + 60)
        ctx.fillText(cityPlaces[2].name, WIDTH / 2 + 150, HEIGHT / 2 + 60)
    
        let index = player.item.length - 1

        if(mouseX >= 300 && mouseX <= 400 && mouseY >= 330 && mouseY <= 430) {
            console.log(cityPlaces[0].qtdItems)
            let items = []
            for(let i = 0; i < cityPlaces[0].qtdItems; i++) {
                if(Math.random() > .85){
                    let image = new Image()
                    image.src = './assets/items/fuel.png'
                    let price = [5, 6]
                    let gas = {
                        type: 'gas',
                        brand: 1,
                        image: image,
                        index: index + items.length,
                        price: Math.floor(Math.random() * price.length)
                    }
                    items.push(gas)
                } else {
                    items.push(generateItems(index + items.length))
                }
            }
            player.item.concat(items)
            console.log(player)
            hour += 3
            chooseTheft = false
            makeAChoice = false
            stopTheft = true
        } else if(mouseX >= 460 && mouseX <= 560 && mouseY >= 330 && mouseY <= 430) {
            console.log(2)
            let items = []
            for(let i = 0; i < cityPlaces[1].qtdItems; i++) {
                if(Math.random() > .85){
                    let image = new Image()
                    image.src = './assets/items/fuel.png'
                    let price = [5, 6]
                    let gas = {
                        type: 'gas',
                        brand: 1,
                        image: image,
                        index: index + items.length,
                        price: Math.floor(Math.random() * price.length)
                    }
                    items.push(gas)
                } else {
                    items.push(generateItems(index + items.length))
                }
            }
            player.item = player.item.concat(items)
            console.log(player)
            hour += 3
            chooseTheft = false
            makeAChoice = false
            stopTheft = true
        } else if(mouseX >= 640 && mouseX <= 740 && mouseY >= 330 && mouseY <= 430) {
            console.log(3)
            let items = []
            for(let i = 0; i < cityPlaces[2].qtdItems; i++) {
                if(Math.random() > .85){
                    let image = new Image()
                    image.src = './assets/items/fuel.png'
                    let price = [5, 6]
                    let gas = {
                        type: 'gas',
                        brand: 1,
                        image: image,
                        index: index + items.length,
                        price: Math.floor(Math.random() * price.length)
                    }
                    items.push(gas)
                } else {
                    items.push(generateItems(index + items.length))
                }
            }
            player.item.concat(items)
            console.log(player)
            hour += 3
            chooseTheft = false
            makeAChoice = false
            stopTheft = true
        }
        mouseX = mouseY = -1
    
        requestAnimationFrame(makeTheft)
    }
}

messageBox = (message) => {
    ctx.drawImage(dialogBoxImage, WIDTH / 2 - 260, HEIGHT / 2 - 100, 520, 200)
    ctx.fillText(message, WIDTH / 2 - (message.length / 2), HEIGHT / 2 - 10)
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

addZeros = (text) => {
    let r = "" + text;
    while (r.length < 7) {
        r = "0" + r;
    }
    return r;
}

init()