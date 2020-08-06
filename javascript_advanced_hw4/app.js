const data = [
    { name: 'Angular', url: 'https://angular.io/' },
    { name: 'Material Icons', url: 'https://material.io/' },
    [
        { name: 'Git hub', url: 'https://github.com/' },
        { name: 'Bit bucket', url: 'https://bitbucket.org/' },
        [
            { name: 'Code Wars', url: 'https://www.codewars.com/' },
            [
                { name: 'Fractal', url: 'https://www.fractal-design.com/' },
                [
                    {name: 'Deep Sciense', url: 'https://deepscience.ltd/'}

                ]
            ],
                
        ]
    ],
    { name: 'Google', url: 'https://www.google.com/' },
    [
        { name: 'Samsung', url: 'https://www.samsung.com/' },
        [
            {
                name: 'Space X', url: 'https://www.spacex.com/'
            }
        ],
        { name: 'Apple', url: 'https://www.apple.com/' }
    ],
]

// Task 

//Basic functions

function hideShow($el){
    $el.classList.toggle('hidden')
}

function trim(str){
      
    return str.slice(8,-1)
}

// Recursive rendering

const $init = document.querySelector('.init')

let $root = ''

function recursion(arr) {
    $root += `<span class="material-icons" tabindex=0 data-cl="cluster">library_add</span>
                <div class="cluster hidden">`
    arr.forEach(element => {
        if (Array.isArray(element)) {
            recursion(element)
        } else {
            $root += `<div class="name">
                           <h3>${element.name}</h3>
                           <a href="${element.url}">${trim(element.url)}</a>
                      </div>`
        }
    });
    $root += '</div>'
}
recursion(data)
$init.innerHTML = $root
const focusOn = document.querySelector('span:nth-of-type(1)')
focusOn.focus()

// Events 

function events(){
    $init.addEventListener('click', (e) => {
        if(e.target.dataset.cl === 'cluster'){
            let cluster = e.target.nextElementSibling
            hideShow(cluster) 
        }
            
    })

    window.addEventListener('keyup', (event)=> {
        if(event.key === 'Enter'){
            hideShow(event.target.nextElementSibling)
        }       
    })
}
events()
