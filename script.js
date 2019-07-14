const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

let enemies = []

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
}

const enemy1 = () => {
    return {
        x: Math.floor(Math.random() * (WIDTH - (WIDTH / 12))),
        y: Math.floor(Math.random() * (HEIGHT - (HEIGHT / 10))),
        w: WIDTH / 12,
        h: HEIGHT / 10,
        speed: 2,
        color: 'green',
        hp: 3
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

    for(let i = 0; i < Math.random() * 5; i++) {
        let enemy = enemy1()
        enemies.push(enemy)
    }

    update()
}

update = () => {
    draw()

    if(left && player.x > 0) {
        player.x -= player.speed
    } else if(right && player.x + player.w < WIDTH) {
        player.x += player.speed
    }
    if(up && player.y > 0) {
        player.y -= player.speed
    } else if(down && player.y + player.h < HEIGHT) {
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
                if( bullet.x + bullet.w > enemy.x && 
                    bullet.x < enemy.x + enemy.w &&
                    bullet.y + bullet.h > enemy.y &&
                    bullet.y < enemy.y + enemy.h ) {
                        enemy.hp--
                        player.bullets.splice(player.bullets.indexOf(bullet), 1)
                        console.log(enemy.hp)
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
    })


    requestAnimationFrame(update)
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

    enemies.forEach(enemy => {
        ctx.fillStyle = enemy.color
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h)
    })
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

isOutOfScreen = object => {
    if( object.x + object.w < WIDTH &&
        object.x > 0 &&
        object.y + object.h < HEIGHT &&
        object.y > 0 ) { return false }
    return true
}

init()