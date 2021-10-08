// For strings, arrays, objects, booleans, etc. use "_([1,2,3,4])"
function _(selector) {
  const self = {
    item: selector,
    // Easily reverse a string
    reverseString: ()=> {
        let reversed = self.item.split('').reverse().join('').toString();
        return reversed;
    },
    // Remove repeating elements in an array
    // Syntax: _().removeRepeats([1,2,3,3,4])
    removeRepeats: ()=> {
      let newArray = Array.from(new Set(self.item));
      return newArray;
    },
    // Sort an array
    // Syntax: _().sortArray([4,3,2,5,1])
    sortArray: ()=> {
      let sortedArray = self.item.sort((a, b)=> {return a - b})
      return sortedArray;
    },
    // Easily get the type of an element
    type: ()=> {
      return typeof self.item
    },
    // Quick for loop
    // Syntax: _(array).for(function(i))
    forEach: (func)=> {
      for (let i = 0; i < self.item.length; i++){
        func(i);
      }
    },
    for: (func)=> {
      for (let i = 0; i < self.item; i++){
        func(i);
      }
    },
    // Find a single random character in an array or string
    randomChar: ()=> {
        let rndm = Math.floor(Math.random() * self.item.length);
        return self.item[rndm];
    },
    // Easily push to localStorage, automatically stringify
    // Syntax: _(item).toLocalStorage('key')
    toLocalStorage: (key)=>{
      localStorage.setItem(key, JSON.stringify(self.item));
    },
    // Easily pull from localStorage, automatically parse
    // Syntax: _().getLocalStorage('key)
    getLocalStorage: (key)=>{
      return JSON.parse(localStorage.getItem(key));
    },
    // Check if one value is equal to another
    // Syntax: _(value1).isEqualTo(value2)
    isEqualTo: (value)=>{
      if (self.item === value){
        return true;
      } else if (self.item == value){
        return 'Equal in value, but not type.';
      } else {
        return false;
      }
    },
  }
  return self;
}

// For elements, use "e('h1')"
function e(myElement){
  const self = {
    element: document.querySelector(myElement),
    // Show HTML element
    html: ()=> self.element,
    // display: none
    hide: ()=> self.element.style.display = 'none',
    // display: block
    show: ()=> self.element.style.display = 'block',
    // display: flex
    showFlex: ()=> self.element.style.display = 'flex',
    showInline: ()=> self.element.style.display = 'inline-block',
    // Syntax: e(selector).setAttributes({'href': 'https://google.com, 'title': 'good picture'})
    setAttributes: (attributes)=> {
      for(let key in attributes) {
        self.element.setAttribute(key, attributes[key]);
      }
    },
    // Clear content of a container
    clear: ()=> {
      self.element.innerHTML = '';
      self.element.textContent = '';
      self.element.value = '';
    },
    // Easily set the ID of an element
    // Syntax: e(selector).setId('someID')
    setId: (id)=> self.element.setAttribute('id', id),
    dynamicTextArea: function(){
      function autoExpand (area) {
        area.style.height = 'inherit';
        let compStyle = window.getComputedStyle(area);
        let height = parseFloat(compStyle.paddingTop) + field.scrollHeight + parseFloat(compStyle.paddingBottom);
        area.style.height = `${height}px`;
      }
      self.element.addEventListener('input', function (e) {
        if (e.target.tagName.toLowerCase() !== 'textarea') return;
        autoExpand(e.target);
      }, false);
    },
  }
  return self;
};

//quickFetch Syntax: quickFetch(url, function(data))
function quickFetch(url, func, param){
  fetch(url)
    .then(function(response){
      if (response.status !== 200){
        console.log('There was an error with your fetch. Response was not 200.')
      }
      return response.json()
    })
    .then(function(data){
      param = data;
      func(param)
    })
};