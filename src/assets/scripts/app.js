import { gsap } from 'gsap';

const body = document.querySelector('body');
const wheelEl = document.querySelector('.wheel');
const keyEl = document.querySelector('.key');
const mouseEl = document.querySelector('.mouseMove');
const mouseStartEl = document.querySelector('.mouseStart');
const mouseEndEl = document.querySelector('.mouseEnd');
const mouseDistanceEl = document.querySelector('.mouseDistance');
const scrollEl = document.querySelector('.scroll');
const list = document.querySelector('.list');
const items = document.querySelectorAll('.item');
const wheelX = document.querySelector('.wheelX');
const wheelY = document.querySelector('.wheelY');
const keyX = document.querySelector('.keyX');
const keyY = document.querySelector('.keyY');
const startX = document.querySelector('.startX');
const startY = document.querySelector('.startY');
const endX = document.querySelector('.endX');
const endY = document.querySelector('.endY');
const allDistanceX = document.querySelector('.allDistanceX');
const allDistanceY = document.querySelector('.allDistanceY');
const distanceX = document.querySelector('.distanceX');
const distanceY = document.querySelector('.distanceY');
const scrollX = document.querySelector('.scrollX');
const scrollY = document.querySelector('.scrollY');
const targetX = document.querySelector('.targetX');
const targetY = document.querySelector('.targetY');
const currentX = document.querySelector('.currentX');
const currentY = document.querySelector('.currentY');

let isDown = false;
let keyStrength = 0;
let timeoutId = null;

const array = [];

for (let i = 0; i < items.length; i++) {
    array.push({
        item: items[i],
        extra: {
            x: 0,
            y: 0
        },
    })
}

const x = {
    start: 0,
    end: 0,
    distance: 0,
    mouse: 0,
    current: 0,
    target: 0,
    scroll: 0,
    save: 0,
    wheel: 0,
    key: 0,
    direction: 0,
}

const y = {
    start: 0,
    end: 0,
    distance: 0,
    mouse: 0,
    current: 0,
    target: 0,
    scroll: 0,
    save: 0,
    wheel: 0,
    key: 0,
    direction: 0,
}

const lerp = 0.1

const onTouchDown = (e) => {
    isDown = true
    console.log('down')

    // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐
    x.start = e.touches ? e.touches[0].clientX : e.clientX
    y.start = e.touches ? e.touches[0].clientY : e.clientY

    // 過去の移動量を取得しておく
    x.scroll = x.save;
    y.scroll = y.save;

    mouseStartEl.style.color = 'red'
    mouseEndEl.style.color = 'red'
    mouseDistanceEl.style.color = 'red'
    scrollEl.style.color = 'red'
}

const onTouchMove = (e) => {
    // downしていない時は処理を返す
    if (!isDown) return
    console.log('move')

    body.style.cursor = 'grabbing'
    list.style.pointerEvents = 'none'

    // マウスとタッチイベントでスタート位置の取得の方法が違うので条件分岐
    x.end = e.touches ? e.touches[0].clientX : e.clientX
    y.end = e.touches ? e.touches[0].clientY : e.clientY
    // down後に動いた移動量を取得
    x.distance = (x.start - x.end)
    y.distance = (y.start - y.end)
    // 目標位置 = down後に動いた移動量 + 過去の移動量
    x.target = x.distance + x.scroll
    y.target = y.distance + y.scroll

}

const onTouchUp = () => {
    isDown = false
    console.log('up')

    body.style.cursor = 'auto'
    list.style.pointerEvents = 'auto'

    x.mouse += x.distance
    y.mouse += y.distance

    mouseStartEl.style.color = ''
    mouseEndEl.style.color = ''
    mouseDistanceEl.style.color = ''
    scrollEl.style.color = ''
}

