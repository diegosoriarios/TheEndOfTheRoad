const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

let enemies = []
let obstacles = []
let loop

const player = {
    x: WIDTH / 2,
    y: HEIGHT / 2,
    w: WIDTH / 10,
    h: HEIGHT / 6,
    speed: 8,
    color: 'white',
    face: 'R',
    bullets: [],
    limitShot: 3,
    hp: 3
}

const enemy1 = () => {
    return {
        x: Math.floor(Math.random() * (WIDTH - (WIDTH / 12))),
        y: Math.floor(Math.random() * (HEIGHT - (HEIGHT / 10))),
        w: WIDTH / 12,
        h: HEIGHT / 10,
        speed: 2,
        color: 'green',
        hp: 3,
        level: 1
    }
}

const enemy2 = () => {
    return {
        x: Math.floor(Math.random() * (WIDTH - (WIDTH / 12))),
        y: Math.floor(Math.random() * (HEIGHT - (HEIGHT / 10))),
        w: WIDTH / 12,
        h: HEIGHT / 10,
        speed: 3,
        color: 'blue',
        hp: 3,
        level: 2,
    }
}

const enemy3 = () => {
    return {
        x: Math.floor(Math.random() * (WIDTH - (WIDTH / 12))),
        y: Math.floor(Math.random() * (HEIGHT - (HEIGHT / 10))),
        w: WIDTH / 12,
        h: HEIGHT / 10,
        speed: 3,
        color: 'brown',
        hp: 3,
        level: 3,
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
                if(enemy.x > player.x) {
                    enemy.x -= enemy.speed
                } else if (enemy.x < player.x) {
                    enemy.x += enemy.speed
                }
            
                if(enemy.y > player.y) {
                    enemy.y -= enemy.speed
                } else if (enemy.y < player.y) {
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

            

            if(checkColision(enemy, player)) {
                player.hp--
                switch(enemy.level) {
                    case 1:
                        break;
                    case 2:
                        if(enemy.y > player.y){
                            enemy.y += Math.floor(Math.random() * 128 + 64)    
                        } else if(enemy.y < player.y + player.h){
                            enemy.y -= Math.floor(Math.random() * 128 + 64)
                        }
                        break;
                    case 3:
                        if(enemy.x > player.x + player.w) {
                            enemy.x -= Math.floor(Math.random() * 128 + 64)
                        } else {
                            enemy.x += Math.floor(Math.random() * 128 + 64)
                        }
                }
            }

            obstacles.forEach(obstacle => {
                if(checkColision(enemy, obstacle)) {
                    if(enemy.level !== 1) {
                        enemy.speed = -enemy.speed
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
    let map = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    for(let i = 0; i < 12; i++){
        for(let j = 0; j < 20; j++){
            if(map[i][j] === 1) {
                let obstacle = {
                    x: j * (WIDTH / 20),
                    y: i * (HEIGHT / 12),
                    w: WIDTH / 20,
                    h: HEIGHT / 12,
                    color: 'grey'
                }
                obstacles.push(obstacle)
            }
        }
    }

    /*
    for(let i = 0; i < Math.floor(Math.random() * 5 + 2); i++) {
        let enemy
        switch(Math.floor(Math.random() * 4)){
            case 0:
                enemy = enemy1()
                break
            case 1:
                enemy = enemy2()
                break
            case 2:
                enemy = enemy3()
                break
            default:
                enemy = enemy2()
        }
        enemies.push(enemy)
    }

    for(let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
        let obstacle = {
            x: Math.floor(Math.random() * (WIDTH - 32)),
            y: Math.floor(Math.random() * (HEIGHT - 32)),
            w: WIDTH / 12,
            h: HEIGHT / 12,
            color: 'grey'
        }
        obstacles.push(obstacle)
    }*/
}

gameOver = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)

    ctx.fillStyle = 'white'
    ctx.font = '30px Arial'
    ctx.fillText("Game Over", WIDTH / 2 - 15, HEIGHT / 2)
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