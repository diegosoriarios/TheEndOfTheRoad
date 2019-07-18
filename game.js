const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = 1024
const HEIGHT = 768

let enemies = []
let obstacles = []
let carImage
let radioImage
let speedometerImage

const car = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    w: 128,
    h: 64,
    color: 'white',
    places: [],
    totalPlaces: 4
}

init = () => {
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT

    preload()
    //createMap()
    //changeWeather()
    update()
}

preload = () => {
    carImage = new Image()
    carImage.src = './assets/cars/car1.png'
    radioImage = new Image()
    radioImage.src = './assets/radios/radio1.png'
    speedometerImage = new Image()
    speedometerImage.src = './assets/speedometer.png'
}

update = () => {
    draw()

    requestAnimationFrame(update)
}

draw = () => {
    ctx.fillStyle = "lightblue"
    ctx.fillRect(0, 0, WIDTH, HEIGHT / 2)
    ctx.fillStyle = "green"
    ctx.fillRect(0, HEIGHT / 2, WIDTH, HEIGHT / 4)
    ctx.fillStyle = "black"
    ctx.fillRect(0, (HEIGHT / 2) + (HEIGHT / 4), WIDTH, HEIGHT / 4)

    ctx.drawImage(carImage, car.x - 128, car.y - 128)
    ctx.drawImage(radioImage, WIDTH / 3, HEIGHT - (HEIGHT / 4.5))
    ctx.drawImage(speedometerImage, 0, HEIGHT - 256, 256, 256)
    

    ctx.fillStyle = "white"
    ctx.font = "16px Arial"
    ctx.fillText("PLACES", 266, HEIGHT - (HEIGHT / 5.5))
    ctx.font = "30px Arial"
    ctx.fillText(car.places.length + "/" + car.totalPlaces, 274, HEIGHT - (HEIGHT / 7))
    //ctx.fillStyle = car.color
    //ctx.fillRect(car.x - (car.w / 2), car.y, car.w, car.h)
}

init()