const People = (function(){
    const namesPool = ['Dessarion','Elon Musk','Joel (Troy Baker)']; 
    
    let closingBtns
    let namesList

    function init(){
        cacheDom();
        render();
        bindEvent();
    };

    function deleteName(id){
        if(id || id === 0){
            namesPool.splice(id,1)
         } 
    };

    function setName(name) {
        if (name) {
            namesPool.push(name)
        }
    };

    function cacheDom(){
        closingBtns = document.getElementsByClassName('closingBtn')
        namesList = document.getElementById('list')
    };

    function render(){
        let names = namesPool;
        list.innerHTML = '';
        if(names.length >= 0){
            for(let i = 0; i < names.length; i++){
                let cell = document.createElement('li');
                cell.innerHTML = `${names[i]}<span class="closingBtn"> x</span>`
                cell.className = 'cell';
                namesList.append(cell);                
            }
        } 
    };
    
    function bindEvent(){
        setButton.onclick = () => { //(setButton = window.setButton) triggering w/o variable
            setName(setNames.value); // also triggering setNames using window.setNames
            render(); 
            init();
            setNames.value = ''  
        };
        for (let i = 0; i < closingBtns.length; i++) {
            closingBtns[i].addEventListener('click', () => {
                deleteName(i);
                render();
                init()
            });
        } 
    };

    return {
        initiation:init,
    };
})();
People.initiation();