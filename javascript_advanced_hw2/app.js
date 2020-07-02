class Human {    
    constructor(name, age, nationality) {
        this.name = name
        this.age = age
        this.nationality = nationality
    }

    talk(message, to) {
        this.conversation.say(message, this, to)
    }

    receive(message, from) {
        console.log(`${from.name} says to ${this.name} : ${message}`);

    }

};

class Woman extends Human {
    constructor(name, age, nationality) {
        super(name, age, nationality)
        this.gender = 'female'
    }
};

class Man extends Human {
    constructor(name, age, nationality) {
        super(name, age, nationality)
        this.gender = 'male'
    }
};

class Librarian extends Woman {
    constructor(name, age, nationality,commandToWorker) {
        super(name, age, nationality)
        this.proffesion = 'librarian'
        this.commandToWorker = commandToWorker
        this.commandsToArchive = []
        this.animalsBase = []        
    }

    archive(command,target) {
        this.commandsToArchive.push(command)
        return this.commandToWorker[command](target)
    }

    addAnimal(animal){
        this.animalsBase.push(animal)
    }

    injuredAnimals(){
        this.animalsBase.forEach( animal => {
            if(animal.isInjured){
                console.log(`${animal.name} is injured and need to be healed!`);                
            }
        })
    }

    hungryAnimals(){
        this.animalsBase.forEach( animal => {
            if(animal.isHungry){
                console.log(`${animal.name} is hungry and need to be feeded!`);                
            }
        })
    }

    dayLog(){
        console.log(this.commandsToArchive);
        
    }

};

class Nurse extends Woman {
    constructor(name, age, nationality) {
        super(name, age, nationality)
        this.proffesion = 'nurse'
        this.animalsToInspect = []
    }

    addToInspectList(animal){
        this.animalsToInspect.push(animal)
    }

    removeFromInspectList(animal){
        this.animalsToInspect = this.animalsToInspect.filter( anml => anml !== animal)
    }

    heal() {
        this.animalsToInspect.forEach( anml => {
            anml.curing();
            console.log(`${anml.name} cured by ${this.name}, and feeling well.`);
            this.removeFromInspectList();            
        })
    }
};

class Hunter extends Man {
    constructor(name, age, nationality) {
        super(name, age, nationality)
        this.proffesion = 'hunter'
        this.animalsInCage = []        
    }

    inCageList(animal){
        this.animalsInCage.push(animal)
    }

    catch(animal) {
        this.animalsInCage = this.animalsInCage.filter( anml => anml !== animal)
        console.log(`${animal.name} now in cage.`);
        this.animalsInCage.forEach(anml => {
            anml.inCage = true
        })
        
    }

    release() {
        this.animalsInCage.forEach( anml => {
           anml.walk();
           console.log(`${anml.name} is walking around now.`);
           anml.isHungry = true;
           if(anml.haveWool){
                anml.isDirty = true;
                console.log(`${anml.name} will be dirty after after walking.`);                
           }            
        })
    }
};

class Worker extends Man {
    constructor(name, age, nationality) {
        super(name, age, nationality)
        this.proffesion = 'worker'
        this.animalsToFeed = []
        this.animalsToClean = []
    }

    addToFeedList(animal){
        this.animalsToFeed.push(animal)
    }

    addToCleaningList(animal){
        this.animalsToClean.push(animal)
    }

    removeFromFeedList(animal){
        this.animalsToFeed = this.animalsToFeed.filter( anml => anml !== animal)
    }

    removeFromCleaningList(animal){
        this.animalsToClean = this.animalsToClean.filter( anml => anml !== animal)
    }

    clean() {
        this.animalsToClean.forEach( anml => {
            anml.cleaning();
            console.log(`${anml.name} is clean now.`);
            
        })
    }

    feed() {
        this.animalsToFeed.forEach( anml => {
            let meal
            if(anml.animalType === 'Predator'){
                meal = 'meat'
            } else if(anml.animalType === 'Herbivorous'){
                meal = 'vegetables and fruits'
            }
            anml.feeding();
            console.log(`${anml.animalType} ${anml.name} eats ${meal}, he is not hungry any more.`);
            this.removeFromFeedList();            
        })
    }
};

class Conversation {
    constructor() {
        this.workers = {}
    }

