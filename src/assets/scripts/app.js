import { gsap } from 'gsap';
import Plane from './module/mesh'
import Stage from './module/stage'
import GlElments from './module/gl-elements'

const body = document.querySelector('body');
const list = document.querySelector('.list');
const items = document.querySelectorAll('.item');
const deviceRatio = window.innerWidth > 767 ? 1.0 : 2.0
const meshList = [];
const stage = new Stage()
stage.init()
const glElements = new GlElments(items);
glElements.init()

let isDown = false;
let keyStrength = 0;

const array = [];

for (let i = 0; i < items.length; i++) {
    array.push({
        item: items[i],
        extra: {
            x: 0,
            y: 0
        },
    })
    meshList.push(
        new Plane(stage, glElements.optionList[i])
    )
    meshList[i].init()
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
    x.distance = (x.start - x.end) * deviceRatio
    y.distance = (y.start - y.end) * deviceRatio
    // 目標位置 = down後に動いた移動量 + 過去の移動量
    x.target = x.distance + x.scroll
    y.target = y.distance + y.scroll + x.distance

}

const onTouchUp = () => {
    isDown = false
    console.log('up')

    body.style.cursor = 'auto'
    list.style.pointerEvents = 'auto'

    x.mouse += x.distance
    y.mouse += y.distance + x.distance
}

const onMouseWheel = (e) => {
    e.preventDefault()

    x.wheel += e.deltaX
    y.wheel += e.deltaY + (e.deltaX * 0.5)

    // 全てのイベントの総移動量から目標位置を計算
    x.target = x.wheel + x.mouse + x.key
    y.target = y.wheel + y.mouse + y.key

    console.log(x.direction)
    console.log(y.direction)
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
}

const onKeyUp = () => {
    console.log('up')

    keyStrength = 0;
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
        x.direction = 'left'
    } else if (x.save > x.current) {
        x.direction = 'right'
    }

    if (y.save < y.current) {
        y.direction = 'top'
    } else if (y.save > y.current) {
        y.direction = 'bottom'
    }

    x.save = x.current;
    y.save = y.current;

    for (let i = 0; i < array.length; i++) {
        const rect = array[i].item.getBoundingClientRect()

        // windowの画面外に行った時に、wrapper要素の横幅分ずらしていく
        if (i % 4 - 1 === 0 || i % 4 - 1 === 2) {
            if (x.direction === 'left' && rect.left < -rect.width) {
                console.log('画面外')
                array[i].extra.x += list.clientWidth
            } else if (x.direction === 'right' && window.innerWidth < rect.left) {
                console.log('画面外')
                array[i].extra.x += -list.clientWidth
            }

            if (y.direction === 'top' && window.innerHeight < rect.top) {
                console.log('画面外')
                array[i].extra.y += -list.clientHeight
            } else if (y.direction === 'bottom' && rect.top < -rect.height) {
                console.log('画面外')
                array[i].extra.y += list.clientHeight
            }
        } else {
            if (x.direction === 'left' && rect.left < -rect.width) {
                console.log('画面外')
                array[i].extra.x += list.clientWidth
            } else if (x.direction === 'right' && window.innerWidth < rect.left) {
                console.log('画面外')
                array[i].extra.x += -list.clientWidth
            }

            if (y.direction === 'bottom' && window.innerHeight < rect.top) {
                console.log('画面外')
                array[i].extra.y += -list.clientHeight
            } else if (y.direction === 'top' && rect.top < -rect.height) {
                console.log('画面外')
                array[i].extra.y += list.clientHeight
            }
        }

        let finalX = 0
        let finalY = 0

        finalX = -x.current + array[i].extra.x
        finalY = -y.current + array[i].extra.y


        if (i % 4 - 1 === 0 || i % 4 - 1 === 2) {
            finalX = (-x.current + array[i].extra.x)
            finalY = -(-y.current - array[i].extra.y)
        }

        array[i].item.style.transform = `translate(${finalX}px, ${finalY}px)`
    }

    stage.onRaf()
    glElements._updateOptionList()
    for (let i = 0; i < array.length; i++) {
        const strength = ((y.current - y.target)) * 0.10
        if (i % 4 - 1 === 0 || i % 4 - 1 === 2) {
            meshList[i]._setStrength(strength)
        }
        else{
            meshList[i]._setStrength(-strength)
        }
        meshList[i].onRaf()
    }
};

const onResize = () => {
    console.log('resize')

    x.current = 0
    y.current = 0
    x.wheel = 0
    y.wheel = 0
    x.allDistance = 0
    y.allDistance = 0
    x.save = 0
    y.save = 0
    x.target = 0
    y.target = 0

    for (let i = 0; i < array.length; i++) {
        array[i].extra.x = 0
        array[i].extra.y = 0
    }

    stage.onResize()
    for (let i = 0; i < array.length; i++) {
        meshList[i].onResize()
    }
}

window.addEventListener('keydown', onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.addEventListener('mousedown', onTouchDown)
window.addEventListener('mousemove', onTouchMove)
window.addEventListener('mouseup', onTouchUp)
window.addEventListener('touchstart', onTouchDown)
window.addEventListener('touchmove', onTouchMove)
window.addEventListener('touchend', onTouchUp)
window.addEventListener('wheel', onMouseWheel, { passive: false})
window.addEventListener('resize', onResize)
gsap.ticker.fps(60);
gsap.ticker.add(raf);