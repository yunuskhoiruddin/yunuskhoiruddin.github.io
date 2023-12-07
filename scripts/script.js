const popup = document.querySelector('.popup')
document.querySelectorAll('#experience > div > a').forEach(item => item.addEventListener('click', () => {
    document.body.style.overflow = 'hidden'
    popup.style.display = 'block'
    popup.querySelector('h2').innerHTML = item.querySelector('b').textContent
    setTimeout(() => {
        popup.style.opacity = 1
        document.querySelector('.close').addEventListener('click', () => {
            popup.style.opacity = 0
            setTimeout(() => {
                popup.setAttribute('style','')
                popup.querySelector('h2').innerHTML = '-'
            }, 400)
            document.body.style.overflow = 'auto'
            document.querySelector('.close').removeEventListener('click', () => {})
        })
    }, 1)
}))