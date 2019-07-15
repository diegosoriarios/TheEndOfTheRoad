const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

let enemies = []
let obstacles = []
let loop
let positionsX = [
    [50],
    [WIDTH / 2 - 25],
    [WIDTH - 100]
]

let positionsY = [
    [50],
    [HEIGHT / 2 - 25],
    [HEIGHT - 100]
]

const player = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    w: WIDTH / 10,
    h: WIDTH / 10,
    speed: 8,
    color: 'white',
    face: 'R',
    bullets: [],
    limitShot: 3,
    hp: 3
}

const enemy1 = () => {
    return {
        //x: Math.floor(Math.random() * (WIDTH - (WIDTH / 12))),
        //y: Math.floor(Math.random() * (HEIGHT - (HEIGHT / 10))),
        x: parseInt(positionsX[Math.floor(Math.random() * positionsX.length)]),
        y: parseInt(positionsY[Math.floor(Math.random() * positionsY.length)]),
        w: WIDTH / 24,
        h: WIDTH / 24,
        speed: 2,
        color: 'green',
        hp: 3,
        level: 1
    }
}

const enemy2 = () => {
    return {
        x: parseInt(positionsX[Math.floor(Math.random() * positionsX.length)]),
        y: parseInt(positionsY[Math.floor(Math.random() * positionsY.length)]),
        w: WIDTH / 24,
        h: WIDTH / 24,
        speed: 3,
        color: 'blue',
        hp: 3,
        level: 2,
    }
}

const enemy3 = () => {
    return {
        x: parseInt(positionsX[Math.floor(Math.random() * positionsX.length)]),
        y: parseInt(positionsY[Math.floor(Math.random() * positionsY.length)]),
        w: WIDTH / 24,
        h: WIDTH / 24,
        speed: 3,
        color: 'brown',
        hp: 3,
        level: 3,
    }
}

const enemy4 = () => {
    return {
        x: parseInt(positionsX[Math.floor(Math.random() * positionsX.length)]),
        y: parseInt(positionsY[Math.floor(Math.random() * positionsY.length)]),
        w: WIDTH / 24,
        h: WIDTH / 24,
        speed: 3,
        color: 'yellow',
        hp: 3,
        level: 4,
        movements: 60,
        direction: 'D'
    }
}

const bullet = (x, y, w, h, direction) => {
    return {
        x: x,
        y: y,
        w: w,
        h: h,
        color: 'red',
        speed: 10,
        direction: direction
    }
}


let left = false
let right = false
let up = false
let down = false

init = () => {
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    generateMap()
    update()
}