const onMouseWheel = (e) => {
    e.preventDefault()

    x.wheel += e.deltaX
    y.wheel += e.deltaY

    // 全てのイベントの総移動量から目標位置を計算
    x.target = x.wheel + x.mouse + x.key
    y.target = y.wheel + y.mouse + y.key

    wheelEl.style.color = 'red'
    keyEl.style.color = 'red'
    mouseEl.style.color = 'red'

    console.log(x.direction)
    console.log(y.direction)

    // スクロールを停止して0.1s後に処理を実行
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
        wheelEl.style.color = ''
        keyEl.style.color = ''
        mouseEl.style.color = ''
    }, 100);
}

const onKeyDown = (e) => {
    console.log('down')

    if (keyStrength < 140) keyStrength += 12.0

    if (e.key === 'ArrowDown') {
        y.key += keyStrength
    }
    if (e.key === 'ArrowUp') {
        y.key += -keyStrength
    }
    if (e.key === 'ArrowRight') {
        x.key += keyStrength
    }
    if (e.key === 'ArrowLeft') {
        x.key += -keyStrength
    }

    // 全てのイベントの総移動量から目標位置を計算
    x.target = x.key + x.wheel + x.mouse
    y.target = y.key + y.wheel + y.mouse

    wheelEl.style.color = 'red'
    keyEl.style.color = 'red'
    mouseEl.style.color = 'red'
}

const onKeyUp = () => {
    console.log('up')

    keyStrength = 0;

    wheelEl.style.color = ''
    keyEl.style.color = ''
    mouseEl.style.color = ''
}

const raf = () => {
    // 線形補完
    x.current = gsap.utils.interpolate(
        x.current,
        x.target,
        lerp
    )
    y.current = gsap.utils.interpolate(
        y.current,
        y.target,
        lerp
    )

    // 移動方向を取得
    if (x.save < x.current) {
        x.direction = 'right'
    } else if (x.save > x.current) {
        x.direction = 'left'
    }

    if (y.save < y.current) {
        y.direction = 'bottom'
    } else if (y.save > y.current) {
        y.direction = 'top'
    }

    x.save = x.current;
    y.save = y.current;

    for (let i = 0; i < array.length; i++) {
        const rect = array[i].item.getBoundingClientRect()

        // windowの画面外に行った時に、wrapper要素の横幅分ずらしていく
        if (x.direction === 'right' && rect.left < -rect.width) {
            console.log('画面外')
            array[i].extra.x += list.clientWidth
        }
        else if (x.direction === 'left' && window.innerWidth < rect.left) {
            console.log('画面外')
            array[i].extra.x += -list.clientWidth
        }

        if (y.direction === 'top' && window.innerHeight < rect.top) {
            console.log('画面外')
            array[i].extra.y += -list.clientHeight
        }
        else if (y.direction === 'bottom' && rect.top < -rect.height) {
            console.log('画面外')
            array[i].extra.y += list.clientHeight
        }

        const finalX = -x.current + array[i].extra.x
        const finalY = -y.current + array[i].extra.y

        array[i].item.style.transform = `translate(${finalX}px, ${finalY}px)`
    }

    wheelX.textContent = x.wheel
    wheelY.textContent = y.wheel
    keyX.textContent = x.key
    keyY.textContent = y.key
    startX.textContent = x.start
    startY.textContent = y.start
    endX.textContent = x.end
    endY.textContent = y.end
    allDistanceX.textContent = x.mouse
    allDistanceY.textContent = y.mouse
    distanceX.textContent = x.distance
    distanceY.textContent = y.distance
    scrollX.textContent = x.scroll
    scrollY.textContent = y.scroll
    targetX.textContent = x.target
    targetY.textContent = y.target
    currentX.textContent = x.current
    currentY.textContent = y.current
};

window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.addEventListener('mousedown', onTouchDown)
window.addEventListener('mousemove', onTouchMove)
window.addEventListener('mouseup', onTouchUp)
window.addEventListener('touchstart', onTouchDown)
window.addEventListener('touchmove', onTouchMove)
window.addEventListener('touchend', onTouchUp)
window.addEventListener('wheel', onMouseWheel, {
    passive: false
})
gsap.ticker.fps(60);
gsap.ticker.add(raf);