    register(worker) {
        this.workers[worker.name] = worker;
        worker.conversation = this
    }

    say(message, from, to) {
        if (to) {
            to.receive(message, from)
        } else {
            Object.keys(this.workers).forEach(wrkr => {
                if (this.workers[wrkr] !== from) {
                    this.workers[wrkr].receive(message, from)
                }
            })
        }
    }
};

class Animal {
    constructor(name, age, haveWool, isInjured = false, isHungry = true ) {
        this.name = name
        this.age = age
        this.isInjured = isInjured
        this.isHungry = isHungry
        this.haveWool = haveWool
        this.inCage = true
        this.isDirty = false
    }

    walk(){
        this.inCage = false
    }

    curing(){
        this.isInjured = false
    }

    feeding(){
        this.isHungry = false
    }

    cleaning(){
        this.isDirty = false
    }
};

class Predator extends Animal {
    constructor(name, age, haveWool, isInjured, isHungry){
        super(name, age, haveWool, isInjured, isHungry)
        this.animalType = 'Predator'
    }
};

class Herbivorous extends Animal {
    constructor(name, age, haveWool, isInjured, isHungry){
        super(name, age, haveWool, isInjured, isHungry)
        this.animalType = 'Herbivorous'
    }
};

// initialization of Zoo iteration 

console.group('Zoo initialization. Part One "Morning"');

const tiger = new Predator('Boris',7,true,true);
const hippo = new Herbivorous('Bono',20,false);
const crocodile = new Predator('Genadiy',88,false,false,true);
const zebra = new Herbivorous('Bee',10,true);

const joel = new Hunter('Joel Miller', 52, 'American');
const abby = new Nurse('Abby', 30, 'American');
const lee = new Worker('Peter Lee', 62, 'Japanese');
const elly = new Librarian('Elly',27,'American',joel);

const conversation = new Conversation();
conversation.register(joel);
conversation.register(abby);
conversation.register(lee);
conversation.register(elly);

console.group('Inital states of all animals');
console.log(tiger);
console.log(hippo);
console.log(crocodile);
console.log(zebra);
console.groupEnd()

console.group('The morning meeting');
elly.talk('Good morning everyone, let me create a list for today!');
elly.addAnimal(tiger);
elly.addAnimal(hippo);
elly.addAnimal(crocodile);
elly.addAnimal(zebra);
elly.talk('Joel i gonna watch you all day and give your working log at the evening!',joel);
console.groupEnd()

abby.talk('Any injured animals for now?', elly)
elly.injuredAnimals()
abby.addToInspectList(tiger)
abby.heal();
lee.addToFeedList(tiger);
lee.addToFeedList(hippo);
lee.addToFeedList(crocodile);
lee.addToFeedList(zebra);
lee.feed();
console.groupEnd();

console.group('Part Two "Midday at Zoo"');
console.group('Midday meeting');
joel.talk('I gonna release animals, start logging me please!',elly);
elly.talk('Ok Joel!',joel);
joel.talk('Animals will be hungry after walking Peter!',lee);
lee.talk('Understood Joel!',joel);
console.groupEnd();

elly.archive('inCageList',tiger);
elly.archive('inCageList',hippo);
elly.archive('inCageList',crocodile);
elly.archive('inCageList',zebra);
elly.archive('release');
console.groupEnd();

console.group('Part Three "Evening at Zoo. Final"');

console.group('Evening meeting');
lee.talk('Who is dirty after walking Joel?', joel);
joel.talk('Boris and Bee are dirty!', lee);
console.groupEnd();
lee.addToCleaningList(tiger);
lee.addToCleaningList(zebra);
lee.clean();
lee.addToFeedList(tiger);
lee.addToFeedList(hippo);
lee.addToFeedList(crocodile);
lee.addToFeedList(zebra);
lee.feed();
elly.archive('catch',tiger);
elly.archive('catch',hippo);
elly.archive('catch',crocodile);
elly.archive('catch',zebra);

elly.talk('Thanks for everyone, see you all tomorow!');
elly.talk('Here is your day log Joel!');
elly.dayLog()
joel.talk('Thanks Elly',elly)
console.group('states of all animals after day');
console.log(tiger);
console.log(hippo);
console.log(crocodile);
console.log(zebra);
console.groupEnd();
console.groupEnd();