update = () => {
    if(player.hp === 0) {
        gameOver()
    } else {
        draw()        

        if(left && player.x > 25) {
            player.x -= player.speed
        } else if(right && player.x + player.w < WIDTH - 25) {
            player.x += player.speed
        }
        if(up && player.y > 25) {
            player.y -= player.speed
        } else if(down && player.y + player.h < HEIGHT - 25) {
            player.y += player.speed
        }        

        player.bullets.forEach(bullet => {    
            if(!isOutOfScreen(bullet)){
                switch(bullet.direction) {
                    case 'U':
                        bullet.y -= bullet.speed
                        break
                    case 'D':
                        bullet.y += bullet.speed
                        break
                    case 'L':
                        bullet.x -= bullet.speed
                        break
                    case 'R':
                        bullet.x += bullet.speed
                        break
                }

                enemies.forEach(enemy => {
                    if(checkColision(bullet, enemy)) {
                            enemy.hp--
                            player.bullets.splice(player.bullets.indexOf(bullet), 1)
                        }
                })

                obstacles.forEach(obstacle => {
                    if(checkColision(bullet, obstacle)) {
                        player.bullets.splice(player.bullets.indexOf(bullet), 1)
                    }
                })
            } else {
                player.bullets.splice(player.bullets.indexOf(bullet), 1)
            }
        })


        enemies.forEach(enemy => {
            if(enemy.hp === 0) {
                enemies.splice(enemies.indexOf(enemy), 1)
            }

            /**
             * Follow the player
             */
            if(enemy.level === 1){
                if(enemy.x + (enemy.w / 2) > player.x + (player.w / 2)) {
                    enemy.x -= enemy.speed
                } else if (enemy.x + (enemy.w / 2) < player.x + (player.w / 2)) {
                    enemy.x += enemy.speed
                }
            
                if(enemy.y + (enemy.h / 2) > player.y + (player.h / 2)) {
                    enemy.y -= enemy.speed
                } else if (enemy.y + (enemy.h / 2) > player.y + (player.h / 2)) {
                    enemy.y += enemy.speed
                }
            }
            /**
             * V Move
             */
            else if(enemy.level === 2) {
                let vSpeed = enemy.speed

                enemy.y += vSpeed

                if(isOutOfScreen(enemy)) {
                    enemy.speed = -enemy.speed
                }
            }

            /**
             * H Move
             */
            else if(enemy.level === 3) {
                let vSpeed = enemy.speed

                enemy.x += vSpeed

                if(isOutOfScreen(enemy)) {
                    enemy.speed = -enemy.speed
                }
            }

            else if(enemy.level === 4) {
                let directions = ['U', 'D', 'L', 'R']
                if(enemy.direction === 'U' && enemy.y > 25){
                    enemy.y -=enemy.speed
                } else if(enemy.direction === 'D' && enemy.y + enemy.h < HEIGHT - 25){
                    enemy.y +=enemy.speed
                } else if(enemy.direction === 'R' && enemy.x + enemy.w < WIDTH - 25){
                    enemy.x +=enemy.speed
                } else if(enemy.direction === 'L' && enemy.x > 25){
                    enemy.x -=enemy.speed
                }

                enemy.movements--
                if(enemy.movements <= 0) {
                    enemy.movements = 60
                    enemy.direction = directions[Math.floor(Math.random() * directions.length)]
                }
            }

            

            if(checkColision(enemy, player)) {
                player.hp--
                switch(enemy.level) {
                    case 1:
                        break;
                    case 2:
                        if(enemy.y > player.y){
                            enemy.y += Math.floor(Math.random() * 256 + 128)    
                        } else if(enemy.y < player.y + player.h){
                            enemy.y -= Math.floor(Math.random() * 256 + 128)
                        }
                        break;
                    case 3:
                        if(enemy.x > player.x + player.w) {
                            enemy.x -= Math.floor(Math.random() * 256 + 128)
                        } else {
                            enemy.x += Math.floor(Math.random() * 256 + 128)
                        }
                    case 4:
                        if(enemy.x > WIDTH / 2) {
                            enemy.x -= Math.floor(Math.random() * 256 + 128)
                        } else {
                            enemy.x += Math.floor(Math.random() * 256 + 128)
                        }

                        if(enemy.y > HEIGHT / 2) {
                            enemy.y -= Math.floor(Math.random() * 256 + 128)
                        } else {
                            enemy.y += Math.floor(Math.random() * 256 + 128)
                        }
                }
            }

            obstacles.forEach(obstacle => {
                if(checkColision(enemy, obstacle)) {
                    if(enemy.level !== 1) {
                        enemy.speed = -enemy.speed
                    } else if(enemy.level === 4) {

                    }
                }
            })
        })


        loop = requestAnimationFrame(update)
    }

}

draw = () => {
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = player.color
    ctx.fillRect(player.x, player.y, player.w, player.h)

    player.bullets.forEach(bullet => {
        ctx.fillStyle = bullet.color
        ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet. h)
    })

    obstacles.forEach(obstacle => {
        ctx.fillStyle = obstacle.color
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h)
    })
    
    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
    })

    
    for(let i = 0; i < player.hp; i++){
        ctx.fillStyle = 'white'
        ctx.font = '30px Arial'
        ctx.fillText("<3", 40 + (40 * i), 40)
    }
}

generateMap = () => {
    for(let i = 0; i < Math.floor(Math.random() * 5 + 2); i++) {
        let enemy
        /*switch(Math.floor(Math.random() * 4)){
            case 0:
                enemy = enemy1()
                break
            case 1:
                enemy = enemy2()
                break
            case 2:
                enemy = enemy3()
                break
            case 3:
                enemy = enemy4()
            default:
                enemy = enemy2()
        }*/
        enemy = enemy4()
        enemies.push(enemy)
    }

    for(let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
        let obstacle = {
            x: Math.floor(Math.random() * (WIDTH - 32)),
            y: Math.floor(Math.random() * (HEIGHT - 32)),
            w: WIDTH / 24,
            h: WIDTH / 24,
            color: 'grey'
        }
        obstacles.push(obstacle)
    }

    if(Math.random() > .5) {
        let obstacle = {
            x: 0,
            y: 0,
            w: 25,
            h: HEIGHT / 2 - (player.h / 1.5),
            color: 'grey'
        }

        obstacles.push(obstacle)

        let obstacle2 = {
            x: 0,
            y: HEIGHT / 2 + (player.h / 1.5),
            w: 25,
            h: HEIGHT / 2 - (player.h / 1.5),
            color: 'grey'
        }

        let obstacle3 = {
            x: 0,
            y: 0,
            w: WIDTH,
            h: 25,
            color: 'grey'
        }
        
        obstacles.push(obstacle2)
        obstacles.push(obstacle3)
    } else {
        let obstacle = {
            x: 0,
            y: 0,
            w: WIDTH / 2 - (player.w / 1.5),
            h: 25,
            color: 'grey'
        }

        let obstacle2 = {
            x: WIDTH / 2 + (player.w / 1.5),
            y: 0,
            w: WIDTH / 2 - (player.w / 1.5),
            h: 25,
            color: 'grey'
        }

        let obstacle3 = {
            x: 0,
            y: 0,
            w: 25,
            h: HEIGHT,
            color: 'grey'   
        }
        
        obstacles.push(obstacle)
        obstacles.push(obstacle2)
        obstacles.push(obstacle3)
    }

    let obstacle3 = {
        x: WIDTH - 25,
        y: 0,
        w: 25,
        h: HEIGHT,
        color: 'grey'
    }

    let obstacle4 = {
        x: 0,
        y: HEIGHT - 25,
        w: WIDTH,
        h: 25,
        color: 'grey'
    }
    obstacles.push(obstacle3)
    obstacles.push(obstacle4)
}

gameOver = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = 'white'
    ctx.font = '30px Arial'
    ctx.fillText("Game Over", (WIDTH / 2) - 60, HEIGHT / 2)
    requestAnimationFrame(gameOver)
}

onKeyDown = e => {
    switch(e.keyCode) {
        case 87 || 38:
            up = true
            player.face = 'U'
            break
        case 83 || 40:
            down = true
            player.face = 'D'
            break
        case 65 || 37:
            left = true
            player.face = 'L'
            break
        case 68 || 39:
            right = true
            player.face = 'R'
            break
        case 32:
            let newBullet = bullet( player.x + (player.w / 2), 
                                    player.y + (player.h / 2), 
                                    player.w / 10, 
                                    player.w / 10, 
                                    player.face )
            if(player.bullets.length < player.limitShot) {
                player.bullets.push(newBullet)
            }
    }
}

onKeyUp = e => {
    switch(e.keyCode) {
        case 87 || 38:
            up = false
            break
        case 83 || 40:
            down = false
            break
        case 65 || 37:
            left = false
            break
        case 68 || 39:
            right = false
    }
}

checkColision = (obj1, obj2) => {
    if( obj1.x < obj2.x + obj2.w &&
        obj1.x + obj1.w > obj2.x &&
        obj1.y < obj2.y + obj2.h &&
        obj1.y + obj1.h > obj2.y) {
            return true
        }
    return false
}

isOutOfScreen = object => {
    if( object.x + object.w < WIDTH &&
        object.x > 0 &&
        object.y + object.h < HEIGHT &&
        object.y > 0 ) { return false }
    return true
}

init()